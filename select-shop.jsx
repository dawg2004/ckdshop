import { useState, useEffect } from "react";

// ===== DATA =====
const INITIAL_CATEGORIES = [
  { id: "cat-a", name: "カテゴリA", slug: "category-a", description: "カテゴリAの商品一覧です", display_order: 1, is_active: true },
  { id: "cat-b", name: "カテゴリB", slug: "category-b", description: "カテゴリBの商品一覧です", display_order: 2, is_active: true },
  { id: "cat-c", name: "カテゴリC", slug: "category-c", description: "カテゴリCの商品一覧です", display_order: 3, is_active: true },
  { id: "cat-d", name: "カテゴリD", slug: "category-d", description: "カテゴリDの商品一覧です", display_order: 4, is_active: true },
  { id: "cat-e", name: "カテゴリE", slug: "category-e", description: "カテゴリEの商品一覧です", display_order: 5, is_active: true },
  { id: "cat-f", name: "カテゴリF", slug: "category-f", description: "カテゴリFの商品一覧です", display_order: 6, is_active: true },
];

const BUDGET_RANGES = ["〜3,000円", "3,000円〜5,000円", "5,000円〜10,000円", "10,000円〜"];

function getBudgetRange(price) {
  if (price < 3000) return "〜3,000円";
  if (price < 5000) return "3,000円〜5,000円";
  if (price < 10000) return "5,000円〜10,000円";
  return "10,000円〜";
}

const PRODUCT_TEMPLATES = [
  "Ceramic Mug", "Wooden Tray", "Linen Pouch", "Desk Object", "Stone Coaster",
  "Glass Vase", "Brass Clip", "Cotton Towel", "Paper Weight", "Iron Tray",
];

const COLORS = ["#E8E0D8","#D4C9B8","#C5BAA8","#B8AFA3","#E2D8CE","#D8CFC6","#CBBEAF","#C4B9AC","#DDD4C8","#D0C7BB"];

function generateProducts() {
  const products = [];
  for (let i = 0; i < 50; i++) {
    const base = PRODUCT_TEMPLATES[i % PRODUCT_TEMPLATES.length];
    const num = String(Math.floor(i / PRODUCT_TEMPLATES.length) + 1).padStart(2, "0");
    const price = [1500,2000,2500,3000,3500,4000,4500,5000,6000,7000,8000,9000,10000,12000,15000][i % 15];
    const catId = INITIAL_CATEGORIES[i % 6].id;
    products.push({
      id: `prod-${i + 1}`,
      name: `${base} ${num}`,
      slug: `${base.toLowerCase().replace(/ /g, "-")}-${num}`,
      price,
      sale_price: i % 7 === 0 ? Math.floor(price * 0.8) : null,
      description: `丁寧に選んだ素材で作られた、日常に馴染む${base}です。上質な素材と誠実なつくり手の一点です。`,
      short_description: `上質な素材と丁寧な仕上げ。毎日使いたくなるアイテムです。`,
      category_ids: [catId],
      tags: ["LifeStyle", "Minimal", "Japan"],
      stock_quantity: i % 11 === 0 ? 0 : Math.floor(Math.random() * 20) + 1,
      is_published: true,
      is_new: i < 8,
      is_best_seller: i >= 8 && i < 16,
      is_featured: i < 4,
      budget_range: getBudgetRange(price),
      material: ["陶器", "木材", "リネン", "真鍮", "ガラス", "コットン"][i % 6],
      size: ["W8 × H9 cm", "W24 × D16 cm", "W12 × H8 cm", "φ3 × H6 cm"][i % 4],
      weight: `${[150,300,80,200,250,120][i % 6]}g`,
      color: COLORS[i % COLORS.length],
    });
  }
  return products;
}

const INITIAL_PRODUCTS = generateProducts();

const INITIAL_SETTINGS = {
  shopName: "SKD SELECT",
  mainCopy: "五感を呼び覚ませ。",
  subCopy: "素材と誠実さで選んだ、長く使えるものだけを。",
  shippingFee: 550,
  freeShippingLine: 8000,
  contactEmail: "hello@sogu-shop.jp",
};

// ===== CSS =====
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Noto+Sans+JP:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:     #FAFAF7;
    --bg2:    #F5F2ED;
    --text:   #1C1C1A;
    --text2:  #6B6760;
    --text3:  #9B9793;
    --border: #E8E4DE;
    --black:  #1C1C1A;
    --white:  #FAFAF7;
  }

  body { background: var(--bg); color: var(--text); font-family: 'Noto Sans JP', sans-serif; }
  .fd { font-family: 'Cormorant Garamond', serif; }
  .wrap { min-height: 100vh; background: var(--bg); }

  /* ── HEADER ── */
  .hdr {
    position: sticky; top: 0; z-index: 100;
    background: var(--bg); border-bottom: 1px solid var(--border);
    padding: 0 2rem;
  }
  .hdr-in {
    max-width: 1400px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    height: 64px;
  }
  .logo { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 400; letter-spacing: 0.18em; cursor: pointer; color: var(--text); }
  .nav { display: flex; gap: 2rem; }
  .nl { font-size: 0.76rem; letter-spacing: 0.08em; color: var(--text2); cursor: pointer; background: none; border: none; padding: 0; font-family: 'Noto Sans JP', sans-serif; transition: color .2s; }
  .nl:hover, .nl.on { color: var(--text); }
  .nl.on { border-bottom: 1px solid var(--text); }
  .hdr-r { display: flex; gap: 1rem; align-items: center; }
  .ib { background: none; border: none; cursor: pointer; color: var(--text2); padding: 4px; font-size: 0.95rem; transition: color .2s; position: relative; }
  .ib:hover { color: var(--text); }
  .cbadge { position: absolute; top: -5px; right: -5px; background: var(--black); color: var(--white); border-radius: 50%; width: 15px; height: 15px; font-size: 0.55rem; display: flex; align-items: center; justify-content: center; }

  /* mobile header */
  .mhdr { display: none; position: sticky; top: 0; z-index: 100; background: var(--bg); border-bottom: 1px solid var(--border); padding: 0 1rem; }
  .mhdr-in { display: flex; align-items: center; justify-content: space-between; height: 56px; }
  @media(max-width:768px){ .hdr{display:none;} .mhdr{display:block;} }

  /* ── HERO ── */
  .hero { display: grid; grid-template-columns: 1fr 1fr; min-height: 88vh; }
  .hero-img { background: var(--bg2); display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .hero-txt { display: flex; flex-direction: column; justify-content: center; padding: 5rem 4rem; }
  .eyebrow { font-size: 0.68rem; letter-spacing: 0.25em; color: var(--text3); text-transform: uppercase; margin-bottom: 1.5rem; }
  .hero-h { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.4rem,3.8vw,4rem); font-weight: 300; line-height: 1.2; margin-bottom: 1.5rem; }
  .hero-p { font-size: 0.83rem; line-height: 1.95; color: var(--text2); margin-bottom: 2.5rem; max-width: 30ch; }
  .hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
  @media(max-width:768px){
    .hero { grid-template-columns: 1fr; min-height: auto; }
    .hero-img { height: 55vw; min-height: 240px; }
    .hero-txt { padding: 2.5rem 1.5rem; }
    .hero-btns { flex-direction: column; }
  }

  /* ── BUTTONS ── */
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; padding: .8rem 2rem; font-size: .77rem; letter-spacing: .1em; cursor: pointer; border: none; font-family: 'Noto Sans JP', sans-serif; transition: all .2s; }
  .btn-p { background: var(--black); color: var(--white); }
  .btn-p:hover { background: #3a3a38; }
  .btn-o { background: transparent; color: var(--text); border: 1px solid var(--border); }
  .btn-o:hover { border-color: var(--text); }
  .btn-sm { padding: .5rem 1.2rem; font-size: .72rem; }
  .btn-w { width: 100%; }

  /* ── SECTION ── */
  .sec { padding: 5rem 2rem; max-width: 1400px; margin: 0 auto; }
  .sec-sm { padding: 3rem 2rem; max-width: 1400px; margin: 0 auto; }
  .sl { font-size: .67rem; letter-spacing: .25em; text-transform: uppercase; color: var(--text3); margin-bottom: .7rem; }
  .sh { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 300; margin-bottom: .75rem; }
  .sdiv { border: none; border-top: 1px solid var(--border); margin: 0; }
  @media(max-width:768px){ .sec{padding:3rem 1rem;} }

  /* ── CATEGORY CARDS ── */
  .cat-grid { display: grid; grid-template-columns: repeat(6,1fr); gap: .75rem; }
  .cat-card { background: var(--bg2); padding: 0; text-align: center; cursor: pointer; border: 1px solid transparent; transition: border-color .2s; overflow: hidden; }
  .cat-card:hover { border-color: var(--border); }
  .cat-img { height: 90px; background: #E8E0D8; display: flex; align-items: center; justify-content: center; }
  .cat-name { font-size: .77rem; letter-spacing: .04em; padding: .65rem .5rem; }
  @media(max-width:1024px){ .cat-grid{grid-template-columns:repeat(3,1fr);} }
  @media(max-width:768px){ .cat-grid{grid-template-columns:repeat(2,1fr);} }

  /* ── PRODUCT GRID ── */
  .pg { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.5rem; }
  @media(max-width:1024px){ .pg{grid-template-columns:repeat(3,1fr);} }
  @media(max-width:768px){ .pg{grid-template-columns:repeat(2,1fr); gap:1rem;} }

  /* ── PRODUCT CARD ── */
  .pc { cursor: pointer; }
  .pc-img { aspect-ratio: 3/4; position: relative; overflow: hidden; margin-bottom: .7rem; }
  .pc-img .ph { width:100%; height:100%; object-fit:cover; transition: transform .5s; }
  .pc:hover .ph { transform: scale(1.03); }
  .pc-badges { position: absolute; top: .7rem; left: .7rem; display: flex; flex-direction: column; gap: .3rem; }
  .b-tag { font-size: .59rem; letter-spacing: .1em; padding: .22rem .48rem; text-transform: uppercase; }
  .b-new { background: var(--black); color: var(--white); }
  .b-best { background: #6B7355; color: var(--white); }
  .b-sale { background: #8B3A3A; color: var(--white); }
  .oos { position: absolute; inset: 0; background: rgba(250,250,247,.75); display: flex; align-items: center; justify-content: center; font-size: .72rem; letter-spacing: .1em; color: var(--text2); }
  .pc-name { font-size: .81rem; letter-spacing: .02em; margin-bottom: .22rem; }
  .pc-price { font-size: .77rem; color: var(--text2); }
  .sp { color: #8B3A3A; }
  .op { text-decoration: line-through; color: var(--text3); margin-right: .4rem; }

  /* ── PRODUCTS PAGE ── */
  .pl { display: grid; grid-template-columns: 230px 1fr; gap: 3rem; }
  @media(max-width:1024px){ .pl{grid-template-columns:1fr;} }
  .fg { margin-bottom: 2rem; }
  .fg-title { font-size: .68rem; letter-spacing: .15em; text-transform: uppercase; color: var(--text3); margin-bottom: .75rem; }
  .fi { display: flex; align-items: center; gap: .5rem; margin-bottom: .45rem; cursor: pointer; }
  .fchk { width: 14px; height: 14px; border: 1px solid var(--border); cursor: pointer; accent-color: var(--black); }
  .flbl { font-size: .77rem; color: var(--text2); cursor: pointer; }
  .flbl:hover { color: var(--text); }

  /* ── PRODUCT DETAIL ── */
  .pd { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
  @media(max-width:768px){ .pd{grid-template-columns:1fr; gap:2rem;} }
  .gthumb { display: flex; gap: .5rem; margin-top: .6rem; }
  .gth { width: 60px; height: 76px; cursor: pointer; border: 1px solid transparent; transition: border-color .2s; overflow: hidden; }
  .gth.on { border-color: var(--text); }
  .pd-name { font-family: 'Cormorant Garamond', serif; font-size: 2.1rem; font-weight: 300; margin-bottom: .7rem; }
  .pd-price { font-size: 1.1rem; margin-bottom: 1.5rem; }
  .pd-desc { font-size: .83rem; line-height: 1.95; color: var(--text2); margin-bottom: 2rem; }
  .specs { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; margin-bottom: 1.5rem; }
  .spec-k { font-size: .63rem; letter-spacing: .1em; color: var(--text3); margin-bottom: .18rem; }
  .spec-v { font-size: .79rem; color: var(--text2); }
  .qty-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
  .qty-label { font-size: .7rem; letter-spacing: .1em; color: var(--text3); }
  .qb { width: 32px; height: 32px; border: 1px solid var(--border); background: none; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; }
  .qv { font-size: .88rem; min-width: 1.8rem; text-align: center; }
  .chip { display: inline-flex; padding: .18rem .55rem; border: 1px solid var(--border); font-size: .63rem; letter-spacing: .07em; color: var(--text3); margin: .18rem; }
  .bc { font-size: .7rem; color: var(--text3); margin-bottom: 2rem; display: flex; gap: .5rem; align-items: center; }
  .bc span { cursor: pointer; }
  .bc span:hover { color: var(--text); }

  /* ── CART ── */
  .cart-lay { display: grid; grid-template-columns: 1fr 340px; gap: 3rem; align-items: start; }
  @media(max-width:768px){ .cart-lay{grid-template-columns:1fr;} }
  .ci { display: grid; grid-template-columns: 80px 1fr; gap: 1rem; padding: 1.5rem 0; border-bottom: 1px solid var(--border); align-items: start; }
  .ci-name { font-size: .83rem; margin-bottom: .25rem; }
  .ci-price { font-size: .77rem; color: var(--text2); }
  .ci-rm { font-size: .68rem; color: var(--text3); cursor: pointer; background: none; border: none; text-decoration: underline; margin-top: .45rem; display: block; }
  .os { background: var(--bg2); padding: 2rem; }
  .os-row { display: flex; justify-content: space-between; font-size: .81rem; margin-bottom: .72rem; }
  .os-total { display: flex; justify-content: space-between; font-size: .93rem; font-weight: 500; padding-top: 1rem; margin-top: .5rem; border-top: 1px solid var(--border); }

  /* ── ABOUT STRIP ── */
  .ab-strip { background: var(--black); color: var(--white); padding: 5rem 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; }
  @media(max-width:768px){ .ab-strip{grid-template-columns:1fr; padding:3rem 1.5rem; gap:2rem;} }

  /* ── ADMIN ── */
  .adm { display: grid; grid-template-columns: 210px 1fr; min-height: 100vh; font-family: 'Noto Sans JP', sans-serif; }
  .adm-side { background: var(--black); padding: 2rem 0; }
  .adm-logo { padding: 0 1.5rem 2rem; font-family: 'Cormorant Garamond', serif; font-size: 1.35rem; color: var(--white); letter-spacing: .12em; border-bottom: 1px solid #3a3a38; margin-bottom: 1rem; }
  .adm-ni { padding: .68rem 1.5rem; font-size: .77rem; color: #9B9793; cursor: pointer; letter-spacing: .05em; transition: all .2s; display: flex; align-items: center; gap: .6rem; }
  .adm-ni:hover, .adm-ni.on { background: #2a2a28; color: var(--white); }
  .adm-main { padding: 2.5rem; background: var(--bg); overflow: auto; }
  .adm-title { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 300; margin-bottom: .4rem; }
  .adm-sub { font-size: .78rem; color: var(--text3); margin-bottom: 2rem; }
  .stat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem; margin-bottom: 2.5rem; }
  @media(max-width:1200px){ .stat-grid{grid-template-columns:repeat(2,1fr);} }
  .stat { background: var(--white); border: 1px solid var(--border); padding: 1.5rem; }
  .stat-l { font-size: .67rem; letter-spacing: .15em; text-transform: uppercase; color: var(--text3); margin-bottom: .45rem; }
  .stat-v { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 300; }
  .stat-u { font-size: .73rem; color: var(--text3); }
  .tbl { width: 100%; border-collapse: collapse; font-size: .79rem; }
  .tbl th { text-align: left; padding: .72rem 1rem; font-size: .66rem; letter-spacing: .12em; text-transform: uppercase; color: var(--text3); border-bottom: 1px solid var(--border); font-weight: 400; }
  .tbl td { padding: .82rem 1rem; border-bottom: 1px solid var(--border); color: var(--text2); vertical-align: middle; }
  .tbl tr:hover td { background: var(--bg2); }
  .inp { width: 100%; border: 1px solid var(--border); padding: .63rem .88rem; font-size: .81rem; background: var(--bg); font-family: 'Noto Sans JP', sans-serif; outline: none; transition: border-color .2s; }
  .inp:focus { border-color: var(--text2); }
  .sel { width: 100%; border: 1px solid var(--border); padding: .63rem .88rem; font-size: .81rem; background: var(--bg); font-family: 'Noto Sans JP', sans-serif; outline: none; cursor: pointer; appearance: none; }
  .txta { width: 100%; border: 1px solid var(--border); padding: .63rem .88rem; font-size: .81rem; background: var(--bg); font-family: 'Noto Sans JP', sans-serif; outline: none; resize: vertical; min-height: 75px; }
  .fg2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem 2rem; }
  .fg3 { margin-bottom: 1.1rem; }
  .fl { font-size: .7rem; letter-spacing: .1em; color: var(--text2); margin-bottom: .38rem; display: block; }
  .sb { display: inline-flex; align-items: center; padding: .18rem .55rem; font-size: .63rem; letter-spacing: .07em; }
  .sb-on { background: #E8F0E8; color: #3A6B3A; }
  .sb-off { background: #F0E8E8; color: #6B3A3A; }
  .sb-new { background: #E8E0F0; color: #5A3A6B; }
  .panel { background: var(--white); border: 1px solid var(--border); padding: 2rem; margin-bottom: 1.5rem; }
  .panel-t { font-size: .76rem; letter-spacing: .12em; text-transform: uppercase; color: var(--text3); margin-bottom: 1.5rem; padding-bottom: .72rem; border-bottom: 1px solid var(--border); }
  .tgl { position: relative; display: inline-block; width: 40px; height: 22px; }
  .tgl input { opacity: 0; width: 0; height: 0; }
  .tgl-sl { position: absolute; cursor: pointer; inset: 0; background: var(--border); transition: .3s; border-radius: 22px; }
  .tgl-sl:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background: white; transition: .3s; border-radius: 50%; }
  input:checked + .tgl-sl { background: var(--black); }
  input:checked + .tgl-sl:before { transform: translateX(18px); }
  .opt-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: .9rem; }

  /* ── MISC ── */
  .divider { border: none; border-top: 1px solid var(--border); margin: 3rem 0; }
  .empty { text-align: center; padding: 5rem 2rem; color: var(--text3); }
  .empty-t { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 300; margin-bottom: .5rem; }
  .toast { position: fixed; bottom: 2rem; right: 2rem; background: var(--black); color: var(--white); padding: .78rem 1.5rem; font-size: .77rem; letter-spacing: .05em; z-index: 999; animation: si .3s ease; }
  @keyframes si { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .pe { animation: pe .25s ease; }
  @keyframes pe { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
  .mb-bar { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: var(--bg); border-top: 1px solid var(--border); padding: .72rem 1rem; z-index: 50; }
  @media(max-width:768px){ .mb-bar{display:block;} }
  .rel-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.5rem; }
  @media(max-width:768px){ .rel-grid{grid-template-columns:repeat(2,1fr);} }
  .wrp-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2rem; }
  @media(max-width:768px){ .wrp-grid{grid-template-columns:1fr; gap:1rem;} }
  .wrp-item { text-align: center; padding: 2.5rem 1.5rem; border: 1px solid var(--border); }
  .wrp-icon { font-size: 1.8rem; margin-bottom: 1rem; }
  .wrp-t { font-size: .83rem; font-weight: 500; margin-bottom: .45rem; }
  .wrp-d { font-size: .77rem; color: var(--text3); line-height: 1.75; }
  .pills { display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: 1.5rem; }
  .pill { padding: .48rem 1.15rem; font-size: .74rem; border: 1px solid var(--border); cursor: pointer; background: var(--bg); transition: all .2s; letter-spacing: .04em; }
  .pill.on { background: var(--black); color: var(--white); border-color: var(--black); }
  .pill:hover:not(.on) { border-color: var(--text2); }
`;

// ── helpers ──
function Placeholder({ color = "#E8E0D8", style = {}, className = "" }) {
  return (
    <div className={`ph ${className}`} style={{ background: color, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", ...style }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4B9AC" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="1"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
    </div>
  );
}

function ProductCard({ product, categories, onClick }) {
  return (
    <div className="pc pe" onClick={() => onClick(product)}>
      <div className="pc-img">
        <Placeholder color={product.color} />
        <div className="pc-badges">
          {product.is_new && <span className="b-tag b-new">New</span>}
          {product.is_best_seller && <span className="b-tag b-best">Best</span>}
          {product.sale_price && <span className="b-tag b-sale">Sale</span>}
        </div>
        {product.stock_quantity === 0 && <div className="oos">在庫切れ</div>}
      </div>
      <div className="pc-name">{product.name}</div>
      <div className="pc-price">
        {product.sale_price
          ? <><span className="op">¥{product.price.toLocaleString()}</span><span className="sp">¥{product.sale_price.toLocaleString()}</span></>
          : <span>¥{product.price.toLocaleString()}</span>}
      </div>
    </div>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t); }, []);
  return <div className="toast">✓ {message}</div>;
}

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

  const nav = (p, extra = {}) => { setPage(p); if (extra.product) setSelectedProduct(extra.product); setDrawerOpen(false); window.scrollTo(0, 0); };
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
    { label: "ホーム",    page: "home" },
    { label: "商品一覧",  page: "products" },
    { label: "サービス",  page: null, href: "https://www.beyourlover.co.jp/app-toys" },
    { label: "SALE",      page: "best" },
    { label: "レビュー",  page: "about" },
    { label: "マイページ", page: "about" },
  ];

  const SVGSettings = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  );
  const SVGCart = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
  );

  return (
    <div className="wrap">
      <style>{css}</style>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Drawer overlay */}
      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",zIndex:200}} />
      )}

      {/* Drawer */}
      <div style={{
        position:"fixed", top:0, left:0, height:"100%", width:"72vw", maxWidth:"300px",
        background:"#FAFAF7", zIndex:201, transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
        transition:"transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        display:"flex", flexDirection:"column",
        boxShadow: drawerOpen ? "4px 0 24px rgba(0,0,0,0.08)" : "none",
      }}>
        {/* Drawer header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1rem 1.25rem",borderBottom:"1px solid #E8E4DE"}}>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.25rem",letterSpacing:"0.15em"}}>{settings.shopName}</span>
          <button onClick={() => setDrawerOpen(false)} style={{background:"none",border:"none",cursor:"pointer",color:"#6B6760",fontSize:"1.2rem",lineHeight:1}}>✕</button>
        </div>
        {/* Nav items */}
        <nav style={{flex:1,paddingTop:"0.5rem"}}>
          {drawerItems.map(item => (
            item.href ? (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" style={{
                display:"block", width:"100%", textAlign:"left",
                padding:"1rem 1.5rem", background:"none", border:"none",
                borderBottom:"1px solid #F0EDE8", cursor:"pointer",
                fontSize:"0.9rem", letterSpacing:"0.06em", color:"#1C1C1A",
                fontFamily:"'Noto Sans JP',sans-serif", textDecoration:"none",
              }}>
                {item.label} ↗
              </a>
            ) : (
              <button key={item.label} onClick={() => nav(item.page)} style={{
                display:"block", width:"100%", textAlign:"left",
                padding:"1rem 1.5rem", background:"none", border:"none",
                borderBottom:"1px solid #F0EDE8", cursor:"pointer",
                fontSize:"0.9rem", letterSpacing:"0.06em", color:"#1C1C1A",
                fontFamily:"'Noto Sans JP',sans-serif",
                transition:"background 0.15s",
              }}
              onMouseEnter={e=>e.currentTarget.style.background="#F5F2ED"}
              onMouseLeave={e=>e.currentTarget.style.background="none"}
              >
                {item.label}
              </button>
            )
          ))}
        </nav>
        {/* Drawer footer */}
        <div style={{padding:"1.25rem 1.5rem",borderTop:"1px solid #E8E4DE"}}>
          <div style={{fontSize:"0.68rem",letterSpacing:"0.15em",color:"#9B9793",textTransform:"uppercase"}}>{settings.shopName}</div>
        </div>
      </div>

      {page !== "admin" && <>
        {/* Desktop */}
        <header className="hdr">
          <div className="hdr-in">
            <span className="logo" onClick={() => nav("home")}>{settings.shopName}</span>
            <nav className="nav">
              {[["products","Shop"],["new","New"],["best","Best Sellers"],["about","About"]].map(([p,l]) => (
                <button key={p} className={`nl ${page===p?"on":""}`} onClick={() => nav(p)}>{l}</button>
              ))}
            </nav>
            <div className="hdr-r">
              <button className="ib" onClick={() => nav("admin")} title="管理画面"><SVGSettings /></button>
              <button className="ib" style={{position:"relative"}} onClick={() => nav("cart")}>
                <SVGCart />
                {cartCount > 0 && <span className="cbadge">{cartCount}</span>}
              </button>
            </div>
          </div>
        </header>
        {/* Mobile */}
        <header className="mhdr">
          <div className="mhdr-in">
            <button className="ib" onClick={() => setDrawerOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <span className="logo" onClick={() => nav("home")}>{settings.shopName}</span>
            <div style={{display:"flex",gap:".5rem"}}>
              <button className="ib" onClick={() => nav("admin")}><SVGSettings /></button>
              <button className="ib" style={{position:"relative"}} onClick={() => nav("cart")}>
                <SVGCart />
                {cartCount > 0 && <span className="cbadge">{cartCount}</span>}
              </button>
            </div>
          </div>
        </header>
      </>}

      {page === "home"    && <HomePage    products={products} categories={categories} settings={settings} nav={nav} addToCart={addToCart} />}
      {page === "products"&& <ProductsPage products={products} categories={categories} nav={nav} />}
      {page === "new"     && <FilteredPage products={products.filter(p=>p.is_new)} categories={categories} nav={nav} title="New Arrivals" label="New" />}
      {page === "best"    && <FilteredPage products={products.filter(p=>p.is_best_seller)} categories={categories} nav={nav} title="Best Sellers" label="Best Sellers" />}
      {page === "product-detail" && <DetailPage product={selectedProduct} products={products} categories={categories} nav={nav} addToCart={addToCart} />}
      {page === "cart"    && <CartPage    cart={cart} setCart={setCart} nav={nav} settings={settings} />}
      {page === "about"   && <AboutPage   />}
      {page === "admin"   && <AdminPage   categories={categories} setCategories={setCategories} products={products} setProducts={setProducts} settings={settings} setSettings={setSettings} nav={nav} adminPage={adminPage} setAdminPage={setAdminPage} />}
    </div>
  );
}

// ── HOME ──
function HomePage({ products, categories, settings, nav, addToCart }) {
  const newItems  = products.filter(p => p.is_new).slice(0, 8);
  const best      = products.filter(p => p.is_best_seller).slice(0, 8);
  const featured  = products.filter(p => p.is_featured).slice(0, 4);

  return (
    <div className="pe">
      {/* Hero */}
      <section className="hero">
        <div className="hero-img">
          <div style={{width:"100%",height:"100%",background:"linear-gradient(135deg,#E8E0D8 0%,#D4C9B8 100%)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"1rem"}}>
            <div className="fd" style={{fontSize:"clamp(3rem,8vw,7rem)",color:"#C4B9AC",fontWeight:300,lineHeight:1}}>器</div>
            <div style={{fontSize:".63rem",letterSpacing:".3em",color:"#B8AFA3",textTransform:"uppercase"}}>Selected with care</div>
          </div>
        </div>
        <div className="hero-txt">
          <div className="eyebrow">Select Shop</div>
          <h1 className="hero-h fd">{settings.mainCopy}</h1>
          <p className="hero-p">{settings.subCopy}</p>
          <div className="hero-btns">
            <button className="btn btn-p" onClick={() => nav("products")}>すべての商品を見る</button>
            <button className="btn btn-o" onClick={() => nav("new")}>New Arrivals →</button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <div className="sec">
        <div className="sl">Collections</div>
        <h2 className="sh fd">カテゴリから探す</h2>
        <div style={{marginBottom:"2rem"}} />
        <div className="cat-grid">
          {categories.filter(c => c.is_active).map(cat => (
            <div className="cat-card" key={cat.id} onClick={() => nav("products")}>
              <div className="cat-img">
                <span style={{fontSize:".58rem",letterSpacing:".2em",color:"#B8AFA3"}}>─</span>
              </div>
              <div className="cat-name">{cat.name}</div>
            </div>
          ))}
        </div>
      </div>

      <hr className="sdiv" />

      {/* Featured */}
      <div className="sec">
        <div className="sl">Featured</div>
        <h2 className="sh fd">注目のアイテム</h2>
        <div style={{marginBottom:"2rem"}} />
        <div className="pg">
          {featured.map(p => <ProductCard key={p.id} product={p} categories={categories} onClick={prod => nav("product-detail",{product:prod})} />)}
        </div>
      </div>

      <hr className="sdiv" />

      {/* New */}
      <div className="sec">
        <div className="sl">New Arrivals</div>
        <h2 className="sh fd">新着商品</h2>
        <div style={{marginBottom:"2rem"}} />
        <div className="pg">
          {newItems.map(p => <ProductCard key={p.id} product={p} categories={categories} onClick={prod => nav("product-detail",{product:prod})} />)}
        </div>
        <div style={{textAlign:"center",marginTop:"2.5rem"}}>
          <button className="btn btn-o" onClick={() => nav("new")}>新着をすべて見る →</button>
        </div>
      </div>

      <hr className="sdiv" />

      {/* Best */}
      <div className="sec">
        <div className="sl">Best Sellers</div>
        <h2 className="sh fd">人気商品</h2>
        <div style={{marginBottom:"2rem"}} />
        <div className="pg">
          {best.map(p => <ProductCard key={p.id} product={p} categories={categories} onClick={prod => nav("product-detail",{product:prod})} />)}
        </div>
        <div style={{textAlign:"center",marginTop:"2.5rem"}}>
          <button className="btn btn-o" onClick={() => nav("best")}>人気商品をすべて見る →</button>
        </div>
      </div>

      <hr className="sdiv" />

      {/* Shipping info */}
      <div className="sec">
        <div className="sl">Service</div>
        <h2 className="sh fd">ショッピングについて</h2>
        <div style={{marginBottom:"2rem"}} />
        <div className="wrp-grid">
          {[
            {icon:"🚚",title:"送料",desc:`¥${settings.shippingFee.toLocaleString()}（税込）。¥${settings.freeShippingLine.toLocaleString()}以上のご注文で送料無料です。`},
            {icon:"📦",title:"丁寧な梱包",desc:"商品が傷まないよう、一点ずつ丁寧に梱包してお届けします。"},
            {icon:"🔄",title:"返品・交換",desc:"商品到着後7日以内であれば、未使用品に限り返品・交換を承ります。"},
          ].map((item,i) => (
            <div className="wrp-item" key={i}>
              <div className="wrp-icon">{item.icon}</div>
              <div className="wrp-t">{item.title}</div>
              <div className="wrp-d">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* About strip */}
      <div className="ab-strip">
        <div>
          <div style={{fontSize:".63rem",letterSpacing:".25em",color:"#9B9793",marginBottom:"1.5rem",textTransform:"uppercase"}}>Our Philosophy</div>
          <h2 className="fd" style={{fontSize:"clamp(1.8rem,3vw,2.8rem)",fontWeight:300,lineHeight:1.2,marginBottom:"1.5rem"}}>長く使えるものを、<br />丁寧に届ける。</h2>
          <p style={{fontSize:".82rem",lineHeight:2,color:"#9B9793"}}>私たちは「素材の良さ」「つくり手の誠実さ」「使うたびに増す愛着」を基準に商品を選んでいます。流行ではなく、本質を。</p>
          <button className="btn btn-o" style={{marginTop:"2rem",borderColor:"#3a3a38",color:"#9B9793"}} onClick={() => {}}>About →</button>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:"100%",aspectRatio:"4/3",background:"#2a2a28",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span className="fd" style={{fontSize:"5rem",color:"#3a3a38",fontWeight:300}}>器</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{background:"#1C1C1A",color:"#6B6760",padding:"3rem 2rem"}}>
        <div style={{maxWidth:"1400px",margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:"2rem"}}>
          <div>
            <div className="fd" style={{fontSize:"1.35rem",color:"#FAFAF7",marginBottom:"1rem",letterSpacing:".12em"}}>{settings.shopName}</div>
            <p style={{fontSize:".74rem",lineHeight:1.8}}>日常に、静かな豊かさを。</p>
          </div>
          {[["Shop",["すべての商品","新着","人気商品"]],["Info",["About","FAQ","配送・返品","お問い合わせ"]],["Legal",["特定商取引法","プライバシーポリシー"]]].map(([title,items]) => (
            <div key={title}>
              <div style={{fontSize:".62rem",letterSpacing:".2em",color:"#9B9793",marginBottom:".72rem",textTransform:"uppercase"}}>{title}</div>
              {items.map(item => <div key={item} style={{fontSize:".77rem",marginBottom:".48rem",cursor:"pointer"}}>{item}</div>)}
            </div>
          ))}
        </div>
        <div style={{maxWidth:"1400px",margin:"2rem auto 0",paddingTop:"1.5rem",borderTop:"1px solid #2a2a28",fontSize:".66rem",color:"#4a4a48"}}>
          © 2025 {settings.shopName}. All rights reserved.
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
      <div style={{background:"#F5F2ED",padding:"3rem 2rem 2rem",borderBottom:"1px solid #E8E4DE"}}>
        <div style={{maxWidth:"1400px",margin:"0 auto"}}>
          <div className="sl">Shop</div>
          <h1 className="fd" style={{fontSize:"2.5rem",fontWeight:300}}>すべての商品</h1>
          <div style={{fontSize:".73rem",color:"#9B9793",marginTop:".4rem"}}>{filtered.length}件</div>
        </div>
      </div>
      <div className="sec" style={{paddingTop:"2.5rem"}}>
        <div className="pl">
          <aside>
            <div className="fg">
              <div className="fg-title">カテゴリ</div>
              {categories.filter(c=>c.is_active).map(cat => (
                <div className="fi" key={cat.id} onClick={() => toggle(cats,setCats,cat.id)}>
                  <input type="checkbox" className="fchk" checked={cats.includes(cat.id)} readOnly />
                  <span className="flbl">{cat.name}</span>
                </div>
              ))}
            </div>
            <div className="fg">
              <div className="fg-title">価格帯</div>
              {BUDGET_RANGES.map(b => (
                <div className="fi" key={b} onClick={() => toggle(budgets,setBudgets,b)}>
                  <input type="checkbox" className="fchk" checked={budgets.includes(b)} readOnly />
                  <span className="flbl">{b}</span>
                </div>
              ))}
            </div>
            <div className="fg">
              <div className="fg-title">絞り込み</div>
              {[["inStock","在庫あり"],["isNew","New"],["isBest","Best Seller"]].map(([k,l]) => (
                <div className="fi" key={k} onClick={() => toggleF(k)}>
                  <input type="checkbox" className="fchk" checked={!!flags[k]} readOnly />
                  <span className="flbl">{l}</span>
                </div>
              ))}
            </div>
            {dirty && <button className="btn btn-o btn-sm" style={{width:"100%"}} onClick={() => {setCats([]);setBudgets([]);setFlags({inStock:false,isNew:false,isBest:false});}}>リセット</button>}
          </aside>
          <div>
            {filtered.length === 0
              ? <div className="empty"><div className="empty-t">該当商品がありません</div><p style={{fontSize:".79rem",color:"#9B9793"}}>条件を変えてお試しください</p></div>
              : <div className="pg">{filtered.map(p => <ProductCard key={p.id} product={p} categories={categories} onClick={prod => nav("product-detail",{product:prod})} />)}</div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// ── FILTERED PAGE (New / Best) ──
function FilteredPage({ products, categories, nav, title, label }) {
  return (
    <div className="pe">
      <div style={{background:"#F5F2ED",padding:"3rem 2rem 2rem",borderBottom:"1px solid #E8E4DE"}}>
        <div style={{maxWidth:"1400px",margin:"0 auto"}}>
          <div className="sl">{label}</div>
          <h1 className="fd" style={{fontSize:"2.5rem",fontWeight:300}}>{title}</h1>
          <div style={{fontSize:".73rem",color:"#9B9793",marginTop:".4rem"}}>{products.length}件</div>
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
      <div className="sec" style={{paddingTop:"2rem"}}>
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
                  <Placeholder color={product.color} style={{opacity:i===0?1:0.55,width:"100%",height:"100%"}} />
                </div>
              ))}
            </div>
          </div>
          <div>
            {cat && <div style={{fontSize:".66rem",letterSpacing:".15em",color:"#9B9793",marginBottom:".72rem",textTransform:"uppercase"}}>{cat.name}</div>}
            <h1 className="pd-name">{product.name}</h1>
            <div className="pd-price">
              {product.sale_price
                ? <><span className="op" style={{fontSize:".9rem"}}>¥{product.price.toLocaleString()}</span> <span className="sp">¥{product.sale_price.toLocaleString()}</span></>
                : <span>¥{product.price.toLocaleString()}</span>}
              <span style={{fontSize:".68rem",color:"#9B9793",marginLeft:".45rem"}}>（税込）</span>
            </div>
            <p className="pd-desc">{product.description}</p>
            <div className="specs">
              {[["素材",product.material],["サイズ",product.size],["重量",product.weight],["配送目安","2〜4営業日"]].map(([k,v]) => (
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
              <button className="btn btn-o btn-w" disabled style={{cursor:"not-allowed",opacity:.5}}>在庫切れ</button>
            )}
            <div style={{marginTop:"1rem"}}>
              {product.tags.map(t => <span className="chip" key={t}>{t}</span>)}
            </div>
          </div>
        </div>

        {related.length > 0 && <>
          <hr className="divider" />
          <div className="sl">Related</div>
          <h2 className="fd" style={{fontSize:"1.8rem",fontWeight:300,marginBottom:"2rem"}}>関連商品</h2>
          <div className="rel-grid">
            {related.map(p => <ProductCard key={p.id} product={p} categories={categories} onClick={prod => nav("product-detail",{product:prod})} />)}
          </div>
        </>}
      </div>

      {product.stock_quantity > 0 && (
        <div className="mb-bar">
          <button className="btn btn-p btn-w" onClick={() => addToCart(product,1)}>カートに入れる — ¥{product.price.toLocaleString()}</button>
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
      <div className="sec" style={{textAlign:"center",paddingTop:"5rem"}}>
        <div className="fd" style={{fontSize:"2rem",fontWeight:300,marginBottom:"1rem"}}>カートは空です</div>
        <p style={{color:"#9B9793",fontSize:".81rem",marginBottom:"2rem"}}>商品をカートに追加してください</p>
        <button className="btn btn-p" onClick={() => nav("products")}>ショッピングを続ける</button>
      </div>
    </div>
  );

  return (
    <div className="pe">
      <div style={{background:"#F5F2ED",padding:"2.5rem 2rem",borderBottom:"1px solid #E8E4DE"}}>
        <div style={{maxWidth:"1400px",margin:"0 auto"}}>
          <h1 className="fd" style={{fontSize:"2.2rem",fontWeight:300}}>カート</h1>
          <div style={{fontSize:".73rem",color:"#9B9793"}}>{cart.reduce((s,i)=>s+i.qty,0)} 点</div>
        </div>
      </div>
      <div className="sec">
        <div className="cart-lay">
          <div>
            {cart.map(item => (
              <div className="ci" key={item.id}>
                <div style={{aspectRatio:"3/4",overflow:"hidden"}}><Placeholder color={item.color} style={{width:"100%",height:"100%"}} /></div>
                <div>
                  <div className="ci-name">{item.name}</div>
                  <div className="ci-price">¥{(item.sale_price||item.price).toLocaleString()}</div>
                  <div style={{display:"flex",alignItems:"center",gap:".72rem",marginTop:".5rem"}}>
                    <button className="qb" style={{width:"26px",height:"26px"}} onClick={() => updQty(item.id,-1)}>−</button>
                    <span style={{fontSize:".83rem",minWidth:"1.4rem",textAlign:"center"}}>{item.qty}</span>
                    <button className="qb" style={{width:"26px",height:"26px"}} onClick={() => updQty(item.id,1)}>＋</button>
                  </div>
                  <button className="ci-rm" onClick={() => rm(item.id)}>削除</button>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="os">
              <div style={{fontSize:".7rem",letterSpacing:".15em",textTransform:"uppercase",color:"#9B9793",marginBottom:"1.5rem"}}>Order Summary</div>
              <div className="os-row"><span>小計</span><span>¥{sub.toLocaleString()}</span></div>
              <div className="os-row"><span>送料</span><span>{ship===0?"無料":`¥${ship.toLocaleString()}`}</span></div>
              {sub < settings.freeShippingLine && (
                <div style={{fontSize:".7rem",color:"#9B9793",marginBottom:".72rem"}}>あと¥{(settings.freeShippingLine-sub).toLocaleString()}で送料無料</div>
              )}
              <div className="os-total"><span>合計（税込）</span><span>¥{total.toLocaleString()}</span></div>
              <button className="btn btn-p btn-w" style={{marginTop:"1.5rem"}}>ご購入手続きへ</button>
              <button className="btn btn-o btn-w" style={{marginTop:".72rem"}} onClick={() => nav("products")}>買い物を続ける</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ABOUT PAGE ──
function AboutPage() {
  return (
    <div className="pe">
      <div style={{background:"#F5F2ED",padding:"5rem 2rem",textAlign:"center",borderBottom:"1px solid #E8E4DE"}}>
        <div className="sl">About</div>
        <h1 className="fd" style={{fontSize:"clamp(2rem,5vw,3.5rem)",fontWeight:300}}>私たちについて</h1>
      </div>
      <div className="sec" style={{maxWidth:"720px",margin:"0 auto"}}>
        {["SŌGUは、日常の中にある静かな豊かさを大切にしたいという想いから生まれたセレクトショップです。","私たちが選ぶのは「長く使えるもの」だけです。素材の良さ、つくり手の誠実さ、使うたびに増す愛着──そんな基準で丁寧にセレクトしています。","流行に左右されず、本質的に良いものを。毎日の暮らしに溶け込み、時間とともに深まる道具たちを届けることが、私たちの仕事です。"].map((t,i) => (
          <p key={i} style={{fontSize:".84rem",lineHeight:2.1,color:"#6B6760",marginBottom:"2rem"}}>{t}</p>
        ))}
      </div>
    </div>
  );
}

// ── ADMIN ──
function AdminPage({ categories, setCategories, products, setProducts, settings, setSettings, nav, adminPage, setAdminPage }) {
  const [editProd, setEditProd] = useState(null);
  const [editCat, setEditCat] = useState(null);

  const navItems = [
    {key:"dashboard",label:"ダッシュボード",icon:"📊"},
    {key:"products",label:"商品管理",icon:"📦"},
    {key:"categories",label:"カテゴリ管理",icon:"🗂"},
    {key:"orders",label:"注文管理",icon:"📋"},
    {key:"settings",label:"サイト設定",icon:"⚙️"},
  ];

  return (
    <div className="adm pe">
      <aside className="adm-side">
        <div className="adm-logo">SKD SELECT Admin</div>
        {navItems.map(item => (
          <div key={item.key} className={`adm-ni ${adminPage===item.key?"on":""}`} onClick={() => {setAdminPage(item.key);setEditProd(null);setEditCat(null);}}>
            <span>{item.icon}</span>{item.label}
          </div>
        ))}
        <div style={{borderTop:"1px solid #3a3a38",marginTop:"1rem",paddingTop:"1rem"}}>
          <div className="adm-ni" onClick={() => nav("home")}><span>🏪</span>サイトを見る</div>
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
  const newC = products.filter(p=>p.is_new).length;
  const bestC = products.filter(p=>p.is_best_seller).length;
  return (
    <div>
      <div className="adm-title">ダッシュボード</div>
      <div className="adm-sub">ショップの概要</div>
      <div className="stat-grid">
        {[["本日の注文数","—","件"],["今月の売上","—","円"],["在庫切れ商品",oos,"件"],["公開中の商品",pub,"件"]].map(([l,v,u]) => (
          <div className="stat" key={l}><div className="stat-l">{l}</div><div className="stat-v">{v} <span className="stat-u">{u}</span></div></div>
        ))}
      </div>
      <div className="panel">
        <div className="panel-t">クイックリンク</div>
        <div style={{display:"flex",gap:".72rem",flexWrap:"wrap"}}>
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
    budget_range:"〜3,000円",material:"",size:"",weight:"",color:"#E8E0D8",tags:[],
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
          {[["素材","material"],["サイズ","size"],["重量","weight"]].map(([l,k]) => (
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
              <div key={cat.id} onClick={() => setForm(f=>({...f,category_ids:on?f.category_ids.filter(id=>id!==cat.id):[...f.category_ids,cat.id]}))}
                style={{padding:".4rem .8rem",border:`1px solid ${on?"#1C1C1A":"#E8E4DE"}`,background:on?"#1C1C1A":"transparent",color:on?"#FAFAF7":"#6B6760",cursor:"pointer",fontSize:".75rem",transition:"all .15s"}}>
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
              <span style={{fontSize:".81rem"}}>{l}</span>
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
                    <div style={{display:"flex",gap:".5rem",alignItems:"center"}}>
                      <div style={{width:28,height:36,background:p.color,flexShrink:0}} />
                      <div>
                        <div style={{fontWeight:500,color:"#1C1C1A",fontSize:".81rem"}}>{p.name}</div>
                        <div style={{display:"flex",gap:".25rem",marginTop:".18rem"}}>
                          {p.is_new && <span className="sb sb-new">NEW</span>}
                          {p.is_best_seller && <span className="sb sb-on">BEST</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>¥{p.price.toLocaleString()}{p.sale_price&&<span style={{color:"#8B3A3A",marginLeft:".38rem",fontSize:".73rem"}}>→¥{p.sale_price.toLocaleString()}</span>}</td>
                  <td style={{fontSize:".77rem"}}>{cat?.name||"—"}</td>
                  <td style={{color:p.stock_quantity===0?"#8B3A3A":"inherit"}}>{p.stock_quantity===0?"在庫切れ":`${p.stock_quantity}個`}</td>
                  <td>
                    <button className={`sb ${p.is_published?"sb-on":"sb-off"}`} style={{cursor:"pointer",background:"none",border:"1px solid currentColor",padding:".18rem .55rem"}} onClick={() => togglePub(p.id)}>
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
      <div className="panel" style={{maxWidth:"580px"}}>
        <div className="panel-t">カテゴリ情報</div>
        {[["カテゴリ名 *","name"],["スラッグ","slug"],["説明文","description"]].map(([l,k]) => (
          <div className="fg3" key={k}>
            <label className="fl">{l}</label>
            {k==="description"
              ? <textarea className="txta" value={form[k]||""} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} />
              : <input type="text" className="inp" value={form[k]||""} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} />}
          </div>
        ))}
        <div className="fg3">
          <label className="fl">表示順</label>
          <input type="number" className="inp" style={{maxWidth:"90px"}} value={form.display_order||0} onChange={e=>setForm(f=>({...f,display_order:Number(e.target.value)}))} />
        </div>
        <div className="opt-row">
          <span style={{fontSize:".81rem"}}>公開状態</span>
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
      <div style={{display:"flex",flexDirection:"column",gap:".72rem",maxWidth:"750px"}}>
        {[...categories].sort((a,b)=>a.display_order-b.display_order).map(cat => (
          <div key={cat.id} className="panel" style={{padding:"1.2rem 1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:0}}>
            <div style={{display:"flex",alignItems:"center",gap:"1.5rem",flex:1}}>
              <div style={{fontSize:".68rem",color:"#9B9793",minWidth:"1.8rem",textAlign:"center"}}>#{cat.display_order}</div>
              <div>
                <div style={{fontWeight:500,fontSize:".88rem"}}>{cat.name}</div>
                <div style={{fontSize:".7rem",color:"#9B9793"}}>/{cat.slug}</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
              <button className={`sb ${cat.is_active?"sb-on":"sb-off"}`} style={{cursor:"pointer",background:"none",border:"1px solid currentColor",padding:".22rem .7rem"}} onClick={() => toggleActive(cat.id)}>
                {cat.is_active?"公開中":"非公開"}
              </button>
              <button className="btn btn-o btn-sm" onClick={() => openEdit(cat)}>編集</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{marginTop:"1.5rem",padding:"1rem 1.5rem",background:"#F5F2ED",fontSize:".77rem",color:"#6B6760",border:"1px solid #E8E4DE",maxWidth:"750px"}}>
        カテゴリ名・スラッグ・説明文・表示順・公開状態を「編集」から変更できます。変更はフロントに即座に反映されます。
      </div>
    </div>
  );
}

function AdminOrders() {
  const orders = [
    {id:"ORD-001",date:"2025-06-01 14:32",customer:"田中 様",total:8800,status:"発送済み"},
    {id:"ORD-002",date:"2025-06-01 11:15",customer:"鈴木 様",total:4500,status:"準備中"},
    {id:"ORD-003",date:"2025-05-31 18:44",customer:"山田 様",total:12000,status:"発送済み"},
    {id:"ORD-004",date:"2025-05-31 09:20",customer:"佐藤 様",total:3200,status:"完了"},
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
                <td style={{fontFamily:"monospace",fontSize:".79rem"}}>{o.id}</td>
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
      <div className="panel" style={{maxWidth:"680px"}}>
        <div className="panel-t">基本情報</div>
        {[["ショップ名","shopName"],["メインコピー","mainCopy"],["サブコピー","subCopy"],["お問い合わせメールアドレス","contactEmail"]].map(([l,k]) => (
          <div className="fg3" key={k}>
            <label className="fl">{l}</label>
            <input type="text" className="inp" value={form[k]||""} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} />
          </div>
        ))}
      </div>
      <div className="panel" style={{maxWidth:"680px"}}>
        <div className="panel-t">配送料金</div>
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
        {saved && <span style={{fontSize:".77rem",color:"#3A6B3A"}}>✓ 保存しました</span>}
      </div>
    </div>
  );
}
