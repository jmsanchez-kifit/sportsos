import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { SPORTS_CONFIG, COUNTRIES, CLUBS } from "./data/sports";
import { PLAYERS_RUGBY } from "./data/players";
import { COMMISSION_DATA, CLUB_LIST, COUNTRY_COUNTS, MOCK_PAYMENTS, MOCK_PARTIDOS } from "./data/mockData";
import { usePlayers } from "./lib/usePlayers";

import { fadeUp } from "./styles/motion";
import { ss } from "./styles/tokens";

import AuroraBg from "./components/AuroraBg";
import Toast from "./components/Toast";
import WhatsAppModal from "./components/WhatsAppModal";
import GlobalSearch from "./components/GlobalSearch";
import OnboardingTip from "./components/OnboardingTip";

import OnboardingScreen from "./views/OnboardingScreen";
import InvitationScreen from "./views/InvitationScreen";
import LoginScreen from "./views/LoginScreen";
import LandingPage from "./views/LandingPage";
import ClubOnboarding from "./views/ClubOnboarding";
import SuperAdminView from "./views/SuperAdminView";
import AdminView from "./views/AdminView";
import EntrenadorView from "./views/EntrenadorView";
import PreparadorView from "./views/PreparadorView";
import JugadorView from "./views/JugadorView";

const ROLES = [
  {id:"superadmin",label:"Super Admin",icon:"⚡"},
  {id:"admin",label:"Admin Club",icon:"🏢"},
  {id:"entrenador",label:"Entrenador",icon:"📋"},
  {id:"preparador",label:"Preparador",icon:"💪"},
  {id:"jugador",label:"Jugador",icon:"👤"},
];

const MODULE_MAP = {
  superadmin:[{id:"dashboard",label:"Dashboard Global"},{id:"clubes",label:"Clubes"},{id:"comisiones",label:"Comisiones"},{id:"comparativa",label:"vs SportEasy"}],
  admin:[{id:"miclub",label:"Mi Club"},{id:"jugadores",label:"Jugadores"},{id:"finanzas",label:"Finanzas"}],
  entrenador:[{id:"muro",label:"El Muro"},{id:"calendario",label:"Calendario"},{id:"matchcenter",label:"Match Center"},{id:"nomina",label:"Nómina"},{id:"estadisticas",label:"Estadísticas"},{id:"asistencia",label:"Asistencia"},{id:"salud",label:"Salud"}],
  preparador:[{id:"microciclo",label:"Microciclo"},{id:"estadoplantel",label:"Estado Plantel"},{id:"rankingfuerza",label:"Ranking Fuerza"}],
  jugador:[{id:"midashboard",label:"Mi Dashboard"},{id:"noticias",label:"Noticias & Resultados"},{id:"micuota",label:"Mi Cuota"},{id:"migym",label:"Mi Gym"},{id:"nominasclub",label:"Nóminas Club"},{id:"miconvocatoria",label:"Mi Convocatoria"}],
};

const ROL_ICONS = {superadmin:"⚡",admin:"🏢",entrenador:"📋",preparador:"💪",jugador:"👤"};

export default function SportOS() {
  const [screen,setScreen]               = useState("landing");
  const [sport,setSport]                 = useState("rugby");
  const [country,setCountry]             = useState("CL");
  const [role,setRole]                   = useState("entrenador");
  const [module,setModule]               = useState("muro");
  const [category,setCategory]           = useState(0);
  const [toast,setToast]                 = useState(null);
  const [activeClubs,setActiveClubs]     = useState({rugby:true,futbol:true,basketball:true,handball:false,hockey:false});
  const [clubList,setClubList]           = useState(CLUB_LIST);
  const [postLikes,setPostLikes]         = useState({1:12,2:3,3:1,4:7});
  const [whatsappModal,setWhatsappModal] = useState(false);
  const [convocado,setConvocado]         = useState(null);
  const [rankTab,setRankTab]             = useState("volumen");
  const [gymLog,setGymLog]               = useState({});
  const [completedSession,setCompletedSession] = useState(false);
  const [newRecord,setNewRecord]         = useState(false);
  const [expandedEx,setExpandedEx]       = useState(null);
  const [expandedDay,setExpandedDay]     = useState("lunes");
  const [hiaModal,setHiaModal]           = useState(false);
  const [gymPlanExercises,setGymPlanExercises] = useState(null);
  const [newExForm,setNewExForm]         = useState(false);
  const [newEx,setNewEx]                 = useState({name:"",sets:3,reps:8,pct:70,rest:120,notes:"",muscles:""});
  const [publishedPlan,setPublishedPlan] = useState(false);
  const [payments,setPayments]           = useState(MOCK_PAYMENTS);
  const [partidos,setPartidos]           = useState(MOCK_PARTIDOS);

  // null = modo demo | { nombre, email, rol, club, cats[], club_id } = usuario real
  const [currentUser,setCurrentUser]     = useState(null);
  const [searchOpen,setSearchOpen]       = useState(false);

  // Jugadores: datos reales de Supabase si hay club_id, mock si no
  const clubId = currentUser?.club_id ?? null;
  const { players, addPlayer, updatePlayer, removePlayer } = usePlayers(clubId);
  const isDemo = currentUser === null;
  // En demo ve todo; en modo real filtra por sus categorías asignadas
  const userCats = isDemo ? [] : (currentUser.cats || []);

  const sp           = SPORTS_CONFIG[sport];
  const club         = CLUBS[sport];
  const countryData  = COUNTRIES[country];
  const sportColor   = sp.color;
  const currentCategory = sp.categories[category]||sp.categories[0];
  const sportModules = MODULE_MAP[role]||[];

  // Toast con soporte undo
  const showToast = (msg, type="success", onUndo=null) => setToast({msg, type, onUndo});

  // Atajo de teclado para búsqueda global
  useEffect(()=>{
    const handler = (e) => {
      if ((e.metaKey||e.ctrlKey) && e.key==="k") { e.preventDefault(); setSearchOpen(p=>!p); }
      if (e.key==="Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handler);
    return ()=>window.removeEventListener("keydown", handler);
  },[]);

  useEffect(()=>{const mods=MODULE_MAP[role]||[];if(mods.length>0)setModule(mods[0].id);},[role]);
  useEffect(()=>{setCategory(0);},[sport]);

  // Detecta link de invitación en la URL
  const urlParams = new URLSearchParams(window.location.search);
  const isInvitation = urlParams.has("token") && urlParams.has("rol");

  // Landing pública
  if(screen==="landing") return (
    <LandingPage
      onLogin={()=>setScreen("login")}
      onDemo={()=>setScreen("onboarding")}
    />
  );

  // Onboarding nuevo club
  if(screen==="club-onboarding") return (
    <ClubOnboarding
      onComplete={(usuario)=>{
        if(!usuario) { setScreen("login"); return; }
        setCurrentUser({nombre:usuario.nombre, email:usuario.email, rol:usuario.rol, club:usuario.club, club_id:usuario.club_id, cats:usuario.cats});
        setRole(usuario.rol);
        setSport(usuario.sport||"rugby");
        setScreen("app");
      }}
    />
  );

  if(isInvitation) return (
    <InvitationScreen
      params={urlParams}
      onComplete={(usuario)=>{
        setCurrentUser(usuario);
        setRole(usuario.rol);
        setScreen("app");
        window.history.replaceState({},"","/");
      }}
    />
  );

  if(screen==="login") return (
    <LoginScreen
      onLogin={(user)=>{
        setCurrentUser({nombre:user.nombre, email:user.email, rol:user.rol, club:user.club, club_id:user.club_id||null, cats:user.cats});
        setRole(user.rol);
        setSport(user.sport||"rugby");
        setScreen("app");
      }}
      onDemo={()=>setScreen("onboarding")}
      onRegister={()=>setScreen("club-onboarding")}
    />
  );

  if(screen==="onboarding") return <OnboardingScreen onSelect={(s,c)=>{setSport(s);setCountry(c);setScreen("app");}}/>;

  const rolActual = ROLES.find(r=>r.id===role);

  return (
    <div style={ss.wrap} className="sportos-wrap" data-sport={sport}>
      <AuroraBg/>
      <AnimatePresence>
        {toast&&<Toast msg={toast.msg} type={toast.type} onUndo={toast.onUndo||null} onClose={()=>setToast(null)}/>}
      </AnimatePresence>
      <AnimatePresence>
        {searchOpen&&<GlobalSearch players={players} posts={[]} sportColor={sportColor} role={role} modules={sportModules} onNavigate={(id)=>setModule(id)} onClose={()=>setSearchOpen(false)}/>}
      </AnimatePresence>
      {screen==="app"&&<OnboardingTip sportColor={sportColor} onGoToMuro={()=>{setRole("entrenador");setModule("muro");}}/>}
      {whatsappModal&&<WhatsAppModal onClose={()=>setWhatsappModal(false)} team={club.name} rival={club.next.rival} date={club.next.dia}
        starters={SPORTS_CONFIG[sport].positions.slice(0,sp.teamSize).map((pos,i)=>({name:players[i]?players[i].name:"Jugador "+(i+1),pos}))}
        bench={[]}/>}

      {/* ── Banner: Demo o Usuario real ── */}
      {isDemo ? (
        <div className="sportos-demo-banner" style={{background:"linear-gradient(90deg,rgba(168,85,247,0.15),rgba(59,130,246,0.15))",borderBottom:"1px solid rgba(168,85,247,0.25)",padding:"6px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:"11px",gap:"8px",flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
            <span style={{width:"7px",height:"7px",borderRadius:"50%",background:"#A855F7",boxShadow:"0 0 8px #A855F7",display:"inline-block"}}/>
            <span style={{color:"#C084FC",fontWeight:700,letterSpacing:"0.04em",textTransform:"uppercase",fontSize:"10px"}}>Modo Demo</span>
            <span className="hide-mobile" style={{color:"var(--text-3)"}}>— puedes cambiar entre roles libremente.</span>
          </div>
          <div className="roles-row" style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
            {ROLES.map(r=>(
              <motion.button key={r.id} whileTap={{scale:0.95}} onClick={()=>setRole(r.id)}
                style={{fontSize:"10px",padding:"2px 9px",borderRadius:"99px",cursor:"pointer",border:"none",background:role===r.id?"rgba(168,85,247,0.3)":"rgba(168,85,247,0.1)",color:role===r.id?"#E9D5FF":"#C084FC",fontWeight:role===r.id?700:400,transition:"all 0.15s"}}>
                {r.icon} {r.label}
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{background:"linear-gradient(90deg,rgba(34,197,94,0.1),rgba(59,130,246,0.08))",borderBottom:"1px solid rgba(34,197,94,0.2)",padding:"5px 16px",display:"flex",alignItems:"center",gap:"10px",fontSize:"11px"}}>
          <span style={{width:"7px",height:"7px",borderRadius:"50%",background:"#22C55E",boxShadow:"0 0 8px #22C55E",display:"inline-block"}}/>
          <span style={{color:"#22C55E",fontWeight:700}}>{currentUser.nombre}</span>
          <span style={{color:"var(--text-3)"}}>·</span>
          <span style={{color:"var(--text-2)"}}>{ROL_ICONS[role]} {rolActual?.label}</span>
          <span style={{color:"var(--text-3)"}}>·</span>
          <span style={{color:"var(--text-3)"}}>{currentUser.club}</span>
          <div style={{flex:1}}/>
          <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={()=>{ setCurrentUser(null); setRole("entrenador"); setScreen("login"); }}
            style={{...ss.btn,background:"transparent",color:"var(--text-3)",border:"1px solid var(--border-soft)",fontSize:"10px",padding:"3px 10px"}}>
            Cerrar sesión
          </motion.button>
        </div>
      )}

      {/* ── Topbar ── */}
      <div style={ss.topbar} className="sportos-topbar">
        <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{duration:0.4}} style={{fontWeight:800,fontSize:"16px",color:sportColor,marginRight:"8px",whiteSpace:"nowrap",letterSpacing:"-0.01em",display:"flex",alignItems:"center",gap:"6px",filter:`drop-shadow(0 0 12px ${sportColor}66)`}}>⚡ SportOS</motion.div>
        {/* Selector de deporte y categoría: oculto para jugador real */}
        {(isDemo || role !== "jugador") && <>
          <div className="hide-mobile" style={{display:"flex",gap:"2px",background:"var(--bg-elev-2)",borderRadius:"var(--r-md)",padding:"3px",overflowX:"auto"}}>
            {Object.entries(SPORTS_CONFIG).map(([k,v])=>{
              const isActive2 = role==="admin"?activeClubs[k]:k===sport;
              if(role!=="superadmin"&&!isActive2&&k!==sport) return null;
              return (
                <motion.button key={k} whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={()=>setSport(k)} style={{padding:"6px 10px",borderRadius:"var(--r-sm)",border:"none",cursor:"pointer",background:k===sport?`linear-gradient(135deg,${v.color}33,${v.color}11)`:"transparent",color:k===sport?v.color:"var(--text-2)",fontSize:"11px",fontWeight:k===sport?700:500,transition:"all 0.2s",display:"flex",alignItems:"center",gap:"5px",whiteSpace:"nowrap",boxShadow:k===sport?`0 0 12px ${v.color}44`:"none"}}>
                  <span style={{fontSize:"13px"}}>{v.icon}</span> {v.name}
                </motion.button>
              );
            })}
          </div>
          <select className="hide-mobile" value={category} onChange={e=>setCategory(Number(e.target.value))} style={{...ss.input,width:"100px",fontSize:"12px",padding:"6px 10px",cursor:"pointer"}}>
            {sp.categories.map((c,i)=><option key={i} value={i}>{c}</option>)}
          </select>
        </>}
        <div style={{flex:1}}/>
        {/* Búsqueda global */}
        <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={()=>setSearchOpen(true)}
          style={{...ss.btn,background:"var(--bg-elev-2)",color:"var(--text-3)",border:"1px solid var(--border-soft)",padding:"6px 12px",gap:"8px",fontSize:"12px"}}>
          🔍 <span className="hide-mobile">Buscar</span>
          <span className="hide-mobile" style={{fontSize:"10px",padding:"1px 6px",borderRadius:"4px",background:"var(--bg-elev-3)",color:"var(--text-4)"}}>⌘K</span>
        </motion.button>
        <div className="hide-mobile" style={{fontSize:"11px",color:"var(--text-2)",display:"flex",alignItems:"center",gap:"4px",padding:"5px 10px",background:"var(--bg-elev-2)",borderRadius:"99px",whiteSpace:"nowrap"}}>🇨🇱 CLP</div>
        <motion.div whileHover={{scale:1.1,rotate:5}} style={{width:"34px",height:"34px",borderRadius:"50%",background:`linear-gradient(135deg,${sportColor}44,${sportColor}11)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",fontWeight:800,color:sportColor,border:`2px solid ${sportColor}55`,flexShrink:0,boxShadow:`0 0 12px ${sportColor}44`,cursor:"pointer"}}>
          {isDemo ? "AC" : currentUser.nombre.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
        </motion.div>
      </div>

      {/* ── Body ── */}
      <div className="sportos-body" style={{display:"flex",flex:1,overflow:"hidden"}}>
        {/* Sidebar */}
        <motion.div {...fadeUp} className="sportos-sidebar" style={ss.sidebar}>
          <div className="sidebar-profile" style={{padding:"18px 14px",borderBottom:"1px solid var(--border-soft)",textAlign:"center"}}>
            <motion.div whileHover={{scale:1.05,rotate:5}} style={{width:"52px",height:"52px",borderRadius:"50%",background:`linear-gradient(135deg,${sportColor}44,${sportColor}11)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"26px",border:`2.5px solid ${sportColor}66`,margin:"0 auto 10px",boxShadow:`0 0 20px ${sportColor}55`}}>{sp.icon}</motion.div>
            <div style={{fontWeight:700,fontSize:"14px",letterSpacing:"-0.01em"}}>{club.name}</div>
            <div style={{...ss.muted,fontSize:"11px",marginTop:"3px"}}>{countryData.flag} {countryData.name}</div>
          </div>

          {/* Selector de roles: solo en modo demo */}
          {isDemo && (
            <div className="sidebar-roles" style={{padding:"12px 8px 4px"}}>
              <div style={{...ss.label,paddingLeft:"8px"}}>Rol activo</div>
              {ROLES.map(r=>(
                <motion.button key={r.id} whileHover={{x:3}} whileTap={{scale:0.97}} onClick={()=>setRole(r.id)} style={{display:"flex",alignItems:"center",gap:"9px",padding:"9px 10px",borderRadius:"var(--r-sm)",border:"none",cursor:"pointer",background:role===r.id?`linear-gradient(135deg,${sportColor}22,${sportColor}08)`:"transparent",color:role===r.id?sportColor:"var(--text-2)",width:"100%",textAlign:"left",fontSize:"11px",fontWeight:role===r.id?700:500,marginBottom:"3px",transition:"all 0.2s",boxShadow:role===r.id?`0 0 12px ${sportColor}33`:"none"}}>
                  <span style={{fontSize:"14px"}}>{r.icon}</span>
                  <span style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.label}</span>
                </motion.button>
              ))}
            </div>
          )}

          {/* Modo real: muestra nombre y rol fijo */}
          {!isDemo && (
            <div className="sidebar-profile" style={{padding:"14px 12px",borderBottom:"1px solid var(--border-soft)"}}>
              <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                <div style={{width:"36px",height:"36px",borderRadius:"50%",background:`linear-gradient(135deg,${sportColor}33,${sportColor}11)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",fontWeight:800,color:sportColor,border:`1.5px solid ${sportColor}44`,flexShrink:0}}>
                  {currentUser.nombre.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                </div>
                <div style={{minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:"13px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{currentUser.nombre}</div>
                  <div style={{display:"inline-flex",alignItems:"center",gap:"4px",marginTop:"3px",padding:"2px 8px",borderRadius:"99px",background:`${sportColor}18`,border:`1px solid ${sportColor}33`}}>
                    <span style={{fontSize:"11px"}}>{ROL_ICONS[role]}</span>
                    <span style={{fontSize:"10px",fontWeight:700,color:sportColor}}>{rolActual?.label}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="sidebar-modules" style={{padding:"12px 8px 4px",borderTop:isDemo?"1px solid var(--border-soft)":"none",marginTop:isDemo?"6px":"0",flex:1}}>
            <div className="hide-mobile" style={{...ss.label,paddingLeft:"8px"}}>Módulos</div>
            {sportModules.map(m=>(
              <motion.button key={m.id} whileHover={{x:3}} whileTap={{scale:0.97}} onClick={()=>setModule(m.id)} style={{display:"flex",alignItems:"center",gap:"8px",padding:"9px 10px",borderRadius:"var(--r-sm)",border:"none",cursor:"pointer",background:module===m.id?`linear-gradient(135deg,${sportColor}22,${sportColor}08)`:"transparent",color:module===m.id?sportColor:"var(--text-2)",width:"100%",textAlign:"left",fontSize:"12px",fontWeight:module===m.id?700:500,marginBottom:"3px",transition:"all 0.2s",boxShadow:module===m.id?`0 0 12px ${sportColor}33`:"none"}}>
                <span style={{width:"4px",height:"16px",borderRadius:"2px",background:module===m.id?sportColor:"transparent",transition:"all 0.2s"}}/>
                <span style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{m.label}</span>
              </motion.button>
            ))}
          </div>

          <div className="sidebar-plan" style={{padding:"12px",borderTop:"1px solid var(--border-soft)"}}>
            <div style={{...ss.card,padding:"10px",border:"1px solid rgba(168,85,247,0.3)",background:"linear-gradient(135deg,rgba(168,85,247,0.08),transparent)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}>
                <span style={{fontSize:"10px",color:"var(--text-2)",textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600}}>Plan</span>
                <span style={{background:"#A855F722",color:"#A855F7",border:"1px solid #A855F755",borderRadius:"99px",padding:"3px 7px",fontSize:"10px",fontWeight:600,boxShadow:"0 0 12px #A855F744"}}>Pro</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                <span style={{width:"8px",height:"8px",borderRadius:"50%",background:"#22C55E",boxShadow:"0 0 8px #22C55E",animation:"pulse-soft 2s infinite"}}/>
                <span style={{fontSize:"10px",color:"#22C55E",fontWeight:600}}>Sistema operativo</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="sportos-main" style={ss.main} key={role+module}>
          <AnimatePresence mode="wait">
            <motion.div key={role+module} {...fadeUp} transition={{duration:0.4}}>
              {role==="superadmin"&&<SuperAdminView module={module} commData={COMMISSION_DATA} clubList={clubList} setClubList={setClubList} showToast={showToast} COUNTRY_COUNTS={COUNTRY_COUNTS}/>}
              {role==="admin"&&<AdminView module={module} sport={sport} sp={sp} club={club} activeClubs={activeClubs} setActiveClubs={setActiveClubs} countryData={countryData} players={players} addPlayer={addPlayer} updatePlayer={updatePlayer} removePlayer={removePlayer} showToast={showToast} sportColor={sportColor} payments={payments} setPayments={setPayments}/>}
              {role==="entrenador"&&<EntrenadorView module={module} sport={sport} sp={sp} club={club} players={players} postLikes={postLikes} setPostLikes={setPostLikes} showToast={showToast} sportColor={sportColor} currentCategory={currentCategory} hiaModal={hiaModal} setHiaModal={setHiaModal} userCats={userCats} isDemo={isDemo} partidos={partidos} setPartidos={setPartidos} clubId={clubId} currentUserId={currentUser?.id||null}/>}
              {role==="preparador"&&<PreparadorView module={module} sp={sp} showToast={showToast} sportColor={sportColor} publishedPlan={publishedPlan} setPublishedPlan={setPublishedPlan} newExForm={newExForm} setNewExForm={setNewExForm} newEx={newEx} setNewEx={setNewEx} gymPlanExercises={gymPlanExercises} setGymPlanExercises={setGymPlanExercises} rankTab={rankTab} setRankTab={setRankTab} expandedDay={expandedDay} setExpandedDay={setExpandedDay} userCats={userCats} isDemo={isDemo}/>}
              {role==="jugador"&&<JugadorView module={module} sport={sport} sp={sp} club={club} player={players[0]} players={players} sportColor={sportColor} countryData={countryData} convocado={convocado} setConvocado={setConvocado} setWhatsappModal={setWhatsappModal} showToast={showToast} gymLog={gymLog} setGymLog={setGymLog} completedSession={completedSession} setCompletedSession={setCompletedSession} newRecord={newRecord} setNewRecord={setNewRecord} expandedEx={expandedEx} setExpandedEx={setExpandedEx} rankTab={rankTab} setRankTab={setRankTab} payments={payments} setPayments={setPayments} userCats={userCats} isDemo={isDemo} partidos={partidos}/>}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
