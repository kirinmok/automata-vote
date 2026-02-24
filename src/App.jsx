import { useState, useEffect, useRef } from "react";

const DEMO_WORKS = [
  { id: "d1", name: "林同學", title: "阿里山小火車穿山洞", description: "用偏心圓凸輪讓火車做往復運動，穿過用瓦楞紙板做的山洞，每次轉一圈就像火車進站出站。底盤用木板，山洞和車廂用回收材料。", theme: "阿里山鐵路", cam: "偏心圓", motion: "往復運動", votes: 7, image: "" },
  { id: "d2", name: "陳同學", title: "火雞肉飯老闆剁肉", description: "蝸牛形凸輪讓刀子快起慢落，模仿老師傅剁肉的節奏。角色用超輕土捏出老闆的手勢，寶特瓶蓋當砧板。", theme: "嘉義美食", cam: "蝸牛形", motion: "重複敲擊", votes: 12, image: "" },
  { id: "d3", name: "黃同學", title: "八掌溪白鷺鷥捕魚", description: "橢圓形凸輪讓鳥頭做弧線下擺的動作，像真的在捕魚。鳥的身體用金屬絲彎出來，翅膀用衛生紙黏塑形。", theme: "嘉義生態", cam: "橢圓形", motion: "弧線擺動", votes: 9, image: "" },
];

const THEMES  = ["阿里山鐵路", "嘉義美食", "嘉義生態", "嘉義職人", "嘉義地景", "其他"];
const CAMS    = ["偏心圓", "蝸牛形", "橢圓形", "自製形狀"];
const MOTIONS = ["往復運動", "弧線擺動", "重複敲擊", "旋轉運動", "其他"];

const EMOJI = { "阿里山鐵路":"🚂","嘉義美食":"🍗","嘉義生態":"🦢","嘉義職人":"🪵","嘉義地景":"🏔️","其他":"⚙️" };

const LS_WORKS = "automata_works_v2";
const LS_VOTED = "automata_voted_v2";
function lsGet(k){ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):null; }catch{ return null; } }
function lsSet(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch{} }

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;400;600;700&family=DM+Mono:wght@400;500&display=swap');
  :root {
    --bg:#F7F3EE; --surface:#FDFAF7; --border:#E2D9CE; --border2:#C8BDB0;
    --wood:#A67C52; --wood-dark:#7A5533; --wood-pale:#D4B896;
    --ink:#2C1F0E; --ink2:#6B5240; --ink3:#A08870;
    --accent:#5C8A6E; --accent-bg:#EBF3EE; --tag-bg:#EDE8E1; --warm:#C17E3A;
  }
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);}
  .app{min-height:100vh;background:var(--bg);font-family:'Noto Serif TC',serif;color:var(--ink);}

  /* header */
  .header{background:var(--surface);border-bottom:1px solid var(--border);padding:0 32px;display:flex;align-items:center;justify-content:space-between;height:54px;position:sticky;top:0;z-index:50;}
  .logo{font-size:13px;font-weight:600;letter-spacing:.06em;color:var(--wood-dark);display:flex;align-items:center;gap:8px;}
  .logo-mark{width:20px;height:20px;border:2px solid var(--wood);border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--wood);font-weight:700;}
  .header-right{font-family:'DM Mono',monospace;font-size:11px;color:var(--ink3);}

  /* hero */
  .hero{padding:52px 40px 36px;max-width:960px;margin:0 auto;display:grid;grid-template-columns:1fr 160px;align-items:start;gap:40px;border-bottom:1px solid var(--border);}
  .hero-eyebrow{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--wood);margin-bottom:16px;display:flex;align-items:center;gap:12px;}
  .hero-eyebrow::after{content:'';flex:1;height:1px;background:var(--border);max-width:80px;}
  .hero h1{font-size:clamp(28px,3.5vw,42px);font-weight:700;line-height:1.2;letter-spacing:.02em;}
  .hero h1 span{color:var(--wood);}
  .hero-desc{font-size:14px;color:var(--ink3);margin-top:12px;font-weight:300;line-height:1.8;}
  .stat-col{display:flex;flex-direction:column;gap:12px;padding-top:8px;}
  .stat-card{background:var(--surface);border:1px solid var(--border);padding:16px 18px;text-align:center;}
  .stat-n{font-family:'DM Mono',monospace;font-size:32px;color:var(--wood);line-height:1;}
  .stat-l{font-size:11px;color:var(--ink3);margin-top:5px;letter-spacing:.06em;}

  /* tabs */
  .tabs{display:flex;padding:0 40px;max-width:960px;margin:0 auto;border-bottom:1px solid var(--border);}
  .tab{font-family:'DM Mono',monospace;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;padding:15px 18px;background:none;border:none;color:var(--ink3);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:color .18s,border-color .18s;}
  .tab.active{color:var(--wood-dark);border-bottom-color:var(--wood);}
  .tab:hover:not(.active){color:var(--ink2);}

  /* gallery */
  .gallery{max-width:960px;margin:0 auto;padding:28px 40px;display:grid;grid-template-columns:repeat(auto-fill,minmax(268px,1fr));gap:14px;}
  .card{background:var(--surface);border:1px solid var(--border);overflow:hidden;transition:transform .2s,box-shadow .2s,border-color .2s;animation:rise .35s ease both;}
  @keyframes rise{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
  .card:hover{transform:translateY(-3px);box-shadow:0 6px 24px rgba(122,85,51,.1);border-color:var(--wood-pale);}
  .card-thumb{height:150px;background:var(--tag-bg);display:flex;align-items:center;justify-content:center;font-size:52px;position:relative;border-bottom:1px solid var(--border);overflow:hidden;}
  .card-thumb img{width:100%;height:100%;object-fit:cover;}
  .rank-pip{position:absolute;top:10px;left:10px;font-family:'DM Mono',monospace;font-size:9px;padding:3px 8px;background:var(--surface);border:1px solid var(--border2);color:var(--wood-dark);letter-spacing:.04em;}
  .card-body{padding:16px 18px;}
  .card-title{font-size:15.5px;font-weight:600;line-height:1.4;margin-bottom:3px;}
  .card-by{font-family:'DM Mono',monospace;font-size:10px;color:var(--ink3);margin-bottom:11px;}
  .tags{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:11px;}
  .tag{font-family:'DM Mono',monospace;font-size:9.5px;padding:3px 8px;background:var(--tag-bg);color:var(--ink2);border-radius:2px;}
  .card-desc{font-size:12px;color:var(--ink2);line-height:1.8;margin-bottom:15px;font-weight:300;}
  .vote-row{display:flex;align-items:center;justify-content:space-between;padding-top:13px;border-top:1px solid var(--border);}
  .vnum{font-family:'DM Mono',monospace;font-size:22px;color:var(--wood);line-height:1;}
  .vunit{font-size:10px;color:var(--ink3);margin-top:3px;}
  .vote-btn{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;padding:9px 16px;background:none;border:1px solid var(--wood);color:var(--wood);cursor:pointer;border-radius:2px;transition:all .16s;}
  .vote-btn:hover:not(:disabled){background:var(--wood);color:white;}
  .vote-btn.voted{background:var(--accent-bg);border-color:var(--accent);color:var(--accent);cursor:default;}
  .vote-btn:disabled:not(.voted){border-color:var(--border);color:var(--ink3);cursor:default;}

  /* leaderboard */
  .board{max-width:680px;margin:0 auto;padding:32px 40px;}
  .section-head{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink3);padding-bottom:14px;border-bottom:1px solid var(--border);}
  .lb-row{display:flex;align-items:center;gap:14px;padding:15px 0;border-bottom:1px solid var(--border);animation:rise .3s ease both;}
  .lb-rank{font-family:'DM Mono',monospace;font-size:18px;width:32px;text-align:center;flex-shrink:0;color:var(--wood-pale);}
  .lb-rank.top{color:var(--warm);}
  .lb-info{flex:1;}
  .lb-name{font-size:15px;font-weight:600;}
  .lb-meta{font-family:'DM Mono',monospace;font-size:10px;color:var(--ink3);margin-top:3px;}
  .lb-bar{height:2px;background:var(--border);margin-top:8px;border-radius:1px;overflow:hidden;}
  .lb-fill{height:100%;background:linear-gradient(90deg,var(--wood-pale),var(--wood));border-radius:1px;transition:width .6s ease;}
  .lb-votes{font-family:'DM Mono',monospace;font-size:24px;color:var(--wood);min-width:36px;text-align:right;flex-shrink:0;}

  /* submit */
  .submit{max-width:560px;margin:0 auto;padding:32px 40px;}
  .submit-head{margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid var(--border);}
  .submit-head h2{font-size:20px;font-weight:600;margin-bottom:5px;}
  .submit-head p{font-family:'DM Mono',monospace;font-size:11px;color:var(--ink3);line-height:1.7;}
  .field{margin-bottom:15px;}
  .field label{display:block;font-family:'DM Mono',monospace;font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink2);margin-bottom:7px;}
  .field input,.field textarea,.field select{width:100%;background:var(--surface);border:1px solid var(--border);color:var(--ink);padding:10px 13px;font-family:'Noto Serif TC',serif;font-size:14px;outline:none;border-radius:2px;transition:border-color .16s;resize:vertical;appearance:none;}
  .field select{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23A08870' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px;cursor:pointer;}
  .field input:focus,.field textarea:focus,.field select:focus{border-color:var(--wood);}
  .field input::placeholder,.field textarea::placeholder{color:var(--ink3);font-weight:300;}

  /* image upload */
  .upload-zone{border:2px dashed var(--border2);border-radius:4px;padding:24px;text-align:center;cursor:pointer;transition:border-color .18s,background .18s;background:var(--surface);}
  .upload-zone:hover,.upload-zone.drag{border-color:var(--wood);background:#FBF7F2;}
  .upload-zone input{display:none;}
  .upload-icon{font-size:32px;margin-bottom:8px;}
  .upload-hint{font-family:'DM Mono',monospace;font-size:11px;color:var(--ink3);line-height:1.6;}
  .upload-hint strong{color:var(--wood);}
  .preview-wrap{position:relative;margin-top:10px;}
  .preview-wrap img{width:100%;height:160px;object-fit:cover;border-radius:2px;border:1px solid var(--border);}
  .preview-remove{position:absolute;top:8px;right:8px;background:rgba(44,31,14,.7);color:white;border:none;border-radius:2px;padding:4px 10px;font-family:'DM Mono',monospace;font-size:10px;cursor:pointer;letter-spacing:.05em;}

  .submit-btn{width:100%;padding:13px;background:var(--wood);border:none;color:white;font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:background .16s;margin-top:6px;}
  .submit-btn:hover{background:var(--wood-dark);}
  .submit-btn:disabled{background:var(--border2);cursor:not-allowed;}

  /* notice */
  .notice{max-width:960px;margin:12px auto 0;padding:0 40px;}
  .notice-box{background:#FFF8EE;border:1px solid #E8D5B0;padding:10px 16px;font-family:'DM Mono',monospace;font-size:11px;color:var(--ink2);line-height:1.6;border-radius:2px;}

  /* toast */
  .toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(56px);background:var(--ink);color:var(--bg);font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.1em;padding:11px 22px;border-radius:2px;transition:transform .22s ease;z-index:200;white-space:nowrap;}
  .toast.show{transform:translateX(-50%) translateY(0);}
  .empty{grid-column:1/-1;text-align:center;padding:60px;font-family:'DM Mono',monospace;font-size:11px;color:var(--ink3);letter-spacing:.1em;}

  @media(max-width:640px){
    .hero{grid-template-columns:1fr;padding:32px 20px 24px;}
    .stat-col{display:none;}
    .tabs,.gallery,.board,.submit,.notice{padding-left:20px;padding-right:20px;}
  }
`;

// ── image → base64 ──
function fileToBase64(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = e => res(e.target.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

// ── Image Upload Zone component ──
function UploadZone({ value, onChange }) {
  const inputRef = useRef();
  const [drag, setDrag] = useState(false);

  async function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 3 * 1024 * 1024) { alert("圖片請勿超過 3MB"); return; }
    const b64 = await fileToBase64(file);
    onChange(b64);
  }

  return value ? (
    <div className="preview-wrap">
      <img src={value} alt="preview" />
      <button className="preview-remove" onClick={() => onChange("")}>✕ 移除</button>
    </div>
  ) : (
    <div
      className={`upload-zone ${drag ? "drag" : ""}`}
      onClick={() => inputRef.current.click()}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
    >
      <input ref={inputRef} type="file" accept="image/*" onChange={e => handleFile(e.target.files[0])} />
      <div className="upload-icon">📷</div>
      <div className="upload-hint">
        <strong>點擊上傳</strong>或拖曳圖片到這裡<br />
        支援 JPG、PNG，最大 3MB
      </div>
    </div>
  );
}

// ── Select component ──
function Select({ value, onChange, options, placeholder }) {
  return (
    <div className="field" style={{ marginBottom: 0 }}>
      <select value={value} onChange={e => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ── Main App ──
export default function App() {
  const [tab, setTab] = useState("gallery");
  const [works, setWorks] = useState([]);
  const [votedIds, setVotedIds] = useState(new Set());
  const [toast, setToast] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", title: "", theme: "", cam: "", motion: "", description: "", image: "" });

  useEffect(() => {
    const saved = lsGet(LS_WORKS);
    setWorks(saved ?? DEMO_WORKS);
    const voted = lsGet(LS_VOTED);
    if (voted) setVotedIds(new Set(voted));
  }, []);

  function msg(t) { setToast(t); setShowToast(true); setTimeout(() => setShowToast(false), 2200); }
  function setF(key, val) { setForm(f => ({ ...f, [key]: val })); }

  function vote(id) {
    if (votedIds.has(id)) return;
    const up = works.map(w => w.id === id ? { ...w, votes: w.votes + 1 } : w);
    const nv = new Set([...votedIds, id]);
    setWorks(up); setVotedIds(nv);
    lsSet(LS_WORKS, up); lsSet(LS_VOTED, [...nv]);
    msg("已投票 ✓");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.title || !form.description) { msg("請填寫必填欄位"); return; }
    setSubmitting(true);
    const w = { id: "w" + Date.now(), ...form, votes: 0 };
    const up = [...works, w];
    setWorks(up);
    lsSet(LS_WORKS, up);
    setForm({ name: "", title: "", theme: "", cam: "", motion: "", description: "", image: "" });
    setSubmitting(false);
    msg("上傳成功！");
    setTab("gallery");
  }

  const sorted = [...works].sort((a, b) => b.votes - a.votes);
  const maxV = sorted[0]?.votes || 1;
  const total = works.reduce((s, w) => s + w.votes, 0);

  return (
    <>
      <style>{css}</style>
      <div className="app">

        <header className="header">
          <div className="logo">
            <div className="logo-mark">木</div>
            大業實驗中學 STEAM
          </div>
          <div className="header-right">七年級下學期 · Automata 票選</div>
        </header>

        <div className="hero">
          <div>
            <div className="hero-eyebrow">木都嘉義 · 在地機械玩具設計</div>
            <h1>Automata<br /><span>作品票選展</span></h1>
            <p className="hero-desc">每一件作品都說著一個嘉義的故事。<br />選出你心目中最有嘉義味的設計。</p>
          </div>
          <div className="stat-col">
            <div className="stat-card">
              <div className="stat-n">{total}</div>
              <div className="stat-l">累計票數</div>
            </div>
            <div className="stat-card">
              <div className="stat-n">{works.length}</div>
              <div className="stat-l">件作品</div>
            </div>
          </div>
        </div>

        <div className="notice">
          <div className="notice-box">
            ⚠️ 作品資料存在這台電腦的瀏覽器。展示活動請使用同一台電腦，換裝置資料不會共用。
          </div>
        </div>

        <div className="tabs">
          {[["gallery","所有作品"],["board","排行榜"],["submit","上傳作品"]].map(([id, label]) => (
            <button key={id} className={`tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>

        {/* GALLERY */}
        {tab === "gallery" && (
          <div className="gallery">
            {works.length === 0 && <div className="empty">尚無作品，快去上傳</div>}
            {works.map((w, i) => (
              <div className="card" key={w.id} style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="card-thumb">
                  {w.image
                    ? <img src={w.image} alt={w.title} />
                    : <span>{EMOJI[w.theme] || "⚙️"}</span>
                  }
                  {i < 3 && <div className="rank-pip">No.{i + 1}</div>}
                </div>
                <div className="card-body">
                  <div className="card-title">{w.title}</div>
                  <div className="card-by">{w.name}</div>
                  <div className="tags">
                    {w.theme  && <span className="tag">{w.theme}</span>}
                    {w.cam    && <span className="tag">{w.cam} 凸輪</span>}
                    {w.motion && <span className="tag">{w.motion}</span>}
                  </div>
                  <p className="card-desc">{w.description}</p>
                  <div className="vote-row">
                    <div>
                      <div className="vnum">{w.votes}</div>
                      <div className="vunit">票</div>
                    </div>
                    <button className={`vote-btn ${votedIds.has(w.id) ? "voted" : ""}`} onClick={() => vote(w.id)} disabled={votedIds.has(w.id)}>
                      {votedIds.has(w.id) ? "已投票 ✓" : "投　票"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LEADERBOARD */}
        {tab === "board" && (
          <div className="board">
            <div className="section-head">票數排行 — {works.length} 件作品</div>
            {sorted.length === 0 && <div className="empty">尚無作品</div>}
            {sorted.map((w, i) => (
              <div className="lb-row" key={w.id} style={{ animationDelay: `${i * 0.04}s` }}>
                <div className={`lb-rank ${i < 3 ? "top" : ""}`}>{["🥇","🥈","🥉"][i] || i + 1}</div>
                <div className="lb-info">
                  <div className="lb-name">{w.title}</div>
                  <div className="lb-meta">{w.name} · {w.theme} · {w.cam} 凸輪</div>
                  <div className="lb-bar">
                    <div className="lb-fill" style={{ width: `${(w.votes / maxV) * 100}%` }} />
                  </div>
                </div>
                <div className="lb-votes">{w.votes}</div>
              </div>
            ))}
          </div>
        )}

        {/* SUBMIT */}
        {tab === "submit" && (
          <div className="submit">
            <div className="submit-head">
              <h2>上傳作品</h2>
              <p>填寫完成後立即出現在票選頁面。<br />說明要讓沒看過你作品的人也能理解。</p>
            </div>
            <form onSubmit={handleSubmit}>

              <div className="field">
                <label>姓名 *</label>
                <input value={form.name} onChange={e => setF("name", e.target.value)} placeholder="你的名字" />
              </div>

              <div className="field">
                <label>作品名稱 *</label>
                <input value={form.title} onChange={e => setF("title", e.target.value)} placeholder="例：阿里山小火車穿山洞" />
              </div>

              <div className="field">
                <label>嘉義主題</label>
                <select value={form.theme} onChange={e => setF("theme", e.target.value)}>
                  <option value="">請選擇主題…</option>
                  {THEMES.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>

              <div className="field">
                <label>凸輪形狀</label>
                <select value={form.cam} onChange={e => setF("cam", e.target.value)}>
                  <option value="">請選擇凸輪…</option>
                  {CAMS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>

              <div className="field">
                <label>動作類型</label>
                <select value={form.motion} onChange={e => setF("motion", e.target.value)}>
                  <option value="">請選擇動作…</option>
                  {MOTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>

              <div className="field">
                <label>設計說明 * （機構原理 + 嘉義故事）</label>
                <textarea value={form.description} onChange={e => setF("description", e.target.value)} placeholder="說明你的凸輪怎麼讓角色動起來，以及這個作品和嘉義的關係…" rows={5} />
              </div>

              <div className="field">
                <label>作品照片（選填）</label>
                <UploadZone value={form.image} onChange={v => setF("image", v)} />
              </div>

              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? "上傳中…" : "確認上傳"}
              </button>
            </form>
          </div>
        )}

        <div className={`toast ${showToast ? "show" : ""}`}>{toast}</div>
      </div>
    </>
  );
}
