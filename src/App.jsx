import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const SPORTS_CONFIG = {
  rugby: { name:"Rugby",icon:"🏉",color:"#22C55E",squadSize:23,teamSize:15,positions:["Prop Cerrado","Hooker","Prop Abierto","Lock","Lock","Flanker","Flanker Ala","Número 8","Scrum Half","Apertura","Ala Izq.","Centro","Centro","Ala Der.","Fullback"],stats:[{key:"tries",label:"Tries",icon:"🏉"},{key:"conversiones",label:"Conv.",icon:"⚡"},{key:"penales",label:"Pen.",icon:"🎯"},{key:"minutos",label:"Min.",icon:"⏱"},{key:"tackles",label:"Tackles",icon:"💪"}],categories:["M6","M8","M10","M12","M14","M16","M18","Superior"],hasGym:true,hasHIA:true,matchDuration:"80 min" },
  futbol: { name:"Fútbol",icon:"⚽",color:"#06B6D4",squadSize:18,teamSize:11,positions:["Portero","Lateral Izq.","Central","Central","Lateral Der.","Volante Izq.","Mediocampista","Mediocampista","Volante Der.","Delantero","Delantero"],stats:[{key:"goles",label:"Goles",icon:"⚽"},{key:"asistencias",label:"Asist.",icon:"🅰️"},{key:"paradas",label:"Atajadas",icon:"🧤"},{key:"minutos",label:"Min.",icon:"⏱"},{key:"tarjetas",label:"Tarjetas",icon:"🟨"}],categories:["Sub-10","Sub-13","Sub-15","Sub-17","Sub-20","Primera"],hasGym:true,hasHIA:false,matchDuration:"90 min" },
  handball: { name:"Handball",icon:"🤾",color:"#F59E0B",squadSize:14,teamSize:7,positions:["Portero","Lateral Izq.","Central","Lateral Der.","Extremo Izq.","Extremo Der.","Pivote"],stats:[{key:"goles",label:"Goles",icon:"🥅"},{key:"asistencias",label:"Asist.",icon:"👋"},{key:"paradas",label:"Paradas",icon:"🧤"},{key:"minutos",label:"Min.",icon:"⏱"},{key:"tarjetas",label:"Tarjetas",icon:"🟨"}],categories:["Infantil","Cadete","Juvenil","Junior","Senior"],hasGym:true,hasHIA:false,matchDuration:"60 min" },
  basketball: { name:"Basketball",icon:"🏀",color:"#EF4444",squadSize:12,teamSize:5,positions:["Base","Escolta","Alero","Ala-Pívot","Pívot"],stats:[{key:"puntos",label:"Puntos",icon:"🏀"},{key:"rebotes",label:"Reb.",icon:"↕️"},{key:"asistencias",label:"Asist.",icon:"🤝"},{key:"tapones",label:"Tap.",icon:"✋"},{key:"robos",label:"Robos",icon:"⚡"},{key:"minutos",label:"Min.",icon:"⏱"}],categories:["Mini","Infantil","Cadete","Junior","Senior","Masters"],hasGym:true,hasHIA:false,matchDuration:"40 min" },
  hockey: { name:"Hockey",icon:"🏑",color:"#A855F7",squadSize:16,teamSize:11,positions:["Arquero","Defensor","Defensor","Defensor","Mediocampista","Mediocampista","Mediocampista","Delantero","Delantero","Delantero","Delantero"],stats:[{key:"goles",label:"Goles",icon:"🏑"},{key:"asistencias",label:"Asist.",icon:"👆"},{key:"paradas",label:"Paradas",icon:"🧤"},{key:"minutos",label:"Min.",icon:"⏱"},{key:"tarjetas",label:"Tarjetas",icon:"🟨"}],categories:["Infantil","Cadete","Juvenil","Junior","Senior"],hasGym:true,hasHIA:false,matchDuration:"70 min" }
};

const COUNTRIES = {
  CL:{name:"Chile",flag:"🇨🇱",currency:"CLP",symbol:"$",payments:["Khipu","Transbank","Transferencia"],tax:"Boleta SII"}
};

const CLUBS = {
  rugby:{name:"Toros RC",country:"CL",cuota:45000,prev:{res:"Victoria",score:"24-17",rival:"Universitario"},next:{rival:"Cóndores Norte",dia:"Sábado"}},
  futbol:{name:"Andes FC",country:"CL",cuota:40000,prev:{res:"Victoria",score:"2-0",rival:"Colo-Colo B"},next:{rival:"U. de Chile B",dia:"Domingo"}},
  handball:{name:"Club Atlético",country:"CL",cuota:35000,prev:{res:"Derrota",score:"18-22",rival:"Defensores"},next:{rival:"Español",dia:"Jueves"}},
  basketball:{name:"Halcones BC",country:"CL",cuota:38000,prev:{res:"Victoria",score:"78-65",rival:"Panteras"},next:{rival:"Diablos",dia:"Viernes"}},
  hockey:{name:"Las Leonas",country:"CL",cuota:42000,prev:{res:"Empate",score:"2-2",rival:"Manquehue"},next:{rival:"Stade Français",dia:"Sábado"}}
};

const TEAMS = [{id:"primer",name:"Primer Equipo"},{id:"reserva",name:"Reserva"},{id:"sub20",name:"Equipo Sub-20"}];

// Formaciones por deporte: cada una con sus posiciones y coordenadas en cancha (x,y 0-100, ataque hacia arriba)
const FORMATIONS = {
  rugby:[{key:"XV",label:"XV Clásico",positions:SPORTS_CONFIG.rugby.positions,coords:[
    {x:38,y:80},{x:50,y:82},{x:62,y:80},{x:43,y:70},{x:57,y:70},{x:30,y:64},{x:70,y:64},{x:50,y:60},
    {x:40,y:50},{x:55,y:44},{x:15,y:28},{x:45,y:38},{x:33,y:31},{x:80,y:30},{x:50,y:14}]}],
  handball:[{key:"3-2-1",label:"Ataque 3-2-1",positions:SPORTS_CONFIG.handball.positions,coords:[
    {x:50,y:88},{x:33,y:44},{x:50,y:48},{x:67,y:44},{x:13,y:32},{x:87,y:32},{x:50,y:25}]}],
  basketball:[{key:"quinteto",label:"Quinteto base",positions:SPORTS_CONFIG.basketball.positions,coords:[
    {x:50,y:70},{x:20,y:56},{x:80,y:56},{x:30,y:32},{x:62,y:26}]}],
  hockey:[
    {key:"3-3-4",label:"3-3-4 Ofensivo",positions:["Arquero","Defensor","Defensor","Defensor","Mediocampista","Mediocampista","Mediocampista","Delantero","Delantero","Delantero","Delantero"],coords:[
      {x:50,y:90},{x:27,y:72},{x:50,y:75},{x:73,y:72},{x:27,y:50},{x:50,y:52},{x:73,y:50},{x:17,y:27},{x:40,y:22},{x:60,y:22},{x:83,y:27}]},
    {key:"4-3-3",label:"4-3-3 Equilibrado",positions:["Arquero","Defensor","Defensor","Defensor","Defensor","Mediocampista","Mediocampista","Mediocampista","Delantero","Delantero","Delantero"],coords:[
      {x:50,y:90},{x:18,y:73},{x:40,y:75},{x:60,y:75},{x:82,y:73},{x:30,y:50},{x:50,y:53},{x:70,y:50},{x:18,y:24},{x:50,y:20},{x:82,y:24}]},
    {key:"3-4-3",label:"3-4-3 Presión",positions:["Arquero","Defensor","Defensor","Defensor","Mediocampista","Mediocampista","Mediocampista","Mediocampista","Delantero","Delantero","Delantero"],coords:[
      {x:50,y:90},{x:30,y:74},{x:50,y:76},{x:70,y:74},{x:16,y:50},{x:40,y:53},{x:60,y:53},{x:84,y:50},{x:18,y:24},{x:50,y:20},{x:82,y:24}]}
  ],
  futbol:[
    {key:"4-4-2",label:"4-4-2 Clásico",positions:["Portero","Lateral Izq.","Central","Central","Lateral Der.","Volante Izq.","Mediocampista","Mediocampista","Volante Der.","Delantero","Delantero"],coords:[
      {x:50,y:90},{x:18,y:72},{x:40,y:75},{x:60,y:75},{x:82,y:72},{x:18,y:48},{x:40,y:52},{x:60,y:52},{x:82,y:48},{x:38,y:22},{x:62,y:22}]},
    {key:"4-3-3",label:"4-3-3 Ofensivo",positions:["Portero","Lateral Izq.","Central","Central","Lateral Der.","Mediocampista","Mediocampista","Mediocampista","Extremo Izq.","Delantero","Extremo Der."],coords:[
      {x:50,y:90},{x:18,y:72},{x:40,y:75},{x:60,y:75},{x:82,y:72},{x:32,y:50},{x:50,y:54},{x:68,y:50},{x:16,y:24},{x:50,y:18},{x:84,y:24}]},
    {key:"3-5-2",label:"3-5-2 Carrileros",positions:["Portero","Central","Central","Central","Carrilero Izq.","Mediocampista","Mediocampista","Mediocampista","Carrilero Der.","Delantero","Delantero"],coords:[
      {x:50,y:90},{x:30,y:74},{x:50,y:76},{x:70,y:74},{x:12,y:50},{x:35,y:52},{x:50,y:55},{x:65,y:52},{x:88,y:50},{x:38,y:22},{x:62,y:22}]},
    {key:"3-4-3",label:"3-4-3 Presión",positions:["Portero","Central","Central","Central","Volante Izq.","Mediocampista","Mediocampista","Volante Der.","Extremo Izq.","Delantero","Extremo Der."],coords:[
      {x:50,y:90},{x:30,y:74},{x:50,y:76},{x:70,y:74},{x:16,y:50},{x:40,y:53},{x:60,y:53},{x:84,y:50},{x:18,y:24},{x:50,y:18},{x:82,y:24}]}
  ]
};

const PLAYERS_RUGBY = [
  {id:1,name:"Andrés Castro",pos:"Número 8",num:8,med:"verde",cuota:"ok",age:26,cat:"Superior",stats:{tries:5,conversiones:0,penales:0,minutos:480,tackles:47,goles:9,asistencias:4,paradas:0,tarjetas:1,puntos:0,rebotes:0},gym:{vol:14200,pct:100,rank:1}},
  {id:2,name:"Felipe Morales",pos:"Apertura",num:10,med:"verde",cuota:"ok",age:24,cat:"Superior",stats:{tries:3,conversiones:12,penales:8,minutos:460,tackles:15,goles:7,asistencias:11,paradas:0,tarjetas:2,puntos:0},gym:{vol:11800,pct:83,rank:2}},
  {id:3,name:"Diego Saavedra",pos:"Scrum Half",num:9,med:"amarillo",cuota:"ok",age:22,cat:"Superior",stats:{tries:2,conversiones:0,penales:0,minutos:440,tackles:22,goles:2,asistencias:6,paradas:0,tarjetas:0},gym:{vol:9900,pct:67,rank:3}},
  {id:4,name:"Cristóbal Vega",pos:"Fullback",num:15,med:"rojo",cuota:"ok",age:25,cat:"Superior",stats:{tries:4,conversiones:0,penales:0,minutos:200,tackles:18,goles:4,asistencias:3,paradas:0,tarjetas:1},gym:{vol:0,pct:0,rank:15},hiaReason:"HIA activo"},
  {id:5,name:"Matías Herrera",pos:"Ala Der.",num:14,med:"verde",cuota:"vencida",age:23,cat:"Superior",stats:{tries:6,conversiones:0,penales:0,minutos:500,tackles:12,goles:11,asistencias:5,paradas:0,tarjetas:0}},
  {id:6,name:"Pablo Rodríguez",pos:"Centro",num:13,med:"verde",cuota:"ok",age:27,cat:"Superior",stats:{tries:1,conversiones:0,penales:0,minutos:480,tackles:31,goles:1,asistencias:8,paradas:0,tarjetas:3},gym:{vol:10500,pct:100,rank:4}},
  {id:7,name:"Ignacio Pérez",pos:"Centro",num:12,med:"verde",cuota:"ok",age:24,cat:"Superior",stats:{tries:2,conversiones:0,penales:0,minutos:460,tackles:28,goles:3,asistencias:7,paradas:0,tarjetas:1},gym:{vol:9200,pct:67,rank:6}},
  {id:8,name:"Rodrigo Muñoz",pos:"Ala Izq.",num:11,med:"verde",cuota:"ok",age:21,cat:"Superior",stats:{tries:3,conversiones:0,penales:0,minutos:420,tackles:10,goles:8,asistencias:2,paradas:0,tarjetas:0},gym:{vol:8700,pct:50,rank:8}},
  {id:9,name:"Tomás López",pos:"Flanker Ala",num:7,med:"verde",cuota:"ok",age:25,cat:"Superior",stats:{tries:1,conversiones:0,penales:0,minutos:500,tackles:45,goles:1,asistencias:1,paradas:0,tarjetas:4},gym:{vol:9500,pct:83,rank:5}},
  {id:10,name:"Sebastián Núñez",pos:"Flanker",num:6,med:"amarillo",cuota:"ok",age:28,cat:"Superior",stats:{tries:0,conversiones:0,penales:0,minutos:380,tackles:38,goles:0,asistencias:0,paradas:31,tarjetas:0},gym:{vol:7600,pct:33,rank:11}},
  {id:11,name:"Carlos Contreras",pos:"Lock",num:5,med:"verde",cuota:"ok",age:29,cat:"Superior",stats:{tries:1,conversiones:0,penales:0,minutos:490,tackles:35,goles:2,asistencias:1,paradas:0,tarjetas:2},gym:{vol:8900,pct:100,rank:7}},
  {id:12,name:"Jorge Fuentes",pos:"Lock",num:4,med:"verde",cuota:"ok",age:26,cat:"Superior",stats:{tries:0,conversiones:0,penales:0,minutos:480,tackles:42,goles:0,asistencias:2,paradas:0,tarjetas:1},gym:{vol:8400,pct:67,rank:9}},
  {id:13,name:"Marco Silva",pos:"Prop Abierto",num:3,med:"verde",cuota:"vencida",age:31,cat:"Superior",stats:{tries:0,conversiones:0,penales:0,minutos:460,tackles:29,goles:0,asistencias:0,paradas:0,tarjetas:5},gym:{vol:7200,pct:33,rank:12}},
  {id:14,name:"Luis Torres",pos:"Hooker",num:2,med:"verde",cuota:"ok",age:27,cat:"Superior",stats:{tries:1,conversiones:0,penales:0,minutos:500,tackles:33,goles:1,asistencias:3,paradas:0,tarjetas:2},gym:{vol:8100,pct:83,rank:10}},
  {id:15,name:"Nicolás Bravo",pos:"Prop Cerrado",num:1,med:"verde",cuota:"ok",age:30,cat:"Superior",stats:{tries:0,conversiones:0,penales:0,minutos:490,tackles:40,goles:0,asistencias:0,paradas:38,tarjetas:1},gym:{vol:6800,pct:33,rank:13}},
];

const GYM_PLAN = {
  week:"13–19 Mayo",coach:"Prof. Marcos Díaz",
  sessions:{
    lunes:{label:"Fuerza inferior",exercises:[
      {name:"Sentadilla",sets:4,reps:6,pct:80,rest:180,notes:"Foco en profundidad",muscles:"Cuádriceps · Glúteos"},
      {name:"Hip Thrust",sets:3,reps:10,pct:70,rest:120,notes:"Control en excéntrico",muscles:"Glúteos · Isquiotibiales"},
      {name:"Sled Push",sets:4,reps:"20m",pct:null,rest:90,notes:"Máxima velocidad",muscles:"Cuádriceps · Pantorrillas"}
    ]},
    miercoles:{label:"Fuerza superior + pull",exercises:[
      {name:"Press Banca",sets:4,reps:8,pct:75,rest:180,notes:"Control bajada 3 seg",muscles:"Pectorales · Tríceps"},
      {name:"Pull-up",sets:4,reps:6,pct:null,rest:150,notes:"Agarre pronado",muscles:"Dorsal · Bíceps"},
      {name:"Farmer Carry",sets:4,reps:"30m",pct:null,rest:90,notes:"Postura erguida",muscles:"Core · Trapecio"}
    ]},
    viernes:{label:"Potencia",exercises:[
      {name:"Power Clean",sets:3,reps:4,pct:75,rest:240,notes:"Explosividad máxima",muscles:"Full body"},
      {name:"Sentadilla Frontal",sets:3,reps:6,pct:70,rest:180,notes:"Codos arriba",muscles:"Cuádriceps · Core"},
      {name:"Box Jump",sets:4,reps:5,pct:null,rest:120,notes:"Aterrizaje suave",muscles:"Cuádriceps · Glúteos"}
    ]}
  }
};

const MOCK_POSTS = [
  {id:1,type:"resultado",author:"Entrenador Jefe",time:"Hace 2h",text:"¡Gran victoria! El equipo mostró una defensa sólida en los últimos 10 minutos. Próxima semana preparamos al rival.",likes:12},
  {id:2,type:"médico",author:"Dr. García",time:"Hace 5h",text:"Cristóbal Vega completó el protocolo paso 1. Evaluación mañana a las 10:00 para determinar disponibilidad.",likes:3},
  {id:3,type:"admin",author:"Admin Club",time:"Hace 1d",text:"Recordatorio: cuotas de este mes vencen el día 30. Matías Herrera y Marco Silva aún tienen cuota pendiente.",likes:1},
  {id:4,type:"advertencia",author:"Preparador Díaz",time:"Hace 2d",text:"Sesión de fuerza viernes 7:00 AM obligatoria para plantel principal. Planilla de asistencia activa.",likes:7},
];

const COMMISSION_DATA = [{month:"Dic",val:8200},{month:"Ene",val:9100},{month:"Feb",val:8700},{month:"Mar",val:10400},{month:"Abr",val:11200},{month:"May",val:12800}];

const CLUB_LIST = [
  {id:1,sport:"rugby",country:"CL",name:"Toros RC",plan:"Pro",players:45,mrr:450000,status:"active"},
  {id:2,sport:"futbol",country:"CL",name:"Andes FC",plan:"Enterprise",players:72,mrr:880000,status:"active"},
  {id:3,sport:"handball",country:"CL",name:"Club Atlético",plan:"Starter",players:28,mrr:180000,status:"active"},
  {id:4,sport:"basketball",country:"CL",name:"Halcones BC",plan:"Pro",players:36,mrr:320000,status:"active"},
  {id:5,sport:"hockey",country:"CL",name:"Las Leonas",plan:"Enterprise",players:52,mrr:900000,status:"past_due"},
  {id:6,sport:"futbol",country:"CL",name:"Cóndores FC",plan:"Pro",players:88,mrr:640000,status:"active"},
];

const COUNTRY_COUNTS = {CL:65};

const ss = {
  wrap:{display:"flex",flexDirection:"column",height:"720px",background:"#070C18",color:"#E8EDF5",fontFamily:"'Inter',system-ui,sans-serif",overflow:"hidden",borderRadius:"12px"},
  topbar:{display:"flex",alignItems:"center",gap:"10px",padding:"0 14px",height:"52px",background:"#0B1120",borderBottom:"1px solid rgba(255,255,255,0.07)",flexShrink:0},
  sidebar:{width:"200px",background:"#0B1120",borderRight:"1px solid rgba(255,255,255,0.07)",display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto"},
  main:{flex:1,overflowY:"auto",padding:"24px",scrollbarWidth:"thin",scrollbarColor:"#4A5568 #070C18"},
  card:{background:"#101829",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"10px",padding:"16px"},
  muted:{color:"#8896B0",fontSize:"12px"},
  label:{color:"#8896B0",fontSize:"11px",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"4px"},
  btn:{padding:"6px 14px",borderRadius:"6px",border:"none",cursor:"pointer",fontSize:"12px",fontWeight:500,transition:"opacity 0.15s, transform 0.1s"},
  input:{background:"#0B1120",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"6px",color:"#E8EDF5",padding:"7px 10px",fontSize:"13px",outline:"none",width:"100%",boxSizing:"border-box"},
};

function Toast({msg,type,onClose}) {
  useEffect(()=>{const t=setTimeout(onClose,3000);return()=>clearTimeout(t);},[]);
  const bg = type==="success"?"#22C55E":type==="warning"?"#F59E0B":"#EF4444";
  return <div style={{position:"fixed",top:"20px",right:"20px",background:bg,color:"#fff",padding:"12px 18px",borderRadius:"8px",zIndex:9999,fontWeight:500,fontSize:"13px",boxShadow:"0 4px 16px rgba(0,0,0,0.4)",animation:"slideIn 0.3s ease",maxWidth:"320px"}}>{msg}</div>;
}

function Badge({color,children,size="sm"}) {
  const fs = size==="sm"?"11px":"13px", px = size==="sm"?"6px":"10px", py = size==="sm"?"2px":"4px";
  return <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:"4px",padding:`${py} ${px}`,fontSize:fs,fontWeight:500,whiteSpace:"nowrap"}}>{children}</span>;
}

function ProgressBar({value,max,color,height=6}) {
  const pct = Math.min(100,Math.round((value/max)*100));
  return <div style={{background:"rgba(255,255,255,0.08)",borderRadius:"99px",height,overflow:"hidden"}}>
    <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:"99px",transition:"width 0.4s ease"}}/>
  </div>;
}

function Semaforo({status}) {
  const c = status==="verde"?"#22C55E":status==="amarillo"?"#F59E0B":"#EF4444";
  return <span style={{width:"8px",height:"8px",borderRadius:"50%",background:c,display:"inline-block",boxShadow:`0 0 6px ${c}88`}}/>;
}

function Stat({label,value,sub,color}) {
  return <div style={{...ss.card,textAlign:"center"}}>
    <div style={{...ss.muted,marginBottom:"4px"}}>{label}</div>
    <div style={{fontSize:"22px",fontWeight:700,color:color||"#E8EDF5"}}>{value}</div>
    {sub&&<div style={{...ss.muted,marginTop:"2px",fontSize:"11px"}}>{sub}</div>}
  </div>;
}

function SectionTitle({title,sub,action}) {
  return <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"20px",gap:"12px",flexWrap:"wrap"}}>
    <div>
      <h2 style={{margin:0,fontSize:"18px",fontWeight:600}}>{title}</h2>
      {sub&&<p style={{...ss.muted,margin:"4px 0 0"}}>{sub}</p>}
    </div>
    {action}
  </div>;
}

function MedalBadge({rank}) {
  const medals=["🥇","🥈","🥉"];
  return rank<=3?<span style={{fontSize:"16px"}}>{medals[rank-1]}</span>:<span style={{...ss.muted,fontSize:"12px"}}>#{rank}</span>;
}

function FieldMarkings({type,color}) {
  const ln="rgba(255,255,255,0.3)", ln2="rgba(255,255,255,0.18)";
  const stripes=(c)=>[0,1,2,3,4,5].map(i=><rect key={i} x="3" y={3+i*22.3} width="94" height="11.1" fill={c}/>);
  if(type==="rugby") return <>
    <rect x="3" y="3" width="94" height="134" rx="1" fill="#0d2c1a" stroke={ln} strokeWidth="0.6"/>
    {stripes("rgba(255,255,255,0.022)")}
    <rect x="3" y="3" width="94" height="14" fill="rgba(255,255,255,0.05)"/>
    <rect x="3" y="123" width="94" height="14" fill="rgba(255,255,255,0.05)"/>
    <line x1="3" y1="17" x2="97" y2="17" stroke={ln} strokeWidth="0.5"/>
    <line x1="3" y1="123" x2="97" y2="123" stroke={ln} strokeWidth="0.5"/>
    <line x1="3" y1="42" x2="97" y2="42" stroke={ln2} strokeWidth="0.5" strokeDasharray="2 2"/>
    <line x1="3" y1="98" x2="97" y2="98" stroke={ln2} strokeWidth="0.5" strokeDasharray="2 2"/>
    <line x1="3" y1="70" x2="97" y2="70" stroke={ln} strokeWidth="0.5"/>
    <path d="M45 17 L45 9 M55 17 L55 9 M45 12 L55 12" stroke={color} strokeWidth="0.9" fill="none"/>
    <path d="M45 123 L45 131 M55 123 L55 131 M45 128 L55 128" stroke={color} strokeWidth="0.9" fill="none"/>
  </>;
  if(type==="futbol") return <>
    <rect x="3" y="3" width="94" height="134" fill="#0d2c1a" stroke={ln} strokeWidth="0.6"/>
    {stripes("rgba(255,255,255,0.022)")}
    <line x1="3" y1="70" x2="97" y2="70" stroke={ln} strokeWidth="0.5"/>
    <circle cx="50" cy="70" r="12" fill="none" stroke={ln} strokeWidth="0.5"/>
    <circle cx="50" cy="70" r="0.9" fill={ln}/>
    <rect x="28" y="3" width="44" height="22" fill="none" stroke={ln} strokeWidth="0.5"/>
    <rect x="40" y="3" width="20" height="9" fill="none" stroke={ln} strokeWidth="0.5"/>
    <circle cx="50" cy="17" r="0.9" fill={ln}/>
    <path d="M43 25 A 10 10 0 0 0 57 25" fill="none" stroke={ln} strokeWidth="0.5"/>
    <rect x="28" y="115" width="44" height="22" fill="none" stroke={ln} strokeWidth="0.5"/>
    <rect x="40" y="128" width="20" height="9" fill="none" stroke={ln} strokeWidth="0.5"/>
    <circle cx="50" cy="123" r="0.9" fill={ln}/>
    <path d="M43 115 A 10 10 0 0 1 57 115" fill="none" stroke={ln} strokeWidth="0.5"/>
    <rect x="44" y="2" width="12" height="2.5" fill={color}/>
    <rect x="44" y="135.5" width="12" height="2.5" fill={color}/>
  </>;
  if(type==="handball") return <>
    <rect x="3" y="3" width="94" height="134" fill="#11233c" stroke={ln} strokeWidth="0.6"/>
    <line x1="3" y1="70" x2="97" y2="70" stroke={ln} strokeWidth="0.5"/>
    <path d="M24 3 A 26 26 0 0 0 76 3" fill="rgba(255,255,255,0.05)" stroke={ln} strokeWidth="0.5"/>
    <path d="M18 3 A 32 32 0 0 0 82 3" fill="none" stroke={ln2} strokeWidth="0.5" strokeDasharray="2 1.5"/>
    <path d="M24 137 A 26 26 0 0 1 76 137" fill="rgba(255,255,255,0.05)" stroke={ln} strokeWidth="0.5"/>
    <path d="M18 137 A 32 32 0 0 1 82 137" fill="none" stroke={ln2} strokeWidth="0.5" strokeDasharray="2 1.5"/>
    <rect x="44" y="2.2" width="12" height="2.5" fill={color}/>
    <rect x="44" y="135.3" width="12" height="2.5" fill={color}/>
  </>;
  if(type==="basketball") return <>
    <rect x="3" y="3" width="94" height="134" fill="#2a2012" stroke={ln} strokeWidth="0.6"/>
    <rect x="35" y="3" width="30" height="41" fill="rgba(255,255,255,0.04)" stroke={ln} strokeWidth="0.5"/>
    <circle cx="50" cy="44" r="12" fill="none" stroke={ln} strokeWidth="0.5"/>
    <path d="M14 3 L14 22 A 36 36 0 0 0 86 22 L86 3" fill="none" stroke={ln} strokeWidth="0.5"/>
    <line x1="42" y1="7" x2="58" y2="7" stroke={color} strokeWidth="1.2"/>
    <circle cx="50" cy="10.5" r="3" fill="none" stroke={color} strokeWidth="0.9"/>
    <path d="M38 137 A 12 12 0 0 1 62 137" fill="none" stroke={ln} strokeWidth="0.5"/>
  </>;
  if(type==="hockey") return <>
    <rect x="3" y="3" width="94" height="134" fill="#0e3320" stroke={ln} strokeWidth="0.6"/>
    {stripes("rgba(255,255,255,0.02)")}
    <line x1="3" y1="70" x2="97" y2="70" stroke={ln} strokeWidth="0.5"/>
    <line x1="3" y1="33" x2="97" y2="33" stroke={ln2} strokeWidth="0.5"/>
    <line x1="3" y1="107" x2="97" y2="107" stroke={ln2} strokeWidth="0.5"/>
    <path d="M20 3 A 30 30 0 0 0 80 3" fill="rgba(255,255,255,0.04)" stroke={ln} strokeWidth="0.5"/>
    <path d="M20 137 A 30 30 0 0 1 80 137" fill="rgba(255,255,255,0.04)" stroke={ln} strokeWidth="0.5"/>
    <rect x="45" y="2.2" width="10" height="2.5" fill={color}/>
    <rect x="45" y="135.3" width="10" height="2.5" fill={color}/>
  </>;
  return null;
}

function Token({x,y,num,player,pos,color,onDrop,onClick,dragging,mine}) {
  const filled=!!player;
  const surname=player?player.name.split(" ").slice(-1)[0]:pos;
  const borderEmpty = dragging? `2px dashed ${color}` : "1.5px dashed rgba(255,255,255,0.25)";
  const circleBorder = filled?(mine?"2px solid #F59E0B":`2px solid ${color}`):borderEmpty;
  const circleShadow = filled?(mine?"0 0 0 2px #F59E0B66, 0 2px 8px #F59E0B88":`0 2px 8px ${color}55`):"none";
  return <div
    onDragOver={onDrop?e=>e.preventDefault():undefined}
    onDrop={onDrop?e=>{e.preventDefault();onDrop();}:undefined}
    onClick={onClick}
    style={{position:"absolute",left:`${x}%`,top:`${y}%`,transform:"translate(-50%,-50%)",textAlign:"center",width:"50px",zIndex:mine?3:2,cursor:onClick?"pointer":"default"}}>
    <div style={{width:"27px",height:"27px",borderRadius:"50%",margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:700,background:filled?(mine?"#F59E0B":color):(dragging?color+"22":"rgba(255,255,255,0.06)"),color:filled?"#fff":"#8896B0",border:circleBorder,boxShadow:circleShadow,transition:"all 0.2s"}}>
      {num}
    </div>
    <div style={{fontSize:"8px",marginTop:"2px",color:filled?(mine?"#F59E0B":"#E8EDF5"):"#4A5568",fontWeight:filled?600:400,lineHeight:1.1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{surname}{mine?" ⭐":""}</div>
  </div>;
}

function Cancha({type,formation,lineup,sportColor,onDrop,onSlotClick,dragging,highlightId}) {
  const filled=lineup.filter(Boolean).length;
  return <div style={ss.card}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
      <div style={{fontWeight:600,fontSize:"13px"}}>🏟️ {formation.label}</div>
      <span style={{...ss.muted,fontSize:"11px"}}>{filled}/{formation.positions.length} ubicados</span>
    </div>
    <div style={{display:"flex",justifyContent:"center"}}>
      <div style={{position:"relative",width:"100%",maxWidth:"380px",aspectRatio:"100 / 140"}}>
        <svg viewBox="0 0 100 140" preserveAspectRatio="none" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
          <FieldMarkings type={type} color={sportColor}/>
        </svg>
        {formation.coords.map((c,i)=><Token key={i} x={c.x} y={c.y} num={i+1} player={lineup[i]} pos={formation.positions[i]} color={sportColor} dragging={dragging} mine={highlightId&&lineup[i]&&lineup[i].id===highlightId} onDrop={()=>onDrop(i)} onClick={()=>onSlotClick(i)}/>)}
      </div>
    </div>
  </div>;
}

function WhatsAppModal({onClose,team,rival,date,starters,bench}) {
  const msg = `✅ ${team} — Nómina vs ${rival}\n📅 ${date} ⏰ 15:00 📍 Estadio Municipal\n\nTITULARES:\n${starters.map((p,i)=>`${i+1}. ${p.name} (${p.pos})`).join("\n")}\n\nBANCO:\n${bench.map((p,i)=>`${starters.length+i+1}. ${p.name}`).join("\n")}\n\n_Confirma tu presencia en SportOS_`;
  const [copied,setCopied]=useState(false);
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
    <div style={{...ss.card,width:"420px",maxHeight:"80vh",overflow:"auto"}} onClick={e=>e.stopPropagation()}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
        <h3 style={{margin:0,fontSize:"15px"}}>📱 Mensaje WhatsApp</h3>
        <button onClick={onClose} style={{...ss.btn,background:"transparent",color:"#8896B0",padding:"4px 8px"}}>✕</button>
      </div>
      <pre style={{background:"#070C18",padding:"12px",borderRadius:"6px",fontSize:"12px",color:"#E8EDF5",whiteSpace:"pre-wrap",border:"1px solid rgba(255,255,255,0.07)",maxHeight:"320px",overflow:"auto",fontFamily:"inherit"}}>{msg}</pre>
      <button onClick={()=>{navigator.clipboard.writeText(msg).catch(()=>{});setCopied(true);setTimeout(()=>setCopied(false),2000);}} style={{...ss.btn,background:"#25D366",color:"#fff",width:"100%",marginTop:"12px",padding:"10px",fontSize:"13px"}}>
        {copied?"✅ Copiado!":"📋 Copiar mensaje"}
      </button>
    </div>
  </div>;
}

export default function SportOS() {
  const [screen,setScreen]=useState("onboarding");
  const [sport,setSport]=useState("rugby");
  const [country,setCountry]=useState("CL");
  const [role,setRole]=useState("entrenador");
  const [module,setModule]=useState("muro");
  const [category,setCategory]=useState(0);
  const [toast,setToast]=useState(null);
  const [activeClubs,setActiveClubs]=useState({rugby:true,futbol:true,basketball:true,handball:false,hockey:false});
  const [clubList,setClubList]=useState(CLUB_LIST);
  const [postLikes,setPostLikes]=useState({1:12,2:3,3:1,4:7});
  const [whatsappModal,setWhatsappModal]=useState(false);
  const [convocado,setConvocado]=useState(null);
  const [rankTab,setRankTab]=useState("volumen");
  const [gymLog,setGymLog]=useState({});
  const [completedSession,setCompletedSession]=useState(false);
  const [newRecord,setNewRecord]=useState(false);
  const [expandedEx,setExpandedEx]=useState(null);
  const [expandedDay,setExpandedDay]=useState("lunes");
  const [backendOpen,setBackendOpen]=useState(false);
  const [hiaModal,setHiaModal]=useState(false);
  const [gymPlanExercises,setGymPlanExercises]=useState(null);
  const [newExForm,setNewExForm]=useState(false);
  const [newEx,setNewEx]=useState({name:"",sets:3,reps:8,pct:70,rest:120,notes:"",muscles:""});
  const [publishedPlan,setPublishedPlan]=useState(false);

  const sp = SPORTS_CONFIG[sport];
  const club = CLUBS[sport];
  const countryData = COUNTRIES[country];
  const currentCategory = sp.categories[category]||sp.categories[0];

  const showToast=(msg,type="success")=>{setToast({msg,type});};

  const ROLES = [
    {id:"superadmin",label:"Super Admin SportOS",icon:"⚡"},
    {id:"admin",label:"Admin del Club",icon:"🏢"},
    {id:"entrenador",label:"Entrenador",icon:"📋"},
    {id:"preparador",label:"Preparador Físico",icon:"💪"},
    {id:"jugador",label:"Jugador",icon:"👤"},
  ];

  const MODULE_MAP = {
    superadmin:[{id:"dashboard",label:"Dashboard Global"},{id:"clubes",label:"Clubes"},{id:"comisiones",label:"Comisiones"},{id:"comparativa",label:"SportOS vs SportEasy"}],
    admin:[{id:"miclub",label:"Mi Club"},{id:"jugadores",label:"Jugadores"},{id:"finanzas",label:"Finanzas"}],
    entrenador:[{id:"muro",label:"El Muro"},{id:"matchcenter",label:"Match Center"},{id:"nomina",label:"Nómina"},{id:"estadisticas",label:"Estadísticas"},{id:"asistencia",label:"Asistencia"},{id:"salud",label:"Salud"}],
    preparador:[{id:"microciclo",label:"Microciclo"},{id:"estadoplantel",label:"Estado Plantel"},{id:"rankingfuerza",label:"Ranking Fuerza"}],
    jugador:[{id:"midashboard",label:"Mi Dashboard"},{id:"migym",label:"Mi Gym"},{id:"nominasclub",label:"Nóminas del Club"},{id:"miconvocatoria",label:"Mi Convocatoria"}],
  };

  useEffect(()=>{const mods=MODULE_MAP[role]||[];if(mods.length>0)setModule(mods[0].id);},[role]);
  useEffect(()=>{setCategory(0);},[sport]);

  if(screen==="onboarding") return <OnboardingScreen onSelect={(s,c)=>{setSport(s);setCountry(c);setScreen("app");}} />;

  const sportColor = sp.color;
  const sportModules = MODULE_MAP[role]||[];

  return <div style={ss.wrap}>
    {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    {whatsappModal&&<WhatsAppModal onClose={()=>setWhatsappModal(false)} team={club.name} rival={club.next.rival} date={club.next.dia} starters={SPORTS_CONFIG[sport].positions.slice(0,sp.teamSize).map((pos,i)=>({name:PLAYERS_RUGBY[i]?PLAYERS_RUGBY[i].name:"Jugador "+(i+1),pos}))} bench={[]}/>}
    <style>{`
      @keyframes slideIn{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
      @keyframes recordPop{0%{transform:scale(1)}50%{transform:scale(1.15)}100%{transform:scale(1)}}
      .nav-item:hover{background:rgba(255,255,255,0.05)!important}
      .btn-hover:hover{opacity:0.85!important;transform:scale(0.98)!important}
      .sport-tab:hover{background:rgba(255,255,255,0.08)!important}
      .drag-row:hover{background:rgba(255,255,255,0.04)!important}
      input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
      ::-webkit-scrollbar{width:4px;height:4px}
      ::-webkit-scrollbar-track{background:#070C18}
      ::-webkit-scrollbar-thumb{background:#4A5568;border-radius:2px}
    `}</style>

    <div style={ss.topbar}>
      <div style={{fontWeight:700,fontSize:"15px",color:sportColor,marginRight:"4px",whiteSpace:"nowrap"}}>⚡ SportOS</div>
      <div style={{display:"flex",gap:"2px",background:"rgba(255,255,255,0.05)",borderRadius:"8px",padding:"3px",overflowX:"auto"}}>
        {Object.entries(SPORTS_CONFIG).map(([k,v])=>{
          const isActive2 = role==="admin"?activeClubs[k]:k===sport;
          if(role!=="superadmin"&&!isActive2&&k!==sport) return null;
          return <button key={k} onClick={()=>setSport(k)} className="sport-tab" style={{padding:"4px 8px",borderRadius:"6px",border:"none",cursor:"pointer",background:k===sport?v.color+"22":"transparent",color:k===sport?v.color:"#8896B0",fontSize:"11px",fontWeight:k===sport?600:400,transition:"background 0.2s",display:"flex",alignItems:"center",gap:"4px",whiteSpace:"nowrap"}}>
            {v.icon} {v.name}
          </button>;
        })}
      </div>
      <select value={category} onChange={e=>setCategory(Number(e.target.value))} style={{...ss.input,width:"90px",fontSize:"12px",padding:"5px 8px"}}>
        {sp.categories.map((c,i)=><option key={i} value={i}>{c}</option>)}
      </select>
      <div style={{flex:1}}/>
      <div style={{fontSize:"12px",color:"#8896B0",display:"flex",alignItems:"center",gap:"4px",padding:"5px 8px",whiteSpace:"nowrap"}}>🇨🇱 Chile · CLP</div>
      <div style={{width:"32px",height:"32px",borderRadius:"50%",background:sportColor+"33",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",fontWeight:700,color:sportColor,border:`2px solid ${sportColor}55`,cursor:"pointer",flexShrink:0}}>AC</div>
    </div>

    <div style={{display:"flex",flex:1,overflow:"hidden"}}>
      <div style={ss.sidebar}>
        <div style={{padding:"16px",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
          <div style={{width:"44px",height:"44px",borderRadius:"50%",background:sportColor+"33",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",border:`2px solid ${sportColor}66`,margin:"0 auto 8px"}}>{sp.icon}</div>
          <div style={{textAlign:"center",fontWeight:600,fontSize:"13px"}}>{club.name}</div>
          <div style={{...ss.muted,textAlign:"center",fontSize:"11px",marginTop:"2px"}}>{countryData.flag} {countryData.name}</div>
        </div>
        <div style={{padding:"12px 8px 4px"}}>
          <div style={{...ss.label,paddingLeft:"8px"}}>Rol activo</div>
          {ROLES.map(r=><button key={r.id} onClick={()=>setRole(r.id)} className="nav-item" style={{display:"flex",alignItems:"center",gap:"8px",padding:"7px 8px",borderRadius:"6px",border:"none",cursor:"pointer",background:role===r.id?"rgba(59,130,246,0.15)":"transparent",color:role===r.id?"#3B82F6":"#8896B0",width:"100%",textAlign:"left",fontSize:"11px",fontWeight:role===r.id?600:400,marginBottom:"2px"}}>
            <span>{r.icon}</span><span style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.label}</span>
          </button>)}
        </div>
        <div style={{padding:"12px 8px 4px",borderTop:"1px solid rgba(255,255,255,0.07)",marginTop:"4px"}}>
          <div style={{...ss.label,paddingLeft:"8px"}}>Módulos</div>
          {sportModules.map(m=><button key={m.id} onClick={()=>setModule(m.id)} className="nav-item" style={{display:"flex",alignItems:"center",gap:"8px",padding:"7px 8px",borderRadius:"6px",border:"none",cursor:"pointer",background:module===m.id?sportColor+"22":"transparent",color:module===m.id?sportColor:"#8896B0",width:"100%",textAlign:"left",fontSize:"12px",fontWeight:module===m.id?600:400,marginBottom:"2px"}}>{m.label}</button>)}
        </div>
        <div style={{marginTop:"auto",padding:"12px",borderTop:"1px solid rgba(255,255,255,0.07)"}}>
          <div style={{...ss.card,padding:"10px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px"}}>
              <span style={{fontSize:"11px",color:"#8896B0"}}>Plan</span><Badge color="#A855F7">Pro</Badge>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"6px",marginTop:"6px"}}>
              <span style={{width:"6px",height:"6px",borderRadius:"50%",background:"#22C55E",display:"inline-block",animation:"pulse 2s infinite"}}/>
              <span style={{fontSize:"10px",color:"#22C55E"}}>Sistema operativo</span>
            </div>
          </div>
        </div>
      </div>

      <div style={ss.main}>
        {role==="superadmin"&&<SuperAdminView module={module} commData={COMMISSION_DATA} clubList={clubList} setClubList={setClubList} showToast={showToast} COUNTRIES={COUNTRIES} COUNTRY_COUNTS={COUNTRY_COUNTS}/>}
        {role==="admin"&&<AdminView module={module} sport={sport} sp={sp} club={club} activeClubs={activeClubs} setActiveClubs={setActiveClubs} countryData={countryData} players={PLAYERS_RUGBY} showToast={showToast} sportColor={sportColor}/>}
        {role==="entrenador"&&<EntrenadorView module={module} sport={sport} sp={sp} club={club} players={PLAYERS_RUGBY} postLikes={postLikes} setPostLikes={setPostLikes} showToast={showToast} sportColor={sportColor} currentCategory={currentCategory} hiaModal={hiaModal} setHiaModal={setHiaModal}/>}
        {role==="preparador"&&<PreparadorView module={module} sp={sp} showToast={showToast} sportColor={sportColor} publishedPlan={publishedPlan} setPublishedPlan={setPublishedPlan} newExForm={newExForm} setNewExForm={setNewExForm} newEx={newEx} setNewEx={setNewEx} gymPlanExercises={gymPlanExercises} setGymPlanExercises={setGymPlanExercises} rankTab={rankTab} setRankTab={setRankTab} expandedDay={expandedDay} setExpandedDay={setExpandedDay}/>}
        {role==="jugador"&&<JugadorView module={module} sport={sport} sp={sp} club={club} player={PLAYERS_RUGBY[0]} players={PLAYERS_RUGBY} sportColor={sportColor} countryData={countryData} convocado={convocado} setConvocado={setConvocado} setWhatsappModal={setWhatsappModal} showToast={showToast} gymLog={gymLog} setGymLog={setGymLog} completedSession={completedSession} setCompletedSession={setCompletedSession} newRecord={newRecord} setNewRecord={setNewRecord} expandedEx={expandedEx} setExpandedEx={setExpandedEx} rankTab={rankTab} setRankTab={setRankTab}/>}
        <BackendNotes open={backendOpen} setOpen={setBackendOpen}/>
      </div>
    </div>
  </div>;
}

function OnboardingScreen({onSelect}) {
  const [selSport,setSelSport]=useState(null);
  const [selCountry,setSelCountry]=useState("CL");
  return <div style={{minHeight:"720px",background:"#070C18",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",fontFamily:"'Inter',system-ui,sans-serif",borderRadius:"12px"}}>
    <div style={{fontSize:"42px",fontWeight:800,color:"#E8EDF5",marginBottom:"8px",textAlign:"center"}}>⚡ SportOS</div>
    <div style={{color:"#8896B0",fontSize:"16px",marginBottom:"40px",textAlign:"center"}}>La plataforma deportiva de América Latina</div>
    <div style={{fontSize:"13px",color:"#8896B0",marginBottom:"16px",textTransform:"uppercase",letterSpacing:"0.08em"}}>Elige tu deporte</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"12px",marginBottom:"36px",maxWidth:"760px",width:"100%"}}>
      {Object.entries(SPORTS_CONFIG).map(([k,v])=><div key={k} onClick={()=>setSelSport(k)} style={{background:"#101829",border:`2px solid ${selSport===k?v.color:"rgba(255,255,255,0.08)"}`,borderRadius:"14px",padding:"22px 10px",textAlign:"center",cursor:"pointer",transition:"border-color 0.2s, transform 0.15s, box-shadow 0.2s",boxShadow:selSport===k?`0 0 24px ${v.color}44`:"none",transform:selSport===k?"scale(1.03)":"scale(1)"}}>
        <div style={{fontSize:"34px",marginBottom:"10px"}}>{v.icon}</div>
        <div style={{fontWeight:600,fontSize:"13px",color:selSport===k?v.color:"#E8EDF5"}}>{v.name}</div>
        <div style={{fontSize:"10px",color:"#8896B0",marginTop:"4px"}}>{v.matchDuration}</div>
      </div>)}
    </div>
    <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"36px",background:"#101829",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"10px",padding:"12px 18px"}}>
      <span style={{fontSize:"24px"}}>🇨🇱</span><span style={{fontSize:"13px",color:"#E8EDF5"}}>Chile · CLP</span>
    </div>
    <button onClick={()=>{if(selSport)onSelect(selSport,selCountry);}} className="btn-hover" style={{...ss.btn,background:selSport?SPORTS_CONFIG[selSport].color:"#4A5568",color:"#fff",padding:"14px 40px",fontSize:"15px",fontWeight:600,borderRadius:"10px",opacity:selSport?1:0.5,cursor:selSport?"pointer":"not-allowed"}}>Explorar demo →</button>
    {!selSport&&<div style={{...ss.muted,marginTop:"12px"}}>Selecciona un deporte para continuar</div>}
  </div>;
}

function SuperAdminView({module,commData,clubList,setClubList,showToast,COUNTRIES,COUNTRY_COUNTS}) {
  const toggle=(id)=>{
    const club=clubList.find(c=>c.id===id);
    setClubList(prev=>prev.map(c=>c.id===id?{...c,status:c.status==="active"?"suspended":"active"}:c));
    showToast(club.status==="active"?`${club.name} suspendido`:`${club.name} reactivado`,club.status==="active"?"warning":"success");
  };
  if(module==="dashboard") return <div>
    <SectionTitle title="Dashboard Global — SportOS" sub="Vista de operaciones en toda América Latina"/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px",marginBottom:"24px"}}>
      {Object.entries(COUNTRY_COUNTS).map(([k,v])=>{const c=COUNTRIES[k];return <div key={k} style={{...ss.card,display:"flex",alignItems:"center",gap:"12px"}}>
        <span style={{fontSize:"28px"}}>{c.flag}</span>
        <div><div style={{fontSize:"22px",fontWeight:700}}>{v}</div><div style={{...ss.muted,fontSize:"11px"}}>{c.name} · clubes activos</div></div>
      </div>;})}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px",marginBottom:"24px"}}>
      <Stat label="Comisión Hoy" value="USD 1.248" sub="↑ 12% vs ayer" color="#22C55E"/>
      <Stat label="MRR Total" value="USD 38.400" sub="65 clubes activos" color="#3B82F6"/>
      <Stat label="Clubes Activos" value="65" sub="↑ 3 este mes" color="#A855F7"/>
      <Stat label="Alertas Past Due" value="4" sub="Requieren atención" color="#EF4444"/>
    </div>
    <div style={{...ss.card,marginBottom:"24px"}}>
      <div style={{fontWeight:600,marginBottom:"16px",fontSize:"14px"}}>Comisiones SportOS — últimos 6 meses (USD)</div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={commData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/><XAxis dataKey="month" stroke="#8896B0" fontSize={11}/><YAxis stroke="#8896B0" fontSize={11}/><Tooltip contentStyle={{background:"#101829",border:"1px solid rgba(255,255,255,0.1)",color:"#E8EDF5",fontSize:12}}/><Area type="monotone" dataKey="val" stroke="#3B82F6" fill="#3B82F622" strokeWidth={2}/></AreaChart>
      </ResponsiveContainer>
    </div>
    <div style={{...ss.card,marginBottom:"24px"}}>
      <div style={{fontWeight:600,marginBottom:"16px",fontSize:"14px"}}>Transacciones recientes</div>
      <table style={{width:"100%",fontSize:"12px",borderCollapse:"collapse"}}>
        <thead><tr>{["Club","Deporte","País","Monto","Comisión SportOS","Estado"].map(h=><th key={h} style={{textAlign:"left",color:"#8896B0",padding:"6px 0",fontWeight:500,borderBottom:"1px solid rgba(255,255,255,0.07)"}}>{h}</th>)}</tr></thead>
        <tbody>{clubList.slice(0,5).map(c=>{const cd=COUNTRIES[c.country];const sp2=SPORTS_CONFIG[c.sport];return <tr key={c.id} style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
          <td style={{padding:"8px 0"}}>{cd.flag} {c.name}</td><td>{sp2.icon} {sp2.name}</td><td>{c.country}</td>
          <td>{cd.symbol}{c.mrr.toLocaleString()} {cd.currency}</td><td style={{color:"#22C55E"}}>{cd.symbol}{Math.round(c.mrr*0.03).toLocaleString()}</td>
          <td><Badge color={c.status==="active"?"#22C55E":c.status==="past_due"?"#F59E0B":"#EF4444"}>{c.status}</Badge></td>
        </tr>;})}</tbody>
      </table>
    </div>
    <ComparisonTable/>
  </div>;
  if(module==="clubes") return <div>
    <SectionTitle title="Gestión de Clubes" sub={`${clubList.filter(c=>c.status==="active").length} activos · ${clubList.filter(c=>c.status==="past_due").length} con deuda`}/>
    <table style={{width:"100%",fontSize:"12px",borderCollapse:"collapse"}}>
      <thead><tr>{["","Club","Plan","Jugadores","MRR","Estado","Acciones"].map(h=><th key={h} style={{textAlign:"left",color:"#8896B0",padding:"8px 6px",fontWeight:500,borderBottom:"1px solid rgba(255,255,255,0.07)"}}>{h}</th>)}</tr></thead>
      <tbody>{clubList.map(c=>{const cd=COUNTRIES[c.country];const sp2=SPORTS_CONFIG[c.sport];return <tr key={c.id} style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
        <td style={{padding:"8px 6px"}}>{cd.flag} {sp2.icon}</td><td style={{fontWeight:500}}>{c.name}</td><td><Badge color="#A855F7">{c.plan}</Badge></td>
        <td>{c.players}</td><td>{cd.symbol}{c.mrr.toLocaleString()}</td>
        <td><Badge color={c.status==="active"?"#22C55E":c.status==="past_due"?"#F59E0B":"#EF4444"}>{c.status}</Badge></td>
        <td><button onClick={()=>toggle(c.id)} className="btn-hover" style={{...ss.btn,background:c.status==="active"?"#EF444422":"#22C55E22",color:c.status==="active"?"#EF4444":"#22C55E",fontSize:"11px"}}>{c.status==="active"?"Suspender":"Reactivar"}</button></td>
      </tr>;})}</tbody>
    </table>
  </div>;
  if(module==="comisiones") return <div>
    <SectionTitle title="Comisiones por País" sub="Método de facturación local por país"/>
    {Object.entries(COUNTRIES).map(([k,v])=><div key={k} style={{...ss.card,marginBottom:"12px",display:"flex",alignItems:"center",gap:"16px"}}>
      <span style={{fontSize:"32px"}}>{v.flag}</span>
      <div style={{flex:1}}><div style={{fontWeight:600,fontSize:"14px"}}>{v.name} <Badge color="#3B82F6">{v.currency}</Badge></div>
        <div style={{...ss.muted,marginTop:"4px",fontSize:"12px"}}>Documento fiscal: <span style={{color:"#E8EDF5"}}>{v.tax}</span> · Métodos: {v.payments.join(", ")}</div></div>
      <div style={{textAlign:"right"}}><div style={{fontSize:"18px",fontWeight:700,color:"#22C55E"}}>{v.symbol}{((k.charCodeAt(0)*131)%2000+500).toLocaleString()}</div><div style={{...ss.muted,fontSize:"11px"}}>comisión este mes</div></div>
    </div>)}
  </div>;
  if(module==="comparativa") return <ComparisonTable full/>;
  return null;
}

function ComparisonTable() {
  const rows=[["Deportes soportados","3 (fútbol, básquet, béisbol)","5 (Rugby, Fútbol, Handball, Basketball, Hockey)"],["Mercado objetivo","Europa","América Latina"],["Pagos locales LATAM","❌","✅ Khipu / Mercado Pago / Pix / SPEI / PSE"],["Integración WhatsApp","❌","✅ Nativo"],["Módulo gym profesional","❌","✅ Con preparador físico"],["Protocolo HIA Rugby","❌","✅ Pasos 1-2-3"],["Multi-moneda LATAM","❌","✅ 6 países, 6 monedas"],["Cumplimiento tributario local","❌","✅ SII / AFIP / SAT / DIAN / SUNAT"],["Personalización por deporte","Parcial","✅ Total — posiciones, stats, formaciones"]];
  return <div style={{...ss.card,border:"1px solid rgba(59,130,246,0.3)"}}>
    <div style={{fontWeight:700,fontSize:"15px",marginBottom:"16px",color:"#3B82F6"}}>⚡ SportOS vs SportEasy</div>
    <table style={{width:"100%",fontSize:"12px",borderCollapse:"collapse"}}>
      <thead><tr><th style={{textAlign:"left",color:"#8896B0",padding:"6px 8px",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>Característica</th><th style={{textAlign:"center",color:"#8896B0",padding:"6px 8px",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>SportEasy</th><th style={{textAlign:"center",color:"#22C55E",padding:"6px 8px",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>SportOS ⚡</th></tr></thead>
      <tbody>{rows.map(([f,s,o],i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
        <td style={{padding:"8px"}}>{f}</td><td style={{textAlign:"center",color:"#EF4444",padding:"8px"}}>{s}</td><td style={{textAlign:"center",color:"#22C55E",fontWeight:500,padding:"8px"}}>{o}</td>
      </tr>)}</tbody>
    </table>
  </div>;
}

function AdminView({module,sport,sp,club,activeClubs,setActiveClubs,countryData,players,showToast,sportColor}) {
  const [primaryColor,setPrimaryColor]=useState("#1B4332");
  const [secondaryColor,setSecondaryColor]=useState("#FFD700");
  if(module==="miclub") return <div>
    <SectionTitle title="Configuración del Club" sub="Deportes activos, colores y métodos de pago"/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px"}}>
      <div style={ss.card}>
        <div style={{fontWeight:600,marginBottom:"14px",fontSize:"14px"}}>Deportes activos</div>
        {Object.entries(SPORTS_CONFIG).map(([k,v])=><div key={k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}><span style={{fontSize:"18px"}}>{v.icon}</span><span style={{fontSize:"13px"}}>{v.name}</span></div>
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
            <div onClick={()=>{setActiveClubs(prev=>({...prev,[k]:!prev[k]}));showToast(`${v.name} ${activeClubs[k]?"desactivado":"activado"}`,activeClubs[k]?"warning":"success");}} style={{width:"36px",height:"20px",borderRadius:"99px",background:activeClubs[k]?v.color:"#4A5568",position:"relative",transition:"background 0.2s",cursor:"pointer"}}>
              <div style={{position:"absolute",top:"2px",left:activeClubs[k]?"18px":"2px",width:"16px",height:"16px",borderRadius:"50%",background:"#fff",transition:"left 0.2s"}}/>
            </div>
            <span style={{fontSize:"11px",color:activeClubs[k]?v.color:"#8896B0"}}>{activeClubs[k]?"Activo":"Inactivo"}</span>
          </div>
        </div>)}
      </div>
      <div>
        <div style={{...ss.card,marginBottom:"12px"}}>
          <div style={{fontWeight:600,marginBottom:"12px",fontSize:"14px"}}>Paleta del club</div>
          <div style={{display:"flex",gap:"16px",alignItems:"center"}}>
            <div><div style={ss.label}>Primario</div><input type="color" value={primaryColor} onChange={e=>setPrimaryColor(e.target.value)} style={{width:"56px",height:"36px",border:"none",borderRadius:"6px",cursor:"pointer",background:"transparent"}}/></div>
            <div><div style={ss.label}>Secundario</div><input type="color" value={secondaryColor} onChange={e=>setSecondaryColor(e.target.value)} style={{width:"56px",height:"36px",border:"none",borderRadius:"6px",cursor:"pointer",background:"transparent"}}/></div>
            <div style={{flex:1,height:"36px",borderRadius:"8px",background:`linear-gradient(135deg,${primaryColor},${secondaryColor})`,border:"1px solid rgba(255,255,255,0.1)"}}/>
          </div>
        </div>
        <div style={{...ss.card,marginBottom:"12px"}}>
          <div style={{fontWeight:600,marginBottom:"12px",fontSize:"14px"}}>País y pagos</div>
          <div style={{fontSize:"13px",marginBottom:"8px"}}>{countryData.flag} {countryData.name} · {countryData.currency}</div>
          <div style={{...ss.muted,fontSize:"11px",marginBottom:"6px"}}>Documento fiscal: {countryData.tax}</div>
          <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>{countryData.payments.map(p=><Badge key={p} color="#3B82F6">{p}</Badge>)}</div>
        </div>
        <div style={ss.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontWeight:600,fontSize:"14px"}}>Plan Pro</div><div style={{...ss.muted,fontSize:"11px",marginTop:"4px"}}>Renueva el 15 Jun 2025</div></div><Badge color="#A855F7">Activo</Badge>
          </div>
        </div>
      </div>
    </div>
  </div>;
  if(module==="jugadores") return <div>
    <SectionTitle title={`Plantel — ${sp.name} · ${players.length} jugadores`}/>
    <table style={{width:"100%",fontSize:"12px",borderCollapse:"collapse"}}>
      <thead><tr>{["Jugador","Cat.","Salud","Cuota","Edad"].map(h=><th key={h} style={{textAlign:"left",color:"#8896B0",padding:"6px 8px",borderBottom:"1px solid rgba(255,255,255,0.07)",fontWeight:500}}>{h}</th>)}</tr></thead>
      <tbody>{players.slice(0,12).map(p=><tr key={p.id} style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
        <td style={{padding:"8px"}}><div style={{display:"flex",alignItems:"center",gap:"8px"}}><div style={{width:"28px",height:"28px",borderRadius:"50%",background:sportColor+"33",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",fontWeight:700,color:sportColor}}>{p.name.split(" ").map(n=>n[0]).join("")}</div>{p.name}</div></td>
        <td>{p.cat}</td><td><Semaforo status={p.med}/></td><td><Badge color={p.cuota==="ok"?"#22C55E":"#EF4444"}>{p.cuota==="ok"?"Al día":"Vencida"}</Badge></td><td>{p.age}</td>
      </tr>)}</tbody>
    </table>
  </div>;
  if(module==="finanzas") return <div>
    <SectionTitle title="Finanzas del Club" sub={`${countryData.flag} ${countryData.name} · ${countryData.tax}`}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px",marginBottom:"20px"}}>
      <Stat label="Ingresos del mes" value={`${countryData.symbol}${(club.cuota*players.filter(p=>p.cuota==="ok").length).toLocaleString()}`} sub={`${countryData.currency} · ${players.filter(p=>p.cuota==="ok").length} cuotas`} color="#22C55E"/>
      <Stat label="Morosidad" value={`${Math.round(players.filter(p=>p.cuota==="vencida").length/players.length*100)}%`} sub={`${players.filter(p=>p.cuota==="vencida").length} con cuota vencida`} color="#EF4444"/>
      <Stat label="Cuota mensual" value={`${countryData.symbol}${club.cuota.toLocaleString()}`} sub={`Método: ${countryData.payments[0]}`} color="#3B82F6"/>
    </div>
    <div style={{...ss.card,marginBottom:"16px",padding:"12px 16px",background:"rgba(59,130,246,0.08)",border:"1px solid rgba(59,130,246,0.2)"}}>
      <span style={{fontSize:"12px",color:"#3B82F6"}}>ℹ️ SportOS retiene una comisión del 3% de cada transacción procesada para financiar la infraestructura, soporte y actualizaciones.</span>
    </div>
    <button onClick={()=>showToast(`Cobro masivo enviado por ${countryData.payments[0]} a ${players.filter(p=>p.cuota==="vencida").length} jugadores`)} className="btn-hover" style={{...ss.btn,background:"#22C55E",color:"#fff",padding:"10px 20px",fontSize:"13px"}}>💳 Cobrar cuota masiva — {countryData.payments[0]}</button>
  </div>;
  return null;
}

function NominaDND({sport,sp,club,players,sportColor,showToast}) {
  const forms=FORMATIONS[sport];
  const [fKey,setFKey]=useState(forms[0].key);
  const [teamId,setTeamId]=useState(TEAMS[0].id);
  const [store,setStore]=useState({});
  const [benchStore,setBenchStore]=useState({});
  const [dragged,setDragged]=useState(null);
  const [wa,setWa]=useState(false);
  useEffect(()=>{setFKey(FORMATIONS[sport][0].key);},[sport]);

  const formation=forms.find(f=>f.key===fKey)||forms[0];
  const size=formation.positions.length;
  const sk=`${sport}|${teamId}|${fKey}`;
  const bk=`${sport}|${teamId}`;
  const lineup=store[sk]||Array(size).fill(null);
  const bench=benchStore[bk]||[];
  const setLineup=(nl)=>setStore(p=>({...p,[sk]:nl}));
  const setBench=(nb)=>setBenchStore(p=>({...p,[bk]:nb}));

  const blockReason=(p)=>{
    if(p.med==="rojo") return p.hiaReason?`no apto: ${p.hiaReason}`:"no apto médicamente";
    if(p.cuota==="vencida") return "cuota vencida";
    return null;
  };
  const placeInSlot=(idx,p)=>{
    if(!p) return;
    const r=blockReason(p);
    if(r){showToast(`${p.name} ${r}`,"warning");return;}
    const nl=lineup.map(x=>x&&x.id===p.id?null:x);
    nl[idx]=p; setLineup(nl);
    setBench(bench.filter(x=>x.id!==p.id));
    if(p.med==="amarillo") showToast(`⚠️ ${p.name} agregado con alerta médica`,"warning");
  };
  const addToBench=(p)=>{
    const r=blockReason(p);
    if(r){showToast(`${p.name} ${r}`,"warning");return;}
    if(bench.find(x=>x.id===p.id)||lineup.find(x=>x&&x.id===p.id)) return;
    setBench([...bench,p]);
  };
  const tapPlayer=(p)=>{
    if(lineup.find(x=>x&&x.id===p.id)){setLineup(lineup.map(x=>x&&x.id===p.id?null:x));return;}
    if(bench.find(x=>x.id===p.id)){setBench(bench.filter(x=>x.id!==p.id));return;}
    const empty=lineup.findIndex(x=>!x);
    if(empty===-1){addToBench(p);return;}
    placeInSlot(empty,p);
  };
  const clearSlot=(idx)=>{const nl=[...lineup];nl[idx]=null;setLineup(nl);};

  const starters=lineup.map((p,i)=>p?{name:p.name,pos:formation.positions[i]}:null).filter(Boolean);
  const assignedIds=new Set([...lineup.filter(Boolean).map(p=>p.id),...bench.map(p=>p.id)]);

  return <div onDragEnd={()=>setDragged(null)}>
    <SectionTitle title={`Nómina — ${sp.name}`} sub={`${TEAMS.find(t=>t.id===teamId).name} · arrastra o toca jugadores`}
      action={<div style={{display:"flex",gap:"8px"}}>
        <button onClick={()=>showToast("Push enviado al equipo")} className="btn-hover" style={{...ss.btn,background:"#3B82F6",color:"#fff",fontSize:"12px"}}>🔔 Push</button>
        <button onClick={()=>{if(starters.length>0)setWa(true);else showToast("Agrega al menos un titular","warning");}} className="btn-hover" style={{...ss.btn,background:"#25D366",color:"#fff",fontSize:"12px"}}>📱 WhatsApp</button>
      </div>}
    />
    <div style={{display:"flex",gap:"10px",marginBottom:"16px",flexWrap:"wrap"}}>
      <div>
        <div style={ss.label}>Equipo del club</div>
        <select value={teamId} onChange={e=>setTeamId(e.target.value)} style={{...ss.input,width:"160px"}}>
          {TEAMS.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      <div>
        <div style={ss.label}>Formación {forms.length>1?`(${forms.length} disponibles)`:""}</div>
        {forms.length>1?
          <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
            {forms.map(f=><button key={f.key} onClick={()=>setFKey(f.key)} className="btn-hover" style={{...ss.btn,background:fKey===f.key?sportColor+"22":"transparent",color:fKey===f.key?sportColor:"#8896B0",border:`1px solid ${fKey===f.key?sportColor+"55":"rgba(255,255,255,0.12)"}`,fontSize:"12px",padding:"8px 12px"}}>{f.key}</button>)}
          </div>
          :<div style={{...ss.input,width:"160px",display:"flex",alignItems:"center",color:"#8896B0"}}>{formation.label}</div>}
      </div>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) 260px",gap:"16px",alignItems:"start"}}>
      <div>
        <Cancha type={sport} formation={formation} lineup={lineup} sportColor={sportColor} dragging={!!dragged} onDrop={(i)=>{if(dragged)placeInSlot(i,dragged);}} onSlotClick={(i)=>{if(lineup[i])clearSlot(i);}}/>
        <div onDragOver={e=>e.preventDefault()} onDrop={()=>{if(dragged)addToBench(dragged);}} style={{...ss.card,marginTop:"12px",minHeight:"56px",border:dragged?`1px dashed ${sportColor}`:"1px solid rgba(255,255,255,0.07)"}}>
          <div style={{...ss.label,marginBottom:"8px"}}>🪑 Banco / Suplentes ({bench.length})</div>
          <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
            {bench.length===0&&<span style={{...ss.muted,fontSize:"11px"}}>Arrastra jugadores aquí o se agregan al llenar los titulares</span>}
            {bench.map(p=><div key={p.id} onClick={()=>setBench(bench.filter(x=>x.id!==p.id))} style={{display:"flex",alignItems:"center",gap:"6px",background:"rgba(255,255,255,0.05)",borderRadius:"6px",padding:"4px 8px",cursor:"pointer",fontSize:"11px"}}>
              <Semaforo status={p.med}/>{p.name.split(" ").slice(-1)[0]} <span style={{color:"#EF4444"}}>✕</span>
            </div>)}
          </div>
        </div>
      </div>

      <div style={ss.card}>
        <div style={{fontWeight:600,fontSize:"13px",marginBottom:"10px",color:"#8896B0"}}>PLANTILLA ({players.length})</div>
        {players.map(p=>{
          const inUse=assignedIds.has(p.id);
          const blocked=!!blockReason(p);
          return <div key={p.id} draggable={!blocked} onDragStart={()=>setDragged(p)} onClick={()=>tapPlayer(p)} className="drag-row"
            style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 8px",borderRadius:"6px",marginBottom:"4px",cursor:blocked?"not-allowed":"grab",opacity:blocked?0.45:1,background:inUse?sportColor+"15":"transparent",border:inUse?`1px solid ${sportColor}44`:"1px solid transparent",transition:"all 0.15s"}}>
            <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
              <Semaforo status={p.med}/>
              <span style={{fontSize:"12px",color:inUse?sportColor:"#E8EDF5"}}>{p.name}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
              {p.cuota==="vencida"&&<span style={{color:"#EF4444",fontSize:"10px"}}>$</span>}
              {inUse?<span style={{color:sportColor,fontSize:"12px"}}>✓</span>:<span style={{color:"#4A5568",fontSize:"12px"}}>⠿</span>}
            </div>
          </div>;
        })}
        <div style={{...ss.muted,fontSize:"10px",marginTop:"8px",lineHeight:1.5}}>Arrastra a una posición de la cancha, o toca para autoubicar. Toca un jugador en cancha para quitarlo.</div>
      </div>
    </div>
    {wa&&<WhatsAppModal onClose={()=>setWa(false)} team={`${club.name} · ${TEAMS.find(t=>t.id===teamId).name}`} rival={club.next.rival} date={club.next.dia} starters={starters} bench={bench}/>}
  </div>;
}

function EntrenadorView({module,sport,sp,club,players,postLikes,setPostLikes,showToast,sportColor,currentCategory,hiaModal,setHiaModal}) {
  const postColors={"resultado":"#22C55E","médico":"#3B82F6","admin":"#F59E0B","advertencia":"#EF4444"};
  const sv=(p,k)=> (p.stats&&p.stats[k]!=null)?p.stats[k]:((p.id*13+k.length*7)%18)+1;

  if(module==="muro") return <div>
    <SectionTitle title={`El Muro — ${sp.name} ${currentCategory}`}/>
    <div style={{...ss.card,marginBottom:"16px",padding:"10px 12px",display:"flex",gap:"10px",alignItems:"center"}}>
      <div style={{width:"32px",height:"32px",borderRadius:"50%",background:sportColor+"33",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",fontWeight:700,color:sportColor}}>E</div>
      <input placeholder="Publicar actualización al equipo..." style={{...ss.input,flex:1}}/>
      <button onClick={()=>showToast("Post publicado")} className="btn-hover" style={{...ss.btn,background:sportColor,color:"#fff"}}>Publicar</button>
    </div>
    {MOCK_POSTS.map(post=><div key={post.id} style={{...ss.card,marginBottom:"12px",borderLeft:`3px solid ${postColors[post.type]}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}><Badge color={postColors[post.type]}>{post.type}</Badge><span style={{fontWeight:600,fontSize:"13px"}}>{post.author}</span></div>
        <span style={{...ss.muted,fontSize:"11px"}}>{post.time}</span>
      </div>
      <p style={{margin:"0 0 10px",fontSize:"13px",lineHeight:"1.6"}}>{post.text}</p>
      <button onClick={()=>setPostLikes(prev=>({...prev,[post.id]:prev[post.id]+1}))} style={{...ss.btn,background:"transparent",color:"#8896B0",fontSize:"12px",padding:"4px 10px",border:"1px solid rgba(255,255,255,0.1)"}}>❤️ {postLikes[post.id]}</button>
    </div>)}
  </div>;

  if(module==="matchcenter") return <div>
    <SectionTitle title={`Match Center — ${sp.name}`} sub={`Duración: ${sp.matchDuration}`}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"20px"}}>
      <div style={{...ss.card,textAlign:"center",border:`1px solid ${club.prev.res==="Victoria"?"#22C55E33":club.prev.res==="Derrota"?"#EF444433":"#F59E0B33"}`}}>
        <div style={{...ss.muted,fontSize:"11px",marginBottom:"8px"}}>Último partido</div>
        <div style={{fontSize:"32px",fontWeight:800,color:club.prev.res==="Victoria"?"#22C55E":club.prev.res==="Derrota"?"#EF4444":"#F59E0B"}}>{club.prev.score}</div>
        <div style={{fontSize:"12px",marginTop:"4px"}}>vs {club.prev.rival}</div><Badge color={club.prev.res==="Victoria"?"#22C55E":club.prev.res==="Derrota"?"#EF4444":"#F59E0B"}>{club.prev.res}</Badge>
      </div>
      <div style={{...ss.card,textAlign:"center",border:"1px solid rgba(59,130,246,0.3)"}}>
        <div style={{...ss.muted,fontSize:"11px",marginBottom:"8px"}}>Próximo partido</div>
        <div style={{fontSize:"16px",fontWeight:700,marginBottom:"6px"}}>vs {club.next.rival}</div>
        <div style={{fontSize:"28px",fontWeight:800,color:"#3B82F6",marginBottom:"4px"}}>{club.next.dia}</div><div style={{...ss.muted,fontSize:"11px"}}>Temporada 2025</div>
      </div>
    </div>
    <div style={ss.card}>
      <div style={{fontWeight:600,marginBottom:"14px",fontSize:"14px"}}>Stats de temporada</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px"}}>
        <div style={{textAlign:"center"}}><div style={{fontSize:"24px",fontWeight:700,color:sportColor}}>{sport==="basketball"?"5":"3"}</div><div style={{...ss.muted,fontSize:"11px"}}>Racha victorias</div></div>
        <div style={{textAlign:"center"}}><div style={{fontSize:"14px",fontWeight:600}}>{players[4].name}</div><div style={{...ss.muted,fontSize:"11px"}}>Goleador / Trymaker</div></div>
        <div style={{textAlign:"center"}}><div style={{fontSize:"24px",fontWeight:700,color:"#22C55E"}}>78%</div><div style={{...ss.muted,fontSize:"11px"}}>Posesión promedio</div></div>
      </div>
    </div>
  </div>;

  if(module==="nomina") return <NominaDND sport={sport} sp={sp} club={club} players={players} sportColor={sportColor} showToast={showToast}/>;

  if(module==="estadisticas") return <div>
    <SectionTitle title={`Estadísticas — ${sp.name} ${currentCategory}`}/>
    {sp.stats.map(stat=>{
      const sorted=[...players].sort((a,b)=>sv(b,stat.key)-sv(a,stat.key));
      const max=sv(sorted[0],stat.key)||1;
      return <div key={stat.key} style={{...ss.card,marginBottom:"16px"}}>
        <div style={{fontWeight:600,marginBottom:"12px",fontSize:"13px"}}>{stat.icon} {stat.label}</div>
        {sorted.slice(0,6).map((p,i)=><div key={p.id} style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px"}}>
          <MedalBadge rank={i+1}/>
          <span style={{fontSize:"12px",minWidth:"130px",color:i<3?sportColor:"#E8EDF5"}}>{p.name}</span>
          <div style={{flex:1}}><ProgressBar value={sv(p,stat.key)} max={max} color={i===0?sportColor:i===1?"#8896B0":i===2?"#CD7F32":"#4A5568"}/></div>
          <span style={{fontSize:"13px",fontWeight:600,minWidth:"28px",textAlign:"right"}}>{sv(p,stat.key)}</span>
        </div>)}
      </div>;
    })}
  </div>;

  if(module==="asistencia") return <div><SectionTitle title="Control de Asistencia"/><AsistenciaGrid players={players} sportColor={sportColor} showToast={showToast}/></div>;

  if(module==="salud") return <div>
    <SectionTitle title="Panel de Salud" sub={`${sp.name} · Temporada 2025`} action={sp.hasHIA&&<button onClick={()=>setHiaModal(true)} className="btn-hover" style={{...ss.btn,background:"#EF444422",color:"#EF4444",border:"1px solid #EF444444",fontSize:"12px"}}>⚠️ Protocolo HIA</button>}/>
    {hiaModal&&sp.hasHIA&&<div style={{...ss.card,marginBottom:"20px",border:"2px solid #EF444455",background:"rgba(239,68,68,0.08)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
        <h3 style={{margin:0,color:"#EF4444",fontSize:"15px"}}>🚨 Protocolo HIA — Cristóbal Vega #15</h3>
        <button onClick={()=>setHiaModal(false)} style={{...ss.btn,background:"transparent",color:"#8896B0",padding:"2px 8px"}}>✕</button>
      </div>
      {[{step:1,label:"Evaluación inicial en cancha",status:"completado",color:"#22C55E"},{step:2,label:"Evaluación médica post-partido",status:"pendiente",color:"#F59E0B"},{step:3,label:"Clearance médico para volver",status:"pendiente",color:"#4A5568"}].map(s=><div key={s.step} style={{display:"flex",gap:"12px",alignItems:"center",padding:"10px",borderRadius:"6px",marginBottom:"8px",background:"rgba(255,255,255,0.03)"}}>
        <div style={{width:"28px",height:"28px",borderRadius:"50%",background:s.color+"33",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:700,color:s.color}}>{s.step}</div>
        <div style={{flex:1,fontSize:"13px"}}>{s.label}</div><Badge color={s.color}>{s.status}</Badge>
      </div>)}
      <div style={{...ss.muted,fontSize:"11px",marginTop:"8px"}}>🔒 Jugador bloqueado de nóminas hasta completar paso 3</div>
    </div>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",marginBottom:"20px"}}>
      {[["verde","Aptos"],["amarillo","Alerta"],["rojo","No aptos"]].map(([k,l])=><div key={k} style={{...ss.card,textAlign:"center"}}>
        <div style={{fontSize:"24px",fontWeight:700,color:k==="verde"?"#22C55E":k==="amarillo"?"#F59E0B":"#EF4444"}}>{players.filter(p=>p.med===k).length}</div><div style={{...ss.muted,fontSize:"11px"}}>{l}</div>
      </div>)}
    </div>
    {players.filter(p=>p.med!=="verde").map(p=><div key={p.id} style={{...ss.card,marginBottom:"10px",display:"flex",alignItems:"center",gap:"12px",border:`1px solid ${p.med==="rojo"?"rgba(239,68,68,0.3)":"rgba(245,158,11,0.3)"}`}}>
      <Semaforo status={p.med}/><div style={{flex:1}}><div style={{fontSize:"13px",fontWeight:500}}>{p.name}</div><div style={{...ss.muted,fontSize:"11px"}}>{p.hiaReason||(p.med==="amarillo"?"Seguimiento preventivo":"No apto")}</div></div>
      <Badge color={p.med==="rojo"?"#EF4444":"#F59E0B"}>{p.med==="rojo"?"Bloqueado":"Alerta"}</Badge>
    </div>)}
  </div>;
  return null;
}

function AsistenciaGrid({players,sportColor,showToast}) {
  const [present,setPresent]=useState({});
  const toggle=(id)=>setPresent(p=>({...p,[id]:!p[id]}));
  const count=Object.values(present).filter(Boolean).length;
  return <div>
    <div style={{...ss.card,marginBottom:"16px",padding:"12px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"8px"}}><span style={{fontSize:"13px",fontWeight:500}}>Asistencia: {count}/{players.length}</span><span style={{color:sportColor,fontSize:"13px",fontWeight:600}}>{Math.round(count/players.length*100)}%</span></div>
      <ProgressBar value={count} max={players.length} color={sportColor} height={8}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px"}}>
      {players.map(p=><div key={p.id} onClick={()=>{toggle(p.id);if(!present[p.id])showToast(`${p.name} marcado presente`);}} style={{...ss.card,padding:"10px",cursor:"pointer",border:`1px solid ${present[p.id]?sportColor+"55":"rgba(255,255,255,0.07)"}`,background:present[p.id]?sportColor+"11":"#101829",transition:"all 0.15s",display:"flex",alignItems:"center",gap:"8px"}}>
        <span style={{fontSize:"16px"}}>{present[p.id]?"✅":"⬜"}</span><div style={{fontSize:"11px",fontWeight:500,color:present[p.id]?sportColor:"#E8EDF5"}}>{p.name.split(" ")[0]}</div>
      </div>)}
    </div>
  </div>;
}

function PreparadorView({module,sp,showToast,sportColor,publishedPlan,setPublishedPlan,newExForm,setNewExForm,newEx,setNewEx,gymPlanExercises,setGymPlanExercises,rankTab,setRankTab,expandedDay,setExpandedDay}) {
  const days=["lunes","miercoles","viernes"];
  const dayLabels={lunes:"Lunes",miercoles:"Miércoles",viernes:"Viernes"};
  const planSessions=gymPlanExercises||GYM_PLAN.sessions;
  const addExercise=()=>{
    if(!newEx.name){showToast("Escribe el nombre del ejercicio","warning");return;}
    const day=expandedDay;
    setGymPlanExercises(prev=>{const base=prev||GYM_PLAN.sessions;return {...base,[day]:{...base[day],exercises:[...base[day].exercises,{...newEx}]}};});
    setNewEx({name:"",sets:3,reps:8,pct:70,rest:120,notes:"",muscles:""});setNewExForm(false);
    showToast(`${newEx.name} agregado al ${dayLabels[day]}`);
  };
  const compliance=[{name:"Andrés Castro",d:["ok","ok","ok"],pct:100},{name:"Felipe Morales",d:["ok","ok","parcial"],pct:83},{name:"Diego Saavedra",d:["ok","parcial","pendiente"],pct:67},{name:"Cristóbal Vega",d:["pendiente","pendiente","pendiente"],pct:0},{name:"Matías Herrera",d:["ok","ok","ok"],pct:100},{name:"Pablo Rodríguez",d:["ok","ok","ok"],pct:100}];
  const statusIcon=(s)=>s==="ok"?"✅":s==="parcial"?"⚠️":"⏳";

  if(module==="microciclo") return <div>
    <SectionTitle title={`Microciclo — Semana ${GYM_PLAN.week}`} sub={`${GYM_PLAN.coach} · ${sp.name}`} action={<button onClick={()=>{setPublishedPlan(true);showToast("Plan publicado. 15 jugadores notificados vía push y WhatsApp 📱");}} className="btn-hover" style={{...ss.btn,background:publishedPlan?"#22C55E22":"#22C55E",color:publishedPlan?"#22C55E":"#fff",border:publishedPlan?"1px solid #22C55E":"none",fontSize:"12px"}}>{publishedPlan?"✅ Plan publicado":"📢 Publicar plan"}</button>}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px",marginBottom:"20px"}}>
      <Stat label="Plan activo" value="Semana 8" sub="Pretemporada 2025" color={sportColor}/>
      <Stat label="Cumplimiento" value="78%" sub="Promedio plantel" color="#22C55E"/>
      <Stat label="Récords" value="4" sub="Esta semana" color="#F59E0B"/>
      <Stat label="Volumen total" value="184.300 kg" sub="Todo el plantel" color="#A855F7"/>
    </div>
    <div style={{display:"flex",gap:"8px",marginBottom:"16px",flexWrap:"wrap"}}>
      {days.map(d=><button key={d} onClick={()=>setExpandedDay(d)} style={{...ss.btn,background:expandedDay===d?sportColor+"22":"transparent",color:expandedDay===d?sportColor:"#8896B0",border:`1px solid ${expandedDay===d?sportColor+"44":"rgba(255,255,255,0.1)"}`,fontSize:"12px",padding:"8px 16px",textAlign:"left"}}>{dayLabels[d]}<br/><span style={{fontSize:"10px",opacity:0.7}}>{planSessions[d].label}</span></button>)}
    </div>
    <div style={ss.card}>
      <div style={{fontWeight:600,marginBottom:"14px",fontSize:"13px",color:sportColor}}>{dayLabels[expandedDay]} — {planSessions[expandedDay].label}</div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 2fr",gap:"8px",marginBottom:"10px"}}>{["Ejercicio","Series × Reps","% 1RM","Descanso","Músculos"].map(h=><div key={h} style={{...ss.label,fontSize:"10px"}}>{h}</div>)}</div>
      {planSessions[expandedDay].exercises.map((ex,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 2fr",gap:"8px",padding:"10px 0",borderTop:"1px solid rgba(255,255,255,0.06)",alignItems:"center"}}>
        <div style={{fontWeight:500,fontSize:"12px"}}>{ex.name}</div><div><Badge color={sportColor}>{ex.sets}×{ex.reps}</Badge></div>
        <div style={{fontSize:"12px",color:ex.pct?"#E8EDF5":"#8896B0"}}>{ex.pct?ex.pct+"%":"—"}</div><div style={{...ss.muted,fontSize:"11px"}}>{ex.rest}s</div><div style={{...ss.muted,fontSize:"11px"}}>{ex.muscles||"—"}</div>
      </div>)}
      <div style={{marginTop:"16px",borderTop:"1px solid rgba(255,255,255,0.07)",paddingTop:"14px"}}>
        {!newExForm?<button onClick={()=>setNewExForm(true)} style={{...ss.btn,background:"transparent",color:"#3B82F6",border:"1px dashed rgba(59,130,246,0.4)",fontSize:"12px",padding:"8px 16px"}}>+ Nuevo ejercicio</button>:
        <div style={{background:"rgba(59,130,246,0.08)",borderRadius:"8px",padding:"14px",border:"1px solid rgba(59,130,246,0.2)"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginBottom:"10px"}}>
            <div><div style={ss.label}>Ejercicio</div><input value={newEx.name} onChange={e=>setNewEx(p=>({...p,name:e.target.value}))} placeholder="Ej: Sentadilla" style={ss.input}/></div>
            <div><div style={ss.label}>Series</div><input type="number" value={newEx.sets} onChange={e=>setNewEx(p=>({...p,sets:Number(e.target.value)}))} style={ss.input}/></div>
            <div><div style={ss.label}>Reps</div><input type="number" value={newEx.reps} onChange={e=>setNewEx(p=>({...p,reps:Number(e.target.value)}))} style={ss.input}/></div>
            <div><div style={ss.label}>% 1RM</div><input type="number" value={newEx.pct} onChange={e=>setNewEx(p=>({...p,pct:Number(e.target.value)}))} style={ss.input}/></div>
            <div><div style={ss.label}>Descanso (s)</div><input type="number" value={newEx.rest} onChange={e=>setNewEx(p=>({...p,rest:Number(e.target.value)}))} style={ss.input}/></div>
            <div><div style={ss.label}>Músculos</div><input value={newEx.muscles} onChange={e=>setNewEx(p=>({...p,muscles:e.target.value}))} placeholder="Cuádriceps" style={ss.input}/></div>
          </div>
          <input value={newEx.notes} onChange={e=>setNewEx(p=>({...p,notes:e.target.value}))} placeholder="Notas técnicas..." style={{...ss.input,marginBottom:"10px"}}/>
          <div style={{display:"flex",gap:"8px"}}><button onClick={addExercise} className="btn-hover" style={{...ss.btn,background:"#3B82F6",color:"#fff",fontSize:"12px"}}>Agregar</button><button onClick={()=>setNewExForm(false)} style={{...ss.btn,background:"transparent",color:"#8896B0",fontSize:"12px"}}>Cancelar</button></div>
        </div>}
      </div>
    </div>
  </div>;
  if(module==="estadoplantel") return <div>
    <SectionTitle title={`Estado del plantel — Semana ${GYM_PLAN.week}`} sub="Cumplimiento de sesiones prescritas"/>
    <table style={{width:"100%",fontSize:"12px",borderCollapse:"collapse"}}>
      <thead><tr>{["Jugador","Lunes","Miércoles","Viernes","Cumplimiento"].map(h=><th key={h} style={{textAlign:"left",color:"#8896B0",padding:"8px",borderBottom:"1px solid rgba(255,255,255,0.07)",fontWeight:500}}>{h}</th>)}</tr></thead>
      <tbody>{compliance.map((p,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
        <td style={{padding:"8px",fontWeight:500}}>{p.name}</td>{p.d.map((s,j)=><td key={j} style={{padding:"8px",textAlign:"center",fontSize:"16px"}}>{statusIcon(s)}</td>)}
        <td style={{padding:"8px"}}><span style={{color:p.pct===100?"#22C55E":p.pct>=67?"#F59E0B":"#EF4444",fontWeight:600}}>{p.pct}% {p.pct===100?"🔥":p.pct>=67?"⚠️":"⏳"}</span></td>
      </tr>)}</tbody>
    </table>
  </div>;
  if(module==="rankingfuerza") return <RankingView tab={rankTab} setTab={setRankTab} sportColor={sportColor} players={PLAYERS_RUGBY}/>;
  return null;
}

function JugadorView({module,sport,sp,club,player,players,sportColor,countryData,convocado,setConvocado,setWhatsappModal,showToast,gymLog,setGymLog,completedSession,setCompletedSession,newRecord,setNewRecord,expandedEx,setExpandedEx,rankTab,setRankTab}) {
  const camiseta = player.num;
  const isNominated = true;
  if(module==="midashboard") return <div>
    <div style={{...ss.card,marginBottom:"20px",border:`1px solid ${sportColor}33`}}>
      <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
        <div style={{width:"56px",height:"56px",borderRadius:"50%",background:sportColor+"44",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",fontWeight:800,color:sportColor,border:`3px solid ${sportColor}88`}}>{player.num}</div>
        <div><div style={{fontSize:"20px",fontWeight:700}}>{player.name}</div><div style={{color:sportColor,fontSize:"13px"}}>{player.pos} · {club.name}</div></div>
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px",marginBottom:"16px"}}>
      <div style={{...ss.card,textAlign:"center"}}><Semaforo status={player.med}/><div style={{fontSize:"11px",color:"#8896B0",marginTop:"6px"}}>Estado médico</div><div style={{fontSize:"12px",fontWeight:500,marginTop:"2px"}}>{player.med==="verde"?"Apto":player.med==="amarillo"?"Alerta":"No apto"}</div></div>
      <div style={{...ss.card,textAlign:"center"}}><div style={{fontSize:"18px",fontWeight:700,color:"#22C55E"}}>✓</div><div style={{fontSize:"11px",color:"#8896B0",marginTop:"4px"}}>Cuota {countryData.symbol}{club.cuota.toLocaleString()}</div><div style={{fontSize:"11px",color:"#8896B0",marginTop:"2px"}}>{countryData.payments[0]}</div></div>
      <div style={{...ss.card,textAlign:"center",border:`1px solid ${sportColor}44`,background:sportColor+"11"}}><div style={{fontSize:"20px",fontWeight:800,color:sportColor}}>#{camiseta}</div><div style={{fontSize:"11px",color:sportColor,marginTop:"4px"}}>Convocado</div></div>
    </div>
    <div style={{...ss.card,marginBottom:"16px"}}>
      <div style={{fontWeight:600,marginBottom:"12px",fontSize:"13px"}}>Próximo partido</div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:"15px",fontWeight:600}}>vs {club.next.rival}</div><div style={{...ss.muted,fontSize:"12px"}}>{club.next.dia} · {sp.matchDuration}</div></div><Badge color={sportColor}>{club.next.dia}</Badge></div>
    </div>
    <div style={ss.card}>
      <div style={{fontWeight:600,marginBottom:"12px",fontSize:"13px"}}>Últimas noticias</div>
      {MOCK_POSTS.slice(0,3).map(p=><div key={p.id} style={{padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
        <div style={{display:"flex",gap:"8px",alignItems:"center",marginBottom:"4px"}}><Badge color={{"resultado":"#22C55E","médico":"#3B82F6","admin":"#F59E0B","advertencia":"#EF4444"}[p.type]}>{p.type}</Badge><span style={{...ss.muted,fontSize:"11px"}}>{p.time}</span></div>
        <p style={{margin:0,fontSize:"12px",color:"#C8D3E0"}}>{p.text.substring(0,90)}...</p>
      </div>)}
    </div>
  </div>;
  if(module==="migym") return <GymJugador player={player} sportColor={sportColor} gymLog={gymLog} setGymLog={setGymLog} completedSession={completedSession} setCompletedSession={setCompletedSession} newRecord={newRecord} setNewRecord={setNewRecord} expandedEx={expandedEx} setExpandedEx={setExpandedEx} showToast={showToast} rankTab={rankTab} setRankTab={setRankTab} players={players}/>;
  if(module==="nominasclub"){
    const forms=FORMATIONS[sport];
    return <div>
      <SectionTitle title="Nóminas del Club" sub={`Alineaciones publicadas de todos los equipos · ${sp.name}`}/>
      {TEAMS.map((t,ti)=>{
        const formation=forms[ti%forms.length];
        const size=formation.positions.length;
        const rot=(ti*4)%players.length;
        const avail=[...players.slice(rot),...players.slice(0,rot)].filter(p=>p.med!=="rojo"&&p.cuota!=="vencida");
        const lineup=Array.from({length:size},(_,i)=>avail[i]||null);
        const myIdx=lineup.findIndex(p=>p&&p.id===player.id);
        return <div key={t.id} style={{marginBottom:"20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px",flexWrap:"wrap",gap:"8px"}}>
            <div style={{fontWeight:600,fontSize:"14px"}}>{t.name}</div>
            <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
              <Badge color={sportColor}>{formation.label}</Badge>
              {myIdx>=0?<Badge color="#F59E0B">⭐ Titular #{myIdx+1}</Badge>:<Badge color="#8896B0">No convocado</Badge>}
            </div>
          </div>
          <Cancha type={sport} formation={formation} lineup={lineup} sportColor={sportColor} dragging={false} highlightId={player.id} onDrop={()=>{}} onSlotClick={()=>{}}/>
        </div>;
      })}
      <div style={{...ss.card,padding:"10px 14px",fontSize:"11px",color:"#8896B0"}}>⭐ Tu posición aparece resaltada en dorado cuando estás convocado en la nómina de un equipo. Aquí ves todas las alineaciones del plantel al que perteneces.</div>
    </div>;
  }

  if(module==="miconvocatoria") return <div>
    <SectionTitle title="Mi Convocatoria"/>
    <div style={{...ss.card,textAlign:"center",marginBottom:"20px",border:`2px solid ${sportColor}55`,background:sportColor+"11"}}>
      <div style={{fontSize:"64px",fontWeight:800,color:sportColor,margin:"16px 0"}}>{camiseta}</div>
      <div style={{fontSize:"16px",fontWeight:600,marginBottom:"4px"}}>Estás convocado #{camiseta}</div><div style={{...ss.muted}}>vs {club.next.rival} · {club.next.dia}</div>
    </div>
    <div style={{display:"flex",gap:"12px",marginBottom:"16px"}}>
      <button onClick={()=>{setConvocado("confirmed");showToast("✅ Presencia confirmada");}} className="btn-hover" style={{...ss.btn,flex:1,background:convocado==="confirmed"?"#22C55E":"#22C55E22",color:convocado==="confirmed"?"#fff":"#22C55E",border:"1px solid #22C55E44",padding:"12px",fontSize:"13px"}}>{convocado==="confirmed"?"✅ Confirmado":"✓ Confirmar presencia"}</button>
      <button onClick={()=>{setConvocado("rejected");showToast("Ausencia registrada","warning");}} className="btn-hover" style={{...ss.btn,flex:1,background:convocado==="rejected"?"#EF4444":"#EF444422",color:convocado==="rejected"?"#fff":"#EF4444",border:"1px solid #EF444444",padding:"12px",fontSize:"13px"}}>{convocado==="rejected"?"✕ No asistirás":"✕ No puedo asistir"}</button>
    </div>
    <button onClick={()=>setWhatsappModal(true)} className="btn-hover" style={{...ss.btn,background:"#25D366",color:"#fff",width:"100%",padding:"10px",fontSize:"13px"}}>📱 Compartir convocatoria en WhatsApp</button>
  </div>;
  return null;
}

function GymJugador({player,sportColor,gymLog,setGymLog,completedSession,setCompletedSession,newRecord,setNewRecord,expandedEx,setExpandedEx,showToast,rankTab,setRankTab,players}) {
  const todayPlan=GYM_PLAN.sessions.lunes;
  const PREV_1RM={Sentadilla:140,"Hip Thrust":120,"Press Banca":110,"Pull-up":90,"Power Clean":95};
  const logSet=(exName,setIdx,field,val)=>setGymLog(prev=>{const key=`${exName}_${setIdx}`;return {...prev,[key]:{...(prev[key]||{}),[field]:val}};});
  const getLog=(exName,setIdx,field)=>{const key=`${exName}_${setIdx}`;return gymLog[key]?gymLog[key][field]:"";};
  const calcVol=(exName,sets)=>{let t=0;for(let i=0;i<sets;i++){const w=parseFloat(getLog(exName,i,"weight")||0);const r=parseFloat(getLog(exName,i,"reps")||0);t+=w*r;}return Math.round(t);};
  const calc1RM=(w,r)=>r?Math.round(w*(1+r/30)):0;
  const exCompleted=(ex)=>{for(let i=0;i<ex.sets;i++){if(!getLog(ex.name,i,"weight")||!getLog(ex.name,i,"reps"))return false;}return true;};
  const allDone=todayPlan.exercises.every(ex=>exCompleted(ex));
  const totalVol=todayPlan.exercises.reduce((s,ex)=>s+calcVol(ex.name,ex.sets),0);
  const rpeColor=(v)=>v<=3?"#22C55E":v<=6?"#F59E0B":"#EF4444";
  return <div>
    {!completedSession&&<div style={{...ss.card,marginBottom:"16px",background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.3)",display:"flex",alignItems:"center",gap:"12px",padding:"12px 16px"}}>
      <span style={{fontSize:"18px"}}>💪</span><div><div style={{fontSize:"13px",fontWeight:600,color:"#F59E0B"}}>Plan activo: {GYM_PLAN.week}</div><div style={{...ss.muted,fontSize:"11px"}}>Lunes — Fuerza inferior · Prof. Marcos Díaz</div></div>
    </div>}
    {completedSession&&<div style={{...ss.card,marginBottom:"20px",background:"rgba(34,197,94,0.08)",border:"2px solid rgba(34,197,94,0.4)"}}>
      <div style={{color:"#22C55E",fontWeight:700,fontSize:"15px",marginBottom:"8px"}}>✅ Sesión completada — Lunes 13 Mayo</div>
      <div style={{display:"flex",gap:"16px",marginBottom:"10px"}}><div><div style={{fontSize:"22px",fontWeight:800}}>{totalVol.toLocaleString()} kg</div><div style={{...ss.muted,fontSize:"11px"}}>Volumen total</div></div><div><div style={{fontSize:"16px",fontWeight:600,color:"#22C55E"}}>↑ +340 kg</div><div style={{...ss.muted,fontSize:"11px"}}>vs lunes pasado</div></div></div>
      {newRecord&&<div style={{display:"flex",alignItems:"center",gap:"8px",background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.4)",borderRadius:"6px",padding:"8px 12px",marginBottom:"8px"}}><span style={{fontSize:"18px"}}>🏆</span><span style={{color:"#F59E0B",fontWeight:600,fontSize:"13px"}}>NUEVO RÉCORD PERSONAL en Sentadilla — 148 kg</span></div>}
      <div style={{color:"#8896B0",fontSize:"12px"}}>🥇 Subiste al puesto #1 del ranking de fuerza</div>
    </div>}
    {todayPlan.exercises.map((ex,ei)=>{
      const prev1RM=PREV_1RM[ex.name]||100;
      const suggested=ex.pct?Math.round(prev1RM*(ex.pct/100)):null;
      const vol=calcVol(ex.name,ex.sets);const done=exCompleted(ex);
      const maxWeight=Math.max(0,...Array.from({length:ex.sets},(_,i)=>parseFloat(getLog(ex.name,i,"weight")||0)));
      const maxReps=Math.max(0,...Array.from({length:ex.sets},(_,i)=>parseFloat(getLog(ex.name,i,"reps")||0)));
      const est1RM=calc1RM(maxWeight,maxReps);const isRecord=est1RM>prev1RM&&maxWeight>0;
      return <div key={ei} style={{...ss.card,marginBottom:"14px",border:done?"2px solid #22C55E55":isRecord?"2px solid rgba(245,158,11,0.6)":"1px solid rgba(255,255,255,0.07)",transition:"border-color 0.3s",position:"relative"}}>
        {isRecord&&<div style={{position:"absolute",top:"-10px",right:"12px",background:"#F59E0B",color:"#fff",fontSize:"11px",fontWeight:700,padding:"3px 10px",borderRadius:"99px",animation:"recordPop 0.5s ease"}}>🏆 NUEVO RÉCORD</div>}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px",cursor:"pointer"}} onClick={()=>setExpandedEx(expandedEx===ei?null:ei)}>
          <div><div style={{fontWeight:600,fontSize:"14px",display:"flex",alignItems:"center",gap:"8px"}}>{done&&<span style={{color:"#22C55E",fontSize:"16px"}}>✓</span>}{ex.name}</div>{suggested&&<div style={{fontSize:"12px",color:"#3B82F6",marginTop:"3px"}}>{ex.sets} × {ex.reps} × {ex.pct}% 1RM ≈ {suggested} kg sugerido</div>}</div>
          <span style={{color:"#8896B0",fontSize:"12px"}}>{expandedEx===ei?"▲":"▼"}</span>
        </div>
        {expandedEx===ei&&<div>
          <div style={{display:"grid",gridTemplateColumns:"50px 70px 70px 60px 1fr",gap:"8px",marginBottom:"8px"}}>{["Serie","Sug.","Peso","Reps","RPE"].map(h=><div key={h} style={{...ss.label,fontSize:"10px"}}>{h}</div>)}</div>
          {Array.from({length:ex.sets}).map((_,si)=><div key={si} style={{display:"grid",gridTemplateColumns:"50px 70px 70px 60px 1fr",gap:"8px",marginBottom:"8px",alignItems:"center"}}>
            <span style={{fontSize:"11px",fontWeight:600,color:sportColor}}>S{si+1}</span><span style={{...ss.muted,fontSize:"11px"}}>{suggested||"—"}</span>
            <input type="number" placeholder={suggested||"kg"} value={getLog(ex.name,si,"weight")} onChange={e=>{logSet(ex.name,si,"weight",e.target.value);if(ex.name==="Sentadilla"&&e.target.value>140)setNewRecord(true);}} style={{...ss.input,padding:"5px 8px",fontSize:"12px"}}/>
            <input type="number" placeholder="reps" value={getLog(ex.name,si,"reps")} onChange={e=>logSet(ex.name,si,"reps",e.target.value)} style={{...ss.input,padding:"5px 8px",fontSize:"12px"}}/>
            <div style={{display:"flex",gap:"2px"}}>{[1,2,3,4,5,6,7,8,9,10].map(n=><div key={n} onClick={()=>logSet(ex.name,si,"rpe",n)} style={{width:"16px",height:"16px",borderRadius:"3px",background:parseInt(getLog(ex.name,si,"rpe"))===n?rpeColor(n):"rgba(255,255,255,0.1)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"8px",fontWeight:700,color:parseInt(getLog(ex.name,si,"rpe"))===n?"#fff":"#8896B0"}}>{n}</div>)}</div>
          </div>)}
          {vol>0&&<div style={{marginTop:"10px",padding:"8px 12px",background:"rgba(255,255,255,0.03)",borderRadius:"6px",fontSize:"12px",color:"#8896B0"}}>Volumen serie: <strong style={{color:"#E8EDF5"}}>{vol.toLocaleString()} kg</strong>{est1RM>0&&<> · 1RM estimado: <strong style={{color:isRecord?"#F59E0B":"#3B82F6"}}>{est1RM} kg</strong></>}</div>}
        </div>}
      </div>;
    })}
    {!completedSession&&allDone&&<button onClick={()=>{setCompletedSession(true);showToast("🎉 Sesión completada! Ranking actualizado");}} className="btn-hover" style={{...ss.btn,background:"#22C55E",color:"#fff",width:"100%",padding:"14px",fontSize:"14px",fontWeight:600,marginBottom:"16px"}}>✅ Registrar sesión completada</button>}
    <RankingView tab={rankTab} setTab={setRankTab} sportColor={sportColor} players={players} compact/>
  </div>;
}

function RankingView({tab,setTab,sportColor,players,compact}) {
  const tabs=[{id:"volumen",label:"Volumen total"},{id:"1rm",label:"Fuerza 1RM"},{id:"cumplimiento",label:"Cumplimiento"},{id:"progreso",label:"Progreso"}];
  const sorted=[...players].filter(p=>p.gym).sort((a,b)=>{
    if(tab==="volumen")return (b.gym.vol||0)-(a.gym.vol||0);
    if(tab==="cumplimiento")return (b.gym.pct||0)-(a.gym.pct||0);
    return (a.gym.rank||99)-(b.gym.rank||99);
  });
  const top3=sorted.slice(0,3);const medalColors=["#F59E0B","#8896B0","#CD7F32"];
  return <div style={{...ss.card,marginTop:compact?"8px":"0"}}>
    <div style={{fontWeight:600,fontSize:"14px",marginBottom:"12px"}}>🏋️ Ranking de Fuerza</div>
    <div style={{display:"flex",gap:"6px",marginBottom:"16px",background:"rgba(255,255,255,0.04)",borderRadius:"8px",padding:"3px"}}>
      {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{...ss.btn,flex:1,background:tab===t.id?sportColor+"33":"transparent",color:tab===t.id?sportColor:"#8896B0",border:"none",fontSize:"10px",padding:"6px 4px"}}>{t.label}</button>)}
    </div>
    {!compact&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",marginBottom:"16px"}}>
      {top3.map((p,i)=><div key={p.id} style={{...ss.card,textAlign:"center",border:`1px solid ${medalColors[i]}44`,background:`${medalColors[i]}11`}}>
        <div style={{fontSize:"20px",marginBottom:"4px"}}>{["🥇","🥈","🥉"][i]}</div>
        <div style={{fontSize:"12px",fontWeight:600}}>{p.name.split(" ")[0]}</div>
        <div style={{fontSize:"14px",fontWeight:800,color:medalColors[i],margin:"4px 0"}}>{tab==="volumen"?`${(p.gym.vol||0).toLocaleString()} kg`:tab==="cumplimiento"?`${p.gym.pct}%`:`#${p.gym.rank}`}</div>
        <div style={{...ss.muted,fontSize:"10px"}}>{p.gym.pct}% cumplimiento {p.gym.pct===100?"🔥":""}</div>
      </div>)}
    </div>}
    {sorted.slice(compact?0:3).map((p,i)=>{
      const rank=compact?i+1:i+4;
      const val=tab==="volumen"?(p.gym.vol||0):tab==="cumplimiento"?(p.gym.pct||0):(100-rank*5);
      const maxVal=tab==="volumen"?14200:100;
      return <div key={p.id} style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px"}}>
        <MedalBadge rank={rank}/><span style={{fontSize:"12px",minWidth:"110px"}}>{p.name}</span>
        <div style={{flex:1}}><ProgressBar value={val} max={maxVal} color={rank===1?sportColor:rank<=3?"#8896B0":"#4A5568"}/></div>
        <span style={{fontSize:"12px",fontWeight:600,minWidth:"60px",textAlign:"right",color:rank===1?sportColor:"#E8EDF5"}}>{tab==="volumen"?`${(p.gym.vol||0).toLocaleString()} kg`:tab==="cumplimiento"?`${p.gym.pct}% ${p.gym.pct===100?"🔥":""}`:tab==="1rm"?`${130+rank*5} kg`:`↑ +${Math.max(0,12-rank*2)}%`}</span>
      </div>;
    })}
  </div>;
}

function BackendNotes({open,setOpen}) {
  const notes=[
    {title:"Config del club",body:"clubs.settings JSONB: { sports:['rugby','futbol'], colors:{primary,secondary}, country:'CL', payment_method:'khipu' }. Al activar un deporte se crean sus categorías estándar."},
    {title:"Multi-deporte y formaciones",body:"Posiciones, stats y tamaños vienen de SPORTS_CONFIG. Las formaciones (4-4-2, 4-3-3, 3-5-2, 3-4-3...) se guardan en lineups.formation y definen los slots y sus coordenadas en cancha."},
    {title:"Multi-equipo",body:"Un club tiene N equipos (teams): Primer Equipo, Reserva, Sub-20. Cada lineup referencia team_id, así un mismo club arma varias nóminas independientes en paralelo."},
    {title:"Planificación de cargas",body:"gym_plans: team_id, coach_id, week_start, sessions JSONB. Al publicar: notifications para el plantel + push FCM + WhatsApp opcional."},
    {title:"Registro del jugador",body:"gym_logs con columnas generadas one_rm_kg = peso × (1 + reps/30) y volume_kg = peso × reps. prescribed_weight = último 1RM × pct_1rm."},
    {title:"Pagos LATAM",body:"transactions.provider: khipu, webpay, mercadopago, pix, spei, pse, yape, nequi, oxxo. Comisión 3% a commission_records con doc fiscal según país."},
  ];
  return <div style={{marginTop:"32px",borderTop:"1px solid rgba(255,255,255,0.07)",paddingTop:"16px"}}>
    <button onClick={()=>setOpen(!open)} style={{...ss.btn,background:"transparent",color:"#8896B0",border:"1px solid rgba(255,255,255,0.1)",width:"100%",textAlign:"left",fontSize:"13px",padding:"10px 14px"}}>📋 Notas para el Backend Developer {open?"▲":"▼"}</button>
    {open&&<div style={{marginTop:"12px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
      {notes.map((n,i)=><div key={i} style={{...ss.card,padding:"12px"}}><div style={{fontWeight:600,fontSize:"12px",color:"#3B82F6",marginBottom:"6px"}}>{n.title}</div><div style={{fontSize:"11px",color:"#8896B0",lineHeight:"1.6"}}>{n.body}</div></div>)}
    </div>}
  </div>;
}