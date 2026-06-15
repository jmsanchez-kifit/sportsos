import { useState as useLocalState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, scaleIn } from "../styles/motion";
import { ss } from "../styles/tokens";
import { GYM_PLAN } from "../data/gymPlan";
import { PLAYERS_RUGBY } from "../data/players";
import SectionTitle from "../components/SectionTitle";
import Stat from "../components/Stat";
import Badge from "../components/Badge";
import RankingView from "../components/RankingView";

// ── Zonas corporales para golpes ──────────────────────────────────────────
const BODY_ZONES = [
  { id:"cabeza",       label:"Cabeza / Cuello",    icon:"🪖", row:0, col:1 },
  { id:"hombro-izq",   label:"Hombro Izq.",        icon:"💪", row:1, col:0 },
  { id:"hombro-der",   label:"Hombro Der.",        icon:"💪", row:1, col:2 },
  { id:"torso",        label:"Torso / Costillas",  icon:"🫁", row:1, col:1 },
  { id:"espalda",      label:"Espalda / Lumbar",   icon:"🔙", row:2, col:1 },
  { id:"cadera",       label:"Cadera / Glúteo",    icon:"🦵", row:3, col:1 },
  { id:"muslo-izq",    label:"Muslo Izq.",          icon:"🦵", row:4, col:0 },
  { id:"muslo-der",    label:"Muslo Der.",          icon:"🦵", row:4, col:2 },
  { id:"rodilla-izq",  label:"Rodilla Izq.",        icon:"🦴", row:5, col:0 },
  { id:"rodilla-der",  label:"Rodilla Der.",        icon:"🦴", row:5, col:2 },
  { id:"tobillo-izq",  label:"Tobillo Izq.",        icon:"🦶", row:6, col:0 },
  { id:"tobillo-der",  label:"Tobillo Der.",        icon:"🦶", row:6, col:2 },
];
const SEVERIDAD_CONFIG = {
  leve:     { label:"Leve",     color:"#C98408", desc:"Molestia, no limita" },
  moderado: { label:"Moderado", color:"#C0532B", desc:"Duele al esfuerzo" },
  grave:    { label:"Grave",    color:"#C0392B", desc:"Limita la actividad" },
};

// ── Wellness data (Hooper Index estándar) ─────────────────────────────────
// Cada campo: 1=muy malo/alto  5=excelente/bajo
// Score total /25 — < 13: alerta  ≤ 9: lesionado candidato
const WELLNESS_MOCK = [
  { name:"Andrés Castro",   num:1,  pos:"Prop",         cat:"Primer Equipo", filled24h:true,  filled48h:true,
    w24:{ sueño:4, fatiga:4, dolor:3, estres:4, animo:4 },
    w48:{ sueño:5, fatiga:4, dolor:4, estres:4, animo:5 },
    lesion:null,
    golpes:[{ zona:"hombro-der", sev:"leve", desc:"Impacto en tackle" }] },
  { name:"Felipe Morales",  num:4,  pos:"Lock",         cat:"Primer Equipo", filled24h:true,  filled48h:true,
    w24:{ sueño:2, fatiga:2, dolor:2, estres:3, animo:2 },
    w48:{ sueño:2, fatiga:2, dolor:1, estres:3, animo:2 },
    lesion:"Dolor isquiotibial derecho",
    golpes:[{ zona:"muslo-der", sev:"grave", desc:"Estirón en sprint" }, { zona:"rodilla-der", sev:"moderado", desc:"Impacto en ruck" }] },
  { name:"Diego Saavedra",  num:7,  pos:"Flanker",      cat:"Primer Equipo", filled24h:true,  filled48h:false,
    w24:{ sueño:3, fatiga:2, dolor:2, estres:2, animo:3 },
    w48:null,
    lesion:null,
    golpes:[{ zona:"torso", sev:"leve", desc:"Golpe costillas izq." }, { zona:"cabeza", sev:"leve", desc:"Choque sin pérdida de conciencia" }] },
  { name:"Cristóbal Vega",  num:10, pos:"Apertura",     cat:"Primer Equipo", filled24h:false, filled48h:false,
    w24:null, w48:null, lesion:null, golpes:[] },
  { name:"Matías Herrera",  num:2,  pos:"Hooker",       cat:"Primer Equipo", filled24h:true,  filled48h:true,
    w24:{ sueño:5, fatiga:5, dolor:5, estres:5, animo:5 },
    w48:{ sueño:5, fatiga:5, dolor:5, estres:5, animo:5 },
    lesion:null, golpes:[] },
  { name:"Pablo Rodríguez", num:9,  pos:"Scrum Half",   cat:"Primer Equipo", filled24h:true,  filled48h:true,
    w24:{ sueño:3, fatiga:3, dolor:3, estres:4, animo:3 },
    w48:{ sueño:4, fatiga:3, dolor:3, estres:4, animo:4 },
    lesion:null,
    golpes:[{ zona:"hombro-izq", sev:"leve", desc:"Caída en tackle" }] },
  { name:"Luis Pérez",      num:15, pos:"Fullback",     cat:"Primer Equipo", filled24h:true,  filled48h:true,
    w24:{ sueño:2, fatiga:1, dolor:2, estres:2, animo:2 },
    w48:{ sueño:2, fatiga:1, dolor:1, estres:2, animo:2 },
    lesion:"Esguince tobillo izquierdo — no entrena",
    golpes:[{ zona:"tobillo-izq", sev:"grave", desc:"Torsión al pisar mal" }, { zona:"cadera", sev:"leve", desc:"Golpe en contención" }] },
  { name:"Carlos Núñez",    num:11, pos:"Ala",          cat:"Reserva",       filled24h:true,  filled48h:true,
    w24:{ sueño:3, fatiga:3, dolor:4, estres:3, animo:4 },
    w48:{ sueño:4, fatiga:3, dolor:4, estres:3, animo:4 },
    lesion:null, golpes:[] },
  { name:"Jorge Fuentes",   num:6,  pos:"Flanker",      cat:"Reserva",       filled24h:false, filled48h:false,
    w24:null, w48:null, lesion:null, golpes:[] },
  { name:"Ricardo Álvarez", num:3,  pos:"Prop Abierto", cat:"Reserva",       filled24h:true,  filled48h:true,
    w24:{ sueño:4, fatiga:4, dolor:4, estres:5, animo:4 },
    w48:{ sueño:4, fatiga:5, dolor:4, estres:5, animo:5 },
    lesion:null,
    golpes:[{ zona:"espalda", sev:"leve", desc:"Esfuerzo en scrum" }] },
  { name:"Tomás Espinoza",  num:21, pos:"Centro",       cat:"M18",           filled24h:true,  filled48h:false,
    w24:{ sueño:5, fatiga:5, dolor:5, estres:5, animo:5 },
    w48:null, lesion:null, golpes:[] },
  { name:"Ignacio Reyes",   num:22, pos:"Ala",          cat:"M18",           filled24h:false, filled48h:false,
    w24:null, w48:null, lesion:null, golpes:[] },
  { name:"Sebastián Moya",  num:31, pos:"Apertura",     cat:"M16",           filled24h:true,  filled48h:true,
    w24:{ sueño:3, fatiga:2, dolor:2, estres:3, animo:3 },
    w48:{ sueño:3, fatiga:2, dolor:2, estres:3, animo:3 },
    lesion:"Dolor rodilla izq — en observación", golpes:[{ zona:"rodilla-izq", sev:"moderado", desc:"Golpe en tackle" }] },
];

function scoreOf(w) {
  if (!w) return null;
  return w.sueño + w.fatiga + w.dolor + w.estres + w.animo;
}
function alertLevel(player) {
  if (player.lesion) return "lesionado";
  const s = scoreOf(player.w48) ?? scoreOf(player.w24);
  if (s === null) return "pendiente";
  if (s <= 10) return "alerta-roja";
  if (s <= 14) return "alerta";
  return "ok";
}
const ALERT_COLOR   = { ok:"#1FA04A", alerta:"#C98408", "alerta-roja":"#C0392B", lesionado:"#C0392B", pendiente:"#6B5A5A" };
const ALERT_LABEL   = { ok:"OK", alerta:"Alerta", "alerta-roja":"Alerta roja", lesionado:"Lesionado", pendiente:"Sin datos" };
const ALERT_ICON    = { ok:"🟢", alerta:"🟡", "alerta-roja":"🔴", lesionado:"🚑", pendiente:"⏳" };

const W_LABELS = [
  { key:"sueño",  icon:"😴", label:"Sueño",          lo:"Muy malo", hi:"Excelente" },
  { key:"fatiga", icon:"⚡", label:"Fatiga",          lo:"Extrema",  hi:"Ninguna" },
  { key:"dolor",  icon:"💢", label:"Dolor muscular",  lo:"Intenso",  hi:"Ninguno" },
  { key:"estres", icon:"🧠", label:"Estrés",          lo:"Muy alto", hi:"Ninguno" },
  { key:"animo",  icon:"😊", label:"Ánimo",           lo:"Muy bajo", hi:"Excelente" },
];

function WellnessModal({ onClose, sportColor }) {
  const [demoValues, setDemoValues] = useLocalState({ sueño:3, fatiga:3, dolor:3, estres:3, animo:3 });
  const [selectedZones, setSelectedZones] = useLocalState({});   // { zoneId: severidad }
  const [activeZone, setActiveZone]       = useLocalState(null); // zona pendiente de asignar severidad
  const score  = Object.values(demoValues).reduce((a,b)=>a+b,0);
  const status = score <= 10 ? "alerta-roja" : score <= 14 ? "alerta" : "ok";
  const color  = ALERT_COLOR[status];

  const toggleZone = (id) => {
    if (selectedZones[id]) {
      setSelectedZones(p => { const n={...p}; delete n[id]; return n; });
      setActiveZone(null);
    } else {
      setActiveZone(id);
    }
  };
  const assignSev = (sev) => {
    if (!activeZone) return;
    setSelectedZones(p => ({ ...p, [activeZone]: sev }));
    setActiveZone(null);
  };

  const zoneCount = Object.keys(selectedZones).length;

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.72)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}>
      <motion.div initial={{opacity:0,y:24,scale:0.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:24,scale:0.97}}
        transition={{type:"spring",stiffness:280,damping:26}}
        style={{background:"var(--bg-glass-strong)",backdropFilter:"blur(28px)",WebkitBackdropFilter:"blur(28px)",border:"1px solid var(--border-mid)",borderRadius:"var(--r-xl)",padding:"28px",maxWidth:"480px",width:"100%",boxShadow:"var(--shadow-lg)",maxHeight:"92vh",overflowY:"auto"}}>

        {/* Encabezado */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"20px"}}>
          <div>
            <div style={{fontWeight:800,fontSize:"16px",marginBottom:"4px"}}>📋 Cuestionario de Wellness</div>
            <div style={{fontSize:"11px",color:"var(--text-3)"}}>Post partido · Las últimas 24 horas</div>
          </div>
          <button onClick={onClose} style={{background:"var(--bg-elev-2)",border:"1px solid var(--border-soft)",color:"var(--text-2)",borderRadius:"var(--r-sm)",padding:"4px 10px",cursor:"pointer",fontSize:"12px"}}>✕</button>
        </div>

        {/* Aviso de contexto */}
        <div style={{background:"rgba(192,57,43,0.08)",border:"1px solid rgba(192,57,43,0.2)",borderRadius:"var(--r-md)",padding:"10px 14px",marginBottom:"20px",fontSize:"11px",color:"var(--text-2)",display:"flex",alignItems:"center",gap:"8px"}}>
          <span>📣</span>
          <span>Enviado <strong style={{color:"var(--text-1)"}}>automáticamente 24 h después</strong> del partido vs Cóndores Norte del sábado.</span>
        </div>

        {/* ── Sección 1: Wellness ── */}
        <div style={{fontWeight:700,fontSize:"12px",color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"14px"}}>1 · Estado general</div>
        {W_LABELS.map(wl => (
          <div key={wl.key} style={{marginBottom:"18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}>
              <div style={{fontWeight:600,fontSize:"13px"}}>{wl.icon} {wl.label}</div>
              <div style={{fontWeight:800,fontSize:"15px",color:sportColor}}>{demoValues[wl.key]}<span style={{fontSize:"10px",color:"var(--text-3)",fontWeight:400}}>/5</span></div>
            </div>
            <input type="range" min={1} max={5} value={demoValues[wl.key]}
              onChange={e=>setDemoValues(p=>({...p,[wl.key]:Number(e.target.value)}))}
              style={{width:"100%",accentColor:sportColor,cursor:"pointer"}}/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"9px",color:"var(--text-4)",marginTop:"2px"}}>
              <span>1 — {wl.lo}</span><span>5 — {wl.hi}</span>
            </div>
          </div>
        ))}

        {/* ── Sección 2: Golpes y lesiones ── */}
        <div style={{borderTop:"1px solid var(--border-soft)",paddingTop:"20px",marginTop:"4px",marginBottom:"16px"}}>
          <div style={{fontWeight:700,fontSize:"12px",color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"4px"}}>2 · Golpes y lesiones</div>
          <div style={{fontSize:"11px",color:"var(--text-3)",marginBottom:"14px"}}>Toca las zonas del cuerpo donde recibiste un golpe o sientes dolor</div>

          {/* Grid de zonas corporales */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"6px",marginBottom:"12px"}}>
            {BODY_ZONES.map(z => {
              const sev = selectedZones[z.id];
              const isActive = activeZone === z.id;
              const sevColor = sev ? SEVERIDAD_CONFIG[sev].color : null;
              return (
                <motion.button key={z.id} whileHover={{scale:1.04}} whileTap={{scale:0.96}}
                  onClick={()=>toggleZone(z.id)}
                  style={{
                    padding:"8px 6px",borderRadius:"var(--r-sm)",border:`1px solid ${sev?sevColor+"66":isActive?sportColor+"88":"var(--border-soft)"}`,
                    background:sev?`${sevColor}15`:isActive?`${sportColor}12`:"var(--bg-elev-1)",
                    color:sev?sevColor:isActive?sportColor:"var(--text-3)",
                    cursor:"pointer",fontSize:"10px",fontWeight:sev||isActive?700:400,
                    display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",
                    boxShadow:isActive?`0 0 8px ${sportColor}44`:"none",
                    transition:"all 0.2s"
                  }}>
                  <span style={{fontSize:"14px"}}>{z.icon}</span>
                  <span style={{lineHeight:1.2,textAlign:"center"}}>{z.label}</span>
                  {sev && <span style={{fontSize:"8px",fontWeight:700,color:sevColor,padding:"1px 5px",borderRadius:"99px",background:`${sevColor}18`,border:`1px solid ${sevColor}33`}}>{SEVERIDAD_CONFIG[sev].label}</span>}
                </motion.button>
              );
            })}
          </div>

          {/* Selector de severidad al tocar una zona */}
          <AnimatePresence>
            {activeZone && (
              <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
                style={{background:"var(--bg-elev-2)",border:"1px solid var(--border-mid)",borderRadius:"var(--r-md)",padding:"14px",marginBottom:"12px"}}>
                <div style={{fontSize:"11px",color:"var(--text-2)",marginBottom:"10px",fontWeight:600}}>
                  📍 {BODY_ZONES.find(z=>z.id===activeZone)?.label} — ¿Qué tan intenso?
                </div>
                <div style={{display:"flex",gap:"8px"}}>
                  {Object.entries(SEVERIDAD_CONFIG).map(([k,v])=>(
                    <motion.button key={k} whileHover={{scale:1.05}} whileTap={{scale:0.95}}
                      onClick={()=>assignSev(k)}
                      style={{flex:1,padding:"10px 8px",borderRadius:"var(--r-sm)",border:`1px solid ${v.color}55`,background:`${v.color}12`,color:v.color,cursor:"pointer",fontSize:"11px",fontWeight:700,display:"flex",flexDirection:"column",alignItems:"center",gap:"2px"}}>
                      <span style={{fontWeight:800}}>{v.label}</span>
                      <span style={{fontSize:"9px",fontWeight:400,color:"var(--text-3)"}}>{v.desc}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Resumen zonas seleccionadas */}
          {zoneCount > 0 && (
            <div style={{fontSize:"11px",color:"var(--text-3)",padding:"8px 12px",background:"var(--bg-elev-1)",borderRadius:"var(--r-sm)",border:"1px solid var(--border-soft)"}}>
              {zoneCount} zona{zoneCount>1?"s":""} reportada{zoneCount>1?"s":""}:&nbsp;
              {Object.entries(selectedZones).map(([id,sev])=>(
                <span key={id} style={{color:SEVERIDAD_CONFIG[sev].color,fontWeight:600}}>
                  {BODY_ZONES.find(z=>z.id===id)?.label} ({SEVERIDAD_CONFIG[sev].label})&nbsp;
                </span>
              ))}
            </div>
          )}
          {zoneCount === 0 && !activeZone && (
            <div style={{fontSize:"11px",color:"var(--text-4)",textAlign:"center",padding:"8px"}}>Sin golpes reportados</div>
          )}
        </div>

        {/* Score resultado */}
        <div style={{background:`${color}12`,border:`1px solid ${color}33`,borderRadius:"var(--r-md)",padding:"14px",marginBottom:"16px",display:"flex",alignItems:"center",gap:"12px"}}>
          <div style={{width:"42px",height:"42px",borderRadius:"50%",background:`${color}22`,border:`2px solid ${color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",flexShrink:0}}>{ALERT_ICON[status]}</div>
          <div>
            <div style={{fontWeight:700,fontSize:"14px",color}}>{ALERT_LABEL[status]}</div>
            <div style={{fontSize:"11px",color:"var(--text-3)"}}>Score: {score}/25 — {score<=10?"Carga alta, revisar con médico":score<=14?"Monitorear en entrenamiento":"Apto para entrenar normalmente"}</div>
          </div>
        </div>

        <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}}
          style={{...ss.btn,width:"100%",background:`linear-gradient(135deg,${sportColor},${sportColor}cc)`,color:"#fff",padding:"12px",fontSize:"13px",fontWeight:700,boxShadow:`0 4px 14px ${sportColor}44`}}>
          Enviar respuesta
        </motion.button>
        <div style={{textAlign:"center",fontSize:"10px",color:"var(--text-4)",marginTop:"8px"}}>Vista previa — en la app real lo llena el jugador desde su celular</div>
      </motion.div>
    </motion.div>
  );
}

function GolpesView({ sportColor }) {
  // Contar frecuencia de golpes por zona en todo el plantel
  const zoneCounts = {};
  WELLNESS_MOCK.forEach(p => (p.golpes||[]).forEach(g => {
    if (!zoneCounts[g.zona]) zoneCounts[g.zona] = { leve:0, moderado:0, grave:0, total:0 };
    zoneCounts[g.zona][g.sev]++;
    zoneCounts[g.zona].total++;
  }));

  const maxCount = Math.max(1, ...Object.values(zoneCounts).map(z=>z.total));
  const totalGolpes  = Object.values(zoneCounts).reduce((a,z)=>a+z.total,0);
  const graves       = WELLNESS_MOCK.filter(p=>(p.golpes||[]).some(g=>g.sev==="grave"));
  const conGolpes    = WELLNESS_MOCK.filter(p=>(p.golpes||[]).length>0);

  const heatColor = (zoneId) => {
    const z = zoneCounts[zoneId];
    if (!z) return "var(--bg-elev-2)";
    const pct = z.total / maxCount;
    if (z.grave > 0) return `rgba(192,57,43,${0.25 + pct*0.55})`;
    if (z.moderado > 0) return `rgba(192,83,43,${0.2 + pct*0.45})`;
    return `rgba(201,132,8,${0.15 + pct*0.35})`;
  };
  const heatBorder = (zoneId) => {
    const z = zoneCounts[zoneId];
    if (!z) return "var(--border-soft)";
    if (z.grave > 0) return "rgba(192,57,43,0.6)";
    if (z.moderado > 0) return "rgba(192,83,43,0.5)";
    return "rgba(201,132,8,0.4)";
  };

  return (
    <div>
      <SectionTitle title="Golpes y lesiones" sub="Reportados por jugadores · Post partido vs Cóndores Norte"/>

      {/* Stats rápidos */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px",marginBottom:"24px"}}>
        <Stat label="Golpes totales"   value={totalGolpes}       sub="Reportados"       color="#C0392B" icon="💥" delay={0}/>
        <Stat label="Jugadores afect." value={conGolpes.length}  sub="Con al menos 1"   color="#C98408" icon="🩹" delay={0.05}/>
        <Stat label="Golpes graves"    value={graves.length}     sub="Requieren control" color="#C0392B" icon="🚑" delay={0.1}/>
        <Stat label="Sin reportes"     value={WELLNESS_MOCK.filter(p=>!(p.golpes||[]).length).length} sub="Jugadores" color="#6B5A5A" icon="✅" delay={0.15}/>
      </div>

      {/* Mapa de calor corporal */}
      <motion.div {...fadeUp} style={{...ss.card,marginBottom:"24px"}}>
        <div style={{fontWeight:700,fontSize:"13px",marginBottom:"4px"}}>🗺️ Mapa de impacto del plantel</div>
        <div style={{fontSize:"11px",color:"var(--text-3)",marginBottom:"16px"}}>Zonas más golpeadas del partido — intensidad por frecuencia y severidad</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px",maxWidth:"380px",margin:"0 auto"}}>
          {BODY_ZONES.map(z => {
            const zd = zoneCounts[z.id];
            return (
              <div key={z.id} style={{padding:"10px 8px",borderRadius:"var(--r-sm)",border:`1px solid ${heatBorder(z.id)}`,background:heatColor(z.id),textAlign:"center",transition:"all 0.3s"}}>
                <div style={{fontSize:"18px",marginBottom:"2px"}}>{z.icon}</div>
                <div style={{fontSize:"10px",fontWeight:600,color:"var(--text-2)",lineHeight:1.2,marginBottom:"4px"}}>{z.label}</div>
                {zd ? (
                  <div style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                    {zd.grave>0    && <span style={{fontSize:"9px",color:"#C0392B",fontWeight:700}}>🔴 {zd.grave} grave{zd.grave>1?"s":""}</span>}
                    {zd.moderado>0 && <span style={{fontSize:"9px",color:"#C0532B",fontWeight:700}}>🟠 {zd.moderado} mod.</span>}
                    {zd.leve>0     && <span style={{fontSize:"9px",color:"#C98408",fontWeight:600}}>🟡 {zd.leve} leve{zd.leve>1?"s":""}</span>}
                  </div>
                ) : (
                  <span style={{fontSize:"9px",color:"var(--text-4)"}}>Sin golpes</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Leyenda */}
        <div style={{display:"flex",gap:"16px",justifyContent:"center",marginTop:"16px",flexWrap:"wrap"}}>
          {[["🔴","Grave","#C0392B"],["🟠","Moderado","#C0532B"],["🟡","Leve","#C98408"]].map(([icon,label,color])=>(
            <div key={label} style={{display:"flex",alignItems:"center",gap:"4px",fontSize:"10px",color}}>
              <span>{icon}</span><span style={{fontWeight:600}}>{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Lista de jugadores con golpes */}
      <div style={{fontWeight:700,fontSize:"13px",marginBottom:"12px",display:"flex",alignItems:"center",gap:"8px"}}>
        <span>💥</span> Detalle por jugador
        <div style={{flex:1,height:"1px",background:"var(--border-soft)"}}/>
      </div>
      {conGolpes.length === 0 && (
        <div style={{textAlign:"center",padding:"32px",color:"var(--text-3)",fontSize:"13px"}}>Sin golpes reportados en este partido</div>
      )}
      {conGolpes.map((p,i) => (
        <motion.div key={p.name} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
          style={{...ss.card,marginBottom:"10px",padding:"14px 16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"10px"}}>
            <div style={{width:"34px",height:"34px",borderRadius:"50%",background:"rgba(192,57,43,0.15)",border:"2px solid rgba(192,57,43,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"12px",color:"#C0392B",flexShrink:0}}>{p.num}</div>
            <div>
              <div style={{fontWeight:700,fontSize:"13px"}}>{p.name}</div>
              <div style={{fontSize:"11px",color:"var(--text-3)"}}>{p.pos} · {p.cat}</div>
            </div>
            <div style={{marginLeft:"auto",display:"flex",gap:"6px",flexWrap:"wrap",justifyContent:"flex-end"}}>
              {(p.golpes||[]).map((g,j)=>(
                <span key={j} style={{fontSize:"10px",padding:"2px 8px",borderRadius:"99px",background:`${SEVERIDAD_CONFIG[g.sev].color}15`,color:SEVERIDAD_CONFIG[g.sev].color,border:`1px solid ${SEVERIDAD_CONFIG[g.sev].color}33`,fontWeight:600}}>
                  {SEVERIDAD_CONFIG[g.sev].label}
                </span>
              ))}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
            {(p.golpes||[]).map((g,j)=>{
              const zone = BODY_ZONES.find(z=>z.id===g.zona);
              const sc   = SEVERIDAD_CONFIG[g.sev];
              return (
                <div key={j} style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 10px",borderRadius:"var(--r-sm)",background:`${sc.color}08`,border:`1px solid ${sc.color}22`}}>
                  <span style={{fontSize:"14px"}}>{zone?.icon}</span>
                  <div style={{flex:1}}>
                    <span style={{fontWeight:600,fontSize:"12px",color:sc.color}}>{zone?.label}</span>
                    {g.desc && <span style={{fontSize:"11px",color:"var(--text-3)"}}> — {g.desc}</span>}
                  </div>
                  <span style={{fontSize:"10px",color:sc.color,fontWeight:700,flexShrink:0}}>{sc.label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function EstadoPlantelView({ sportColor }) {
  const [showModal, setShowModal] = useLocalState(false);
  const [selected, setSelected]   = useLocalState(null);
  const [tab, setTab]             = useLocalState("wellness"); // "wellness" | "golpes"
  const [catFilter, setCatFilter] = useLocalState("Todas");

  const allCats = ["Todas", ...Array.from(new Set(WELLNESS_MOCK.map(p => p.cat)))];
  const withLevel = WELLNESS_MOCK.map(p => ({ ...p, level: alertLevel(p), score: scoreOf(p.w48) ?? scoreOf(p.w24) }));
  const filtered  = catFilter === "Todas" ? withLevel : withLevel.filter(p => p.cat === catFilter);

  const lesionados = filtered.filter(p => p.level === "lesionado");
  const alertaRoja = filtered.filter(p => p.level === "alerta-roja");
  const alertas    = filtered.filter(p => p.level === "alerta");
  const ok         = filtered.filter(p => p.level === "ok");
  const pendientes = filtered.filter(p => p.level === "pendiente");

  const totalFilled = filtered.filter(p => p.filled24h || p.filled48h).length;
  const avgScore    = (() => {
    const scored = filtered.filter(p => p.score !== null);
    if (!scored.length) return 0;
    return Math.round(scored.reduce((a,b)=>a+b.score,0)/scored.length);
  })();
  const teamStatus  = avgScore >= 19 ? "ok" : avgScore >= 14 ? "alerta" : "alerta-roja";

  const PlayerCard = ({ p }) => (
    <motion.div whileHover={{y:-2}} onClick={()=>setSelected(p===selected?null:p)} key={p.name}
      style={{...ss.card,padding:"14px 16px",cursor:"pointer",border:`1px solid ${ALERT_COLOR[p.level]}33`,background:`${ALERT_COLOR[p.level]}08`,marginBottom:"8px"}}>
      <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
        <div style={{width:"36px",height:"36px",borderRadius:"50%",background:`${ALERT_COLOR[p.level]}22`,border:`2px solid ${ALERT_COLOR[p.level]}55`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"12px",color:ALERT_COLOR[p.level],flexShrink:0}}>{p.num}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:700,fontSize:"13px"}}>{p.name}</div>
          <div style={{fontSize:"11px",color:"var(--text-3)"}}>{p.pos} · {p.cat}</div>
          {p.lesion && <div style={{fontSize:"10px",color:ALERT_COLOR.lesionado,marginTop:"2px",fontWeight:600}}>🩹 {p.lesion}</div>}
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{fontWeight:800,fontSize:"13px",color:ALERT_COLOR[p.level]}}>{ALERT_ICON[p.level]} {ALERT_LABEL[p.level]}</div>
          {p.score!==null && <div style={{fontSize:"10px",color:"var(--text-3)"}}>{p.score}/25</div>}
        </div>
      </div>

      {/* Detalle expandible */}
      <AnimatePresence>
        {selected===p && p.score!==null && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
            transition={{duration:0.25}} style={{overflow:"hidden"}}>
            <div style={{marginTop:"14px",paddingTop:"12px",borderTop:"1px solid var(--border-soft)"}}>
              <div style={{fontSize:"10px",color:"var(--text-3)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"10px"}}>Última respuesta ({p.filled48h?"48h":"24h"} post partido)</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"8px"}}>
                {W_LABELS.map(wl=>{
                  const val = (p.filled48h?p.w48:p.w24)?.[wl.key] ?? 0;
                  const c   = val>=4?"#1FA04A":val>=3?"#C98408":"#C0392B";
                  return (
                    <div key={wl.key} style={{textAlign:"center"}}>
                      <div style={{fontSize:"16px"}}>{wl.icon}</div>
                      <div style={{fontWeight:800,fontSize:"14px",color:c}}>{val}</div>
                      <div style={{fontSize:"9px",color:"var(--text-4)"}}>{wl.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const TABS = [
    { id:"wellness", label:"💊 Wellness", badge: lesionados.length+alertaRoja.length+alertas.length > 0 ? lesionados.length+alertaRoja.length+alertas.length : null },
    { id:"golpes",   label:"💥 Golpes y lesiones", badge: WELLNESS_MOCK.flatMap(p=>p.golpes||[]).filter(g=>g.sev==="grave").length || null },
  ];

  return (
    <div>
      {/* ── Notificación automática ── */}
      <motion.div {...fadeUp} style={{...ss.card,marginBottom:"20px",padding:"12px 16px",background:"rgba(192,57,43,0.06)",border:"1px solid rgba(192,57,43,0.2)",display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap"}}>
        <div style={{width:"32px",height:"32px",borderRadius:"50%",background:"rgba(192,57,43,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",flexShrink:0}}>📣</div>
        <div style={{flex:1,minWidth:200}}>
          <div style={{fontWeight:700,fontSize:"12px",marginBottom:"2px"}}>Cuestionario wellness enviado automáticamente</div>
          <div style={{fontSize:"11px",color:"var(--text-3)"}}>Notificación push + WhatsApp · <strong>Partido vs Cóndores Norte</strong> · sábado hace 2 días</div>
        </div>
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap",alignItems:"center"}}>
          <div style={{textAlign:"center",padding:"6px 12px",borderRadius:"var(--r-sm)",background:"rgba(31,160,74,0.12)",border:"1px solid rgba(31,160,74,0.25)"}}>
            <div style={{fontWeight:800,fontSize:"16px",color:"#1FA04A"}}>{totalFilled}</div>
            <div style={{fontSize:"9px",color:"var(--text-3)"}}>respondieron</div>
          </div>
          <div style={{textAlign:"center",padding:"6px 12px",borderRadius:"var(--r-sm)",background:"rgba(201,132,8,0.12)",border:"1px solid rgba(201,132,8,0.25)"}}>
            <div style={{fontWeight:800,fontSize:"16px",color:"#C98408"}}>{pendientes.length}</div>
            <div style={{fontSize:"9px",color:"var(--text-3)"}}>pendientes</div>
          </div>
          <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={()=>setShowModal(true)}
            style={{...ss.btn,background:"rgba(192,57,43,0.15)",color:"#C0392B",border:"1px solid rgba(192,57,43,0.3)",fontSize:"11px",padding:"6px 12px"}}>
            Ver cuestionario
          </motion.button>
        </div>
      </motion.div>

      {/* ── Resumen por categoría ── */}
      <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"16px"}}>
        {allCats.map(cat => {
          const catPlayers = cat === "Todas" ? withLevel : withLevel.filter(p => p.cat === cat);
          const catAlerta  = catPlayers.filter(p => p.level === "lesionado" || p.level === "alerta-roja" || p.level === "alerta").length;
          const catOk      = catPlayers.filter(p => p.level === "ok").length;
          const catPend    = catPlayers.filter(p => p.level === "pendiente").length;
          const semColor   = catAlerta > 0 ? "#C0392B" : catPend > catOk ? "#C98408" : "#1FA04A";
          const semIcon    = catAlerta > 0 ? "🔴" : catPend > catOk ? "🟡" : "🟢";
          return (
            <motion.button key={cat} whileHover={{y:-1}} whileTap={{scale:0.97}}
              onClick={() => setCatFilter(cat)}
              style={{...ss.btn, padding:"7px 14px", fontSize:"12px",
                background: catFilter===cat ? `${semColor}18` : "var(--bg-elev-2)",
                border: `1px solid ${catFilter===cat ? semColor+"55" : "var(--border-soft)"}`,
                color: catFilter===cat ? semColor : "var(--text-2)",
                fontWeight: catFilter===cat ? 700 : 500,
                boxShadow: catFilter===cat ? `0 0 12px ${semColor}22` : "none",
                gap:"6px"}}>
              <span>{semIcon}</span> {cat}
              <span style={{fontSize:"10px",color:"var(--text-3)",fontWeight:400}}>({catPlayers.length})</span>
            </motion.button>
          );
        })}
      </div>

      {/* ── Pestañas ── */}
      <div style={{display:"flex",gap:"6px",marginBottom:"20px",borderBottom:"1px solid var(--border-soft)",paddingBottom:"0"}}>
        {TABS.map(t=>(
          <motion.button key={t.id} whileHover={{y:-1}} onClick={()=>setTab(t.id)}
            style={{...ss.btn,background:"transparent",color:tab===t.id?"var(--text-1)":"var(--text-3)",borderBottom:`2px solid ${tab===t.id?sportColor:"transparent"}`,borderRadius:0,padding:"8px 14px 10px",fontSize:"12px",gap:"6px",position:"relative",flexShrink:0}}>
            {t.label}
            {t.badge && <span style={{fontSize:"9px",padding:"1px 5px",borderRadius:"99px",background:"#C0392B",color:"#fff",fontWeight:800,marginLeft:"2px"}}>{t.badge}</span>}
          </motion.button>
        ))}
      </div>

      {/* ── Contenido por pestaña ── */}
      <AnimatePresence mode="wait">
        {tab === "wellness" && (
          <motion.div key="wellness" initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} exit={{opacity:0,x:8}} transition={{duration:0.2}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px",marginBottom:"24px"}}>
              <Stat label="Estado general" value={avgScore+"/25"} sub={ALERT_LABEL[teamStatus]} color={ALERT_COLOR[teamStatus]} icon={ALERT_ICON[teamStatus]} delay={0}/>
              <Stat label="Lesionados" value={lesionados.length} sub="No entrenan" color="#C0392B" icon="🚑" delay={0.05}/>
              <Stat label="En alerta" value={alertaRoja.length+alertas.length} sub="Monitorear" color="#C98408" icon="⚠️" delay={0.1}/>
              <Stat label="Aptos" value={ok.length} sub="Pueden entrenar" color="#1FA04A" icon="✅" delay={0.15}/>
            </div>
            {(lesionados.length > 0 || alertaRoja.length > 0 || alertas.length > 0) && (
              <div style={{marginBottom:"24px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px"}}>
                  <span>🚨</span>
                  <div style={{fontWeight:700,fontSize:"13px",color:"#C0392B"}}>Requieren atención</div>
                  <div style={{flex:1,height:"1px",background:"rgba(192,57,43,0.2)"}}/>
                </div>
                {[...lesionados,...alertaRoja,...alertas].map(p=><PlayerCard key={p.name} p={p}/>)}
              </div>
            )}
            {pendientes.length > 0 && (
              <div style={{marginBottom:"24px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px"}}>
                  <span>⏳</span>
                  <div style={{fontWeight:700,fontSize:"13px",color:"var(--text-3)"}}>Sin respuesta ({pendientes.length})</div>
                  <div style={{flex:1,height:"1px",background:"var(--border-soft)"}}/>
                </div>
                {pendientes.map(p=><PlayerCard key={p.name} p={p}/>)}
              </div>
            )}
            {ok.length > 0 && (
              <div>
                <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px"}}>
                  <span>✅</span>
                  <div style={{fontWeight:700,fontSize:"13px",color:"#1FA04A"}}>Aptos ({ok.length})</div>
                  <div style={{flex:1,height:"1px",background:"rgba(31,160,74,0.2)"}}/>
                </div>
                {ok.map(p=><PlayerCard key={p.name} p={p}/>)}
              </div>
            )}
          </motion.div>
        )}
        {tab === "golpes" && (
          <motion.div key="golpes" initial={{opacity:0,x:8}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-8}} transition={{duration:0.2}}>
            <GolpesView sportColor={sportColor}/>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal cuestionario */}
      <AnimatePresence>
        {showModal && <WellnessModal onClose={()=>setShowModal(false)} sportColor={sportColor}/>}
      </AnimatePresence>
    </div>
  );
}

export default function PreparadorView({module, sp, showToast, sportColor, publishedPlan, setPublishedPlan, newExForm, setNewExForm, newEx, setNewEx, gymPlanExercises, setGymPlanExercises, rankTab, setRankTab, expandedDay, setExpandedDay, userCats=[], isDemo=true}) {
  const days = ["lunes","miercoles","viernes"];
  const dayLabels = {lunes:"Lunes",miercoles:"Miércoles",viernes:"Viernes"};
  const planSessions = gymPlanExercises || GYM_PLAN.sessions;

  const addExercise = () => {
    if(!newEx.name){showToast("Escribe el nombre del ejercicio","warning");return;}
    const day = expandedDay;
    setGymPlanExercises(prev=>{const base=prev||GYM_PLAN.sessions;return {...base,[day]:{...base[day],exercises:[...base[day].exercises,{...newEx}]}};});
    setNewEx({name:"",sets:3,reps:8,pct:70,rest:120,notes:"",muscles:""});
    setNewExForm(false);
    showToast(`${newEx.name} agregado al ${dayLabels[day]}`,"success");
  };

  const allCompliance = [
    {name:"Andrés Castro",   cat:"Primer Equipo", d:["ok","ok","ok"],        pct:100},
    {name:"Felipe Morales",  cat:"Primer Equipo", d:["ok","ok","parcial"],   pct:83},
    {name:"Diego Saavedra",  cat:"Reserva",       d:["ok","parcial","pendiente"],pct:67},
    {name:"Cristóbal Vega",  cat:"Primer Equipo", d:["pendiente","pendiente","pendiente"],pct:0},
    {name:"Matías Herrera",  cat:"Reserva",       d:["ok","ok","ok"],        pct:100},
    {name:"Pablo Rodríguez", cat:"Sub-20",        d:["ok","ok","ok"],        pct:100},
  ];
  const compliance = isDemo ? allCompliance : allCompliance.filter(p=>userCats.includes(p.cat));

  const CatsBanner = () => !isDemo && userCats.length > 0 ? (
    <motion.div {...fadeUp} style={{...ss.card, marginBottom:"14px", padding:"10px 14px", background:"linear-gradient(135deg,rgba(239,68,68,0.08),transparent)", border:"1px solid rgba(239,68,68,0.2)", display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap"}}>
      <span style={{fontSize:"11px",color:"var(--text-2)"}}>💪 Tus categorías:</span>
      {userCats.map(c=><span key={c} style={{fontSize:"11px",padding:"2px 10px",borderRadius:"99px",background:"rgba(239,68,68,0.12)",color:"#F87171",border:"1px solid rgba(239,68,68,0.25)",fontWeight:600}}>{c}</span>)}
    </motion.div>
  ) : null;
  const statusIcon = (s)=>s==="ok"?"✅":s==="parcial"?"⚠️":"⏳";

  if(module==="microciclo") return (
    <div>
      <CatsBanner/>
      <SectionTitle title={`Microciclo — Semana ${GYM_PLAN.week}`} sub={`${GYM_PLAN.coach} · ${sp.name}`}
        action={<motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={()=>{setPublishedPlan(true);showToast("Plan publicado. 15 jugadores notificados vía push y WhatsApp 📱","success");}} style={{...ss.btn,background:publishedPlan?"rgba(34,197,94,0.15)":"linear-gradient(135deg,#22C55E,#16A34A)",color:publishedPlan?"#22C55E":"#fff",border:`1px solid ${publishedPlan?"#22C55E55":"transparent"}`,fontSize:"12px",boxShadow:publishedPlan?"none":"0 4px 12px rgba(34,197,94,0.35)"}}>{publishedPlan?"✅ Plan publicado":"📢 Publicar plan"}</motion.button>}
      />
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px",marginBottom:"20px"}}>
        <Stat label="Plan activo" value="Semana 8" sub="Pretemporada 2025" color={sportColor} icon="📅" delay={0.05}/>
        <Stat label="Cumplimiento" value="78%" sub="Promedio plantel" color="#22C55E" icon="✅" delay={0.1}/>
        <Stat label="Récords" value="4" sub="Esta semana" color="#F59E0B" icon="🏆" delay={0.15}/>
        <Stat label="Volumen total" value="184.300 kg" sub="Todo el plantel" color="#A855F7" icon="💪" delay={0.2}/>
      </div>
      <div style={{display:"flex",gap:"8px",marginBottom:"16px",flexWrap:"wrap"}}>
        {days.map(d=>(
          <motion.button key={d} whileHover={{y:-2}} whileTap={{scale:0.97}} onClick={()=>setExpandedDay(d)} style={{...ss.btn,background:expandedDay===d?`linear-gradient(135deg,${sportColor}33,${sportColor}11)`:"var(--bg-elev-2)",color:expandedDay===d?sportColor:"var(--text-2)",border:`1px solid ${expandedDay===d?sportColor+"55":"var(--border-soft)"}`,fontSize:"12px",padding:"10px 16px",textAlign:"left",boxShadow:expandedDay===d?`0 0 16px ${sportColor}33`:"none",display:"flex",flexDirection:"column",alignItems:"flex-start",gap:"2px"}}>
            <span style={{fontWeight:700}}>{dayLabels[d]}</span>
            <span style={{fontSize:"10px",opacity:0.7}}>{planSessions[d].label}</span>
          </motion.button>
        ))}
      </div>
      <motion.div {...fadeUp} key={expandedDay} style={ss.card}>
        <div style={{fontWeight:600,marginBottom:"14px",fontSize:"14px",color:sportColor,display:"flex",alignItems:"center",gap:"8px"}}>🏋️ {dayLabels[expandedDay]} — {planSessions[expandedDay].label}</div>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 2fr",gap:"10px",marginBottom:"10px",padding:"0 4px"}}>
          {["Ejercicio","Series × Reps","% 1RM","Descanso","Músculos"].map(h=><div key={h} style={{...ss.label,fontSize:"9px",marginBottom:0}}>{h}</div>)}
        </div>
        {planSessions[expandedDay].exercises.map((ex,i)=>(
          <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.3,delay:i*0.06}} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 2fr",gap:"10px",padding:"12px 4px",borderTop:"1px solid var(--border-soft)",alignItems:"center"}}>
            <div style={{fontWeight:600,fontSize:"13px"}}>{ex.name}</div>
            <div><Badge color={sportColor} size="md">{ex.sets}×{ex.reps}</Badge></div>
            <div style={{fontSize:"12px",color:ex.pct?"var(--text-1)":"var(--text-3)"}}>{ex.pct?ex.pct+"%":"—"}</div>
            <div style={{...ss.muted,fontSize:"11px"}}>{ex.rest}s</div>
            <div style={{...ss.muted,fontSize:"11px"}}>{ex.muscles||"—"}</div>
          </motion.div>
        ))}
        <div style={{marginTop:"16px",borderTop:"1px solid var(--border-soft)",paddingTop:"14px"}}>
          {!newExForm
            ? <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={()=>setNewExForm(true)} style={{...ss.btn,background:"transparent",color:"#3B82F6",border:"1px dashed rgba(59,130,246,0.4)",fontSize:"12px",padding:"10px 16px"}}>+ Nuevo ejercicio</motion.button>
            : <motion.div {...scaleIn} style={{background:"linear-gradient(135deg,rgba(59,130,246,0.08),rgba(59,130,246,0.02))",borderRadius:"var(--r-md)",padding:"16px",border:"1px solid rgba(59,130,246,0.25)"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginBottom:"10px"}}>
                  <div><div style={ss.label}>Ejercicio</div><input value={newEx.name} onChange={e=>setNewEx(p=>({...p,name:e.target.value}))} placeholder="Ej: Sentadilla" style={ss.input}/></div>
                  <div><div style={ss.label}>Series</div><input type="number" value={newEx.sets} onChange={e=>setNewEx(p=>({...p,sets:Number(e.target.value)}))} style={ss.input}/></div>
                  <div><div style={ss.label}>Reps</div><input type="number" value={newEx.reps} onChange={e=>setNewEx(p=>({...p,reps:Number(e.target.value)}))} style={ss.input}/></div>
                  <div><div style={ss.label}>% 1RM</div><input type="number" value={newEx.pct} onChange={e=>setNewEx(p=>({...p,pct:Number(e.target.value)}))} style={ss.input}/></div>
                  <div><div style={ss.label}>Descanso (s)</div><input type="number" value={newEx.rest} onChange={e=>setNewEx(p=>({...p,rest:Number(e.target.value)}))} style={ss.input}/></div>
                  <div><div style={ss.label}>Músculos</div><input value={newEx.muscles} onChange={e=>setNewEx(p=>({...p,muscles:e.target.value}))} placeholder="Cuádriceps" style={ss.input}/></div>
                </div>
                <input value={newEx.notes} onChange={e=>setNewEx(p=>({...p,notes:e.target.value}))} placeholder="Notas técnicas..." style={{...ss.input,marginBottom:"12px"}}/>
                <div style={{display:"flex",gap:"8px"}}>
                  <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={addExercise} style={{...ss.btn,background:"linear-gradient(135deg,#3B82F6,#2563EB)",color:"#fff",fontSize:"12px",boxShadow:"0 4px 12px rgba(59,130,246,0.35)"}}>Agregar</motion.button>
                  <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={()=>setNewExForm(false)} style={{...ss.btn,background:"transparent",color:"var(--text-2)",border:"1px solid var(--border-soft)",fontSize:"12px"}}>Cancelar</motion.button>
                </div>
              </motion.div>
          }
        </div>
      </motion.div>
    </div>
  );

  if(module==="estadoplantel") return (
    <div>
      <CatsBanner/>
      <EstadoPlantelView sportColor={sportColor}/>
    </div>
  );

  if(module==="rankingfuerza") return <RankingView tab={rankTab} setTab={setRankTab} sportColor={sportColor} players={PLAYERS_RUGBY}/>;

  return null;
}
