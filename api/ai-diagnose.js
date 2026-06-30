export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const hfSpaceUrl = (process.env.HF_SPACE_API_URL || "https://dragonkim-medical-ai-tcm-model-demo.hf.space").replace(/\/$/, "");

  try {
    const payload = req.body || {};
    const submit = await fetch(`${hfSpaceUrl}/call/diagnose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [
          payload.symptoms || [],
          payload.tongue || "舌红",
          payload.pulse || "弦脉",
          payload.freeText || "",
          payload.language || "中文",
          payload.maxTokens || 384,
          payload.temperature ?? 0.2,
        ],
      }),
    });

    if (!submit.ok) {
      const message = await submit.text();
      res.status(submit.status).json({ error: message });
      return;
    }

    const { event_id: eventId } = await submit.json();
    if (!eventId) {
      res.status(502).json({ error: "Hugging Face Space did not return an event_id" });
      return;
    }

    const deadline = Date.now() + 50000;
    while (Date.now() < deadline) {
      const poll = await fetch(`${hfSpaceUrl}/call/diagnose/${eventId}`);
      const text = await poll.text();

      if (text.includes("event: complete")) {
        const dataLine = text.split("\n").find((line) => line.startsWith("data: "));
        const parsed = dataLine ? JSON.parse(dataLine.slice(6)) : null;
        res.status(200).json({ result: Array.isArray(parsed) ? parsed[0] : parsed });
        return;
      }

      if (text.includes("event: error")) {
        res.status(502).json({ error: "Hugging Face Space returned an error. Check Space logs." });
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    res.status(504).json({ error: "Timed out waiting for Hugging Face Space response" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
