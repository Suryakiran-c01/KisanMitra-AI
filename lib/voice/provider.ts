import { getLanguageConfig } from "@/lib/i18n/languages";

export interface SpeechRecognitionHandle {
  stop: () => void;
}

export interface SpeakResult {
  ok: boolean;
  reason?: "voice_unavailable" | "empty" | "unsupported";
}

export interface VoiceProvider {
  isSttSupported: () => boolean;
  startListening: (
    languageCode: string,
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (err: string) => void,
    onEnd: () => void,
    sttLocaleOverride?: string
  ) => SpeechRecognitionHandle | null;
  speak: (text: string, languageCode: string, onEnd?: () => void) => Promise<SpeakResult>;
  stopSpeaking: () => void;
}

type SpeechRecognitionConstructor = new () => {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const win = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
}

export function getSttLocaleCandidates(code: string, overrideLocale?: string): string[] {
  const cfg = getLanguageConfig(code);
  const candidates: string[] = [];
  if (overrideLocale) candidates.push(overrideLocale);
  candidates.push(cfg.speechLocale);

  const devanagariCodes = new Set(["mr", "ne", "mai", "kok", "doi", "brx", "sa"]);
  if (devanagariCodes.has(code)) {
    candidates.push("hi-IN");
  } else if (code === "as") {
    candidates.push("bn-IN");
  } else if (code === "or") {
    candidates.push("hi-IN");
  } else if (code === "ks" || code === "sd") {
    candidates.push("ur-IN", "hi-IN");
  } else if (code === "sat" || code === "mni") {
    candidates.push("hi-IN", "en-IN");
  }

  if (code !== "en") {
    candidates.push("en-IN");
  }

  return Array.from(new Set(candidates));
}

async function ensureVoicesLoaded(timeoutMs = 500): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  const existing = window.speechSynthesis.getVoices();
  if (existing.length > 0) return existing;

  return new Promise((resolve) => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      window.speechSynthesis.removeEventListener?.("voiceschanged", onChanged);
      resolve(window.speechSynthesis.getVoices());
    };
    const onChanged = () => done();
    window.speechSynthesis.addEventListener?.("voiceschanged", onChanged);
    setTimeout(done, timeoutMs);
  });
}

function findExactBrowserVoice(voices: SpeechSynthesisVoice[], speechLocale: string): SpeechSynthesisVoice | null {
  const targetLower = speechLocale.toLowerCase();
  const prefix = targetLower.split("-")[0];

  const exact = voices.find((v) => v.lang.toLowerCase() === targetLower);
  if (exact) return exact;

  const prefixMatch = voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
  return prefixMatch || null;
}

function splitIntoSpeechChunks(text: string, maxLen = 160): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];
  const sentences = clean.split(/(?<=[।.!?|])\s+/);
  const chunks: string[] = [];
  let current = "";

  for (const s of sentences) {
    if ((current + " " + s).trim().length <= maxLen) {
      current = (current + " " + s).trim();
    } else {
      if (current) chunks.push(current);
      if (s.length <= maxLen) {
        current = s;
      } else {
        const words = s.split(" ");
        let part = "";
        for (const w of words) {
          if ((part + " " + w).trim().length <= maxLen) {
            part = (part + " " + w).trim();
          } else {
            if (part) chunks.push(part);
            part = w;
          }
        }
        current = part;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function isBraveBrowser(): Promise<boolean> {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { brave?: { isBrave?: () => Promise<boolean> } };
  if (nav.brave && typeof nav.brave.isBrave === "function") {
    try {
      return await nav.brave.isBrave();
    } catch {
      return false;
    }
  }
  return false;
}

async function isBhashiniSttAvailable(): Promise<boolean> {
  try {
    const res = await fetch("/api/health");
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.bhashiniConfigured);
  } catch {
    return false;
  }
}

function formatSttError(errorCode: string, langNativeName: string, isBrave = false): string {
  switch (errorCode) {
    case "not-allowed":
    case "permission-denied":
      return "Microphone permission was denied. Please allow mic access in your browser address bar.";
    case "network":
      if (isBrave) {
        return "Brave blocks built-in voice-to-text for privacy. Open in Chrome or Edge for live mic input, configure Bhashini keys in .env.local, or tap the quick symptom buttons above.";
      }
      return "Voice-to-text requires Chrome/Edge with internet access (or Bhashini keys in .env.local). You can also tap the quick symptom buttons above.";
    case "service-not-allowed":
      return "Speech service is blocked in this browser. Open in Chrome/Edge or tap a quick symptom above.";
    case "language-not-supported":
      return `Browser voice input for ${langNativeName} is not supported here. Switch the mic language pill to हिन्दी or English, or tap symptoms above.`;
    case "no-speech":
      return "No speech detected. Tap the mic and speak clearly near your microphone.";
    case "audio-capture":
      return "No working microphone was found on this device.";
    default:
      return `Voice input error (${errorCode}). You can tap symptoms or type above.`;
  }
}

class HybridVoiceProvider implements VoiceProvider {
  private currentAudio: HTMLAudioElement | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private speakCancelled = false;

  isSttSupported(): boolean {
    if (typeof window === "undefined") return false;
    return Boolean(
      getSpeechRecognitionCtor() ||
        (typeof navigator !== "undefined" && typeof navigator.mediaDevices?.getUserMedia === "function")
    );
  }

  startListening(
    languageCode: string,
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (err: string) => void,
    onEnd: () => void,
    sttLocaleOverride?: string
  ): SpeechRecognitionHandle | null {
    const Ctor = getSpeechRecognitionCtor();
    const cfg = getLanguageConfig(languageCode);
    const locales = getSttLocaleCandidates(cfg.code, sttLocaleOverride);

    if (Ctor) {
      let stoppedManually = false;
      let activeRecognition: InstanceType<SpeechRecognitionConstructor> | null = null;
      let fellBackToRecorder = false;
      let localeIndex = 0;

      const startWebSpeech = () => {
        const locale = locales[localeIndex] || "en-IN";
        try {
          const recognition = new Ctor();
          activeRecognition = recognition;
          recognition.lang = locale;
          recognition.interimResults = true;
          recognition.continuous = false;
          recognition.maxAlternatives = 1;

          recognition.onresult = (event) => {
            const parts: string[] = [];
            let anyFinal = false;
            for (let i = 0; i < event.results.length; i++) {
              const res = event.results[i];
              const chunk = res[0]?.transcript?.trim();
              if (chunk) parts.push(chunk);
              if (res.isFinal) anyFinal = true;
            }
            if (parts.length > 0) {
              onResult(parts.join(" "), anyFinal);
            }
          };

          recognition.onerror = async (event) => {
            if (stoppedManually || event.error === "aborted") return;

            if (event.error === "language-not-supported" && localeIndex + 1 < locales.length) {
              localeIndex += 1;
              startWebSpeech();
              return;
            }

            if (
              (event.error === "service-not-allowed" || event.error === "network") &&
              typeof navigator !== "undefined" &&
              typeof navigator.mediaDevices?.getUserMedia === "function" &&
              (await isBhashiniSttAvailable())
            ) {
              fellBackToRecorder = true;
              this.startMediaRecorderFallback(languageCode, onResult, onError, onEnd);
              return;
            }

            const brave = await isBraveBrowser();
            onError(formatSttError(event.error || "speech_error", cfg.nativeName, brave));
          };

          recognition.onend = () => {
            if (!fellBackToRecorder) {
              onEnd();
            }
          };

          recognition.start();
        } catch {
          if (typeof navigator !== "undefined" && typeof navigator.mediaDevices?.getUserMedia === "function") {
            fellBackToRecorder = true;
            this.startMediaRecorderFallback(languageCode, onResult, onError, onEnd);
          } else {
            onError("Could not start microphone recognition.");
            onEnd();
          }
        }
      };

      startWebSpeech();

      return {
        stop: () => {
          stoppedManually = true;
          try {
            activeRecognition?.stop();
          } catch {
            // ignore
          }
          if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
            this.mediaRecorder.stop();
          }
        },
      };
    }

    if (typeof navigator !== "undefined" && typeof navigator.mediaDevices?.getUserMedia === "function") {
      return this.startMediaRecorderFallback(languageCode, onResult, onError, onEnd);
    }

    onError("Speech recognition is not supported on this device.");
    onEnd();
    return null;
  }

  private startMediaRecorderFallback(
    languageCode: string,
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ): SpeechRecognitionHandle {
    const chunks: BlobPart[] = [];
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        this.mediaRecorder = recorder;
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };
        recorder.onstop = async () => {
          stream.getTracks().forEach((t) => t.stop());
          try {
            const blob = new Blob(chunks, { type: "audio/webm" });
            const base64 = await blobToBase64(blob);
            const res = await fetch("/api/stt", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ audioBase64: base64, language: languageCode, mimeType: "audio/webm" }),
            });
            const data = await res.json();
            if (data.text) {
              onResult(data.text, true);
            } else {
              onError(
                data.error ||
                  "Voice recognition is unavailable in this browser. Open in Chrome/Edge or tap a quick symptom below."
              );
            }
          } catch {
            onError("Voice upload failed.");
          } finally {
            onEnd();
          }
        };
        recorder.start();
      })
      .catch(() => {
        onError("Microphone permission denied. Please allow mic access.");
        onEnd();
      });

    return {
      stop: () => {
        if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
          this.mediaRecorder.stop();
        }
      },
    };
  }

  async speak(text: string, languageCode: string, onEnd?: () => void): Promise<SpeakResult> {
    this.stopSpeaking();
    this.speakCancelled = false;

    if (!text.trim() || typeof window === "undefined") {
      onEnd?.();
      return { ok: false, reason: "empty" };
    }

    const cfg = getLanguageConfig(languageCode);

    // 1) Try native Web Speech Synthesis when an exact matching voice is installed
    if ("speechSynthesis" in window) {
      const voices = await ensureVoicesLoaded(500);
      const matchingVoice = findExactBrowserVoice(voices, cfg.speechLocale);

      if (matchingVoice) {
        const chunks = splitIntoSpeechChunks(text, 160);
        await new Promise((r) => setTimeout(r, 40));
        if (this.speakCancelled) {
          onEnd?.();
          return { ok: true };
        }

        window.speechSynthesis.resume();

        let spokeOk = true;
        for (const chunk of chunks) {
          if (this.speakCancelled) break;
          const ok = await new Promise<boolean>((resolve) => {
            const utterance = new SpeechSynthesisUtterance(chunk);
            utterance.lang = matchingVoice.lang;
            utterance.voice = matchingVoice;
            utterance.rate = 0.94;
            utterance.onend = () => resolve(true);
            utterance.onerror = () => resolve(false);
            window.speechSynthesis.speak(utterance);
          });
          if (!ok) {
            spokeOk = false;
            break;
          }
        }

        if (spokeOk) {
          onEnd?.();
          return { ok: true };
        }
      }
    }

    // 2) Server TTS (/api/tts -> Bhashini if configured, else local eSpeak-NG WASM for all Indian languages)
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: languageCode }),
      });
      const data = await res.json();
      if (data.audioBase64 && !this.speakCancelled) {
        const audio = new Audio(`data:${data.mimeType || "audio/wav"};base64,${data.audioBase64}`);
        this.currentAudio = audio;
        audio.onended = () => onEnd?.();
        audio.onerror = () => onEnd?.();
        await audio.play();
        return { ok: true };
      }
    } catch {
      // ignore and report unavailability below
    }

    onEnd?.();
    return { ok: false, reason: "voice_unavailable" };
  }

  stopSpeaking(): void {
    this.speakCancelled = true;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const voiceProvider: VoiceProvider = new HybridVoiceProvider();
