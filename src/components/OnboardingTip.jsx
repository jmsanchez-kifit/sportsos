import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TIP_KEY = "sportos_onboarding_done";

export default function OnboardingTip({ sportColor="#22C55E", onGoToMuro }) {
  const [visible, setVisible] = useState(false);
  const [step, setStep]       = useState(0);

  const TIPS = [
    { icon:"👋", title:"¡Bienvenido a SportOS!", desc:"Te mostramos en 3 pasos dónde está todo.", cta:"Empezar tour" },
    { icon:"💬", title:"El Muro — empieza aquí", desc:"Es el feed del equipo. Publica resultados, insignias y retos. Los jugadores reaccionan y comentan.", cta:"Ver El Muro →", action: onGoToMuro },
    { icon:"✅", title:"Asistencia con un toque", desc:"Ve a Asistencia y toca cada jugador para marcarlo presente. Se guarda automáticamente.", cta:"Entendido ✓", last:true },
  ];

  useEffect(() => {
    const done = localStorage.getItem(TIP_KEY);
    if (!done) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(TIP_KEY, "1");
    setVisible(false);
  };

  const next = () => {
    const tip = TIPS[step];
    if (tip.action) tip.action();
    if (tip.last || step >= TIPS.length - 1) { dismiss(); return; }
    setStep(s => s + 1);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Overlay semi-transparente */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,zIndex:180,pointerEvents:"none",background:"rgba(0,0,0,0.3)"}}/>

          {/* Tooltip */}
          <motion.div
            initial={{opacity:0, scale:0.85, y:20}}
            animate={{opacity:1, scale:1, y:0}}
            exit={{opacity:0, scale:0.85, y:20}}
            transition={{type:"spring",stiffness:250,damping:24}}
            style={{position:"fixed",bottom:"clamp(80px,12vh,120px)",right:"clamp(12px,4vw,32px)",zIndex:190,maxWidth:"300px",background:"var(--bg-glass-strong)",backdropFilter:"blur(28px)",WebkitBackdropFilter:"blur(28px)",borderRadius:"var(--r-xl)",border:`1px solid ${sportColor}44`,boxShadow:`0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px ${sportColor}22`,overflow:"hidden"}}>

            {/* Barra de progreso de pasos */}
            <div style={{display:"flex",gap:"4px",padding:"12px 16px 0"}}>
              {TIPS.map((_,i)=>(
                <div key={i} style={{flex:1,height:"3px",borderRadius:"2px",background:i<=step?sportColor:"var(--bg-elev-3)",transition:"background 0.3s"}}/>
              ))}
            </div>

            <div style={{padding:"16px"}}>
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-16}} transition={{duration:0.2}}>
                  <div style={{fontSize:"32px",marginBottom:"10px"}}>{TIPS[step].icon}</div>
                  <div style={{fontWeight:700,fontSize:"14px",marginBottom:"6px",color:"var(--text-1)"}}>{TIPS[step].title}</div>
                  <div style={{fontSize:"12px",color:"var(--text-2)",lineHeight:1.6,marginBottom:"16px"}}>{TIPS[step].desc}</div>
                </motion.div>
              </AnimatePresence>

              <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
                <button onClick={dismiss}
                  style={{background:"transparent",border:"none",color:"var(--text-4)",fontSize:"11px",cursor:"pointer",padding:"4px",flexShrink:0}}>
                  Saltar
                </button>
                <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={next}
                  style={{flex:1,padding:"9px 16px",borderRadius:"var(--r-sm)",background:`linear-gradient(135deg,${sportColor},${sportColor}cc)`,color:"#fff",border:"none",cursor:"pointer",fontSize:"12px",fontWeight:700,boxShadow:`0 4px 14px ${sportColor}44`}}>
                  {TIPS[step].cta}
                </motion.button>
              </div>
            </div>

            {/* Flecha decorativa */}
            <div style={{position:"absolute",bottom:"-8px",right:"28px",width:"16px",height:"16px",background:"var(--bg-glass-strong)",border:`1px solid ${sportColor}44`,borderTop:"none",borderLeft:"none",transform:"rotate(45deg)",borderRadius:"2px"}}/>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
