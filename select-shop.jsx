import { useState, useEffect, useRef } from "react";

// ===== DATA =====
const MOOD_CATEGORIES = [
  { id: "daily",   label: "DAILY",   jp: "日常使い",   color: "#2a1f1a" },
  { id: "kitchen", label: "KITCHEN", jp: "キッチン",   color: "#1a1f2a" },
  { id: "desk",    label: "DESK",    jp: "デスク周り", color: "#2a1a1f" },
  { id: "minimal", label: "MINIMAL", jp: "ミニマル",   color: "#1f1f1f" },
  { id: "gift",    label: "GIFT",    jp: "ギフト",     color: "#2a1a22" },
  { id: "season",  label: "SEASON",  jp: "季節の品",   color: "#1a2020" },
];

const INITIAL_CATEGORIES = [
  { id: "vessel",   name: "器・食器",     slug: "vessel",   description: "日常を彩る器と食器",         display_order: 1, is_active: true },
  { id: "kitchen",  name: "キッチン雑貨", slug: "kitchen",  description: "暮らしに寄り添うキッチン用品", display_order: 2, is_active: true },
  { id: "stationery",name:"文具・紙雑貨", slug: "stationery",description:"丁寧な文具と紙もの",          display_order: 3, is_active: true },
  { id: "interior", name: "インテリア",   slug: "interior", description: "空間を整えるインテリア小物",   display_order: 4, is_active: true },
  { id: "care",     name: "ケア用品",     slug: "care",     description: "心と身体を整えるケアアイテム", display_order: 5, is_active: true },
  { id: "gift",     name: "ギフト",       slug: "gift",     description: "贈り物に選ばれる特別な一品",   display_order: 6, is_active: true },
];

const BUDGET_RANGES = ["〜3,000円", "3,000円〜8,000円", "8,000円〜15,000円", "15,000円〜"];

function getBudgetRange(price) {
  if (price < 3000)  return "〜3,000円";
  if (price < 8000)  return "3,000円〜8,000円";
  if (price < 15000) return "8,000円〜15,000円";
  return "15,000円〜";
}

const PRODUCT_NAMES = [
  "Ceramic Mug", "Wooden Tray", "Linen Pouch", "Brass Clip",
  "Stone Coaster", "Glass Vase", "Iron Tray", "Cotton Towel",
  "Paper Weight", "Copper Spoon", "Washi Tape",
];
const PRODUCT_COLORS = [
  "#2a2218","#1e1a14","#261e16","#1a1e22","#221e1a","#181e1a",
  "#261e1e","#1e2218","#221a1e","#1a1a1a","#2a1e18",
];

// Unsplash curated images for each product type (zakka / minimal lifestyle)
const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=800&fit=crop&q=80", // ceramic mug
  "https://images.unsplash.com/photo-1595599920606-6e4e29b56a2e?w=600&h=800&fit=crop&q=80", // wooden tray
  "https://images.unsplash.com/photo-1558171813-32d9c6f8f38d?w=600&h=800&fit=crop&q=80", // linen pouch
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=800&fit=crop&q=80", // stationery/clip
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&h=800&fit=crop&q=80", // stone coaster
  "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&h=800&fit=crop&q=80", // glass vase
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=800&fit=crop&q=80", // iron tray / kitchen
  "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&h=800&fit=crop&q=80", // cotton towel
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=800&fit=crop&q=80", // paper weight / desk
  "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=800&fit=crop&q=80", // copper spoon / cutlery
  "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=800&fit=crop&q=80", // washi tape / craft
];

// Mood category images
const MOOD_IMAGES = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=400&fit=crop&q=70",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=400&fit=crop&q=70",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300&h=400&fit=crop&q=70",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=400&fit=crop&q=70",
  "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&h=400&fit=crop&q=70",
  "https://images.unsplash.com/photo-1525498128493-380d1990a112?w=300&h=400&fit=crop&q=70",
];

// Journal images
const JOURNAL_IMAGES = [
  "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1595599920606-6e4e29b56a2e?w=800&h=500&fit=crop&q=80",
];

function generateProducts() {
  const products = [];
  for (let i = 0; i < 44; i++) {
    const nameBase = PRODUCT_NAMES[i % PRODUCT_NAMES.length];
    const num = String(Math.floor(i / PRODUCT_NAMES.length) + 1).padStart(2, "0");
    const price = [1800,2400,3200,4500,6800,5500,9800,3800,7200,12000,2200,8800,4200,15000,6200][i % 15];
    const catId = INITIAL_CATEGORIES[i % 6].id;
    products.push({
      id: `prod-${i + 1}`,
      name: `${nameBase} ${num}`,
      slug: `${nameBase.toLowerCase().replace(/ /g, "-")}-${num}`,
      price,
      sale_price: i % 8 === 0 ? Math.floor(price * 0.8) : null,
      description: `丁寧に選んだ素材と、誠実なつくり手の手仕事が宿る一品。日常の中にそっと置いておくだけで、暮らしに静かな豊かさをもたらします。`,
      short_description: `素材の良さと丁寧な仕上げ。毎日使いたくなる一点。`,
      category_ids: [catId],
      tags: ["Zakka", "Minimal", "Japan"],
      stock_quantity: i % 11 === 0 ? 0 : Math.floor(Math.random() * 15) + 1,
      is_published: true,
      is_new: i < 8,
      is_best_seller: i >= 8 && i < 16,
      is_featured: i < 4,
      budget_range: getBudgetRange(price),
      material: ["陶器", "木材", "リネン", "真鍮", "ガラス", "コットン"][i % 6],
      size: ["W8×H9cm", "W24×D16cm", "φ9cm", "W12×H8cm", "フリー"][i % 5],
      color_name: ["ナチュラル", "スモークブラック", "アッシュグレー", "ウォールナット", "クリア"][i % 5],
      color: PRODUCT_COLORS[i % PRODUCT_COLORS.length],
      image: PRODUCT_IMAGES[i % PRODUCT_IMAGES.length],
    });
  }
  return products;
}

const INITIAL_PRODUCTS = generateProducts();

const INITIAL_SETTINGS = {
  shopName: "CKD SHOP",
  mainCopy: "LESS IS MORE,\nBUT BETTER.",
  subCopy: "素材と誠実さで選んだ、長く使えるものだけを。\n日常に、静かな豊かさを。",
  shippingFee: 550,
  freeShippingLine: 10000,
  contactEmail: "hello@ckdshop.jp",
};

const JOURNAL_POSTS = [
  { id: 1, category: "STORY",       title: "つくり手の背景にあるもの",   date: "2025.05.20", color: "#2a1f1a", image: JOURNAL_IMAGES[0] },
  { id: 2, category: "JOURNAL",     title: "素材から選ぶ、器の楽しみ方", date: "2025.05.12", color: "#1a1f2a", image: JOURNAL_IMAGES[1] },
  { id: 3, category: "STYLE GUIDE", title: "長く使えるものを選ぶ基準",   date: "2025.04.28", color: "#261a1f", image: JOURNAL_IMAGES[2] },
];

// ── STAFF & REVIEWS DATA ──
const STAFF_MEMBERS = [
  { id: "s1", name: "Yuki Tanaka", name_jp: "田中 由紀", role: "バイヤー",       color: "#2a1f1a", image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop&q=80" },
  { id: "s2", name: "Haruki Sato", name_jp: "佐藤 陽樹", role: "スタイリスト",   color: "#1a1f2a", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80" },
  { id: "s3", name: "Mio Kimura",  name_jp: "木村 澪",   role: "クリエイティブ", color: "#261a1f", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&q=80" },
];

const STAFF_ARTICLES = [
  {
    id: "ar1", staff_id: "s1", product_id: "prod-1",
    title: "毎朝のコーヒーを、もっと豊かに",
    lead: "このマグを手にした瞬間、その重さと温度に驚きました。陶土の質感が、ただの朝を特別な時間に変えてくれます。",
    body: `バイヤーとして国内外の窯元を巡る中で、このCeramic Mugに出会いました。\n\n作り手の山田さんは、福岡の小さな工房で一点一点ろくろを引いています。「毎日使うものだからこそ、手に持ったときの感触を大切にしている」という言葉が印象的でした。\n\n実際に使い始めて2ヶ月。コーヒーの温度が冷めにくく、口当たりが柔らかい。何より、使うたびに表情が変わる釉薬の美しさに毎朝見惚れています。\n\n朝の時間が少し豊かになった気がします。ぜひ、あなたの日常にも取り入れてみてください。`,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=1200&h=700&fit=crop&q=85",
    date: "2025.05.25", read_time: 3, tags: ["器", "コーヒー", "陶器", "朝の時間"],
  },
  {
    id: "ar2", staff_id: "s2", product_id: "prod-2",
    title: "テーブルが変わると、食卓が変わる",
    lead: "Wooden Trayをひとつ置くだけで、食卓の空気がぐっと引き締まります。木の温もりと、その静けさについて。",
    body: `スタイリングの仕事をしていると、「余白」の大切さを痛感します。このWooden Trayは、まさに余白を作るためのアイテムです。\n\n朝食のセッティングに、ティータイムに、あるいはアクセサリーを置くトレイとして。使い方の幅が広いのも魅力ですが、何よりウォールナットの木目が美しい。\n\n一枚一枚、木目が異なるため、届いてから「自分だけの一点」に出会う感覚があります。オイルフィニッシュで仕上げられているので、使い込むほどに艶が増してくる。そんな経年変化も楽しみの一つです。`,
    image: "https://images.unsplash.com/photo-1595599920606-6e4e29b56a2e?w=1200&h=700&fit=crop&q=85",
    date: "2025.05.18", read_time: 4, tags: ["木工", "テーブル", "インテリア"],
  },
  {
    id: "ar3", staff_id: "s3", product_id: "prod-6",
    title: "花を飾る、ということ",
    lead: "花を飾ることは、空間に対する敬意だと思っています。Glass Vaseが教えてくれた、シンプルな豊かさの話。",
    body: `「花なんて特別な日だけ」と思っていた時期がありました。でも、このGlass Vaseを手に入れてから、毎週月曜日に近所の花屋で一束だけ買うようになりました。\n\n透明なガラスは、水の揺らぎと茎の影を空間に映します。花が変わるたびに、部屋の表情が変わる。それだけのことなのに、なぜかとても豊かな気持ちになる。\n\nシンプルで潔いフォルムは、どんな花にも合います。置く場所も選ばない。そういうものを作れる職人の技術に、静かな敬意を感じます。`,
    image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=1200&h=700&fit=crop&q=85",
    date: "2025.05.10", read_time: 3, tags: ["ガラス", "インテリア", "花"],
  },
  {
    id: "ar4", staff_id: "s1", product_id: "prod-3",
    title: "リネンポーチが変えた、バッグの中",
    lead: "バッグの中がいつも散らかってしまう。そんな悩みを解消してくれたLinen Pouchとの出会い。",
    body: `バイヤーとして荷物が多い私にとって、バッグの中の整理は永遠の課題でした。Linen Pouchに出会ったのは、京都のクラフトフェアでのこと。\n\n手触りが柔らかく、しかし丈夫。リネンの自然な風合いが、バッグの中に入れていても「主張しすぎない」のがいい。使い込むほど味が出てくる素材感も好きです。\n\nサイズ違いで3つ揃えて、コスメ用・充電器用・名刺用と分けています。バッグを変えるときも、ポーチごと移すだけ。朝の準備が少しだけ楽になりました。`,
    image: "https://images.unsplash.com/photo-1558171813-32d9c6f8f38d?w=1200&h=700&fit=crop&q=85",
    date: "2025.05.03", read_time: 3, tags: ["リネン", "整理", "バッグ"],
  },
  {
    id: "ar5", staff_id: "s2", product_id: "prod-9",
    title: "デスクに置いた、静かな重さ",
    lead: "Paper Weightをデスクに置いた日から、仕事の集中力が変わった気がします。道具が持つ空気感について。",
    body: `スタイリストとして常にビジュアルを意識している私が、最も長くデスクに置いているものがこのPaper Weightです。\n\n重さ230グラム。大理石の冷たさと、滑らかな質感。これをデスクに置くと、なぜか空間が締まる感じがします。\n\n「ただの重し」と思われるかもしれませんが、目に入るたびに「良いものに囲まれている」という実感が生まれる。それが仕事のモチベーションに繋がっている気がします。働く場所を丁寧に整えることの大切さを、この小さな道具が教えてくれました。`,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=700&fit=crop&q=85",
    date: "2025.04.22", read_time: 3, tags: ["デスク", "文具", "ミニマル"],
  },
  {
    id: "ar6", staff_id: "s3", product_id: "prod-7",
    title: "鉄のトレイが教えてくれた、素材の誠実さ",
    lead: "Iron Trayを使い始めて1年。錆ひとつなく、むしろ美しくなっていくその姿に、素材の誠実さを感じます。",
    body: `クリエイティブの仕事をしていると、「見た目が良いもの」と「本当に良いもの」の違いを常に考えます。このIron Trayは、後者の代表格です。\n\n購入前は「鉄製品はお手入れが大変そう」と思っていました。でも実際は、使った後に軽く拭くだけ。むしろその小さな手間が、道具への愛着を育てることに気づきました。\n\n1年経った今、表面には使い込んだ風合いが生まれています。「育てる道具」という感覚。長く使うことの喜びを、このトレイから学びました。`,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=700&fit=crop&q=85",
    date: "2025.04.15", read_time: 4, tags: ["鉄", "キッチン", "経年変化"],
  },
];

const VIDEO_REVIEWS = [
  {
    id: "v1", staff_id: "s2", product_id: "prod-2",
    title: "Wooden Tray の使い方、3スタイル",
    description: "朝食・ティータイム・アクセサリー収納。一枚のトレイで変わる3つのシーンをご紹介します。",
    youtube_id: "ScMzIvxBSi4",
    thumbnail: "https://images.unsplash.com/photo-1595599920606-6e4e29b56a2e?w=800&h=450&fit=crop&q=80",
    date: "2025.05.22", duration: "4:18", tags: ["木工", "スタイリング"],
  },
  {
    id: "v2", staff_id: "s1", product_id: "prod-1",
    title: "Ceramic Mug — 窯元訪問レポート",
    description: "福岡の小さな工房を訪ねて。陶芸家・山田さんのこだわりと、マグが生まれるまでの工程を追いました。",
    youtube_id: "BkDmGCIBJaY",
    thumbnail: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&h=450&fit=crop&q=80",
    date: "2025.05.15", duration: "7:42", tags: ["器", "陶芸", "工房"],
  },
  {
    id: "v3", staff_id: "s3", product_id: "prod-6",
    title: "小さな花を飾る、Glass Vaseスタイリング",
    description: "季節の花をひと束。Glass Vaseに合わせるフラワースタイリングのコツを、クリエイティブ担当の木村が解説します。",
    youtube_id: "L_LUpnjgPso",
    thumbnail: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&h=450&fit=crop&q=80",
    date: "2025.05.08", duration: "5:55", tags: ["フラワー", "インテリア"],
  },
  {
    id: "v4", staff_id: "s1", product_id: "prod-10",
    title: "Copper Spoon の「育て方」",
    description: "銅製品は使うほどに美しくなる素材です。日々のお手入れと、経年変化の楽しみ方をご紹介。",
    youtube_id: "OPf0YbXqDm0",
    thumbnail: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&h=450&fit=crop&q=80",
    date: "2025.04.28", duration: "3:50", tags: ["銅", "お手入れ", "経年変化"],
  },
  {
    id: "v5", staff_id: "s3", product_id: "prod-4",
    title: "Brass Clip で作る、デスクの美しい整理術",
    description: "ただのクリップじゃない。真鍮の質感が映えるデスク整理のアイデアをスタイリスト視点でご提案します。",
    youtube_id: "n_oEnK9n0CA",
    thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=450&fit=crop&q=80",
    date: "2025.04.18", duration: "6:10", tags: ["文具", "デスク", "真鍮"],
  },
  {
    id: "v6", staff_id: "s2", product_id: "prod-8",
    title: "Cotton Towel の正しい洗い方と乾かし方",
    description: "良いタオルを長く使うために。購入後の最初の洗い方から、ふんわり仕上げるコツまで。",
    youtube_id: "Ks-_Mh1QhMc",
    thumbnail: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&h=450&fit=crop&q=80",
    date: "2025.04.10", duration: "4:05", tags: ["コットン", "お手入れ", "タオル"],
  },
];

// ===== CSS =====
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Noto+Sans+JP:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #0f0d0b;
    --bg2:     #181410;
    --bg3:     #221e18;
    --text:    #f0ece5;
    --text2:   #a09080;
    --text3:   #5a5048;
    --border:  #2e2820;
    --accent:  #c8a882;
    --black:   #0f0d0b;
    --white:   #f0ece5;
  }

  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--text); font-family: 'Noto Sans JP', sans-serif; }
  .fd { font-family: 'Cormorant Garamond', serif; }
  .wrap { min-height: 100vh; background: var(--bg); }

  /* ── HEADER ── */
  .hdr {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(15,13,11,0.92); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0 2rem;
  }
  .hdr-in {
    max-width: 1440px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    height: 60px;
  }
  .logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.45rem; font-weight: 400; letter-spacing: 0.22em;
    cursor: pointer; color: var(--text); text-transform: uppercase;
  }
  .nav { display: flex; gap: 2.2rem; }
  .nl {
    font-size: 0.68rem; letter-spacing: 0.14em; color: var(--text2);
    cursor: pointer; background: none; border: none; padding: 0;
    font-family: 'Noto Sans JP', sans-serif; transition: color .2s;
    text-transform: uppercase;
  }
  .nl:hover, .nl.on { color: var(--text); }
  .hdr-r { display: flex; gap: 1.2rem; align-items: center; }
  .ib {
    background: none; border: none; cursor: pointer;
    color: var(--text2); padding: 4px; font-size: 0.95rem;
    transition: color .2s; position: relative;
  }
  .ib:hover { color: var(--text); }
  .cbadge {
    position: absolute; top: -4px; right: -4px;
    background: var(--accent); color: var(--black);
    border-radius: 50%; width: 14px; height: 14px;
    font-size: 0.52rem; display: flex; align-items: center; justify-content: center;
    font-weight: 500;
  }

  /* mobile header */
  .mhdr {
    display: none; position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(15,13,11,0.92); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border); padding: 0 1rem;
  }
  .mhdr-in { display: flex; align-items: center; justify-content: space-between; height: 56px; }
  @media(max-width:768px){ .hdr{display:none;} .mhdr{display:block;} }

  /* ── HERO ── */
  .hero {
    position: relative; width: 100%;
    min-height: 100vh; overflow: hidden;
    display: flex; align-items: flex-end;
    padding-top: 60px;
  }
  .hero-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #1a1208 0%, #0f0d0b 40%, #1c100a 100%);
  }
  .hero-model {
    position: absolute; right: 0; top: 0; bottom: 0; width: 58%;
    background: linear-gradient(to left, #1a1208, #0f0d0b 90%);
    overflow: hidden; display: flex; align-items: center; justify-content: center;
  }
  .hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to right, var(--bg) 20%, rgba(15,13,11,0.5) 60%, transparent 100%);
    z-index: 1;
  }
  .hero-content {
    position: relative; z-index: 2;
    max-width: 1440px; margin: 0 auto; width: 100%;
    padding: 0 3rem 8rem;
  }
  .hero-eyebrow {
    font-size: 0.62rem; letter-spacing: 0.3em; color: var(--accent);
    text-transform: uppercase; margin-bottom: 1.8rem;
    display: flex; align-items: center; gap: 1rem;
  }
  .hero-eyebrow::before {
    content: ""; display: block; width: 32px; height: 1px; background: var(--accent);
  }
  .hero-h {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(3rem, 5.5vw, 5.5rem);
    font-weight: 300; line-height: 1.1;
    margin-bottom: 2rem; white-space: pre-line;
    letter-spacing: 0.02em;
  }
  .hero-sub {
    font-size: 0.78rem; line-height: 2.2; color: var(--text2);
    margin-bottom: 3rem; max-width: 38ch; white-space: pre-line;
  }
  .hero-dots {
    position: absolute; left: 1.2rem; top: 50%;
    transform: translateY(-50%); z-index: 3;
    display: flex; flex-direction: column; gap: .7rem; align-items: center;
  }
  .hero-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--text3); transition: background .2s;
    cursor: pointer;
  }
  .hero-dot.on { background: var(--accent); }
  .hero-scroll {
    position: absolute; bottom: 2.5rem; left: 50%;
    transform: translateX(-50%); z-index: 3;
    font-size: 0.58rem; letter-spacing: 0.3em; color: var(--text3);
    text-transform: uppercase; display: flex; flex-direction: column;
    align-items: center; gap: .6rem; cursor: pointer;
  }
  .hero-scroll-line {
    width: 1px; height: 40px; background: var(--text3);
    animation: scrollLine 2s ease infinite;
  }
  @keyframes scrollLine {
    0%{transform:scaleY(0);transform-origin:top} 50%{transform:scaleY(1);transform-origin:top}
    50.01%{transform:scaleY(1);transform-origin:bottom} 100%{transform:scaleY(0);transform-origin:bottom}
  }
  @media(max-width:768px){
    .hero { min-height: 92vh; }
    .hero-model { width: 100%; opacity: 0.3; }
    .hero-content { padding: 0 1.5rem 6rem; }
    .hero-h { font-size: clamp(2.5rem, 10vw, 3.5rem); }
    .hero-dots { display: none; }
  }

  /* ── BUTTONS ── */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: .5rem;
    padding: .85rem 2.2rem; font-size: .7rem; letter-spacing: .16em;
    cursor: pointer; border: none; font-family: 'Noto Sans JP', sans-serif;
    transition: all .25s; text-transform: uppercase;
  }
  .btn-p { background: var(--text); color: var(--black); }
  .btn-p:hover { background: var(--accent); }
  .btn-o { background: transparent; color: var(--text); border: 1px solid rgba(240,236,229,0.3); }
  .btn-o:hover { border-color: var(--text); }
  .btn-a { background: transparent; color: var(--accent); border: 1px solid var(--accent); }
  .btn-a:hover { background: var(--accent); color: var(--black); }
  .btn-sm { padding: .5rem 1.3rem; font-size: .66rem; }
  .btn-w { width: 100%; }

  /* ── SECTION ── */
  .sec { padding: 6rem 2rem; max-width: 1440px; margin: 0 auto; }
  .sec-full { padding: 6rem 0; }
  .sec-sm { padding: 3rem 2rem; max-width: 1440px; margin: 0 auto; }
  .sl { font-size: .6rem; letter-spacing: .3em; text-transform: uppercase; color: var(--text3); margin-bottom: .8rem; }
  .sh { font-family: 'Cormorant Garamond', serif; font-size: 2.4rem; font-weight: 300; margin-bottom: .5rem; }
  .sdiv { border: none; border-top: 1px solid var(--border); margin: 0; }
  @media(max-width:768px){ .sec{padding:4rem 1rem;} }

  /* ── MOOD SHOPPING ── */
  .mood-section {
    padding: 5rem 0; background: var(--bg);
    border-top: 1px solid var(--border);
  }
  .mood-header {
    max-width: 1440px; margin: 0 auto;
    padding: 0 2rem; display: flex;
    justify-content: space-between; align-items: flex-end;
    margin-bottom: 2.5rem;
  }
  .mood-scroll {
    display: flex; gap: 1.2rem; overflow-x: auto;
    padding: 0 2rem; scrollbar-width: none; -ms-overflow-style: none;
  }
  .mood-scroll::-webkit-scrollbar { display: none; }
  .mood-card {
    flex: 0 0 140px; cursor: pointer;
    transition: transform .3s;
  }
  .mood-card:hover { transform: translateY(-4px); }
  .mood-img {
    width: 140px; height: 180px; overflow: hidden;
    margin-bottom: .8rem; position: relative;
  }
  .mood-img-inner {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
  }
  .mood-label { font-size: .63rem; letter-spacing: .2em; color: var(--text); text-transform: uppercase; }
  .mood-jp { font-size: .62rem; color: var(--text3); margin-top: .2rem; }
  @media(max-width:768px){ .mood-card{flex:0 0 110px;} .mood-img{width:110px;height:140px;} }

  /* ── COLLECTION GRID ── */
  .coll-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 1px; background: var(--border);
  }
  .coll-item {
    background: var(--bg2); overflow: hidden; cursor: pointer;
    position: relative; transition: opacity .3s;
  }
  .coll-item:hover .coll-img-inner { transform: scale(1.04); }
  .coll-item:first-child { grid-row: 1 / 3; }
  .coll-img {
    width: 100%; overflow: hidden;
  }
  .coll-item:first-child .coll-img { height: 600px; }
  .coll-img-other { height: 296px; }
  .coll-img-inner {
    width: 100%; height: 100%;
    transition: transform .5s ease;
    display: flex; align-items: center; justify-content: center;
  }
  .coll-info { padding: 1.2rem 1.5rem; }
  .coll-cat { font-size: .58rem; letter-spacing: .2em; color: var(--text3); text-transform: uppercase; margin-bottom: .3rem; }
  .coll-name { font-size: .83rem; color: var(--text2); }
  @media(max-width:900px){
    .coll-grid { grid-template-columns: 1fr 1fr; }
    .coll-item:first-child { grid-row: auto; }
    .coll-item:first-child .coll-img { height: 300px; }
    .coll-img-other { height: 200px; }
  }
  @media(max-width:600px){ .coll-grid{ grid-template-columns:1fr; } }

  /* ── PRODUCT GRID ── */
  .pg { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: var(--border); }
  @media(max-width:1100px){ .pg{grid-template-columns:repeat(3,1fr);} }
  @media(max-width:768px){ .pg{grid-template-columns:repeat(2,1fr);} }

  /* ── PRODUCT CARD ── */
  .pc { cursor: pointer; background: var(--bg); }
  .pc-img {
    aspect-ratio: 3/4; position: relative; overflow: hidden;
  }
  .pc-img-inner {
    width: 100%; height: 100%;
    transition: transform .5s ease;
  }
  .pc:hover .pc-img-inner { transform: scale(1.04); }
  .pc-badges { position: absolute; top: .8rem; left: .8rem; display: flex; flex-direction: column; gap: .3rem; }
  .b-tag { font-size: .55rem; letter-spacing: .14em; padding: .22rem .55rem; text-transform: uppercase; }
  .b-new { background: var(--accent); color: var(--black); }
  .b-best { background: #5a4a3a; color: var(--text); }
  .b-sale { background: #6b2a2a; color: var(--text); }
  .oos { position: absolute; inset: 0; background: rgba(15,13,11,.65); display: flex; align-items: center; justify-content: center; font-size: .68rem; letter-spacing: .15em; color: var(--text3); }
  .pc-info { padding: 1rem 1rem 1.4rem; }
  .pc-name { font-size: .77rem; letter-spacing: .03em; margin-bottom: .3rem; color: var(--text2); }
  .pc-price { font-size: .75rem; color: var(--text3); }
  .sp { color: var(--accent); }
  .op { text-decoration: line-through; color: var(--text3); margin-right: .4rem; }

  /* ── HORIZONTAL SCROLL PRODUCTS ── */
  .hscroll { display: flex; gap: 1px; overflow-x: auto; background: var(--border); scrollbar-width: none; }
  .hscroll::-webkit-scrollbar { display: none; }
  .hscroll .pc { flex: 0 0 280px; }
  @media(max-width:768px){ .hscroll .pc { flex: 0 0 200px; } }

  /* ── VIEW ALL LINK ── */
  .view-all {
    font-size: .65rem; letter-spacing: .2em; color: var(--text3);
    text-decoration: none; text-transform: uppercase;
    cursor: pointer; transition: color .2s;
    display: flex; align-items: center; gap: .5rem;
  }
  .view-all:hover { color: var(--text); }
  .view-all::after { content: "→"; }

  /* ── STYLE QUIZ ── */
  .quiz-section {
    background: var(--bg2); border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 5rem 2rem; text-align: center;
  }

  /* ── JOURNAL ── */
  .journal-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: var(--border); }
  @media(max-width:768px){ .journal-grid{grid-template-columns:1fr;} }
  .jcard { background: var(--bg); cursor: pointer; transition: opacity .3s; }
  .jcard:hover { opacity: .8; }
  .jcard-img { height: 240px; overflow: hidden; }
  .jcard-img-inner { width: 100%; height: 100%; transition: transform .5s; }
  .jcard:hover .jcard-img-inner { transform: scale(1.04); }
  .jcard-info { padding: 1.5rem; }
  .jcard-cat { font-size: .58rem; letter-spacing: .2em; color: var(--accent); text-transform: uppercase; margin-bottom: .6rem; }
  .jcard-title { font-family: 'Cormorant Garamond', serif; font-size: 1.25rem; font-weight: 300; margin-bottom: .5rem; line-height: 1.4; }
  .jcard-date { font-size: .65rem; color: var(--text3); }

  /* ── NEWSLETTER ── */
  .nl-section { background: var(--bg3); padding: 5rem 2rem; text-align: center; border-top: 1px solid var(--border); }
  .nl-form { display: flex; gap: 0; max-width: 440px; margin: 2.5rem auto 0; }
  .nl-inp {
    flex: 1; background: transparent; border: 1px solid var(--border);
    border-right: none; padding: .85rem 1.2rem; color: var(--text);
    font-size: .77rem; font-family: 'Noto Sans JP', sans-serif;
    outline: none;
  }
  .nl-inp::placeholder { color: var(--text3); }
  .nl-inp:focus { border-color: var(--text3); }
  .nl-btn {
    padding: .85rem 1.5rem; background: var(--accent); color: var(--black);
    border: none; font-size: .65rem; letter-spacing: .14em; cursor: pointer;
    font-family: 'Noto Sans JP', sans-serif; text-transform: uppercase;
    transition: background .2s;
  }
  .nl-btn:hover { background: var(--text); }

  /* ── PRODUCTS PAGE ── */
  .pl { display: grid; grid-template-columns: 210px 1fr; gap: 3rem; }
  @media(max-width:1024px){ .pl{grid-template-columns:1fr;} }
  .fg { margin-bottom: 2rem; }
  .fg-title { font-size: .62rem; letter-spacing: .18em; text-transform: uppercase; color: var(--text3); margin-bottom: .8rem; }
  .fi { display: flex; align-items: center; gap: .6rem; margin-bottom: .5rem; cursor: pointer; }
  .fchk { width: 13px; height: 13px; border: 1px solid var(--border); cursor: pointer; accent-color: var(--accent); background: transparent; }
  .flbl { font-size: .77rem; color: var(--text2); cursor: pointer; }
  .flbl:hover { color: var(--text); }

  /* ── PRODUCT DETAIL ── */
  .pd { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
  @media(max-width:768px){ .pd{grid-template-columns:1fr; gap:2rem;} }
  .gthumb { display: flex; gap: .5rem; margin-top: .7rem; }
  .gth { width: 64px; height: 80px; cursor: pointer; border: 1px solid transparent; transition: border-color .2s; overflow: hidden; }
  .gth.on { border-color: var(--accent); }
  .pd-name { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 300; margin-bottom: .7rem; }
  .pd-price { font-size: 1.1rem; margin-bottom: 1.5rem; color: var(--text2); }
  .pd-desc { font-size: .82rem; line-height: 2; color: var(--text2); margin-bottom: 2rem; }
  .specs { display: grid; grid-template-columns: 1fr 1fr; gap: .8rem; margin-bottom: 1.5rem; }
  .spec-k { font-size: .6rem; letter-spacing: .14em; color: var(--text3); margin-bottom: .2rem; text-transform: uppercase; }
  .spec-v { font-size: .78rem; color: var(--text2); }
  .qty-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
  .qty-label { font-size: .65rem; letter-spacing: .12em; color: var(--text3); text-transform: uppercase; }
  .qb { width: 32px; height: 32px; border: 1px solid var(--border); background: none; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; color: var(--text2); }
  .qv { font-size: .88rem; min-width: 2rem; text-align: center; }
  .chip { display: inline-flex; padding: .18rem .6rem; border: 1px solid var(--border); font-size: .6rem; letter-spacing: .1em; color: var(--text3); margin: .18rem; }
  .bc { font-size: .68rem; color: var(--text3); margin-bottom: 2rem; display: flex; gap: .5rem; align-items: center; }
  .bc span { cursor: pointer; }
  .bc span:hover { color: var(--text); }

  /* ── CART ── */
  .cart-lay { display: grid; grid-template-columns: 1fr 320px; gap: 3rem; align-items: start; }
  @media(max-width:768px){ .cart-lay{grid-template-columns:1fr;} }
  .ci { display: grid; grid-template-columns: 80px 1fr; gap: 1rem; padding: 1.5rem 0; border-bottom: 1px solid var(--border); align-items: start; }
  .ci-name { font-size: .82rem; margin-bottom: .25rem; }
  .ci-price { font-size: .75rem; color: var(--text2); }
  .ci-rm { font-size: .65rem; color: var(--text3); cursor: pointer; background: none; border: none; text-decoration: underline; margin-top: .5rem; display: block; font-family: 'Noto Sans JP', sans-serif; }
  .os { background: var(--bg2); padding: 2rem; border: 1px solid var(--border); }
  .os-row { display: flex; justify-content: space-between; font-size: .8rem; margin-bottom: .75rem; color: var(--text2); }
  .os-total { display: flex; justify-content: space-between; font-size: .92rem; padding-top: 1rem; margin-top: .5rem; border-top: 1px solid var(--border); }

  /* ── ADMIN ── */
  .adm { display: grid; grid-template-columns: 200px 1fr; min-height: 100vh; font-family: 'Noto Sans JP', sans-serif; }
  .adm-side { background: #080705; padding: 2rem 0; border-right: 1px solid var(--border); }
  .adm-logo { padding: 0 1.5rem 2rem; font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; color: var(--text); letter-spacing: .18em; border-bottom: 1px solid var(--border); margin-bottom: 1rem; }
  .adm-ni { padding: .65rem 1.5rem; font-size: .74rem; color: var(--text3); cursor: pointer; letter-spacing: .06em; transition: all .2s; display: flex; align-items: center; gap: .6rem; }
  .adm-ni:hover, .adm-ni.on { background: var(--bg2); color: var(--text); }
  .adm-main { padding: 2.5rem; background: var(--bg); overflow: auto; }
  .adm-title { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 300; margin-bottom: .4rem; }
  .adm-sub { font-size: .76rem; color: var(--text3); margin-bottom: 2rem; }
  .stat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem; margin-bottom: 2.5rem; }
  @media(max-width:1200px){ .stat-grid{grid-template-columns:repeat(2,1fr);} }
  .stat { background: var(--bg2); border: 1px solid var(--border); padding: 1.5rem; }
  .stat-l { font-size: .62rem; letter-spacing: .18em; text-transform: uppercase; color: var(--text3); margin-bottom: .5rem; }
  .stat-v { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 300; }
  .stat-u { font-size: .72rem; color: var(--text3); }
  .tbl { width: 100%; border-collapse: collapse; font-size: .78rem; }
  .tbl th { text-align: left; padding: .72rem 1rem; font-size: .62rem; letter-spacing: .14em; text-transform: uppercase; color: var(--text3); border-bottom: 1px solid var(--border); font-weight: 400; }
  .tbl td { padding: .82rem 1rem; border-bottom: 1px solid var(--border); color: var(--text2); vertical-align: middle; }
  .tbl tr:hover td { background: var(--bg2); }
  .inp { width: 100%; border: 1px solid var(--border); padding: .65rem .9rem; font-size: .8rem; background: var(--bg2); font-family: 'Noto Sans JP', sans-serif; outline: none; transition: border-color .2s; color: var(--text); }
  .inp:focus { border-color: var(--text3); }
  .sel { width: 100%; border: 1px solid var(--border); padding: .65rem .9rem; font-size: .8rem; background: var(--bg2); font-family: 'Noto Sans JP', sans-serif; outline: none; cursor: pointer; appearance: none; color: var(--text); }
  .txta { width: 100%; border: 1px solid var(--border); padding: .65rem .9rem; font-size: .8rem; background: var(--bg2); font-family: 'Noto Sans JP', sans-serif; outline: none; resize: vertical; min-height: 80px; color: var(--text); }
  .fg2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem 2rem; }
  .fg3 { margin-bottom: 1.1rem; }
  .fl { font-size: .68rem; letter-spacing: .12em; color: var(--text2); margin-bottom: .4rem; display: block; text-transform: uppercase; }
  .sb { display: inline-flex; align-items: center; padding: .18rem .6rem; font-size: .6rem; letter-spacing: .08em; }
  .sb-on { background: rgba(100,160,100,0.15); color: #7ab87a; border: 1px solid rgba(100,160,100,0.3); }
  .sb-off { background: rgba(160,100,100,0.15); color: #c07a7a; border: 1px solid rgba(160,100,100,0.3); }
  .sb-new { background: rgba(200,168,130,0.15); color: var(--accent); border: 1px solid rgba(200,168,130,0.3); }
  .panel { background: var(--bg2); border: 1px solid var(--border); padding: 2rem; margin-bottom: 1.5rem; }
  .panel-t { font-size: .7rem; letter-spacing: .15em; text-transform: uppercase; color: var(--text3); margin-bottom: 1.5rem; padding-bottom: .72rem; border-bottom: 1px solid var(--border); }
  .tgl { position: relative; display: inline-block; width: 38px; height: 20px; }
  .tgl input { opacity: 0; width: 0; height: 0; }
  .tgl-sl { position: absolute; cursor: pointer; inset: 0; background: var(--border); transition: .3s; border-radius: 20px; }
  .tgl-sl:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background: var(--text2); transition: .3s; border-radius: 50%; }
  input:checked + .tgl-sl { background: var(--accent); }
  input:checked + .tgl-sl:before { transform: translateX(18px); background: var(--black); }
  .opt-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: .9rem; }

  /* ── MISC ── */
  .divider { border: none; border-top: 1px solid var(--border); margin: 3rem 0; }
  .empty { text-align: center; padding: 6rem 2rem; color: var(--text3); }
  .empty-t { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 300; margin-bottom: .5rem; }
  .toast { position: fixed; bottom: 2rem; right: 2rem; background: var(--bg2); color: var(--text); border: 1px solid var(--border); padding: .85rem 1.6rem; font-size: .74rem; letter-spacing: .06em; z-index: 999; animation: si .3s ease; }
  @keyframes si { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .pe { animation: pe .3s ease; }
  @keyframes pe { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  .mb-bar { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: rgba(15,13,11,0.95); border-top: 1px solid var(--border); padding: .85rem 1.2rem; z-index: 50; backdrop-filter: blur(12px); }
  @media(max-width:768px){ .mb-bar{display:block;} }
  .rel-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: var(--border); }
  @media(max-width:768px){ .rel-grid{grid-template-columns:repeat(2,1fr);} }
  .pills { display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: 1.5rem; }
  .pill { padding: .45rem 1.1rem; font-size: .7rem; border: 1px solid var(--border); cursor: pointer; background: transparent; transition: all .2s; letter-spacing: .06em; color: var(--text2); }
  .pill.on { background: var(--accent); color: var(--black); border-color: var(--accent); }
  .pill:hover:not(.on) { border-color: var(--text3); color: var(--text); }

  /* ── LIVE CONSULT PAGE ── */
  .lc-hero {
    min-height: 60vh; display: flex; align-items: center;
    background: linear-gradient(135deg,#120e08 0%,#0f0d0b 60%,#181008 100%);
    padding: 8rem 2rem 5rem; position: relative; overflow: hidden;
  }
  .lc-hero::before {
    content:""; position:absolute; inset:0;
    background: radial-gradient(ellipse at 70% 50%, rgba(200,168,130,0.06) 0%, transparent 60%);
  }
  .lc-hero-in { max-width:1440px; margin:0 auto; width:100%; position:relative;z-index:1; }
  .lc-badge {
    display:inline-flex; align-items:center; gap:.6rem;
    padding:.4rem .9rem; border:1px solid rgba(200,168,130,.3);
    font-size:.6rem; letter-spacing:.2em; color:var(--accent); text-transform:uppercase;
    margin-bottom:2rem;
  }
  .lc-badge-dot {
    width:7px;height:7px;border-radius:50%;background:var(--accent);
    animation:pulse 2s ease infinite;
  }
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.7)}}
  .lc-h { font-family:'Cormorant Garamond',serif; font-size:clamp(2.4rem,4.5vw,4.5rem); font-weight:300; line-height:1.1; margin-bottom:1.4rem; }
  .lc-sub { font-size:.82rem; line-height:2; color:var(--text2); max-width:46ch; margin-bottom:2.5rem; }
  .lc-btns { display:flex; gap:1rem; flex-wrap:wrap; }
  .lc-staff-row { display:flex; gap:-.5rem; margin-top:2.5rem; align-items:center; }
  .lc-staff-avatar { width:36px;height:36px;border-radius:50%;overflow:hidden;border:2px solid var(--bg);margin-left:-8px; }
  .lc-staff-avatar:first-child{margin-left:0;}
  .lc-staff-avatar img{width:100%;height:100%;object-fit:cover;}
  .lc-staff-text { margin-left:.8rem; font-size:.7rem; color:var(--text3); }
  .lc-avail { color:var(--accent); }

  /* How it works */
  .lc-steps { display:grid; grid-template-columns:repeat(3,1fr); gap:2rem; }
  @media(max-width:768px){.lc-steps{grid-template-columns:1fr;}}
  .lc-step { padding:2rem; border:1px solid var(--border); position:relative; }
  .lc-step-num { font-family:'Cormorant Garamond',serif; font-size:3rem; font-weight:300; color:var(--border); line-height:1; margin-bottom:1rem; }
  .lc-step-title { font-size:.85rem; font-weight:500; margin-bottom:.6rem; }
  .lc-step-desc { font-size:.76rem; color:var(--text2); line-height:1.9; }

  /* Staff cards */
  .lc-staff-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; }
  @media(max-width:768px){.lc-staff-grid{grid-template-columns:1fr;}}
  .lc-staff-card { background:var(--bg2); border:1px solid var(--border); overflow:hidden; }
  .lc-staff-card-img { height:220px; overflow:hidden; }
  .lc-staff-card-img img { width:100%;height:100%;object-fit:cover;object-position:top; transition:transform .5s; }
  .lc-staff-card:hover .lc-staff-card-img img{transform:scale(1.04);}
  .lc-staff-card-body{padding:1.3rem 1.5rem;}
  .lc-staff-role{font-size:.58rem;letter-spacing:.18em;color:var(--accent);text-transform:uppercase;margin-bottom:.4rem;}
  .lc-staff-name{font-family:'Cormorant Garamond',serif;font-size:1.35rem;font-weight:300;margin-bottom:.5rem;}
  .lc-staff-bio{font-size:.74rem;color:var(--text2);line-height:1.85;margin-bottom:1rem;}
  .lc-avail-badge{display:inline-flex;align-items:center;gap:.4rem;font-size:.62rem;color:var(--accent);}
  .lc-avail-badge-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:pulse 2s ease infinite;}

  /* Form overlay */
  .lc-form-overlay{
    position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:400;
    display:flex;align-items:center;justify-content:center;padding:2rem;
    backdrop-filter:blur(8px);animation:fadeIn .2s ease;
  }
  .lc-form-box{
    background:var(--bg2);border:1px solid var(--border);
    width:100%;max-width:480px;padding:2.5rem;position:relative;
  }
  .lc-form-close{position:absolute;top:1rem;right:1rem;background:none;border:none;color:var(--text3);cursor:pointer;font-size:1.1rem;}

  /* Video room */
  .lc-room{
    position:fixed;inset:0;z-index:600;background:var(--bg);
    display:flex;flex-direction:column;
  }
  .lc-room-header{
    display:flex;align-items:center;justify-content:space-between;
    padding:.75rem 1.5rem;background:var(--bg2);border-bottom:1px solid var(--border);
    flex-shrink:0;
  }
  .lc-room-title{font-size:.78rem;letter-spacing:.06em;}
  .lc-room-id{font-size:.62rem;color:var(--text3);margin-top:.15rem;}
  .lc-room-body{display:flex;flex:1;overflow:hidden;}
  .lc-room-iframe{flex:1;border:none;}
  .lc-room-panel{
    width:280px;flex-shrink:0;background:var(--bg2);border-left:1px solid var(--border);
    display:flex;flex-direction:column;overflow-y:auto;
  }
  @media(max-width:900px){.lc-room-panel{display:none;}}
  .lc-room-panel-sec{padding:1.2rem 1.3rem;border-bottom:1px solid var(--border);}
  .lc-room-panel-title{font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;color:var(--text3);margin-bottom:.8rem;}
  .lc-panel-prod{display:flex;gap:.8rem;cursor:pointer;margin-bottom:.8rem;padding:.6rem;border:1px solid transparent;transition:border-color .2s;}
  .lc-panel-prod:hover{border-color:var(--border);}
  .lc-panel-prod img{width:44px;height:58px;object-fit:cover;flex-shrink:0;}
  .lc-panel-prod-name{font-size:.74rem;margin-bottom:.25rem;color:var(--text2);}
  .lc-panel-prod-price{font-size:.7rem;color:var(--accent);}
  .lc-end-btn{
    width:calc(100% - 2.6rem);margin:auto 1.3rem 1.3rem;
    padding:.7rem;background:rgba(160,80,80,.15);color:#c07a7a;
    border:1px solid rgba(160,80,80,.3);font-size:.68rem;letter-spacing:.1em;
    cursor:pointer;font-family:'Noto Sans JP',sans-serif;text-transform:uppercase;
    transition:background .2s;
  }
  .lc-end-btn:hover{background:rgba(160,80,80,.3);}

  /* ── STAFF & VIDEO PAGES ── */
  .story-tabs { display: flex; gap: 0; border-bottom: 1px solid var(--border); margin-bottom: 3rem; }
  .story-tab {
    padding: .9rem 2rem; font-size: .68rem; letter-spacing: .18em; text-transform: uppercase;
    cursor: pointer; background: none; border: none; color: var(--text3);
    font-family: 'Noto Sans JP', sans-serif; border-bottom: 2px solid transparent;
    margin-bottom: -1px; transition: all .2s;
  }
  .story-tab:hover { color: var(--text); }
  .story-tab.on { color: var(--text); border-bottom-color: var(--accent); }

  /* article grid */
  .art-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: var(--border); }
  @media(max-width:900px){ .art-grid{grid-template-columns:repeat(2,1fr);} }
  @media(max-width:600px){ .art-grid{grid-template-columns:1fr;} }
  .art-card { background: var(--bg); cursor: pointer; transition: opacity .25s; }
  .art-card:hover { opacity: .85; }
  .art-card-img { height: 240px; overflow: hidden; position: relative; }
  .art-card-img img { width:100%; height:100%; object-fit:cover; transition: transform .5s; }
  .art-card:hover .art-card-img img { transform: scale(1.04); }
  .art-card-body { padding: 1.4rem 1.5rem 1.8rem; }
  .art-tag { font-size: .55rem; letter-spacing: .2em; color: var(--accent); text-transform: uppercase; margin-bottom: .6rem; }
  .art-title { font-family: 'Cormorant Garamond', serif; font-size: 1.25rem; font-weight: 300; line-height: 1.45; margin-bottom: .7rem; }
  .art-lead { font-size: .75rem; color: var(--text2); line-height: 1.85; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .art-meta { display: flex; align-items: center; gap: .8rem; }
  .art-avatar { width: 28px; height: 28px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
  .art-avatar img { width:100%; height:100%; object-fit:cover; }
  .art-staff-name { font-size: .65rem; color: var(--text3); }
  .art-date { font-size: .62rem; color: var(--text3); margin-left: auto; }
  .art-read { font-size: .6rem; color: var(--text3); }

  /* article detail */
  .art-detail-hero { width:100%; height:clamp(280px,40vw,500px); overflow:hidden; }
  .art-detail-hero img { width:100%; height:100%; object-fit:cover; }
  .art-detail-body { max-width: 720px; margin: 0 auto; padding: 3rem 2rem 5rem; }
  .art-detail-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.8rem,3.5vw,3rem); font-weight: 300; line-height: 1.2; margin-bottom: 1.2rem; }
  .art-detail-lead { font-size: .88rem; line-height: 2; color: var(--text2); margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid var(--border); }
  .art-detail-text { font-size: .84rem; line-height: 2.2; color: var(--text2); white-space: pre-line; }
  .art-staff-bar { display: flex; align-items: center; gap: 1rem; padding: 1.5rem 0; border-top: 1px solid var(--border); margin-top: 2.5rem; }
  .art-staff-bar-avatar { width: 48px; height: 48px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
  .art-staff-bar-avatar img { width:100%; height:100%; object-fit:cover; }
  .art-staff-bar-role { font-size: .6rem; letter-spacing: .14em; color: var(--text3); text-transform: uppercase; margin-bottom: .25rem; }
  .art-staff-bar-name { font-size: .85rem; color: var(--text); }
  .art-tags { display: flex; flex-wrap: wrap; gap: .4rem; margin-top: 1.8rem; }
  .art-tag-pill { padding: .22rem .7rem; border: 1px solid var(--border); font-size: .62rem; color: var(--text3); letter-spacing: .06em; }

  /* video grid */
  .vid-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
  @media(max-width:900px){ .vid-grid{grid-template-columns:repeat(2,1fr);} }
  @media(max-width:600px){ .vid-grid{grid-template-columns:1fr;} }
  .vid-card { cursor: pointer; transition: transform .25s; }
  .vid-card:hover { transform: translateY(-3px); }
  .vid-thumb { position: relative; aspect-ratio: 16/9; overflow: hidden; background: var(--bg2); }
  .vid-thumb img { width:100%; height:100%; object-fit:cover; transition: transform .5s; }
  .vid-card:hover .vid-thumb img { transform: scale(1.03); }
  .vid-play {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
    background: rgba(15,13,11,.35); transition: background .2s;
  }
  .vid-card:hover .vid-play { background: rgba(15,13,11,.55); }
  .vid-play-btn {
    width: 52px; height: 52px; border-radius: 50%;
    background: rgba(200,168,130,.9); display: flex; align-items: center; justify-content: center;
    transition: transform .2s;
  }
  .vid-card:hover .vid-play-btn { transform: scale(1.1); }
  .vid-duration {
    position: absolute; bottom: .6rem; right: .7rem;
    background: rgba(15,13,11,.8); color: var(--text); font-size: .62rem;
    padding: .15rem .45rem; letter-spacing: .05em;
  }
  .vid-info { padding: .9rem 0 0; }
  .vid-title { font-size: .84rem; line-height: 1.5; margin-bottom: .5rem; color: var(--text); }
  .vid-meta { display: flex; align-items: center; gap: .6rem; }
  .vid-avatar { width: 22px; height: 22px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
  .vid-avatar img { width:100%; height:100%; object-fit:cover; }
  .vid-staff { font-size: .62rem; color: var(--text3); }
  .vid-date { font-size: .6rem; color: var(--text3); margin-left: auto; }

  /* video modal */
  .vid-modal-bg {
    position: fixed; inset: 0; background: rgba(0,0,0,.88);
    z-index: 500; display: flex; align-items: center; justify-content: center;
    padding: 2rem; backdrop-filter: blur(8px);
    animation: fadeIn .2s ease;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .vid-modal {
    width: 100%; max-width: 900px; background: var(--bg2);
    border: 1px solid var(--border); overflow: hidden;
  }
  .vid-modal-player { position: relative; aspect-ratio: 16/9; background: #000; }
  .vid-modal-player iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }
  .vid-modal-info { padding: 1.5rem; }
  .vid-modal-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 300; margin-bottom: .6rem; }
  .vid-modal-desc { font-size: .78rem; line-height: 1.9; color: var(--text2); margin-bottom: 1rem; }
  .vid-modal-close {
    position: absolute; top: 1rem; right: 1rem; z-index: 10;
    background: rgba(15,13,11,.7); border: 1px solid var(--border);
    color: var(--text2); cursor: pointer; width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; transition: color .2s;
  }
  .vid-modal-close:hover { color: var(--text); }

  /* ── FOOTER ── */
  .ftr { background: #080705; color: var(--text3); padding: 4rem 2rem 2rem; border-top: 1px solid var(--border); }
  .ftr-grid { max-width: 1440px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 3rem; }
  @media(max-width:900px){ .ftr-grid{grid-template-columns:1fr 1fr; gap:2rem;} }
  @media(max-width:600px){ .ftr-grid{grid-template-columns:1fr;} }
  .ftr-logo { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; color: var(--text); letter-spacing: .2em; margin-bottom: 1rem; }
  .ftr-tagline { font-size: .74rem; line-height: 1.9; color: var(--text3); max-width: 24ch; }
  .ftr-col-title { font-size: .58rem; letter-spacing: .25em; color: var(--text3); margin-bottom: 1rem; text-transform: uppercase; }
  .ftr-link { font-size: .74rem; margin-bottom: .55rem; cursor: pointer; transition: color .2s; }
  .ftr-link:hover { color: var(--text); }
  .ftr-bottom { max-width: 1440px; margin: 0 auto; padding-top: 1.5rem; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
  .ftr-copy { font-size: .62rem; color: var(--text3); }

  /* ── PAGE HEADER ── */
  .page-hdr { background: var(--bg2); padding: 8rem 2rem 3rem; border-bottom: 1px solid var(--border); }
  .page-hdr-in { max-width: 1440px; margin: 0 auto; }
`;

// ── helpers ──
function Placeholder({ color = "#2a1f1a", image = null, style = {}, className = "", alt = "" }) {
  if (image) {
    return (
      <img
        src={image} alt={alt}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }}
        loading="lazy"
        onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement.style.background = color; }}
      />
    );
  }
  return (
    <div className={className} style={{
      background: color, width: "100%", height: "100%",
      display: "flex", alignItems: "center", justifyContent: "center",
      ...style
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(200,168,130,0.2)" strokeWidth="1">
        <rect x="3" y="3" width="18" height="18" rx="1"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21,15 16,10 5,21"/>
      </svg>
    </div>
  );
}

function ProductCard({ product, categories, onClick }) {
  return (
    <div className="pc pe" onClick={() => onClick(product)}>
      <div className="pc-img">
        <div className="pc-img-inner">
          <Placeholder color={product.color} image={product.image} alt={product.name} style={{width:"100%",height:"100%"}} />
        </div>
        <div className="pc-badges">
          {product.is_new && <span className="b-tag b-new">New</span>}
          {product.is_best_seller && <span className="b-tag b-best">Best</span>}
          {product.sale_price && <span className="b-tag b-sale">Sale</span>}
        </div>
        {product.stock_quantity === 0 && <div className="oos">SOLD OUT</div>}
      </div>
      <div className="pc-info">
        <div className="pc-name">{product.name}</div>
        <div className="pc-price">
          {product.sale_price
            ? <><span className="op">¥{product.price.toLocaleString()}</span><span className="sp">¥{product.sale_price.toLocaleString()}</span></>
            : <span>¥{product.price.toLocaleString()}</span>}
        </div>
      </div>
    </div>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t); }, []);
  return <div className="toast">✓ {message}</div>;
}

// ── SVG ICONS ──
const IconSearch = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconUser = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconCart = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const IconSettings = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

// ── APP ──
export default function SelectShop() {
  const [page, setPage] = useState("home");
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [adminPage, setAdminPage] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const nav = (p, extra = {}) => {
    setPage(p);
    if (extra.product) setSelectedProduct(extra.product);
    if (extra.article) setSelectedArticle(extra.article);
    if (extra.video)   setSelectedVideo(extra.video);
    setDrawerOpen(false);
    window.scrollTo(0, 0);
  };
  const showToast = (m) => setToast(m);
  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    });
    showToast(`${product.name} をカートに追加しました`);
  };
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const drawerItems = [
    { label: "COLLECTION",   page: "products" },
    { label: "NEW",          page: "new" },
    { label: "GIFT",         page: "best" },
    { label: "STAFF REVIEW", page: "story" },
    { label: "VIDEO",        page: "video" },
    { label: "LIVE 接客",    page: "live" },
    { label: "ABOUT",        page: "about" },
  ];

  return (
    <div className="wrap">
      <style>{css}</style>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:200,backdropFilter:"blur(4px)"}} />
      )}

      <div style={{
        position:"fixed", top:0, left:0, height:"100%", width:"75vw", maxWidth:"300px",
        background:"#0f0d0b", zIndex:201,
        transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
        transition:"transform 0.32s cubic-bezier(0.4,0,0.2,1)",
        display:"flex", flexDirection:"column",
        borderRight:"1px solid #2e2820",
      }}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1rem 1.5rem",borderBottom:"1px solid #2e2820"}}>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.2rem",letterSpacing:".2em",color:"#f0ece5"}}>{settings.shopName}</span>
          <button onClick={() => setDrawerOpen(false)} style={{background:"none",border:"none",cursor:"pointer",color:"#5a5048",fontSize:"1.1rem"}}>✕</button>
        </div>
        <nav style={{flex:1,paddingTop:"1rem"}}>
          {drawerItems.map(item => (
            <button key={item.label} onClick={() => nav(item.page)} style={{
              display:"block", width:"100%", textAlign:"left",
              padding:"1rem 1.5rem", background:"none", border:"none",
              borderBottom:"1px solid #1e1a14", cursor:"pointer",
              fontSize:"0.8rem", letterSpacing:"0.16em", color:"#a09080",
              fontFamily:"'Noto Sans JP',sans-serif", transition:"color 0.15s",
            }}
            onMouseEnter={e=>e.currentTarget.style.color="#f0ece5"}
            onMouseLeave={e=>e.currentTarget.style.color="#a09080"}
            >{item.label}</button>
          ))}
        </nav>
        <div style={{padding:"1.5rem",borderTop:"1px solid #2e2820",fontSize:"0.65rem",letterSpacing:"0.2em",color:"#5a5048"}}>
          {settings.contactEmail}
        </div>
      </div>

      {page !== "admin" && <>
        <header className="hdr">
          <div className="hdr-in">
            <span className="logo" onClick={() => nav("home")}>{settings.shopName}</span>
            <nav className="nav">
              {[["products","COLLECTION"],["new","NEW"],["best","GIFT"],["story","REVIEW"],["video","VIDEO"],["live","LIVE"]].map(([p,l]) => (
                <button key={l} className={`nl ${page===p?"on":""}`} onClick={() => nav(p)}>{l}</button>
              ))}
            </nav>
            <div className="hdr-r">
              <button className="ib"><IconSearch /></button>
              <button className="ib"><IconUser /></button>
              <button className="ib" onClick={() => nav("admin")} title="管理画面"><IconSettings /></button>
              <button className="ib" style={{position:"relative"}} onClick={() => nav("cart")}>
                <IconCart />
                {cartCount > 0 && <span className="cbadge">{cartCount}</span>}
              </button>
            </div>
          </div>
        </header>
        <header className="mhdr">
          <div className="mhdr-in">
            <button className="ib" onClick={() => setDrawerOpen(true)}><IconMenu /></button>
            <span className="logo" onClick={() => nav("home")}>{settings.shopName}</span>
            <div style={{display:"flex",gap:".5rem"}}>
              <button className="ib" onClick={() => nav("admin")}><IconSettings /></button>
              <button className="ib" style={{position:"relative"}} onClick={() => nav("cart")}>
                <IconCart />
                {cartCount > 0 && <span className="cbadge">{cartCount}</span>}
              </button>
            </div>
          </div>
        </header>
      </>}

      {page === "home"            && <HomePage       products={products} categories={categories} settings={settings} nav={nav} addToCart={addToCart} />}
      {page === "products"        && <ProductsPage   products={products} categories={categories} nav={nav} />}
      {page === "new"             && <FilteredPage   products={products.filter(p=>p.is_new)} categories={categories} nav={nav} title="New Arrivals" label="New" />}
      {page === "best"            && <FilteredPage   products={products.filter(p=>p.is_best_seller)} categories={categories} nav={nav} title="Best Sellers" label="Gift" />}
      {page === "product-detail"  && <DetailPage     product={selectedProduct} products={products} categories={categories} nav={nav} addToCart={addToCart} />}
      {page === "cart"            && <CartPage       cart={cart} setCart={setCart} nav={nav} settings={settings} />}
      {page === "about"           && <AboutPage      settings={settings} />}
      {page === "story"           && <StaffStoryPage nav={nav} products={products} />}
      {page === "article-detail"  && <ArticleDetailPage article={selectedArticle} nav={nav} products={products} addToCart={addToCart} />}
      {page === "video"           && <VideoPage        nav={nav} products={products} />}
      {page === "live"            && <LiveConsultPage nav={nav} products={products} addToCart={addToCart} />}
      {page === "admin"           && <AdminPage      categories={categories} setCategories={setCategories} products={products} setProducts={setProducts} settings={settings} setSettings={setSettings} nav={nav} adminPage={adminPage} setAdminPage={setAdminPage} />}
    </div>
  );
}

// ── HOME ──
function HomePage({ products, categories, settings, nav, addToCart }) {
  const newItems = products.filter(p => p.is_new).slice(0, 8);
  const [email, setEmail] = useState("");

  const collItems = products.filter(p => p.is_featured).slice(0, 4);

  return (
    <div className="pe">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-model">
          <div className="hero-img-inner" style={{
            width:"100%", height:"100%",
            background:"linear-gradient(135deg,#1c1208 0%,#0f0d0b 50%,#1a0f0a 100%)",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <svg width="80" height="120" viewBox="0 0 80 120" fill="none" opacity="0.08">
              <path d="M40 10 Q60 30 55 60 Q50 90 40 110 Q30 90 25 60 Q20 30 40 10Z" stroke="#c8a882" strokeWidth="1" fill="none"/>
              <path d="M20 40 Q40 50 60 40" stroke="#c8a882" strokeWidth="0.5" fill="none"/>
              <path d="M15 60 Q40 72 65 60" stroke="#c8a882" strokeWidth="0.5" fill="none"/>
            </svg>
          </div>
        </div>
        <div className="hero-overlay" />

        <div className="hero-dots">
          {[0,1,2].map(i => <div key={i} className={`hero-dot ${i===0?"on":""}`} />)}
        </div>

        <div className="hero-content">
          <div className="hero-eyebrow">NEW COLLECTION 2025</div>
          <h1 className="hero-h fd" style={{whiteSpace:"pre-line"}}>{settings.mainCopy}</h1>
          <p className="hero-sub" style={{whiteSpace:"pre-line"}}>{settings.subCopy}</p>
          <div style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
            <button className="btn btn-p" onClick={() => nav("products")}>STAR COLLECTION</button>
            <button className="btn btn-o" onClick={() => nav("new")}>NEW ARRIVALS →</button>
          </div>
        </div>

        <div className="hero-scroll">
          <span>SCROLL</span>
          <div className="hero-scroll-line" />
        </div>
      </section>

      {/* Mood Shopping */}
      <section className="mood-section">
        <div className="mood-header">
          <div>
            <div className="sl">MOOD SHOPPING</div>
            <h2 className="sh fd" style={{fontSize:"1.6rem"}}>気分から探す</h2>
          </div>
          <span className="view-all" onClick={() => nav("products")}>VIEW ALL</span>
        </div>
        <div className="mood-scroll">
          {MOOD_CATEGORIES.map((mood, idx) => (
            <div className="mood-card" key={mood.id} onClick={() => nav("products")}>
              <div className="mood-img">
                <img
                  src={MOOD_IMAGES[idx]}
                  alt={mood.jp}
                  style={{width:"100%",height:"100%",objectFit:"cover",display:"block",filter:"brightness(0.7)"}}
                  loading="lazy"
                  onError={e=>{e.currentTarget.style.display="none";e.currentTarget.parentElement.style.background=mood.color;}}
                />
              </div>
              <div className="mood-label">{mood.label}</div>
              <div className="mood-jp">{mood.jp}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Collection */}
      <section style={{borderTop:"1px solid var(--border)"}}>
        <div style={{maxWidth:"1440px",margin:"0 auto",padding:"4rem 2rem 1.5rem"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"2rem"}}>
            <div>
              <div className="sl">COLLECTION</div>
              <h2 className="sh fd" style={{fontSize:"1.6rem"}}>コレクションから選ぶ</h2>
            </div>
            <span className="view-all" onClick={() => nav("products")}>VIEW ALL</span>
          </div>
        </div>
        <div style={{maxWidth:"1440px",margin:"0 auto",padding:"0 2rem 5rem"}}>
          <div className="coll-grid">
            {collItems.length > 0 && (
              <div className="coll-item" onClick={() => nav("product-detail", {product: collItems[0]})}>
                <div className="coll-img" style={{height:"600px"}}>
                  <div className="coll-img-inner" style={{height:"100%"}}>
                    <Placeholder color={collItems[0]?.color} image={collItems[0]?.image} alt={collItems[0]?.name} style={{width:"100%",height:"100%"}} />
                  </div>
                </div>
                <div className="coll-info">
                  <div className="coll-cat">Featured</div>
                  <div className="coll-name">{collItems[0]?.name}</div>
                </div>
              </div>
            )}
            {collItems.slice(1).map(p => (
              <div className="coll-item" key={p.id} onClick={() => nav("product-detail", {product: p})}>
                <div className="coll-img coll-img-other">
                  <div className="coll-img-inner" style={{height:"100%"}}>
                    <Placeholder color={p.color} image={p.image} alt={p.name} style={{width:"100%",height:"100%"}} />
                  </div>
                </div>
                <div className="coll-info">
                  <div className="coll-cat">{categories.find(c=>p.category_ids.includes(c.id))?.name}</div>
                  <div className="coll-name">{p.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section style={{borderTop:"1px solid var(--border)",paddingBottom:"5rem"}}>
        <div style={{maxWidth:"1440px",margin:"0 auto",padding:"4rem 2rem 1.5rem"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"2rem"}}>
            <div>
              <div className="sl">NEW ARRIVAL</div>
              <h2 className="sh fd" style={{fontSize:"1.6rem"}}>新着アイテム</h2>
            </div>
            <span className="view-all" onClick={() => nav("new")}>VIEW ALL</span>
          </div>
        </div>
        <div style={{padding:"0 2rem"}}>
          <div className="hscroll">
            {newItems.map(p => (
              <ProductCard key={p.id} product={p} categories={categories} onClick={prod => nav("product-detail",{product:prod})} />
            ))}
          </div>
        </div>
      </section>

      {/* Style Quiz */}
      <section className="quiz-section">
        <div style={{maxWidth:"600px",margin:"0 auto"}}>
          <div className="sl" style={{textAlign:"center",marginBottom:"1.5rem"}}>STYLE QUIZ</div>
          <h2 className="fd" style={{fontSize:"clamp(2rem,4vw,3rem)",fontWeight:300,lineHeight:1.2,marginBottom:"1.2rem"}}>
            暮らしの診断
          </h2>
          <p style={{fontSize:".8rem",lineHeight:2,color:"var(--text2)",marginBottom:"2.5rem"}}>
            あなたの暮らしのスタイルに合った雑貨をご提案します。<br/>
            いくつかの質問に答えるだけで、ぴったりのアイテムが見つかります。
          </p>
          <button className="btn btn-a" onClick={() => nav("products")}>診断を始める →</button>
        </div>
      </section>

      {/* Journal */}
      <section style={{borderTop:"1px solid var(--border)"}}>
        <div style={{maxWidth:"1440px",margin:"0 auto",padding:"4rem 2rem 2rem"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"2rem"}}>
            <div>
              <div className="sl">JOURNAL</div>
              <h2 className="sh fd" style={{fontSize:"1.6rem"}}>ジャーナル</h2>
            </div>
            <span className="view-all" onClick={() => {}}>VIEW ALL</span>
          </div>
        </div>
        <div style={{maxWidth:"1440px",margin:"0 auto",padding:"0 2rem 5rem"}}>
          <div className="journal-grid">
            {JOURNAL_POSTS.map(post => (
              <div className="jcard" key={post.id}>
                <div className="jcard-img">
                  <div className="jcard-img-inner">
                    <Placeholder color={post.color} image={post.image} alt={post.title} style={{width:"100%",height:"100%"}} />
                  </div>
                </div>
                <div className="jcard-info">
                  <div className="jcard-cat">{post.category}</div>
                  <div className="jcard-title fd">{post.title}</div>
                  <div className="jcard-date">{post.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="nl-section">
        <div className="sl" style={{textAlign:"center",marginBottom:"1.2rem"}}>NEWSLETTER</div>
        <h2 className="fd" style={{fontSize:"clamp(1.8rem,3vw,2.6rem)",fontWeight:300,marginBottom:".8rem"}}>
          メールマガジン登録
        </h2>
        <p style={{fontSize:".78rem",color:"var(--text2)",lineHeight:1.9}}>
          新商品・限定セール・スタイリングのヒントをいち早くお届けします。
        </p>
        <div className="nl-form">
          <input
            className="nl-inp"
            type="email"
            placeholder="メールアドレスを入力"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button className="nl-btn" onClick={() => { setEmail(""); }}>登録</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="ftr">
        <div className="ftr-grid">
          <div>
            <div className="ftr-logo">{settings.shopName}</div>
            <p className="ftr-tagline">本質的な美しさと、肌に馴染む上質さ。いちばん近くにある、いちばん大切なもの。</p>
          </div>
          {[
            ["SHOPPING", ["COLLECTION","BRIDE","NEW ARRIVAL","GIFT","SALE"]],
            ["SUPPORT",  ["お問い合わせ","サイズガイド","配送・返品","FAQ"]],
            ["COMPANY",  ["About CKD","Journal","特定商取引法","プライバシーポリシー"]],
          ].map(([title, items]) => (
            <div key={title}>
              <div className="ftr-col-title">{title}</div>
              {items.map(item => <div className="ftr-link" key={item}>{item}</div>)}
            </div>
          ))}
        </div>
        <div className="ftr-bottom">
          <span className="ftr-copy">© 2025 {settings.shopName}. All rights reserved.</span>
          <span className="ftr-copy" style={{letterSpacing:".1em"}}>JP / EN</span>
        </div>
      </footer>
    </div>
  );
}

// ── PRODUCTS PAGE ──
function ProductsPage({ products, categories, nav }) {
  const [cats, setCats] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [flags, setFlags] = useState({ inStock: false, isNew: false, isBest: false });

  const toggle = (arr, setArr, v) => setArr(prev => prev.includes(v) ? prev.filter(x=>x!==v) : [...prev,v]);
  const toggleF = k => setFlags(f => ({...f,[k]:!f[k]}));

  const filtered = products.filter(p => {
    if (!p.is_published) return false;
    if (cats.length && !p.category_ids.some(id => cats.includes(id))) return false;
    if (budgets.length && !budgets.includes(p.budget_range)) return false;
    if (flags.inStock && p.stock_quantity === 0) return false;
    if (flags.isNew && !p.is_new) return false;
    if (flags.isBest && !p.is_best_seller) return false;
    return true;
  });

  const dirty = cats.length || budgets.length || Object.values(flags).some(Boolean);

  return (
    <div className="pe">
      <div className="page-hdr">
        <div className="page-hdr-in">
          <div className="sl">SHOP</div>
          <h1 className="fd" style={{fontSize:"2.5rem",fontWeight:300}}>COLLECTION</h1>
          <div style={{fontSize:".7rem",color:"var(--text3)",marginTop:".4rem"}}>{filtered.length} ITEMS</div>
        </div>
      </div>
      <div className="sec" style={{paddingTop:"3rem"}}>
        <div className="pl">
          <aside>
            <div className="fg">
              <div className="fg-title">カテゴリ</div>
              {categories.filter(c => c.is_active).map(cat => (
                <div className="fi" key={cat.id} onClick={() => toggle(cats, setCats, cat.id)}>
                  <input type="checkbox" className="fchk" checked={cats.includes(cat.id)} readOnly />
                  <span className="flbl">{cat.name}</span>
                </div>
              ))}
            </div>
            <div className="fg">
              <div className="fg-title">価格帯</div>
              {BUDGET_RANGES.map(b => (
                <div className="fi" key={b} onClick={() => toggle(budgets, setBudgets, b)}>
                  <input type="checkbox" className="fchk" checked={budgets.includes(b)} readOnly />
                  <span className="flbl">{b}</span>
                </div>
              ))}
            </div>
            <div className="fg">
              <div className="fg-title">絞り込み</div>
              {[["inStock","在庫あり"],["isNew","New"],["isBest","Best"]].map(([k,l]) => (
                <div className="fi" key={k} onClick={() => toggleF(k)}>
                  <input type="checkbox" className="fchk" checked={!!flags[k]} readOnly />
                  <span className="flbl">{l}</span>
                </div>
              ))}
            </div>
            {dirty && (
              <button className="btn btn-o btn-sm" style={{width:"100%"}}
                onClick={() => {setCats([]);setBudgets([]);setFlags({inStock:false,isNew:false,isBest:false});}}>
                リセット
              </button>
            )}
          </aside>
          <div>
            {filtered.length === 0
              ? <div className="empty"><div className="empty-t">該当商品がありません</div></div>
              : <div className="pg">{filtered.map(p => <ProductCard key={p.id} product={p} categories={categories} onClick={prod => nav("product-detail",{product:prod})} />)}</div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// ── FILTERED PAGE ──
function FilteredPage({ products, categories, nav, title, label }) {
  return (
    <div className="pe">
      <div className="page-hdr">
        <div className="page-hdr-in">
          <div className="sl">{label.toUpperCase()}</div>
          <h1 className="fd" style={{fontSize:"2.5rem",fontWeight:300}}>{title}</h1>
          <div style={{fontSize:".7rem",color:"var(--text3)",marginTop:".4rem"}}>{products.length} ITEMS</div>
        </div>
      </div>
      <div className="sec">
        {products.length === 0
          ? <div className="empty"><div className="empty-t">商品がありません</div></div>
          : <div className="pg">{products.map(p => <ProductCard key={p.id} product={p} categories={categories} onClick={prod => nav("product-detail",{product:prod})} />)}</div>
        }
      </div>
    </div>
  );
}

// ── DETAIL PAGE ──
function DetailPage({ product, products, categories, nav, addToCart }) {
  const [qty, setQty] = useState(1);
  if (!product) return <div className="empty"><div className="empty-t">商品が見つかりません</div></div>;
  const cat = categories.find(c => product.category_ids.includes(c.id));
  const related = products.filter(p => p.id !== product.id && p.category_ids.some(id => product.category_ids.includes(id))).slice(0, 4);

  return (
    <div className="pe">
      <div className="sec" style={{paddingTop:"6rem"}}>
        <div className="bc">
          <span onClick={() => nav("home")}>Home</span> ›
          <span onClick={() => nav("products")}>Shop</span> ›
          <span>{product.name}</span>
        </div>
        <div className="pd">
          <div>
            <div style={{aspectRatio:"3/4",overflow:"hidden"}}>
              <Placeholder color={product.color} image={product.image} alt={product.name} style={{width:"100%",height:"100%"}} />
            </div>
            <div className="gthumb">
              {[...Array(4)].map((_,i) => (
                <div className={`gth ${i===0?"on":""}`} key={i}>
                  <Placeholder color={product.color} image={product.image} alt={product.name} style={{opacity:i===0?1:0.5,width:"100%",height:"100%"}} />
                </div>
              ))}
            </div>
          </div>
          <div>
            {cat && <div style={{fontSize:".6rem",letterSpacing:".18em",color:"var(--accent)",marginBottom:".8rem",textTransform:"uppercase"}}>{cat.name}</div>}
            <h1 className="pd-name">{product.name}</h1>
            <div className="pd-price">
              {product.sale_price
                ? <><span className="op" style={{fontSize:".9rem"}}>¥{product.price.toLocaleString()}</span> <span className="sp">¥{product.sale_price.toLocaleString()}</span></>
                : <span>¥{product.price.toLocaleString()}</span>}
              <span style={{fontSize:".65rem",color:"var(--text3)",marginLeft:".5rem"}}>（税込）</span>
            </div>
            <p className="pd-desc">{product.description}</p>
            <div className="specs">
              {[["素材",product.material],["サイズ",product.size],["カラー",product.color_name||"—"],["配送目安","2〜4営業日"]].map(([k,v]) => (
                <div key={k}><div className="spec-k">{k}</div><div className="spec-v">{v}</div></div>
              ))}
            </div>
            {product.stock_quantity > 0 ? <>
              <div className="qty-row">
                <span className="qty-label">数量</span>
                <button className="qb" onClick={() => setQty(q=>Math.max(1,q-1))}>−</button>
                <span className="qv">{qty}</span>
                <button className="qb" onClick={() => setQty(q=>Math.min(product.stock_quantity,q+1))}>＋</button>
              </div>
              <button className="btn btn-p btn-w" onClick={() => addToCart(product,qty)}>カートに入れる</button>
            </> : (
              <button className="btn btn-o btn-w" disabled style={{cursor:"not-allowed",opacity:.4}}>SOLD OUT</button>
            )}
            <div style={{marginTop:"1.2rem"}}>
              {product.tags.map(t => <span className="chip" key={t}>{t}</span>)}
            </div>
          </div>
        </div>

        {related.length > 0 && <>
          <hr className="divider" />
          <div className="sl">RELATED ITEMS</div>
          <h2 className="fd" style={{fontSize:"1.8rem",fontWeight:300,marginBottom:"2rem"}}>関連商品</h2>
          <div className="rel-grid">
            {related.map(p => <ProductCard key={p.id} product={p} categories={categories} onClick={prod => nav("product-detail",{product:prod})} />)}
          </div>
        </>}
      </div>

      {product.stock_quantity > 0 && (
        <div className="mb-bar">
          <button className="btn btn-p btn-w" onClick={() => addToCart(product,1)}>
            カートに入れる — ¥{product.price.toLocaleString()}
          </button>
        </div>
      )}
    </div>
  );
}

// ── CART PAGE ──
function CartPage({ cart, setCart, nav, settings }) {
  const sub = cart.reduce((s,i) => s+(i.sale_price||i.price)*i.qty, 0);
  const ship = sub >= settings.freeShippingLine ? 0 : settings.shippingFee;
  const total = sub + ship;

  const updQty = (id, d) => setCart(prev => prev.map(i => i.id===id ? {...i,qty:Math.max(1,i.qty+d)} : i));
  const rm = id => setCart(prev => prev.filter(i => i.id!==id));

  if (cart.length === 0) return (
    <div className="pe">
      <div className="sec" style={{textAlign:"center",paddingTop:"8rem"}}>
        <div className="fd" style={{fontSize:"2rem",fontWeight:300,marginBottom:"1rem"}}>カートは空です</div>
        <p style={{color:"var(--text3)",fontSize:".8rem",marginBottom:"2.5rem"}}>商品をカートに追加してください</p>
        <button className="btn btn-p" onClick={() => nav("products")}>ショッピングを続ける</button>
      </div>
    </div>
  );

  return (
    <div className="pe">
      <div className="page-hdr">
        <div className="page-hdr-in">
          <h1 className="fd" style={{fontSize:"2.2rem",fontWeight:300}}>CART</h1>
          <div style={{fontSize:".7rem",color:"var(--text3)"}}>{cart.reduce((s,i)=>s+i.qty,0)} ITEMS</div>
        </div>
      </div>
      <div className="sec">
        <div className="cart-lay">
          <div>
            {cart.map(item => (
              <div className="ci" key={item.id}>
                <div style={{aspectRatio:"3/4",overflow:"hidden"}}>
                  <Placeholder color={item.color} image={item.image} alt={item.name} style={{width:"100%",height:"100%"}} />
                </div>
                <div>
                  <div className="ci-name">{item.name}</div>
                  <div className="ci-price">¥{(item.sale_price||item.price).toLocaleString()}</div>
                  <div style={{display:"flex",alignItems:"center",gap:".75rem",marginTop:".6rem"}}>
                    <button className="qb" style={{width:"26px",height:"26px"}} onClick={() => updQty(item.id,-1)}>−</button>
                    <span style={{fontSize:".82rem",minWidth:"1.4rem",textAlign:"center"}}>{item.qty}</span>
                    <button className="qb" style={{width:"26px",height:"26px"}} onClick={() => updQty(item.id,1)}>＋</button>
                  </div>
                  <button className="ci-rm" onClick={() => rm(item.id)}>削除</button>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="os">
              <div style={{fontSize:".62rem",letterSpacing:".2em",textTransform:"uppercase",color:"var(--text3)",marginBottom:"1.5rem"}}>ORDER SUMMARY</div>
              <div className="os-row"><span>小計</span><span>¥{sub.toLocaleString()}</span></div>
              <div className="os-row"><span>送料</span><span>{ship===0?"無料":`¥${ship.toLocaleString()}`}</span></div>
              {sub < settings.freeShippingLine && (
                <div style={{fontSize:".68rem",color:"var(--accent)",marginBottom:".8rem"}}>
                  あと¥{(settings.freeShippingLine-sub).toLocaleString()}で送料無料
                </div>
              )}
              <div className="os-total"><span>合計（税込）</span><span>¥{total.toLocaleString()}</span></div>
              <button className="btn btn-p btn-w" style={{marginTop:"1.5rem"}}>ご購入手続きへ</button>
              <button className="btn btn-o btn-w" style={{marginTop:".75rem"}} onClick={() => nav("products")}>買い物を続ける</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ABOUT PAGE ──
function AboutPage({ settings }) {
  return (
    <div className="pe">
      <div style={{background:"var(--bg2)",padding:"8rem 2rem 5rem",textAlign:"center",borderBottom:"1px solid var(--border)"}}>
        <div className="sl" style={{marginBottom:"1.5rem"}}>ABOUT</div>
        <h1 className="fd" style={{fontSize:"clamp(2.5rem,6vw,4.5rem)",fontWeight:300,lineHeight:1.1}}>
          Less is More,<br/><em>But Better.</em>
        </h1>
      </div>
      <div style={{maxWidth:"680px",margin:"0 auto",padding:"5rem 2rem"}}>
        {[
          "CKD SHOPは、「日常にある道具の質が、暮らしの質を高める」という信念から生まれたセレクト雑貨店です。",
          "私たちが選ぶのは「素材の良さ」「つくり手の誠実さ」「使うたびに増す愛着」を基準にした、長く使えるものだけです。",
          "流行ではなく、本質へ。毎日手に取るものだからこそ、静かに豊かにしてくれる一点を届けることが私たちの仕事です。",
        ].map((t,i) => (
          <p key={i} style={{fontSize:".84rem",lineHeight:2.2,color:"var(--text2)",marginBottom:"2rem"}}>{t}</p>
        ))}
        <button className="btn btn-a">お問い合わせ →</button>
      </div>
    </div>
  );
}

// ── ADMIN ──
function AdminPage({ categories, setCategories, products, setProducts, settings, setSettings, nav, adminPage, setAdminPage }) {
  const [editProd, setEditProd] = useState(null);
  const [editCat, setEditCat] = useState(null);

  const navItems = [
    {key:"dashboard",label:"ダッシュボード",icon:"◈"},
    {key:"products",label:"商品管理",icon:"◻"},
    {key:"categories",label:"カテゴリ管理",icon:"◱"},
    {key:"orders",label:"注文管理",icon:"◳"},
    {key:"settings",label:"サイト設定",icon:"◎"},
  ];

  return (
    <div className="adm pe">
      <aside className="adm-side">
        <div className="adm-logo">{settings.shopName}</div>
        {navItems.map(item => (
          <div key={item.key}
            className={`adm-ni ${(adminPage===item.key||(item.key==="products"&&adminPage==="products-new"))?"on":""}`}
            onClick={() => {setAdminPage(item.key);setEditProd(null);setEditCat(null);}}>
            <span>{item.icon}</span>{item.label}
          </div>
        ))}
        <div style={{borderTop:"1px solid var(--border)",marginTop:"1rem",paddingTop:"1rem"}}>
          <div className="adm-ni" onClick={() => nav("home")}><span>⬡</span>サイトを見る</div>
        </div>
      </aside>
      <main className="adm-main">
        {adminPage==="dashboard"    && <AdminDash products={products} setAdminPage={setAdminPage} />}
        {(adminPage==="products" || adminPage==="products-new") && (
          <AdminProds
            products={products} setProducts={setProducts}
            categories={categories}
            editProd={editProd} setEditProd={setEditProd}
            openNew={adminPage==="products-new"}
          />
        )}
        {adminPage==="categories"   && <AdminCats  categories={categories} setCategories={setCategories} editCat={editCat} setEditCat={setEditCat} />}
        {adminPage==="orders"       && <AdminOrders />}
        {adminPage==="settings"     && <AdminSettings settings={settings} setSettings={setSettings} />}
      </main>
    </div>
  );
}

function AdminDash({ products, setAdminPage }) {
  const pub = products.filter(p=>p.is_published).length;
  const oos = products.filter(p=>p.stock_quantity===0).length;
  const newC = products.filter(p=>p.is_new).length;
  const total = products.reduce((s,p)=>s+p.price,0);
  return (
    <div>
      <div className="adm-title">Dashboard</div>
      <div className="adm-sub">ショップの概要</div>
      <div className="stat-grid">
        {[["公開中の商品",pub,"件"],["在庫切れ",oos,"件"],["NEW商品",newC,"件"],["登録商品数",products.length,"件"]].map(([l,v,u]) => (
          <div className="stat" key={l}>
            <div className="stat-l">{l}</div>
            <div className="stat-v">{v} <span className="stat-u">{u}</span></div>
          </div>
        ))}
      </div>
      <div className="panel">
        <div className="panel-t">Quick Links</div>
        <div style={{display:"flex",gap:".75rem",flexWrap:"wrap"}}>
          <button className="btn btn-p btn-sm" onClick={() => setAdminPage("products-new")}>+ 商品を追加する</button>
          <button className="btn btn-o btn-sm" onClick={() => setAdminPage("categories")}>カテゴリを編集する</button>
          <button className="btn btn-o btn-sm" onClick={() => setAdminPage("settings")}>サイト設定を変更する</button>
        </div>
      </div>
    </div>
  );
}

const COLOR_SWATCHES = [
  { hex: "#2a1f1a", label: "ブラック" },
  { hex: "#1a1f2a", label: "ネイビー" },
  { hex: "#2a1a1f", label: "バーガンディ" },
  { hex: "#3a2a1a", label: "モカ" },
  { hex: "#1f1a26", label: "プラム" },
  { hex: "#261a26", label: "モーヴ" },
  { hex: "#1a2222", label: "フォレスト" },
  { hex: "#2e2520", label: "チャコール" },
  { hex: "#3a2e28", label: "トープ" },
  { hex: "#1e1e1e", label: "ジェット" },
];
const MATERIAL_OPTIONS = ["陶器","磁器","木材","リネン","コットン","真鍮","ガラス","鉄","紙","竹","ステンレス","シリコン"];
const SIZE_OPTIONS     = ["S","M","L","フリー","φ8cm","φ10cm","φ12cm","W15×D10cm","W24×D16cm","W30×D20cm"];
const COLOR_OPTIONS    = ["ナチュラル","スモークブラック","アッシュグレー","ウォールナット","クリア","ホワイト","ネイビー","テラコッタ","マットブラック","オリーブ"];

function makeBlank() {
  return {
    id: `prod-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
    name: "", slug: "", price: 0, sale_price: null,
    description: "", short_description: "",
    category_ids: [], tags: [],
    stock_quantity: 10,
    is_published: true, is_new: false, is_best_seller: false, is_featured: false,
    budget_range: "〜5,000円",
    material: "", size: "", color_name: "", color: "#2a1f1a",
  };
}

function toSlug(name) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "").replace(/-+/g, "-");
}

function AdminProds({ products, setProducts, categories, editProd, setEditProd, openNew: openNewProp }) {
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const openEdit = p => { setEditProd(p); setForm({...p}); setErrors({}); setTagInput(""); };
  const openNew  = () => {
    const b = makeBlank();
    setEditProd(b); setForm(b); setErrors({}); setTagInput("");
  };

  useEffect(() => {
    if (openNewProp) openNew();
  }, [openNewProp]);

  const setField = (k, v) => setForm(f => {
    const next = {...f, [k]: v};
    if (k === "name" && !products.find(p => p.id === f.id)?.slug) {
      next.slug = toSlug(v);
    }
    if (k === "price" || k === "sale_price") {
      next.budget_range = getBudgetRange(Number(next.price) || 0);
    }
    return next;
  });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "商品名は必須です";
    if (!form.price || form.price <= 0) e.price = "正しい価格を入力してください";
    if (form.category_ids.length === 0) e.category_ids = "カテゴリを1つ以上選択してください";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    const final = {
      ...form,
      price: Number(form.price),
      sale_price: form.sale_price ? Number(form.sale_price) : null,
      stock_quantity: Number(form.stock_quantity),
      budget_range: getBudgetRange(Number(form.price)),
    };
    setProducts(prev => {
      const ex = prev.find(p => p.id === final.id);
      return ex ? prev.map(p => p.id === final.id ? final : p) : [final, ...prev];
    });
    setEditProd(null); setForm(null);
  };

  const deleteProd = id => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleteConfirm(null);
    if (editProd?.id === id) { setEditProd(null); setForm(null); }
  };

  const togglePub = id => setProducts(prev => prev.map(p => p.id===id ? {...p,is_published:!p.is_published} : p));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) setForm(f => ({...f, tags: [...f.tags, t]}));
    setTagInput("");
  };
  const removeTag = t => setForm(f => ({...f, tags: f.tags.filter(x => x !== t)}));

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const isNew = form && !products.find(p => p.id === form.id);

  if (editProd && form) return (
    <div style={{paddingBottom:"3rem"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"2rem",flexWrap:"wrap"}}>
        <button className="btn btn-o btn-sm" onClick={() => {setEditProd(null);setForm(null);}}>← 戻る</button>
        <div className="adm-title" style={{margin:0,flex:1}}>{isNew ? "新規商品登録" : "商品を編集"}</div>
        {!isNew && (
          <button className="btn btn-sm" style={{background:"rgba(160,80,80,0.15)",color:"#c07a7a",border:"1px solid rgba(160,80,80,0.3)"}}
            onClick={() => setDeleteConfirm(form.id)}>削除</button>
        )}
      </div>

      {deleteConfirm && (
        <div style={{background:"rgba(160,80,80,0.1)",border:"1px solid rgba(160,80,80,0.3)",padding:"1rem 1.5rem",marginBottom:"1.5rem",display:"flex",alignItems:"center",gap:"1rem",flexWrap:"wrap"}}>
          <span style={{fontSize:".82rem",color:"#c07a7a",flex:1}}>この商品を削除しますか？この操作は元に戻せません。</span>
          <button className="btn btn-sm" style={{background:"#8B3A3A",color:"#f0ece5",border:"none"}} onClick={() => deleteProd(deleteConfirm)}>削除する</button>
          <button className="btn btn-o btn-sm" onClick={() => setDeleteConfirm(null)}>キャンセル</button>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:"1.5rem",alignItems:"start"}}>
        {/* Left column */}
        <div>
          {/* 基本情報 */}
          <div className="panel">
            <div className="panel-t">基本情報</div>
            <div className="fg3">
              <label className="fl">商品名 <span style={{color:"var(--accent)"}}>*</span></label>
              <input className="inp" value={form.name} onChange={e=>setField("name",e.target.value)} placeholder="例: Silk Soft Bra" />
              {errors.name && <div style={{color:"#c07a7a",fontSize:".7rem",marginTop:".3rem"}}>{errors.name}</div>}
            </div>
            <div className="fg3">
              <label className="fl">スラッグ</label>
              <input className="inp" value={form.slug} onChange={e=>setField("slug",e.target.value)} placeholder="自動生成されます" />
            </div>
            <div className="fg3">
              <label className="fl">商品説明</label>
              <textarea className="txta" rows={4} value={form.description} onChange={e=>setField("description",e.target.value)} placeholder="商品の詳細な説明を入力してください" />
            </div>
            <div className="fg3">
              <label className="fl">短い説明文（一覧表示用）</label>
              <input className="inp" value={form.short_description||""} onChange={e=>setField("short_description",e.target.value)} placeholder="例: 上質素材と繊細なデザイン" />
            </div>
          </div>

          {/* 価格・在庫 */}
          <div className="panel">
            <div className="panel-t">価格・在庫</div>
            <div className="fg2">
              <div className="fg3">
                <label className="fl">販売価格（税込）<span style={{color:"var(--accent)"}}>*</span></label>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:".9rem",top:"50%",transform:"translateY(-50%)",color:"var(--text3)",fontSize:".82rem"}}>¥</span>
                  <input className="inp" type="number" min="0" value={form.price||""} onChange={e=>setField("price",e.target.value)} style={{paddingLeft:"1.8rem"}} />
                </div>
                {errors.price && <div style={{color:"#c07a7a",fontSize:".7rem",marginTop:".3rem"}}>{errors.price}</div>}
              </div>
              <div className="fg3">
                <label className="fl">セール価格（空白でセールなし）</label>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:".9rem",top:"50%",transform:"translateY(-50%)",color:"var(--text3)",fontSize:".82rem"}}>¥</span>
                  <input className="inp" type="number" min="0" value={form.sale_price||""} onChange={e=>setField("sale_price",e.target.value||null)} style={{paddingLeft:"1.8rem"}} />
                </div>
              </div>
              <div className="fg3">
                <label className="fl">在庫数</label>
                <input className="inp" type="number" min="0" value={form.stock_quantity} onChange={e=>setField("stock_quantity",e.target.value)} />
              </div>
              <div className="fg3">
                <label className="fl">価格帯（自動）</label>
                <input className="inp" value={form.budget_range} readOnly style={{opacity:.5,cursor:"not-allowed"}} />
              </div>
            </div>
          </div>

          {/* 商品仕様 */}
          <div className="panel">
            <div className="panel-t">商品仕様</div>
            <div className="fg2">
              <div className="fg3">
                <label className="fl">素材</label>
                <select className="sel" value={form.material} onChange={e=>setField("material",e.target.value)}>
                  <option value="">選択してください</option>
                  {MATERIAL_OPTIONS.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="fg3">
                <label className="fl">サイズ</label>
                <select className="sel" value={form.size} onChange={e=>setField("size",e.target.value)}>
                  <option value="">選択してください</option>
                  {SIZE_OPTIONS.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="fg3">
                <label className="fl">カラー名</label>
                <select className="sel" value={form.color_name} onChange={e=>setField("color_name",e.target.value)}>
                  <option value="">選択してください</option>
                  {COLOR_OPTIONS.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="fg3">
              <label className="fl">プレビューカラー（画像プレースホルダー）</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:".5rem",marginTop:".3rem"}}>
                {COLOR_SWATCHES.map(sw => (
                  <div key={sw.hex}
                    onClick={() => setField("color", sw.hex)}
                    title={sw.label}
                    style={{
                      width:32,height:32,background:sw.hex,cursor:"pointer",
                      border: form.color===sw.hex ? "2px solid var(--accent)" : "2px solid transparent",
                      outline: form.color===sw.hex ? "1px solid var(--accent)" : "none",
                      transition:"border .15s",
                    }}
                  />
                ))}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:".8rem",marginTop:".6rem"}}>
                <div style={{width:40,height:40,background:form.color,border:"1px solid var(--border)"}} />
                <input type="color" value={form.color} onChange={e=>setField("color",e.target.value)}
                  style={{width:40,height:40,cursor:"pointer",border:"none",background:"none",padding:0}} />
                <span style={{fontSize:".68rem",color:"var(--text3)"}}>カスタムカラーを選択</span>
              </div>
            </div>
          </div>

          {/* タグ */}
          <div className="panel">
            <div className="panel-t">タグ</div>
            <div style={{display:"flex",gap:".5rem",flexWrap:"wrap",marginBottom:".8rem"}}>
              {(form.tags||[]).map(t => (
                <span key={t} style={{display:"inline-flex",alignItems:"center",gap:".4rem",padding:".2rem .7rem",border:"1px solid var(--border)",fontSize:".72rem",color:"var(--text2)"}}>
                  {t}
                  <span onClick={()=>removeTag(t)} style={{cursor:"pointer",color:"var(--text3)",fontSize:"1rem",lineHeight:1}}>×</span>
                </span>
              ))}
            </div>
            <div style={{display:"flex",gap:".5rem"}}>
              <input className="inp" value={tagInput} onChange={e=>setTagInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addTag();}}}
                placeholder="タグを入力してEnter" style={{flex:1}} />
              <button className="btn btn-o btn-sm" onClick={addTag}>追加</button>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* カテゴリ */}
          <div className="panel">
            <div className="panel-t">カテゴリ <span style={{color:"var(--accent)"}}>*</span></div>
            <div style={{display:"flex",flexDirection:"column",gap:".4rem"}}>
              {categories.map(cat => {
                const on = form.category_ids.includes(cat.id);
                return (
                  <div key={cat.id}
                    onClick={() => setField("category_ids", on ? form.category_ids.filter(id=>id!==cat.id) : [...form.category_ids,cat.id])}
                    style={{padding:".55rem .9rem",border:`1px solid ${on?"var(--accent)":"var(--border)"}`,background:on?"rgba(200,168,130,0.12)":"transparent",color:on?"var(--accent)":"var(--text2)",cursor:"pointer",fontSize:".78rem",transition:"all .15s",display:"flex",alignItems:"center",gap:".5rem"}}>
                    <span style={{width:12,height:12,border:`1px solid ${on?"var(--accent)":"var(--text3)"}`,background:on?"var(--accent)":"transparent",flexShrink:0,display:"inline-block"}} />
                    {cat.name}
                  </div>
                );
              })}
            </div>
            {errors.category_ids && <div style={{color:"#c07a7a",fontSize:".7rem",marginTop:".5rem"}}>{errors.category_ids}</div>}
          </div>

          {/* 表示設定 */}
          <div className="panel">
            <div className="panel-t">表示設定</div>
            {[["is_published","公開する","非公開にする"],["is_new","NEW バッジ",""],["is_best_seller","BEST バッジ",""],["is_featured","トップ特集",""]].map(([k,l,sub]) => (
              <div className="opt-row" key={k} style={{paddingBottom:".8rem",borderBottom:"1px solid var(--border)",marginBottom:".8rem"}}>
                <div>
                  <div style={{fontSize:".8rem",color:"var(--text)"}}>{l}</div>
                  {sub && <div style={{fontSize:".65rem",color:"var(--text3)"}}>{!form[k]?sub:""}</div>}
                </div>
                <label className="tgl">
                  <input type="checkbox" checked={!!form[k]} onChange={e=>setField(k,e.target.checked)} />
                  <span className="tgl-sl" />
                </label>
              </div>
            ))}
          </div>

          {/* プレビュー */}
          <div className="panel">
            <div className="panel-t">プレビュー</div>
            <div style={{aspectRatio:"3/4",background:form.color,marginBottom:".8rem",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(200,168,130,0.3)" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="1"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/>
              </svg>
            </div>
            <div style={{fontSize:".78rem",color:"var(--text2)",marginBottom:".2rem"}}>{form.name||"商品名"}</div>
            <div style={{fontSize:".75rem",color:"var(--text3)"}}>
              {form.sale_price
                ? <><span style={{textDecoration:"line-through",marginRight:".4rem"}}>¥{Number(form.price||0).toLocaleString()}</span><span style={{color:"var(--accent)"}}>¥{Number(form.sale_price).toLocaleString()}</span></>
                : `¥${Number(form.price||0).toLocaleString()}`}
            </div>
          </div>
        </div>
      </div>

      {/* Save bar */}
      <div style={{display:"flex",gap:"1rem",alignItems:"center",marginTop:"1.5rem",padding:"1.2rem 1.5rem",background:"var(--bg2)",border:"1px solid var(--border)",position:"sticky",bottom:0}}>
        <button className="btn btn-p" onClick={save}>{isNew?"登録する":"変更を保存する"}</button>
        <button className="btn btn-o" onClick={()=>{setEditProd(null);setForm(null);}}>キャンセル</button>
        {Object.keys(errors).length > 0 && (
          <span style={{fontSize:".75rem",color:"#c07a7a"}}>入力内容をご確認ください</span>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"1.5rem",flexWrap:"wrap",gap:"1rem"}}>
        <div><div className="adm-title">商品管理</div><div className="adm-sub">{products.length}件の商品</div></div>
        <button className="btn btn-p btn-sm" onClick={openNew}>+ 新規商品登録</button>
      </div>
      <div style={{marginBottom:"1rem"}}>
        <input type="text" className="inp" placeholder="商品名で検索..." value={search} onChange={e=>setSearch(e.target.value)} style={{maxWidth:"320px"}} />
      </div>
      <div style={{overflowX:"auto"}}>
        <table className="tbl">
          <thead><tr><th>商品名</th><th>価格</th><th>カテゴリ</th><th>在庫</th><th>状態</th><th>操作</th></tr></thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{textAlign:"center",padding:"2rem",color:"var(--text3)"}}>該当する商品がありません</td></tr>
            )}
            {filtered.map(p => {
              const cat = categories.find(c=>p.category_ids.includes(c.id));
              return (
                <tr key={p.id}>
                  <td>
                    <div style={{display:"flex",gap:".6rem",alignItems:"center"}}>
                      <div style={{width:26,height:34,background:p.color,flexShrink:0,border:"1px solid var(--border)"}} />
                      <div>
                        <div style={{fontWeight:500,color:"var(--text)",fontSize:".8rem"}}>{p.name}</div>
                        <div style={{display:"flex",gap:".25rem",marginTop:".2rem"}}>
                          {p.is_new && <span className="sb sb-new">NEW</span>}
                          {p.is_best_seller && <span className="sb sb-on">BEST</span>}
                          {p.is_featured && <span className="sb sb-new">FEATURED</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    ¥{p.price.toLocaleString()}
                    {p.sale_price && <span style={{color:"var(--accent)",marginLeft:".4rem",fontSize:".72rem"}}>→¥{p.sale_price.toLocaleString()}</span>}
                  </td>
                  <td style={{fontSize:".76rem"}}>{cat?.name||"—"}</td>
                  <td style={{color:p.stock_quantity===0?"#c07a7a":"inherit"}}>{p.stock_quantity===0?"SOLD OUT":`${p.stock_quantity}点`}</td>
                  <td>
                    <button className={`sb ${p.is_published?"sb-on":"sb-off"}`}
                      style={{cursor:"pointer",background:"inherit",padding:".22rem .7rem"}}
                      onClick={() => togglePub(p.id)}>
                      {p.is_published?"公開中":"非公開"}
                    </button>
                  </td>
                  <td style={{display:"flex",gap:".4rem"}}>
                    <button className="btn btn-o btn-sm" onClick={() => openEdit(p)}>編集</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminCats({ categories, setCategories, editCat, setEditCat }) {
  const [form, setForm] = useState(null);
  const openEdit = cat => { setEditCat(cat); setForm({...cat}); };
  const save = () => {
    if (!form.name) return;
    setCategories(prev => prev.map(c=>c.id===form.id?{...form}:c));
    setEditCat(null); setForm(null);
  };
  const toggleActive = id => setCategories(prev => prev.map(c=>c.id===id?{...c,is_active:!c.is_active}:c));

  if (editCat && form) return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"2rem"}}>
        <button className="btn btn-o btn-sm" onClick={() => {setEditCat(null);setForm(null);}}>← 戻る</button>
        <div className="adm-title" style={{margin:0}}>カテゴリを編集</div>
      </div>
      <div className="panel" style={{maxWidth:"560px"}}>
        <div className="panel-t">カテゴリ情報</div>
        {[["カテゴリ名 *","name"],["スラッグ","slug"],["説明文","description"]].map(([l,k]) => (
          <div className="fg3" key={k}>
            <label className="fl">{l}</label>
            {k==="description"
              ? <textarea className="txta" value={form[k]||""} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} />
              : <input type="text" className="inp" value={form[k]||""} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} />}
          </div>
        ))}
        <div className="opt-row">
          <span style={{fontSize:".8rem",color:"var(--text2)"}}>公開状態</span>
          <label className="tgl"><input type="checkbox" checked={!!form.is_active} onChange={e=>setForm(f=>({...f,is_active:e.target.checked}))} /><span className="tgl-sl" /></label>
        </div>
      </div>
      <div style={{display:"flex",gap:"1rem",marginTop:"1rem"}}>
        <button className="btn btn-p" onClick={save}>保存する</button>
        <button className="btn btn-o" onClick={() => {setEditCat(null);setForm(null);}}>キャンセル</button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="adm-title">カテゴリ管理</div>
      <div className="adm-sub">名前を変更すると、フロントの表示に即座に反映されます</div>
      <div style={{display:"flex",flexDirection:"column",gap:".75rem",maxWidth:"720px"}}>
        {[...categories].sort((a,b)=>a.display_order-b.display_order).map(cat => (
          <div key={cat.id} className="panel" style={{padding:"1.2rem 1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:0}}>
            <div style={{display:"flex",alignItems:"center",gap:"1.5rem",flex:1}}>
              <div style={{fontSize:".65rem",color:"var(--text3)",minWidth:"1.8rem"}}>{cat.display_order}</div>
              <div>
                <div style={{fontWeight:500,fontSize:".86rem",color:"var(--text)"}}>{cat.name}</div>
                <div style={{fontSize:".68rem",color:"var(--text3)"}}>/{cat.slug}</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
              <button className={`sb ${cat.is_active?"sb-on":"sb-off"}`}
                style={{cursor:"pointer",background:"inherit",padding:".22rem .7rem"}}
                onClick={() => toggleActive(cat.id)}>
                {cat.is_active?"公開中":"非公開"}
              </button>
              <button className="btn btn-o btn-sm" onClick={() => openEdit(cat)}>編集</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminOrders() {
  const orders = [
    {id:"ORD-001",date:"2025-06-01 14:32",customer:"田中 様",total:14800,status:"発送済み"},
    {id:"ORD-002",date:"2025-06-01 11:15",customer:"鈴木 様",total:8800,status:"準備中"},
    {id:"ORD-003",date:"2025-05-31 18:44",customer:"山田 様",total:22000,status:"発送済み"},
    {id:"ORD-004",date:"2025-05-31 09:20",customer:"佐藤 様",total:6800,status:"完了"},
  ];
  return (
    <div>
      <div className="adm-title">注文管理</div>
      <div className="adm-sub">受注データ（デモ表示）</div>
      <div style={{overflowX:"auto"}}>
        <table className="tbl">
          <thead><tr><th>注文番号</th><th>日時</th><th>購入者</th><th>金額</th><th>ステータス</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td style={{fontFamily:"monospace",fontSize:".78rem"}}>{o.id}</td>
                <td>{o.date}</td>
                <td>{o.customer}</td>
                <td>¥{o.total.toLocaleString()}</td>
                <td><span className={`sb ${o.status==="完了"?"sb-on":o.status==="発送済み"?"sb-new":""}`}>{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminSettings({ settings, setSettings }) {
  const [form, setForm] = useState({...settings});
  const [saved, setSaved] = useState(false);
  const save = () => { setSettings(form); setSaved(true); setTimeout(()=>setSaved(false),2000); };

  return (
    <div>
      <div className="adm-title">サイト設定</div>
      <div className="adm-sub">変更はフロントの表示にも反映されます</div>
      <div className="panel" style={{maxWidth:"640px"}}>
        <div className="panel-t">基本情報</div>
        {[["ショップ名","shopName"],["メインコピー","mainCopy"],["サブコピー","subCopy"],["お問い合わせメール","contactEmail"]].map(([l,k]) => (
          <div className="fg3" key={k}>
            <label className="fl">{l}</label>
            <input type="text" className="inp" value={form[k]||""} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} />
          </div>
        ))}
      </div>
      <div className="panel" style={{maxWidth:"640px"}}>
        <div className="panel-t">配送設定</div>
        <div className="fg2">
          {[["送料（円）","shippingFee"],["送料無料ライン（円）","freeShippingLine"]].map(([l,k]) => (
            <div className="fg3" key={k}>
              <label className="fl">{l}</label>
              <input type="number" className="inp" value={form[k]||0} onChange={e=>setForm(f=>({...f,[k]:Number(e.target.value)}))} />
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"flex",gap:"1rem",alignItems:"center"}}>
        <button className="btn btn-p" onClick={save}>設定を保存する</button>
        {saved && <span style={{fontSize:".75rem",color:"var(--accent)"}}>✓ 保存しました</span>}
      </div>
    </div>
  );
}

// ── STAFF STORY PAGE ──
function StaffStoryPage({ nav, products }) {
  const [tab, setTab] = useState("articles");

  return (
    <div className="pe">
      <div className="page-hdr">
        <div className="page-hdr-in">
          <div className="sl">STAFF REVIEW</div>
          <h1 className="fd" style={{fontSize:"2.5rem",fontWeight:300}}>スタッフが語る、選ばれた理由</h1>
          <p style={{fontSize:".78rem",color:"var(--text3)",marginTop:".6rem",maxWidth:"50ch"}}>
            CKD SHOPのバイヤー・スタイリスト・クリエイティブチームが、商品との出会いと使い心地を正直に綴ります。
          </p>
        </div>
      </div>

      <div className="sec" style={{paddingTop:"2.5rem"}}>
        {/* Tabs */}
        <div className="story-tabs">
          <button className={`story-tab ${tab==="articles"?"on":""}`} onClick={()=>setTab("articles")}>
            記事レビュー（{STAFF_ARTICLES.length}件）
          </button>
          <button className={`story-tab ${tab==="videos"?"on":""}`} onClick={()=>setTab("videos")}>
            動画レビュー（{VIDEO_REVIEWS.length}件）
          </button>
        </div>

        {tab === "articles" && (
          <div className="art-grid">
            {STAFF_ARTICLES.map(article => {
              const staff = STAFF_MEMBERS.find(s=>s.id===article.staff_id);
              return (
                <div className="art-card" key={article.id} onClick={()=>nav("article-detail",{article})}>
                  <div className="art-card-img">
                    <img src={article.image} alt={article.title} loading="lazy" />
                  </div>
                  <div className="art-card-body">
                    <div className="art-tag">STAFF REVIEW · {article.read_time} min read</div>
                    <div className="art-title fd">{article.title}</div>
                    <div className="art-lead">{article.lead}</div>
                    <div className="art-meta">
                      {staff && (
                        <>
                          <div className="art-avatar">
                            <img src={staff.image} alt={staff.name_jp} onError={e=>{e.currentTarget.style.display="none";}} />
                          </div>
                          <div>
                            <div className="art-staff-name">{staff.name_jp}</div>
                            <div className="art-read">{staff.role}</div>
                          </div>
                        </>
                      )}
                      <div className="art-date">{article.date}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "videos" && <VideoGrid nav={nav} products={products} />}
      </div>
    </div>
  );
}

// ── ARTICLE DETAIL PAGE ──
function ArticleDetailPage({ article, nav, products, addToCart }) {
  if (!article) return <div className="empty"><div className="empty-t">記事が見つかりません</div></div>;
  const staff = STAFF_MEMBERS.find(s=>s.id===article.staff_id);
  const product = products.find(p=>p.id===article.product_id);

  return (
    <div className="pe">
      {/* Hero */}
      <div style={{paddingTop:"60px"}}>
        <div className="art-detail-hero">
          <img src={article.image} alt={article.title} />
        </div>
      </div>

      <div className="art-detail-body">
        {/* Breadcrumb */}
        <div className="bc" style={{marginBottom:"1.5rem"}}>
          <span onClick={()=>nav("home")}>Home</span> ›
          <span onClick={()=>nav("story")}>Staff Review</span> ›
          <span>{article.title}</span>
        </div>

        {/* Category */}
        <div className="art-tag" style={{marginBottom:"1rem"}}>STAFF REVIEW · {article.read_time} min read</div>

        {/* Title */}
        <h1 className="art-detail-title">{article.title}</h1>

        {/* Staff bar */}
        {staff && (
          <div className="art-staff-bar">
            <div className="art-staff-bar-avatar">
              <img src={staff.image} alt={staff.name_jp} onError={e=>{e.currentTarget.style.background="#2a1f1a";e.currentTarget.style.display="none";}} />
            </div>
            <div>
              <div className="art-staff-bar-role">{staff.role}</div>
              <div className="art-staff-bar-name">{staff.name_jp}</div>
            </div>
            <div style={{marginLeft:"auto",fontSize:".65rem",color:"var(--text3)"}}>{article.date}</div>
          </div>
        )}

        {/* Lead */}
        <p className="art-detail-lead">{article.lead}</p>

        {/* Body */}
        <div className="art-detail-text">{article.body}</div>

        {/* Tags */}
        <div className="art-tags">
          {article.tags.map(t=><span className="art-tag-pill" key={t}>{t}</span>)}
        </div>

        {/* Related product */}
        {product && (
          <div style={{marginTop:"3rem",padding:"1.5rem",background:"var(--bg2)",border:"1px solid var(--border)"}}>
            <div className="sl" style={{marginBottom:"1rem"}}>この記事で紹介した商品</div>
            <div style={{display:"flex",gap:"1.2rem",alignItems:"center",cursor:"pointer"}}
              onClick={()=>nav("product-detail",{product})}>
              <div style={{width:72,height:96,overflow:"hidden",flexShrink:0}}>
                <img src={product.image} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover"}} loading="lazy" />
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:".72rem",color:"var(--text3)",marginBottom:".3rem"}}>{product.material}</div>
                <div style={{fontSize:".9rem",marginBottom:".4rem"}}>{product.name}</div>
                <div style={{fontSize:".82rem",color:"var(--accent)"}}>¥{product.price.toLocaleString()}</div>
              </div>
              <button className="btn btn-a btn-sm" onClick={e=>{e.stopPropagation();addToCart(product,1);}}>
                カートに入れる
              </button>
            </div>
          </div>
        )}
      </div>

      {/* More articles */}
      <div className="sec" style={{paddingTop:0}}>
        <hr className="divider" />
        <div className="sl">OTHER REVIEWS</div>
        <h2 className="fd" style={{fontSize:"1.6rem",fontWeight:300,marginBottom:"2rem"}}>他のスタッフレビュー</h2>
        <div className="art-grid">
          {STAFF_ARTICLES.filter(a=>a.id!==article.id).slice(0,3).map(a=>{
            const s = STAFF_MEMBERS.find(x=>x.id===a.staff_id);
            return (
              <div className="art-card" key={a.id} onClick={()=>nav("article-detail",{article:a})}>
                <div className="art-card-img"><img src={a.image} alt={a.title} loading="lazy" /></div>
                <div className="art-card-body">
                  <div className="art-tag">STAFF REVIEW</div>
                  <div className="art-title fd">{a.title}</div>
                  <div className="art-meta">
                    {s && <><div className="art-avatar"><img src={s.image} alt={s.name_jp} /></div><div className="art-staff-name">{s.name_jp}</div></>}
                    <div className="art-date">{a.date}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── VIDEO GRID (shared component) ──
function VideoGrid({ nav, products }) {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <>
      <div className="vid-grid">
        {VIDEO_REVIEWS.map(video => {
          const staff = STAFF_MEMBERS.find(s=>s.id===video.staff_id);
          return (
            <div className="vid-card" key={video.id} onClick={()=>setActiveVideo(video)}>
              <div className="vid-thumb">
                <img src={video.thumbnail} alt={video.title} loading="lazy" />
                <div className="vid-play">
                  <div className="vid-play-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#0f0d0b">
                      <polygon points="5,3 19,12 5,21"/>
                    </svg>
                  </div>
                </div>
                <div className="vid-duration">{video.duration}</div>
              </div>
              <div className="vid-info">
                <div className="vid-title">{video.title}</div>
                <div className="vid-meta">
                  {staff && (
                    <>
                      <div className="vid-avatar"><img src={staff.image} alt={staff.name_jp} /></div>
                      <div className="vid-staff">{staff.name_jp} · {staff.role}</div>
                    </>
                  )}
                  <div className="vid-date">{video.date}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="vid-modal-bg" onClick={()=>setActiveVideo(null)}>
          <div className="vid-modal" onClick={e=>e.stopPropagation()} style={{position:"relative"}}>
            <button className="vid-modal-close" onClick={()=>setActiveVideo(null)}>✕</button>
            <div className="vid-modal-player">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtube_id}?autoplay=1&rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={activeVideo.title}
              />
            </div>
            <div className="vid-modal-info">
              <div className="vid-modal-title fd">{activeVideo.title}</div>
              <div className="vid-modal-desc">{activeVideo.description}</div>
              {(() => {
                const staff = STAFF_MEMBERS.find(s=>s.id===activeVideo.staff_id);
                const product = products?.find(p=>p.id===activeVideo.product_id);
                return (
                  <div style={{display:"flex",alignItems:"center",gap:".8rem",flexWrap:"wrap"}}>
                    {staff && (
                      <div style={{display:"flex",alignItems:"center",gap:".5rem"}}>
                        <div className="vid-avatar" style={{width:28,height:28}}><img src={staff.image} alt={staff.name_jp} /></div>
                        <span style={{fontSize:".7rem",color:"var(--text3)"}}>{staff.name_jp} · {staff.role}</span>
                      </div>
                    )}
                    {product && (
                      <span style={{fontSize:".7rem",color:"var(--accent)",marginLeft:"auto",cursor:"pointer"}}
                        onClick={()=>{setActiveVideo(null);nav("product-detail",{product});}}>
                        商品を見る →
                      </span>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── LIVE CONSULT PAGE ──
function LiveConsultPage({ nav, products, addToCart }) {
  const [showForm, setShowForm] = React.useState(false);
  const [roomId, setRoomId] = React.useState(null);
  const [form, setForm] = React.useState({ name:"", email:"", staff_id:"", note:"" });
  const [booked, setBooked] = React.useState(false);
  const featuredProducts = products ? products.filter(p => p.is_featured || p.is_best_seller).slice(0, 4) : [];

  function startNow() {
    const id = "ckd-" + Math.random().toString(36).slice(2,10);
    setRoomId(id);
  }

  function endSession() {
    setRoomId(null);
  }

  function submitForm(e) {
    e.preventDefault();
    setBooked(true);
    setTimeout(() => { setShowForm(false); setBooked(false); setForm({ name:"", email:"", staff_id:"", note:"" }); }, 2500);
  }

  if (roomId) {
    return (
      <div className="lc-room">
        <iframe
          className="lc-room-iframe"
          src={`https://meet.jit.si/${roomId}#config.prejoinPageEnabled=false`}
          allow="camera; microphone; fullscreen; display-capture"
          title="Live Consultation"
        />
        <div style={{position:"absolute",top:0,right:0,width:280,height:"100%",background:"rgba(15,13,11,.92)",borderLeft:"1px solid rgba(200,168,130,.12)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"1.2rem 1rem .8rem",borderBottom:"1px solid rgba(200,168,130,.1)"}}>
            <div className="lc-badge" style={{marginBottom:".6rem"}}>
              <span className="lc-badge-dot" />
              <span style={{fontSize:".6rem",letterSpacing:".15em"}}>LIVE 接客中</span>
            </div>
            <div style={{fontSize:".7rem",color:"var(--text3)"}}>スタッフが厳選した商品をご紹介しています</div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"1rem"}}>
            {featuredProducts.map(p => (
              <div key={p.id} style={{marginBottom:"1rem",cursor:"pointer"}} onClick={() => { endSession(); nav("product-detail", { product: p }); }}>
                <div style={{width:"100%",aspectRatio:"4/3",borderRadius:4,overflow:"hidden",marginBottom:".4rem"}}>
                  <Placeholder image={p.images?.[0]} color={p.color||"#2a1f1a"} alt={p.name} style={{}} />
                </div>
                <div style={{fontSize:".72rem",color:"var(--text2)",lineHeight:1.3}}>{p.name}</div>
                <div style={{fontSize:".7rem",color:"var(--accent)",marginTop:".2rem"}}>
                  ¥{(p.sale_price||p.price).toLocaleString()}
                </div>
                <button onClick={e=>{e.stopPropagation();addToCart(p);}} style={{marginTop:".4rem",width:"100%",padding:".35rem",background:"rgba(200,168,130,.1)",border:"1px solid rgba(200,168,130,.25)",color:"var(--accent)",fontSize:".65rem",borderRadius:3,cursor:"pointer",letterSpacing:".08em"}}>
                  カートに追加
                </button>
              </div>
            ))}
          </div>
          <div style={{padding:"1rem",borderTop:"1px solid rgba(200,168,130,.1)"}}>
            <button className="lc-end-btn" onClick={endSession} style={{width:"100%",padding:".7rem",borderRadius:4,border:"1px solid rgba(160,80,80,.3)",background:"rgba(160,80,80,.1)",color:"#c07a7a",fontSize:".72rem",letterSpacing:".1em",cursor:"pointer"}}>
              通話を終了する
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pe">
      {/* Hero */}
      <div className="lc-hero">
        <div style={{maxWidth:640}}>
          <div className="lc-badge" style={{marginBottom:"1.5rem"}}>
            <span className="lc-badge-dot" />
            <span style={{fontSize:".65rem",letterSpacing:".2em"}}>LIVE 接客</span>
          </div>
          <h1 className="fd" style={{fontSize:"clamp(2rem,5vw,3.5rem)",fontWeight:300,lineHeight:1.2,marginBottom:"1.2rem"}}>
            スタッフと話しながら、<br />理想の一品を見つける。
          </h1>
          <p style={{fontSize:".85rem",color:"var(--text3)",lineHeight:1.9,maxWidth:"42ch",marginBottom:"2.5rem"}}>
            ビデオ通話でスタッフが直接ご案内。テキストでは伝わらない素材感や使い心地を、リアルタイムでご紹介します。
          </p>
          <div style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
            <button onClick={startNow} style={{padding:".9rem 2.5rem",background:"var(--accent)",color:"#0f0d0b",fontSize:".8rem",letterSpacing:".15em",border:"none",borderRadius:2,cursor:"pointer",fontWeight:600}}>
              今すぐ接客を開始する
            </button>
            <button onClick={() => setShowForm(true)} style={{padding:".9rem 2.5rem",background:"transparent",color:"var(--accent)",fontSize:".8rem",letterSpacing:".15em",border:"1px solid rgba(200,168,130,.4)",borderRadius:2,cursor:"pointer"}}>
              予約する
            </button>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="sec">
        <div className="sec-hdr"><div className="sl">HOW IT WORKS</div><h2 className="fd" style={{fontSize:"1.6rem",fontWeight:300}}>ご利用の流れ</h2></div>
        <div className="lc-steps">
          {[
            { num:"01", title:"スタッフを選ぶ", desc:"担当スタッフのプロフィールを確認し、お好みのスタッフをお選びください。" },
            { num:"02", title:"接続する", desc:"「今すぐ開始」ボタンを押すだけで、すぐにビデオ通話が始まります。" },
            { num:"03", title:"商品を選ぶ", desc:"スタッフが商品をご紹介。気に入ったらそのままカートに追加できます。" },
          ].map(s => (
            <div key={s.num} style={{padding:"2rem",background:"var(--srf)",border:"1px solid var(--bdr)",borderRadius:4}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2.5rem",color:"var(--accent)",opacity:.4,marginBottom:".8rem"}}>{s.num}</div>
              <div className="fd" style={{fontSize:"1.05rem",fontWeight:400,marginBottom:".6rem"}}>{s.title}</div>
              <div style={{fontSize:".78rem",color:"var(--text3)",lineHeight:1.8}}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff */}
      <div className="sec">
        <div className="sec-hdr"><div className="sl">OUR STAFF</div><h2 className="fd" style={{fontSize:"1.6rem",fontWeight:300}}>担当スタッフ</h2></div>
        <div className="lc-staff-grid">
          {STAFF_MEMBERS.map(s => (
            <div key={s.id} style={{background:"var(--srf)",border:"1px solid var(--bdr)",borderRadius:4,overflow:"hidden"}}>
              <div style={{aspectRatio:"3/2",overflow:"hidden"}}>
                <img src={s.image} alt={s.name_jp} style={{width:"100%",height:"100%",objectFit:"cover"}} />
              </div>
              <div style={{padding:"1.2rem"}}>
                <div style={{display:"flex",alignItems:"center",gap:".5rem",marginBottom:".4rem"}}>
                  <span style={{width:7,height:7,borderRadius:"50%",background:"#6abf69",display:"inline-block"}} />
                  <span style={{fontSize:".6rem",color:"#6abf69",letterSpacing:".1em"}}>ONLINE</span>
                </div>
                <div className="fd" style={{fontSize:"1.1rem",fontWeight:400}}>{s.name_jp}</div>
                <div style={{fontSize:".7rem",color:"var(--accent)",letterSpacing:".1em",margin:".2rem 0 .6rem"}}>{s.role}</div>
                <button onClick={startNow} style={{width:"100%",padding:".55rem",background:"transparent",border:"1px solid rgba(200,168,130,.35)",color:"var(--accent)",fontSize:".7rem",letterSpacing:".1em",borderRadius:2,cursor:"pointer"}}>
                  このスタッフと話す
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking form overlay */}
      {showForm && (
        <div className="lc-form-overlay" onClick={e => { if(e.target===e.currentTarget) setShowForm(false); }}>
          <div style={{background:"var(--srf)",border:"1px solid var(--bdr)",borderRadius:4,padding:"2.5rem",width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto"}}>
            {booked ? (
              <div style={{textAlign:"center",padding:"2rem 0"}}>
                <div style={{fontSize:"2rem",marginBottom:"1rem"}}>✓</div>
                <div className="fd" style={{fontSize:"1.3rem",marginBottom:".6rem"}}>ご予約を受け付けました</div>
                <div style={{fontSize:".78rem",color:"var(--text3)"}}>ご登録のメールアドレスに確認メールをお送りします。</div>
              </div>
            ) : (
              <>
                <div className="fd" style={{fontSize:"1.4rem",fontWeight:300,marginBottom:"1.5rem"}}>接客のご予約</div>
                <form onSubmit={submitForm} style={{display:"flex",flexDirection:"column",gap:"1.1rem"}}>
                  <div>
                    <label style={{fontSize:".7rem",color:"var(--text3)",letterSpacing:".1em",display:"block",marginBottom:".4rem"}}>お名前 *</label>
                    <input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                      style={{width:"100%",padding:".7rem .8rem",background:"var(--bg)",border:"1px solid var(--bdr)",color:"var(--text1)",fontSize:".82rem",borderRadius:2,boxSizing:"border-box"}} />
                  </div>
                  <div>
                    <label style={{fontSize:".7rem",color:"var(--text3)",letterSpacing:".1em",display:"block",marginBottom:".4rem"}}>メールアドレス *</label>
                    <input required type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                      style={{width:"100%",padding:".7rem .8rem",background:"var(--bg)",border:"1px solid var(--bdr)",color:"var(--text1)",fontSize:".82rem",borderRadius:2,boxSizing:"border-box"}} />
                  </div>
                  <div>
                    <label style={{fontSize:".7rem",color:"var(--text3)",letterSpacing:".1em",display:"block",marginBottom:".4rem"}}>ご希望のスタッフ</label>
                    <select value={form.staff_id} onChange={e=>setForm(f=>({...f,staff_id:e.target.value}))}
                      style={{width:"100%",padding:".7rem .8rem",background:"var(--bg)",border:"1px solid var(--bdr)",color:"var(--text1)",fontSize:".82rem",borderRadius:2,boxSizing:"border-box"}}>
                      <option value="">指定なし</option>
                      {STAFF_MEMBERS.map(s => <option key={s.id} value={s.id}>{s.name_jp} ({s.role})</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{fontSize:".7rem",color:"var(--text3)",letterSpacing:".1em",display:"block",marginBottom:".4rem"}}>ご要望・備考</label>
                    <textarea value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} rows={3}
                      style={{width:"100%",padding:".7rem .8rem",background:"var(--bg)",border:"1px solid var(--bdr)",color:"var(--text1)",fontSize:".82rem",borderRadius:2,resize:"vertical",boxSizing:"border-box"}} />
                  </div>
                  <div style={{display:"flex",gap:".8rem",marginTop:".5rem"}}>
                    <button type="button" onClick={() => setShowForm(false)} style={{flex:1,padding:".75rem",background:"transparent",border:"1px solid var(--bdr)",color:"var(--text3)",fontSize:".78rem",borderRadius:2,cursor:"pointer"}}>
                      キャンセル
                    </button>
                    <button type="submit" style={{flex:2,padding:".75rem",background:"var(--accent)",color:"#0f0d0b",fontSize:".78rem",letterSpacing:".1em",border:"none",borderRadius:2,cursor:"pointer",fontWeight:600}}>
                      予約を確定する
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── VIDEO PAGE ──
function VideoPage({ nav, products }) {
  return (
    <div className="pe">
      <div className="page-hdr">
        <div className="page-hdr-in">
          <div className="sl">VIDEO REVIEW</div>
          <h1 className="fd" style={{fontSize:"2.5rem",fontWeight:300}}>動画でわかる、商品の魅力</h1>
          <p style={{fontSize:".78rem",color:"var(--text3)",marginTop:".6rem",maxWidth:"50ch"}}>
            スタッフが実際に使い、撮影した動画レビュー。テキストでは伝えきれない素材感や使い心地をお届けします。
          </p>
        </div>
      </div>
      <div className="sec">
        <VideoGrid nav={nav} products={products} />
      </div>
    </div>
  );
}
