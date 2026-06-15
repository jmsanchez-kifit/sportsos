import { useState } from "react";
import { motion } from "framer-motion";
import { SPORTS_CONFIG } from "../data/sports";
import AuroraBg from "../components/AuroraBg";
import { ss } from "../styles/tokens";
import BackButton from "../components/BackButton";

export default function OnboardingScreen({onSelect, onBack}) {
  const [selSport, setSelSport] = useState(null);
  const [selCountry] = useState("CL");
  return (
    <div style={{position:"relative",height:"100vh",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",overflow:"auto"}}>
      <AuroraBg/>
      {onBack && (
        <div style={{position:"fixed",top:"16px",left:"20px",zIndex:10}}>
          <BackButton onClick={onBack} label="Inicio"/>
        </div>
      )}
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8,ease:[0.16,1,0.3,1]}} style={{position:"relative",zIndex:2,textAlign:"center",maxWidth:"900px",width:"100%"}}>
        <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:0.6,type:"spring",stiffness:120}} style={{display:"inline-flex",alignItems:"center",gap:"10px",padding:"8px 18px",borderRadius:"99px",background:"var(--bg-glass)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",border:"1px solid var(--border-soft)",marginBottom:"24px"}}>
          <span style={{width:"8px",height:"8px",borderRadius:"50%",background:"#22C55E",boxShadow:"0 0 12px #22C55E",animation:"pulse-soft 2s infinite"}}/>
          <span style={{fontSize:"11px",color:"var(--text-2)",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase"}}>Plataforma operativa en LATAM</span>
        </motion.div>
        <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.1}}
          style={{fontSize:"clamp(48px,7vw,84px)",fontWeight:900,margin:0,lineHeight:1,letterSpacing:"-0.04em",background:"linear-gradient(135deg,#fff 0%,#A8B3CF 50%,#6E5BFF 100%)",WebkitBackgroundClip:"text",backgroundClip:"text",WebkitTextFillColor:"transparent"}}>
          ⚡ SportOS
        </motion.h1>
        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.7,delay:0.3}} style={{color:"var(--text-2)",fontSize:"18px",margin:"16px 0 0",fontWeight:400}}>La plataforma deportiva de América Latina</motion.p>
        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.7,delay:0.4}} style={{color:"var(--text-3)",fontSize:"13px",margin:"6px 0 0"}}>5 deportes · 65 clubes · Multi-rol · Multi-país</motion.p>
      </motion.div>

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.5}} style={{position:"relative",zIndex:2,fontSize:"12px",color:"var(--text-3)",margin:"40px 0 18px",textTransform:"uppercase",letterSpacing:"0.15em",fontWeight:600}}>— Elige tu deporte —</motion.div>

      <div style={{position:"relative",zIndex:2,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"14px",maxWidth:"900px",width:"100%",marginBottom:"40px"}}>
        {Object.entries(SPORTS_CONFIG).map(([k,v],i)=>(
          <motion.button key={k}
            initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
            transition={{duration:0.5,delay:0.6+i*0.08,ease:[0.16,1,0.3,1]}}
            whileHover={{y:-6,scale:1.03}} whileTap={{scale:0.97}}
            onClick={()=>setSelSport(k)}
            data-sport={k}
            style={{
              background:selSport===k?`linear-gradient(135deg,${v.color}25,${v.color}10)`:ss.card.background,
              border:selSport===k?`2px solid ${v.color}`:"1px solid var(--border-soft)",
              borderRadius:"var(--r-lg)",padding:"24px 14px",textAlign:"center",cursor:"pointer",
              backdropFilter:"blur(16px) saturate(160%)",WebkitBackdropFilter:"blur(16px) saturate(160%)",
              boxShadow:selSport===k?`0 0 32px ${v.color}55, 0 12px 24px rgba(0,0,0,0.3)`:"var(--shadow-sm)",
              transition:"all 0.3s var(--ease-out)",position:"relative",overflow:"hidden",fontFamily:"inherit",
            }}
          >
            <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:selSport===k?`linear-gradient(90deg,transparent,${v.color},transparent)`:"transparent"}}/>
            <motion.div animate={selSport===k?{scale:[1,1.15,1],rotate:[0,-5,5,0]}:{}} transition={{duration:0.5}} style={{fontSize:"42px",marginBottom:"12px",filter:selSport===k?`drop-shadow(0 0 12px ${v.color})`:"none"}}>{v.icon}</motion.div>
            <div style={{fontWeight:700,fontSize:"14px",color:selSport===k?v.color:"var(--text-1)",letterSpacing:"-0.01em"}}>{v.name}</div>
            <div style={{fontSize:"10px",color:"var(--text-3)",marginTop:"6px",textTransform:"uppercase",letterSpacing:"0.08em"}}>{v.matchDuration}</div>
            {selSport===k&&<motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:300}} style={{position:"absolute",top:"10px",right:"10px",width:"22px",height:"22px",borderRadius:"50%",background:v.color,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"13px",fontWeight:800,boxShadow:`0 0 16px ${v.color}`}}>✓</motion.div>}
          </motion.button>
        ))}
      </div>

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:1.1}} style={{position:"relative",zIndex:2,display:"flex",alignItems:"center",gap:"10px",marginBottom:"32px",background:"var(--bg-glass)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",border:"1px solid var(--border-soft)",borderRadius:"99px",padding:"10px 18px"}}>
        <span style={{fontSize:"20px"}}>🇨🇱</span>
        <span style={{fontSize:"13px",color:"var(--text-1)",fontWeight:500}}>Chile</span>
        <span style={{color:"var(--text-3)"}}>·</span>
        <span style={{fontSize:"12px",color:"var(--text-2)"}}>CLP · Khipu · Boleta SII</span>
      </motion.div>

      <motion.button
        initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:1.2}}
        whileHover={selSport?{scale:1.05}:{}} whileTap={selSport?{scale:0.95}:{}}
        onClick={()=>{if(selSport)onSelect(selSport,selCountry);}}
        disabled={!selSport}
        data-sport={selSport||"rugby"}
        style={{
          position:"relative",zIndex:2,
          background:selSport?`linear-gradient(135deg,${SPORTS_CONFIG[selSport].color},${SPORTS_CONFIG[selSport].color}dd)`:"rgba(255,255,255,0.06)",
          color:selSport?"#fff":"var(--text-3)",
          padding:"16px 44px",fontSize:"15px",fontWeight:700,borderRadius:"99px",
          border:selSport?"none":"1px solid var(--border-soft)",
          cursor:selSport?"pointer":"not-allowed",
          boxShadow:selSport?`0 8px 32px ${SPORTS_CONFIG[selSport].color}55`:"none",
          fontFamily:"inherit",letterSpacing:"0.01em",
        }}
      >{selSport?"Explorar demo →":"Selecciona un deporte"}</motion.button>

      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.7,delay:1.4}} style={{position:"relative",zIndex:2,marginTop:"48px",display:"flex",gap:"40px",color:"var(--text-3)",fontSize:"11px",flexWrap:"wrap",justifyContent:"center"}}>
        {[["65","clubes activos"],["6","países LATAM"],["5","deportes"],["99.9%","uptime"]].map(([n,l],i)=>(
          <div key={i} style={{textAlign:"center"}}>
            <div style={{fontSize:"20px",fontWeight:800,color:"var(--text-1)",letterSpacing:"-0.02em"}}>{n}</div>
            <div style={{marginTop:"2px",textTransform:"uppercase",letterSpacing:"0.08em"}}>{l}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
