import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, scaleIn } from "../styles/motion";
import { ss } from "../styles/tokens";
import AuroraBg from "../components/AuroraBg";
import { MOCK_USERS } from "../data/mockUsers";
import { supabase } from "../lib/supabase";

const ROL_INFO = {
  superadmin: { label:"Super Admin",       icon:"⚡", color:"#A855F7" },
  admin:       { label:"Admin Club",        icon:"🏢", color:"#3B82F6" },
  entrenador:  { label:"Entrenador",        icon:"📋", color:"#F59E0B" },
  preparador:  { label:"Preparador Físico", icon:"💪", color:"#EF4444" },
  jugador:     { label:"Jugador",           icon:"👤", color:"#22C55E" },
};

export default function LoginScreen({ onLogin, onDemo, onRegister }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [step, setStep]         = useState("login"); // "login" | "success"
  const [loggedUser, setLoggedUser] = useState(null);

  const handleLogin = async () => {
    setError("");
    if (!email.trim())    { setError("Escribe tu email");       return; }
    if (!password.trim()) { setError("Escribe tu contraseña");  return; }
    setLoading(true);

    // 1. Intentar login con Supabase real (si está configurado)
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes("xxxx")) {
      try {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (authError) throw authError;
        // Obtener perfil del usuario
        const { data: profile } = await supabase
          .from("profiles")
          .select("*, clubs(name,sport,country)")
          .eq("id", data.user.id)
          .single();
        setLoading(false);
        const user = {
          id: data.user.id,
          nombre: profile?.nombre || data.user.email,
          email: data.user.email,
          rol: profile?.rol || "jugador",
          club: profile?.clubs?.name || "Club",
          sport: profile?.clubs?.sport || "rugby",
          cats: [],
          isReal: true,
        };
        setLoggedUser(user);
        setStep("success");
        setTimeout(() => onLogin(user), 1200);
        return;
      } catch (err) {
        // Si falla, intentar con mock (sólo en desarrollo)
        console.warn("Supabase auth falló, intentando mock:", err.message);
      }
    }

    // 2. Fallback: login mock (cuentas de demo)
    setTimeout(() => {
      const user = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );
      setLoading(false);
      if (!user) { setError("Email o contraseña incorrectos"); return; }
      setLoggedUser(user);
      setStep("success");
      setTimeout(() => onLogin(user), 1200);
    }, 900);
  };

  const handleKey = (e) => { if (e.key === "Enter") handleLogin(); };

  // Cuentas de demo visibles
  const demoAccounts = MOCK_USERS.slice(0, 5);

  if (step === "success" && loggedUser) {
    const info = ROL_INFO[loggedUser.rol] || ROL_INFO.jugador;
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
        <AuroraBg/>
        <motion.div {...scaleIn} style={{textAlign:"center",position:"relative",zIndex:1}}>
          <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:260,damping:20}}
            style={{width:"80px",height:"80px",borderRadius:"50%",background:`linear-gradient(135deg,${info.color}44,${info.color}11)`,border:`2px solid ${info.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"32px",margin:"0 auto 16px",boxShadow:`0 0 32px ${info.color}44`}}>
            {info.icon}
          </motion.div>
          <motion.div {...fadeUp} transition={{delay:0.2}}>
            <div style={{fontSize:"22px",fontWeight:800,marginBottom:"6px"}}>¡Bienvenido, {loggedUser.nombre.split(" ")[0]}!</div>
            <div style={{color:"var(--text-2)",fontSize:"13px"}}>{loggedUser.club} · {info.label}</div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh",display:"flex",position:"relative",overflow:"hidden"}}>
      <AuroraBg/>

      {/* Panel izquierdo — branding */}
      <div style={{flex:"0 0 42%",display:"flex",flexDirection:"column",justifyContent:"center",padding:"60px 48px",position:"relative",zIndex:1}}>
        <motion.div {...fadeUp}>
          <div style={{fontSize:"28px",fontWeight:900,color:"#A855F7",letterSpacing:"-0.02em",marginBottom:"8px",filter:"drop-shadow(0 0 16px #A855F788)"}}>
            ⚡ SportOS
          </div>
          <div style={{fontSize:"32px",fontWeight:800,lineHeight:1.2,marginBottom:"16px",letterSpacing:"-0.02em"}}>
            La plataforma de gestión deportiva para LATAM
          </div>
          <div style={{color:"var(--text-2)",fontSize:"14px",lineHeight:1.7,marginBottom:"32px"}}>
            Rugby · Fútbol · Handball · Basketball · Hockey
          </div>

          {/* Roles disponibles */}
          <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
            {Object.entries(ROL_INFO).map(([id, info]) => (
              <motion.div key={id} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:Object.keys(ROL_INFO).indexOf(id)*0.07+0.3}}
                style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 14px",borderRadius:"var(--r-md)",background:`${info.color}10`,border:`1px solid ${info.color}22`}}>
                <span style={{fontSize:"18px"}}>{info.icon}</span>
                <span style={{fontSize:"13px",fontWeight:600,color:info.color}}>{info.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Panel derecho — formulario */}
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 32px",position:"relative",zIndex:1}}>
        <motion.div {...fadeUp} transition={{delay:0.1}} style={{width:"100%",maxWidth:"400px"}}>

          {/* Tarjeta login */}
          <div style={{...ss.card, padding:"32px 28px", marginBottom:"16px"}}>
            <div style={{fontWeight:800,fontSize:"20px",marginBottom:"4px",letterSpacing:"-0.01em"}}>Iniciar sesión</div>
            <div style={{...ss.muted,fontSize:"12px",marginBottom:"24px"}}>Accede con tu cuenta de SportOS</div>

            <div style={{marginBottom:"14px"}}>
              <div style={ss.label}>Email</div>
              <input
                type="email" value={email} onChange={e=>{setEmail(e.target.value);setError("");}}
                onKeyDown={handleKey} placeholder="tu@email.com" autoComplete="email"
                style={{...ss.input, borderColor:error?"#EF4444":"var(--border-soft)"}}
              />
            </div>

            <div style={{marginBottom:"20px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={ss.label}>Contraseña</div>
                <span onClick={()=>setShowPass(p=>!p)} style={{fontSize:"10px",color:"#A855F7",cursor:"pointer",fontWeight:600}}>
                  {showPass?"Ocultar":"Mostrar"}
                </span>
              </div>
              <input
                type={showPass?"text":"password"} value={password}
                onChange={e=>{setPassword(e.target.value);setError("");}}
                onKeyDown={handleKey} placeholder="••••••••" autoComplete="current-password"
                style={{...ss.input, borderColor:error?"#EF4444":"var(--border-soft)"}}
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}
                  style={{fontSize:"12px",color:"#EF4444",marginBottom:"14px",padding:"8px 12px",borderRadius:"var(--r-sm)",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)"}}>
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button whileHover={!loading?{scale:1.02,y:-2}:{}} whileTap={!loading?{scale:0.98}:{}}
              onClick={handleLogin} disabled={loading}
              style={{...ss.btn,width:"100%",padding:"14px",fontSize:"14px",fontWeight:700,background:loading?"rgba(255,255,255,0.06)":"linear-gradient(135deg,#A855F7,#7C3AED)",color:loading?"var(--text-3)":"#fff",boxShadow:loading?"none":"0 8px 24px rgba(168,85,247,0.4)",cursor:loading?"not-allowed":"pointer",marginBottom:"14px"}}>
              {loading ? "⏳ Verificando..." : "Entrar →"}
            </motion.button>

            <div style={{display:"flex",gap:"8px",flexDirection:"column"}}>
              {onRegister && (
                <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={onRegister}
                  style={{...ss.btn,background:"linear-gradient(135deg,rgba(168,85,247,0.15),rgba(59,130,246,0.1))",color:"#C084FC",border:"1px solid rgba(168,85,247,0.3)",fontSize:"12px",padding:"9px 20px",width:"100%"}}>
                  🏆 Crear mi club gratis
                </motion.button>
              )}
              <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={onDemo}
                style={{...ss.btn,background:"transparent",color:"var(--text-3)",border:"1px solid var(--border-soft)",fontSize:"12px",padding:"9px 20px",width:"100%"}}>
                🎮 Entrar en Modo Demo (sin cuenta)
              </motion.button>
            </div>
          </div>

          {/* Cuentas de demo */}
          <div style={{...ss.card, padding:"16px 20px"}}>
            <div style={{fontSize:"11px",color:"var(--text-3)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"12px"}}>
              Cuentas de prueba · contraseña: <strong style={{color:"#A855F7"}}>demo123</strong>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
              {demoAccounts.map(u=>{
                const info = ROL_INFO[u.rol];
                return (
                  <motion.button key={u.id} whileHover={{x:3}} whileTap={{scale:0.98}}
                    onClick={()=>{ setEmail(u.email); setPassword(u.password); setError(""); }}
                    style={{...ss.btn,background:"transparent",border:"1px solid var(--border-soft)",padding:"8px 12px",display:"flex",alignItems:"center",gap:"10px",textAlign:"left",width:"100%",cursor:"pointer"}}>
                    <div style={{width:"30px",height:"30px",borderRadius:"50%",background:`${info.color}18`,border:`1.5px solid ${info.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:800,color:info.color,flexShrink:0}}>
                      {u.avatar}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:"12px",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.nombre}</div>
                      <div style={{fontSize:"10px",color:"var(--text-3)",marginTop:"1px"}}>{u.email}</div>
                    </div>
                    <span style={{fontSize:"10px",padding:"2px 8px",borderRadius:"99px",background:`${info.color}15`,color:info.color,border:`1px solid ${info.color}33`,fontWeight:600,flexShrink:0}}>{info.icon} {info.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div style={{textAlign:"center",marginTop:"16px",fontSize:"10px",color:"var(--text-3)"}}>
            ⚡ SportOS · Plataforma deportiva para LATAM
          </div>
        </motion.div>
      </div>
    </div>
  );
}
