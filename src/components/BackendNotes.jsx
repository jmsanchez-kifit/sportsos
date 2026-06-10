import { motion } from "framer-motion";
import { ss } from "../styles/tokens";

const NOTES = [
  {title:"Config del club",body:"clubs.settings JSONB: { sports:['rugby','futbol'], colors:{primary,secondary}, country:'CL', payment_method:'khipu' }. Al activar un deporte se crean sus categorías estándar."},
  {title:"Multi-deporte y formaciones",body:"Posiciones, stats y tamaños vienen de SPORTS_CONFIG. Las formaciones (4-4-2, 4-3-3, 3-5-2, 3-4-3...) se guardan en lineups.formation y definen los slots y sus coordenadas en cancha."},
  {title:"Multi-equipo",body:"Un club tiene N equipos (teams): Primer Equipo, Reserva, Sub-20. Cada lineup referencia team_id, así un mismo club arma varias nóminas independientes en paralelo."},
  {title:"Planificación de cargas",body:"gym_plans: team_id, coach_id, week_start, sessions JSONB. Al publicar: notifications para el plantel + push FCM + WhatsApp opcional."},
  {title:"Registro del jugador",body:"gym_logs con columnas generadas one_rm_kg = peso × (1 + reps/30) y volume_kg = peso × reps. prescribed_weight = último 1RM × pct_1rm."},
  {title:"Pagos LATAM",body:"transactions.provider: khipu, webpay, mercadopago, pix, spei, pse, yape, nequi, oxxo. Comisión 3% a commission_records con doc fiscal según país."},
];

export default function BackendNotes({open, setOpen}) {
  return (
    <div style={{marginTop:"32px",borderTop:"1px solid var(--border-soft)",paddingTop:"16px"}}>
      <motion.button whileHover={{background:"var(--bg-elev-2)"}} onClick={()=>setOpen(!open)} style={{...ss.btn,background:"transparent",color:"var(--text-2)",border:"1px solid var(--border-soft)",width:"100%",textAlign:"left",fontSize:"13px",padding:"10px 14px"}}>📋 Notas para el Backend Developer {open?"▲":"▼"}</motion.button>
      {open&&(
        <div style={{marginTop:"12px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
          {NOTES.map((n,i)=>(
            <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.3,delay:i*0.05}} style={{...ss.card,padding:"12px"}}>
              <div style={{fontWeight:700,fontSize:"12px",color:"#3B82F6",marginBottom:"6px",display:"flex",alignItems:"center",gap:"6px"}}>🔧 {n.title}</div>
              <div style={{fontSize:"11px",color:"var(--text-2)",lineHeight:1.6}}>{n.body}</div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
