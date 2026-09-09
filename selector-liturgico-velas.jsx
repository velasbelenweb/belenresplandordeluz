import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, ShoppingBag, X, Check, Loader2, Flame, MessageCircle } from "lucide-react";

/* ============================================================
   DATOS: árbol de decisión (ocasión -> intención -> producto)
   ------------------------------------------------------------
   En producción este árbol debe salir del catálogo real de
   belenresplandordeluz.com, etiquetado por ocasión/intención.
   Aquí se modela como estructura estática para que el flujo
   completo (pregunta -> recomendación -> compra) sea 100%
   funcional de punta a punta.
============================================================ */

const OCCASIONS = [
  {
    id: "difuntos",
    label: "Por el descanso de un difunto",
    hex: "#6B5B95",
    intentions: [
      {
        id: "reciente",
        label: "Por un fallecimiento reciente",
        product: "Vela de Descanso Eterno",
        symbol: "El morado acompaña el luto y sostiene la esperanza de la resurrección.",
      },
      {
        id: "aniversario",
        label: "En el aniversario de su partida",
        product: "Vela de Memoria y Descanso",
        symbol: "Para honrar, año a año, su recuerdo con una luz que no se apaga.",
      },
      {
        id: "fieles",
        label: "Por todos los fieles difuntos",
        product: "Vela de Fieles Difuntos",
        symbol: "La tradición de noviembre: una sola luz por todas las almas.",
      },
    ],
  },
  {
    id: "salud",
    label: "Por la salud de alguien",
    hex: "#D8CBB4",
    intentions: [
      {
        id: "propia",
        label: "Mi propia salud",
        product: "Vela a San Rafael Arcángel",
        symbol: "Patrono de la sanación; se enciende pidiendo por la propia recuperación.",
      },
      {
        id: "familiar",
        label: "La salud de un familiar",
        product: "Vela al Divino Niño de la Salud",
        symbol: "Devoción muy arraigada en Colombia para pedir por un ser querido enfermo.",
      },
      {
        id: "cirugia",
        label: "Antes o después de una cirugía",
        product: "Vela de Manos Seguras",
        symbol: "Se enciende la víspera, pidiendo acierto para quienes intervienen.",
      },
    ],
  },
  {
    id: "proteccion",
    label: "Protección del hogar o la familia",
    hex: "#9B3B3B",
    intentions: [
      {
        id: "mal",
        label: "Contra las malas energías",
        product: "Vela a San Miguel Arcángel",
        symbol: "El rojo invoca la fuerza que aparta lo que hace daño.",
      },
      {
        id: "paz",
        label: "Paz en el hogar",
        product: "Vela de la Sagrada Familia",
        symbol: "Para sostener la armonía cuando el hogar está en tensión.",
      },
      {
        id: "viaje",
        label: "Un viaje seguro",
        product: "Vela a San Cristóbal",
        symbol: "Patrono de los viajeros; se enciende antes de salir.",
      },
    ],
  },
  {
    id: "gracias",
    label: "Agradecimiento por un favor",
    hex: "#C89B5C",
    intentions: [
      {
        id: "favor",
        label: "Un favor recibido",
        product: "Vela de Acción de Gracias",
        symbol: "El dorado celebra un favor cumplido.",
      },
      {
        id: "nacimiento",
        label: "El nacimiento de un hijo",
        product: "Vela de Bienvenida y Bendición",
        symbol: "Para agradecer y bendecir una nueva vida en la familia.",
      },
      {
        id: "gracia",
        label: "Un aniversario de gracia",
        product: "Vela de Memoria Agradecida",
        symbol: "Para volver, cada año, al momento en que algo se cumplió.",
      },
    ],
  },
  {
    id: "virgen",
    label: "Una advocación de la Virgen María",
    hex: "#4E7A9B",
    intentions: [
      { id: "carmen", label: "Virgen del Carmen", product: "Vela a la Virgen del Carmen", symbol: "Patrona de quienes navegan momentos inciertos." },
      { id: "guadalupe", label: "Virgen de Guadalupe", product: "Vela a la Virgen de Guadalupe", symbol: "Madre de América, cercana en toda necesidad." },
      { id: "rosario", label: "Virgen del Rosario", product: "Vela a la Virgen del Rosario", symbol: "Compañera de quienes rezan el rosario en familia." },
      { id: "cualquiera", label: "No estoy segura, cualquiera está bien", product: "Vela Mariana Tradicional", symbol: "Una luz sencilla para encomendarse a la Virgen, sin advocación específica." },
    ],
  },
  {
    id: "trabajo",
    label: "Trabajo o prosperidad",
    hex: "#4C7A5B",
    intentions: [
      { id: "empleo", label: "Buscar empleo", product: "Vela a San Cayetano", symbol: "Patrono del pan y el trabajo diario." },
      { id: "negocio", label: "Un negocio o emprendimiento", product: "Vela de Prosperidad", symbol: "Para acompañar un proyecto que recién comienza." },
      { id: "estabilidad", label: "Estabilidad económica", product: "Vela de la Divina Providencia", symbol: "Se enciende pidiendo por lo que sostiene a una familia." },
    ],
  },
  {
    id: "santo",
    label: "Un santo específico",
    hex: "#8C8272",
    intentions: [
      { id: "judas", label: "San Judas Tadeo — causas difíciles", product: "Vela a San Judas Tadeo", symbol: "Se acude a él cuando ya no parece haber salida." },
      { id: "antonio", label: "San Antonio — encontrar algo o a alguien", product: "Vela a San Antonio de Padua", symbol: "Patrono de lo perdido: objetos, caminos, personas." },
      { id: "barbara", label: "Santa Bárbara — tormentas y protección", product: "Vela a Santa Bárbara", symbol: "Protectora ante el peligro repentino." },
      { id: "jose", label: "San José — familia y trabajo", product: "Vela a San José Obrero", symbol: "Custodio del hogar y del trabajo bien hecho." },
    ],
  },
];

const SIZES = [
  { id: "pequena", label: "Pequeña", desc: "10 cm · devoción diaria", price: 12000 },
  { id: "mediana", label: "Mediana", desc: "18 cm · pensada para novenas", price: 22000 },
  { id: "grande", label: "Grande", desc: "30 cm · dura los 9 días completos", price: 38000 },
];

const COP = (n) => n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const WHATSAPP_NUMBER = ""; // TODO(negocio): número real de la tienda para recibir pedidos por WhatsApp

/* ============================================================
   PERSISTENCIA
   window.storage guarda carrito e historial por usuario.
   Si no está disponible, la app sigue funcionando en memoria.
============================================================ */
const hasStorage = typeof window !== "undefined" && window.storage;

async function loadJSON(key, fallback) {
  if (!hasStorage) return fallback;
  try {
    const res = await window.storage.get(key);
    return res ? JSON.parse(res.value) : fallback;
  } catch {
    return fallback;
  }
}
async function saveJSON(key, value) {
  if (!hasStorage) return;
  try {
    await window.storage.set(key, JSON.stringify(value));
  } catch {
    /* fallo silencioso: no bloquea la experiencia */
  }
}

/* ============================================================
   TRANSICIÓN SUAVE ENTRE PANTALLAS
============================================================ */
function Fade({ screenKey, children }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(false);
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, [screenKey]);
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(10px)",
        transition: "opacity 480ms cubic-bezier(.22,.68,0,1), transform 480ms cubic-bezier(.22,.68,0,1)",
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================
   COMPONENTE PRINCIPAL
============================================================ */
export default function SelectorLiturgico() {
  const [screen, setScreen] = useState("landing"); // landing|q1|q2|q3|loading|result|cart|confirm
  const [stack, setStack] = useState(["landing"]);
  const [answers, setAnswers] = useState({ occasionId: null, intentionId: null, sizeId: null });
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState(null);
  const [order, setOrder] = useState(null);
  const toastTimer = useRef(null);

  // Carga inicial de datos persistidos
  useEffect(() => {
    (async () => {
      const savedCart = await loadJSON("slv:cart", []);
      const savedHistory = await loadJSON("slv:history", []);
      setCart(savedCart);
      setHistory(savedHistory);
    })();
  }, []);

  useEffect(() => { saveJSON("slv:cart", cart); }, [cart]);
  useEffect(() => { saveJSON("slv:history", history); }, [history]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  function go(next) {
    setStack((s) => [...s, next]);
    setScreen(next);
  }
  function back() {
    setStack((s) => {
      if (s.length <= 1) return s;
      const copy = s.slice(0, -1);
      setScreen(copy[copy.length - 1]);
      return copy;
    });
  }
  function restart() {
    setAnswers({ occasionId: null, intentionId: null, sizeId: null });
    setStack(["landing"]);
    setScreen("landing");
  }

  function selectOccasion(id) {
    setAnswers((a) => ({ ...a, occasionId: id, intentionId: null, sizeId: null }));
    go("q2");
  }
  function selectIntention(id) {
    setAnswers((a) => ({ ...a, intentionId: id }));
    go("q3");
  }
  function selectSize(id) {
    setAnswers((a) => ({ ...a, sizeId: id }));
    go("loading");
  }
  function skipSize() {
    setAnswers((a) => ({ ...a, sizeId: "mediana" }));
    go("loading");
  }

  // Procesamiento: reglas -> resultado
  const occasion = OCCASIONS.find((o) => o.id === answers.occasionId) || null;
  const intention = occasion?.intentions.find((i) => i.id === answers.intentionId) || null;
  const size = SIZES.find((s) => s.id === answers.sizeId) || SIZES[1];
  const altIntention = occasion?.intentions.find((i) => i.id !== answers.intentionId) || null;

  // Avance automático desde "loading" a "result"
  useEffect(() => {
    if (screen !== "loading") return;
    const t = setTimeout(() => {
      if (occasion && intention) {
        setHistory((h) => {
          const entry = { occasionId: occasion.id, intentionId: intention.id, sizeId: size.id, product: intention.product, at: Date.now() };
          const filtered = h.filter((e) => !(e.occasionId === entry.occasionId && e.intentionId === entry.intentionId));
          return [entry, ...filtered].slice(0, 3);
        });
        go("result");
      } else {
        go("result"); // estado sin match: la pantalla de resultado maneja el fallback
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 850);
    return () => clearTimeout(t);
  }, [screen]); // eslint-disable-line react-hooks/exhaustive-deps

  function addToCart(item) {
    setCart((c) => {
      const idx = c.findIndex((x) => x.key === item.key);
      if (idx >= 0) {
        const copy = [...c];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...c, { ...item, qty: 1 }];
    });
    showToast(`${item.name} agregada al carrito`);
  }
  function changeQty(key, delta) {
    setCart((c) =>
      c
        .map((x) => (x.key === key ? { ...x, qty: Math.max(0, x.qty + delta) } : x))
        .filter((x) => x.qty > 0)
    );
  }
  function removeFromCart(key) {
    setCart((c) => c.filter((x) => x.key !== key));
  }

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  function confirmOrder() {
    const orderId = "BRL-" + Math.floor(100000 + Math.random() * 899999);
    setOrder({ id: orderId, items: cart, total: cartTotal, at: new Date() });
    setCart([]);
    go("confirm");
  }

  function resumeFromHistory(entry) {
    setAnswers({ occasionId: entry.occasionId, intentionId: entry.intentionId, sizeId: entry.sizeId });
    setStack(["landing", "loading"]);
    setScreen("loading");
  }

  return (
    <div className="slv-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&family=Work+Sans:wght@400;500;600&display=swap');

        .slv-root {
          --bg: #14100D;
          --panel: #1C1712;
          --panel-2: #241D16;
          --gold: #C89B5C;
          --gold-bright: #E3B979;
          --ink: #EDE3D3;
          --muted: #A6997F;
          --line: rgba(237,227,211,0.10);
          --wine: #7A2E2E;
          font-family: 'Work Sans', sans-serif;
          background: radial-gradient(120% 90% at 50% -10%, #241C15 0%, #14100D 55%, #0E0B08 100%);
          color: var(--ink);
          min-height: 100vh;
          width: 100%;
          display: flex;
          justify-content: center;
          box-sizing: border-box;
          padding: 0;
        }
        .slv-root *, .slv-root *::before, .slv-root *::after { box-sizing: border-box; }
        .slv-shell {
          width: 100%;
          max-width: 480px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          padding: 0 22px 32px;
        }
        .slv-display { font-family: 'Cormorant Garamond', serif; }
        .slv-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 0 10px; min-height: 52px;
        }
        .slv-iconbtn {
          background: transparent; border: none; color: var(--ink);
          width: 40px; height: 40px; border-radius: 999px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 200ms ease;
        }
        .slv-iconbtn:hover { background: rgba(237,227,211,0.06); }
        .slv-iconbtn:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }

        .slv-dots { display: flex; gap: 7px; }
        .slv-dot { width: 7px; height: 7px; border-radius: 999px; background: var(--line); transition: background 300ms; }
        .slv-dot.active { background: var(--gold); }

        .slv-flame-wrap { display:flex; justify-content:center; margin: 26px 0 6px; }
        @keyframes flicker {
          0%,100% { transform: scaleY(1) scaleX(1) translateY(0); opacity: 1; }
          25% { transform: scaleY(1.05) scaleX(0.97) translateY(-1px); opacity: 0.96; }
          50% { transform: scaleY(0.97) scaleX(1.02) translateY(0px); opacity: 1; }
          75% { transform: scaleY(1.03) scaleX(0.99) translateY(-0.5px); opacity: 0.98; }
        }
        .slv-flame { animation: flicker 3.2s ease-in-out infinite; filter: drop-shadow(0 0 18px rgba(200,155,92,0.45)); }
        @media (prefers-reduced-motion: reduce) { .slv-flame { animation: none; } }

        .slv-h1 { font-size: 2.5rem; line-height: 1.1; font-weight: 500; margin: 0 0 10px; text-align:center; }
        .slv-sub { color: var(--muted); font-size: 1rem; line-height: 1.5; text-align:center; margin: 0 auto 30px; max-width: 34ch; }

        .slv-cta {
          width: 100%; border: none; cursor: pointer;
          background: linear-gradient(180deg, var(--gold-bright), var(--gold));
          color: #1A1309; font-weight: 600; font-size: 1.05rem;
          padding: 17px 20px; border-radius: 14px;
          box-shadow: 0 10px 24px -8px rgba(200,155,92,0.55);
          transition: transform 180ms ease, box-shadow 180ms ease;
        }
        .slv-cta:hover { transform: translateY(-1px); box-shadow: 0 14px 28px -8px rgba(200,155,92,0.65); }
        .slv-cta:active { transform: translateY(0px) scale(0.99); }
        .slv-cta:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
        .slv-cta:disabled { opacity: 0.45; cursor: not-allowed; box-shadow:none; transform:none; }

        .slv-ghost {
          width: 100%; background: transparent; cursor: pointer;
          border: 1px solid var(--line); color: var(--ink);
          font-size: 0.95rem; padding: 14px 18px; border-radius: 14px;
          transition: border-color 200ms ease, background 200ms ease;
        }
        .slv-ghost:hover { border-color: rgba(237,227,211,0.28); background: rgba(237,227,211,0.03); }
        .slv-ghost:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }

        .slv-qlabel { font-size: 0.85rem; color: var(--muted); margin-bottom: 4px; }
        .slv-qtitle { font-size: 1.6rem; font-weight: 500; margin: 2px 0 22px; line-height:1.25; }

        .slv-option {
          width: 100%; display:flex; align-items:center; gap: 14px;
          background: var(--panel); border: 1px solid var(--line);
          border-radius: 14px; padding: 16px 16px; margin-bottom: 10px;
          cursor: pointer; text-align: left; color: var(--ink); font-size: 1rem;
          transition: border-color 200ms ease, background 200ms ease, transform 150ms ease;
          min-height: 60px;
        }
        .slv-option:hover { border-color: var(--gold); background: var(--panel-2); transform: translateY(-1px); }
        .slv-option:active { transform: translateY(0); }
        .slv-option:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
        .slv-swatch { width: 13px; height: 13px; border-radius: 999px; flex: none; box-shadow: 0 0 0 3px rgba(237,227,211,0.06); }

        .slv-size-card {
          width: 100%; background: var(--panel); border: 1px solid var(--line);
          border-radius: 14px; padding: 16px; margin-bottom: 10px; cursor:pointer;
          display:flex; justify-content:space-between; align-items:center; gap: 12px;
          transition: border-color 200ms ease, background 200ms ease;
        }
        .slv-size-card:hover { border-color: var(--gold); background: var(--panel-2); }
        .slv-size-card:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
        .slv-size-name { font-weight: 600; font-size: 1.02rem; }
        .slv-size-desc { color: var(--muted); font-size: 0.85rem; margin-top: 2px; }
        .slv-size-price { font-weight: 600; color: var(--gold-bright); font-size: 1rem; white-space:nowrap; }

        .slv-loading-wrap { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:18px; }
        .slv-spin { animation: spin 1s linear infinite; color: var(--gold); }
        @keyframes spin { to { transform: rotate(360deg); } }

        .slv-result-card {
          background: linear-gradient(180deg, var(--panel-2), var(--panel));
          border: 1px solid var(--line); border-radius: 18px; padding: 26px 22px;
          text-align: center; margin-bottom: 16px;
        }
        .slv-result-dot { width: 46px; height: 46px; border-radius: 999px; margin: 0 auto 16px; box-shadow: 0 0 0 6px rgba(237,227,211,0.05); }
        .slv-result-name { font-size: 1.7rem; font-weight: 500; margin: 0 0 4px; }
        .slv-result-meta { color: var(--muted); font-size: 0.88rem; margin-bottom: 14px; }
        .slv-result-symbol { color: var(--ink); font-size: 0.98rem; line-height: 1.6; opacity: 0.9; margin: 0 auto 18px; max-width: 40ch; }
        .slv-price { font-size: 1.5rem; font-weight: 600; color: var(--gold-bright); margin-bottom: 18px; }

        .slv-alt {
          border: 1px dashed var(--line); border-radius: 14px; padding: 14px 16px;
          display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom: 18px;
        }
        .slv-alt-text { font-size: 0.9rem; color: var(--muted); }
        .slv-alt-link { background:none; border:none; color: var(--gold); font-size: 0.88rem; cursor:pointer; text-decoration: underline; text-underline-offset: 3px; padding:4px; }

        .slv-link { background:none; border:none; color: var(--muted); font-size: 0.9rem; cursor:pointer; text-decoration: underline; text-underline-offset:3px; }
        .slv-link:hover { color: var(--ink); }

        .slv-cart-fab {
          position: fixed; bottom: 22px; right: max(22px, calc(50% - 240px + 22px));
          background: var(--gold); color: #1A1309; border:none; border-radius: 999px;
          width: 58px; height: 58px; display:flex; align-items:center; justify-content:center;
          cursor:pointer; box-shadow: 0 10px 24px -6px rgba(0,0,0,0.5); z-index: 30;
        }
        .slv-cart-badge {
          position:absolute; top: -4px; right: -4px; background: var(--wine); color: var(--ink);
          font-size: 0.7rem; font-weight:700; min-width:20px; height:20px; border-radius:999px;
          display:flex; align-items:center; justify-content:center; padding: 0 4px;
        }

        .slv-line-item { display:flex; gap:12px; align-items:center; padding: 14px 0; border-bottom: 1px solid var(--line); }
        .slv-qty-btn { width:28px; height:28px; border-radius:8px; border:1px solid var(--line); background:transparent; color:var(--ink); cursor:pointer; }
        .slv-qty-btn:hover { border-color: var(--gold); }

        .slv-empty { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; gap:14px; padding: 40px 10px; }

        .slv-toast {
          position: fixed; bottom: 26px; left: 50%; transform: translateX(-50%);
          background: var(--ink); color: #1A1309; font-size: 0.9rem; font-weight: 500;
          padding: 12px 18px; border-radius: 999px; box-shadow: 0 8px 20px rgba(0,0,0,0.35);
          z-index: 50; display:flex; align-items:center; gap:8px;
        }

        .slv-history-item {
          width:100%; text-align:left; background: var(--panel); border:1px solid var(--line);
          border-radius: 12px; padding: 12px 14px; margin-bottom: 8px; cursor:pointer; color: var(--ink);
          font-size: 0.88rem; transition: border-color 200ms ease;
        }
        .slv-history-item:hover { border-color: var(--gold); }

        .slv-note { font-size: 0.76rem; color: var(--muted); text-align:center; margin-top: 6px; opacity: 0.8; }
      `}</style>

      <div className="slv-shell">
        {/* Topbar: visible en todas las pantallas salvo landing/confirm */}
        {!["landing", "confirm"].includes(screen) && (
          <div className="slv-topbar">
            <button className="slv-iconbtn" onClick={back} aria-label="Volver">
              <ArrowLeft size={20} />
            </button>
            {["q1", "q2", "q3"].includes(screen) && (
              <div className="slv-dots" aria-hidden="true">
                <span className={`slv-dot ${["q1", "q2", "q3"].indexOf(screen) >= 0 ? "active" : ""}`} />
                <span className={`slv-dot ${["q2", "q3"].includes(screen) ? "active" : ""}`} />
                <span className={`slv-dot ${screen === "q3" ? "active" : ""}`} />
              </div>
            )}
            <button className="slv-iconbtn" onClick={restart} aria-label="Empezar de nuevo">
              <X size={20} />
            </button>
          </div>
        )}

        {/* ---------------- LANDING ---------------- */}
        {screen === "landing" && (
          <Fade screenKey="landing">
            <div style={{ paddingTop: 28 }}>
              <div className="slv-flame-wrap">
                <FlameIcon />
              </div>
              <h1 className="slv-h1 slv-display">Encuentra tu vela</h1>
              <p className="slv-sub">
                Responde tres preguntas breves y te decimos, sin rodeos,
                qué vela encender hoy.
              </p>
              <button className="slv-cta" onClick={() => go("q1")}>
                Empezar
              </button>

              {history.length > 0 && (
                <div style={{ marginTop: 34 }}>
                  <div className="slv-qlabel" style={{ marginBottom: 10 }}>Tus búsquedas recientes</div>
                  {history.map((h) => {
                    const occ = OCCASIONS.find((o) => o.id === h.occasionId);
                    return (
                      <button key={h.occasionId + h.intentionId} className="slv-history-item" onClick={() => resumeFromHistory(h)}>
                        {h.product} <span style={{ color: "var(--muted)" }}>· {occ?.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </Fade>
        )}

        {/* ---------------- Q1: OCASIÓN ---------------- */}
        {screen === "q1" && (
          <Fade screenKey="q1">
            <div className="slv-qlabel">Paso 1 de 3</div>
            <h2 className="slv-qtitle slv-display">¿Para qué necesitas la vela?</h2>
            {OCCASIONS.map((o) => (
              <button key={o.id} className="slv-option" onClick={() => selectOccasion(o.id)}>
                <span className="slv-swatch" style={{ background: o.hex }} />
                {o.label}
              </button>
            ))}
          </Fade>
        )}

        {/* ---------------- Q2: INTENCIÓN ---------------- */}
        {screen === "q2" && occasion && (
          <Fade screenKey="q2">
            <div className="slv-qlabel">Paso 2 de 3</div>
            <h2 className="slv-qtitle slv-display">Cuéntanos un poco más</h2>
            {occasion.intentions.map((i) => (
              <button key={i.id} className="slv-option" onClick={() => selectIntention(i.id)}>
                {i.label}
              </button>
            ))}
          </Fade>
        )}

        {/* ---------------- Q3: TAMAÑO ---------------- */}
        {screen === "q3" && (
          <Fade screenKey="q3">
            <div className="slv-qlabel">Paso 3 de 3 · opcional</div>
            <h2 className="slv-qtitle slv-display">¿Qué tamaño prefieres?</h2>
            {SIZES.map((s) => (
              <button key={s.id} className="slv-size-card" onClick={() => selectSize(s.id)}>
                <span>
                  <span className="slv-size-name">{s.label}</span>
                  <div className="slv-size-desc">{s.desc}</div>
                </span>
                <span className="slv-size-price">{COP(s.price)}</span>
              </button>
            ))}
            <button className="slv-link" style={{ display: "block", margin: "8px auto 0" }} onClick={skipSize}>
              Omitir y mostrar mi recomendación
            </button>
          </Fade>
        )}

        {/* ---------------- LOADING ---------------- */}
        {screen === "loading" && (
          <div className="slv-loading-wrap">
            <Loader2 className="slv-spin" size={30} />
            <p style={{ color: "var(--muted)" }}>Buscando tu vela…</p>
          </div>
        )}

        {/* ---------------- RESULTADO ---------------- */}
        {screen === "result" && (
          <Fade screenKey="result">
            {occasion && intention ? (
              <>
                <div className="slv-result-card">
                  <div className="slv-result-dot" style={{ background: occasion.hex }} />
                  <h2 className="slv-result-name slv-display">{intention.product}</h2>
                  <div className="slv-result-meta">Tamaño {size.label.toLowerCase()} · {size.desc}</div>
                  <p className="slv-result-symbol">{intention.symbol}</p>
                  <div className="slv-price">{COP(size.price)}</div>
                  <button
                    className="slv-cta"
                    onClick={() =>
                      addToCart({
                        key: `${occasion.id}-${intention.id}-${size.id}`,
                        name: intention.product,
                        size: size.label,
                        price: size.price,
                        hex: occasion.hex,
                      })
                    }
                  >
                    Agregar al carrito
                  </button>
                </div>

                {altIntention && (
                  <div className="slv-alt">
                    <span className="slv-alt-text">¿Y si es «{altIntention.label.toLowerCase()}»?</span>
                    <button className="slv-alt-link" onClick={() => setAnswers((a) => ({ ...a, intentionId: altIntention.id }))}>
                      Ver esa
                    </button>
                  </div>
                )}

                <button className="slv-ghost" style={{ marginBottom: 10 }} onClick={() => go("q1")}>
                  Elegir otra ocasión
                </button>
                <ShareRow occasion={occasion} intention={intention} size={size} />
              </>
            ) : (
              <div className="slv-empty">
                <Flame size={30} color="var(--gold)" />
                <p style={{ color: "var(--muted)" }}>
                  No encontramos una coincidencia exacta. Escríbenos y te
                  ayudamos a elegir en persona.
                </p>
                <button className="slv-cta" onClick={restart}>Empezar de nuevo</button>
              </div>
            )}
          </Fade>
        )}

        {/* ---------------- CARRITO ---------------- */}
        {screen === "cart" && (
          <Fade screenKey="cart">
            <h2 className="slv-qtitle slv-display" style={{ marginBottom: 14 }}>Tu carrito</h2>
            {cart.length === 0 ? (
              <div className="slv-empty">
                <ShoppingBag size={30} color="var(--muted)" />
                <p style={{ color: "var(--muted)" }}>Todavía no has agregado ninguna vela.</p>
                <button className="slv-ghost" onClick={() => go("q1")}>Buscar mi vela</button>
              </div>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item.key} className="slv-line-item">
                    <span className="slv-swatch" style={{ background: item.hex, width: 30, height: 30 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.82rem" }}>{item.size} · {COP(item.price)}</div>
                    </div>
                    <button className="slv-qty-btn" onClick={() => changeQty(item.key, -1)} aria-label="Quitar una">–</button>
                    <span style={{ minWidth: 18, textAlign: "center" }}>{item.qty}</span>
                    <button className="slv-qty-btn" onClick={() => changeQty(item.key, 1)} aria-label="Agregar una">+</button>
                    <button className="slv-iconbtn" onClick={() => removeFromCart(item.key)} aria-label="Eliminar">
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "18px 0 22px", fontSize: "1.1rem" }}>
                  <span>Total</span>
                  <strong style={{ color: "var(--gold-bright)" }}>{COP(cartTotal)}</strong>
                </div>
                <button className="slv-cta" onClick={confirmOrder}>Confirmar pedido</button>
                <p className="slv-note">
                  Pago simulado en este MVP — aquí se conecta la pasarela real
                  (Wompi / PayU / Mercado Pago) del checkout existente de la tienda.
                </p>
              </>
            )}
          </Fade>
        )}

        {/* ---------------- CONFIRMACIÓN ---------------- */}
        {screen === "confirm" && order && (
          <Fade screenKey="confirm">
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", gap: 16 }}>
              <div style={{
                width: 64, height: 64, borderRadius: "999px", background: "rgba(200,155,92,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--gold)"
              }}>
                <Check size={28} color="var(--gold-bright)" />
              </div>
              <h2 className="slv-display" style={{ fontSize: "1.8rem", margin: 0 }}>Pedido confirmado</h2>
              <p style={{ color: "var(--muted)", maxWidth: "34ch" }}>
                Tu pedido <strong style={{ color: "var(--ink)" }}>{order.id}</strong> está en camino.
                Que esta luz lleve tu intención donde tiene que llegar.
              </p>
              <div style={{ color: "var(--gold-bright)", fontWeight: 600, fontSize: "1.1rem" }}>{COP(order.total)}</div>
              <button className="slv-ghost" onClick={restart}>Buscar otra vela</button>
            </div>
          </Fade>
        )}

        {/* Botón flotante del carrito */}
        {!["landing", "cart", "confirm"].includes(screen) && cartCount > 0 && (
          <button className="slv-cart-fab" onClick={() => go("cart")} aria-label="Ver carrito">
            <ShoppingBag size={22} />
            <span className="slv-cart-badge">{cartCount}</span>
          </button>
        )}

        {/* Toast de feedback */}
        {toast && (
          <div className="slv-toast" role="status">
            <Check size={16} />
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   SUBCOMPONENTES
============================================================ */
function FlameIcon() {
  return (
    <svg className="slv-flame" width="52" height="72" viewBox="0 0 52 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M26 4C26 4 10 22 10 40C10 53.2548 17.1634 62 26 62C34.8366 62 42 53.2548 42 40C42 34 39 27 35 22C35.5 27 33.5 30 31 31C31.5 24 28 16 26 4Z"
        fill="url(#slvFlameGrad)"
      />
      <path d="M26 40C26 40 20 47 20 53C20 58 22.5 62 26 62C29.5 62 32 58 32 53C32 49 30 45 28 42C28 44.5 27 46 26 46.5C26.3 44 25.5 42 26 40Z" fill="#F2D9A8" opacity="0.9" />
      <defs>
        <linearGradient id="slvFlameGrad" x1="26" y1="4" x2="26" y2="62" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E3B979" />
          <stop offset="0.55" stopColor="#C89B5C" />
          <stop offset="1" stopColor="#8C5A2E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ShareRow({ occasion, intention, size }) {
  const text = encodeURIComponent(
    `Encontré esta vela en Belén Resplandor de Luz: ${intention.product} (${size.label}) — ${intention.symbol}`
  );
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="slv-ghost"
      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none", marginBottom: 10 }}
    >
      <MessageCircle size={17} />
      Consultarlo por WhatsApp
    </a>
  );
}
