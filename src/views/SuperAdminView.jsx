import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { fadeUp } from "../styles/motion";
import { ss } from "../styles/tokens";
import { SPORTS_CONFIG, COUNTRIES } from "../data/sports";
import { supabase } from "../lib/supabase";
import SectionTitle from "../components/SectionTitle";
import Badge from "../components/Badge";

const PLAN_COLOR = { free:"#6B7896", pro:"#C0392B", elite:"#C98408" };

function StatCard({ icon, value, label, sub, color, delay=0 }) {
  return (
    <motion.div {...fadeUp} transition={{ delay }} whileHover={{ y:-3 }}
      style={{ ...ss.card, padding:"20px", border:`1px solid ${color}33`,
        background:`linear-gradient(135deg,${color}08,transparent)` }}>
      <div style={{ fontSize:"24px", marginBottom:"10px" }}>{icon}</div>
      <div style={{ fontSize:"32px", fontWeight:900, color, letterSpacing:"-0.03em" }}>{value}</div>
      <div style={{ fontWeight:700, fontSize:"13px", marginTop:"6px" }}>{label}</div>
      {sub && <div style={{ fontSize:"11px", color:"var(--text-3)", marginTop:"3px" }}>{sub}</div>}
    </motion.div>
  );
}

function AlertRow({ icon, msg, color }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px",
      borderRadius:"var(--r-sm)", background:`${color}08`, border:`1px solid ${color}22`,
      marginBottom:"8px", fontSize:"12px" }}>
      <span style={{ fontSize:"16px" }}>{icon}</span>
      <span style={{ color:"var(--text-2)" }}>{msg}</span>
    </div>
  );
}

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
      <div style={{fontWeight:700,fontSize:"16px",marginBottom:"16px",color:"#3B82F6"}}>⚡ SportOS vs SportEasy</div>
      <table style={{width:"100%",fontSize:"12px",borderCollapse:"collapse"}}>
        <thead><tr>
          <th style={{textAlign:"left",color:"var(--text-3)",padding:"10px 8px",borderBottom:"1px solid var(--border-soft)",textTransform:"uppercase",letterSpacing:"0.05em",fontSize:"10px"}}>Característica</th>
          <th style={{textAlign:"center",color:"var(--text-3)",padding:"10px 8px",borderBottom:"1px solid var(--border-soft)",textTransform:"uppercase",letterSpacing:"0.05em",fontSize:"10px"}}>SportEasy</th>
          <th style={{textAlign:"center",color:"#22C55E",padding:"10px 8px",borderBottom:"1px solid var(--border-soft)",textTransform:"uppercase",letterSpacing:"0.05em",fontSize:"10px"}}>SportOS ⚡</th>
        </tr></thead>
        <tbody>{rows.map(([f,s,o],i)=>(
          <tr key={i} style={{borderBottom:"1px solid var(--border-soft)"}}>
            <td style={{padding:"10px 8px",fontWeight:500}}>{f}</td>
            <td style={{textAlign:"center",color:"#EF4444",padding:"10px 8px"}}>{s}</td>
            <td style={{textAlign:"center",color:"#22C55E",fontWeight:600,padding:"10px 8px"}}>{o}</td>
          </tr>
        ))}</tbody>
      </table>
    </motion.div>
  );
}

// ── Hook: carga datos reales de Supabase ──────────────────────────────────
function useAdminData() {
  const [data, setData] = useState({ clubs:[], users:[], loading:true });

  useEffect(() => {
    const load = async () => {
      const [{ data: clubs }, { data: users }] = await Promise.all([
        supabase.from("clubs").select("*").order("created_at", { ascending:false }),
        supabase.from("profiles").select("id,nombre,rol,plan,club_id,created_at").order("created_at", { ascending:false }),
      ]);
      setData({ clubs: clubs||[], users: users||[], loading:false });
    };
    load();
  }, []);

  return data;
}

// ── Vista principal ───────────────────────────────────────────────────────
export default function SuperAdminView({ module, commData, clubList, setClubList, showToast, COUNTRY_COUNTS }) {
  const { clubs, users, loading } = useAdminData();

  const totalClubes  = clubs.length || clubList.length;
  const totalUsuarios = users.length;
  const porPlan = {
    free:  users.filter(u=>!u.plan||u.plan==="free").length,
    pro:   users.filter(u=>u.plan==="pro").length,
    elite: users.filter(u=>u.plan==="elite").length,
  };
  const mrrEstimado = porPlan.pro * 29 + porPlan.elite * 59;

  // Últimos 7 días de registros
  const hace7dias = new Date(Date.now() - 7*24*3600*1000).toISOString();
  const nuevosEstaSemana = users.filter(u => u.created_at > hace7dias).length;
  const clubesNuevos = clubs.filter(c => c.created_at > hace7dias).length;

  // Alertas: clubes sin jugadores (solo 1 usuario = el admin)
  const clubesSolos = clubs.filter(c => users.filter(u=>u.club_id===c.id).length <= 1);

  const pieData = [
    { name:"Free",  value: porPlan.free  || 1, color:"#6B7896" },
    { name:"Pro",   value: porPlan.pro   || 0, color:"#C0392B" },
    { name:"Elite", value: porPlan.elite || 0, color:"#C98408" },
  ];

  const toggle = (id) => {
    const club = clubList.find(c=>c.id===id);
    if (!club) return;
    setClubList(prev=>prev.map(c=>c.id===id?{...c,status:c.status==="active"?"suspended":"active"}:c));
    showToast(club.status==="active"?`${club.name} suspendido`:`${club.name} reactivado`, club.status==="active"?"warning":"success");
  };

  if (module==="dashboard") return (
    <div>
      <SectionTitle title="Dashboard Global — SportOS" sub="Operaciones en tiempo real · América Latina"/>

      {loading && (
        <div style={{ fontSize:"12px", color:"var(--text-3)", marginBottom:"16px" }}>
          ⏳ Cargando datos de Supabase...
        </div>
      )}

      {/* Stats principales */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px", marginBottom:"20px" }}>
        <StatCard icon="🏢" value={totalClubes} label="Clubes activos" sub={`+${clubesNuevos} esta semana`} color="#3B82F6" delay={0}/>
        <StatCard icon="👥" value={totalUsuarios} label="Usuarios totales" sub={`+${nuevosEstaSemana} esta semana`} color="#1FA04A" delay={0.05}/>
        <StatCard icon="💰" value={`$${mrrEstimado}`} label="MRR estimado (USD)" sub={`${porPlan.pro} Pro · ${porPlan.elite} Elite`} color="#C98408" delay={0.1}/>
        <StatCard icon="🆓" value={porPlan.free} label="Usuarios Free" sub="Sin plan de pago aún" color="#6B7896" delay={0.15}/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:"16px", marginBottom:"20px" }}>
        {/* Gráfico de registros mock semanal */}
        <motion.div {...fadeUp} style={{ ...ss.card }}>
          <div style={{ fontWeight:600, marginBottom:"16px", fontSize:"14px" }}>📈 Registros — últimos 6 meses</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={commData}>
              <defs>
                <linearGradient id="comm-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C0392B" stopOpacity={0.5}/>
                  <stop offset="100%" stopColor="#C0392B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
              <XAxis dataKey="month" stroke="#6B7896" fontSize={11}/>
              <YAxis stroke="#6B7896" fontSize={11}/>
              <Tooltip contentStyle={{background:"var(--bg-glass-strong)",backdropFilter:"blur(20px)",border:"1px solid var(--border-mid)",borderRadius:"var(--r-md)",color:"var(--text-1)",fontSize:12}}/>
              <Area type="monotone" dataKey="val" stroke="#C0392B" fill="url(#comm-grad)" strokeWidth={2.5}/>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Distribución de planes */}
        <motion.div {...fadeUp} transition={{ delay:0.1 }} style={{ ...ss.card }}>
          <div style={{ fontWeight:600, marginBottom:"12px", fontSize:"14px" }}>🎯 Distribución de planes</div>
          <PieChart width={200} height={120}>
            <Pie data={pieData} cx={100} cy={60} innerRadius={35} outerRadius={55} dataKey="value">
              {pieData.map((e,i) => <Cell key={i} fill={e.color}/>)}
            </Pie>
            <Tooltip contentStyle={{background:"var(--bg-glass-strong)",border:"1px solid var(--border-mid)",borderRadius:"var(--r-sm)",fontSize:11}}/>
          </PieChart>
          <div style={{ display:"flex", flexDirection:"column", gap:"6px", marginTop:"8px" }}>
            {pieData.map(p => (
              <div key={p.name} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:"12px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                  <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:p.color, display:"inline-block" }}/>
                  <span style={{ color:"var(--text-2)" }}>{p.name}</span>
                </div>
                <span style={{ fontWeight:700, color:p.color }}>{p.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Alertas */}
      <motion.div {...fadeUp} transition={{ delay:0.15 }} style={{ ...ss.card, marginBottom:"20px" }}>
        <div style={{ fontWeight:600, marginBottom:"14px", fontSize:"14px" }}>🚨 Alertas del sistema</div>
        {clubesSolos.length > 0
          ? clubesSolos.slice(0,5).map(c => (
              <AlertRow key={c.id} icon="⚠️" msg={`Club "${c.name}" tiene solo 1 usuario — posible abandono`} color="#C98408"/>
            ))
          : <AlertRow icon="✅" msg="Sin alertas activas — todos los clubes tienen actividad" color="#1FA04A"/>
        }
        {porPlan.free > porPlan.pro * 3 && (
          <AlertRow icon="📣" msg={`${porPlan.free} usuarios en plan Free sin convertir a Pro`} color="#C0392B"/>
        )}
      </motion.div>

      {/* Últimos usuarios registrados */}
      <motion.div {...fadeUp} transition={{ delay:0.2 }} style={{ ...ss.card }}>
        <div style={{ fontWeight:600, marginBottom:"16px", fontSize:"14px" }}>👥 Últimos usuarios registrados</div>
        {users.length === 0 ? (
          <div style={{ fontSize:"12px", color:"var(--text-3)" }}>Sin usuarios registrados aún.</div>
        ) : (
          <table style={{ width:"100%", fontSize:"12px", borderCollapse:"collapse" }}>
            <thead><tr>
              {["Nombre","Rol","Plan","Fecha"].map(h => (
                <th key={h} style={{ textAlign:"left", color:"var(--text-3)", padding:"8px", borderBottom:"1px solid var(--border-soft)", textTransform:"uppercase", letterSpacing:"0.05em", fontSize:"10px" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {users.slice(0,8).map((u,i) => (
                <motion.tr key={u.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.04}}
                  style={{ borderBottom:"1px solid var(--border-soft)" }}>
                  <td style={{ padding:"10px 8px", fontWeight:600 }}>{u.nombre || "—"}</td>
                  <td style={{ padding:"10px 8px", color:"var(--text-2)" }}>{u.rol || "jugador"}</td>
                  <td style={{ padding:"10px 8px" }}>
                    <Badge color={PLAN_COLOR[u.plan||"free"]}>{u.plan||"free"}</Badge>
                  </td>
                  <td style={{ padding:"10px 8px", color:"var(--text-3)" }}>
                    {u.created_at ? new Date(u.created_at).toLocaleDateString("es-CL") : "—"}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );

  if (module==="clubes") return (
    <div>
      <SectionTitle title="Gestión de Clubes" sub={`${clubs.length || clubList.length} clubes registrados`}/>

      {/* Clubes reales de Supabase */}
      {clubs.length > 0 && (
        <motion.div {...fadeUp} style={{ ...ss.card, padding:0, overflow:"hidden", marginBottom:"20px" }}>
          <div style={{ padding:"14px 16px", borderBottom:"1px solid var(--border-soft)", fontWeight:600, fontSize:"13px" }}>
            Clubes en Supabase
          </div>
          <table style={{ width:"100%", fontSize:"12px", borderCollapse:"collapse" }}>
            <thead><tr>
              {["Club","Deporte","País","Usuarios","Creado"].map(h => (
                <th key={h} style={{ textAlign:"left", color:"var(--text-3)", padding:"12px", borderBottom:"1px solid var(--border-soft)", textTransform:"uppercase", letterSpacing:"0.05em", fontSize:"10px" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {clubs.map((c,i) => {
                const sp2 = SPORTS_CONFIG[c.sport] || SPORTS_CONFIG.rugby;
                const miembros = users.filter(u => u.club_id === c.id).length;
                return (
                  <motion.tr key={c.id} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}
                    style={{ borderBottom:"1px solid var(--border-soft)" }}>
                    <td style={{ padding:"12px", fontWeight:600 }}>{c.name}</td>
                    <td style={{ padding:"12px" }}>{sp2.icon} {sp2.name}</td>
                    <td style={{ padding:"12px" }}>{c.country || "—"}</td>
                    <td style={{ padding:"12px" }}>
                      <Badge color={miembros > 1 ? "#1FA04A" : "#C98408"}>{miembros} usuarios</Badge>
                    </td>
                    <td style={{ padding:"12px", color:"var(--text-3)" }}>
                      {c.created_at ? new Date(c.created_at).toLocaleDateString("es-CL") : "—"}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Clubes mock (demo data) */}
      <motion.div {...fadeUp} transition={{ delay:0.1 }} style={{ ...ss.card, padding:0, overflow:"hidden" }}>
        <div style={{ padding:"14px 16px", borderBottom:"1px solid var(--border-soft)", fontWeight:600, fontSize:"13px", color:"var(--text-3)" }}>
          Datos de referencia (mock)
        </div>
        <table style={{ width:"100%", fontSize:"12px", borderCollapse:"collapse" }}>
          <thead><tr>
            {["","Club","Plan","Jugadores","MRR","Estado","Acciones"].map(h => (
              <th key={h} style={{ textAlign:"left", color:"var(--text-3)", padding:"12px", borderBottom:"1px solid var(--border-soft)", textTransform:"uppercase", letterSpacing:"0.05em", fontSize:"10px" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {clubList.map((c,i) => {
              const cd = COUNTRIES[c.country] || { flag:"🌎", symbol:"$", currency:"USD" };
              const sp2 = SPORTS_CONFIG[c.sport] || SPORTS_CONFIG.rugby;
              return (
                <motion.tr key={c.id} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}
                  whileHover={{ background:"var(--bg-elev-2)" }} style={{ borderBottom:"1px solid var(--border-soft)" }}>
                  <td style={{ padding:"12px" }}>{cd.flag} {sp2.icon}</td>
                  <td style={{ fontWeight:600, padding:"12px" }}>{c.name}</td>
                  <td style={{ padding:"12px" }}><Badge color="#A855F7">{c.plan}</Badge></td>
                  <td style={{ padding:"12px" }}>{c.players}</td>
                  <td style={{ padding:"12px" }}>{cd.symbol}{c.mrr?.toLocaleString()}</td>
                  <td style={{ padding:"12px" }}>
                    <Badge color={c.status==="active"?"#22C55E":c.status==="past_due"?"#F59E0B":"#EF4444"}>{c.status}</Badge>
                  </td>
                  <td style={{ padding:"12px" }}>
                    <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={()=>toggle(c.id)}
                      style={{ ...ss.btn, background:c.status==="active"?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)",
                        color:c.status==="active"?"#EF4444":"#22C55E", fontSize:"11px",
                        border:`1px solid ${c.status==="active"?"#EF444455":"#22C55E55"}` }}>
                      {c.status==="active"?"Suspender":"Reactivar"}
                    </motion.button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </div>
  );

  if (module==="comisiones") return (
    <div>
      <SectionTitle title="Comisiones por País" sub="Método de facturación local por país"/>
      {Object.entries(COUNTRIES).map(([k,v],i) => (
        <motion.div key={k} {...fadeUp} transition={{ delay:i*0.1 }} whileHover={{ y:-2 }}
          style={{ ...ss.card, marginBottom:"12px", display:"flex", alignItems:"center", gap:"16px" }}>
          <div style={{ fontSize:"40px" }}>{v.flag}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:"15px", display:"flex", alignItems:"center", gap:"8px" }}>
              {v.name} <Badge color="#3B82F6">{v.currency}</Badge>
            </div>
            <div style={{ ...ss.muted, marginTop:"6px", fontSize:"12px" }}>
              Documento fiscal: <span style={{ color:"var(--text-1)" }}>{v.tax}</span> · Métodos: {v.payments.join(", ")}
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:"22px", fontWeight:800, color:"#22C55E", letterSpacing:"-0.02em" }}>
              {v.symbol}{((k.charCodeAt(0)*131)%2000+500).toLocaleString()}
            </div>
            <div style={ss.muted}>comisión este mes</div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  if (module==="comparativa") return <ComparisonTable/>;
  return null;
}
