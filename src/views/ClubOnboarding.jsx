import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SPORTS_CONFIG, COUNTRIES } from "../data/sports";
import AuroraBg from "../components/AuroraBg";
import { ss } from "../styles/tokens";
import { supabase } from "../lib/supabase";

const STEPS = ["Tu cuenta", "Tu club", "Tu deporte"];

export default function ClubOnboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Paso 0: cuenta
  const [nombre, setNombre] = useState("");
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");

  // Paso 1: club
  const [clubName, setClubName]   = useState("");
  const [country, setCountry]     = useState("CL");

  // Paso 2: deporte
  const [sport, setSport] = useState("rugby");

  const sp       = SPORTS_CONFIG[sport];
  const accentColor = sp?.color || "#A855F7";

  const next = async () => {
    setError("");
    if (step === 0) {
      if (!nombre.trim() || !email.trim() || pass.length < 6) {
        setError("Completa todos los campos. La contraseña debe tener al menos 6 caracteres."); return;
      }
      setStep(1);
    } else if (step === 1) {
      if (!clubName.trim()) { setError("Escribe el nombre del club."); return; }
      setStep(2);
    } else {
      // Paso final: crear cuenta + club en Supabase
      setBusy(true);
      try {
        // 1. Crear usuario en Supabase Auth
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: email.trim(),
          password: pass,
          options: { data: { nombre: nombre.trim() } },
        });
        if (authErr) throw authErr;

        const userId = authData.user?.id;

        // 2. Crear club en tabla clubs
        const { data: clubData, error: clubErr } = await supabase
          .from("clubs")
          .insert({ nombre: clubName.trim(), pais: country, deporte: sport })
          .select().single();
        if (clubErr) throw clubErr;

        // 3. Crear o actualizar perfil con rol admin y club_id
        await supabase.from("profiles").upsert({
          id: userId,
          nombre: nombre.trim(),
          email: email.trim(),
          rol: "admin",
          club_id: clubData.id,
        });

        onComplete({
          nombre: nombre.trim(),
          email: email.trim(),
          rol: "admin",
          club: clubName.trim(),
          club_id: clubData.id,
          sport,
          cats: [],
        });
      } catch (e) {
        // Fallback: si Supabase no está configurado, completar igual en modo demo
        if (e.message?.includes("fetch") || e.message?.includes("URL")) {
          onComplete({ nombre: nombre.trim(), email: email.trim(), rol: "admin", club: clubName.trim(), club_id: null, sport, cats: [] });
        } else {
          setError(e.message);
        }
      } finally {
        setBusy(false);
      }
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", overflow: "auto" }}>
      <AuroraBg />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: "460px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontWeight: 900, fontSize: "28px", color: accentColor, letterSpacing: "-0.03em", filter: `drop-shadow(0 0 16px ${accentColor}66)` }}>⚡ SportOS</div>
          <div style={{ fontSize: "13px", color: "var(--text-3)", marginTop: "6px" }}>Configura tu club en 3 pasos</div>
        </div>

        {/* Stepper */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "32px", gap: "0" }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flex: 1 }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, background: i < step ? accentColor : i === step ? `${accentColor}33` : "var(--bg-elev-2)", color: i < step ? "#fff" : i === step ? accentColor : "var(--text-4)", border: `2px solid ${i <= step ? accentColor : "var(--border-soft)"}`, transition: "all 0.3s" }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: "10px", color: i === step ? accentColor : "var(--text-4)", fontWeight: i === step ? 700 : 400, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ height: "2px", flex: 1, background: i < step ? accentColor : "var(--border-soft)", transition: "all 0.3s", margin: "0 4px", marginBottom: "20px" }} />
              )}
            </div>
          ))}
        </div>

        {/* Card del paso */}
        <div style={{ ...ss.card, border: `1px solid ${accentColor}33`, background: `linear-gradient(135deg,${accentColor}08,var(--bg-glass))` }}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div style={{ fontWeight: 700, fontSize: "18px", marginBottom: "6px" }}>Crea tu cuenta</div>
                <div style={{ color: "var(--text-2)", fontSize: "13px", marginBottom: "24px" }}>El admin del club. Podrás invitar a más personas después.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <div style={ss.label}>Tu nombre</div>
                    <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: José Sánchez" style={ss.input} />
                  </div>
                  <div>
                    <div style={ss.label}>Email</div>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" style={ss.input} />
                  </div>
                  <div>
                    <div style={ss.label}>Contraseña</div>
                    <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Mínimo 6 caracteres" style={ss.input} />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div style={{ fontWeight: 700, fontSize: "18px", marginBottom: "6px" }}>Tu club</div>
                <div style={{ color: "var(--text-2)", fontSize: "13px", marginBottom: "24px" }}>Así aparecerá en la plataforma.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <div style={ss.label}>Nombre del club</div>
                    <input value={clubName} onChange={e => setClubName(e.target.value)} placeholder="Ej: Rugby Club Santiago" style={ss.input} />
                  </div>
                  <div>
                    <div style={ss.label}>País</div>
                    <select value={country} onChange={e => setCountry(e.target.value)} style={{ ...ss.input, cursor: "pointer" }}>
                      {Object.entries(COUNTRIES).map(([k, v]) => (
                        <option key={k} value={k}>{v.flag} {v.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div style={{ fontWeight: 700, fontSize: "18px", marginBottom: "6px" }}>¿Qué deporte?</div>
                <div style={{ color: "var(--text-2)", fontSize: "13px", marginBottom: "20px" }}>Puedes agregar más deportes después.</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {Object.entries(SPORTS_CONFIG).map(([k, v]) => (
                    <motion.button key={k} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={() => setSport(k)}
                      style={{ padding: "16px 12px", borderRadius: "var(--r-md)", border: `2px solid ${k === sport ? v.color : "var(--border-soft)"}`, cursor: "pointer", background: k === sport ? `${v.color}18` : "var(--bg-elev-2)", color: k === sport ? v.color : "var(--text-2)", textAlign: "center", transition: "all 0.2s", boxShadow: k === sport ? `0 0 16px ${v.color}33` : "none" }}>
                      <div style={{ fontSize: "24px", marginBottom: "6px" }}>{v.icon}</div>
                      <div style={{ fontSize: "12px", fontWeight: k === sport ? 700 : 500 }}>{v.name}</div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div style={{ marginTop: "16px", padding: "10px 14px", borderRadius: "var(--r-sm)", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444", fontSize: "12px" }}>
              ⚠️ {error}
            </div>
          )}

          <motion.button disabled={busy} whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} onClick={next}
            style={{ ...ss.btn, width: "100%", marginTop: "24px", padding: "14px", fontSize: "14px", fontWeight: 700, background: `linear-gradient(135deg,${accentColor},${accentColor}cc)`, color: "#fff", boxShadow: `0 8px 24px ${accentColor}44`, opacity: busy ? 0.6 : 1 }}>
            {busy ? "Creando tu club..." : step < 2 ? "Continuar →" : `Crear mi club de ${sp.name} ✓`}
          </motion.button>
        </div>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "var(--text-3)" }}>
          ¿Ya tienes cuenta?{" "}
          <span onClick={() => onComplete(null)} style={{ color: accentColor, cursor: "pointer", fontWeight: 600 }}>Ingresar</span>
        </div>
      </motion.div>
    </div>
  );
}
