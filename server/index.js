import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeText, generateQuestions } from "./analyzer.js";

const app = express();
const port = Number(process.env.PORT || 3001);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../dist");

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (request, response) => {
  response.json({ ok: true });
});

app.post("/api/analyze", (request, response) => {
  const paragraph = String(request.body?.paragraph || "").trim();

  if (paragraph.length < 20) {
    response.status(400).json({ message: "İşlem için en az 20 karakterlik bir paragraf gir." });
    return;
  }

  response.json(analyzeText(paragraph));
});

app.post("/api/questions", (request, response) => {
  const paragraph = String(request.body?.paragraph || "").trim();

  if (paragraph.length < 20) {
    response.status(400).json({ message: "Soru üretmek için en az 20 karakterlik bir paragraf gir." });
    return;
  }

  response.json(generateQuestions(paragraph));
});

app.use(express.static(distPath));

app.get(/^(?!\/api).*/, (request, response) => {
  response.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Paragraf Soru Asistanı hazır: http://127.0.0.1:${port}`);
});
