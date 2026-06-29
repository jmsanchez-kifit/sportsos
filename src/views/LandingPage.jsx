import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuroraBg from "../components/AuroraBg";
import { ss } from "../styles/tokens";

const SPORTS = [
  { icon:"🏉", name:"Rugby",      color:"#1FA04A" },
  { icon:"⚽", name:"Fútbol",     color:"#0896B0" },
  { icon:"🏀", name:"Basketball", color:"#C0392B" },
  { icon:"🤾", name:"Handball",   color:"#C98408" },
  { icon:"🏑", name:"Hockey",     color:"#8040CC" },
];

const PAIN_VS = [
  { antes:"Lista de asistencia en papel o WhatsApp",        despues:"Marcas en 1 toque desde el celular, se guarda solo" },
  { antes:"Cobros de cuota por transferencia y sin control", despues:"Cobro masivo con 1 click y reporte en tiempo real" },
  { antes:"Jugadores en una planilla Excel desactualizada",  despues:"Plantel completo con estado médico, cuota y posición" },
  { antes:"Nómina del partido por WhatsApp el día antes",    despues:"Nómina publicada en la app, el jugador confirma presencia" },
  { antes:"Preparador físico manda el plan por foto de hoja", despues:"Microciclo publicado digital, los jugadores lo ven en su celular" },
  { antes:"Sin registro de lesiones ni wellness del plantel", despues:"Alerta automática post-partido con cuestionario Hooper Index" },
];

const STEPS = [
  { num:"01", icon:"🏢", title:"Crea tu club",      desc:"En 3 minutos configuras el club, eliges el deporte y listo. Sin tarjeta de crédito." },
  { num:"02", icon:"🔗", title:"Invita a tu equipo", desc:"Genera un link por rol — entrenador, preparador, jugador. Cada uno ve solo lo que le corresponde." },
  { num:"03", icon:"⚡", title:"Todo en un lugar",   desc:"Asistencia, resultados, finanzas, wellness y comunicación. Sin Excel, sin WhatsApp caótico." },
];

const ROLES_FEATURES = {
  admin: {
    label:"Admin del Club", icon:"🏢", color:"#3B82F6",
    desc:"Tienes el control total del club sin perder tiempo en administración.",
    features:[
      { icon:"👥", title:"Plantel completo",    desc:"Todos los jugadores con estado médico, cuota y categoría." },
      { icon:"💰", title:"Finanzas en tiempo real", desc:"Ve quién pagó, quién debe y cobra masivamente." },
      { icon:"🔗", title:"Invitaciones por link", desc:"Invita a entrenadores y jugadores con un link. Cada uno entra con su rol." },
      { icon:"📊", title:"Reportes automáticos", desc:"Exporta el estado financiero del club en un click." },
    ]
  },
  entrenador: {
    label:"Entrenador", icon:"📋", color:"#C98408",
    desc:"Menos tiempo en papeleo, más tiempo en la cancha.",
    features:[
      { icon:"📋", title:"Nómina con drag & drop", desc:"Arma el equipo titular y banco arrastrando jugadores." },
      { icon:"✅", title:"Asistencia digital",     desc:"Cada jugador marca su presencia. Tú ves el resumen al instante." },
      { icon:"🏆", title:"Match Center",           desc:"Carga resultado, tarjetas y estadísticas. Se notifica solo." },
      { icon:"💬", title:"El Muro",                desc:"Publica avisos, resultados e insignias para el equipo." },
    ]
  },
  preparador: {
    label:"Preparador Físico", icon:"💪", color:"#C0392B",
    desc:"Monitorea la carga y el estado del plantel en un solo lugar.",
    features:[
      { icon:"📅", title:"Microciclo semanal",    desc:"Publica el plan de entrenamiento. Los jugadores lo ven en su celular." },
      { icon:"💪", title:"Estado del plantel",    desc:"Wellness post-partido con cuestionario Hooper Index automático." },
      { icon:"🏋️", title:"Ranking de fuerza",    desc:"Compara el rendimiento físico del plantel en tiempo real." },
      { icon:"🚑", title:"Lesiones y golpes",     desc:"Registra el mapa de golpes post-partido y gestiona suspensiones." },
    ]
  },
  jugador: {
    label:"Jugador", icon:"👤", color:"#1FA04A",
    desc:"El jugador sabe exactamente qué tiene que hacer y cuándo.",
    features:[
      { icon:"🎽", title:"¿Estoy convocado?",    desc:"Ve su estado de convocatoria al abrir la app. Sin llamadas." },
      { icon:"💳", title:"Mi cuota",             desc:"Paga directamente desde la app. Sin transferencias manuales." },
      { icon:"🏋️", title:"Mi Gym",              desc:"Registra sus series, pesos y ve su progreso semana a semana." },
      { icon:"📰", title:"Noticias del club",    desc:"Resultados, avisos del entrenador y logros del equipo." },
    ]
  },
};

const TESTIMONIALS = [
  { name:"Carlos Vega",    role:"Entrenador · Rugby Club Santiago",   text:"Antes usábamos 3 grupos de WhatsApp y una planilla Excel. Ahora todo está en un solo lugar. Los jugadores saben exactamente qué tienen que hacer.", stars:5 },
  { name:"María Torres",   role:"Admin · Club Deportivo Andes",       text:"El cobro de cuotas era un caos total. Con SportOS envío el cobro masivo en un click y tengo el historial de pagos en tiempo real. Recuperé 3 horas semanales.", stars:5 },
  { name:"Diego Fuentes",  role:"Preparador Físico · HC Tigres",      text:"Publico el microciclo del lunes y los chicos ya lo tienen en su celular. El ranking de fuerza los motiva un montón y el wellness post-partido es clave.", stars:5 },
];

const PLANS = [
  { name:"Starter", price:"$0",  period:"/ mes",      color:"#6B7896", badge:null,          cta:"Empezar gratis",       features:["Hasta 25 jugadores","1 categoría","Asistencia y plantel","El Muro básico"] },
  { name:"Pro",     price:"$29", period:"USD / mes",  color:"#C0392B", badge:"MÁS POPULAR", cta:"Probar 14 días gratis", features:["Jugadores ilimitados","Todas las categorías","Match Center + nóminas","Finanzas y reportes","Soporte prioritario"] },
  { name:"Elite",   price:"$59", period:"USD / mes",  color:"#C98408", badge:null,          cta:"Hablar con ventas",     features:["Todo lo de Pro","Múltiples deportes","Ranking de fuerza","Wellness avanzado","Onboarding dedicado"] },
];

const FAQS = [
  { q:"¿Necesito saber de tecnología para usar SportOS?", a:"No. Si sabes usar WhatsApp, sabes usar SportOS. El setup inicial tarda menos de 5 minutos y te guiamos en cada paso." },
  { q:"¿Funciona en celular?", a:"Sí, está diseñado primero para celular. Los jugadores marcan asistencia, ven la nómina y pagan su cuota desde su teléfono sin instalar nada." },
  { q:"¿Qué pasa con los datos de mis jugadores?", a:"Tus datos son tuyos. Están encriptados en servidores seguros. Nunca los compartimos ni vendemos. Puedes exportarlos cuando quieras." },
  { q:"¿Puedo cambiar de plan o cancelar?", a:"Sí, en cualquier momento y sin penalidad. Puedes subir, bajar o cancelar tu plan desde la configuración del club." },
  { q:"¿Funciona para cualquier deporte?", a:"Hoy soportamos Rugby, Fútbol, Handball, Basketball y Hockey. Cada deporte tiene sus propias posiciones, estadísticas y formaciones." },
  { q:"¿Qué pasa si mi club tiene varias categorías?", a:"Con el plan Pro puedes manejar todas las categorías — Sub-10, Sub-14, Primera, etc. — con sus propios jugadores y calendarios." },
];

// ── Componentes ─────────────────────────────────────────────────────────

function Section({ children, style={} }) {
  return (
    <section style={{ position:"relative", zIndex:1, padding:"80px clamp(16px,5vw,80px)", ...style }}>
      {children}
    </section>
  );
}

function SectionLabel({ text }) {
  return (
    <motion.div initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
      style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"5px 14px",
        borderRadius:"99px", background:"rgba(192,57,43,0.1)", border:"1px solid rgba(192,57,43,0.3)",
        marginBottom:"16px" }}>
      <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#C0392B", display:"inline-block" }}/>
      <span style={{ fontSize:"11px", fontWeight:700, color:"#C0392B", textTransform:"uppercase", letterSpacing:"0.1em" }}>{text}</span>
    </motion.div>
  );
}

function SectionHeading({ title, sub }) {
  return (
    <div style={{ marginBottom:"48px" }}>
      <motion.h2 initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
        style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:900, letterSpacing:"-0.03em",
          margin:"0 0 14px", lineHeight:1.1 }}>
        {title}
      </motion.h2>
      {sub && <motion.p initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{delay:0.1}}
        style={{ fontSize:"16px", color:"var(--text-2)", maxWidth:"580px", lineHeight:1.6, margin:0 }}>
        {sub}
      </motion.p>}
    </div>
  );
}

// ── Landing principal ─────────────────────────────────────────────────────

export default function LandingPage({ onLogin, onRegister, onJoinRequest }) {
  const [activeSport, setActiveSport] = useState(0);
  const [activeRole,  setActiveRole]  = useState("entrenador");
  const [openFaq,     setOpenFaq]     = useState(null);
  const [email,       setEmail]       = useState("");

  const sport = SPORTS[activeSport];
  const roleData = ROLES_FEATURES[activeRole];

  const handleCTA = () => {
    if (email.trim()) setTimeout(() => onRegister(), 200);
    else onRegister();
  };

  return (
    <div style={{ position:"relative", minHeight:"100vh", background:"var(--bg-base)",
      color:"var(--text-1)", fontFamily:"'Inter',system-ui,sans-serif", overflowX:"hidden",
      overflowY:"auto", height:"100vh" }}>
      <AuroraBg/>

      {/* ── NAV ── */}
      <nav style={{ position:"sticky", top:0, zIndex:50, display:"flex", alignItems:"center",
        justifyContent:"space-between", padding:"0 clamp(16px,5vw,80px)", height:"60px",
        background:"var(--bg-glass)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)",
        borderBottom:"1px solid var(--border-soft)" }}>
        <div style={{ fontWeight:900, fontSize:"18px", color:sport.color, letterSpacing:"-0.03em",
          filter:`drop-shadow(0 0 12px ${sport.color}66)` }}>⚡ SportOS</div>
        <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
          <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={onLogin}
            style={{ ...ss.btn, background:"transparent", color:"var(--text-2)",
              border:"1px solid var(--border-soft)", fontSize:"13px" }}>
            Ingresar
          </motion.button>
          {onJoinRequest && (
            <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={onJoinRequest}
              style={{ ...ss.btn, background:"transparent", color:"var(--text-2)",
                border:`1px solid ${sport.color}55`, fontSize:"13px", color:sport.color }}>
              🔑 Tengo un código
            </motion.button>
          )}
          <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={onRegister}
            style={{ ...ss.btn, background:`linear-gradient(135deg,${sport.color},${sport.color}cc)`,
              color:"#fff", fontSize:"13px", boxShadow:`0 4px 14px ${sport.color}44` }}>
            Crear club gratis →
          </motion.button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <Section style={{ textAlign:"center", paddingTop:"clamp(60px,10vh,120px)", paddingBottom:"60px" }}>

        {/* Sport pills */}
        <div style={{ display:"flex", justifyContent:"center", gap:"8px", marginBottom:"32px", flexWrap:"wrap" }}>
          {SPORTS.map((s,i) => (
            <motion.button key={i} whileHover={{scale:1.08}} whileTap={{scale:0.95}} onClick={()=>setActiveSport(i)}
              style={{ padding:"6px 14px", borderRadius:"99px", border:`1px solid ${i===activeSport?s.color+"55":"transparent"}`,
                cursor:"pointer", fontSize:"12px", fontWeight:600,
                background:i===activeSport?`${s.color}22`:"var(--bg-elev-2)",
                color:i===activeSport?s.color:"var(--text-3)", transition:"all 0.2s" }}>
              {s.icon} {s.name}
            </motion.button>
          ))}
        </div>

        {/* Dolor primero */}
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
          style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"6px 16px",
            borderRadius:"99px", background:"rgba(192,57,43,0.1)", border:"1px solid rgba(192,57,43,0.3)",
            marginBottom:"24px" }}>
          <span style={{ fontSize:"12px", color:"#C0392B", fontWeight:600 }}>
            ¿Todavía gestionas tu club con Excel y grupos de WhatsApp?
          </span>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.h1 key={activeSport} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
            exit={{opacity:0,y:-16}} transition={{duration:0.4}}
            style={{ fontSize:"clamp(40px,6.5vw,82px)", fontWeight:900, margin:"0 0 20px",
              lineHeight:1.05, letterSpacing:"-0.04em",
              background:`linear-gradient(135deg,#fff 0%,${sport.color} 100%)`,
              WebkitBackgroundClip:"text", backgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Tu club de {sport.name}<br/>merece algo mejor
          </motion.h1>
        </AnimatePresence>

        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}}
          style={{ fontSize:"clamp(16px,2vw,20px)", color:"var(--text-2)", maxWidth:"600px",
            margin:"0 auto 40px", lineHeight:1.6 }}>
          SportOS reemplaza las planillas, los grupos de WhatsApp y el caos administrativo.
          Plantel, asistencia, finanzas, wellness y comunicación — todo en un solo lugar.
        </motion.p>

        {/* CTA */}
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
          style={{ display:"flex", gap:"10px", justifyContent:"center", flexWrap:"wrap", marginBottom:"14px" }}>
          <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleCTA()}
            placeholder="tu@email.com"
            style={{ ...ss.input, width:"240px", fontSize:"14px", padding:"12px 16px" }}/>
          <motion.button whileHover={{scale:1.04,y:-2}} whileTap={{scale:0.97}} onClick={handleCTA}
            style={{ ...ss.btn, background:`linear-gradient(135deg,${sport.color},${sport.color}bb)`,
              color:"#fff", fontSize:"14px", padding:"12px 28px",
              boxShadow:`0 8px 24px ${sport.color}44`, fontWeight:700 }}>
            Empezar gratis →
          </motion.button>
        </motion.div>
        <div style={{ fontSize:"12px", color:"var(--text-3)" }}>
          14 días gratis · Sin tarjeta de crédito · Cancela cuando quieras
        </div>

        {/* Stats */}
        <div style={{ display:"flex", gap:"clamp(24px,5vw,64px)", justifyContent:"center",
          marginTop:"64px", flexWrap:"wrap" }}>
          {[["5","deportes"],["65+","clubes"],["3","países LATAM"],["4h","ahorradas/semana"]].map(([n,l],i) => (
            <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.4+i*0.08}}
              style={{ textAlign:"center" }}>
              <div style={{ fontSize:"clamp(24px,4vw,36px)", fontWeight:900, letterSpacing:"-0.03em",
                color:sport.color }}>{n}</div>
              <div style={{ fontSize:"12px", color:"var(--text-3)", marginTop:"4px",
                textTransform:"uppercase", letterSpacing:"0.08em" }}>{l}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── ANTES / DESPUÉS ── */}
      <Section style={{ background:"rgba(0,0,0,0.3)", borderTop:"1px solid var(--border-soft)", borderBottom:"1px solid var(--border-soft)" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto" }}>
          <SectionLabel text="El problema que resolvemos"/>
          <SectionHeading
            title="Deja el caos atrás"
            sub="Esto es lo que viven hoy la mayoría de clubes deportivos en LATAM. Y cómo SportOS lo cambia."/>
          <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 40px 1fr", gap:"0",
              marginBottom:"8px", fontSize:"11px", fontWeight:700, textTransform:"uppercase",
              letterSpacing:"0.08em" }}>
              <div style={{ color:"#EF4444", padding:"0 0 8px 12px" }}>😓 Antes</div>
              <div/>
              <div style={{ color:"#1FA04A", padding:"0 0 8px 12px" }}>✅ Con SportOS</div>
            </div>
            {PAIN_VS.map((row,i) => (
              <motion.div key={i} initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}}
                viewport={{once:true}} transition={{delay:i*0.07}}
                style={{ display:"grid", gridTemplateColumns:"1fr 40px 1fr", alignItems:"center", gap:"0" }}>
                <div style={{ padding:"14px 16px", borderRadius:"var(--r-md) 0 0 var(--r-md)",
                  background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.15)",
                  borderRight:"none", fontSize:"13px", color:"var(--text-2)" }}>
                  {row.antes}
                </div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"18px", background:"var(--bg-elev-2)",
                  border:"1px solid var(--border-soft)", height:"100%", borderLeft:"none", borderRight:"none" }}>
                  →
                </div>
                <div style={{ padding:"14px 16px", borderRadius:"0 var(--r-md) var(--r-md) 0",
                  background:"rgba(31,160,74,0.06)", border:"1px solid rgba(31,160,74,0.15)",
                  borderLeft:"none", fontSize:"13px", color:"var(--text-1)", fontWeight:500 }}>
                  {row.despues}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── CÓMO FUNCIONA ── */}
      <Section>
        <div style={{ maxWidth:"900px", margin:"0 auto", textAlign:"center" }}>
          <SectionLabel text="Cómo funciona"/>
          <SectionHeading title="En 3 pasos y menos de 5 minutos"/>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"20px", textAlign:"left" }}>
            {STEPS.map((step,i) => (
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
                viewport={{once:true}} transition={{delay:i*0.1}}
                style={{ ...ss.card, padding:"28px 24px", position:"relative", overflow:"hidden" }}>
                <div style={{ fontSize:"48px", fontWeight:900, color:"rgba(255,255,255,0.04)",
                  position:"absolute", top:"8px", right:"16px", lineHeight:1 }}>{step.num}</div>
                <div style={{ fontSize:"32px", marginBottom:"14px" }}>{step.icon}</div>
                <div style={{ fontWeight:800, fontSize:"16px", marginBottom:"8px" }}>{step.title}</div>
                <div style={{ fontSize:"13px", color:"var(--text-2)", lineHeight:1.6 }}>{step.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── FEATURES POR ROL ── */}
      <Section style={{ background:"rgba(0,0,0,0.2)", borderTop:"1px solid var(--border-soft)", borderBottom:"1px solid var(--border-soft)" }}>
        <div style={{ maxWidth:"960px", margin:"0 auto" }}>
          <SectionLabel text="Diseñado para cada rol"/>
          <SectionHeading
            title="Cada usuario ve lo que necesita"
            sub="Entrenadores, preparadores, admins y jugadores tienen su propia vista. Sin información de más ni de menos."/>

          {/* Tabs de roles */}
          <div style={{ display:"flex", gap:"8px", marginBottom:"32px", flexWrap:"wrap" }}>
            {Object.entries(ROLES_FEATURES).map(([key,r]) => (
              <motion.button key={key} whileTap={{scale:0.97}} onClick={()=>setActiveRole(key)}
                style={{ padding:"8px 18px", borderRadius:"99px", border:`1px solid ${activeRole===key?r.color+"55":"var(--border-soft)"}`,
                  cursor:"pointer", fontSize:"13px", fontWeight:activeRole===key?700:500,
                  background:activeRole===key?`${r.color}18`:"transparent",
                  color:activeRole===key?r.color:"var(--text-2)", transition:"all 0.2s" }}>
                {r.icon} {r.label}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeRole} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
              exit={{opacity:0,y:-10}} transition={{duration:0.3}}>
              <div style={{ marginBottom:"20px", fontSize:"14px", color:"var(--text-2)" }}>
                {roleData.desc}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"14px" }}>
                {roleData.features.map((f,i) => (
                  <motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
                    transition={{delay:i*0.07}}
                    style={{ ...ss.card, padding:"20px", display:"flex", gap:"14px", alignItems:"flex-start",
                      border:`1px solid ${roleData.color}22`,
                      background:`linear-gradient(135deg,${roleData.color}06,transparent)` }}>
                    <div style={{ fontSize:"24px", flexShrink:0 }}>{f.icon}</div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:"14px", marginBottom:"4px" }}>{f.title}</div>
                      <div style={{ fontSize:"12px", color:"var(--text-2)", lineHeight:1.5 }}>{f.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Section>

      {/* ── TESTIMONIOS ── */}
      <Section>
        <div style={{ maxWidth:"900px", margin:"0 auto" }}>
          <SectionLabel text="Lo que dicen los clubes"/>
          <SectionHeading title="Clubes reales. Resultados reales."/>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px" }}>
            {TESTIMONIALS.map((t,i) => (
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
                viewport={{once:true}} transition={{delay:i*0.1}}
                style={{ ...ss.card, padding:"24px", display:"flex", flexDirection:"column", gap:"14px" }}>
                <div style={{ display:"flex", gap:"2px" }}>
                  {"★".repeat(t.stars).split("").map((_,j) => (
                    <span key={j} style={{ color:"#C98408", fontSize:"14px" }}>★</span>
                  ))}
                </div>
                <div style={{ fontSize:"13px", color:"var(--text-2)", lineHeight:1.7, flex:1 }}>
                  "{t.text}"
                </div>
                <div>
                  <div style={{ fontWeight:700, fontSize:"13px" }}>{t.name}</div>
                  <div style={{ fontSize:"11px", color:"var(--text-3)", marginTop:"2px" }}>{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── PLANES ── */}
      <Section style={{ background:"rgba(0,0,0,0.3)", borderTop:"1px solid var(--border-soft)", borderBottom:"1px solid var(--border-soft)" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto", textAlign:"center" }}>
          <SectionLabel text="Planes"/>
          <SectionHeading
            title="Simple y transparente"
            sub="Sin costos ocultos. Sin contratos anuales forzados. Cancela cuando quieras."/>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px", textAlign:"left" }}>
            {PLANS.map((plan,i) => (
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
                viewport={{once:true}} transition={{delay:i*0.1}}
                style={{ ...ss.card, padding:"28px 24px", position:"relative", overflow:"hidden",
                  border:`1px solid ${plan.color}${plan.badge?"55":"22"}`,
                  background:plan.badge?`linear-gradient(135deg,${plan.color}10,transparent)`:"var(--bg-glass)" }}>
                {plan.badge && (
                  <div style={{ position:"absolute", top:"14px", right:"14px", fontSize:"10px",
                    fontWeight:700, padding:"3px 10px", borderRadius:"99px",
                    background:plan.color, color:"#fff" }}>{plan.badge}</div>
                )}
                <div style={{ fontSize:"14px", fontWeight:700, color:plan.color, marginBottom:"8px" }}>{plan.name}</div>
                <div style={{ display:"flex", alignItems:"baseline", gap:"4px", marginBottom:"4px" }}>
                  <span style={{ fontSize:"36px", fontWeight:900, letterSpacing:"-0.03em" }}>{plan.price}</span>
                  <span style={{ fontSize:"12px", color:"var(--text-3)" }}>{plan.period}</span>
                </div>
                <div style={{ height:"1px", background:"var(--border-soft)", margin:"18px 0" }}/>
                <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"24px" }}>
                  {plan.features.map((f,j) => (
                    <div key={j} style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"13px" }}>
                      <span style={{ color:plan.color, flexShrink:0, fontWeight:700 }}>✓</span>
                      <span style={{ color:"var(--text-2)" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <motion.button whileHover={{scale:1.03,y:-2}} whileTap={{scale:0.97}} onClick={onRegister}
                  style={{ ...ss.btn, width:"100%", padding:"12px",
                    background:plan.badge?`linear-gradient(135deg,${plan.color},${plan.color}cc)`:"transparent",
                    color:plan.badge?"#fff":plan.color,
                    border:`1px solid ${plan.color}55`,
                    fontSize:"13px", fontWeight:700,
                    boxShadow:plan.badge?`0 6px 20px ${plan.color}44`:"none" }}>
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── FAQ ── */}
      <Section>
        <div style={{ maxWidth:"720px", margin:"0 auto" }}>
          <SectionLabel text="Preguntas frecuentes"/>
          <SectionHeading title="Todo lo que necesitas saber"/>
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {FAQS.map((faq,i) => (
              <motion.div key={i} initial={{opacity:0,y:8}} whileInView={{opacity:1,y:0}}
                viewport={{once:true}} transition={{delay:i*0.06}}
                style={{ ...ss.card, padding:"0", overflow:"hidden",
                  border:`1px solid ${openFaq===i?"rgba(192,57,43,0.3)":"var(--border-soft)"}` }}>
                <button onClick={()=>setOpenFaq(openFaq===i?null:i)}
                  style={{ width:"100%", display:"flex", justifyContent:"space-between",
                    alignItems:"center", padding:"18px 20px", background:"transparent",
                    border:"none", cursor:"pointer", textAlign:"left", gap:"12px" }}>
                  <span style={{ fontSize:"14px", fontWeight:600, color:"var(--text-1)" }}>{faq.q}</span>
                  <motion.span animate={{rotate:openFaq===i?45:0}} transition={{duration:0.2}}
                    style={{ fontSize:"20px", color:"#C0392B", flexShrink:0, fontWeight:300 }}>+</motion.span>
                </button>
                <AnimatePresence>
                  {openFaq===i && (
                    <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}}
                      exit={{height:0,opacity:0}} transition={{duration:0.25}}
                      style={{ overflow:"hidden" }}>
                      <div style={{ padding:"0 20px 18px", fontSize:"13px", color:"var(--text-2)", lineHeight:1.7 }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── CTA FINAL ── */}
      <Section style={{ textAlign:"center", paddingBottom:"100px" }}>
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          style={{ maxWidth:"640px", margin:"0 auto" }}>
          <div style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:900, letterSpacing:"-0.03em",
            marginBottom:"16px", lineHeight:1.1 }}>
            Tu club merece una herramienta<br/>
            <span style={{ color:"#C0392B" }}>a la altura del equipo</span>
          </div>
          <p style={{ fontSize:"16px", color:"var(--text-2)", marginBottom:"36px", lineHeight:1.6 }}>
            Únete a los clubes de LATAM que ya dejaron el Excel atrás. Crea tu club gratis hoy.
          </p>
          <div style={{ display:"flex", gap:"10px", justifyContent:"center", flexWrap:"wrap", marginBottom:"16px" }}>
            <input value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="tu@email.com"
              style={{ ...ss.input, width:"240px", fontSize:"14px", padding:"12px 16px" }}/>
            <motion.button whileHover={{scale:1.04,y:-2}} whileTap={{scale:0.97}} onClick={handleCTA}
              style={{ ...ss.btn, background:"linear-gradient(135deg,#C0392B,#9B2335)",
                color:"#fff", fontSize:"14px", padding:"12px 28px",
                boxShadow:"0 8px 28px rgba(192,57,43,0.45)", fontWeight:700 }}>
              Empezar gratis →
            </motion.button>
          </div>
          <div style={{ fontSize:"12px", color:"var(--text-3)" }}>
            14 días gratis · Sin tarjeta · 5 minutos para configurar
          </div>
        </motion.div>
      </Section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:"1px solid var(--border-soft)", padding:"24px clamp(16px,5vw,80px)",
        display:"flex", justifyContent:"space-between", alignItems:"center",
        fontSize:"12px", color:"var(--text-3)", flexWrap:"wrap", gap:"12px",
        position:"relative", zIndex:1 }}>
        <div style={{ fontWeight:800, color:"#C0392B" }}>⚡ SportOS</div>
        <div>Rugby · Fútbol · Handball · Basketball · Hockey · LATAM</div>
        <div>© 2026 SportOS. Todos los derechos reservados.</div>
      </footer>
    </div>
  );
}
