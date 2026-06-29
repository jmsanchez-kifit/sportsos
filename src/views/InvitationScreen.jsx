import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, scaleIn } from "../styles/motion";
import { ss } from "../styles/tokens";
import AuroraBg from "../components/AuroraBg";
import { supabase } from "../lib/supabase";
import BackButton from "../components/BackButton";

const ROL_INFO = {
  superadmin: { label:"Super Admin",       icon:"⚡", color:"#8040CC", desc:"Acceso total a la plataforma SportOS." },
  admin:       { label:"Admin Club",        icon:"🏢", color:"#3B82F6", desc:"Gestiona el club, jugadores y finanzas." },
  entrenador:  { label:"Entrenador",        icon:"📋", color:"#C98408", desc:"Nóminas, tácticas y seguimiento del plantel." },
  preparador:  { label:"Preparador Físico", icon:"💪", color:"#C0392B", desc:"Microciclos, cargas y estado del plantel." },
  jugador:     { label:"Jugador",           icon:"👤", color:"#1FA04A", desc:"Tu dashboard, cuota, gym y convocatorias." },
};

export default function InvitationScreen({ params, onComplete, onBack }) {
  const rol       = params.get("rol")     || "jugador";
  const clubId    = params.get("club")    || null;
  const clubName  = params.get("name")    || "Tu Club";
  const sport     = params.get("sport")   || "rugby";
  const catsRaw   = params.get("cats")    || "";
  const cats      = catsRaw ? decodeURIComponent(catsRaw).split(",").map(c=>c.trim()).filter(Boolean) : [];
  const inviterId = params.get("inviter") || null;
  const playerId  = params.get("pid")     || null;
  const expiry    = parseInt(params.get("exp") || "0", 10);
  const info      = ROL_INFO[rol] || ROL_INFO.jugador;

  // Link expirado (solo si viene con &exp= y ya pasó el tiempo)
  const isExpired = expiry > 0 && Date.now() > expiry;
  if (isExpired) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
      <AuroraBg/>
      <motion.div {...scaleIn} style={{...ss.card,maxWidth:"400px",width:"90%",textAlign:"center",padding:"40px 32px",position:"relative",zIndex:1}}>
        <div style={{fontSize:"48px",marginBottom:"16px"}}>⏰</div>
        <div style={{fontWeight:800,fontSize:"20px",marginBottom:"8px"}}>Link expirado</div>
        <div style={{fontSize:"13px",color:"var(--text-3)",lineHeight:1.7,marginBottom:"24px"}}>
          Este link de invitación ya no es válido.<br/>
          Los links expiran a las <strong>48 horas</strong> de ser generados.
        </div>
        <div style={{fontSize:"12px",color:"var(--text-3)",padding:"12px 16px",borderRadius:"var(--r-md)",background:"rgba(192,57,43,0.06)",border:"1px solid rgba(192,57,43,0.2)",marginBottom:"24px"}}>
          Pídele al administrador del club que genere un nuevo link de invitación.
        </div>
        {onBack && (
          <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={onBack}
            style={{...ss.btn,background:"transparent",color:"var(--text-2)",border:"1px solid var(--border-soft)",fontSize:"13px",padding:"10px 24px"}}>
            ← Volver al inicio
          </motion.button>
        )}
      </motion.div>
    </div>
  );

  const [form, setForm]     = useState({ nombre:"", email:"", password:"" });
  const [step, setStep]     = useState("form"); // "form" | "success"
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.nombre.trim())        e.nombre   = "Escribe tu nombre";
    if (!form.email.includes("@"))  e.email    = "Email inválido";
    if (form.password.length < 6)   e.password = "Mínimo 6 caracteres";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setServerError("");

    try {
      // 1. Crear cuenta en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: { data: { nombre: form.nombre.trim() } },
      });
      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error("No se obtuvo ID de usuario");

      // 2. Actualizar perfil con rol, club e invitador (para heredar su membresía)
      if (clubId) {
        const profileData = { nombre: form.nombre.trim(), rol, club_id: clubId };
        if (inviterId) profileData.invited_by = inviterId;
        const { error: profileError } = await supabase
          .from("profiles")
          .update(profileData)
          .eq("id", userId);
        if (profileError) console.warn("Profile update parcial:", profileError.message);
      }

      // 3. Si la invitación es para un jugador específico, vincular su cuenta
      if (playerId) {
        await supabase.from("players")
          .update({ profile_id: userId })
          .eq("id", playerId);
      }

      setLoading(false);
      setStep("success");

      // Entrar automáticamente después de 1.4s
      setTimeout(() => {
        onComplete({
          id: userId,
          nombre: form.nombre.trim(),
          email: form.email.trim(),
          rol,
          club: clubName,
          club_id: clubId,
          sport,
          cats,
          isReal: true,
        });
      }, 1400);

    } catch (err) {
      setLoading(false);
      if (err.message?.includes("already registered")) {
        setServerError("Este email ya tiene cuenta. Inicia sesión en su lugar.");
      } else {
        setServerError(err.message || "Error al crear la cuenta. Intenta de nuevo.");
      }
    }
  };

  const clubLabel = clubName.replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase());

  if (step === "success") return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
      <AuroraBg/>
      <motion.div {...scaleIn} style={{...ss.card,maxWidth:"420px",width:"90%",textAlign:"center",padding:"40px 32px",position:"relative",zIndex:1}}>
        <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:300,damping:20,delay:0.2}}
          style={{width:"80px",height:"80px",borderRadius:"50%",background:`linear-gradient(135deg,${info.color}33,${info.color}11)`,border:`2px solid ${info.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"36px",margin:"0 auto 20px",boxShadow:`0 0 32px ${info.color}44`}}>
          ✅
        </motion.div>
        <motion.div {...fadeUp} transition={{delay:0.3}}>
          <div style={{fontSize:"22px",fontWeight:800,marginBottom:"8px"}}>¡Bienvenido, {form.nombre.split(" ")[0]}!</div>
          <div style={{color:"var(--text-2)",fontSize:"13px",marginBottom:"24px",lineHeight:1.6}}>
            Tu cuenta fue creada como <strong style={{color:info.color}}>{info.label}</strong> en <strong>{clubLabel}</strong>.
          </div>
          <div style={{fontSize:"11px",color:"var(--text-3)"}}>Entrando a SportOS...</div>
        </motion.div>
      </motion.div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
      <AuroraBg/>
      {onBack && (
        <div style={{position:"fixed",top:"16px",left:"20px",zIndex:10}}>
          <BackButton onClick={onBack} label="Inicio"/>
        </div>
      )}
      <motion.div {...fadeUp} style={{maxWidth:"440px",width:"90%",position:"relative",zIndex:1}}>

        {/* Cabecera — club y rol */}
        <motion.div {...scaleIn} style={{...ss.card,marginBottom:"16px",textAlign:"center",padding:"28px 24px",border:`1px solid ${info.color}33`,background:`linear-gradient(135deg,${info.color}08,transparent)`}}>
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
                {rol==="jugador"?"Plantel asignado":"Categorías asignadas"}
              </div>
              <div style={{display:"flex",gap:"6px",flexWrap:"wrap",justifyContent:"center"}}>
                {cats.map(cat=>(
                  <span key={cat} style={{fontSize:"11px",padding:"3px 10px",borderRadius:"99px",background:`${info.color}18`,color:info.color,border:`1px solid ${info.color}44`,fontWeight:600}}>{cat}</span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Formulario */}
        <motion.div {...fadeUp} transition={{delay:0.1}} style={{...ss.card,padding:"28px 24px"}}>
          <div style={{fontWeight:700,fontSize:"15px",marginBottom:"20px"}}>Crea tu cuenta</div>

          <div style={{marginBottom:"14px"}}>
            <div style={ss.label}>Nombre completo</div>
            <input value={form.nombre} onChange={e=>{setForm(p=>({...p,nombre:e.target.value}));setErrors(p=>({...p,nombre:""}));}}
              placeholder="Ej: Pablo Rodríguez" style={{...ss.input,borderColor:errors.nombre?"#C0392B":"var(--border-soft)"}}/>
            {errors.nombre && <div style={{color:"#C0392B",fontSize:"11px",marginTop:"4px"}}>{errors.nombre}</div>}
          </div>

          <div style={{marginBottom:"14px"}}>
            <div style={ss.label}>Email</div>
            <input type="email" value={form.email} onChange={e=>{setForm(p=>({...p,email:e.target.value}));setErrors(p=>({...p,email:""}));setServerError("");}}
              placeholder="tu@email.com" style={{...ss.input,borderColor:errors.email?"#C0392B":"var(--border-soft)"}}/>
            {errors.email && <div style={{color:"#C0392B",fontSize:"11px",marginTop:"4px"}}>{errors.email}</div>}
          </div>

          <div style={{marginBottom:"20px"}}>
            <div style={ss.label}>Contraseña</div>
            <input type="password" value={form.password} onChange={e=>{setForm(p=>({...p,password:e.target.value}));setErrors(p=>({...p,password:""}));}}
              placeholder="Mínimo 6 caracteres" style={{...ss.input,borderColor:errors.password?"#C0392B":"var(--border-soft)"}}/>
            {errors.password && <div style={{color:"#C0392B",fontSize:"11px",marginTop:"4px"}}>{errors.password}</div>}
          </div>

          {serverError && (
            <div style={{fontSize:"12px",color:"#C0392B",marginBottom:"14px",padding:"10px 12px",borderRadius:"var(--r-sm)",background:"rgba(192,57,43,0.08)",border:"1px solid rgba(192,57,43,0.25)"}}>
              ⚠️ {serverError}
            </div>
          )}

          <motion.button whileHover={!loading?{scale:1.02,y:-2}:{}} whileTap={!loading?{scale:0.98}:{}}
            onClick={handleSubmit} disabled={loading}
            style={{...ss.btn,background:loading?"rgba(255,255,255,0.06)":`linear-gradient(135deg,${info.color},${info.color}cc)`,color:loading?"var(--text-3)":"#fff",width:"100%",padding:"14px",fontSize:"14px",fontWeight:700,boxShadow:loading?"none":`0 8px 24px ${info.color}44`,cursor:loading?"not-allowed":"pointer",marginBottom:"14px"}}>
            {loading?"⏳ Creando cuenta...":`Unirme como ${info.label} ${info.icon}`}
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
