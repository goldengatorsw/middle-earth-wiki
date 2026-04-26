import { useState } from "react";
import data from "./campaign-data.json";

// ---------- Theme ----------
const C = {
  bg: "#0d0b08", s1: "#191410", s2: "#222018", s3: "#2c2a1e",
  bd: "#383020", g: "#c8a44a", gl: "#e6cc84", gd: "#7a6030",
  tx: "#ede3cc", dm: "#9a8a6a", mt: "#5a4e38", re: "#8b2828"
};

// ---------- Data (from campaign-data.json) ----------
const { meta: META, party: PARTY, npcs: NPCS, locations: LOCATIONS,
        sessions: SESSIONS, items: ITEMS, mysteries: MYSTERIES,
        funny: FUNNY, greatest: GREATEST } = data;

// ---------- Reusable bits ----------
function Cin({ ch, sz = 13, col, extra = {} }) {
  return <span style={{ fontFamily: "'Cinzel','Times New Roman',serif", fontSize: sz, color: col || C.gl, letterSpacing: "0.06em", ...extra }}>{ch}</span>;
}
function Badge({ label, col }) {
  return <span style={{ background: col + "22", color: col, border: `1px solid ${col}44`, borderRadius: 3, padding: "2px 8px", fontSize: 10, fontFamily: "'Cinzel',serif", letterSpacing: "0.06em" }}>{label}</span>;
}
function SBadge({ s }) {
  if (s.includes("DECEASED")) return <Badge label="Deceased" col={C.re} />;
  if (s.includes("UNKNOWN")) return <Badge label="Unknown" col={C.gd} />;
  if (s.includes("HOSTILE")) return <Badge label="Hostile" col={C.re} />;
  return <Badge label="Alive" col="#4a8a46" />;
}
function Card({ children, onClick, extra = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.s2,
        border: `1px solid ${hov && onClick ? C.gd : C.bd}`,
        borderRadius: 8,
        padding: "13px 15px",
        cursor: onClick ? "pointer" : "default",
        transition: "border-color 0.15s",
        marginBottom: 10,
        ...extra
      }}
    >
      {children}
    </div>
  );
}
function Coll({ title, children, open: def = false }) {
  const [open, setOpen] = useState(def);
  return (
    <div style={{ borderTop: `1px solid ${C.bd}` }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", background: "none", border: "none", padding: "9px 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
      >
        <Cin ch={title} sz={11} col={C.gd} extra={{ letterSpacing: "0.1em" }} />
        <span style={{ color: C.gd, fontSize: 13 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ paddingBottom: 12, fontFamily: "'Crimson Text',serif", fontSize: 15, color: C.tx, lineHeight: 1.7 }}>
          {children}
        </div>
      )}
    </div>
  );
}
function Back({ onClick, label = "Back" }) {
  return (
    <button
      onClick={onClick}
      style={{ background: "none", border: `1px solid ${C.bd}`, color: C.dm, padding: "5px 13px", borderRadius: 5, cursor: "pointer", marginBottom: 14, fontFamily: "'Cinzel',serif", fontSize: 11, letterSpacing: "0.06em" }}
    >
      ← {label}
    </button>
  );
}
function PH({ title, sub }) {
  return (
    <div style={{ padding: "18px 16px 12px", borderBottom: `1px solid ${C.bd}`, marginBottom: 12 }}>
      <div style={{ fontFamily: "'Cinzel',serif", fontSize: 22, color: C.gl, letterSpacing: "0.07em" }}>{title}</div>
      {sub && <div style={{ color: C.dm, fontSize: 14, marginTop: 3, fontFamily: "'Crimson Text',serif" }}>{sub}</div>}
    </div>
  );
}
function PW({ children }) {
  return <div style={{ padding: "0 0 16px", maxWidth: 700, margin: "0 auto" }}>{children}</div>;
}
function txt(s, sz = 15, col) {
  return { fontFamily: "'Crimson Text',serif", fontSize: sz, color: col || C.tx, lineHeight: 1.7 };
}

// ---------- Pages ----------
function Home({ go }) {
  return (
    <PW>
      <PH title={META.campaignName} sub={`Campaign Wiki — Through ${META.lastSession}`} />
      <div style={{ padding: "0 16px" }}>
        <Card extra={{ background: "#1e3a5a33", border: `1px solid #2a5a8a44`, marginBottom: 12 }}>
          <Cin ch="CURRENT STATUS" sz={10} col={C.gd} extra={{ letterSpacing: "0.12em", display: "block", marginBottom: 6 }} />
          <div style={txt(15, 15, C.gl)}>{META.currentStatus}</div>
        </Card>
        <Card extra={{ background: "#3a280033", border: `1px solid ${C.g}33`, marginBottom: 12 }}>
          <Cin ch="PRIMARY MISSION" sz={10} col={C.gd} extra={{ letterSpacing: "0.12em", display: "block", marginBottom: 6 }} />
          <div style={txt(15)}>{META.primaryMission}</div>
        </Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9, marginBottom: 14 }}>
          {[
            ["Party", `${PARTY.length} adventurers`, "party"],
            ["NPCs", "Who you've met", "npcs"],
            ["Locations", "Places visited", "locations"],
            ["Sessions", `${SESSIONS.length} logged`, "sessions"],
            ["Items", "Notable gear", "items"],
            ["Mysteries", "Open questions", "mysteries"]
          ].map(([t, s, p]) => (
            <Card key={p} onClick={() => go(p)} extra={{ textAlign: "center", padding: "10px 6px" }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 13, color: C.gl, marginBottom: 2 }}>{t}</div>
              <div style={{ color: C.dm, fontSize: 12, fontFamily: "'Crimson Text',serif" }}>{s}</div>
            </Card>
          ))}
        </div>
      </div>
    </PW>
  );
}

function Party() {
  const [sel, setSel] = useState(null);
  const c = sel ? PARTY.find(p => p.id === sel) : null;

  if (c) {
    return (
      <PW>
        <div style={{ padding: "16px 16px 0" }}><Back onClick={() => setSel(null)} label="Party" /></div>
        <div style={{ padding: "0 16px" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 36 }}>{c.emoji}</div>
            <div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, color: C.gl }}>{c.name}</div>
              <div style={{ color: C.dm, fontSize: 13, fontFamily: "'Crimson Text',serif" }}>{c.player} · {c.race}</div>
            </div>
          </div>
          <Card extra={{ marginBottom: 10 }}>
            <div style={{ ...txt(15, 15, C.gl), fontStyle: "italic", marginBottom: 8 }}>"{c.tag}"</div>
            <div style={txt()}>{c.bio}</div>
          </Card>
          <Coll title="KEY FACTS" open>
            <ul style={{ paddingLeft: 18 }}>{c.facts.map((f, i) => <li key={i} style={{ marginBottom: 5 }}>{f}</li>)}</ul>
          </Coll>
          <Coll title="FUNNY MOMENTS">
            <ul style={{ paddingLeft: 18 }}>{c.funny.map((f, i) => <li key={i} style={{ marginBottom: 5 }}>{f}</li>)}</ul>
          </Coll>
          <Coll title="CHARACTER ARC"><div>{c.arc}</div></Coll>
        </div>
      </PW>
    );
  }

  return (
    <PW>
      <PH title="The Party" sub={`${PARTY.length} adventurers on an increasingly dangerous road`} />
      <div style={{ padding: "0 16px" }}>
        {PARTY.map(p => (
          <Card key={p.id} onClick={() => setSel(p.id)}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 28 }}>{p.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: 14, color: C.gl }}>{p.name}</div>
                <div style={{ color: C.dm, fontSize: 13, fontFamily: "'Crimson Text',serif" }}>{p.player} · {p.race}</div>
                <div style={{ fontFamily: "'Crimson Text',serif", fontSize: 14, color: C.tx, marginTop: 3, fontStyle: "italic" }}>{p.tag}</div>
              </div>
              <span style={{ color: C.gd, fontSize: 20 }}>›</span>
            </div>
          </Card>
        ))}
      </div>
    </PW>
  );
}

function Npcs() {
  const [sel, setSel] = useState(null);
  const n = sel ? NPCS.find(x => x.id === sel) : null;

  if (n) {
    return (
      <PW>
        <div style={{ padding: "16px 16px 0" }}><Back onClick={() => setSel(null)} label="NPCs" /></div>
        <div style={{ padding: "0 16px" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 30 }}>{n.emoji}</div>
            <div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, color: C.gl }}>{n.name}</div>
              <div style={{ color: C.dm, fontSize: 13, fontFamily: "'Crimson Text',serif" }}>{n.role}</div>
            </div>
          </div>
          <div style={{ marginBottom: 10 }}><SBadge s={n.status} /></div>
          <Card extra={{ marginBottom: 10 }}><div style={txt()}>{n.desc}</div></Card>
          <div style={{ color: C.dm, fontSize: 13, fontFamily: "'Crimson Text',serif" }}>
            Location: {n.loc} · First seen: {n.first}
          </div>
        </div>
      </PW>
    );
  }

  const grps = [
    ["Allies", x => x.status === "Alive" || x.status.includes("Safe")],
    ["Hostile", x => x.status.includes("HOSTILE")],
    ["Unknown Status", x => x.status.includes("UNKNOWN")],
    ["Deceased", x => x.status.includes("DECEASED")]
  ];

  return (
    <PW>
      <PH title="NPCs" sub="Everyone the party has encountered" />
      <div style={{ padding: "0 16px" }}>
        {grps.map(([label, filter]) => {
          const list = NPCS.filter(filter);
          if (!list.length) return null;
          return (
            <div key={label}>
              <Cin ch={label.toUpperCase()} sz={10} col={C.gd} extra={{ letterSpacing: "0.12em", display: "block", margin: "14px 0 8px" }} />
              {list.map(n => (
                <Card key={n.id} onClick={() => setSel(n.id)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontSize: 22 }}>{n.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Cinzel',serif", fontSize: 13, color: C.gl }}>{n.name}</div>
                      <div style={{ color: C.dm, fontSize: 12, fontFamily: "'Crimson Text',serif" }}>{n.role}</div>
                    </div>
                    <SBadge s={n.status} />
                  </div>
                </Card>
              ))}
            </div>
          );
        })}
      </div>
    </PW>
  );
}

function Locs() {
  const [sel, setSel] = useState(null);
  const loc = sel ? LOCATIONS.find(l => l.id === sel) : null;

  if (loc) {
    return (
      <PW>
        <div style={{ padding: "16px 16px 0" }}><Back onClick={() => setSel(null)} label="Locations" /></div>
        <div style={{ padding: "0 16px" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 30 }}>{loc.emoji}</div>
            <div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, color: C.gl }}>{loc.name}</div>
              <div style={{ color: C.dm, fontSize: 13, fontFamily: "'Crimson Text',serif" }}>{loc.status}</div>
            </div>
          </div>
          <Card extra={{ marginBottom: 10 }}><div style={txt()}>{loc.desc}</div></Card>
          {loc.facts.map((f, i) => (
            <div key={i} style={{ fontFamily: "'Crimson Text',serif", fontSize: 15, color: C.tx, lineHeight: 1.6, marginBottom: 6, paddingLeft: 12, borderLeft: `2px solid ${C.gd}` }}>{f}</div>
          ))}
        </div>
      </PW>
    );
  }

  return (
    <PW>
      <PH title="Locations" sub="Places the party has been" />
      <div style={{ padding: "0 16px" }}>
        {LOCATIONS.map(l => (
          <Card key={l.id} onClick={() => setSel(l.id)}>
            <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
              <div style={{ fontSize: 26 }}>{l.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: 14, color: C.gl }}>{l.name}</div>
                <div style={{ color: l.status.includes("CURRENT") ? C.re : C.dm, fontSize: 12, fontFamily: "'Crimson Text',serif", marginBottom: 4 }}>{l.status}</div>
                <div style={{ fontFamily: "'Crimson Text',serif", fontSize: 14, color: C.tx, lineHeight: 1.6 }}>{l.desc.slice(0, 90)}…</div>
              </div>
              <span style={{ color: C.gd, fontSize: 20 }}>›</span>
            </div>
          </Card>
        ))}
      </div>
    </PW>
  );
}

function Sessions() {
  const [sel, setSel] = useState(null);
  const s = sel ? SESSIONS.find(x => x.num === sel) : null;

  if (s) {
    return (
      <PW>
        <div style={{ padding: "16px 16px 0" }}><Back onClick={() => setSel(null)} label="Sessions" /></div>
        <div style={{ padding: "0 16px" }}>
          <Cin ch={`SESSION ${s.num} · ${s.date}`} sz={11} col={C.gd} extra={{ letterSpacing: "0.1em", display: "block", marginBottom: 5 }} />
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 20, color: C.gl, marginBottom: 14 }}>{s.title}</div>
          <Card><div style={{ fontFamily: "'Crimson Text',serif", fontSize: 16, color: C.tx, lineHeight: 1.75 }}>{s.summary}</div></Card>
        </div>
      </PW>
    );
  }

  return (
    <PW>
      <PH title="Session Log" sub="Every session condensed — tap for full summary" />
      <div style={{ padding: "0 16px" }}>
        {SESSIONS.map(s => (
          <Card key={s.num} onClick={() => setSel(s.num)}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 11, color: C.gd, minWidth: 36, marginTop: 2, letterSpacing: "0.05em" }}>{s.num}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: 14, color: C.gl }}>{s.title}</div>
                <div style={{ color: C.dm, fontSize: 12, fontFamily: "'Crimson Text',serif", marginBottom: 4 }}>{s.date}</div>
                <div style={{ fontFamily: "'Crimson Text',serif", fontSize: 14, color: C.tx, lineHeight: 1.6 }}>{s.summary.slice(0, 100)}…</div>
              </div>
              <span style={{ color: C.gd, fontSize: 20 }}>›</span>
            </div>
          </Card>
        ))}
      </div>
    </PW>
  );
}

function Items() {
  return (
    <PW>
      <PH title="Items of Note" sub="Significant gear — who has it and what it does" />
      <div style={{ padding: "0 16px" }}>
        {ITEMS.map((it, i) => (
          <Card key={i}>
            <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
              <div style={{ fontSize: 28 }}>{it.emoji}</div>
              <div>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: 14, color: C.gl }}>{it.name}</div>
                <div style={{ color: it.hostile ? C.re : C.gd, fontSize: 12, fontFamily: "'Crimson Text',serif", marginBottom: 6 }}>Held by: {it.holder}</div>
                <div style={{ fontFamily: "'Crimson Text',serif", fontSize: 15, color: C.tx, lineHeight: 1.65, marginBottom: 6 }}>{it.desc}</div>
                {it.q && (
                  <div style={{ background: C.s3, borderRadius: 4, padding: "6px 10px", fontFamily: "'Crimson Text',serif", fontSize: 13, color: C.dm, fontStyle: "italic" }}>
                    ❓ {it.q}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PW>
  );
}

function Mysteries() {
  return (
    <PW>
      <PH title="Open Mysteries" sub="Questions the party hasn't answered yet" />
      <div style={{ padding: "0 16px" }}>
        {MYSTERIES.map((m, i) => (
          <Card key={i}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 20, color: C.gd, minWidth: 24 }}>{i + 1}</div>
              <div style={{ fontFamily: "'Crimson Text',serif", fontSize: 15, color: C.tx, lineHeight: 1.7 }}>{m}</div>
            </div>
          </Card>
        ))}
      </div>
    </PW>
  );
}

function Moments() {
  const [tab, setTab] = useState("epic");
  const list = tab === "epic" ? GREATEST : FUNNY;
  return (
    <PW>
      <PH title="Moments" sub="The plays that defined the campaign" />
      <div style={{ padding: "0 16px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[["epic", "Epic Moments"], ["funny", "Funny Moments"]].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                flex: 1,
                background: tab === id ? C.gd : C.s2,
                border: `1px solid ${tab === id ? C.gd : C.bd}`,
                color: tab === id ? C.bg : C.dm,
                padding: "8px",
                borderRadius: 6,
                cursor: "pointer",
                fontFamily: "'Cinzel',serif",
                fontSize: 11,
                letterSpacing: "0.06em"
              }}
            >
              {label}
            </button>
          ))}
        </div>
        {list.map((m, i) => (
          <Card key={i}>
            <Cin ch={`${m.who} · Session ${m.s}`} sz={11} col={tab === "epic" ? C.g : C.dm} extra={{ display: "block", marginBottom: 5 }} />
            <div style={{ fontFamily: "'Crimson Text',serif", fontSize: 15, color: C.tx, lineHeight: 1.7 }}>{m.t}</div>
          </Card>
        ))}
      </div>
    </PW>
  );
}

// ---------- Navigation ----------
const TABS = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "party", label: "Party", icon: "⚔️" },
  { id: "world", label: "World", icon: "🌍" },
  { id: "sessions", label: "Sessions", icon: "📖" },
  { id: "more", label: "More", icon: "✦" }
];
const MORE = [
  { id: "items", label: "Items", icon: "💎" },
  { id: "mysteries", label: "Mysteries", icon: "❓" },
  { id: "moments", label: "Moments", icon: "⭐" }
];

export default function App() {
  const [page, setPage] = useState("home");
  const [more, setMore] = useState(false);
  const [worldTab, setWorldTab] = useState("npcs");

  const go = p => { setPage(p); setMore(false); };

  const renderPage = () => {
    if (page === "home") return <Home go={go} />;
    if (page === "party") return <Party />;
    if (page === "world") return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 8, padding: "12px 16px 0", flexShrink: 0 }}>
          {[["npcs", "NPCs"], ["locations", "Locations"]].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setWorldTab(id)}
              style={{
                flex: 1,
                background: worldTab === id ? C.gd : C.s2,
                border: `1px solid ${worldTab === id ? C.gd : C.bd}`,
                color: worldTab === id ? C.bg : C.dm,
                padding: 8,
                borderRadius: 6,
                cursor: "pointer",
                fontFamily: "'Cinzel',serif",
                fontSize: 12,
                letterSpacing: "0.05em"
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>{worldTab === "npcs" ? <Npcs /> : <Locs />}</div>
      </div>
    );
    if (page === "sessions") return <Sessions />;
    if (page === "items") return <Items />;
    if (page === "mysteries") return <Mysteries />;
    if (page === "moments") return <Moments />;
    return <Home go={go} />;
  };

  return (
    <div style={{ background: C.bg, color: C.tx, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
      {more && (
        <div style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: C.s1, borderTop: `1px solid ${C.bd}`, padding: "12px 16px", zIndex: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9 }}>
            {MORE.map(m => (
              <button
                key={m.id}
                onClick={() => go(m.id)}
                style={{
                  background: C.s2,
                  border: `1px solid ${C.bd}`,
                  color: C.gl,
                  padding: "11px 10px",
                  borderRadius: 7,
                  cursor: "pointer",
                  fontFamily: "'Cinzel',serif",
                  fontSize: 12,
                  letterSpacing: "0.05em",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
              >
                <span style={{ fontSize: 16 }}>{m.icon}</span>{m.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <div style={{ flex: 1, overflowY: "auto" }}>{renderPage()}</div>
      <nav style={{ height: 60, background: C.s1, borderTop: `1px solid ${C.bd}`, display: "flex", flexShrink: 0 }}>
        {TABS.map(t => {
          const active = t.id === "more" ? more : (page === t.id && !more);
          return (
            <button
              key={t.id}
              onClick={() => t.id === "more" ? setMore(!more) : go(t.id)}
              style={{
                flex: 1,
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                color: active ? C.gl : C.mt,
                borderTop: active ? `2px solid ${C.g}` : "2px solid transparent",
                transition: "all 0.15s"
              }}
            >
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              <span style={{ fontFamily: "'Cinzel',serif", fontSize: 9, letterSpacing: "0.05em" }}>{t.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
