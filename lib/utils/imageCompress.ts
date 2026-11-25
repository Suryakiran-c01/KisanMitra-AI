/**
 * Compresses an uploaded or camera-captured image client-side to under 1 MB
 * (max 1280px dimension, JPEG) for fast 3G upload on budget Android phones.
 */
export async function compressImageToUnder1MB(file: File, maxBytes = 950_000): Promise<string> {
  const imageUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(imageUrl);
    const maxDim = 1280;
    let { width, height } = img;

    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas unavailable");
    }
    ctx.drawImage(img, 0, 0, width, height);

    let quality = 0.82;
    let dataUrl = canvas.toDataURL("image/jpeg", quality);

    while (estimateDataUrlBytes(dataUrl) > maxBytes && quality > 0.35) {
      quality -= 0.12;
      dataUrl = canvas.toDataURL("image/jpeg", quality);
    }

    // If still too large, downscale dimensions by 25%
    if (estimateDataUrlBytes(dataUrl) > maxBytes) {
      canvas.width = Math.round(width * 0.75);
      canvas.height = Math.round(height * 0.75);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      dataUrl = canvas.toDataURL("image/jpeg", 0.65);
    }

    return dataUrl;
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

function estimateDataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.split(",")[1] || "";
  return Math.floor((base64.length * 3) / 4);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
