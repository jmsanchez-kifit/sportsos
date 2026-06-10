import { motion } from "framer-motion";

export default function Token({x, y, num, player, pos, color, onDrop, onClick, dragging, mine}) {
  const filled = !!player;
  const surname = player ? player.name.split(" ").slice(-1)[0] : pos;
  const borderEmpty = dragging ? `2px dashed ${color}` : "1.5px dashed rgba(255,255,255,0.25)";
  const circleBorder = filled ? (mine ? "2px solid #F59E0B" : `2px solid ${color}`) : borderEmpty;
  const circleShadow = filled
    ? (mine ? "0 0 0 2px #F59E0B66, 0 0 16px #F59E0B99, 0 4px 12px rgba(0,0,0,0.4)" : `0 0 0 1px ${color}33, 0 4px 12px ${color}55`)
    : "none";
  return (
    <motion.div
      initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}}
      transition={{type:"spring",stiffness:300,damping:18}}
      onDragOver={onDrop ? e=>e.preventDefault() : undefined}
      onDrop={onDrop ? e=>{e.preventDefault();onDrop();} : undefined}
      onClick={onClick}
      whileHover={onClick?{scale:1.12,transition:{duration:0.15}}:{}}
      whileTap={onClick?{scale:0.95}:{}}
      style={{position:"absolute",left:`${x}%`,top:`${y}%`,transform:"translate(-50%,-50%)",textAlign:"center",width:"50px",zIndex:mine?3:2,cursor:onClick?"pointer":"default"}}
    >
      <div style={{width:"30px",height:"30px",borderRadius:"50%",margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:700,background:filled?(mine?"#F59E0B":color):(dragging?color+"33":"rgba(255,255,255,0.06)"),color:filled?"#fff":"var(--text-2)",border:circleBorder,boxShadow:circleShadow,transition:"all 0.2s var(--ease-out)"}}>
        {num}
      </div>
      <div style={{fontSize:"8px",marginTop:"3px",color:filled?(mine?"#F59E0B":"var(--text-1)"):"var(--text-4)",fontWeight:filled?600:400,lineHeight:1.1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",textShadow:filled?"0 1px 2px rgba(0,0,0,0.6)":"none"}}>{surname}{mine?" ⭐":""}</div>
    </motion.div>
  );
}
