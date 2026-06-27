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
  "göre",
  "hem",
  "için",
  "ile",
  "ise",
  "kadar",
  "ki",
  "mi",
  "ne",
  "olan",
  "olarak",
  "olduğu",
  "sonra",
  "ve",
  "veya",
]);

const TEXT_TYPES = [
  "Açıklayıcı anlatım",
  "Tartışmacı anlatım",
  "Öyküleyici anlatım",
  "Betimleyici anlatım",
];

const COMMON_ADJECTIVES = new Set([
  "büyük",
  "küçük",
  "eski",
  "yeni",
  "önemli",
  "farklı",
  "etkin",
  "doğal",
  "yaşamsal",
  "bilinçli",
  "tasarruflu",
  "düzenli",
  "fiziksel",
  "ruhsal",
  "eleştirel",
  "gerçek",
  "kurmaca",
  "belirleyici",
  "olumlu",
  "olumsuz",
  "geniş",
  "dar",
  "uzun",
  "kısa",
  "güçlü",
  "zayıf",
]);

const COMMON_NOUNS = new Set([
  "dünya",
  "ekosistem",
  "insan",
  "varlık",
  "kaynak",
  "tehdit",
  "tür",
  "yazar",
  "öykü",
  "okur",
  "metin",
  "bilgi",
  "kitap",
  "su",
  "spor",
  "sağlık",
  "düşünce",
  "amaç",
  "afet",
  "denge",
  "hız",
  "ilişki",
  "oluş",
  "parça",
]);

const COMMON_DETERMINERS = new Set([
  "bu",
  "şu",
  "o",
  "bazı",
  "birçok",
  "birkaç",
  "her",
  "hiçbir",
  "aynı",
]);

const NON_NOUNS = new Set([
  "ancak",
  "aynı",
  "başka",
  "bile",
  "gibi",
  "göre",
  "için",
  "ile",
  "olarak",
  "sonra",
  "önce",
  "üzere",
  "yalnızca",
  "bugüne",
  "günümüzde",
  "değil",
  "sanki",
  "sonuçta",
]);

const SAFE_ADJECTIVES = new Set([
  "büyük",
  "küçük",
  "eski",
  "yeni",
  "önemli",
  "farklı",
  "etkin",
  "doğal",
  "yaşamsal",
  "bilinçli",
  "tasarruflu",
  "düzenli",
  "fiziksel",
  "ruhsal",
  "eleştirel",
  "gerçek",
  "kurmaca",
  "belirleyici",
  "olumlu",
  "olumsuz",
  "geniş",
  "dar",
  "uzun",
  "kısa",
  "güçlü",
  "zayıf",
  "canlı",
  "cansız",
  "kırmızı",
  "soğuk",
]);

const SAFE_NOUN_ROOTS = new Set([
  "dünya",
  "ekosistem",
  "insan",
  "varlık",
  "kaynak",
  "tehdit",
  "tür",
  "yazar",
  "öykü",
  "okur",
  "metin",
  "bilgi",
  "kitap",
  "su",
  "spor",
  "sağlık",
  "düşünce",
  "amaç",
  "afet",
  "denge",
  "hız",
  "ilişki",
  "oluş",
  "parça",
  "not",
  "neden",
  "anlatım",
  "biçim",
  "elma",
  "ev",
  "hayat",
  "iz",
  "kalem",
  "kapı",
  "kol",
  "okul",
  "öğrenci",
  "öğretmen",
  "soru",
  "türkçe",
  "yol",
]);

const NUMBER_WORDS = new Set([
  "bir",
  "iki",
  "üç",
  "dört",
  "beş",
  "altı",
  "yedi",
  "sekiz",
  "dokuz",
  "on",
]);

const NON_ADJECTIVE_WORDS = new Set([
  "anlatıcı",
  "neden",
  "öğretmen",
  "öğrenci",
  "yazar",
]);

const TOPIC_PROFILES = [
  {
    terms: ["yazar adayları", "kitap okumuyorum", "etkisinde", "etkilenmek", "ilham", "üslubunu", "yazma alışkanlığı", "kendi tarzınızı"],
    topic: "yazar adaylarının başka yazarlardan etkilenerek kendi yazma tarzlarını geliştirmesi",
    mainIdea:
      "Sevilen yazarlardan etkilenmek, yazmaya yeni başlayan kişiler için olumsuz değil; yazma alışkanlığı ve özgün tarz kazanma sürecini destekleyen bir durumdur.",
    direct: "Metinde, sevilen bir yazardan etkilenmenin sanıldığı gibi olumsuz olmadığı belirtilmektedir.",
    inference: "Bir yazar adayının başlangıçta başkalarının üslubundan etkilenmesi, zamanla kendi anlatımını bulmasına yardımcı olabilir.",
    wrong: "Yazar adaylarının iyi yazabilmesi için başka yazarları okumaktan tamamen kaçınması gerekir.",
    topicWrong: "Yazarların kitap okuma alışkanlığını tamamen bırakması",
    title: "Etkilenmekten Özgünlüğe",
    titleOptions: ["Yazarlıkta İlhamın Önemi", "Okuyarak Yazmayı Öğrenmek", "Üsluptan Tarza Giden Yol"],
    textType: "Tartışmacı anlatım",
    answeredQuestion: "Yazar adayları başka yazarlardan etkilenmeyi nasıl değerlendirmelidir?",
    support: [
      "Sevilen bir yazardan etkilenmek olumsuz bir durum olarak görülmemelidir.",
      "Başka bir yazar, yazmaya başlayan kişi için ilham kaynağı olabilir.",
      "Bu süreç kişiye yazma alışkanlığı kazandırıp zamanla kendi tarzını bulmasına yardım eder.",
    ],
  },
  {
    terms: ["belgelerim", "gerçekmiş", "kurmaca", "tasarlamış", "anlatılanların", "yaşanmışlık", "gerçeklik izlenimi"],
    topic: "yazarın kurmaca metinlerde gerçeklik izlenimi oluşturma çabası",
    mainIdea:
      "Yazar, anlatılarını gerçek belgelere dayanıyormuş gibi kurgulayarak okurda yaşanmışlık duygusu uyandırmak istemiştir.",
    direct:
      "Anlatılanların gerçekmiş gibi görünmesi, yazarın bu etkiyi baştan tasarlamış olmasıyla ilişkilidir.",
    inference:
      "Yazarın amacı, kurmaca ile gerçeklik arasındaki sınırı okur açısından belirsizleştirmektir.",
    wrong:
      "Yazarın amacı, metinlerinin kurmaca olduğunu özellikle gizlemeden ve gerçeklik izlenimi oluşturmadan anlatmaktır.",
    topicWrong:
      "Yazarın çocukluk anılarının kronolojik biçimde aktarılması",
    title: "Kurmaca ile Gerçeklik Arasında",
    titleOptions: ["Gerçeklik İzlenimi ve Kurmaca", "Belgelerle Kurulan Anlatı", "Öyküde Yaşanmışlık Etkisi"],
    textType: "Açıklayıcı anlatım",
    answeredQuestion: "Anlatılanlar neden gerçekten yaşanmış gibi görünmektedir?",
    support: [
      "Yazarın gerçekmiş gibi görünen öyküler kurmayı baştan tasarladığı anlaşılmaktadır.",
      "Metinde anlatılanların okurda yaşanmışlık izlenimi bıraktığı vurgulanmaktadır.",
      "Bu etki, yazarın bilinçli anlatım tercihiyle açıklanmaktadır.",
    ],
  },
  {
    terms: ["dünya", "ekosistem", "canlı", "cansız", "insanoğlu", "insan", "tehdit", "doğal afet", "yok oluş", "tür"],
    topic: "insanın Dünya ekosistemi içindeki yeri ve ekolojik dengeye etkisi",
    mainIdea:
      "İnsan, ekosistemin bir parçası olmasına rağmen canlı türlerinin yok oluşunu hızlandıran önemli tehdit kaynaklarından biri hâline gelmiştir.",
    direct: "İnsanoğlu ekosistemin etkin bir parçası olmakla birlikte bu sistem için önemli bir tehdit kaynağıdır.",
    inference: "İnsan faaliyetleri, doğal dengenin bozulmasında ve tür kayıplarının hızlanmasında etkili olabilir.",
    wrong: "Canlı türlerinin yok oluşunda insanın hiçbir etkisi bulunmamaktadır.",
    topicWrong: "Doğal afetlerin insan yaşamındaki olumlu sonuçları",
    title: "Dünya Ekosisteminde İnsan Etkisi",
    titleOptions: ["Altıncı Yok Oluş Tehlikesi", "İnsan ve Ekolojik Denge", "Ekosistemin En Büyük Tehdidi"],
    textType: "Açıklayıcı anlatım",
    answeredQuestion: "İnsanın ekosistem üzerindeki etkisi nasıl değerlendirilmektedir?",
    support: [
      "Dünya, canlı ve cansız varlıkların ilişkilerinden oluşan büyük bir ekosistemdir.",
      "İnsan bu ekosistemin hem etkin bir parçası hem de tehdit kaynaklarından biridir.",
      "Uzmanlara göre türlerin yok oluş hızında insan etkisi belirleyicidir.",
    ],
  },
  {
    terms: ["su", "tasarruf", "kuraklık", "tüketim", "bilinçli", "kaynak", "gelecek", "israf"],
    topic: "su kaynaklarının bilinçli kullanılması ve tasarrufun önemi",
    mainIdea: "Su kaynaklarını korumak için bireylerin günlük yaşamda bilinçli ve tasarruflu davranması gerekir.",
    direct: "Küçük önlemler bile su kaynaklarının korunmasına katkı sağlayabilir.",
    inference: "Bireysel davranışlar doğal kaynakların korunmasında etkili olabilir.",
    wrong: "Su kaynakları sınırsız olduğu için tasarruf yapmaya gerek yoktur.",
    topicWrong: "Suyun yalnızca sanayide kullanım alanları",
    title: "Su Tasarrufunun Önemi",
    titleOptions: ["Kuraklığa Karşı Bilinçli Tüketim", "Suyu Korumak Geleceği Korumaktır", "Kaynakları Bilinçli Kullanmak"],
    textType: "Açıklayıcı anlatım",
    answeredQuestion: "Su kaynaklarını korumak için bireylere hangi görev düşmektedir?",
    support: [
      "Su kaynakları sınırsız değildir.",
      "Bilinçli tüketim gelecek için önemlidir.",
      "Tasarruf, kuraklık riskine karşı alınabilecek önlemlerden biridir.",
    ],
  },
  {
    terms: ["kitap", "okuma", "okumak", "roman", "öykü", "düşünce", "hayal", "dil", "kelime"],
    topic: "kitap okumanın düşünce, dil ve hayal gücü üzerindeki etkileri",
    mainIdea:
      "Düzenli kitap okuma alışkanlığı bireyin düşünme becerisini, dil kullanımını ve hayal gücünü geliştirir.",
    direct: "Kitap okuma bireyin kelime dağarcığını ve düşünce dünyasını geliştirebilir.",
    inference: "Okuma alışkanlığı bireyin kendini daha iyi ifade etmesine katkı sağlayabilir.",
    wrong: "Kitap okuma, bireyin düşünme ve anlatma becerilerini olumsuz etkiler.",
    topicWrong: "Kitapların basım teknikleri ve fiyat değişimleri",
    title: "Kitap Okumanın Katkıları",
    titleOptions: ["Okuma Alışkanlığının Gücü", "Kitaplarla Gelişen Düşünce", "Hayal Gücünü Besleyen Kitaplar"],
    textType: "Açıklayıcı anlatım",
    answeredQuestion: "Kitap okuma bireye hangi yönlerden katkı sağlar?",
    support: [
      "Kitaplar farklı bakış açıları kazandırır.",
      "Okuma alışkanlığı dil gelişimini destekler.",
      "Hayal gücü ve düşünme becerisi kitaplarla gelişebilir.",
    ],
  },
  {
    terms: ["teknoloji", "internet", "dijital", "bilgi", "kaynak", "öğrenme", "araştırma", "eleştirel"],
    topic: "teknolojinin bilgiye ulaşma ve öğrenme sürecine etkisi",
    mainIdea:
      "Teknoloji bilgiye erişimi kolaylaştırsa da doğru bilgiyi seçme ve eleştirel düşünme becerisini daha önemli hâle getirmiştir.",
    direct: "Teknoloji sayesinde bilgiye ulaşmak eskiye göre daha hızlı ve kolaydır.",
    inference: "Bilgi kaynaklarının artması, doğru bilgiyi ayırt etmeyi gerekli kılar.",
    wrong: "İnternette ulaşılan bütün bilgiler güvenilir ve sorgulanmadan kullanılabilir niteliktedir.",
    topicWrong: "Teknolojik araçların üretim maliyetleri",
    title: "Teknoloji ve Doğru Bilgi",
    titleOptions: ["Dijital Çağda Seçici Olmak", "Bilgiye Erişim ve Eleştirel Düşünme", "Teknolojinin Öğrenmeye Etkisi"],
    textType: "Açıklayıcı anlatım",
    answeredQuestion: "Teknoloji bilgiye ulaşma sürecini nasıl etkilemiştir?",
    support: [
      "Bilgiye ulaşmak kolaylaşmıştır.",
      "Kaynak sayısının artması seçici olmayı gerektirir.",
      "Eleştirel düşünme dijital çağda önem kazanmıştır.",
    ],
  },
  {
    terms: ["spor", "beden", "sağlık", "ruhsal", "fiziksel", "hareket", "stres", "enerjik", "egzersiz"],
    topic: "sporun beden ve ruh sağlığı üzerindeki olumlu etkileri",
    mainIdea:
      "Düzenli spor yapmak, bireyin hem fiziksel sağlığını korur hem de ruhsal açıdan daha dengeli olmasına katkı sağlar.",
    direct: "Spor yapmak kişinin bedensel ve ruhsal sağlığını destekler.",
    inference: "Düzenli hareket eden bireyler kendilerini daha sağlıklı ve enerjik hissedebilir.",
    wrong: "Sporun insan sağlığı üzerinde herhangi bir olumlu etkisi yoktur.",
    topicWrong: "Spor karşılaşmalarının tarihsel sıralaması",
    title: "Sporun Sağlığa Katkıları",
    titleOptions: ["Düzenli Hareketin Önemi", "Beden ve Ruh Sağlığı İçin Spor", "Hareketli Yaşamın Gücü"],
    textType: "Açıklayıcı anlatım",
    answeredQuestion: "Düzenli spor yapmak bireye hangi açılardan katkı sağlar?",
    support: [
      "Spor beden sağlığını destekler.",
      "Düzenli hareket ruhsal dengeye katkı sağlar.",
      "Stresle baş etmede fiziksel aktivite etkili olabilir.",
    ],
  },
];

function normalize(text) {
  return text.toLocaleLowerCase("tr-TR");
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

function cleanSentence(sentence) {
  return sentence.replace(/[.!?]$/, "").trim();
}

function shorten(text, maxLength = 165) {
  const clean = cleanSentence(text);
  return clean.length <= maxLength ? clean : `${clean.slice(0, maxLength).trim()}...`;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function getContentWords(text) {
  return tokenize(text)
    .map(cleanWord)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word) && !/^\d+$/.test(word));
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

function scoreProfile(text, profile) {
  const lower = normalize(text);
  return profile.terms.reduce((score, term) => (lower.includes(term) ? score + 1 : score), 0);
}

function findProfile(text) {
  const best = TOPIC_PROFILES.map((profile) => ({ profile, score: scoreProfile(text, profile) })).sort(
    (a, b) => b.score - a.score,
  )[0];

  return best?.score >= 2 ? best.profile : null;
}

function inferTextType(text) {
  const lower = normalize(text);

  if (/(bence|savunur|kanıtlar|gereklidir|olmalıdır|yanlıştır|doğrudur|oysa|halbuki)/.test(lower)) {
    return "Tartışmacı anlatım";
  }

  if (/(kahraman|olay|zaman|yer|yaşadı|gördü|duydu|geldi|gitti|başladı)/.test(lower)) {
    return "Öyküleyici anlatım";
  }

  if (/(masmavi|yemyeşil|sessiz|karanlık|aydınlık|güzel|uzun|kısa|geniş|dar|sıcak|soğuk)/.test(lower)) {
    return "Betimleyici anlatım";
  }

  return "Açıklayıcı anlatım";
}

function findMainIdea(sentences, keywords) {
  const markers = /(bu nedenle|bu yüzden|sonuç olarak|dolayısıyla|kısacası|özetle|böylece|temel sebep|en önemli|asıl|ancak|fakat)/i;
  const keywordSet = new Set(keywords.slice(0, 8));

  const scored = sentences.map((sentence, index) => {
    const words = getContentWords(sentence);
    const keywordScore = words.reduce((score, word) => score + (keywordSet.has(word) ? 1.4 : 0), 0);
    const markerScore = markers.test(sentence) ? 4 : 0;
    const positionScore = index === sentences.length - 1 ? 2 : index === 0 ? 0.5 : 0;
    const lengthScore = Math.min(words.length / 9, 2);

    return { sentence: cleanSentence(sentence), score: keywordScore + markerScore + positionScore + lengthScore };
  });

  return scored.sort((a, b) => b.score - a.score)[0]?.sentence || cleanSentence(sentences.at(-1) || sentences[0] || "");
}

function makeGenericAnalysis(paragraph) {
  const sentences = splitSentences(paragraph).map(cleanSentence);
  const keywords = getKeywords(paragraph);
  const mainIdea = findMainIdea(sentences, keywords);
  const first = sentences[0] || mainIdea;
  const second = sentences.find((sentence) => sentence !== first) || mainIdea;
  const focus = keywords.slice(0, 3).join(", ");
  const textType = inferTextType(paragraph);
  const titleSeed = keywords.slice(0, 2).map(toTitleCase).join(" ve ");

  return {
    topic: focus ? `parçada ${focus} ekseninde ele alınan düşünce` : shorten(first, 120),
    mainIdea: shorten(mainIdea, 190),
    direct: shorten(first, 180),
    inference: `${shorten(mainIdea, 150)} yargısından hareketle metindeki asıl vurgunun bu düşünce etrafında toplandığı söylenebilir.`,
    wrong: "Parçada sözü edilen durumun metnin ana düşüncesiyle hiçbir ilgisi olmadığı savunulmaktadır.",
    topicWrong: "Metindeki olayların kronolojik bir macera şeklinde anlatılması",
    title: titleSeed ? `${titleSeed} Üzerine` : "Parçanın Ana Düşüncesi",
    titleOptions: [
      titleSeed ? `${titleSeed} ve Ana Düşünce` : "Metnin Temel Düşüncesi",
      "Parçada Verilen Temel Mesaj",
      "Düşüncenin Dayanakları",
    ],
    textType,
    answeredQuestion: "Parçada hangi düşünce üzerinde durulmaktadır?",
    support: unique([first, second, mainIdea]).filter(Boolean).slice(0, 3),
    keywords,
  };
}

function getAnalysis(paragraph) {
  const profile = findProfile(paragraph);

  if (profile) {
    return {
      ...profile,
      keywords: getKeywords(paragraph),
    };
  }

  return makeGenericAnalysis(paragraph);
}

function toTitleCase(text) {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 6)
    .map((word) => `${word.charAt(0).toLocaleUpperCase("tr-TR")}${word.slice(1)}`)
    .join(" ");
}

function capitalizeFirst(text) {
  if (!text) return text;
  return `${text.charAt(0).toLocaleUpperCase("tr-TR")}${text.slice(1)}`;
}

function option(text, isCorrect = false, reason = "") {
  const cleanText = typeof text === "string" ? text.replace(/[.!?]\s*$/u, "") : text;
  return { text: cleanText, isCorrect, reason };
}

function compactOptions(options) {
  const seen = new Set();
  const cleaned = [];

  for (const current of options) {
    const key = normalize(current.text).replace(/\s+/g, " ").trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    cleaned.push(current);
  }

  return cleaned.slice(0, 4);
}

function rotateOptions(options, offset) {
  const clean = compactOptions(options);
  return [...clean.slice(offset), ...clean.slice(0, offset)].slice(0, 4);
}

function makeQuestion({ id, type, question, options, explanation }, offset = 0) {
  const finalOptions = rotateOptions(options, offset);
  const correctIndex = Math.max(0, finalOptions.findIndex((item) => item.isCorrect));

  return {
    id,
    type,
    question,
    options: finalOptions.map((item, index) => ({
      key: String.fromCharCode(65 + index),
      text: item.text,
      reason: item.reason,
    })),
    correctKey: String.fromCharCode(65 + correctIndex),
    answer: finalOptions[correctIndex]?.text || "",
    explanation,
  };
}

function getTextTypeExplanation(textType) {
  if (textType === "Tartışmacı anlatım") {
    return "Parçada bir düşünce savunulduğu ya da okuyucu belli bir görüşe yönlendirildiği için bu seçenek doğrudur.";
  }

  if (textType === "Öyküleyici anlatım") {
    return "Parçada olay akışı, kişi, zaman veya hareket unsurları öne çıktığı için bu seçenek doğrudur.";
  }

  if (textType === "Betimleyici anlatım") {
    return "Parçada varlıkların ayırt edici özellikleri betimlenerek aktarıldığı için bu seçenek doğrudur.";
  }

  return "Parçada bilgi verme ve bir düşünceyi açıklama amacı ağır bastığı için bu seçenek doğrudur.";
}

function stripCaseSuffix(word) {
  return word.replace(/(da|de|dan|den|tan|ten|nın|nin|nun|nün|ın|in|un|ün|ı|i|u|ü|a|e)$/i, "");
}

function stripNominalSuffixes(word) {
  const suffixes = [
    "larından",
    "lerinden",
    "larının",
    "lerinin",
    "lardan",
    "lerden",
    "ların",
    "lerin",
    "sının",
    "sinin",
    "sunun",
    "sünün",
    "nın",
    "nin",
    "nun",
    "nün",
    "dan",
    "den",
    "tan",
    "ten",
    "dır",
    "dir",
    "dur",
    "dür",
    "tır",
    "tir",
    "tur",
    "tür",
    "sı",
    "si",
    "su",
    "sü",
    "ya",
    "ye",
    "yı",
    "yi",
    "yu",
    "yü",
    "da",
    "de",
    "ta",
    "te",
    "na",
    "ne",
  ];

  let base = word;
  let changed = true;

  while (changed) {
    changed = false;
    for (const suffix of suffixes) {
      if (base.endsWith(suffix) && base.length - suffix.length > 3) {
        base = base.slice(0, -suffix.length);
        changed = true;
        break;
      }
    }
  }

  return base;
}

function originalMatches(paragraph, predicate) {
  return unique(tokenize(paragraph).filter((word) => predicate(cleanWord(word), word))).slice(0, 24);
}

function findVerbals(paragraph) {
  const words = tokenize(paragraph);
  const falseVerbals = new Set(["bunlar", "şunlar", "onlar", "meydana", "kaynaklar", "varlıklar", "insanlar", "baştan"]);
  const notVerbals = new Set(["gerçekmiş", "değilmiş", "varmış", "yokmuş"]);
  const groups = {
    isimFiiller: [],
    sifatFiiller: [],
    zarfFiiller: [],
  };

  for (const original of words) {
    const word = cleanWord(original);
    if (falseVerbals.has(word) || notVerbals.has(word)) continue;
    if (/(mıştır|miştir|muştur|müştür|dı|di|du|dü|tı|ti|tu|tü|yor)$/.test(word)) continue;

    const base = stripCaseSuffix(word);
    const nominalBase = stripNominalSuffixes(word);

    if (/(ıp|ip|up|üp|arak|erek|ınca|ince|unca|ünce|ken|madan|meden|maksızın|meksizin)$/.test(base) && base.length > 5) {
      groups.zarfFiiller.push(original);
      continue;
    }

    if (
      !/(mış|miş|muş|müş)$/.test(nominalBase) &&
      (
        /(mak|mek)$/.test(nominalBase) ||
        /(ma|me)$/.test(nominalBase) ||
        /(?<!m)(ış|iş|uş|üş)$/.test(nominalBase)
      ) &&
      nominalBase.length > 4
    ) {
      groups.isimFiiller.push(original);
      continue;
    }

    if (
      (
        /(an|en|ası|esi|maz|mez|dık|dik|duk|dük|tık|tik|tuk|tük|acak|ecek|mış|miş|muş|müş)$/.test(nominalBase) ||
        /(dığı|diği|duğu|düğü|tığı|tiği|tuğu|tüğü)$/.test(word)
      ) &&
      nominalBase.length > 5
    ) {
      groups.sifatFiiller.push(original);
      continue;
    }
  }

  return {
    isimFiiller: unique(groups.isimFiiller),
    sifatFiiller: unique(groups.sifatFiiller),
    zarfFiiller: unique(groups.zarfFiiller),
  };
}

function isLikelyVerbPredicate(word) {
  if (!word) return false;
  if (/(lar|ler)$/.test(word)) return false;
  if (
    /(dır|dir|dur|dür|tır|tir|tur|tür)$/.test(word) &&
    !/(maktadır|mektedir|mıştır|miştir|muştur|müştür)$/.test(word)
  ) {
    return false;
  }

  return (
    /(maktadır|mektedir)$/.test(word) ||
    /(yor|dı|di|du|dü|tı|ti|tu|tü|mış|miş|muş|müş|mıştır|miştir|muştur|müştür|acak|ecek|malı|meli|maz|mez)$/.test(word) ||
    /(ar|er|ır|ir|ur|ür)$/.test(word)
  );
}

function hasCopulaSuffix(word) {
  return !!word && /(dır|dir|dur|dür|tır|tir|tur|tür)$/.test(word) && !/(mıştır|miştir|muştur|müştür)$/.test(word);
}

function inferSentenceKind(sentence) {
  const clean = cleanSentence(sentence);
  const words = tokenize(clean).map(cleanWord);
  const last = words.at(-1) || "";
  const predicateIndex = words.findLastIndex(isLikelyVerbPredicate);
  const isVerbSentence = !hasCopulaSuffix(last) && predicateIndex >= 0;
  const hasNegativeMarker =
    /\bdeğil/i.test(clean) ||
    words.some((word) => /(madı|medi|maz|mez|mıyor|miyor|muyor|müyor|mayacak|meyecek|mamış|memiş)$/.test(word));

  return {
    predicateType: isVerbSentence ? "Fiil cümlesi" : "İsim cümlesi",
    meaningType: hasNegativeMarker ? "Olumsuz cümle" : "Olumlu cümle",
    orderType:
      predicateIndex >= 0 && predicateIndex !== words.length - 1 && !hasCopulaSuffix(last)
        ? "Devrik cümle"
        : "Kurallı cümle",
  };
}

function findAdjectives(paragraph) {
  const words = tokenize(paragraph);
  const matches = [];

  for (let index = 0; index < words.length - 1; index += 1) {
    const original = words[index];
    const word = cleanWord(original);
    const next = cleanWord(words[index + 1]);

    if (/(dan|den|tan|ten)$/.test(word)) continue;
    if (next === "değil") continue;
    if (!isLikelyAdjectiveWord(word)) continue;
    if (!isSimpleNoun(next)) continue;

    matches.push(original);
  }

  return unique(matches).slice(0, 24);
}

function isLikelyNoun(word) {
  const base = getPhraseRoot(word);
  return (
    SAFE_NOUN_ROOTS.has(base) ||
    COMMON_NOUNS.has(base) ||
    (
      base.length > 3 &&
      !STOP_WORDS.has(base) &&
      !SAFE_ADJECTIVES.has(base) &&
      !COMMON_ADJECTIVES.has(base) &&
      !COMMON_DETERMINERS.has(base) &&
      !NON_NOUNS.has(base) &&
      !isLikelyVerbPredicate(base)
    )
  );
}

function getPhraseRoot(word) {
  let base = stripNominalSuffixes(word);

  if (SAFE_NOUN_ROOTS.has(base) || SAFE_ADJECTIVES.has(base) || COMMON_NOUNS.has(base) || COMMON_ADJECTIVES.has(base)) return base;

  if (/(ları|leri|larıdır|leridir|larından|lerinden|larının|lerinin)$/.test(base)) {
    base = base.replace(/(larıdır|leridir|larından|lerinden|larının|lerinin|ları|leri)$/i, "");
  }

  if (/(sı|si|su|sü|sıdır|sidir|sudur|südür)$/.test(base)) {
    base = base.replace(/(sıdır|sidir|sudur|südür|sı|si|su|sü)$/i, "");
  } else if (/[ıiuü]$/.test(base) && !/(lı|li|lu|lü|sız|siz|suz|süz)$/.test(base)) {
    base = base.slice(0, -1);
  }

  const softeningMap = [
    [/c$/, "ç"],
    [/g$/, "k"],
    [/ğ$/, "k"],
    [/d$/, "t"],
    [/b$/, "p"],
  ];

  for (const [pattern, replacement] of softeningMap) {
    const candidate = base.replace(pattern, replacement);
    if (SAFE_NOUN_ROOTS.has(candidate) || COMMON_NOUNS.has(candidate)) return candidate;
  }

  return base;
}

function hasGenitiveSuffix(word) {
  return /(ın|in|un|ün|nın|nin|nun|nün)$/.test(word);
}

function hasTamlananSuffix(word) {
  if (SAFE_NOUN_ROOTS.has(word) || COMMON_NOUNS.has(word)) return false;

  const rootAfterSingleVowel = word.replace(/[ıiuü]$/i, "");

  return (
    /(sı|si|su|sü|ları|leri)$/.test(word) ||
    /(sıdır|sidir|sudur|südür|ıdır|idir|udur|üdür)$/.test(word) ||
    /(ını|ini|unu|ünü|sını|sini|sunu|sünü)$/.test(word) ||
    /(ından|inden|undan|ünden|sından|sinden|sundan|sünden)$/.test(word) ||
    /(larına|lerine|larını|lerini|larının|lerinin|larından|lerinden)$/.test(word) ||
    (
      /[ıiuü]$/.test(word) &&
      !/(yı|yi|yu|yü|lı|li|lu|lü|sız|siz|suz|süz)$/.test(word) &&
      (SAFE_NOUN_ROOTS.has(rootAfterSingleVowel) || SAFE_NOUN_ROOTS.has(rootAfterSingleVowel.replace(/c$/, "ç")))
    )
  );
}

function classifyNounPhrase(first, second) {
  const firstGenitive = hasGenitiveSuffix(first);
  const secondPossessive = hasTamlananSuffix(second);

  if (!secondPossessive) return "";
  if (firstGenitive) return "belirtili";
  return "belirtisiz";
}

function isLikelyAdjectiveWord(word) {
  const base = stripCaseSuffix(word);
  const root = getPhraseRoot(word);

  if (NON_ADJECTIVE_WORDS.has(word) || NON_ADJECTIVE_WORDS.has(base) || NON_ADJECTIVE_WORDS.has(root)) return false;
  if ((SAFE_NOUN_ROOTS.has(root) || COMMON_NOUNS.has(root)) && !SAFE_ADJECTIVES.has(root) && !COMMON_DETERMINERS.has(root)) {
    return false;
  }

  return (
    SAFE_ADJECTIVES.has(word) ||
    SAFE_ADJECTIVES.has(base) ||
    COMMON_ADJECTIVES.has(word) ||
    COMMON_ADJECTIVES.has(base) ||
    COMMON_DETERMINERS.has(word) ||
    COMMON_DETERMINERS.has(base) ||
    NUMBER_WORDS.has(word) ||
    NUMBER_WORDS.has(base) ||
    /^(kaç|kaçıncı|hangi)$/.test(word) ||
    /^(kaç|kaçıncı|hangi)$/.test(base) ||
    /^\d+$/.test(base) ||
    /(sal|sel|ki)$/.test(base) ||
    /(an|en|acak|ecek|mış|miş|muş|müş|dık|dik|duk|dük|tık|tik|tuk|tük|dığı|diği|duğu|düğü|tığı|tiği|tuğu|tüğü)$/.test(base)
  );
}

function isParticipleLike(word) {
  const base = stripNominalSuffixes(word);
  return /(dık|dik|duk|dük|tık|tik|tuk|tük|dığı|diği|duğu|düğü|tığı|tiği|tuğu|tüğü|an|en|mış|miş|muş|müş)$/.test(base);
}

function isVerbalNounLike(word) {
  const base = stripNominalSuffixes(word);
  return /(mak|mek|ma|me|ış|iş|uş|üş)$/.test(base) || /y[ıiuü]$/.test(word);
}

function shouldSkipPhrase(first, second) {
  return (
    (STOP_WORDS.has(first) && !COMMON_DETERMINERS.has(first)) ||
    STOP_WORDS.has(second) ||
    NON_NOUNS.has(first) ||
    NON_NOUNS.has(second) ||
    isLikelyVerbPredicate(first) ||
    isLikelyVerbPredicate(second)
  );
}

function simpleNounRoot(word) {
  let root = word.replace(/(lar|ler)$/i, "");

  if (SAFE_NOUN_ROOTS.has(root) || COMMON_NOUNS.has(root)) return root;

  root = root.replace(/(ları|leri|sı|si|su|sü)$/i, "");
  if (SAFE_NOUN_ROOTS.has(root) || COMMON_NOUNS.has(root)) return root;

  root = word.replace(/[ıiuü]$/i, "");
  const softened = root.replace(/c$/i, "ç").replace(/ğ$/i, "k").replace(/d$/i, "t").replace(/b$/i, "p");

  if (SAFE_NOUN_ROOTS.has(root) || COMMON_NOUNS.has(root)) return root;
  if (SAFE_NOUN_ROOTS.has(softened) || COMMON_NOUNS.has(softened)) return softened;

  return word;
}

function isSimpleNoun(word) {
  const root = simpleNounRoot(word);

  return (
    SAFE_NOUN_ROOTS.has(root) ||
    COMMON_NOUNS.has(root) ||
    (
      root.length > 2 &&
      !STOP_WORDS.has(root) &&
      !NON_NOUNS.has(root) &&
      !SAFE_ADJECTIVES.has(root) &&
      !COMMON_DETERMINERS.has(root) &&
      !isLikelyVerbPredicate(root)
    )
  );
}

function isSimpleTamlanan(word) {
  if (SAFE_NOUN_ROOTS.has(word) || COMMON_NOUNS.has(word)) return false;

  const withoutFinalVowel = word.replace(/[ıiuü]$/i, "");
  const softened = withoutFinalVowel.replace(/c$/i, "ç").replace(/ğ$/i, "k").replace(/d$/i, "t").replace(/b$/i, "p");

  return (
    /(sı|si|su|sü|ları|leri)$/.test(word) ||
    /(ını|ini|unu|ünü|sını|sini|sunu|sünü)$/.test(word) ||
    /(ından|inden|undan|ünden|sından|sinden|sundan|sünden)$/.test(word) ||
    SAFE_NOUN_ROOTS.has(withoutFinalVowel) ||
    SAFE_NOUN_ROOTS.has(softened)
  );
}

function cleanPhraseWord(word) {
  return word.replace(/(da|de|ta|te|dan|den|tan|ten)$/i, "");
}

function formatPhrase(words, type) {
  return `${words.map(cleanPhraseWord).join(" ")} (${type})`;
}

function findPhrases(paragraph) {
  const nounPhrases = [];
  const adjectivePhrases = [];
  const segments = paragraph
    .split(/[,.!?;:]+/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  for (const segment of segments) {
    const words = tokenize(segment);
    const normalized = words.map(cleanWord);

    for (let index = 0; index < words.length - 1; index += 1) {
      const first = normalized[index];
      const second = normalized[index + 1];
      const firstBase = getPhraseRoot(first);
      const secondBase = getPhraseRoot(second);

      const third = normalized[index + 2];
      if (third) {
        const thirdBase = getPhraseRoot(third);

        if (
          isLikelyAdjectiveWord(first) &&
          second === "bir" &&
          !STOP_WORDS.has(third) &&
          !NON_NOUNS.has(third) &&
          !isLikelyVerbPredicate(third) &&
          (isLikelyNoun(thirdBase) || third.length > 3)
        ) {
          adjectivePhrases.push(formatPhrase([words[index], words[index + 1], words[index + 2]], "belirtme sıfatı"));
        }
      }

      const secondTamlanan = isSimpleTamlanan(second);
      const nounPhraseType = hasGenitiveSuffix(first) && secondTamlanan ? "belirtili" : !hasGenitiveSuffix(first) && secondTamlanan ? "belirtisiz" : "";

      if (
        nounPhraseType &&
        isSimpleNoun(first) &&
        isSimpleNoun(second) &&
        !isLikelyAdjectiveWord(first) &&
        !(hasTamlananSuffix(first) && !hasGenitiveSuffix(first)) &&
        !isParticipleLike(second) &&
        (nounPhraseType === "belirtili" || !isVerbalNounLike(first))
      ) {
        nounPhrases.push(formatPhrase([words[index], words[index + 1]], nounPhraseType));
        continue;
      }

      if (
        isLikelyAdjectiveWord(first) &&
        isSimpleNoun(second) &&
        !secondTamlanan
      ) {
        const adjectiveType =
          COMMON_DETERMINERS.has(first) || NUMBER_WORDS.has(first) || /^(kaç|kaçıncı|hangi)$/.test(first) || /^\d+$/.test(first)
            ? "belirtme sıfatı"
            : "niteleme sıfatı";
        adjectivePhrases.push(formatPhrase([words[index], words[index + 1]], adjectiveType));
        continue;
      }

      if (shouldSkipPhrase(first, second)) continue;

      const legacyNounPhraseType = classifyNounPhrase(first, second);

      if (
        legacyNounPhraseType &&
        isLikelyNoun(firstBase) &&
        isLikelyNoun(secondBase) &&
        !(hasTamlananSuffix(first) && !hasGenitiveSuffix(first)) &&
        !isParticipleLike(second) &&
        !isLikelyAdjectiveWord(first) &&
        (legacyNounPhraseType === "belirtili" || !isVerbalNounLike(first))
      ) {
        nounPhrases.push(formatPhrase([words[index], words[index + 1]], legacyNounPhraseType));
        continue;
      }

      if (
        isLikelyAdjectiveWord(first) &&
        isLikelyNoun(secondBase) &&
        !hasTamlananSuffix(second)
      ) {
        const adjectiveType =
          COMMON_DETERMINERS.has(first) || NUMBER_WORDS.has(first) || /^(kaç|kaçıncı|hangi)$/.test(first) || /^\d+$/.test(first)
            ? "belirtme sıfatı"
            : "niteleme sıfatı";
        adjectivePhrases.push(formatPhrase([words[index], words[index + 1]], adjectiveType));
      }
    }
  }

  return {
    nounPhrases: unique(nounPhrases).slice(0, 18),
    adjectivePhrases: unique(adjectivePhrases).slice(0, 18),
  };
}

export function analyzeLanguage(paragraph) {
  const sentences = splitSentences(paragraph);
  const verbals = findVerbals(paragraph);
  const phrases = findPhrases(paragraph);

  return {
    verbals: [
      {
        label: "İsim-fiiller",
        items: verbals.isimFiiller,
        explanation: "-ma, -me, -mak, -mek, -ış, -iş, -uş, -üş ekleriyle adlaşan fiilimsi örnekleri.",
      },
      {
        label: "Sıfat-fiiller",
        items: verbals.sifatFiiller,
        explanation: "-an, -en, -dık, -ecek, -miş gibi eklerle isimleri niteleyen fiilimsi örnekleri.",
      },
      {
        label: "Zarf-fiiller",
        items: verbals.zarfFiiller,
        explanation: "-ıp, -arak, -ince, -ken, -meden gibi eklerle eylemin durumunu veya zamanını belirten fiilimsi örnekleri.",
      },
    ],
    sentenceTypes: sentences.map((sentence, index) => ({
      order: index + 1,
      sentence: cleanSentence(sentence),
      ...inferSentenceKind(sentence),
    })),
    adjectives: {
      label: "Sıfatlar",
      items: findAdjectives(paragraph),
      explanation: "İsimleri niteleyen ya da belirten sözcükler listelenmiştir.",
    },
    nounPhrases: {
      label: "İsim tamlamaları",
      items: phrases.nounPhrases,
      explanation: "Belirtili: tamlayan ve tamlanan ek alır. Belirtisiz: tamlayan ek almaz, tamlanan iyelik eki alır.",
    },
    adjectivePhrases: {
      label: "Sıfat tamlamaları",
      items: phrases.adjectivePhrases,
      explanation: "Sıfat + isim yapısındaki niteleme ya da belirtme görevli söz öbekleri.",
    },
  };
}

function getExamStyleChoices(analysis) {
  const topicText = normalize(`${analysis.topic} ${analysis.title}`);

  if (topicText.includes("yazar aday") || topicText.includes("etkilenmekten")) {
    return {
      mainIdeaCorrect: "Başka yazarlardan etkilenmenin kişinin kendi yazma tarzını bulmasına katkı sağlayabileceği",
      directCorrect: "Sevilen bir yazardan etkilenmenin olumsuz bir durum olmadığı",
      inferenceCorrect: "Yazmaya yeni başlayanların başkalarından etkilenerek zamanla özgünleşebileceği",
      notSaidCorrect: "Yazar adaylarının başarılı olmak için kitap okumaktan uzak durması gerektiği",
      topicCorrect: "Yazar adaylarının başka yazarlardan etkilenme süreci",
      mainIdeaWrong: [
        "Yazar adaylarının yalnızca kısa yazılar yazması gerektiği",
        "Başka yazarların üslubunu tanımanın özgünlüğü tamamen yok ettiği",
        "Okuma alışkanlığının yazma becerisiyle ilişkisinin bulunmadığı",
      ],
      directWrong: [
        "Yazar adaylarının hiçbir yazardan etkilenmemesi gerektiği",
        "Uzun hikâyelerin kısa yazılardan önce yazılması gerektiği",
        "Kendi tarzını bulmanın yalnızca doğuştan gelen yeteneğe bağlı olduğu",
      ],
      inferenceWrong: [
        "Bir yazardan etkilenmek yazarlık sürecini bütünüyle engeller",
        "Yazma alışkanlığı kazanmak için okumaya ihtiyaç yoktur",
        "Özgün üslup, deneme yapmadan kendiliğinden oluşur",
      ],
      topicWrong: [
        "Kitap okumamanın yazarlığa sağladığı yararlar",
        "Yazarların eserlerini yayımlama aşamaları",
        "Hikâye türünün tarihsel gelişimi",
      ],
      notSaidTruths: [
        "Sevilen bir yazardan etkilenmek olumsuz bir durum olarak görülmemelidir.",
        "Başka bir yazar, yazmaya başlayan kişi için ilham kaynağı olabilir.",
        "Zamanla farklı şeyler denenerek kişinin kendi tarzı bulunabilir.",
      ],
    };
  }

  if (topicText.includes("kurmaca") || topicText.includes("öykü")) {
    return {
      mainIdeaCorrect: "Kurmaca metinlerde gerçeklik duygusunun bilinçli biçimde oluşturulabileceği",
      directCorrect: "Yazarın, anlatılanları yaşanmış gibi gösterme amacı taşıdığı",
      inferenceCorrect: "Okurda gerçeklik izlenimi uyandırmanın yazarın anlatım tercihiyle ilgili olduğu",
      notSaidCorrect: "Yazarın yalnızca kendi çocukluk anılarını olduğu gibi aktardığı",
      topicCorrect: "Kurmaca metinlerde gerçeklik izlenimi oluşturma yolları",
      mainIdeaWrong: [
        "Belgelerin edebî metinlerde hiçbir işlevinin bulunmadığı",
        "Öykülerde olay sırasının anlatıcıdan daha önemli olduğu",
        "Anlatılanların tümüyle rastlantısal biçimde ortaya çıktığı",
      ],
      directWrong: [
        "Metinde belgelerin güvenilirliğinin tartışıldığı",
        "Yazarın olayları tarih sırasına göre verdiği",
        "Okurun anlatı karşısında edilgen kaldığı",
      ],
      inferenceWrong: [
        "Kurmaca metinlerin gerçekle hiçbir bağ kuramayacağı",
        "Yazarın anlatımda yalnızca kanıtlama yoluna başvurduğu",
        "Öykünün değerinin olayların sırasına bağlı olduğu",
      ],
      topicWrong: [
        "Yazarın çocukluk anılarının kronolojik biçimde aktarılması",
        "Belgelerin tarih araştırmalarındaki kullanım alanları",
        "Öykü kişilerinin fiziksel özelliklerinin tanıtılması",
      ],
      notSaidTruths: [
        "Anlatılanlarda yaşanmışlık izlenimi oluşturulmak istenmiştir.",
        "Gerçeklik duygusu yazarın bilinçli tercihiyle ilişkilidir.",
        "Belgeler, anlatının inandırıcılığını artıran bir unsur olarak kullanılmıştır.",
      ],
    };
  }

  if (topicText.includes("ekosistem") || topicText.includes("yok oluş")) {
    return {
      mainIdeaCorrect: "İnsanın ekosistemin dengesini bozabilecek önemli bir etkiye sahip olduğu",
      directCorrect: "İnsanın hem ekosistemin bir parçası hem de onun için tehdit kaynağı olduğu",
      inferenceCorrect: "Türlerin yok oluş hızında insan faaliyetlerinin belirleyici olabileceği",
      notSaidCorrect: "Canlı türlerinin yok oluşunda insan etkisinin bulunmadığı",
      topicCorrect: "İnsanın ekosistem üzerindeki etkileri",
      mainIdeaWrong: [
        "Doğal afetlerin insan yaşamını bütünüyle olumlu etkilediği",
        "Ekosistemdeki değişimlerin yalnızca iklim olaylarıyla açıklanabileceği",
        "Canlı ve cansız varlıklar arasında herhangi bir ilişkinin bulunmadığı",
      ],
      directWrong: [
        "Dünya'daki yok oluşların yalnızca geçmişte kaldığı",
        "İnsanın ekosistem dışında bağımsız bir varlık olduğu",
        "Uzmanların yok oluş hızı konusunda görüş belirtmediği",
      ],
      inferenceWrong: [
        "Ekolojik dengenin insan davranışlarından etkilenmediği",
        "Doğal yaşamın korunması için hiçbir önlem gerekmediği",
        "Tür kayıplarının insan etkinlikleriyle ilişkilendirilemeyeceği",
      ],
      topicWrong: [
        "Doğal afetlerin oluşum nedenleri",
        "Dünya'nın jeolojik katmanları",
        "Canlı türlerinin fiziksel özellikleri",
      ],
      notSaidTruths: [
        "Dünya büyük bir ekosistem olarak değerlendirilmiştir.",
        "İnsan, ekosistemin etkin bir parçası olarak görülmüştür.",
        "Altıncı yok oluşun başladığına ilişkin görüşlere yer verilmiştir.",
      ],
    };
  }

  if (topicText.includes("su") || topicText.includes("tasarruf")) {
    return {
      mainIdeaCorrect: "Su kaynaklarının korunması için bilinçli tüketimin gerekli olduğu",
      directCorrect: "Küçük önlemlerin su tasarrufuna katkı sağlayabileceği",
      inferenceCorrect: "Bireysel davranışların doğal kaynakların korunmasında etkili olabileceği",
      notSaidCorrect: "Su kaynaklarının sınırsız olduğu için tasarrufa gerek bulunmadığı",
      topicCorrect: "Su kaynaklarının bilinçli kullanılması",
      mainIdeaWrong: [
        "Suyun yalnızca sanayi alanında kullanılması gerektiği",
        "Kuraklığın günlük yaşamla ilişkisinin bulunmadığı",
        "Tasarrufun doğal kaynaklar üzerinde etkili olmadığı",
      ],
      directWrong: [
        "Su tüketiminin azaltılmasının mümkün olmadığı",
        "Kuraklığın yalnızca geçmiş dönemlerde görüldüğü",
        "Bireylerin kaynak kullanımı konusunda sorumluluk taşımadığı",
      ],
      inferenceWrong: [
        "Doğal kaynakların korunmasının yalnızca kurumlara bağlı olduğu",
        "Günlük alışkanlıkların çevre üzerinde etkili olmadığı",
        "Su sorununun gelecekle ilgili bir yönünün bulunmadığı",
      ],
      topicWrong: [
        "Suyun sanayide kullanım alanları",
        "Deniz canlılarının yaşam özellikleri",
        "Yağış türlerinin oluşum biçimleri",
      ],
      notSaidTruths: [
        "Su kaynaklarının korunması gerektiği vurgulanmıştır.",
        "Bilinçli tüketimin gelecek açısından önemli olduğu belirtilmiştir.",
        "Tasarrufun kuraklık riskine karşı etkili olabileceği anlatılmıştır.",
      ],
    };
  }

  if (topicText.includes("kitap") || topicText.includes("okuma")) {
    return {
      mainIdeaCorrect: "Kitap okumanın bireyin düşünce ve anlatım gücünü geliştirdiği",
      directCorrect: "Okumanın kelime dağarcığını ve düşünce dünyasını zenginleştirdiği",
      inferenceCorrect: "Düzenli okuyan kişilerin kendilerini daha etkili ifade edebileceği",
      notSaidCorrect: "Kitap okumanın düşünme ve anlatma becerilerini olumsuz etkilediği",
      topicCorrect: "Kitap okumanın bireye kazandırdıkları",
      mainIdeaWrong: [
        "Kitapların yalnızca eğlenme amacıyla okunması gerektiği",
        "Okuma alışkanlığının hayal gücüyle ilgisinin bulunmadığı",
        "Dilin gelişmesinde kitapların etkili olmadığı",
      ],
      directWrong: [
        "Kitap okumanın yalnızca akademik başarıyla sınırlı olduğu",
        "Roman ve öykülerin düşünce gelişimine katkı sağlamadığı",
        "Okuma alışkanlığının kişisel gelişimle ilişkilendirilemeyeceği",
      ],
      inferenceWrong: [
        "Kitap okuyan bireylerin farklı bakış açıları kazanamayacağı",
        "Okuma eyleminin yalnızca boş zamanı değerlendirme amacı taşıdığı",
        "Hayal gücünün kitaplardan bağımsız geliştiği",
      ],
      topicWrong: [
        "Kitapların basım teknikleri",
        "Kütüphanelerin mimari özellikleri",
        "Yazarların yaşam öyküleri",
      ],
      notSaidTruths: [
        "Okuma alışkanlığı dil gelişimini destekler.",
        "Kitaplar farklı bakış açıları kazandırabilir.",
        "Düşünme becerisi okuma yoluyla gelişebilir.",
      ],
    };
  }

  if (topicText.includes("teknoloji") || topicText.includes("bilgi")) {
    return {
      mainIdeaCorrect: "Teknolojinin bilgiye erişimi kolaylaştırırken seçici olmayı gerekli kıldığı",
      directCorrect: "Teknoloji sayesinde bilgiye daha hızlı ulaşılabildiği",
      inferenceCorrect: "Bilgi kaynaklarının çoğalmasının eleştirel düşünmeyi önemli hâle getirdiği",
      notSaidCorrect: "İnternetteki bütün bilgilerin sorgulanmadan kullanılabileceği",
      topicCorrect: "Teknolojinin bilgiye ulaşma sürecine etkisi",
      mainIdeaWrong: [
        "Dijital araçların öğrenme sürecini bütünüyle engellediği",
        "Bilgi kaynaklarının artmasının seçiciliği gereksiz kıldığı",
        "Teknolojinin yalnızca eğlence amacıyla kullanılması gerektiği",
      ],
      directWrong: [
        "İnternetin bilgiye ulaşmayı zorlaştırdığı",
        "Kaynak çeşitliliğinin doğru bilgiye ulaşmayı her zaman garanti ettiği",
        "Eleştirel düşünmenin dijital çağda önemini yitirdiği",
      ],
      inferenceWrong: [
        "Bilgiye hızlı ulaşmanın doğru bilgiye ulaşıldığı anlamına geldiği",
        "Teknolojik gelişmelerin öğrenmeyle ilgisinin bulunmadığı",
        "Kaynakların çoğalmasının değerlendirme yapmayı gerektirmediği",
      ],
      topicWrong: [
        "Teknolojik araçların üretim maliyetleri",
        "Bilgisayarların tarihsel gelişimi",
        "Sosyal medyada geçirilen süreler",
      ],
      notSaidTruths: [
        "Bilgiye ulaşmak eskiye göre kolaylaşmıştır.",
        "Kaynak sayısının artması seçici olmayı gerektirir.",
        "Eleştirel düşünme dijital çağda önem kazanmıştır.",
      ],
    };
  }

  if (topicText.includes("spor") || topicText.includes("sağlık")) {
    return {
      mainIdeaCorrect: "Düzenli sporun bedensel ve ruhsal sağlığı desteklediği",
      directCorrect: "Spor yapmanın fiziksel ve ruhsal yönden yarar sağladığı",
      inferenceCorrect: "Hareketli yaşamın kişinin kendini daha sağlıklı hissetmesine katkı sağlayabileceği",
      notSaidCorrect: "Sporun insan sağlığı üzerinde olumlu bir etkisinin bulunmadığı",
      topicCorrect: "Sporun insan sağlığına katkıları",
      mainIdeaWrong: [
        "Sporun yalnızca yarışma amacıyla yapılması gerektiği",
        "Fiziksel hareketin ruhsal dengeyle ilişkisinin bulunmadığı",
        "Sağlıklı yaşam için hareketten kaçınılması gerektiği",
      ],
      directWrong: [
        "Düzenli hareketin bedensel sağlığı olumsuz etkilediği",
        "Sporun yalnızca profesyoneller için gerekli olduğu",
        "Egzersizin stresle baş etmede hiçbir işlev taşımadığı",
      ],
      inferenceWrong: [
        "Spor yapmanın günlük yaşam kalitesiyle ilgisinin olmadığı",
        "Sağlıklı kalmanın yalnızca beslenmeye bağlı olduğu",
        "Hareketli yaşamın enerji düzeyini azaltacağı",
      ],
      topicWrong: [
        "Spor karşılaşmalarının tarihsel sıralaması",
        "Takım oyunlarının kuralları",
        "Spor araçlarının üretim biçimleri",
      ],
      notSaidTruths: [
        "Spor beden sağlığını destekler.",
        "Düzenli hareket ruhsal dengeye katkı sağlar.",
        "Fiziksel aktivite stresle baş etmede etkili olabilir.",
      ],
    };
  }

  const keywords = analysis.keywords?.slice(0, 3) || [];
  const focus = keywords.length > 0 ? keywords.map(toTitleCase).join(", ") : "Metindeki düşünce";

  return {
    mainIdeaCorrect: analysis.mainIdea,
    directCorrect: analysis.direct,
    inferenceCorrect: analysis.inference,
    notSaidCorrect: analysis.wrong,
    topicCorrect: capitalizeFirst(analysis.topic),
    mainIdeaWrong: [
      "Konunun yalnızca kişisel izlenimlerle sınırlı tutulduğu",
      `${focus} hakkında farklı görüşlerin karşılaştırıldığı`,
      "Düşüncenin olay örgüsü içinde dolaylı olarak sezdirildiği",
    ],
    directWrong: [
      `${focus} konusunda kesin bir sonuca ulaşılamadığı`,
      "Anlatılanların yalnızca geçmişte yaşanmış bir olaya bağlandığı",
      "Konunun nedenlerinden çok kişilerin özelliklerinin tanıtıldığı",
    ],
    inferenceWrong: [
      "Anlatılanların metnin temel düşüncesiyle çeliştiği",
      "Konunun yalnızca bireysel bir anı olarak ele alındığı",
      "Metindeki bilgilerin genelleme yapmaya elverişli olmadığı",
    ],
    topicWrong: [
      analysis.topicWrong,
      "Kişilerin fiziksel özelliklerinin tanıtılması",
      "Bir olayın oluş sırasına göre aktarılması",
    ],
    notSaidTruths: analysis.support,
  };
}

function relatedDistractors(analysis) {
  const examSet = getExamStyleChoices(analysis);
  return {
    mainIdea: examSet.mainIdeaWrong,
    direct: examSet.directWrong,
    inference: examSet.inferenceWrong,
    topic: examSet.topicWrong,
  };
  return {
    mainIdea: [
      analysis.wrong,
      `${analysis.topic} yalnızca yüzeysel bir ayrıntı olarak verilmiş, metnin temel düşüncesiyle ilişkilendirilmemiştir.`,
      "Parçada asıl amaç, okuyucuya olayların geçtiği yeri ayrıntılı biçimde betimlemektir.",
    ],
    direct: [
      analysis.wrong,
      `${analysis.topic} konusunda kesin bir yargıya varılamayacağı özellikle belirtilmiştir.`,
      "Parçada ele alınan durumun nedeni ve sonucu üzerinde hiç durulmamıştır.",
    ],
    inference: [
      analysis.wrong,
      "Metinde verilenlerden hareketle tam tersi bir sonuca ulaşmak gerekir.",
      "Parçada sözü edilen durum yalnızca kişisel bir anı olarak aktarılmıştır.",
    ],
    topic: [
      analysis.topicWrong,
      "Parçada kişilerin fiziksel özelliklerinin ayrıntılı biçimde betimlenmesi",
      "Bir olayın başlangıçtan sona kadar serim, düğüm ve çözüm bölümleriyle anlatılması",
    ],
  };
}

function makeEvidenceReason(analysis, message = "Bu seçeneği parçada verilen bilgiler destekler.") {
  const evidence = analysis.support?.[0] || analysis.direct || analysis.mainIdea;
  return evidence ? `${message} Parçada "${cleanSentence(evidence)}" ifadesi bu yargıya dayanak olur.` : message;
}

function makeWrongReason(analysis) {
  const evidence = analysis.support?.[0] || analysis.direct || analysis.mainIdea;
  const secondEvidence = analysis.support?.[2] || analysis.mainIdea;

  if (!evidence) {
    return "Bu seçenek parçadaki bilgilerle desteklenmez.";
  }

  if (secondEvidence && secondEvidence !== evidence) {
    return `Bu seçenek parçadaki düşünceyle uyuşmaz. Parçada "${cleanSentence(evidence)}" ve "${cleanSentence(secondEvidence)}" denerek farklı bir yargı ortaya konur.`;
  }

  return `Bu seçenek parçadaki düşünceyle uyuşmaz. Parçada "${cleanSentence(evidence)}" denerek farklı bir yargı ortaya konur.`;
}

function optionsWithReasons(texts, analysis, correctText = "") {
  return texts.map((text) => option(text, text === correctText, text === correctText ? makeEvidenceReason(analysis) : makeWrongReason(analysis)));
}

function getPassageSupport(paragraph, analysis) {
  const sentences = splitSentences(paragraph).map(cleanSentence).filter(Boolean);
  const lowerTopic = normalize(`${analysis.topic} ${analysis.title}`);

  if (lowerTopic.includes("yazar aday") || lowerTopic.includes("etkilenmekten")) {
    return unique([
      sentences.find((sentence) => /olumsuz|etkilenmek/i.test(sentence)),
      sentences.find((sentence) => /ilham/i.test(sentence)),
      sentences.find((sentence) => /yazma alışkanlığı|kendi tarz/i.test(sentence)),
    ]).filter(Boolean);
  }

  if (lowerTopic.includes("ekosistem") || lowerTopic.includes("yok oluş")) {
    return unique([
      sentences.find((sentence) => /tehdit|ekosistem/i.test(sentence)),
      sentences.find((sentence) => /yok oluş/i.test(sentence)),
      sentences.find((sentence) => /temel sebeb/i.test(sentence)),
    ]).filter(Boolean);
  }

  if (lowerTopic.includes("su") || lowerTopic.includes("tasarruf")) {
    return unique([
      sentences.find((sentence) => /su|tasarruf|kaynak/i.test(sentence)),
      sentences.find((sentence) => /kurak|gelecek|bilinç/i.test(sentence)),
    ]).filter(Boolean);
  }

  return unique([...sentences.slice(0, 2), ...(analysis.support || [])]).filter(Boolean).slice(0, 3);
}

export function generateQuestions(paragraph) {
  const analysis = getAnalysis(paragraph);
  const explanationAnalysis = { ...analysis, support: getPassageSupport(paragraph, analysis) };
  const examSet = getExamStyleChoices(analysis);
  const distractors = relatedDistractors(analysis);
  const support = analysis.support.length > 0 ? analysis.support : [analysis.direct, analysis.mainIdea];
  const titleOptions = [analysis.title, ...analysis.titleOptions].slice(0, 4);

  const questions = [
    makeQuestion(
      {
        id: "main-idea",
        type: "Ana düşünce",
        question: "Bu parçada asıl vurgulanmak istenen düşünce aşağıdakilerden hangisidir?",
        options: optionsWithReasons([examSet.mainIdeaCorrect, ...distractors.mainIdea], explanationAnalysis, examSet.mainIdeaCorrect),
        explanation: makeEvidenceReason(explanationAnalysis, "Doğru seçenek, parçanın ana düşüncesini karşılar."),
      },
      2,
    ),
    makeQuestion(
      {
        id: "certain",
        type: "Kesin yargı",
        question: "Bu parçadan aşağıdakilerden hangisine kesin olarak ulaşılabilir?",
        options: optionsWithReasons([examSet.directCorrect, ...distractors.direct], explanationAnalysis, examSet.directCorrect),
        explanation: makeEvidenceReason(explanationAnalysis, "Doğru seçenek metinde açıkça desteklenir."),
      },
      3,
    ),
    makeQuestion(
      {
        id: "not-said",
        type: "Söylenemez",
        question: "Bu parçaya göre aşağıdakilerden hangisi söylenemez?",
        options: [
          option(examSet.notSaidCorrect, true, makeWrongReason(explanationAnalysis)),
          option(examSet.notSaidTruths?.[0] || support[0], false, makeEvidenceReason(explanationAnalysis, "Bu ifade parçada desteklendiği için söylenebilir.")),
          option(examSet.notSaidTruths?.[1] || support[1] || analysis.direct, false, makeEvidenceReason(explanationAnalysis, "Bu ifade parçada desteklendiği için söylenebilir.")),
          option(examSet.notSaidTruths?.[2] || support[2] || analysis.mainIdea, false, makeEvidenceReason(explanationAnalysis, "Bu ifade parçada desteklendiği için söylenebilir.")),
        ],
        explanation: makeWrongReason(explanationAnalysis),
      },
      0,
    ),
    makeQuestion(
      {
        id: "inference",
        type: "Çıkarım",
        question: "Bu parçada anlatılanlardan hareketle aşağıdakilerden hangisi çıkarılabilir?",
        options: optionsWithReasons([examSet.inferenceCorrect, ...distractors.inference], explanationAnalysis, examSet.inferenceCorrect),
        explanation: makeEvidenceReason(explanationAnalysis, "Doğru seçenek, parçada verilenlerden ulaşılabilecek sonuçtur."),
      },
      1,
    ),
    makeQuestion(
      {
        id: "topic",
        type: "Konu",
        question: "Bu parçada üzerinde durulan konu aşağıdakilerden hangisidir?",
        options: optionsWithReasons([examSet.topicCorrect, ...distractors.topic], explanationAnalysis, examSet.topicCorrect),
        explanation: makeEvidenceReason(explanationAnalysis, "Doğru seçenek, parçanın genelinde üzerinde durulan konuyu verir."),
      },
      2,
    ),
    makeQuestion(
      {
        id: "answered-question",
        type: "Cevabı olan soru",
        question: "Bu parçada aşağıdaki sorulardan hangisinin cevabı vardır?",
        options: [
          option(analysis.answeredQuestion, true),
          option("Parçada adı geçen kişilerin doğum tarihleri nelerdir?"),
          option("Metindeki olaylar hangi şehirde ve hangi gün gerçekleşmiştir?"),
          option("Yazarın bütün eserleri hangi sırayla yayımlanmıştır?"),
        ],
        explanation: "Doğru soru, parçadaki bilgilerle cevaplanabilen sorudur.",
      },
      3,
    ),
    makeQuestion(
      {
        id: "text-type",
        type: "Anlatım biçimi",
        question: "Bu parçanın anlatımında aşağıdakilerden hangisi ağır basmaktadır?",
        options: TEXT_TYPES.map((type) => option(type, type === analysis.textType)),
        explanation: getTextTypeExplanation(analysis.textType),
      },
      0,
    ),
    makeQuestion(
      {
        id: "title",
        type: "Başlık",
        question: "Bu parçaya getirilebilecek en uygun başlık aşağıdakilerden hangisidir?",
        options: [
          option(titleOptions[0], true),
          option(titleOptions[1] || "Parçanın Temel Mesajı"),
          option(titleOptions[2] || "Konuya Genel Bakış"),
          option(titleOptions[3] || "Günlük Yaşamdan Bir Kesit"),
        ],
        explanation: "En uygun başlık, parçanın ana düşüncesini özel ve kısa biçimde karşılar.",
      },
      1,
    ),
  ];

  return {
    questions,
    languageAnalysis: analyzeLanguage(paragraph),
  };
}

export function analyzeParagraph(paragraph) {
  const analysis = getAnalysis(paragraph);

  return {
    konu: `Metnin konusu, ${analysis.topic}.`,
    anaFikir: analysis.mainIdea,
    yardimciFikirler: analysis.support,
    ozet: `${analysis.topic} çerçevesinde metin, "${analysis.mainIdea}" düşüncesini vurgular.`,
    baslikOnerileri: [analysis.title, ...analysis.titleOptions].slice(0, 3),
    anahtarKelimeler: analysis.keywords,
    metinTuru: analysis.textType,
    zorlukSeviyesi: inferDifficulty(paragraph),
  };
}

function inferDifficulty(text) {
  const words = tokenize(text);
  const sentences = splitSentences(text);
  const average = sentences.length ? words.length / sentences.length : words.length;

  if (words.length > 120 || average > 20) return "İleri";
  if (words.length > 65 || average > 14) return "Orta";
  return "Temel";
}

export function analyzeText(paragraph) {
  return {
    ...analyzeParagraph(paragraph),
    questionSet: generateQuestions(paragraph),
    languageAnalysis: analyzeLanguage(paragraph),
  };
}
