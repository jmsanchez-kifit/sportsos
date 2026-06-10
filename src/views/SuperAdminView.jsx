import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { fadeUp } from "../styles/motion";
import { ss } from "../styles/tokens";
import { SPORTS_CONFIG, COUNTRIES } from "../data/sports";
import SectionTitle from "../components/SectionTitle";
import Stat from "../components/Stat";
import Badge from "../components/Badge";

function ComparisonTable() {
  const rows=[
    ["Deportes soportados","3 (fútbol, básquet, béisbol)","5 (Rugby, Fútbol, Handball, Basketball, Hockey)"],
    ["Mercado objetivo","Europa","América Latina"],
    ["Pagos locales LATAM","❌","✅ Khipu / Mercado Pago / Pix / SPEI / PSE"],
    ["Integración WhatsApp","❌","✅ Nativo"],
    ["Módulo gym profesional","❌","✅ Con preparador físico"],
    ["Protocolo HIA Rugby","❌","✅ Pasos 1-2-3"],
    ["Multi-moneda LATAM","❌","✅ 6 países, 6 monedas"],
    ["Cumplimiento tributario local","❌","✅ SII / AFIP / SAT / DIAN / SUNAT"],
    ["Personalización por deporte","Parcial","✅ Total — posiciones, stats, formaciones"],
  ];
  return (
    <motion.div {...fadeUp} style={{...ss.card,border:"1px solid rgba(59,130,246,0.3)",background:"linear-gradient(135deg,rgba(59,130,246,0.05),transparent)"}}>
      <div style={{fontWeight:700,fontSize:"16px",marginBottom:"16px",color:"#3B82F6",display:"flex",alignItems:"center",gap:"8px"}}>⚡ SportOS vs SportEasy</div>
      <table style={{width:"100%",fontSize:"12px",borderCollapse:"collapse"}}>
        <thead><tr>
          <th style={{textAlign:"left",color:"var(--text-3)",padding:"10px 8px",borderBottom:"1px solid var(--border-soft)",textTransform:"uppercase",letterSpacing:"0.05em",fontSize:"10px"}}>Característica</th>
          <th style={{textAlign:"center",color:"var(--text-3)",padding:"10px 8px",borderBottom:"1px solid var(--border-soft)",textTransform:"uppercase",letterSpacing:"0.05em",fontSize:"10px"}}>SportEasy</th>
          <th style={{textAlign:"center",color:"#22C55E",padding:"10px 8px",borderBottom:"1px solid var(--border-soft)",textTransform:"uppercase",letterSpacing:"0.05em",fontSize:"10px"}}>SportOS ⚡</th>
        </tr></thead>
        <tbody>{rows.map(([f,s,o],i)=>(
          <motion.tr key={i} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.3,delay:i*0.04}} style={{borderBottom:"1px solid var(--border-soft)"}}>
            <td style={{padding:"10px 8px",fontWeight:500}}>{f}</td>
            <td style={{textAlign:"center",color:"#EF4444",padding:"10px 8px"}}>{s}</td>
            <td style={{textAlign:"center",color:"#22C55E",fontWeight:600,padding:"10px 8px"}}>{o}</td>
          </motion.tr>
        ))}</tbody>
      </table>
    </motion.div>
  );
}

export default function SuperAdminView({module, commData, clubList, setClubList, showToast, COUNTRY_COUNTS}) {
  const toggle = (id) => {
    const club = clubList.find(c=>c.id===id);
    setClubList(prev=>prev.map(c=>c.id===id?{...c,status:c.status==="active"?"suspended":"active"}:c));
    showToast(club.status==="active"?`${club.name} suspendido`:`${club.name} reactivado`, club.status==="active"?"warning":"success");
  };

  if(module==="dashboard") return (
    <div>
      <SectionTitle title="Dashboard Global — SportOS" sub="Vista de operaciones en toda América Latina"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"14px",marginBottom:"20px"}}>
        {Object.entries(COUNTRY_COUNTS).map(([k,v],i)=>{const c=COUNTRIES[k];return (
          <motion.div key={k} {...fadeUp} transition={{duration:0.5,delay:i*0.1}} whileHover={{y:-3}} style={{...ss.card,display:"flex",alignItems:"center",gap:"14px"}}>
            <div style={{fontSize:"36px",filter:"drop-shadow(0 0 12px rgba(110,91,255,0.4))"}}>{c.flag}</div>
            <div><div style={{fontSize:"28px",fontWeight:800,letterSpacing:"-0.02em"}}>{v}</div><div style={ss.muted}>{c.name} · clubes activos</div></div>
          </motion.div>
        );})}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"14px",marginBottom:"24px"}}>
        <Stat label="Comisión Hoy" value="USD 1.248" sub="↑ 12% vs ayer" color="#22C55E" icon="💰" delay={0.1}/>
        <Stat label="MRR Total" value="USD 38.400" sub="65 clubes activos" color="#3B82F6" icon="📈" delay={0.15}/>
        <Stat label="Clubes Activos" value="65" sub="↑ 3 este mes" color="#A855F7" icon="🏢" delay={0.2}/>
        <Stat label="Alertas Past Due" value="4" sub="Requieren atención" color="#EF4444" icon="⚠️" delay={0.25}/>
      </div>
      <motion.div {...fadeUp} style={ss.card}>
        <div style={{fontWeight:600,marginBottom:"16px",fontSize:"14px",display:"flex",alignItems:"center",gap:"8px"}}>📈 Comisiones SportOS — últimos 6 meses (USD)</div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={commData}>
            <defs>
              <linearGradient id="comm-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.5}/>
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
            <XAxis dataKey="month" stroke="#6B7896" fontSize={11}/>
            <YAxis stroke="#6B7896" fontSize={11}/>
            <Tooltip contentStyle={{background:"var(--bg-glass-strong)",backdropFilter:"blur(20px)",border:"1px solid var(--border-mid)",borderRadius:"var(--r-md)",color:"var(--text-1)",fontSize:12}}/>
            <Area type="monotone" dataKey="val" stroke="#3B82F6" fill="url(#comm-grad)" strokeWidth={2.5}/>
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
      <motion.div {...fadeUp} transition={{duration:0.5,delay:0.1}} style={{...ss.card,marginTop:"20px"}}>
        <div style={{fontWeight:600,marginBottom:"16px",fontSize:"14px"}}>💸 Transacciones recientes</div>
        <table style={{width:"100%",fontSize:"12px",borderCollapse:"collapse"}}>
          <thead><tr>{["Club","Deporte","País","Monto","Comisión SportOS","Estado"].map(h=><th key={h} style={{textAlign:"left",color:"var(--text-3)",padding:"10px 8px",fontWeight:600,borderBottom:"1px solid var(--border-soft)",textTransform:"uppercase",letterSpacing:"0.05em",fontSize:"10px"}}>{h}</th>)}</tr></thead>
          <tbody>{clubList.slice(0,5).map((c,i)=>{const cd=COUNTRIES[c.country];const sp2=SPORTS_CONFIG[c.sport];return (
            <motion.tr key={c.id} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.4,delay:i*0.05}} style={{borderBottom:"1px solid var(--border-soft)"}}>
              <td style={{padding:"10px 8px",fontWeight:500}}>{cd.flag} {c.name}</td><td>{sp2.icon} {sp2.name}</td><td>{c.country}</td>
              <td>{cd.symbol}{c.mrr.toLocaleString()} {cd.currency}</td>
              <td style={{color:"#22C55E",fontWeight:600}}>{cd.symbol}{Math.round(c.mrr*0.03).toLocaleString()}</td>
              <td><Badge color={c.status==="active"?"#22C55E":c.status==="past_due"?"#F59E0B":"#EF4444"}>{c.status}</Badge></td>
            </motion.tr>
          );})}</tbody>
        </table>
      </motion.div>
      <div style={{marginTop:"20px"}}><ComparisonTable/></div>
    </div>
  );

  if(module==="clubes") return (
    <div>
      <SectionTitle title="Gestión de Clubes" sub={`${clubList.filter(c=>c.status==="active").length} activos · ${clubList.filter(c=>c.status==="past_due").length} con deuda`}/>
      <motion.div {...fadeUp} style={{...ss.card,padding:0,overflow:"hidden"}}>
        <table style={{width:"100%",fontSize:"12px",borderCollapse:"collapse"}}>
          <thead><tr>{["","Club","Plan","Jugadores","MRR","Estado","Acciones"].map(h=><th key={h} style={{textAlign:"left",color:"var(--text-3)",padding:"14px 12px",fontWeight:600,borderBottom:"1px solid var(--border-soft)",textTransform:"uppercase",letterSpacing:"0.05em",fontSize:"10px"}}>{h}</th>)}</tr></thead>
          <tbody>{clubList.map((c,i)=>{const cd=COUNTRIES[c.country];const sp2=SPORTS_CONFIG[c.sport];return (
            <motion.tr key={c.id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{duration:0.3,delay:i*0.04}} whileHover={{background:"var(--bg-elev-2)"}} style={{borderBottom:"1px solid var(--border-soft)"}}>
              <td style={{padding:"12px"}}>{cd.flag} {sp2.icon}</td><td style={{fontWeight:600}}>{c.name}</td>
              <td><Badge color="#A855F7">{c.plan}</Badge></td>
              <td>{c.players}</td><td>{cd.symbol}{c.mrr.toLocaleString()}</td>
              <td><Badge color={c.status==="active"?"#22C55E":c.status==="past_due"?"#F59E0B":"#EF4444"}>{c.status}</Badge></td>
              <td><motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={()=>toggle(c.id)} style={{...ss.btn,background:c.status==="active"?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)",color:c.status==="active"?"#EF4444":"#22C55E",fontSize:"11px",border:`1px solid ${c.status==="active"?"#EF444455":"#22C55E55"}`}}>{c.status==="active"?"Suspender":"Reactivar"}</motion.button></td>
            </motion.tr>
          );})}</tbody>
        </table>
      </motion.div>
    </div>
  );

  if(module==="comisiones") return (
    <div>
      <SectionTitle title="Comisiones por País" sub="Método de facturación local por país"/>
      {Object.entries(COUNTRIES).map(([k,v],i)=>(
        <motion.div key={k} {...fadeUp} transition={{duration:0.4,delay:i*0.1}} whileHover={{y:-2}} style={{...ss.card,marginBottom:"12px",display:"flex",alignItems:"center",gap:"16px"}}>
          <div style={{fontSize:"40px",filter:"drop-shadow(0 0 12px rgba(110,91,255,0.3))"}}>{v.flag}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:"15px",display:"flex",alignItems:"center",gap:"8px"}}>{v.name} <Badge color="#3B82F6">{v.currency}</Badge></div>
            <div style={{...ss.muted,marginTop:"6px",fontSize:"12px"}}>Documento fiscal: <span style={{color:"var(--text-1)"}}>{v.tax}</span> · Métodos: {v.payments.join(", ")}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:"22px",fontWeight:800,color:"#22C55E",letterSpacing:"-0.02em"}}>{v.symbol}{((k.charCodeAt(0)*131)%2000+500).toLocaleString()}</div>
            <div style={ss.muted}>comisión este mes</div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  if(module==="comparativa") return <ComparisonTable/>;
  return null;
}
