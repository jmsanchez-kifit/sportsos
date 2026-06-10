import { useEffect } from "react";
import { motion } from "framer-motion";
import { slideRight } from "../styles/motion";

export default function Toast({msg, type, onClose}) {
  useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t); }, []);
  const colors = {success:"linear-gradient(135deg,#22C55E,#16A34A)",warning:"linear-gradient(135deg,#F59E0B,#D97706)",error:"linear-gradient(135deg,#EF4444,#DC2626)",info:"linear-gradient(135deg,#3B82F6,#2563EB)"};
  const icons  = {success:"✓",warning:"⚠",error:"✕",info:"ℹ"};
  return (
    <motion.div {...slideRight}
      style={{position:"fixed",top:"80px",right:"20px",background:colors[type]||colors.success,color:"#fff",padding:"12px 18px 12px 14px",borderRadius:"var(--r-md)",zIndex:9999,fontWeight:600,fontSize:"13px",boxShadow:"var(--shadow-lg)",maxWidth:"340px",display:"flex",alignItems:"center",gap:"10px",border:"1px solid rgba(255,255,255,0.15)"}}>
      <span style={{width:"22px",height:"22px",borderRadius:"50%",background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",flexShrink:0,fontWeight:800}}>{icons[type]||icons.info}</span>
      <span style={{lineHeight:1.35}}>{msg}</span>
    </motion.div>
  );
}
