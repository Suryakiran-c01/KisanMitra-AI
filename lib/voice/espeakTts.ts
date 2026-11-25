import fs from "fs";
import path from "path";

type EmscriptenEspeakModule = {
  eSpeakNGWorker: new () => {
    set_voice: (voice: string) => number;
    set_rate?: (rate: number) => void;
    get_samplerate: () => number;
    synthesize: (text: string, cb: (samples: Int16Array | null) => void) => void;
  };
};

let modulePromise: Promise<EmscriptenEspeakModule> | null = null;

const VOICE_MAP: Record<string, string> = {
  hi: "inc/hi",
  bn: "inc/bn",
  te: "dra/te",
  mr: "inc/mr",
  ta: "dra/ta",
  ur: "inc/ur",
  gu: "inc/gu",
  kn: "dra/kn",
  or: "inc/or",
  ml: "dra/ml",
  pa: "inc/pa",
  as: "inc/as",
  ne: "inc/ne",
  sd: "inc/sd",
  kok: "inc/kok",
  mai: "inc/hi",
  doi: "inc/hi",
  brx: "inc/hi",
  sa: "inc/hi",
  ks: "inc/ur",
  sat: "gmw/en",
  mni: "gmw/en",
  en: "gmw/en",
};

async function getEspeakModule(): Promise<EmscriptenEspeakModule> {
  if (!modulePromise) {
    modulePromise = (async () => {
      const pkgDir = path.join(process.cwd(), "node_modules", "@echogarden", "espeak-ng-emscripten");
      const dataPath = path.join(pkgDir, "espeak-ng.data");
      const mod = await import("@echogarden/espeak-ng-emscripten");
      const factory = mod.default as (opts?: {
        locateFile?: (file: string) => string;
        wasmBinary?: Uint8Array;
      }) => Promise<EmscriptenEspeakModule>;

      return factory({
        locateFile: (file: string) => {
          if (file.endsWith(".data") && fs.existsSync(dataPath)) {
            return dataPath;
          }
          return path.join(pkgDir, file);
        },
      });
    })();
  }
  return modulePromise;
}

function encodeWavBase64(chunks: Int16Array[], sampleRate: number): string {
  const totalSamples = chunks.reduce((sum, c) => sum + c.length, 0);
  const dataSize = totalSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);

  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);

  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (const chunk of chunks) {
    for (let i = 0; i < chunk.length; i++) {
      buffer.writeInt16LE(chunk[i], offset);
      offset += 2;
    }
  }

  return buffer.toString("base64");
}

export async function synthesizeWithEspeak(
  text: string,
  languageCode: string
): Promise<{ audioBase64: string; mimeType: string } | null> {
  const cleanText = text.replace(/\s+/g, " ").trim().slice(0, 1200);
  if (!cleanText) return null;

  const mod = await getEspeakModule();
  const worker = new mod.eSpeakNGWorker();
  const voiceId = VOICE_MAP[languageCode] || "inc/hi";
  worker.set_voice(voiceId);
  if (typeof worker.set_rate === "function") {
    worker.set_rate(145);
  }

  const sampleRate = worker.get_samplerate() || 22050;
  const chunks: Int16Array[] = [];

  worker.synthesize(cleanText, (samples) => {
    if (samples && samples.length > 0) {
      chunks.push(Int16Array.from(samples));
    }
  });

  if (chunks.length === 0) return null;

  return {
    audioBase64: encodeWavBase64(chunks, sampleRate),
    mimeType: "audio/wav",
  };
}
