import { useState, useEffect, useRef } from "react";

// ===== DATA =====
const MOOD_CATEGORIES = [
  { id: "relax",      label: "RELAX",      jp: "リラックス",  color: "#2a1f1a" },
  { id: "confidence", label: "CONFIDENCE", jp: "コンフィデンス", color: "#1a1f2a" },
  { id: "sexy",       label: "SEXY",       jp: "セクシー",   color: "#2a1a1f" },
  { id: "minimal",    label: "MINIMAL",    jp: "ミニマル",   color: "#1f1f1f" },
  { id: "romantic",   label: "ROMANTIC",   jp: "ロマンティック", color: "#2a1a22" },
  { id: "private",    label: "PRIVATE",    jp: "プライベート", color: "#1a2020" },
];

const INITIAL_CATEGORIES = [
  { id: "bra",       name: "ブラジャー",     slug: "bra",       description: "上質なブラジャーコレクション", display_order: 1, is_active: true },
  { id: "shorts",    name: "ショーツ",       slug: "shorts",    description: "洗練されたショーツ",           display_order: 2, is_active: true },
  { id: "set",       name: "セットアップ",   slug: "set",       description: "ブラ＆ショーツセット",         display_order: 3, is_active: true },
  { id: "nightwear", name: "ナイトウェア",   slug: "nightwear", description: "上品なナイトウェア",           display_order: 4, is_active: true },
  { id: "bridal",    name: "ブライダル",     slug: "bridal",    description: "特別な日のランジェリー",       display_order: 5, is_active: true },
  { id: "loungewear",name: "ラウンジウェア", slug: "loungewear",description: "日常に馴染む上質な部屋着",     display_order: 6, is_active: true },
];

const BUDGET_RANGES = ["〜5,000円", "5,000円〜10,000円", "10,000円〜20,000円", "20,000円〜"];

function getBudgetRange(price) {
  if (price < 5000) return "〜5,000円";
  if (price < 10000) return "5,000円〜10,000円";
  if (price < 20000) return "10,000円〜20,000円";
  return "20,000円〜";
}

const PRODUCT_NAMES = [
  "Silk Soft Bra", "Lace Dress", "Sheer Cami", "Bell Strap Bodysuit",
  "Silk Robe", "Lace Thong", "Velvet Set", "Mesh Bodysuit",
  "Satin Slip", "Bridal Set", "Cotton Brief",
];
const PRODUCT_COLORS = [
  "#2a1f1a","#1f1a26","#261a1f","#1a2222","#221f1a","#1a1f26",
  "#261a26","#1f2618","#261a1a","#1a1f1f","#2a2218",
];

function generateProducts() {
  const products = [];
  for (let i = 0; i < 44; i++) {
    const nameBase = PRODUCT_NAMES[i % PRODUCT_NAMES.length];
    const num = String(Math.floor(i / PRODUCT_NAMES.length) + 1).padStart(2, "0");
    const price = [4800,6800,5500,12000,9800,3800,15000,8800,7200,22000,4200,11000,6500,18000,9200][i % 15];
    const catId = INITIAL_CATEGORIES[i % 6].id;
    products.push({
      id: `prod-${i + 1}`,
      name: `${nameBase} ${num}`,
      slug: `${nameBase.toLowerCase().replace(/ /g, "-")}-${num}`,
      price,
      sale_price: i % 8 === 0 ? Math.floor(price * 0.8) : null,
      description: `上質なシルクとレースを使用した、肌に馴染むランジェリー。細部まで丁寧に仕上げた、毎日身につけたくなる一着です。`,
      short_description: `上質素材と繊細なデザイン。肌に寄り添うフィット感。`,
      category_ids: [catId],
      tags: ["Lingerie", "Luxury", "Japan"],
      stock_quantity: i % 11 === 0 ? 0 : Math.floor(Math.random() * 15) + 1,
      is_published: true,
      is_new: i < 8,
      is_best_seller: i >= 8 && i < 16,
      is_featured: i < 4,
      budget_range: getBudgetRange(price),
      material: ["シルク100%", "レース", "コットン", "サテン", "ベルベット", "メッシュ"][i % 6],
      size: ["XS/S", "S/M", "M/L", "L/XL", "フリーサイズ"][i % 5],
      color_name: ["ブラック", "ネイビー", "バーガンディ", "アイボリー", "モカ"][i % 5],
      color: PRODUCT_COLORS[i % PRODUCT_COLORS.length],
    });
  }
  return products;
}

const INITIAL_PRODUCTS = generateProducts();

const INITIAL_SETTINGS = {
  shopName: "CKD SHOP",
  mainCopy: "LESS IS MORE,\nBUT BETTER.",
  subCopy: "本質的な美しさと、肌に馴染む上質さ。\nいちばん近くにある、いちばん大切なもの。",
  shippingFee: 660,
  freeShippingLine: 15000,
  contactEmail: "hello@ckdshop.jp",
};

const JOURNAL_POSTS = [
  { id: 1, category: "STYLE GUIDE", title: "ランジェリーの選び方", date: "2025.05.20", color: "#2a1f1a" },
  { id: 2, category: "JOURNAL",     title: "上質な素材について",   date: "2025.05.12", color: "#1a1f2a" },
  { id: 3, category: "STORY",       title: "CKDが考えるインナー美", date: "2025.04.28", color: "#261a1f" },
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
function Placeholder({ color = "#2a1f1a", style = {}, className = "" }) {
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
          <Placeholder color={product.color} style={{width:"100%",height:"100%"}} />
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
  const [adminPage, setAdminPage] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const nav = (p, extra = {}) => {
    setPage(p);
    if (extra.product) setSelectedProduct(extra.product);
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
    { label: "COLLECTION", page: "products" },
    { label: "BRIDE",      page: "products" },
    { label: "NEW",        page: "new" },
    { label: "GIFT",       page: "best" },
    { label: "ABOUT",      page: "about" },
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
              {[["products","COLLECTION"],["products","BRIDE"],["new","NEW"],["best","GIFT"]].map(([p,l]) => (
                <button key={l} className={`nl ${(page===p&&l!=="BRIDE"&&l!=="GIFT")?"on":""}`} onClick={() => nav(p)}>{l}</button>
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

      {page === "home"           && <HomePage    products={products} categories={categories} settings={settings} nav={nav} addToCart={addToCart} />}
      {page === "products"       && <ProductsPage products={products} categories={categories} nav={nav} />}
      {page === "new"            && <FilteredPage products={products.filter(p=>p.is_new)} categories={categories} nav={nav} title="New Arrivals" label="New" />}
      {page === "best"           && <FilteredPage products={products.filter(p=>p.is_best_seller)} categories={categories} nav={nav} title="Best Sellers" label="Gift" />}
      {page === "product-detail" && <DetailPage  product={selectedProduct} products={products} categories={categories} nav={nav} addToCart={addToCart} />}
      {page === "cart"           && <CartPage    cart={cart} setCart={setCart} nav={nav} settings={settings} />}
      {page === "about"          && <AboutPage   settings={settings} />}
      {page === "admin"          && <AdminPage   categories={categories} setCategories={setCategories} products={products} setProducts={setProducts} settings={settings} setSettings={setSettings} nav={nav} adminPage={adminPage} setAdminPage={setAdminPage} />}
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
          {MOOD_CATEGORIES.map(mood => (
            <div className="mood-card" key={mood.id} onClick={() => nav("products")}>
              <div className="mood-img">
                <div className="mood-img-inner" style={{background:mood.color}}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" opacity="0.3">
                    <circle cx="16" cy="16" r="12" stroke="#c8a882" strokeWidth="0.8"/>
                    <path d="M10 16 Q16 10 22 16 Q16 22 10 16Z" stroke="#c8a882" strokeWidth="0.8" fill="none"/>
                  </svg>
                </div>
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
                    <Placeholder color={collItems[0]?.color} style={{width:"100%",height:"100%"}} />
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
                    <Placeholder color={p.color} style={{width:"100%",height:"100%"}} />
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
            スタイル診断
          </h2>
          <p style={{fontSize:".8rem",lineHeight:2,color:"var(--text2)",marginBottom:"2.5rem"}}>
            あなたにぴったりのランジェリーをご提案します。<br/>
            いくつかの質問に答えるだけで、あなただけのスタイルが見つかります。
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
                    <Placeholder color={post.color} style={{width:"100%",height:"100%"}} />
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
              <Placeholder color={product.color} style={{width:"100%",height:"100%"}} />
            </div>
            <div className="gthumb">
              {[...Array(4)].map((_,i) => (
                <div className={`gth ${i===0?"on":""}`} key={i}>
                  <Placeholder color={product.color} style={{opacity:i===0?1:0.4,width:"100%",height:"100%"}} />
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
                  <Placeholder color={item.color} style={{width:"100%",height:"100%"}} />
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
          "CKD SHOPは、「身につけるものの質が、自分の質を高める」という信念から生まれたランジェリーブランドです。",
          "私たちが選ぶのは、肌に触れるものだから妥協しない上質な素材と、見えない部分まで丁寧に仕上げたデザインだけです。",
          "流行ではなく、本質へ。毎日身につけるものだからこそ、長く愛せる一着を届けることが私たちの使命です。",
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
          <div key={item.key} className={`adm-ni ${adminPage===item.key?"on":""}`}
            onClick={() => {setAdminPage(item.key);setEditProd(null);setEditCat(null);}}>
            <span>{item.icon}</span>{item.label}
          </div>
        ))}
        <div style={{borderTop:"1px solid var(--border)",marginTop:"1rem",paddingTop:"1rem"}}>
          <div className="adm-ni" onClick={() => nav("home")}><span>⬡</span>サイトを見る</div>
        </div>
      </aside>
      <main className="adm-main">
        {adminPage==="dashboard"  && <AdminDash products={products} />}
        {adminPage==="products"   && <AdminProds products={products} setProducts={setProducts} categories={categories} editProd={editProd} setEditProd={setEditProd} />}
        {adminPage==="categories" && <AdminCats  categories={categories} setCategories={setCategories} editCat={editCat} setEditCat={setEditCat} />}
        {adminPage==="orders"     && <AdminOrders />}
        {adminPage==="settings"   && <AdminSettings settings={settings} setSettings={setSettings} />}
      </main>
    </div>
  );
}

function AdminDash({ products }) {
  const pub = products.filter(p=>p.is_published).length;
  const oos = products.filter(p=>p.stock_quantity===0).length;
  return (
    <div>
      <div className="adm-title">Dashboard</div>
      <div className="adm-sub">ショップの概要</div>
      <div className="stat-grid">
        {[["本日の注文数","—","件"],["今月の売上","—","円"],["在庫切れ商品",oos,"件"],["公開中の商品",pub,"件"]].map(([l,v,u]) => (
          <div className="stat" key={l}>
            <div className="stat-l">{l}</div>
            <div className="stat-v">{v} <span className="stat-u">{u}</span></div>
          </div>
        ))}
      </div>
      <div className="panel">
        <div className="panel-t">Quick Links</div>
        <div style={{display:"flex",gap:".75rem",flexWrap:"wrap"}}>
          <button className="btn btn-o btn-sm">商品を追加する</button>
          <button className="btn btn-o btn-sm">カテゴリを編集する</button>
          <button className="btn btn-o btn-sm">サイト設定を変更する</button>
        </div>
      </div>
    </div>
  );
}

function AdminProds({ products, setProducts, categories, editProd, setEditProd }) {
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(null);

  const blank = {
    id:`prod-${Date.now()}`,name:"",slug:"",price:0,sale_price:null,
    description:"",category_ids:[],stock_quantity:10,
    is_published:true,is_new:false,is_best_seller:false,is_featured:false,
    budget_range:"〜5,000円",material:"",size:"",color_name:"",color:"#2a1f1a",tags:[],
  };

  const openEdit = p => { setEditProd(p); setForm({...p}); };
  const openNew  = () => { setEditProd(blank); setForm({...blank}); };
  const save = () => {
    if (!form.name) return;
    setProducts(prev => {
      const ex = prev.find(p=>p.id===form.id);
      return ex ? prev.map(p=>p.id===form.id?{...form}:p) : [...prev,form];
    });
    setEditProd(null); setForm(null);
  };
  const togglePub = id => setProducts(prev => prev.map(p=>p.id===id?{...p,is_published:!p.is_published}:p));
  const filtered = products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()));

  if (editProd && form) return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"2rem"}}>
        <button className="btn btn-o btn-sm" onClick={() => {setEditProd(null);setForm(null);}}>← 戻る</button>
        <div className="adm-title" style={{margin:0}}>{products.find(p=>p.id===form.id)?"商品を編集":"商品を追加"}</div>
      </div>
      <div className="panel">
        <div className="panel-t">基本情報</div>
        <div className="fg2">
          {[["商品名 *","name","text"],["スラッグ","slug","text"],["価格（税込）","price","number"],["セール価格","sale_price","number"]].map(([l,k,t]) => (
            <div className="fg3" key={k}>
              <label className="fl">{l}</label>
              <input type={t} className="inp" value={form[k]||""} onChange={e=>setForm(f=>({...f,[k]:t==="number"?Number(e.target.value)||null:e.target.value}))} />
            </div>
          ))}
        </div>
        <div className="fg3">
          <label className="fl">商品説明</label>
          <textarea className="txta" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} />
        </div>
        <div className="fg2">
          {[["素材","material"],["サイズ","size"],["カラー","color_name"]].map(([l,k]) => (
            <div className="fg3" key={k}>
              <label className="fl">{l}</label>
              <input type="text" className="inp" value={form[k]||""} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} />
            </div>
          ))}
          <div className="fg3">
            <label className="fl">在庫数</label>
            <input type="number" className="inp" value={form.stock_quantity||0} onChange={e=>setForm(f=>({...f,stock_quantity:Number(e.target.value)}))} />
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="panel-t">カテゴリ</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:".5rem"}}>
          {categories.map(cat => {
            const on = form.category_ids.includes(cat.id);
            return (
              <div key={cat.id}
                onClick={() => setForm(f=>({...f,category_ids:on?f.category_ids.filter(id=>id!==cat.id):[...f.category_ids,cat.id]}))}
                style={{padding:".4rem .9rem",border:`1px solid ${on?"var(--accent)":"var(--border)"}`,background:on?"rgba(200,168,130,0.15)":"transparent",color:on?"var(--accent)":"var(--text2)",cursor:"pointer",fontSize:".74rem",transition:"all .15s"}}>
                {cat.name}
              </div>
            );
          })}
        </div>
      </div>
      <div className="panel">
        <div className="panel-t">表示設定</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"1rem"}}>
          {[["is_published","公開"],["is_new","New表示"],["is_best_seller","Best Seller"],["is_featured","Featured"]].map(([k,l]) => (
            <div className="opt-row" key={k} style={{margin:0}}>
              <span style={{fontSize:".8rem",color:"var(--text2)"}}>{l}</span>
              <label className="tgl"><input type="checkbox" checked={!!form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.checked}))} /><span className="tgl-sl" /></label>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"flex",gap:"1rem",marginTop:".5rem"}}>
        <button className="btn btn-p" onClick={save}>保存する</button>
        <button className="btn btn-o" onClick={() => {setEditProd(null);setForm(null);}}>キャンセル</button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"1.5rem"}}>
        <div><div className="adm-title">商品管理</div><div className="adm-sub">{products.length}件の商品</div></div>
        <button className="btn btn-p btn-sm" onClick={openNew}>+ 商品を追加</button>
      </div>
      <div style={{marginBottom:"1rem"}}>
        <input type="text" className="inp" placeholder="商品名で検索..." value={search} onChange={e=>setSearch(e.target.value)} style={{maxWidth:"300px"}} />
      </div>
      <div style={{overflowX:"auto"}}>
        <table className="tbl">
          <thead><tr><th>商品名</th><th>価格</th><th>カテゴリ</th><th>在庫</th><th>状態</th><th>操作</th></tr></thead>
          <tbody>
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
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>¥{p.price.toLocaleString()}{p.sale_price&&<span style={{color:"var(--accent)",marginLeft:".4rem",fontSize:".72rem"}}>→¥{p.sale_price.toLocaleString()}</span>}</td>
                  <td style={{fontSize:".76rem"}}>{cat?.name||"—"}</td>
                  <td style={{color:p.stock_quantity===0?"#c07a7a":"inherit"}}>{p.stock_quantity===0?"SOLD OUT":`${p.stock_quantity}点`}</td>
                  <td>
                    <button className={`sb ${p.is_published?"sb-on":"sb-off"}`}
                      style={{cursor:"pointer",background:"inherit",padding:".22rem .7rem"}}
                      onClick={() => togglePub(p.id)}>
                      {p.is_published?"公開中":"非公開"}
                    </button>
                  </td>
                  <td><button className="btn btn-o btn-sm" onClick={() => openEdit(p)}>編集</button></td>
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
