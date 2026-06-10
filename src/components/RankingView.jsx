import { motion } from "framer-motion";
import { ss } from "../styles/tokens";
import ProgressBar from "./ProgressBar";
import MedalBadge from "./MedalBadge";

export default function RankingView({tab, setTab, sportColor, players, compact}) {
  const tabs = [{id:"volumen",label:"Volumen total"},{id:"1rm",label:"Fuerza 1RM"},{id:"cumplimiento",label:"Cumplimiento"},{id:"progreso",label:"Progreso"}];
  const sorted = [...players].filter(p=>p.gym).sort((a,b) => {
    if(tab==="volumen") return (b.gym.vol||0)-(a.gym.vol||0);
    if(tab==="cumplimiento") return (b.gym.pct||0)-(a.gym.pct||0);
    return (a.gym.rank||99)-(b.gym.rank||99);
  });
  const top3 = sorted.slice(0,3);
  const medalColors = ["#F59E0B","#94A3B8","#CD7F32"];
  return (
    <div style={{...ss.card,marginTop:compact?"8px":"0"}}>
      <div style={{fontWeight:700,fontSize:"14px",marginBottom:"12px",display:"flex",alignItems:"center",gap:"6px"}}>🏋️ Ranking de Fuerza</div>
      <div style={{display:"flex",gap:"4px",marginBottom:"16px",background:"var(--bg-elev-2)",borderRadius:"var(--r-md)",padding:"3px"}}>
        {tabs.map(t=>(
          <motion.button key={t.id} whileTap={{scale:0.97}} onClick={()=>setTab(t.id)} style={{...ss.btn,flex:1,background:tab===t.id?`linear-gradient(135deg,${sportColor}33,${sportColor}11)`:"transparent",color:tab===t.id?sportColor:"var(--text-2)",border:"none",fontSize:"10px",padding:"7px 4px",textTransform:"uppercase",letterSpacing:"0.05em",fontWeight:700,boxShadow:tab===t.id?`0 0 12px ${sportColor}33`:"none"}}>{t.label}</motion.button>
        ))}
      </div>
      {!compact&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",marginBottom:"16px"}}>
          {top3.map((p,i)=>(
            <motion.div key={p.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4,delay:i*0.1}} whileHover={{y:-4}} style={{...ss.card,textAlign:"center",border:`1px solid ${medalColors[i]}55`,background:`linear-gradient(135deg,${medalColors[i]}11,transparent)`,boxShadow:`0 0 20px ${medalColors[i]}22`}}>
              <div style={{fontSize:"28px",marginBottom:"4px",filter:`drop-shadow(0 0 12px ${medalColors[i]}66)`}}>{["🥇","🥈","🥉"][i]}</div>
              <div style={{fontSize:"13px",fontWeight:700,letterSpacing:"-0.01em"}}>{p.name.split(" ")[0]}</div>
              <div style={{fontSize:"16px",fontWeight:800,color:medalColors[i],margin:"6px 0",letterSpacing:"-0.02em"}}>{tab==="volumen"?`${(p.gym.vol||0).toLocaleString()} kg`:tab==="cumplimiento"?`${p.gym.pct}%`:`#${p.gym.rank}`}</div>
              <div style={{...ss.muted,fontSize:"10px"}}>{p.gym.pct}% cumplimiento {p.gym.pct===100?"🔥":""}</div>
            </motion.div>
          ))}
        </div>
      )}
      {sorted.slice(compact?0:3).map((p,i)=>{
        const rank = compact?i+1:i+4;
        const val = tab==="volumen"?(p.gym.vol||0):tab==="cumplimiento"?(p.gym.pct||0):(100-rank*5);
        const maxVal = tab==="volumen"?14200:100;
        return (
          <motion.div key={p.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{duration:0.3,delay:i*0.04}} style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px"}}>
            <MedalBadge rank={rank}/>
            <span style={{fontSize:"12px",minWidth:"110px",fontWeight:500}}>{p.name}</span>
            <div style={{flex:1}}><ProgressBar value={val} max={maxVal} color={rank===1?sportColor:rank<=3?"#94A3B8":"#4A5568"}/></div>
            <span style={{fontSize:"12px",fontWeight:700,minWidth:"65px",textAlign:"right",color:rank===1?sportColor:"var(--text-1)"}}>{tab==="volumen"?`${(p.gym.vol||0).toLocaleString()} kg`:tab==="cumplimiento"?`${p.gym.pct}% ${p.gym.pct===100?"🔥":""}`:tab==="1rm"?`${130+rank*5} kg`:`↑ +${Math.max(0,12-rank*2)}%`}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
