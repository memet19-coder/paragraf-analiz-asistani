import http from "node:http";

const port = Number(process.env.PORT || 3001);

const stopWords = new Set([
  "acaba",
  "ama",
  "ancak",
  "aslında",
  "bazı",
  "bir",
  "birçok",
  "bu",
  "bunu",
  "da",
  "de",
  "daha",
  "diye",
  "en",
  "gibi",
  "hem",
  "için",
  "ile",
  "ise",
  "ki",
  "mi",
  "ne",
  "olarak",
  "olan",
  "olduğu",
  "sonra",
  "ve",
  "veya",
]);

function splitSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function getWords(text) {
  return text
    .toLocaleLowerCase("tr-TR")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));
}

function getKeywords(text, limit = 6) {
  const counts = new Map();

  for (const word of getWords(text)) {
    counts.set(word, (counts.get(word) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((first, second) => second[1] - first[1] || second[0].length - first[0].length)
    .slice(0, limit)
    .map(([word]) => word);
}

function titleCase(text) {
  return text
    .split(" ")
    .filter(Boolean)
    .slice(0, 5)
    .map((word) => word.charAt(0).toLocaleUpperCase("tr-TR") + word.slice(1))
    .join(" ");
}

function cleanSentence(sentence) {
  return sentence.replace(/[.!?]$/, "").trim();
}

function getKeyPhrases(text, limit = 3) {
  const words = getWords(text);
  const phrases = new Map();

  for (let size = 3; size >= 2; size -= 1) {
    for (let index = 0; index <= words.length - size; index += 1) {
      const phrase = words.slice(index, index + size).join(" ");
      phrases.set(phrase, (phrases.get(phrase) || 0) + 1);
    }
  }

  return [...phrases.entries()]
    .sort((first, second) => second[1] - first[1] || second[0].length - first[0].length)
    .slice(0, limit)
    .map(([phrase]) => phrase);
}

function findMainIdea(sentences) {
  const markers = /^(bu nedenle|bu yüzden|sonuç olarak|dolayısıyla|kısacası|özetle|böylece|bu durum)/i;
  const marked = sentences.findLast((sentence) => markers.test(sentence));
  return cleanSentence(marked || sentences[sentences.length - 1] || sentences[0] || "");
}

function describeTextType(text) {
  if (text.includes("?")) return "Sorgulayıcı / düşünsel metin";
  if (/(öykü|karakter|kahraman|olay|yer|zaman)/i.test(text)) return "Öyküleyici metin";
  if (/(tanımlar|açıklar|belirtir|gösterir|neden|sonuç|etki)/i.test(text)) return "Açıklayıcı metin";
  return "Bilgilendirici metin";
}

function shortenText(text, maxLength = 150) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

function buildTopic(sentences) {
  const topicSentence = cleanSentence(sentences[0] || "");

  if (!topicSentence) {
    return "Konu belirlenemedi; metin daha uzun ve açıklayıcı olmalıdır.";
  }

  return `Paragraf, şu temel durum üzerine kuruludur: "${shortenText(topicSentence)}."`;
}

function buildTitleSuggestions() {
  return ["Metnin Ana Düşüncesi", "Paragrafta Verilen Mesaj", "Konuya Genel Bakış"];
}

function analyze(paragraph) {
  const sentences = splitSentences(paragraph);
  const keywords = getKeywords(paragraph);
  const opening = sentences[0] || paragraph;
  const mainIdea = findMainIdea(sentences);
  const supportingSentences = sentences
    .map(cleanSentence)
    .filter((sentence) => sentence && sentence !== mainIdea && sentence !== cleanSentence(opening))
    .slice(0, 3);
  const summarySentences = sentences.length > 2 ? [cleanSentence(opening), mainIdea] : sentences.map(cleanSentence);

  return {
    konu: buildTopic(sentences),
    anaFikir: `${mainIdea}.`,
    yardimciFikirler:
      supportingSentences.length > 0
        ? supportingSentences.map((sentence) => `${sentence}.`)
        : [
            "Metindeki açıklamalar ana düşünceyi desteklemektedir.",
            "Paragraftaki ayrıntılar konuya farklı bir bakış kazandırmaktadır.",
          ],
    ozet:
      summarySentences.length > 1
        ? `${summarySentences[0]} ${summarySentences[1]}.`.replace(/\s+/g, " ")
        : `${summarySentences[0] || "Metin kısa bir ana düşünce çevresinde kurulmuştur"}.`,
    baslikOnerileri: buildTitleSuggestions(),
    anahtarKelimeler: keywords,
    metinTuru: describeTextType(paragraph),
    zorlukSeviyesi: getWords(paragraph).length > 90 ? "Orta-ileri" : "Temel-orta",
  };
}

const professionalProfiles = [
  {
    patterns: [/ta[sş]|mineral|maden/i, /parlak|renk|nadir|de[gğ]erli/i, /antik|m[ıi]s[ıi]r|mezopotamya|anadolu|[çc]in/i, /kral|sava[sş]|[sş]ifa|koruyucu|g[uü][cç]/i],
    konu: "Metin, değerli taşların eski uygarlıklarda yalnızca süs eşyası olarak değil; inanç, güç, korunma ve statü sembolü olarak görülmesini ele almaktadır.",
    anaFikir: "İnsanlar tarih boyunca bazı taşlara fiziksel özelliklerinden dolayı özel anlamlar yüklemiş; bu taşları kültürel, dinsel ve sembolik amaçlarla kullanmıştır.",
    yardimciFikirler: [
      "Taşların parlaklığı, rengi ve nadir bulunması onları insanlar için dikkat çekici hâle getirmiştir.",
      "Antik uygarlıklarda bu taşlar yalnızca estetik nesneler değil, anlam ve güç taşıdığı düşünülen eşyalar olarak değerlendirilmiştir.",
      "Krallar, savaşçılar, din adamları ve şifacılar bu taşları koruyucu ya da kutsal bir unsur gibi kullanmıştır.",
    ],
    ozet: "Paragraf, değerli taşların eski çağlardan beri insanlar tarafından özel kabul edildiğini anlatır. Bu taşlar; parlaklıkları, renkleri ve nadirlikleri nedeniyle süs eşyası olmanın ötesinde güç, korunma, şifa ve statüyle ilişkilendirilmiştir.",
    baslikOnerileri: ["Değerli Taşlara Yüklenen Anlamlar", "Eski Uygarlıklarda Taşların Gücü", "Taşların Tarihsel ve Sembolik Değeri"],
  },
  {
    patterns: [/teknoloji|internet|dijital|bilgi|yapay zek/i, /ö[gğ]ren|ara[sş]t[ıi]r|kaynak|eri[sş]/i],
    konu: "Metin, teknolojinin bilgiye ulaşma ve öğrenme süreçlerini nasıl değiştirdiğini ele almaktadır.",
    anaFikir: "Teknoloji bilgiye erişimi kolaylaştırsa da doğru bilgiyi seçme ve eleştirel düşünme becerisini daha önemli hâle getirmiştir.",
    yardimciFikirler: [
      "Bilgiye ulaşmak eskiye göre daha hızlı ve kolaydır.",
      "Kaynak sayısının artması doğru bilgiyi ayırt etmeyi gerekli kılar.",
      "Metin, teknolojinin kolaylık sağlarken bilinçli kullanım sorumluluğu da doğurduğunu vurgular.",
    ],
    ozet: "Paragraf, teknolojinin bilgiye erişimi hızlandırdığını ancak bu kolaylığın doğru bilgi seçimi ve eleştirel düşünme ihtiyacını artırdığını anlatır.",
    baslikOnerileri: ["Teknoloji ve Bilgiye Erişim", "Doğru Bilgiyi Seçmek", "Dijital Çağda Öğrenme"],
  },
  {
    patterns: [/kitap|okuma|okumak|roman|öykü/i, /düşünce|hayal|dil|kelime/i],
    konu: "Metin, kitap okumanın bireyin düşünce dünyasına, dil gelişimine ve hayal gücüne katkısını ele almaktadır.",
    anaFikir: "Düzenli kitap okuma alışkanlığı bireyin düşünme becerisini, dil kullanımını ve hayal gücünü geliştirir.",
    yardimciFikirler: [
      "Kitaplar farklı hayatları ve bakış açılarını tanıma imkânı sağlar.",
      "Okuma alışkanlığı kişinin kelime dağarcığını ve anlatım gücünü destekler.",
      "Metin, kitap okumanın zihinsel gelişime katkı sunduğunu vurgular.",
    ],
    ozet: "Paragraf, kitap okumanın kişiye farklı bakış açıları kazandırdığını ve düşünce dünyasını geliştirdiğini açıklar.",
    baslikOnerileri: ["Kitap Okumanın Katkıları", "Okuma Alışkanlığının Gücü", "Kitaplarla Gelişen Düşünce"],
  },
];

function getProfessionalProfile(text) {
  return professionalProfiles.find((profile) =>
    profile.patterns.some((pattern) => pattern.test(text))
  );
}

function analyzeProfessional(paragraph) {
  const profile = getProfessionalProfile(paragraph);
  const base = analyze(paragraph);

  if (!profile) {
    return {
      ...base,
      konu: base.konu.replace(/^Paragraf, şu temel durum üzerine kuruludur: /, "Metnin ele aldığı temel durum: "),
      anaFikir: base.anaFikir,
      baslikOnerileri: ["Metnin Ana Düşüncesi", "Paragrafta Verilen Mesaj", "Konuya Genel Bakış"],
    };
  }

  return {
    ...base,
    konu: profile.konu,
    anaFikir: profile.anaFikir,
    yardimciFikirler: profile.yardimciFikirler,
    ozet: profile.ozet,
    baslikOnerileri: profile.baslikOnerileri,
  };
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        request.destroy();
        reject(new Error("Metin çok uzun."));
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

const page = String.raw`<!doctype html>
<html lang="tr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Paragraf Analiz Asistanı</title>
    <style>
      :root {
        --bg: #fafaf9;
        --panel: #ffffff;
        --ink: #0f172a;
        --muted: #64748b;
        --line: #e2e8f0;
        --soft: #f8fafc;
        --teal: #0f766e;
        --teal-soft: #ccfbf1;
        --amber: #b45309;
        --green: #059669;
      }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        min-height: 100vh;
        background: var(--bg);
        color: var(--ink);
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      button, textarea { font: inherit; }

      .shell {
        width: min(1180px, calc(100% - 32px));
        min-height: 100vh;
        margin: 0 auto;
        padding: 22px 0;
        display: flex;
        flex-direction: column;
      }

      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        padding-bottom: 20px;
        border-bottom: 1px solid var(--line);
      }

      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 10px;
        padding: 7px 11px;
        border-radius: 999px;
        background: #ecfdf5;
        color: #047857;
        font-size: 12px;
        font-weight: 700;
      }

      h1 {
        margin: 0;
        font-size: clamp(26px, 3vw, 38px);
        line-height: 1.08;
        letter-spacing: 0;
      }

      .stats {
        display: grid;
        grid-template-columns: repeat(2, 108px);
        gap: 10px;
      }

      .stat {
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--panel);
        padding: 12px 14px;
      }

      .stat span {
        display: block;
        color: var(--muted);
        font-size: 12px;
      }

      .stat strong {
        display: block;
        margin-top: 3px;
        font-size: 22px;
      }

      .workspace {
        display: grid;
        grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
        gap: 24px;
        padding-top: 24px;
        flex: 1;
      }

      .composer {
        display: flex;
        flex-direction: column;
        min-height: 620px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--panel);
        box-shadow: 0 18px 45px rgba(15, 23, 42, 0.1);
        padding: 20px;
      }

      .section-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 14px;
      }

      .section-title h2 {
        margin: 0;
        font-size: 17px;
      }

      .ghost {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: white;
        color: #334155;
        cursor: pointer;
        font-weight: 650;
        padding: 9px 12px;
      }

      textarea {
        width: 100%;
        min-height: 390px;
        flex: 1;
        resize: none;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--soft);
        color: var(--ink);
        outline: none;
        padding: 16px;
        font-size: 16px;
        line-height: 1.7;
      }

      textarea:focus {
        border-color: #14b8a6;
        background: white;
        box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.15);
      }

      .primary {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 9px;
        width: 100%;
        min-height: 50px;
        margin-top: 16px;
        border: 0;
        border-radius: 8px;
        background: #0f172a;
        color: white;
        cursor: pointer;
        font-size: 16px;
        font-weight: 750;
      }

      .primary:disabled {
        cursor: not-allowed;
        background: #94a3b8;
      }

      .error {
        margin: 12px 0 0;
        color: #dc2626;
        font-size: 14px;
        font-weight: 650;
      }

      .results {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      .card, .empty {
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--panel);
        padding: 20px;
      }

      .card-head {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }

      .icon {
        display: grid;
        place-items: center;
        width: 40px;
        height: 40px;
        border-radius: 8px;
        background: var(--teal-soft);
        color: var(--teal);
        font-size: 20px;
        flex: 0 0 auto;
      }

      .card h3 {
        margin: 0;
        font-size: 16px;
      }

      .card p, .card li {
        color: #334155;
        font-size: 14px;
        line-height: 1.65;
      }

      .card p { margin: 0; }

      .card ul {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .card li {
        display: flex;
        gap: 8px;
        margin-top: 8px;
      }

      .card li::before {
        content: "✓";
        color: var(--green);
        font-weight: 900;
      }

      .empty {
        min-height: 390px;
        border-style: dashed;
        display: grid;
        place-items: center;
        text-align: center;
        padding: 34px;
      }

      .empty-inner {
        max-width: 430px;
      }

      .empty .big {
        display: grid;
        place-items: center;
        width: 58px;
        height: 58px;
        margin: 0 auto 16px;
        border-radius: 8px;
        background: #fef3c7;
        color: var(--amber);
        font-size: 27px;
      }

      .empty h2 {
        margin: 0;
        font-size: 20px;
      }

      .empty p {
        margin: 10px 0 0;
        color: var(--muted);
        line-height: 1.65;
      }

      .meta {
        grid-column: 1 / -1;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
      }

      .chip {
        border: 1px solid var(--line);
        border-radius: 8px;
        background: #f8fafc;
        padding: 13px 14px;
      }

      .chip span {
        display: block;
        color: var(--muted);
        font-size: 12px;
      }

      .chip strong {
        display: block;
        margin-top: 4px;
        font-size: 14px;
      }

      @media (max-width: 900px) {
        .topbar, .workspace {
          grid-template-columns: 1fr;
        }

        .topbar {
          align-items: stretch;
          flex-direction: column;
        }

        .stats, .meta {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .workspace {
          display: flex;
          flex-direction: column;
        }
      }

      @media (max-width: 640px) {
        .shell {
          width: min(100% - 22px, 1180px);
          padding-top: 14px;
        }

        .results {
          grid-template-columns: 1fr;
        }

        .meta, .stats {
          grid-template-columns: 1fr;
        }

        .composer {
          min-height: 540px;
          padding: 14px;
        }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">✦ Türkçe paragraf analiz aracı</p>
          <h1>Paragraf Analiz Asistanı</h1>
        </div>
        <div class="stats">
          <div class="stat"><span>Kelime</span><strong id="wordCount">0</strong></div>
          <div class="stat"><span>Cümle</span><strong id="sentenceCount">0</strong></div>
        </div>
      </header>

      <div class="workspace">
        <section class="composer">
          <div class="section-title">
            <h2>Paragraf</h2>
            <button class="ghost" id="sampleButton" type="button"># Örnek</button>
          </div>
          <textarea id="paragraph" placeholder="Analiz etmek istediğin paragrafı buraya yapıştır..."></textarea>
          <p class="error" id="error" hidden></p>
          <button class="primary" id="analyzeButton" disabled type="button">✦ Analiz Et</button>
        </section>

        <section id="resultArea">
          <div class="empty">
            <div class="empty-inner">
              <div class="big">✦</div>
              <h2>Analiz sonucu burada görünecek</h2>
              <p>Paragrafı yapıştırıp analiz ettiğinde konu, ana fikir, yardımcı fikirler, özet ve başlık önerileri kartlar halinde hazırlanır.</p>
            </div>
          </div>
        </section>
      </div>
    </main>

    <script>
      const sampleParagraph = "Teknoloji, günlük yaşamımızı kolaylaştırırken insanların öğrenme biçimlerini de değiştirmiştir. Eskiden bilgiye ulaşmak için uzun süre araştırma yapmak gerekirken bugün birkaç saniye içinde pek çok kaynağa erişmek mümkündür. Ancak bu durum, doğru bilgiyi seçme ve eleştirel düşünme becerisini daha önemli hale getirmiştir.";
      const paragraph = document.querySelector("#paragraph");
      const analyzeButton = document.querySelector("#analyzeButton");
      const sampleButton = document.querySelector("#sampleButton");
      const wordCount = document.querySelector("#wordCount");
      const sentenceCount = document.querySelector("#sentenceCount");
      const resultArea = document.querySelector("#resultArea");
      const error = document.querySelector("#error");

      const cards = [
        ["konu", "Konu", "◎"],
        ["anaFikir", "Ana fikir", "⌖"],
        ["yardimciFikirler", "Yardımcı fikirler", "◌"],
        ["ozet", "Özet", "▤"],
        ["baslikOnerileri", "Başlık önerileri", "✎"]
      ];

      function escapeHtml(value) {
        return String(value)
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#039;");
      }

      function updateStats() {
        const text = paragraph.value.trim();
        const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
        const sentences = text ? text.split(/[.!?]+/).map((item) => item.trim()).filter(Boolean).length : 0;
        wordCount.textContent = words;
        sentenceCount.textContent = sentences;
        analyzeButton.disabled = text.length < 20;
      }

      function renderResults(data) {
        const cardHtml = cards.map(([key, title, icon]) => {
          const value = data[key];
          const content = Array.isArray(value)
            ? "<ul>" + value.map((item) => "<li>" + escapeHtml(item) + "</li>").join("") + "</ul>"
            : "<p>" + escapeHtml(value) + "</p>";

          return '<article class="card"><div class="card-head"><span class="icon">' + icon + '</span><h3>' + title + '</h3></div>' + content + '</article>';
        }).join("");

        const meta = '<div class="meta">' +
          '<div class="chip"><span>Anahtar kelimeler</span><strong>' + escapeHtml((data.anahtarKelimeler || []).join(", ")) + '</strong></div>' +
          '<div class="chip"><span>Metin türü</span><strong>' + escapeHtml(data.metinTuru) + '</strong></div>' +
          '<div class="chip"><span>Zorluk seviyesi</span><strong>' + escapeHtml(data.zorlukSeviyesi) + '</strong></div>' +
        '</div>';

        resultArea.innerHTML = '<div class="results">' + cardHtml + meta + '</div>';
      }

      async function analyzeParagraph() {
        error.hidden = true;
        analyzeButton.disabled = true;
        analyzeButton.textContent = "Analiz ediliyor...";

        try {
          const response = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paragraph: paragraph.value })
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || "Analiz sırasında bir sorun oluştu.");
          renderResults(data);
        } catch (currentError) {
          error.textContent = currentError.message;
          error.hidden = false;
        } finally {
          analyzeButton.textContent = "✦ Analiz Et";
          updateStats();
        }
      }

      paragraph.addEventListener("input", updateStats);
      analyzeButton.addEventListener("click", analyzeParagraph);
      sampleButton.addEventListener("click", () => {
        paragraph.value = sampleParagraph;
        updateStats();
        paragraph.focus();
      });
      updateStats();
    </script>
  </body>
</html>`;

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);

  if (request.method === "GET" && url.pathname === "/") {
    response.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    });
    response.end(page);
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/health") {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/analyze") {
    try {
      const body = await readBody(request);
      const payload = JSON.parse(body || "{}");
      const paragraph = String(payload.paragraph || "").trim();

      if (paragraph.length < 20) {
        sendJson(response, 400, { message: "Analiz için en az 20 karakterlik bir paragraf gir." });
        return;
      }

      sendJson(response, 200, analyzeProfessional(paragraph));
    } catch (error) {
      sendJson(response, 400, { message: "İstek okunamadı. Lütfen paragrafı tekrar gönder." });
    }
    return;
  }

  sendJson(response, 404, { message: "Sayfa bulunamadı." });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Paragraf Analiz Asistanı hazır: http://127.0.0.1:${port}`);
});
