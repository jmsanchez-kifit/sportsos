import { motion } from "framer-motion";
import { fadeUp } from "../styles/motion";
import { ss } from "../styles/tokens";

// ── Componentes base del Home ─────────────────────────────────────────────

function HeroStat({ icon, value, label, sub, color, onClick }) {
  return (
    <motion.div {...fadeUp} whileHover={onClick?{y:-3,scale:1.02}:{}} onClick={onClick}
      style={{...ss.card, padding:"24px", border:`1px solid ${color}33`, background:`linear-gradient(135deg,${color}10,${color}04)`,
        cursor:onClick?"pointer":"default", gridColumn:"span 1"}}>
      <div style={{fontSize:"28px", marginBottom:"10px"}}>{icon}</div>
      <div style={{fontSize:"36px", fontWeight:900, color, letterSpacing:"-0.03em", lineHeight:1}}>{value}</div>
      <div style={{fontWeight:700, fontSize:"13px", marginTop:"6px", color:"var(--text-1)"}}>{label}</div>
      {sub && <div style={{fontSize:"11px", color:"var(--text-3)", marginTop:"3px"}}>{sub}</div>}
    </motion.div>
  );
}

function QuickAction({ icon, label, color, onClick }) {
  return (
    <motion.button whileHover={{y:-2, scale:1.04}} whileTap={{scale:0.96}} onClick={onClick}
      style={{...ss.btn, flexDirection:"column", gap:"6px", padding:"16px 12px",
        background:`${color}10`, border:`1px solid ${color}33`, color,
        borderRadius:"var(--r-lg)", flex:1, minWidth:"80px", fontSize:"11px", fontWeight:700}}>
      <span style={{fontSize:"22px"}}>{icon}</span>
      {label}
    </motion.button>
  );
}

function MiniCard({ title, children, delay=0 }) {
  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay, duration:0.4}}
      style={{...ss.card, padding:"18px"}}>
      <div style={{fontWeight:700, fontSize:"12px", color:"var(--text-3)", textTransform:"uppercase",
        letterSpacing:"0.07em", marginBottom:"14px"}}>{title}</div>
      {children}
    </motion.div>
  );
}

function NextMatchCard({ club, sp, sportColor, onNavigate }) {
  const res = club?.prev;
  const next = club?.next;
  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.05}}
      style={{...ss.card, padding:"0", overflow:"hidden", border:`1px solid ${sportColor}33`,
        background:`linear-gradient(135deg,${sportColor}08,transparent)`}}>
      {/* Banda superior */}
      <div style={{background:`linear-gradient(90deg,${sportColor}22,${sportColor}08)`,
        padding:"10px 18px", display:"flex", alignItems:"center", gap:"10px",
        borderBottom:"1px solid var(--border-soft)"}}>
        <span style={{fontSize:"18px"}}>{sp.icon}</span>
        <span style={{fontWeight:700, fontSize:"12px", color:sportColor}}>Próximo partido</span>
        <div style={{flex:1}}/>
        <span style={{fontSize:"10px", color:"var(--text-3)"}}>{sp.name}</span>
      </div>
      <div style={{padding:"18px", display:"flex", gap:"20px", alignItems:"center", flexWrap:"wrap"}}>
        <div style={{flex:1, minWidth:"120px"}}>
          <div style={{fontSize:"11px", color:"var(--text-3)", marginBottom:"4px"}}>Rival</div>
          <div style={{fontWeight:800, fontSize:"18px"}}>{next?.rival || "Por definir"}</div>
          <div style={{fontSize:"11px", color:"var(--text-3)", marginTop:"4px"}}>
            📅 {next?.dia || "—"} · 📍 Local
          </div>
        </div>
        {res && (
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:"10px", color:"var(--text-3)", marginBottom:"4px"}}>Último resultado</div>
            <div style={{fontWeight:800, fontSize:"14px",
              color:res.res==="Victoria"?"#1FA04A":res.res==="Derrota"?"#C0392B":"#C98408"}}>
              {res.res} {res.score}
            </div>
            <div style={{fontSize:"10px", color:"var(--text-3)"}}>vs {res.rival}</div>
          </div>
        )}
        <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
          onClick={()=>onNavigate("matchcenter")}
          style={{...ss.btn, background:`linear-gradient(135deg,${sportColor},${sportColor}cc)`,
            color:"#fff", fontSize:"11px", padding:"8px 16px", fontWeight:700,
            boxShadow:`0 4px 14px ${sportColor}44`}}>
          Ver Match Center →
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── HOME POR ROL ──────────────────────────────────────────────────────────

function HomeAdmin({ players, sportColor, club, sp, countryData, payments, partidos, onNavigate }) {
  const pagados    = payments.filter(p=>p.estado==="pagado").length;
  const pendientes = payments.filter(p=>p.estado==="pendiente").length;
  const vencidos   = payments.filter(p=>p.estado==="vencido").length;
  const totalJugs  = players.length;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
      {/* Stats hero */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px"}}>
        <HeroStat icon="👥" value={totalJugs} label="Jugadores" sub="En el plantel" color={sportColor} onClick={()=>onNavigate("jugadores")}/>
        <HeroStat icon="✅" value={pagados} label="Cuotas pagas" sub="Este mes" color="#1FA04A" onClick={()=>onNavigate("finanzas")}/>
        <HeroStat icon="⏳" value={pendientes} label="Pendientes" sub="Sin pagar" color="#C98408" onClick={()=>onNavigate("finanzas")}/>
        <HeroStat icon="🚨" value={vencidos} label="Vencidos" sub="Requieren aviso" color="#C0392B" onClick={()=>onNavigate("finanzas")}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
        <NextMatchCard club={club} sp={sp} sportColor={sportColor} onNavigate={onNavigate}/>

        <MiniCard title="Acciones rápidas" delay={0.1}>
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            <QuickAction icon="👤" label="Agregar jugador" color={sportColor} onClick={()=>onNavigate("jugadores")}/>
            <QuickAction icon="🔗" label="Invitar miembro" color="#3B82F6" onClick={()=>onNavigate("miclub")}/>
            <QuickAction icon="💰" label="Ver finanzas" color="#C98408" onClick={()=>onNavigate("finanzas")}/>
          </div>
        </MiniCard>
      </div>

      <MiniCard title="Estado del plantel" delay={0.15}>
        <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
          <div style={{flex:1,height:"8px",borderRadius:"99px",background:"var(--bg-elev-3)",overflow:"hidden"}}>
            <motion.div initial={{width:0}} animate={{width:`${Math.round(pagados/(totalJugs||1)*100)}%`}}
              transition={{duration:1,delay:0.3}}
              style={{height:"100%",borderRadius:"99px",background:"linear-gradient(90deg,#1FA04A,#2DC05A)"}}/>
          </div>
          <span style={{fontSize:"13px",fontWeight:800,color:"#1FA04A",minWidth:"42px",textAlign:"right"}}>
            {Math.round(pagados/(totalJugs||1)*100)}%
          </span>
          <span style={{fontSize:"11px",color:"var(--text-3)"}}>cuotas al día</span>
        </div>
      </MiniCard>
    </div>
  );
}

function HomeEntrenador({ players, sportColor, club, sp, partidos, onNavigate }) {
  const hoy       = new Date().toISOString().split("T")[0];
  const proxPartido = partidos.find(p=>p.estado==="programado"&&p.fecha>=hoy);
  const ultimoRes = partidos.find(p=>p.estado==="jugado");
  const presentes = Math.floor(players.length * 0.78); // mock asistencia de hoy

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
      {/* Próximo partido — hero */}
      <NextMatchCard club={club} sp={sp} sportColor={sportColor} onNavigate={onNavigate}/>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px"}}>
        <HeroStat icon="✅" value={`${presentes}/${players.length}`} label="Asistencia hoy"
          sub="Presentes en entrenamiento" color="#1FA04A" onClick={()=>onNavigate("asistencia")}/>
        <HeroStat icon="🏆" value={partidos.filter(p=>p.resultado==="victoria").length}
          label="Victorias" sub={`de ${partidos.filter(p=>p.estado==="jugado").length} partidos jugados`}
          color={sportColor} onClick={()=>onNavigate("matchcenter")}/>
        <HeroStat icon="👥" value={players.length} label="Plantel"
          sub="Jugadores activos" color="#3B82F6" onClick={()=>onNavigate("nomina")}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
        {/* Acciones rápidas */}
        <MiniCard title="Acciones rápidas" delay={0.1}>
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            <QuickAction icon="✅" label="Asistencia" color="#1FA04A" onClick={()=>onNavigate("asistencia")}/>
            <QuickAction icon="💬" label="El Muro" color={sportColor} onClick={()=>onNavigate("muro")}/>
            <QuickAction icon="📋" label="Nómina" color="#3B82F6" onClick={()=>onNavigate("nomina")}/>
            <QuickAction icon="🏆" label="Resultado" color="#C98408" onClick={()=>onNavigate("muro")}/>
          </div>
        </MiniCard>

        {/* Último resultado */}
        <MiniCard title="Último partido" delay={0.12}>
          {ultimoRes ? (
            <div>
              <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"10px"}}>
                <div style={{fontWeight:900,fontSize:"26px",
                  color:ultimoRes.resultado==="victoria"?"#1FA04A":ultimoRes.resultado==="derrota"?"#C0392B":"#C98408"}}>
                  {ultimoRes.golesLocal} — {ultimoRes.golesVisita}
                </div>
                <div>
                  <div style={{fontWeight:700,fontSize:"12px"}}>vs {ultimoRes.rival}</div>
                  <div style={{fontSize:"10px",color:"var(--text-3)"}}>{ultimoRes.fecha} · {ultimoRes.lugar}</div>
                </div>
              </div>
              {ultimoRes.tarjetas?.length>0 && (
                <div style={{fontSize:"11px",color:"var(--text-3)"}}>
                  🃏 {ultimoRes.tarjetas.length} tarjeta{ultimoRes.tarjetas.length>1?"s":""} en el partido
                </div>
              )}
            </div>
          ) : (
            <div style={{fontSize:"12px",color:"var(--text-3)"}}>Sin partidos jugados aún.</div>
          )}
        </MiniCard>
      </div>
    </div>
  );
}

function HomePreparador({ players, sportColor, sp, onNavigate }) {
  // Simular estado wellness del plantel
  const WELLNESS_RESUMEN = [
    {level:"lesionado", count:2, color:"#C0392B", icon:"🚑", label:"Lesionados"},
    {level:"alerta",    count:3, color:"#C98408", icon:"⚠️", label:"En alerta"},
    {level:"ok",        count:players.length-5, color:"#1FA04A", icon:"✅", label:"Aptos"},
  ];
  const pct = Math.round((players.length-5)/players.length*100);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
      {/* Hero: estado del plantel */}
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
        style={{...ss.card,padding:"0",overflow:"hidden",border:"1px solid rgba(192,57,43,0.25)",
          background:"linear-gradient(135deg,rgba(192,57,43,0.06),transparent)"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid var(--border-soft)",
          display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontWeight:700,fontSize:"14px"}}>💪 Estado del plantel — Post partido</div>
          <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
            onClick={()=>onNavigate("estadoplantel")}
            style={{...ss.btn,background:"rgba(192,57,43,0.12)",color:"#C0392B",
              border:"1px solid rgba(192,57,43,0.3)",fontSize:"11px",padding:"6px 14px",fontWeight:700}}>
            Ver detalle →
          </motion.button>
        </div>
        <div style={{padding:"18px",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px"}}>
          {WELLNESS_RESUMEN.map(w=>(
            <div key={w.level} style={{textAlign:"center",padding:"14px 8px",borderRadius:"var(--r-md)",
              background:`${w.color}08`,border:`1px solid ${w.color}22`}}>
              <div style={{fontSize:"24px",marginBottom:"6px"}}>{w.icon}</div>
              <div style={{fontWeight:900,fontSize:"28px",color:w.color,letterSpacing:"-0.02em"}}>{w.count}</div>
              <div style={{fontSize:"11px",color:"var(--text-3)",marginTop:"3px"}}>{w.label}</div>
            </div>
          ))}
        </div>
        <div style={{padding:"0 18px 16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <div style={{flex:1,height:"6px",borderRadius:"99px",background:"var(--bg-elev-3)",overflow:"hidden"}}>
              <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:1,delay:0.4}}
                style={{height:"100%",borderRadius:"99px",background:"linear-gradient(90deg,#1FA04A,#2DC05A)"}}/>
            </div>
            <span style={{fontWeight:800,fontSize:"13px",color:"#1FA04A"}}>{pct}% aptos</span>
          </div>
        </div>
      </motion.div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
        {/* Stats */}
        <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
          <HeroStat icon="📅" value="Semana 8" label="Microciclo activo" sub="Pretemporada 2025"
            color={sportColor} onClick={()=>onNavigate("microciclo")}/>
          <HeroStat icon="🏋️" value="78%" label="Cumplimiento" sub="Plan de entrenamiento"
            color="#3B82F6" onClick={()=>onNavigate("rankingfuerza")}/>
        </div>

        {/* Acciones rápidas */}
        <MiniCard title="Acciones rápidas" delay={0.1}>
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            <QuickAction icon="💪" label="Estado plantel" color="#C0392B" onClick={()=>onNavigate("estadoplantel")}/>
            <QuickAction icon="📅" label="Microciclo" color={sportColor} onClick={()=>onNavigate("microciclo")}/>
            <QuickAction icon="🏋️" label="Ranking" color="#C98408" onClick={()=>onNavigate("rankingfuerza")}/>
          </div>
          <div style={{marginTop:"14px",padding:"10px 12px",borderRadius:"var(--r-md)",
            background:"rgba(192,57,43,0.06)",border:"1px solid rgba(192,57,43,0.2)",
            fontSize:"11px",color:"var(--text-2)",display:"flex",gap:"8px",alignItems:"center"}}>
            <span>📣</span>
            <span>Cuestionario wellness programado — se enviará mañana a las 24h del partido.</span>
          </div>
        </MiniCard>
      </div>
    </div>
  );
}

function HomeJugador({ player, sportColor, sp, club, payments, partidos, onNavigate }) {
  const miPago     = payments?.find(p=>p.jugador===player?.name);
  const cuotaOk    = !miPago || miPago.estado==="pagado";
  const convocado  = true; // mock
  const proximoPar = club?.next;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
      {/* Hero: ¿estoy convocado? */}
      <motion.div initial={{opacity:0,scale:0.97}} animate={{opacity:1,scale:1}} transition={{duration:0.5}}
        style={{...ss.card,padding:"28px 24px",textAlign:"center",
          border:`1px solid ${convocado?"#1FA04A33":"rgba(192,57,43,0.3)"}`,
          background:`linear-gradient(135deg,${convocado?"rgba(31,160,74,0.08)":"rgba(192,57,43,0.06)"},transparent)`}}>
        <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:260,damping:20,delay:0.2}}
          style={{width:"72px",height:"72px",borderRadius:"50%",margin:"0 auto 16px",
            background:`linear-gradient(135deg,${convocado?"#1FA04A":"#C0392B"}33,${convocado?"#1FA04A":"#C0392B"}11)`,
            border:`3px solid ${convocado?"#1FA04A":"#C0392B"}55`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:"32px",
            boxShadow:`0 0 32px ${convocado?"#1FA04A":"#C0392B"}44`}}>
          {convocado?"🎽":"⏳"}
        </motion.div>
        <div style={{fontWeight:900,fontSize:"22px",marginBottom:"6px",
          color:convocado?"#1FA04A":"#C0392B"}}>
          {convocado?"¡Estás convocado!":"No estás convocado"}
        </div>
        <div style={{fontSize:"13px",color:"var(--text-2)",marginBottom:"16px"}}>
          {convocado
            ? `Próximo partido vs ${proximoPar?.rival||"rival"} — ${proximoPar?.dia||"próximamente"}`
            : "Sigue entrenando. Habla con tu entrenador."}
        </div>
        {convocado && (
          <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.96}}
            onClick={()=>onNavigate("miconvocatoria")}
            style={{...ss.btn,background:"linear-gradient(135deg,#1FA04A,#2DC05A)",color:"#fff",
              padding:"10px 24px",fontSize:"13px",fontWeight:700,boxShadow:"0 6px 20px rgba(31,160,74,0.4)"}}>
            Ver mi convocatoria →
          </motion.button>
        )}
      </motion.div>

      {/* Stats personales */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px"}}>
        <HeroStat icon="💳" value={cuotaOk?"Al día":"Pendiente"} label="Mi cuota"
          sub={cuotaOk?"Gracias por pagar":"Vence pronto"}
          color={cuotaOk?"#1FA04A":"#C98408"} onClick={()=>onNavigate("micuota")}/>
        <HeroStat icon="💪" value="😊 19/25" label="Mi wellness"
          sub="Última respuesta: ayer" color={sportColor} onClick={()=>onNavigate("midashboard")}/>
        <HeroStat icon="🏋️" value="#3" label="Ranking fuerza"
          sub="En tu categoría" color="#C98408" onClick={()=>onNavigate("migym")}/>
      </div>

      {/* Acciones rápidas */}
      <MiniCard title="Acciones rápidas" delay={0.15}>
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
          <QuickAction icon="💳" label="Mi cuota" color="#C98408" onClick={()=>onNavigate("micuota")}/>
          <QuickAction icon="🏋️" label="Mi gym" color={sportColor} onClick={()=>onNavigate("migym")}/>
          <QuickAction icon="📋" label="Nóminas" color="#3B82F6" onClick={()=>onNavigate("nominasclub")}/>
          <QuickAction icon="📰" label="Noticias" color="#1FA04A" onClick={()=>onNavigate("noticias")}/>
        </div>
      </MiniCard>
    </div>
  );
}

// ── Export principal ──────────────────────────────────────────────────────

export default function HomeView({ role, players, sportColor, club, sp, countryData, payments, partidos, onNavigate, currentUser }) {
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 19) return "Buenas tardes";
    return "Buenas noches";
  };

  const nombre = currentUser?.nombre?.split(" ")[0] || "Equipo";

  return (
    <div>
      {/* Saludo */}
      <motion.div {...fadeUp} style={{marginBottom:"24px"}}>
        <div style={{fontSize:"22px",fontWeight:900,letterSpacing:"-0.02em",marginBottom:"2px"}}>
          {greeting()}, {nombre} 👋
        </div>
        <div style={{fontSize:"13px",color:"var(--text-3)"}}>
          {new Date().toLocaleDateString("es-CL",{weekday:"long",day:"numeric",month:"long"})} · {sp?.name}
        </div>
      </motion.div>

      {/* Contenido por rol */}
      {role==="admin"      && <HomeAdmin      players={players} sportColor={sportColor} club={club} sp={sp} countryData={countryData} payments={payments} partidos={partidos} onNavigate={onNavigate}/>}
      {role==="entrenador" && <HomeEntrenador players={players} sportColor={sportColor} club={club} sp={sp} partidos={partidos} onNavigate={onNavigate}/>}
      {role==="preparador" && <HomePreparador players={players} sportColor={sportColor} sp={sp} onNavigate={onNavigate}/>}
      {role==="jugador"    && <HomeJugador    player={players[0]} sportColor={sportColor} sp={sp} club={club} payments={payments} partidos={partidos} onNavigate={onNavigate}/>}
      {role==="superadmin" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px"}}>
          <HeroStat icon="🏢" value="24" label="Clubes activos" sub="En SportOS" color={sportColor} onClick={()=>onNavigate("clubes")}/>
          <HeroStat icon="💰" value="$1.840" label="Comisiones" sub="Este mes (USD)" color="#1FA04A" onClick={()=>onNavigate("comisiones")}/>
          <HeroStat icon="👥" value="387" label="Usuarios" sub="En la plataforma" color="#3B82F6" onClick={()=>onNavigate("dashboard")}/>
          <HeroStat icon="📈" value="94%" label="Retención" sub="Últimos 30 días" color="#C98408" onClick={()=>onNavigate("comparativa")}/>
        </div>
      )}
    </div>
  );
}
