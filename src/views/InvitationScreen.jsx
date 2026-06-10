import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, scaleIn } from "../styles/motion";
import { ss } from "../styles/tokens";
import AuroraBg from "../components/AuroraBg";

const ROL_INFO = {
  superadmin: { label:"Super Admin", icon:"⚡", color:"#A855F7", desc:"Acceso total a la plataforma SportOS." },
  admin:       { label:"Admin Club",  icon:"🏢", color:"#3B82F6", desc:"Gestiona el club, jugadores y finanzas." },
  entrenador:  { label:"Entrenador",  icon:"📋", color:"#F59E0B", desc:"Nóminas, tácticas y seguimiento del plantel." },
  preparador:  { label:"Preparador Físico", icon:"💪", color:"#EF4444", desc:"Microciclos, cargas y estado del plantel." },
  jugador:     { label:"Jugador",     icon:"👤", color:"#22C55E", desc:"Tu dashboard, cuota, gym y convocatorias." },
};

export default function InvitationScreen({ params, onComplete }) {
  const rol   = params.get("rol")   || "jugador";
  const club  = params.get("club")  || "Tu Club";
  const catsRaw = params.get("cats") || "";
  const cats  = catsRaw ? decodeURIComponent(catsRaw).split(",").map(c=>c.trim()) : [];
  const info  = ROL_INFO[rol] || ROL_INFO.jugador;

  const [form, setForm]   = useState({ nombre:"", email:"", password:"" });
  const [step, setStep]   = useState("form"); // "form" | "success"
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  const validate = () => {
    const e = {};
    if (!form.nombre.trim())   e.nombre   = "Escribe tu nombre";
    if (!form.email.includes("@")) e.email = "Email inválido";
    if (form.password.length < 6)  e.password = "Mínimo 6 caracteres";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("success");
    }, 1800);
  };

  const clubLabel = club.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  if (step === "success") return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
      <AuroraBg/>
      <motion.div {...scaleIn} style={{...ss.card, maxWidth:"420px", width:"90%", textAlign:"center", padding:"40px 32px", position:"relative", zIndex:1}}>
        <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:300,damping:20,delay:0.2}}
          style={{width:"80px",height:"80px",borderRadius:"50%",background:`linear-gradient(135deg,${info.color}33,${info.color}11)`,border:`2px solid ${info.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"36px",margin:"0 auto 20px",boxShadow:`0 0 32px ${info.color}44`}}>
          ✅
        </motion.div>
        <motion.div {...fadeUp} transition={{delay:0.3}}>
          <div style={{fontSize:"22px",fontWeight:800,marginBottom:"8px"}}>¡Bienvenido, {form.nombre.split(" ")[0]}!</div>
          <div style={{color:"var(--text-2)",fontSize:"13px",marginBottom:"24px",lineHeight:1.6}}>
            Tu cuenta fue creada como <strong style={{color:info.color}}>{info.label}</strong> en <strong>{clubLabel}</strong>.
          </div>
          <motion.button whileHover={{scale:1.03,y:-2}} whileTap={{scale:0.97}} onClick={()=>onComplete({nombre:form.nombre,email:form.email,rol,club:clubLabel,cats})}
            style={{...ss.btn, background:`linear-gradient(135deg,${info.color},${info.color}cc)`, color:"#fff", width:"100%", padding:"14px", fontSize:"14px", fontWeight:700, boxShadow:`0 8px 24px ${info.color}44`}}>
            Entrar a SportOS {info.icon}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
      <AuroraBg/>
      <motion.div {...fadeUp} style={{maxWidth:"440px",width:"90%",position:"relative",zIndex:1}}>

        {/* Cabecera — club y rol */}
        <motion.div {...scaleIn} style={{...ss.card, marginBottom:"16px", textAlign:"center", padding:"28px 24px", border:`1px solid ${info.color}33`, background:`linear-gradient(135deg,${info.color}08,transparent)`}}>
          <div style={{width:"64px",height:"64px",borderRadius:"50%",background:`linear-gradient(135deg,${info.color}33,${info.color}11)`,border:`2px solid ${info.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"28px",margin:"0 auto 14px",boxShadow:`0 0 24px ${info.color}44`}}>
            {info.icon}
          </div>
          <div style={{fontSize:"11px",color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600,marginBottom:"6px"}}>Invitación a</div>
          <div style={{fontSize:"20px",fontWeight:800,marginBottom:"4px"}}>{clubLabel}</div>
          <div style={{display:"inline-flex",alignItems:"center",gap:"6px",padding:"5px 14px",borderRadius:"99px",background:`${info.color}18`,border:`1px solid ${info.color}44`,marginTop:"8px"}}>
            <span style={{fontSize:"13px"}}>{info.icon}</span>
            <span style={{fontSize:"12px",fontWeight:700,color:info.color}}>{info.label}</span>
          </div>
          <div style={{...ss.muted,fontSize:"11px",marginTop:"10px"}}>{info.desc}</div>
          {cats.length > 0 && (
            <div style={{marginTop:"12px"}}>
              <div style={{fontSize:"10px",color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.06em",fontWeight:600,marginBottom:"6px"}}>
                {rol==="jugador" ? "Plantel asignado" : "Categorías asignadas"}
              </div>
              <div style={{display:"flex",gap:"6px",flexWrap:"wrap",justifyContent:"center"}}>
                {cats.map(cat=>(
                  <span key={cat} style={{fontSize:"11px",padding:"3px 10px",borderRadius:"99px",background:`${info.color}18`,color:info.color,border:`1px solid ${info.color}44`,fontWeight:600}}>
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Formulario */}
        <motion.div {...fadeUp} transition={{delay:0.1}} style={{...ss.card, padding:"28px 24px"}}>
          <div style={{fontWeight:700,fontSize:"15px",marginBottom:"20px"}}>Crea tu cuenta</div>

          <div style={{marginBottom:"14px"}}>
            <div style={ss.label}>Nombre completo</div>
            <input value={form.nombre} onChange={e=>{ setForm(p=>({...p,nombre:e.target.value})); setErrors(p=>({...p,nombre:""})); }}
              placeholder="Ej: Pablo Rodríguez" style={{...ss.input, borderColor:errors.nombre?"#EF4444":"var(--border-soft)"}}/>
            {errors.nombre && <div style={{color:"#EF4444",fontSize:"11px",marginTop:"4px"}}>{errors.nombre}</div>}
          </div>

          <div style={{marginBottom:"14px"}}>
            <div style={ss.label}>Email</div>
            <input type="email" value={form.email} onChange={e=>{ setForm(p=>({...p,email:e.target.value})); setErrors(p=>({...p,email:""})); }}
              placeholder="tu@email.com" style={{...ss.input, borderColor:errors.email?"#EF4444":"var(--border-soft)"}}/>
            {errors.email && <div style={{color:"#EF4444",fontSize:"11px",marginTop:"4px"}}>{errors.email}</div>}
          </div>

          <div style={{marginBottom:"20px"}}>
            <div style={ss.label}>Contraseña</div>
            <input type="password" value={form.password} onChange={e=>{ setForm(p=>({...p,password:e.target.value})); setErrors(p=>({...p,password:""})); }}
              placeholder="Mínimo 6 caracteres" style={{...ss.input, borderColor:errors.password?"#EF4444":"var(--border-soft)"}}/>
            {errors.password && <div style={{color:"#EF4444",fontSize:"11px",marginTop:"4px"}}>{errors.password}</div>}
          </div>

          <motion.button whileHover={!loading?{scale:1.02,y:-2}:{}} whileTap={!loading?{scale:0.98}:{}} onClick={handleSubmit} disabled={loading}
            style={{...ss.btn, background:loading?"rgba(255,255,255,0.06)":`linear-gradient(135deg,${info.color},${info.color}cc)`, color:loading?"var(--text-3)":"#fff", width:"100%", padding:"14px", fontSize:"14px", fontWeight:700, boxShadow:loading?"none":`0 8px 24px ${info.color}44`, cursor:loading?"not-allowed":"pointer", marginBottom:"14px"}}>
            {loading ? "⏳ Creando cuenta..." : `Unirse como ${info.label} ${info.icon}`}
          </motion.button>

          <div style={{textAlign:"center",fontSize:"11px",color:"var(--text-3)",lineHeight:1.6}}>
            Al registrarte aceptas los <span style={{color:info.color,cursor:"pointer"}}>Términos de uso</span> de SportOS.<br/>
            Tu rol fue asignado por el administrador del club.
          </div>
        </motion.div>

        <div style={{textAlign:"center",marginTop:"16px"}}>
          <span style={{fontSize:"11px",fontWeight:800,color:info.color,letterSpacing:"-0.01em",filter:`drop-shadow(0 0 8px ${info.color}66)`}}>⚡ SportOS</span>
        </div>
      </motion.div>
    </div>
  );
}
