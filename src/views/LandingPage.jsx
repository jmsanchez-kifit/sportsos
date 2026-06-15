import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuroraBg from "../components/AuroraBg";
import { ss } from "../styles/tokens";

const SPORTS = [
  { icon: "🏉", name: "Rugby",      color: "#22C55E" },
  { icon: "⚽", name: "Fútbol",     color: "#06B6D4" },
  { icon: "🏀", name: "Basketball", color: "#EF4444" },
  { icon: "🤾", name: "Handball",   color: "#F59E0B" },
  { icon: "🏑", name: "Hockey",     color: "#A855F7" },
];

const FEATURES = [
  { icon: "📋", title: "Plantel completo",     desc: "Gestiona jugadores, categorías, estado médico y cuotas desde un solo lugar." },
  { icon: "✅", title: "Control de asistencia", desc: "Marca asistencia con un toque. Se guarda automáticamente con fecha." },
  { icon: "🏆", title: "Match Center",          desc: "Carga resultados, nóminas y estadísticas de cada partido." },
  { icon: "💬", title: "El Muro",               desc: "Red social interna del equipo. Avisos, resultados y comunicación en tiempo real." },
  { icon: "💰", title: "Finanzas del club",     desc: "Controla pagos de cuotas, cobra masivamente y exporta reportes." },
  { icon: "💪", title: "Gym & Microciclo",      desc: "El preparador físico publica el plan de entrenamiento para toda la semana." },
];

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "/ mes",
    color: "#6B7896",
    features: ["Hasta 25 jugadores", "1 categoría", "Asistencia y plantel", "El Muro básico"],
    cta: "Empezar gratis",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "USD / mes",
    color: "#A855F7",
    features: ["Jugadores ilimitados", "Todas las categorías", "Todos los módulos", "Soporte prioritario", "Reportes y CSV"],
    cta: "Probar 14 días gratis",
    highlight: true,
  },
  {
    name: "Club Elite",
    price: "$59",
    period: "USD / mes",
    color: "#22C55E",
    features: ["Todo lo de Pro", "Múltiples deportes", "Invitaciones ilimitadas", "API acceso", "Onboarding dedicado"],
    cta: "Hablar con ventas",
    highlight: false,
  },
];

const TESTIMONIALS = [
  { name: "Carlos Vega", role: "Entrenador · Rugby Club Santiago", text: "Antes usábamos 3 grupos de WhatsApp y una planilla Excel. Ahora todo está en un solo lugar. Los jugadores saben exactamente qué tienen que hacer." },
  { name: "María Torres", role: "Admin · Club Deportivo Andes", text: "El cobro de cuotas era un caos. Con SportOS envío el cobro masivo en un click y tengo el historial de pagos en tiempo real." },
  { name: "Diego Fuentes", role: "Preparador Físico · HC Tigres", text: "Publico el microciclo del lunes y los chicos ya lo tienen en su celular. El ranking de fuerza los motiva un montón." },
];

export default function LandingPage({ onLogin, onDemo, onRegister }) {
  const [activeSport, setActiveSport] = useState(0);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const sport = SPORTS[activeSport];

  const handleCTA = () => {
    if (email.trim()) {
      setEmailSent(true);
      setTimeout(() => onRegister(), 1200);
    } else {
      onRegister();
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-1)", fontFamily: "'Inter',system-ui,sans-serif", overflowX: "hidden" }}>
      <AuroraBg />

      {/* ── NAV ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(16px,5vw,80px)", height: "60px", background: "var(--bg-glass)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderBottom: "1px solid var(--border-soft)" }}>
        <div style={{ fontWeight: 900, fontSize: "18px", color: sport.color, letterSpacing: "-0.03em", filter: `drop-shadow(0 0 12px ${sport.color}66)` }}>⚡ SportOS</div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onRegister}
            style={{ ...ss.btn, background: "transparent", color: "var(--text-2)", border: "1px solid var(--border-soft)", fontSize: "13px" }}>
            Crear club gratis
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onLogin}
            style={{ ...ss.btn, background: `linear-gradient(135deg,${sport.color},${sport.color}cc)`, color: "#fff", fontSize: "13px", boxShadow: `0 4px 14px ${sport.color}44` }}>
            Ingresar
          </motion.button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "clamp(60px,10vh,120px) clamp(16px,5vw,80px) 80px" }}>
        {/* Sport pill */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
          {SPORTS.map((s, i) => (
            <motion.button key={i} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSport(i)}
              style={{ padding: "6px 14px", borderRadius: "99px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 600, background: i === activeSport ? `${s.color}22` : "var(--bg-elev-2)", color: i === activeSport ? s.color : "var(--text-3)", border: `1px solid ${i === activeSport ? s.color + "55" : "transparent"}`, transition: "all 0.2s" }}>
              {s.icon} {s.name}
            </motion.button>
          ))}
        </div>

        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "99px", background: "var(--bg-glass)", border: "1px solid var(--border-soft)", marginBottom: "24px", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 10px #22C55E", animation: "pulse-soft 2s infinite" }} />
          <span style={{ fontSize: "11px", color: "var(--text-2)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Plataforma operativa en LATAM</span>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.h1 key={activeSport} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}
            style={{ fontSize: "clamp(40px,7vw,88px)", fontWeight: 900, margin: "0 0 20px", lineHeight: 1, letterSpacing: "-0.04em", background: `linear-gradient(135deg,#fff 0%,${sport.color} 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {sport.icon} Tu club de {sport.name}<br />en un solo lugar
          </motion.h1>
        </AnimatePresence>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ fontSize: "clamp(15px,2vw,20px)", color: "var(--text-2)", maxWidth: "580px", margin: "0 auto 40px", lineHeight: 1.6 }}>
          Plantel, asistencia, estadísticas, finanzas y comunicación del equipo. Sin Excel, sin WhatsApp caótico.
        </motion.p>

        {/* CTA */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginBottom: "16px" }}>
          <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleCTA()}
            placeholder="tu@email.com"
            style={{ ...ss.input, width: "240px", fontSize: "14px", padding: "12px 16px" }} />
          <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} onClick={handleCTA}
            style={{ ...ss.btn, background: `linear-gradient(135deg,${sport.color},${sport.color}bb)`, color: "#fff", fontSize: "14px", padding: "12px 28px", boxShadow: `0 8px 24px ${sport.color}44`, fontWeight: 700 }}>
            {emailSent ? "✅ Redirigiendo..." : "Empezar gratis"}
          </motion.button>
        </div>
        <div style={{ fontSize: "12px", color: "var(--text-3)" }}>14 días gratis · Sin tarjeta de crédito · Cancela cuando quieras</div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "clamp(20px,4vw,60px)", justifyContent: "center", marginTop: "60px", flexWrap: "wrap" }}>
          {[["5", "deportes"], ["65+", "clubes"], ["3", "países"], ["∞", "jugadores"]].map(([n, l]) => (
            <motion.div key={l} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ textAlign: "center" }}>
              <div style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 900, color: sport.color, lineHeight: 1, filter: `drop-shadow(0 0 12px ${sport.color}66)` }}>{n}</div>
              <div style={{ fontSize: "12px", color: "var(--text-3)", marginTop: "4px", letterSpacing: "0.06em", textTransform: "uppercase" }}>{l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px clamp(16px,5vw,80px)" }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <div style={{ fontSize: "11px", color: sport.color, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>Funcionalidades</div>
          <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, margin: 0, letterSpacing: "-0.03em" }}>Todo lo que necesita tu club</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "16px", maxWidth: "1100px", margin: "0 auto" }}>
          {FEATURES.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4, boxShadow: `0 12px 32px ${sport.color}22` }}
              style={{ ...ss.card, border: `1px solid var(--border-soft)` }}>
              <div style={{ fontSize: "28px", marginBottom: "12px" }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "8px" }}>{f.title}</div>
              <div style={{ color: "var(--text-2)", fontSize: "13px", lineHeight: 1.6 }}>{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIOS ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px clamp(16px,5vw,80px)", background: "var(--bg-elev-1)" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ fontSize: "11px", color: sport.color, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>Testimonios</div>
          <h2 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 900, margin: 0, letterSpacing: "-0.03em" }}>Lo que dicen los clubes</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "16px", maxWidth: "1000px", margin: "0 auto" }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ ...ss.card, border: `1px solid ${sport.color}22` }}>
              <div style={{ fontSize: "20px", color: sport.color, marginBottom: "12px" }}>"</div>
              <p style={{ color: "var(--text-1)", fontSize: "14px", lineHeight: 1.7, margin: "0 0 16px" }}>{t.text}</p>
              <div style={{ fontWeight: 700, fontSize: "13px" }}>{t.name}</div>
              <div style={{ fontSize: "11px", color: "var(--text-3)", marginTop: "2px" }}>{t.role}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PRECIOS ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px clamp(16px,5vw,80px)" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ fontSize: "11px", color: sport.color, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>Precios</div>
          <h2 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 900, margin: 0, letterSpacing: "-0.03em" }}>Simple y transparente</h2>
          <p style={{ color: "var(--text-2)", marginTop: "12px", fontSize: "14px" }}>Empieza gratis, crece cuando lo necesites</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "16px", maxWidth: "900px", margin: "0 auto" }}>
          {PLANS.map((plan, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              style={{ ...ss.card, border: `1px solid ${plan.highlight ? plan.color + "55" : "var(--border-soft)"}`, background: plan.highlight ? `linear-gradient(135deg,${plan.color}10,var(--bg-glass))` : "var(--bg-glass)", position: "relative", overflow: "visible" }}>
              {plan.highlight && (
                <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg,${plan.color},${plan.color}cc)`, color: "#fff", fontSize: "10px", fontWeight: 700, padding: "4px 14px", borderRadius: "99px", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Más popular</div>
              )}
              <div style={{ color: plan.color, fontWeight: 700, fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>{plan.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "20px" }}>
                <span style={{ fontSize: "40px", fontWeight: 900, letterSpacing: "-0.04em", color: "var(--text-1)" }}>{plan.price}</span>
                <span style={{ fontSize: "13px", color: "var(--text-3)" }}>{plan.period}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                {plan.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-2)" }}>
                    <span style={{ color: plan.color, fontWeight: 700, fontSize: "14px" }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onRegister}
                style={{ ...ss.btn, width: "100%", padding: "12px", fontSize: "13px", fontWeight: 700, background: plan.highlight ? `linear-gradient(135deg,${plan.color},${plan.color}cc)` : "var(--bg-elev-2)", color: plan.highlight ? "#fff" : "var(--text-2)", border: plan.highlight ? "none" : "1px solid var(--border-soft)", boxShadow: plan.highlight ? `0 6px 20px ${plan.color}44` : "none" }}>
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px clamp(16px,5vw,80px)", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, margin: "0 0 16px", letterSpacing: "-0.03em" }}>
            ¿Listo para ordenar tu club?
          </h2>
          <p style={{ color: "var(--text-2)", fontSize: "16px", marginBottom: "36px" }}>
            Únete a los clubes de LATAM que ya gestionan todo desde SportOS.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} onClick={onRegister}
              style={{ ...ss.btn, background: `linear-gradient(135deg,${sport.color},${sport.color}bb)`, color: "#fff", fontSize: "15px", padding: "14px 32px", boxShadow: `0 8px 28px ${sport.color}44`, fontWeight: 700 }}>
              Crear mi club gratis
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onDemo}
              style={{ ...ss.btn, background: "transparent", color: "var(--text-2)", border: "1px solid var(--border-soft)", fontSize: "15px", padding: "14px 24px" }}>
              Ver demo primero
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid var(--border-soft)", padding: "28px clamp(16px,5vw,80px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ fontWeight: 800, fontSize: "16px", color: sport.color }}>⚡ SportOS</div>
        <div style={{ fontSize: "12px", color: "var(--text-3)" }}>© 2026 SportOS · Hecho en LATAM · Chile · Argentina · Perú</div>
        <div style={{ display: "flex", gap: "16px" }}>
          {["Privacidad", "Términos", "Contacto"].map(l => (
            <span key={l} style={{ fontSize: "12px", color: "var(--text-3)", cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
