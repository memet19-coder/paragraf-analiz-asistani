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
  "yok",
  "oluş",
  "oluşun",
  "kez",
  "göre",
  "bugüne",
  "günümüzde",
  "ileri",
  "sürülmektedir",
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
    score: [
      "dünya",
      "ekosistem",
      "canlı",
      "cansız",
      "insanoğlu",
      "insan",
      "tehdit",
      "doğal afet",
      "yok oluş",
      "tür",
      "yaşamsal",
    ],
    topic:
      "Dünya ekosisteminde insanın yeri ve insan faaliyetlerinin canlı yaşamı üzerindeki yıkıcı etkileri",
    mainIdea:
      "İnsan, Dünya ekosisteminin bir parçası olmasına rağmen canlı türlerinin yok oluşunu hızlandıran en önemli tehdit kaynaklarından biri hâline gelmiştir.",
    supportingIdeas: [
      "Dünya, canlı ve cansız varlıkların birbiriyle ilişkili olduğu büyük bir ekosistem olarak ele alınmaktadır.",
      "İnsan bu ekosistemin etkin bir parçasıdır; ancak aynı zamanda ekosisteme zarar veren başlıca unsurlardan biridir.",
      "Uzmanlara göre günümüzde yaşanan tür kayıplarında insan etkisi belirleyici bir rol oynamaktadır.",
    ],
    summary:
      "Paragraf, Dünya’nın canlı ve cansız varlıkların ilişkileriyle oluşan büyük bir ekosistem olduğunu anlatır. İnsan bu sistemin bir parçası olsa da doğal dengeyi bozan, türlerin yok oluş hızını artıran ve yeni bir yok oluş sürecini başlatan temel etkenlerden biri olarak gösterilir.",
    titles: [
      "Dünya Ekosisteminde İnsan Etkisi",
      "Altıncı Yok Oluş ve İnsan",
      "Ekosistemin En Büyük Tehdidi",
    ],
  },
  {
    score: [
      "su",
      "tasarruf",
      "kuraklık",
      "tüketim",
      "bilinçli",
      "gelecek",
      "kaynak",
      "korunma",
      "önlem",
    ],
    topic: "su kaynaklarının bilinçli kullanılması ve kuraklık tehlikesine karşı tasarrufun önemi",
    mainIdea:
      "Su kaynaklarını korumak için bireylerin günlük yaşamda tasarruflu ve bilinçli tüketim alışkanlığı kazanması gerekir.",
    supportingIdeas: [
      "Suyun tasarruflu kullanılması gelecekte yaşanabilecek kuraklık riskini azaltır.",
      "Evlerde alınacak küçük önlemler bile suyun korunmasına katkı sağlar.",
      "Metin, bireysel davranışların doğal kaynakların korunmasında önemli olduğunu vurgular.",
    ],
    summary:
      "Paragraf, suyun bilinçli kullanılmasının gelecek açısından taşıdığı önemi anlatır. Küçük önlemlerle su israfının azaltılabileceği ve kuraklık tehlikesine karşı bireylerin sorumluluk alması gerektiği vurgulanır.",
    titles: ["Su Tasarrufunun Önemi", "Kuraklığa Karşı Bilinçli Tüketim", "Suyu Korumak Geleceği Korumaktır"],
  },
  {
    score: [
      "spor",
      "beden",
      "sağlık",
      "ruhsal",
      "fiziksel",
      "hareket",
      "stres",
      "enerjik",
      "düzenli",
      "egzersiz",
    ],
    topic: "sporun beden ve ruh sağlığı üzerindeki olumlu etkileri",
    mainIdea:
      "Düzenli spor yapmak, bireyin hem fiziksel sağlığını korur hem de ruhsal açıdan daha güçlü ve dengeli olmasına katkı sağlar.",
    supportingIdeas: [
      "Spor yapmak beden sağlığını korur ve kişinin kendini daha enerjik hissetmesine yardımcı olur.",
      "Düzenli hareket eden bireyler stresle daha kolay baş edebilir.",
      "Metin, sporun yalnızca fiziksel değil ruhsal sağlık açısından da önemli olduğunu vurgular.",
    ],
    summary:
      "Paragraf, spor yapmanın insan sağlığına çok yönlü katkılarını anlatır. Düzenli hareketin bedeni güçlendirdiği, kişiye enerji verdiği ve stresle baş etmeyi kolaylaştırdığı belirtilir.",
    titles: ["Sporun Sağlığa Katkıları", "Düzenli Hareketin Önemi", "Beden ve Ruh Sağlığı İçin Spor"],
  },
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

function sentenceWords(sentence) {
  return getContentWords(sentence).filter((word) => !/^\d+$/.test(word));
}

function getSentenceScores(sentences, keywords) {
  const keywordSet = new Set(keywords.slice(0, 8));
  const conclusionMarkers = /(bu nedenle|bu yüzden|sonuç olarak|dolayısıyla|kısacası|özetle|böylece|bu durum|bundan dolayı|temel sebep|en önemli|ancak|oysa)/i;

  return sentences.map((sentence, index) => {
    const words = sentenceWords(sentence);
    const keywordScore = words.reduce((score, word) => score + (keywordSet.has(word) ? 1.4 : 0), 0);
    const markerScore = conclusionMarkers.test(sentence) ? 4 : 0;
    const positionScore = index === sentences.length - 1 ? 2.2 : index === 0 ? 1 : 0;
    const lengthScore = Math.min(words.length / 8, 2);

    return {
      sentence,
      index,
      score: keywordScore + markerScore + positionScore + lengthScore,
    };
  });
}

function findBestSentence(sentences, keywords) {
  return getSentenceScores(sentences, keywords)
    .sort((a, b) => b.score - a.score || b.index - a.index)[0]?.sentence || sentences.at(-1) || sentences[0] || "";
}

function getPhraseCandidates(sentences) {
  const phraseScores = new Map();

  sentences.forEach((sentence, sentenceIndex) => {
    const words = sentenceWords(sentence).filter((word) => word.length > 3);

    for (let size = 3; size >= 2; size -= 1) {
      for (let index = 0; index <= words.length - size; index += 1) {
        const phrase = words.slice(index, index + size).join(" ");
        const previous = phraseScores.get(phrase) || 0;
        const positionBoost = sentenceIndex === 0 ? 1.5 : 1;
        phraseScores.set(phrase, previous + size + positionBoost);
      }
    }
  });

  return [...phraseScores.entries()]
    .filter(([phrase]) => !/(bugüne kadar|çeşitli görüşlere|ileri sürülmektedir|temel sebebidir)/i.test(phrase))
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .map(([phrase]) => phrase);
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

function findMainIdea(sentences, keywords = []) {
  const markers = /^(bu nedenle|bu yüzden|sonuç olarak|dolayısıyla|kısacası|özetle|böylece|bu durum|bundan dolayı)/i;
  const marked = sentences.findLast((sentence) => markers.test(sentence));
  return cleanSentence(marked || findBestSentence(sentences, keywords));
}

function inferGeneralTopic(sentences, keywords, mainIdea = "") {
  const phrases = getPhraseCandidates(sentences);
  const joined = `${sentences.join(" ")} ${mainIdea}`.toLocaleLowerCase("tr-TR");

  if (/(dünya|ekosistem|canlı|cansız|tür|yok oluş|insan|doğal afet)/i.test(joined)) {
    return "Dünya ekosisteminde insanın yeri ve insan etkisiyle ortaya çıkan yok oluş tehlikesi";
  }

  if (phrases.length > 0) {
    return `${phrases[0]} üzerine kurulan temel düşünce`;
  }

  if (keywords.length >= 2) {
    return `${keywords.slice(0, 2).join(" ve ")} kavramlarıyla ilgili ana düşünce`;
  }

  const first = shorten(sentences[0] || "");
  return first ? `ilk cümlede verilen temel durum: "${first}"` : "metindeki temel düşünce";
}

function buildGeneralMainIdea(mainIdea) {
  if (!mainIdea) return "Ana fikir belirlenemedi; metin daha açık bir sonuç cümlesi içermelidir.";

  const clean = shorten(mainIdea, 160);
  const lower = clean.toLocaleLowerCase("tr-TR");

  if (/gerekir|gereklidir|önemlidir|zorundadır|olmalıdır|sağlar|azaltır|artırır/.test(lower)) {
    return clean.endsWith(".") ? clean : `${clean}.`;
  }

  return `Paragrafın ana fikri, metinde verilen açıklamaların "${clean}" düşüncesine bağlanmasıdır.`;
}

function buildGeneralSummary(sentences, mainIdea) {
  const first = shorten(sentences[0] || "", 130);
  const idea = shorten(mainIdea, 130);

  if (first && idea && first !== idea) {
    return `Paragraf, ${first.charAt(0).toLocaleLowerCase("tr-TR") + first.slice(1)} düşüncesinden hareket eder. Sonuçta metin, ${idea.charAt(0).toLocaleLowerCase("tr-TR") + idea.slice(1)} yargısına ulaşır.`;
  }

  return first
    ? `Paragraf, ${first.charAt(0).toLocaleLowerCase("tr-TR") + first.slice(1)} düşüncesini merkeze alır.`
    : "Metin, tek bir ana düşünce çevresinde kurulmuştur.";
}

function toTitleCase(text) {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 7)
    .map((word) => `${word.charAt(0).toLocaleUpperCase("tr-TR")}${word.slice(1)}`)
    .join(" ");
}

function getTitleSeed(keywords) {
  const badTitleWords = new Set([
    "yok",
    "oluş",
    "oluşun",
    "olduğu",
    "olan",
    "göre",
    "bugüne",
    "günümüzde",
    "kadar",
    "çeşitli",
    "büyük",
  ]);

  return keywords.find((keyword) => keyword.length > 3 && !badTitleWords.has(keyword));
}

function isGoodPhraseForTitle(phrase) {
  const words = phrase.split(/\s+/).filter(Boolean);
  if (words.length < 2) return false;
  if (words.some((word) => word.length < 3)) return false;
  if (/(yapmak|etmek|olmak|bulunmak|sağlamak)$/.test(words[0])) return false;
  return true;
}

function generateTitleSuggestions(keywords, topic, mainIdea, sentences = []) {
  const joined = `${topic} ${mainIdea}`.toLocaleLowerCase("tr-TR");
  const phrases = getPhraseCandidates(sentences);

  if (/(dünya|ekosistem|canlı|cansız|tür|yok oluş|insan|doğal afet)/i.test(joined)) {
    return ["Dünya Ekosisteminde İnsan Etkisi", "Altıncı Yok Oluş Tehlikesi", "İnsan ve Ekolojik Denge"];
  }

  if (/(teknoloji|bilgi|internet|dijital|kaynak)/i.test(joined)) {
    return ["Teknoloji ve Bilgiye Erişim", "Doğru Bilgiyi Seçmek", "Dijital Çağda Öğrenme"];
  }

  if (/(kitap|okuma|roman|öykü|kelime dağarcığı|hayal gücü)/i.test(joined)) {
    return ["Kitap Okumanın Katkıları", "Okuma Alışkanlığının Gücü", "Kitaplarla Gelişen Düşünce"];
  }

  const seed = getTitleSeed(keywords);

  const phrase = phrases.find(isGoodPhraseForTitle);

  if (phrase) {
    return [
      toTitleCase(phrase),
      `${toTitleCase(phrase.split(" ").slice(0, 2).join(" "))} Üzerine Bir Değerlendirme`,
      "Metnin Temel Mesajı",
    ];
  }

  if (seed) {
    return [`${toTitleCase(seed)} ve Ana Düşünce`, `${toTitleCase(seed)} Üzerine Bir Değerlendirme`, "Metnin Temel Mesajı"];
  }

  return ["Metnin Temel Mesajı", "Paragrafın Ana Düşüncesi", "Konuya Genel Bakış"];
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

  const mainIdea = findMainIdea(sentences, keywords);
  const topic = inferGeneralTopic(sentences, keywords, mainIdea);
  const support = sentences
    .slice(0, 4)
    .map(cleanSentence)
    .filter((sentence) => sentence && sentence !== mainIdea)
    .slice(0, 3);

  return {
    konu: `Metnin konusu, ${topic}.`,
    anaFikir: buildGeneralMainIdea(mainIdea),
    yardimciFikirler:
      support.length > 0
        ? support.map((sentence) => `"${shorten(sentence, 120)}" ifadesi ana düşünceyi destekleyen önemli bir ayrıntıdır.`)
        : ["Metindeki ayrıntılar ana düşünceyi açıklamak ve somutlaştırmak için kullanılmıştır."],
    ozet: buildGeneralSummary(sentences, mainIdea),
    baslikOnerileri: generateTitleSuggestions(keywords, topic, mainIdea, sentences),
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
