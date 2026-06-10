import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "../styles/motion";
import { ss } from "../styles/tokens";
import { SPORTS_CONFIG } from "../data/sports";
import SectionTitle from "../components/SectionTitle";
import Stat from "../components/Stat";
import Badge from "../components/Badge";
import Semaforo from "../components/Semaforo";

export default function AdminView({module, sport, sp, club, activeClubs, setActiveClubs, countryData, players, showToast, sportColor, payments=[], setPayments}) {
  const [primaryColor, setPrimaryColor] = useState("#1B4332");
  const [secondaryColor, setSecondaryColor] = useState("#FFD700");
  const [invRol, setInvRol] = useState("jugador");
  const [invLink, setInvLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [invCats, setInvCats] = useState([]);      // entrenador / preparador: múltiples
  const [invPlantel, setInvPlantel] = useState(""); // jugador: uno solo

  const ROL_OPTS = [
    {id:"jugador",    label:"Jugador",           icon:"👤"},
    {id:"entrenador", label:"Entrenador",         icon:"📋"},
    {id:"preparador", label:"Preparador Físico",  icon:"💪"},
  ];

  const toggleCat = (cat) => {
    setInvCats(prev => prev.includes(cat) ? prev.filter(c=>c!==cat) : [...prev,cat]);
    setInvLink("");
  };

  const canGenerate = () => {
    if(invRol==="jugador") return invPlantel !== "";
    return invCats.length > 0;
  };

  const generateLink = () => {
    if(!canGenerate()){ showToast("Asigna al menos una categoría antes de generar","warning"); return; }
    const token = Math.random().toString(36).slice(2,8).toUpperCase();
    const clubSlug = club.name.toLowerCase().replace(/\s+/g,"-");
    const base = window.location.origin;
    const catsParam = invRol==="jugador"
      ? encodeURIComponent(invPlantel)
      : encodeURIComponent(invCats.join(","));
    setInvLink(`${base}/?token=${token}&rol=${invRol}&club=${clubSlug}&cats=${catsParam}`);
    setCopied(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(invLink);
    setCopied(true);
    showToast("Link copiado al portapapeles ✅","success");
    setTimeout(()=>setCopied(false), 2500);
  };

  const sendWhatsApp = () => {
    const rolLabel = ROL_OPTS.find(r=>r.id===invRol)?.label;
    const catsLabel = invRol==="jugador" ? invPlantel : invCats.join(", ");
    const msg = encodeURIComponent(`¡Hola! Te invito a unirte a ${club.name} en SportOS como ${rolLabel} (${catsLabel}).\n\nEntra aquí para crear tu cuenta:\n${invLink}`);
    window.open(`https://wa.me/?text=${msg}`,"_blank");
  };

  if(module==="miclub") return (
    <div>
      <SectionTitle title="Configuración del Club" sub="Deportes activos, colores y métodos de pago"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px"}}>
        <motion.div {...fadeUp} style={ss.card}>
          <div style={{fontWeight:600,marginBottom:"14px",fontSize:"14px"}}>🏅 Deportes activos</div>
          {Object.entries(SPORTS_CONFIG).map(([k,v],i)=>(
            <motion.div key={k} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{duration:0.3,delay:i*0.06}} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid var(--border-soft)"}}>
              <div style={{display:"flex",alignItems:"center",gap:"12px"}}><span style={{fontSize:"22px"}}>{v.icon}</span><span style={{fontSize:"13px",fontWeight:500}}>{v.name}</span></div>
              <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                <motion.div onClick={()=>{setActiveClubs(prev=>({...prev,[k]:!prev[k]}));showToast(`${v.name} ${activeClubs[k]?"desactivado":"activado"}`,activeClubs[k]?"warning":"success");}} whileTap={{scale:0.95}} style={{width:"40px",height:"22px",borderRadius:"99px",background:activeClubs[k]?v.color:"#4A5568",position:"relative",transition:"background 0.2s",cursor:"pointer",boxShadow:activeClubs[k]?`0 0 12px ${v.color}66`:"none"}}>
                  <motion.div animate={{left:activeClubs[k]?"20px":"2px"}} transition={{type:"spring",stiffness:500,damping:30}} style={{position:"absolute",top:"2px",width:"18px",height:"18px",borderRadius:"50%",background:"#fff",boxShadow:"0 2px 4px rgba(0,0,0,0.2)"}}/>
                </motion.div>
                <span style={{fontSize:"11px",color:activeClubs[k]?v.color:"var(--text-3)",fontWeight:600,minWidth:"55px",textAlign:"right"}}>{activeClubs[k]?"Activo":"Inactivo"}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <div>
          <motion.div {...fadeUp} transition={{duration:0.4,delay:0.1}} style={{...ss.card,marginBottom:"12px"}}>
            <div style={{fontWeight:600,marginBottom:"12px",fontSize:"14px"}}>🎨 Paleta del club</div>
            <div style={{display:"flex",gap:"16px",alignItems:"center"}}>
              <div><div style={ss.label}>Primario</div><input type="color" value={primaryColor} onChange={e=>setPrimaryColor(e.target.value)} style={{width:"56px",height:"36px",border:"none",borderRadius:"var(--r-sm)",cursor:"pointer",background:"transparent"}}/></div>
              <div><div style={ss.label}>Secundario</div><input type="color" value={secondaryColor} onChange={e=>setSecondaryColor(e.target.value)} style={{width:"56px",height:"36px",border:"none",borderRadius:"var(--r-sm)",cursor:"pointer",background:"transparent"}}/></div>
              <motion.div animate={{background:`linear-gradient(135deg,${primaryColor},${secondaryColor})`}} style={{flex:1,height:"44px",borderRadius:"var(--r-md)",border:"1px solid var(--border-soft)",boxShadow:"var(--shadow-sm)"}}/>
            </div>
          </motion.div>
          <motion.div {...fadeUp} transition={{duration:0.4,delay:0.15}} style={{...ss.card,marginBottom:"12px"}}>
            <div style={{fontWeight:600,marginBottom:"12px",fontSize:"14px"}}>💳 País y pagos</div>
            <div style={{fontSize:"15px",marginBottom:"8px",fontWeight:500}}>{countryData.flag} {countryData.name} · {countryData.currency}</div>
            <div style={{...ss.muted,fontSize:"11px",marginBottom:"10px"}}>Documento fiscal: {countryData.tax}</div>
            <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>{countryData.payments.map(p=><Badge key={p} color="#3B82F6">{p}</Badge>)}</div>
          </motion.div>
          <motion.div {...fadeUp} transition={{duration:0.4,delay:0.2}} style={ss.card}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontWeight:700,fontSize:"14px"}}>⚡ Plan Pro</div><div style={{...ss.muted,fontSize:"11px",marginTop:"4px"}}>Renueva el 15 Jun 2025</div></div>
              <Badge color="#A855F7" glow>Activo</Badge>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Generador de invitaciones ── */}
      <motion.div {...fadeUp} transition={{delay:0.25}} style={{...ss.card, marginTop:"20px", border:"1px solid rgba(34,197,94,0.25)", background:"linear-gradient(135deg,rgba(34,197,94,0.06),transparent)"}}>
        <div style={{fontWeight:700,fontSize:"14px",marginBottom:"16px",display:"flex",alignItems:"center",gap:"8px"}}>
          🔗 Invitar miembros al club
        </div>

        {/* Paso 1: elegir rol */}
        <div style={{marginBottom:"16px"}}>
          <div style={ss.label}>1. Rol a invitar</div>
          <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginTop:"6px"}}>
            {ROL_OPTS.map(r=>(
              <motion.button key={r.id} whileTap={{scale:0.96}} onClick={()=>{ setInvRol(r.id); setInvLink(""); setInvCats([]); setInvPlantel(""); }}
                style={{...ss.btn, background:invRol===r.id?`linear-gradient(135deg,${sportColor}33,${sportColor}11)`:"var(--bg-elev-2)", color:invRol===r.id?sportColor:"var(--text-2)", border:`1px solid ${invRol===r.id?sportColor+"55":"var(--border-soft)"}`, fontSize:"12px", padding:"9px 16px", boxShadow:invRol===r.id?`0 0 14px ${sportColor}33`:"none"}}>
                {r.icon} {r.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Paso 2: asignar categoría(s) */}
        <div style={{marginBottom:"18px"}}>
          {invRol === "jugador" ? (
            <>
              <div style={ss.label}>2. Asignar plantel</div>
              <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginTop:"6px"}}>
                {sp.categories.map(cat=>(
                  <motion.button key={cat} whileTap={{scale:0.96}} onClick={()=>{ setInvPlantel(cat); setInvLink(""); }}
                    style={{...ss.btn, background:invPlantel===cat?"rgba(34,197,94,0.15)":"var(--bg-elev-2)", color:invPlantel===cat?"#22C55E":"var(--text-2)", border:`1px solid ${invPlantel===cat?"rgba(34,197,94,0.4)":"var(--border-soft)"}`, fontSize:"12px", padding:"8px 14px"}}>
                    {invPlantel===cat?"✅ ":""}{cat}
                  </motion.button>
                ))}
              </div>
              {invPlantel && <div style={{...ss.muted,fontSize:"11px",marginTop:"6px"}}>El jugador solo verá la nómina, entrenamientos y convocatorias de <strong style={{color:"#22C55E"}}>{invPlantel}</strong>.</div>}
            </>
          ) : (
            <>
              <div style={ss.label}>2. Asignar categorías <span style={{color:"var(--text-3)",fontWeight:400}}>(puede ser más de una)</span></div>
              <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginTop:"6px"}}>
                {sp.categories.map(cat=>{
                  const active = invCats.includes(cat);
                  return (
                    <motion.button key={cat} whileTap={{scale:0.96}} onClick={()=>toggleCat(cat)}
                      style={{...ss.btn, background:active?`linear-gradient(135deg,${sportColor}22,${sportColor}08)`:"var(--bg-elev-2)", color:active?sportColor:"var(--text-2)", border:`1px solid ${active?sportColor+"55":"var(--border-soft)"}`, fontSize:"12px", padding:"8px 14px", boxShadow:active?`0 0 12px ${sportColor}22`:"none"}}>
                      {active?"✅ ":""}{cat}
                    </motion.button>
                  );
                })}
              </div>
              {invCats.length > 0 && <div style={{...ss.muted,fontSize:"11px",marginTop:"6px"}}>Tendrá acceso a: <strong style={{color:sportColor}}>{invCats.join(", ")}</strong>.</div>}
            </>
          )}
        </div>

        {/* Paso 3: generar */}
        <motion.button whileHover={{scale:1.03,y:-1}} whileTap={{scale:0.97}} onClick={generateLink}
          style={{...ss.btn, background:canGenerate()?`linear-gradient(135deg,${sportColor},${sportColor}cc)`:"var(--bg-elev-2)", color:canGenerate()?"#fff":"var(--text-3)", fontSize:"13px", padding:"11px 24px", boxShadow:canGenerate()?`0 6px 20px ${sportColor}44`:"none", fontWeight:700, marginBottom:"14px", cursor:canGenerate()?"pointer":"not-allowed"}}>
          🔗 Generar link de invitación
        </motion.button>

        {invLink && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} style={{background:"var(--bg-elev-1)",borderRadius:"var(--r-md)",padding:"14px",border:"1px solid var(--border-soft)"}}>
            <div style={ss.label}>Link de invitación generado</div>
            <div style={{display:"flex",gap:"8px",alignItems:"center",marginTop:"6px",flexWrap:"wrap"}}>
              <div style={{flex:1,fontSize:"11px",color:"#22C55E",fontFamily:"monospace",wordBreak:"break-all",padding:"8px 12px",background:"rgba(34,197,94,0.08)",borderRadius:"var(--r-sm)",border:"1px solid rgba(34,197,94,0.2)"}}>
                {invLink}
              </div>
              <div style={{display:"flex",gap:"6px",flexShrink:0}}>
                <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={copyLink}
                  style={{...ss.btn, background:copied?"rgba(34,197,94,0.2)":"var(--bg-elev-2)", color:copied?"#22C55E":"var(--text-1)", border:`1px solid ${copied?"rgba(34,197,94,0.4)":"var(--border-soft)"}`, fontSize:"12px", padding:"9px 14px", fontWeight:copied?700:400}}>
                  {copied ? "✅ Copiado" : "📋 Copiar"}
                </motion.button>
                <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={sendWhatsApp}
                  style={{...ss.btn, background:"rgba(37,211,102,0.15)", color:"#25D366", border:"1px solid rgba(37,211,102,0.3)", fontSize:"12px", padding:"9px 14px", fontWeight:700}}>
                  WhatsApp
                </motion.button>
              </div>
            </div>
            <div style={{...ss.muted,fontSize:"11px",marginTop:"8px"}}>
              Este link es de un solo uso. El invitado podrá registrarse directamente como <strong style={{color:sportColor}}>{ROL_OPTS.find(r=>r.id===invRol)?.label}</strong> en {club.name}.
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );

  if(module==="jugadores") return (
    <div>
      <SectionTitle title={`Plantel — ${sp.name} · ${players.length} jugadores`}/>
      <motion.div {...fadeUp} style={{...ss.card,padding:0,overflow:"hidden"}}>
        <table style={{width:"100%",fontSize:"12px",borderCollapse:"collapse"}}>
          <thead><tr>{["Jugador","Cat.","Salud","Cuota","Edad"].map(h=><th key={h} style={{textAlign:"left",color:"var(--text-3)",padding:"14px 12px",fontWeight:600,borderBottom:"1px solid var(--border-soft)",textTransform:"uppercase",letterSpacing:"0.05em",fontSize:"10px"}}>{h}</th>)}</tr></thead>
          <tbody>{players.slice(0,12).map((p,i)=>(
            <motion.tr key={p.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{duration:0.3,delay:i*0.04}} whileHover={{background:"var(--bg-elev-2)"}} style={{borderBottom:"1px solid var(--border-soft)"}}>
              <td style={{padding:"12px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                  <div style={{width:"32px",height:"32px",borderRadius:"50%",background:`linear-gradient(135deg,${sportColor}33,${sportColor}11)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:800,color:sportColor,border:`1.5px solid ${sportColor}55`}}>{p.name.split(" ").map(n=>n[0]).join("")}</div>
                  <span style={{fontWeight:500}}>{p.name}</span>
                </div>
              </td>
              <td>{p.cat}</td>
              <td><Semaforo status={p.med}/></td>
              <td><Badge color={p.cuota==="ok"?"#22C55E":"#EF4444"}>{p.cuota==="ok"?"Al día":"Vencida"}</Badge></td>
              <td>{p.age}</td>
            </motion.tr>
          ))}</tbody>
        </table>
      </motion.div>
    </div>
  );

  if(module==="finanzas") {
    const totalRecaudado = payments.reduce((s,p)=>s+p.amount,0);
    const pagados = payments.length;
    const pendientes = players.filter(p=>p.cuota!=="ok").length;
    const methodColors = {Khipu:"#22C55E",Transbank:"#3B82F6",Transferencia:"#F59E0B","Mercado Pago":"#06B6D4",Pix:"#22C55E"};

    return (
      <div>
        <SectionTitle title="Finanzas del Club" sub={`${countryData.flag} ${countryData.name} · ${countryData.tax}`}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"14px",marginBottom:"20px"}}>
          <Stat label="Total recaudado" value={`${countryData.symbol}${totalRecaudado.toLocaleString()}`} sub={`${countryData.currency} · ${pagados} pagos`} color="#22C55E" icon="💰" delay={0.05}/>
          <Stat label="Pendientes" value={pendientes} sub="jugadores sin pagar" color="#EF4444" icon="⚠️" delay={0.1}/>
          <Stat label="Cuota mensual" value={`${countryData.symbol}${club.cuota.toLocaleString()}`} sub={`${countryData.payments[0]}`} color="#3B82F6" icon="🎫" delay={0.15}/>
        </div>

        {/* Botón cobro masivo */}
        <div style={{display:"flex",gap:"10px",marginBottom:"20px",flexWrap:"wrap"}}>
          <motion.button whileHover={{scale:1.02,y:-2}} whileTap={{scale:0.98}}
            onClick={()=>showToast(`Cobro masivo enviado a ${pendientes} jugadores por ${countryData.payments[0]}`,"success")}
            style={{...ss.btn,background:"linear-gradient(135deg,#22C55E,#16A34A)",color:"#fff",padding:"14px 24px",fontSize:"13px",boxShadow:"0 8px 24px rgba(34,197,94,0.35)"}}>
            💳 Cobrar cuota masiva
          </motion.button>
          <motion.button whileHover={{scale:1.02,y:-2}} whileTap={{scale:0.98}}
            onClick={()=>showToast("Reporte exportado como CSV","success")}
            style={{...ss.btn,background:"var(--bg-elev-2)",color:"var(--text-2)",border:"1px solid var(--border-soft)",padding:"14px 20px",fontSize:"13px"}}>
            📊 Exportar CSV
          </motion.button>
        </div>

        {/* Historial de pagos en tiempo real */}
        <motion.div {...fadeUp} style={ss.card}>
          <div style={{fontWeight:600,fontSize:"14px",marginBottom:"16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span>📋 Pagos recibidos</span>
            <Badge color="#22C55E">{pagados} pagos</Badge>
          </div>

          {payments.length === 0 && (
            <div style={{textAlign:"center",padding:"30px 0",color:"var(--text-3)",fontSize:"13px"}}>Sin pagos registrados aún</div>
          )}

          {payments.map((p,i)=>(
            <motion.div key={p.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}
              style={{display:"flex",alignItems:"center",gap:"12px",padding:"12px 0",borderBottom:i<payments.length-1?"1px solid var(--border-soft)":"none"}}>
              <div style={{width:"38px",height:"38px",borderRadius:"50%",background:`linear-gradient(135deg,${sportColor}33,${sportColor}11)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:800,color:sportColor,border:`1.5px solid ${sportColor}44`,flexShrink:0}}>
                {p.playerName.split(" ").map(n=>n[0]).join("").slice(0,2)}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:"13px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.playerName}</div>
                <div style={{...ss.muted,fontSize:"11px",marginTop:"3px"}}>{p.date}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"4px",flexShrink:0}}>
                <span style={{fontWeight:700,color:"#22C55E",fontSize:"14px"}}>{countryData.symbol}{p.amount.toLocaleString()}</span>
                <span style={{fontSize:"10px",padding:"2px 7px",borderRadius:"99px",background:`${methodColors[p.method]||"#3B82F6"}22`,color:methodColors[p.method]||"#3B82F6",border:`1px solid ${methodColors[p.method]||"#3B82F6"}44`,fontWeight:600}}>{p.method}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Nota comisión */}
        <motion.div {...fadeUp} transition={{delay:0.2}} style={{...ss.card,marginTop:"14px",background:"linear-gradient(135deg,rgba(59,130,246,0.08),transparent)",border:"1px solid rgba(59,130,246,0.25)"}}>
          <div style={{display:"flex",gap:"12px",alignItems:"center"}}>
            <span style={{fontSize:"18px",flexShrink:0}}>ℹ️</span>
            <span style={{fontSize:"12px",color:"var(--text-2)",lineHeight:1.5}}>SportOS retiene una comisión del <strong style={{color:"#3B82F6"}}>3%</strong> por transacción para infraestructura y soporte.</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}
