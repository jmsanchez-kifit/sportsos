import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, scaleIn } from "../styles/motion";
import { ss } from "../styles/tokens";
import { GYM_PLAN } from "../data/gymPlan";
import { PLAYERS_RUGBY } from "../data/players";
import SectionTitle from "../components/SectionTitle";
import Stat from "../components/Stat";
import Badge from "../components/Badge";
import RankingView from "../components/RankingView";

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
      <SectionTitle title={`Estado del plantel — Semana ${GYM_PLAN.week}`} sub="Cumplimiento de sesiones prescritas"/>
      <motion.div {...fadeUp} style={{...ss.card,padding:0,overflow:"hidden"}}>
        <table style={{width:"100%",fontSize:"12px",borderCollapse:"collapse"}}>
          <thead><tr>{["Jugador","Lunes","Miércoles","Viernes","Cumplimiento"].map(h=><th key={h} style={{textAlign:"left",color:"var(--text-3)",padding:"14px 12px",fontWeight:600,borderBottom:"1px solid var(--border-soft)",textTransform:"uppercase",letterSpacing:"0.05em",fontSize:"10px"}}>{h}</th>)}</tr></thead>
          <tbody>{compliance.map((p,i)=>(
            <motion.tr key={i} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.3,delay:i*0.05}} style={{borderBottom:"1px solid var(--border-soft)"}}>
              <td style={{padding:"12px",fontWeight:500}}>{p.name}</td>
              {p.d.map((s,j)=><td key={j} style={{padding:"12px",textAlign:"center",fontSize:"18px"}}>{statusIcon(s)}</td>)}
              <td style={{padding:"12px"}}><span style={{color:p.pct===100?"#22C55E":p.pct>=67?"#F59E0B":"#EF4444",fontWeight:700}}>{p.pct}% {p.pct===100?"🔥":p.pct>=67?"⚠️":"⏳"}</span></td>
            </motion.tr>
          ))}</tbody>
        </table>
      </motion.div>
    </div>
  );

  if(module==="rankingfuerza") return <RankingView tab={rankTab} setTab={setRankTab} sportColor={sportColor} players={PLAYERS_RUGBY}/>;

  return null;
}
