const STOP_WORDS = new Set([
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

const PRONOUNS = new Set([
  "ben",
  "sen",
  "o",
  "biz",
  "siz",
  "onlar",
  "bana",
  "sana",
  "ona",
  "bize",
  "size",
  "onlara",
  "beni",
  "seni",
  "onu",
  "bizi",
  "sizi",
  "onları",
  "bu",
  "şu",
  "o",
  "bunlar",
  "şunlar",
  "kim",
  "ne",
  "hangi",
  "kendisi",
]);

const CONJUNCTIONS = new Set([
  "ve",
  "ile",
  "ama",
  "fakat",
  "ancak",
  "çünkü",
  "zira",
  "veya",
  "ya da",
  "hem",
  "ne var ki",
  "oysa",
  "oysa ki",
]);

const POSTPOSITIONS = new Set([
  "gibi",
  "kadar",
  "için",
  "üzere",
  "diye",
  "rağmen",
  "karşı",
  "doğru",
  "beri",
  "önce",
  "sonra",
  "dolayı",
  "ötürü",
  "dair",
  "göre",
]);

const COMMON_ADJECTIVES = new Set([
  "büyük",
  "küçük",
  "eski",
  "yeni",
  "farklı",
  "önemli",
  "değerli",
  "parlak",
  "nadir",
  "olağanüstü",
  "doğru",
  "yanlış",
  "düzenli",
  "geniş",
  "güçlü",
  "zayıf",
  "kültürel",
  "sembolik",
  "koruyucu",
]);

const COMMON_ADVERBS = new Set([
  "çok",
  "az",
  "daha",
  "en",
  "hemen",
  "bugün",
  "eskiden",
  "sonra",
  "önce",
  "hızlıca",
  "yavaşça",
  "sıkça",
  "bazen",
  "daima",
  "özellikle",
]);

const TOPIC_PROFILES = [
  {
    score: ["taş", "taşlar", "mineral", "maden", "parlak", "nadir", "kral", "savaşçı", "şifacı", "antik"],
    topic:
      "değerli taşların eski uygarlıklarda süs eşyasının ötesinde inanç, güç, korunma ve statü sembolü olarak görülmesi",
    mainIdea:
      "İnsanlar tarih boyunca bazı taşlara fiziksel özelliklerinden dolayı özel anlamlar yüklemiş; bu taşları kültürel, dinsel ve sembolik amaçlarla kullanmıştır.",
    supportingIdeas: [
      "Taşların parlaklığı, rengi ve nadir bulunması onları insanlar için dikkat çekici hâle getirmiştir.",
      "Antik uygarlıklarda bu taşlar yalnızca estetik nesneler değil, anlam ve güç taşıdığı düşünülen eşyalar olarak değerlendirilmiştir.",
      "Krallar, savaşçılar, din adamları ve şifacılar belirli taşları koruyucu ya da kutsal bir unsur gibi kullanmıştır.",
    ],
    summary:
      "Paragraf, değerli taşların eski çağlardan beri insanlar tarafından özel kabul edildiğini anlatır. Bu taşlar; parlaklıkları, renkleri ve nadirlikleri nedeniyle süs eşyası olmanın ötesinde güç, korunma, şifa ve statüyle ilişkilendirilmiştir.",
    titles: ["Değerli Taşlara Yüklenen Anlamlar", "Eski Uygarlıklarda Taşların Gücü", "Taşların Tarihsel ve Sembolik Değeri"],
  },
  {
    score: ["teknoloji", "internet", "dijital", "bilgi", "kaynak", "öğrenme", "araştırma", "eleştirel"],
    topic: "teknolojinin bilgiye ulaşma ve öğrenme süreçlerini değiştirmesi",
    mainIdea:
      "Teknoloji bilgiye erişimi kolaylaştırsa da doğru bilgiyi seçme ve eleştirel düşünme becerisini daha önemli hâle getirmiştir.",
    supportingIdeas: [
      "Bilgiye ulaşmak eskiye göre daha hızlı ve kolaydır.",
      "Kaynak sayısının artması doğru bilgiyi ayırt etmeyi gerekli kılar.",
      "Metin, teknolojinin kolaylık sağlarken bilinçli kullanım sorumluluğu da doğurduğunu vurgular.",
    ],
    summary:
      "Paragraf, teknolojinin bilgiye erişimi hızlandırdığını ancak bu kolaylığın doğru bilgi seçimi ve eleştirel düşünme ihtiyacını artırdığını anlatır.",
    titles: ["Teknoloji ve Bilgiye Erişim", "Doğru Bilgiyi Seçmek", "Dijital Çağda Öğrenme"],
  },
  {
    score: ["kitap", "okuma", "okumak", "roman", "öykü", "düşünce", "hayal", "dil", "kelime"],
    topic: "kitap okumanın bireyin düşünce dünyasına, dil gelişimine ve hayal gücüne katkısı",
    mainIdea:
      "Düzenli kitap okuma alışkanlığı bireyin düşünme becerisini, dil kullanımını ve hayal gücünü geliştirir.",
    supportingIdeas: [
      "Kitaplar farklı hayatları ve bakış açılarını tanıma imkânı sağlar.",
      "Okuma alışkanlığı kişinin kelime dağarcığını ve anlatım gücünü destekler.",
      "Metin, kitap okumanın zihinsel gelişime katkı sunduğunu vurgular.",
    ],
    summary:
      "Paragraf, kitap okumanın kişiye farklı bakış açıları kazandırdığını ve düşünce dünyasını geliştirdiğini açıklar.",
    titles: ["Kitap Okumanın Katkıları", "Okuma Alışkanlığının Gücü", "Kitaplarla Gelişen Düşünce"],
  },
];

const CATEGORY_INFO = {
  isimler: "Varlıkları, kavramları, yerleri veya kişileri karşılayan sözcükler.",
  sifatlar: "İsimleri niteleyen ya da belirten sözcükler.",
  zamirler: "İsimlerin yerine kullanılan sözcükler.",
  zarflar: "Fiilleri, sıfatları veya başka zarfları zaman, durum, miktar gibi yönlerden tamamlayan sözcükler.",
  edatlar: "Tek başına anlamı zayıf olan, cümlede ilişki kuran sözcükler.",
  baglaclar: "Sözcükleri, söz gruplarını veya cümleleri bağlayan sözcükler.",
  cekimliFiiller: "Kip ve kişi eki alarak yargı bildiren fiiller.",
  isimFiiller: "-ma, -me, -mak, -mek, -ış, -iş, -uş, -üş ekleriyle adlaşan fiilimsiler.",
  sifatFiiller: "-an, -en, -ası, -esi, -maz, -mez, -ar, -er, -dik, -ecek, -miş ekleriyle sıfat görevi yapan fiilimsiler.",
  zarfFiiller: "-ıp, -ip, -arak, -erek, -ınca, -ince, -ken, -madan, -meksizin gibi eklerle zarf görevi yapan fiilimsiler.",
};

const CATEGORY_LABELS = {
  isimler: "İsimler",
  sifatlar: "Sıfatlar",
  zamirler: "Zamirler",
  zarflar: "Zarflar",
  edatlar: "Edatlar",
  baglaclar: "Bağlaçlar",
  cekimliFiiller: "Çekimli fiiller",
  isimFiiller: "İsim-fiiller",
  sifatFiiller: "Sıfat-fiiller",
  zarfFiiller: "Zarf-fiiller",
};

function normalize(text) {
  return text.toLocaleLowerCase("tr-TR");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function splitSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function tokenize(text) {
  return text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)?/gu) || [];
}

function cleanWord(word) {
  return normalize(word).replace(/['’].*$/, "");
}

function getContentWords(text) {
  return tokenize(text)
    .map(cleanWord)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

function getKeywords(text, limit = 8) {
  const counts = new Map();

  for (const word of getContentWords(text)) {
    counts.set(word, (counts.get(word) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .slice(0, limit)
    .map(([word]) => word);
}

function cleanSentence(sentence) {
  return sentence.replace(/[.!?]$/, "").trim();
}

function shorten(text, maxLength = 150) {
  const clean = cleanSentence(text);
  return clean.length <= maxLength ? clean : `${clean.slice(0, maxLength).trim()}...`;
}

function scoreProfile(text, profile) {
  const lower = normalize(text);
  return profile.score.reduce((score, token) => (lower.includes(token) ? score + 1 : score), 0);
}

function findProfile(text) {
  const best = TOPIC_PROFILES
    .map((profile) => ({ profile, score: scoreProfile(text, profile) }))
    .sort((a, b) => b.score - a.score)[0];

  return best?.score >= 2 ? best.profile : null;
}

function findMainIdea(sentences) {
  const markers = /^(bu nedenle|bu yüzden|sonuç olarak|dolayısıyla|kısacası|özetle|böylece|bu durum|bundan dolayı)/i;
  return cleanSentence(sentences.findLast((sentence) => markers.test(sentence)) || sentences.at(-1) || sentences[0] || "");
}

function inferGeneralTopic(sentences, keywords) {
  if (keywords.length >= 3) {
    return `metinde öne çıkan ${keywords.slice(0, 3).join(", ")} kavramları arasındaki ilişki`;
  }

  const first = shorten(sentences[0] || "");
  return first ? `ilk cümlede verilen temel durum: "${first}"` : "metindeki temel düşünce";
}

function inferTextType(text) {
  if (text.includes("?")) return "Sorgulayıcı / düşünsel metin";
  if (/(kahraman|olay|zaman|yer|yaşadı|gördü|duydu|geldi|gitti)/i.test(text)) return "Öyküleyici metin";
  if (/(çünkü|bu nedenle|dolayısıyla|sonuç|etki|neden|açıklar|gösterir)/i.test(text)) return "Açıklayıcı metin";
  if (/(bence|savunur|kanıtlar|gereklidir|olmalıdır)/i.test(text)) return "Tartışmacı metin";
  return "Bilgilendirici metin";
}

function inferDifficulty(text) {
  const words = tokenize(text);
  const sentences = splitSentences(text);
  const average = sentences.length ? words.length / sentences.length : words.length;

  if (words.length > 120 || average > 20) return "İleri";
  if (words.length > 65 || average > 14) return "Orta";
  return "Temel";
}

export function analyzeParagraph(paragraph) {
  const sentences = splitSentences(paragraph);
  const keywords = getKeywords(paragraph);
  const profile = findProfile(paragraph);

  if (profile) {
    return {
      konu: `Metnin konusu, ${profile.topic}.`,
      anaFikir: profile.mainIdea,
      yardimciFikirler: profile.supportingIdeas,
      ozet: profile.summary,
      baslikOnerileri: profile.titles,
      anahtarKelimeler: keywords,
      metinTuru: inferTextType(paragraph),
      zorlukSeviyesi: inferDifficulty(paragraph),
    };
  }

  const mainIdea = findMainIdea(sentences);
  const topic = inferGeneralTopic(sentences, keywords);
  const support = sentences
    .slice(0, 4)
    .map(cleanSentence)
    .filter((sentence) => sentence && sentence !== mainIdea)
    .slice(0, 3);

  return {
    konu: `Metnin konusu, ${topic}.`,
    anaFikir: mainIdea
      ? `Paragrafın ana fikri, "${shorten(mainIdea, 140)}" yargısı etrafında şekillenmektedir.`
      : "Ana fikir belirlenemedi; metin daha açık bir sonuç cümlesi içermelidir.",
    yardimciFikirler:
      support.length > 0
        ? support.map((sentence) => `"${shorten(sentence, 120)}" ifadesi ana düşünceyi destekleyen önemli bir ayrıntıdır.`)
        : ["Metindeki ayrıntılar ana düşünceyi açıklamak ve somutlaştırmak için kullanılmıştır."],
    ozet:
      sentences.length > 1
        ? `Paragraf, "${shorten(sentences[0], 120)}" düşüncesinden hareket eder ve "${shorten(mainIdea, 120)}" sonucuna ulaşır.`
        : `Paragraf, "${shorten(sentences[0] || paragraph, 140)}" düşüncesini merkeze alır.`,
    baslikOnerileri: [
      "Metnin Ana Mesajı",
      keywords[0] ? `${keywords[0][0].toLocaleUpperCase("tr-TR")}${keywords[0].slice(1)} Üzerine` : "Paragrafın Temel Düşüncesi",
      "Konuya Genel Bakış",
    ],
    anahtarKelimeler: keywords,
    metinTuru: inferTextType(paragraph),
    zorlukSeviyesi: inferDifficulty(paragraph),
  };
}

function isVerbalNoun(word) {
  return /(ma|me|mak|mek|ış|iş|uş|üş)$/.test(word) && word.length > 4;
}

function isParticiple(word) {
  if (/(dan|den|tan|ten)$/.test(word)) return false;
  return /(an|en|maz|mez|dık|dik|duk|dük|acak|ecek|mış|miş|muş|müş)$/.test(word) && word.length > 5;
}

function isConverb(word) {
  return /(ıp|ip|up|üp|arak|erek|ınca|ince|unca|ünce|ken|madan|meden|meksizin|maksızın)$/.test(word) && word.length > 5;
}

function isFiniteVerb(word) {
  if (COMMON_ADJECTIVES.has(word) || PRONOUNS.has(word) || CONJUNCTIONS.has(word) || POSTPOSITIONS.has(word)) return false;
  if (/(yor)(um|sun|uz|sunuz|lar|ler|du|dü|dı|di|muş|müş)?$/.test(word)) return true;
  if (/(mış|miş|muş|müş|malı|meli)(ım|im|um|üm|sın|sin|sun|sün|ız|iz|uz|üz|lar|ler)?$/.test(word)) return true;
  if (/(acak|ecek)(ım|im|sın|sin|ız|iz|lar|ler)?$/.test(word)) return true;
  if (/(dı|di|du|dü|tı|ti|tu|tü)(m|n|k|nız|niz|lar|ler)?$/.test(word) && word.length > 5) return true;
  return false;
}

function isLikelyAdverb(word) {
  return COMMON_ADVERBS.has(word) || /(casına|cesine|ınca|ince|unca|ünce)$/.test(word);
}

function isLikelyAdjective(word, nextWord) {
  return COMMON_ADJECTIVES.has(word) || (!!nextWord && /(sal|sel|ki)$/.test(word));
}

function isLikelyNoun(word) {
  return (
    !PRONOUNS.has(word) &&
    !CONJUNCTIONS.has(word) &&
    !POSTPOSITIONS.has(word) &&
    !COMMON_ADJECTIVES.has(word) &&
    !COMMON_ADVERBS.has(word) &&
    !isFiniteVerb(word) &&
    !isVerbalNoun(word) &&
    !isParticiple(word) &&
    !isConverb(word) &&
    word.length > 2
  );
}

export function analyzeGrammar(paragraph) {
  const words = tokenize(paragraph);
  const normalized = words.map(cleanWord);
  const categories = {
    isimler: [],
    sifatlar: [],
    zamirler: [],
    zarflar: [],
    edatlar: [],
    baglaclar: [],
    cekimliFiiller: [],
    isimFiiller: [],
    sifatFiiller: [],
    zarfFiiller: [],
  };

  normalized.forEach((word, index) => {
    const original = words[index];
    const next = normalized[index + 1];

    if (PRONOUNS.has(word)) categories.zamirler.push(original);
    if (CONJUNCTIONS.has(word)) categories.baglaclar.push(original);
    if (POSTPOSITIONS.has(word)) categories.edatlar.push(original);
    if (isLikelyAdverb(word)) categories.zarflar.push(original);
    if (isVerbalNoun(word)) categories.isimFiiller.push(original);
    if (isParticiple(word)) categories.sifatFiiller.push(original);
    if (isConverb(word)) categories.zarfFiiller.push(original);
    if (isFiniteVerb(word) && !isParticiple(word) && !isConverb(word)) categories.cekimliFiiller.push(original);
    if (isLikelyAdjective(word, next)) categories.sifatlar.push(original);
    if (isLikelyNoun(word)) categories.isimler.push(original);
  });

  return Object.entries(categories).map(([key, values]) => ({
    key,
    label: CATEGORY_LABELS[key],
    words: unique(values).slice(0, 18),
    count: unique(values).length,
    explanation: CATEGORY_INFO[key],
  }));
}

export function analyzeText(paragraph) {
  return {
    ...analyzeParagraph(paragraph),
    dilBilgisi: analyzeGrammar(paragraph),
  };
}
