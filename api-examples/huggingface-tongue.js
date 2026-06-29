export async function analyzeTongueWithHuggingFace(imageArrayBuffer) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/octet-stream"
      },
      body: imageArrayBuffer
    }
  );

  if (!response.ok) {
    throw new Error(`HuggingFace inference failed: ${response.status}`);
  }

  const raw = await response.json();
  return {
    raw,
    mappedTongueSign: "red",
    confidence: raw?.[0]?.score ?? 0
  };
}
