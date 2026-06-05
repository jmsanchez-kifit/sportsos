import { useState, useEffect } from "react";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from "recharts";

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

const WEARABLES_ANDRES = {
  appleWatch:{lastSync:"hace 2 min",heartRateRest:58,vo2Max:48.3,cardioLoad:4.2,heartRateRecovery:-14,activeCalories:540,workoutDuration:85},
  ouraRing:{lastSync:"hace 1 hora",sleepScore:76,hrv:38,restingHeartRate:58,sleepDuration:6.0,sleepStages:{rem:22,deep:15,light:63},readinessScore:68},
  strava:{lastSync:"hace 1 día",weeklyActivities:[{day:"Lunes",type:"Entrenamiento Rugby",duration:85,calories:540},{day:"Miércoles",type:"Corrida",duration:45,calories:380},{day:"Viernes",type:"Entrenamiento Rugby",duration:79,calories:510}]}
};
const HRV_10DAYS = [52,51,49,47,45,43,42,40,39,38];
const SLEEP_WEEK = [{day:"L",hrs:7.4},{day:"M",hrs:7.1},{day:"X",hrs:6.9},{day:"J",hrs:6.5},{day:"V",hrs:6.2},{day:"S",hrs:5.9},{day:"D",hrs:6.0}];
const PROGRESSION_1RM = [
  {week:"S1",mio:130,equipo:125},{week:"S2",mio:132,equipo:126},{week:"S3",mio:134,equipo:128},
  {week:"S4",mio:135,equipo:130},{week:"S5",mio:138,equipo:132},{week:"S6",mio:140,equipo:133},
  {week:"S7",mio:142,equipo:135},{week:"S8",mio:148,equipo:136}
];
const ATTENDANCE_10 = [true,true,true,true,true,false,true,true,true,true];
const PARENT_ALERTS = [
  {icon:"✅",text:"Andrés completó 100% del plan esta semana. ¡Excelente progresión!",color:"#22C55E",time:"hace 4 horas"},
  {icon:"⚠️",text:"HRV en caída. Asegura que Andrés duerma bien estos 3 días.",color:"#F59E0B",time:"hace 1 día"},
  {icon:"🏆",text:"Andrés superó su récord en sentadilla: 148 kg (antes 140 kg)!",color:"#A855F7",time:"hace 2 días"}
];
const INJURY_RISK_TEAM = [
  {id:1,name:"Andrés Castro",pos:"Número 8",num:8,hrv:38,sleep:6.0,cardioLoad:4.8,volume:3240,riskLevel:"HIGH",rec:"Reduce 30% intensidad hoy",trend:"↑+15%",hrvTrend:"↓-27%"},
  {id:2,name:"Matías Herrera",pos:"Ala Der.",num:14,hrv:40,sleep:5.8,cardioLoad:5.2,volume:3100,riskLevel:"HIGH",rec:"Descanso obligatorio mañana",trend:"↑+18%",hrvTrend:"↓-22%"},
  {id:3,name:"Diego Saavedra",pos:"Scrum Half",num:9,hrv:45,sleep:6.8,cardioLoad:3.2,volume:2890,riskLevel:"MEDIUM",rec:"Monitorea",trend:"↑+8%",hrvTrend:"→ stbl"},
  {id:4,name:"Ignacio Pérez",pos:"Centro",num:12,hrv:44,sleep:6.5,cardioLoad:3.5,volume:2920,riskLevel:"MEDIUM",rec:"Monitorea",trend:"↑+6%",hrvTrend:"↓-8%"},
  {id:5,name:"Cristóbal Vega",pos:"Fullback",num:15,hrv:43,sleep:6.6,cardioLoad:3.8,volume:2980,riskLevel:"MEDIUM",rec:"Monitorea",trend:"↑+9%",hrvTrend:"↓-10%"},
  {id:6,name:"Pablo Rodríguez",pos:"Centro",num:13,hrv:47,sleep:6.8,cardioLoad:3.0,volume:2820,riskLevel:"MEDIUM",rec:"Monitorea",trend:"↑+5%",hrvTrend:"→ stbl"},
  {id:7,name:"Felipe Morales",pos:"Apertura",num:10,hrv:52,sleep:8.0,cardioLoad:2.1,volume:2550,riskLevel:"LOW",rec:"Normal",trend:"↓-2%",hrvTrend:"↑+5%"},
  {id:8,name:"Rodrigo Muñoz",pos:"Ala Izq.",num:11,hrv:48,sleep:7.2,cardioLoad:2.8,volume:2780,riskLevel:"LOW",rec:"Normal",trend:"↑+3%",hrvTrend:"→ stbl"},
  {id:9,name:"Tomás López",pos:"Flanker Ala",num:7,hrv:50,sleep:7.5,cardioLoad:2.5,volume:2650,riskLevel:"LOW",rec:"Normal",trend:"↓-1%",hrvTrend:"→ stbl"},
  {id:10,name:"Sebastián Núñez",pos:"Flanker",num:6,hrv:51,sleep:7.8,cardioLoad:2.3,volume:2580,riskLevel:"LOW",rec:"Normal",trend:"↓-3%",hrvTrend:"↑+4%"},
  {id:11,name:"Carlos Contreras",pos:"Lock",num:5,hrv:49,sleep:7.0,cardioLoad:2.7,volume:2720,riskLevel:"LOW",rec:"Normal",trend:"↑+1%",hrvTrend:"→ stbl"},
  {id:12,name:"Jorge Fuentes",pos:"Lock",num:4,hrv:46,sleep:7.1,cardioLoad:3.1,volume:2680,riskLevel:"LOW",rec:"Normal",trend:"↓-1%",hrvTrend:"→ stbl"},
  {id:13,name:"Marco Silva",pos:"Prop Abierto",num:3,hrv:53,sleep:8.1,cardioLoad:2.0,volume:2540,riskLevel:"LOW",rec:"Normal",trend:"↓-4%",hrvTrend:"↑+7%"},
  {id:14,name:"Luis Torres",pos:"Hooker",num:2,hrv:48,sleep:7.4,cardioLoad:2.6,volume:2700,riskLevel:"LOW",rec:"Normal",trend:"↓-2%",hrvTrend:"→ stbl"},
  {id:15,name:"Nicolás Bravo",pos:"Prop Cerrado",num:1,hrv:50,sleep:7.7,cardioLoad:2.4,volume:2620,riskLevel:"LOW",rec:"Normal",trend:"↑+2%",hrvTrend:"→ stbl"}
];
const POSITIONS_HEATMAP = [
  {n:1,label:"Prop Izq",risk:"green"},{n:2,label:"Hooker",risk:"yellow"},{n:3,label:"Prop Der",risk:"green"},
  {n:4,label:"Lock",risk:"yellow"},{n:5,label:"Lock",risk:"green"},
  {n:6,label:"Flanker",risk:"green"},{n:7,label:"Flanker Ala",risk:"green"},{n:8,label:"Número 8",risk:"red"},
  {n:9,label:"Scrum H.",risk:"green"},{n:10,label:"Apertura",risk:"green"},
  {n:11,label:"Ala Izq",risk:"green"},{n:12,label:"Centro",risk:"yellow"},{n:13,label:"Centro",risk:"green"},{n:14,label:"Ala Der",risk:"red"},{n:15,label:"Fullback",risk:"yellow"}
];

const TIPOS_MEDICOS_CLASIFICACION = ["Muscular grado I","Muscular grado II","Muscular grado III","Tendinopatía","Esguince grado I","Esguince grado II","Esguince grado III","Fractura","Contusión simple","HIA leve","HIA moderado","Otro"];

const MOCK_WELLNESS_LOGS = [
  {id:1,playerId:1,playerName:"Andrés Castro",status:"amarillo",nota:"Tensión en muslo derecho",fecha:"03-06-2026",sesion:"Lunes"},
  {id:2,playerId:1,playerName:"Andrés Castro",status:"amarillo",nota:"Fatiga acumulada",fecha:"01-06-2026",sesion:"Sábado"},
  {id:3,playerId:1,playerName:"Andrés Castro",status:"verde",nota:"",fecha:"29-05-2026",sesion:"Jueves"},
  {id:4,playerId:2,playerName:"Felipe Morales",status:"verde",nota:"",fecha:"03-06-2026",sesion:"Lunes"},
  {id:5,playerId:2,playerName:"Felipe Morales",status:"verde",nota:"",fecha:"01-06-2026",sesion:"Sábado"},
  {id:6,playerId:3,playerName:"Diego Saavedra",status:"amarillo",nota:"Tobillo izquierdo molesto",fecha:"03-06-2026",sesion:"Lunes"},
  {id:7,playerId:3,playerName:"Diego Saavedra",status:"amarillo",nota:"",fecha:"01-06-2026",sesion:"Sábado"},
  {id:8,playerId:3,playerName:"Diego Saavedra",status:"verde",nota:"",fecha:"29-05-2026",sesion:"Jueves"},
  {id:9,playerId:4,playerName:"Cristóbal Vega",status:"rojo",nota:"Cabeza pesada post HIA",fecha:"03-06-2026",sesion:"Lunes"},
  {id:10,playerId:4,playerName:"Cristóbal Vega",status:"rojo",nota:"",fecha:"01-06-2026",sesion:"Sábado"},
  {id:11,playerId:10,playerName:"Sebastián Núñez",status:"amarillo",nota:"Rodilla izquierda",fecha:"03-06-2026",sesion:"Lunes"},
  {id:12,playerId:10,playerName:"Sebastián Núñez",status:"verde",nota:"",fecha:"01-06-2026",sesion:"Sábado"},
];

const STAFF_MEDICO = [
  {id:1,name:"Dr. Carlos García",role:"Médico del Club",icon:"👨‍⚕️",status:"disponible"},
  {id:2,name:"Lic. Rodrigo Pinto",role:"Kinesiólogo",icon:"🦴",status:"disponible"},
  {id:3,name:"Lic. Ana Morales",role:"Nutricionista",icon:"🥗",status:"no disponible"},
];
const INCIDENT_LOG = [
  {id:1,player:"Cristóbal Vega",type:"HIA",desc:"Golpe en cabeza vs Universitario. Protocolo HIA activo — paso 1 completado.",date:"Hace 2 días",severity:"rojo"},
  {id:2,player:"Diego Saavedra",type:"Muscular",desc:"Sobrecarga isquiotibial derecho. Reposo preventivo 3 días.",date:"Hace 4 días",severity:"amarillo"},
  {id:3,player:"Sebastián Núñez",type:"Articular",desc:"Molestia tobillo izquierdo. Seguimiento kinesiológico activo.",date:"Hace 6 días",severity:"amarillo"},
];

const ss = {
  wrap:{display:"flex",flexDirection:"column",height:"100vh",width:"100%",backgroundColor:"#09090b",backgroundImage:"radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)",backgroundSize:"22px 22px",color:"#fafafa",fontFamily:"'Geist','Inter',system-ui,sans-serif",overflow:"hidden"},
  topbar:{display:"flex",alignItems:"center",gap:"10px",padding:"0 20px",height:"56px",background:"#09090b",borderBottom:"1px solid #27272a",flexShrink:0},
  sidebar:{width:"220px",background:"#09090b",borderRight:"1px solid #27272a",display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto"},
  main:{flex:1,overflowY:"auto",padding:"24px",scrollbarWidth:"thin",scrollbarColor:"#3f3f46 transparent"},
  card:{background:"#09090b",border:"1px solid #27272a",borderRadius:"12px",padding:"20px"},
  muted:{color:"#a1a1aa",fontSize:"13px"},
  label:{color:"#71717a",fontSize:"11px",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"6px",fontWeight:600},
  btn:{padding:"8px 16px",borderRadius:"8px",border:"none",cursor:"pointer",fontSize:"13px",fontWeight:500,transition:"all 0.15s ease"},
  input:{background:"#09090b",border:"1px solid #3f3f46",borderRadius:"8px",color:"#fafafa",padding:"8px 12px",fontSize:"13px",outline:"none",width:"100%",boxSizing:"border-box",transition:"border-color 0.15s, box-shadow 0.15s"},
};

function Sparkline({data,color="#3B82F6",width=120,height=36,fill=true}) {
  const min=Math.min(...data),max=Math.max(...data),range=max-min||1;
  const pts=data.map((v,i)=>`${(i/(data.length-1))*width},${height-((v-min)/range)*(height-4)-2}`).join(" ");
  return <svg width={width} height={height} style={{display:"block"}}>
    {fill&&<polyline points={`0,${height} ${pts} ${width},${height}`} fill={color} opacity="0.15"/>}
    <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx={width} cy={height-((data[data.length-1]-min)/range)*(height-4)-2} r="3" fill={color}/>
  </svg>;
}

function RiskBadge({level}) {
  const map={HIGH:{c:"#EF4444",t:"🔴 ALTO"},MEDIUM:{c:"#F59E0B",t:"🟡 MEDIO"},LOW:{c:"#22C55E",t:"🟢 BAJO"}};
  const r=map[level]||map.LOW;
  return <Badge color={r.c}>{r.t}</Badge>;
}

function WearablesModal({onClose,showToast}) {
  const [connected,setConnected]=useState({apple:false,oura:false,strava:false});
  const connect=k=>{setConnected(p=>({...p,[k]:true}));showToast("🔗 Dispositivo conectado","success");};
  const devices=[
    {k:"apple",emoji:"🍎",name:"Apple Health / Apple Watch",access:"Heart Rate · VO2 Max · Workouts · Sleep"},
    {k:"oura",emoji:"⭕",name:"Oura Ring",access:"HRV · Sleep Score · Readiness · Temperatura"},
    {k:"strava",emoji:"🚴",name:"Strava",access:"Actividades (run/bike/swim) · Duración · Calorías"}
  ];
  return <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
    <div onClick={e=>e.stopPropagation()} style={{...ss.card,maxWidth:"540px",width:"100%",maxHeight:"85vh",overflow:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}>
        <div style={{fontWeight:700,fontSize:"17px"}}>Conecta tus dispositivos</div>
        <button onClick={onClose} style={{...ss.btn,background:"transparent",color:"#8896B0",padding:"4px 10px"}}>✕</button>
      </div>
      <div style={{color:"#8896B0",fontSize:"12px",marginBottom:"20px"}}>Análisis inteligente y predicción de lesiones basada en tus datos reales</div>
      {devices.map(d=>{const isC=connected[d.k];return <div key={d.k} style={{...ss.card,marginBottom:"10px",padding:"14px",border:`1px solid ${isC?"#22C55E55":"rgba(255,255,255,0.07)"}`,background:isC?"rgba(34,197,94,0.05)":"#101829"}}>
        <div style={{display:"flex",alignItems:"center",gap:"14px"}}>
          <div style={{fontSize:"30px"}}>{d.emoji}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,fontSize:"14px"}}>{d.name}</div>
            <div style={{color:"#8896B0",fontSize:"11px",marginTop:"4px"}}>{d.access}</div>
          </div>
          {isC?<Badge color="#22C55E">✓ Conectado</Badge>:<button onClick={()=>connect(d.k)} className="btn-hover" style={{...ss.btn,background:"#3B82F6",color:"#fff",fontSize:"12px"}}>Conectar →</button>}
        </div>
      </div>;})}
      <div style={{marginTop:"16px",padding:"12px 14px",background:"rgba(59,130,246,0.08)",borderRadius:"8px",fontSize:"11px",color:"#3B82F6",lineHeight:1.6}}>🔒 <strong>SportOS nunca accede a datos sensibles.</strong> Solo sincroniza métricas de rendimiento agregadas (HRV, sueño, volumen de entreno). Tus datos personales siempre encriptados.</div>
    </div>
  </div>;
}

function PlanModal({onClose,onAccept}) {
  return <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
    <div onClick={e=>e.stopPropagation()} style={{...ss.card,maxWidth:"560px",width:"100%",maxHeight:"85vh",overflow:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
        <div><div style={{fontWeight:700,fontSize:"16px"}}>🤖 Plan automático sugerido</div><div style={{color:"#8896B0",fontSize:"11px",marginTop:"2px"}}>Semana 7 · Volumen BAJO (3 jugadores con HRV degradado)</div></div>
        <button onClick={onClose} style={{...ss.btn,background:"transparent",color:"#8896B0",padding:"4px 10px"}}>✕</button>
      </div>
      {[
        {dia:"Lunes",label:"Fuerza baja intensidad",dur:70,ex:["Sentadilla 4×6×70% (no 80%)","Banca 4×8×70%","Hip Thrust 3×10×65%"]},
        {dia:"Miércoles",label:"Técnica + Potencia",dur:65,ex:["Power Clean 3×4×75%","Sentadilla Frontal 3×6×70%","Sled Push 5×20m"]},
        {dia:"Viernes",label:"Recuperación activa",dur:40,ex:["Movilidad 15 min","Stretching 20 min","Core 3×10"]}
      ].map((s,i)=><div key={i} style={{background:"#070C18",borderRadius:"8px",padding:"12px",marginBottom:"10px",borderLeft:"3px solid #3B82F6"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}><span style={{fontWeight:600,fontSize:"13px"}}>🔵 {s.dia} · {s.label}</span><span style={{color:"#8896B0",fontSize:"11px"}}>{s.dur} min</span></div>
        <ul style={{margin:0,paddingLeft:"18px",fontSize:"12px",color:"#8896B0",lineHeight:1.7}}>{s.ex.map((e,j)=><li key={j}>{e}</li>)}</ul>
      </div>)}
      <div style={{padding:"12px 14px",background:"rgba(168,85,247,0.1)",borderRadius:"8px",border:"1px solid rgba(168,85,247,0.33)",fontSize:"11px",color:"#A855F7",marginBottom:"14px"}}><strong>Justificación IA:</strong> 3 jugadores con HRV degradado. Volumen bajo evita lesiones. Semana próxima vuelve carga normal.</div>
      <div style={{display:"flex",gap:"10px"}}>
        <button onClick={onAccept} className="btn-hover" style={{...ss.btn,background:"#22C55E",color:"#fff",flex:1,padding:"10px"}}>✅ Aceptar plan</button>
        <button onClick={onClose} style={{...ss.btn,background:"transparent",color:"#E8EDF5",border:"1px solid rgba(255,255,255,0.07)",flex:1,padding:"10px"}}>✏️ Editar</button>
      </div>
    </div>
  </div>;
}

function Toast({msg,type,onClose}) {
  useEffect(()=>{const t=setTimeout(onClose,3000);return()=>clearTimeout(t);},[]);
  const bg = type==="success"?"#22C55E":type==="warning"?"#F59E0B":"#EF4444";
  return <div style={{position:"fixed",top:"20px",right:"20px",background:bg,color:"#fff",padding:"12px 18px",borderRadius:"8px",zIndex:9999,fontWeight:500,fontSize:"13px",boxShadow:"0 4px 16px rgba(0,0,0,0.4)",animation:"slideIn 0.3s ease",maxWidth:"320px"}}>{msg}</div>;
}

function Badge({color,children,size="sm"}) {
  const fs = size==="sm"?"11px":"12px", px = size==="sm"?"8px":"11px", py = size==="sm"?"2px":"4px";
  return <span style={{background:color+"20",color,border:`1px solid ${color}38`,borderRadius:"6px",padding:`${py} ${px}`,fontSize:fs,fontWeight:500,whiteSpace:"nowrap",letterSpacing:"0.01em",display:"inline-flex",alignItems:"center",gap:"4px"}}>{children}</span>;
}

function ProgressBar({value,max,color,height=6}) {
  const pct = Math.min(100,Math.round((value/max)*100));
  return <div style={{background:"#27272a",borderRadius:"99px",height,overflow:"hidden"}}>
    <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:"99px",transition:"width 0.5s ease"}}/>
  </div>;
}

function Semaforo({status}) {
  const c = status==="verde"?"#22C55E":status==="amarillo"?"#F59E0B":"#EF4444";
  return <span style={{width:"8px",height:"8px",borderRadius:"50%",background:c,display:"inline-block",flexShrink:0,boxShadow:`0 0 6px ${c}88`}}/>;
}

function Stat({label,value,sub,color}) {
  return <div style={{...ss.card}}>
    <div style={{...ss.label,marginBottom:"8px"}}>{label}</div>
    <div style={{fontSize:"28px",fontWeight:700,color:color||"#fafafa",letterSpacing:"-0.02em",lineHeight:1}}>{value}</div>
    {sub&&<div style={{...ss.muted,marginTop:"6px",fontSize:"12px"}}>{sub}</div>}
  </div>;
}

function SectionTitle({title,sub,action}) {
  return <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"20px",gap:"12px",flexWrap:"wrap"}}>
    <div>
      <h2 style={{margin:0,fontSize:"18px",fontWeight:600,letterSpacing:"-0.01em",color:"#fafafa"}}>{title}</h2>
      {sub&&<p style={{...ss.muted,margin:"4px 0 0",fontSize:"13px"}}>{sub}</p>}
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
  const _p=new URLSearchParams(window.location.search);
  const _urlRol=_p.get('rol')||'';
  const _urlDeporte=(_p.get('deporte')||'rugby');
  const demoMode=!!_urlRol;
  const [screen,setScreen]=useState(_urlRol?"app":"onboarding");
  const [sport,setSport]=useState(_urlDeporte);
  const [country,setCountry]=useState("CL");
  const [role,setRole]=useState(_urlRol||"entrenador");
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
  const [wearablesOpen,setWearablesOpen]=useState(false);
  const [injuryReports,setInjuryReports]=useState([]);
  const addInjuryReport=r=>setInjuryReports(p=>[r,...p]);
  const updateInjuryReport=(id,updates)=>setInjuryReports(p=>p.map(r=>r.id===id?{...r,...updates}:r));
  const [wellnessLogs,setWellnessLogs]=useState(MOCK_WELLNESS_LOGS);
  const addWellnessLog=r=>setWellnessLogs(p=>[r,...p]);
  const [sesionesCreadas,setSesionesCreadas]=useState([]);
  const addSesion=s=>setSesionesCreadas(p=>[s,...p]);

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
    {id:"padre",label:"Padre",icon:"👨"},
  ];

  const MODULE_MAP = {
    superadmin:[{id:"dashboard",label:"Dashboard Global"},{id:"clubes",label:"Clubes"},{id:"comisiones",label:"Comisiones"},{id:"comparativa",label:"SportOS vs SportEasy"}],
    admin:[{id:"miclub",label:"Mi Club"},{id:"jugadores",label:"Jugadores"},{id:"finanzas",label:"Finanzas"}],
    entrenador:[{id:"muro",label:"El Muro"},{id:"matchcenter",label:"Match Center"},{id:"nomina",label:"Nómina"},{id:"estadisticas",label:"Estadísticas"},{id:"asistencia",label:"Asistencia"},{id:"salud",label:"Salud"},{id:"equipomedico",label:"Equipo Médico"}],
    preparador:[{id:"microciclo",label:"Microciclo"},{id:"estadoplantel",label:"Estado Plantel"},{id:"rankingfuerza",label:"Ranking Fuerza"},{id:"lesiones",label:"Análisis de Lesiones"}],
    jugador:[{id:"midashboard",label:"Mi Dashboard"},{id:"migym",label:"Mi Gym"},{id:"mislesiones",label:"Mis Lesiones"},{id:"micuota",label:"Mi Cuota"},{id:"nominasclub",label:"Nóminas del Club"},{id:"miconvocatoria",label:"Mi Convocatoria"}],
    padre:[{id:"hijodashboard",label:"Mi Hijo"}],
  };

  useEffect(()=>{const mods=MODULE_MAP[role]||[];if(mods.length>0)setModule(mods[0].id);},[role]);
  useEffect(()=>{setCategory(0);},[sport]);

  if(screen==="onboarding") return <OnboardingScreen onSelect={(s,c)=>{setSport(s);setCountry(c);setScreen("app");}} />;

  const sportColor = sp.color;
  const sportModules = MODULE_MAP[role]||[];

  return <div style={ss.wrap}>
    {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    {wearablesOpen&&<WearablesModal onClose={()=>setWearablesOpen(false)} showToast={showToast}/>}
    {whatsappModal&&<WhatsAppModal onClose={()=>setWhatsappModal(false)} team={club.name} rival={club.next.rival} date={club.next.dia} starters={SPORTS_CONFIG[sport].positions.slice(0,sp.teamSize).map((pos,i)=>({name:PLAYERS_RUGBY[i]?PLAYERS_RUGBY[i].name:"Jugador "+(i+1),pos}))} bench={[]}/>}
    <style>{`
      @keyframes slideIn{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
      @keyframes recordPop{0%{transform:scale(1)}50%{transform:scale(1.15)}100%{transform:scale(1)}}
      @keyframes moduleEnter{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      .module-enter{animation:moduleEnter 0.28s cubic-bezier(0.16,1,0.3,1)}
      .nav-item:hover{background:#18181b!important;color:#fafafa!important}
      .btn-hover:hover{opacity:0.88!important;filter:brightness(1.08)!important}
      .sport-tab:hover{background:#18181b!important}
      .drag-row:hover{background:#18181b!important}
      .table-row:hover td{background:#18181b}
      input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
      input:not([type=color]):focus{border-color:#3f3f46!important;box-shadow:0 0 0 2px rgba(63,63,70,0.5)!important}
      select:focus{border-color:#3f3f46!important;box-shadow:0 0 0 2px rgba(63,63,70,0.5)!important;outline:none}
      textarea:focus{border-color:#3f3f46!important;box-shadow:0 0 0 2px rgba(63,63,70,0.5)!important;outline:none}
      ::-webkit-scrollbar{width:6px;height:6px}
      ::-webkit-scrollbar-track{background:transparent}
      ::-webkit-scrollbar-thumb{background:#3f3f46;border-radius:99px}
      ::-webkit-scrollbar-thumb:hover{background:#52525b}
      *{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
      th{font-size:12px!important;font-weight:500!important;color:#71717a!important;text-transform:uppercase!important;letter-spacing:0.05em!important}
    `}</style>

    <div style={ss.topbar}>
      <div style={{fontWeight:800,fontSize:"16px",color:sportColor,marginRight:"4px",whiteSpace:"nowrap",letterSpacing:"-0.03em"}}>⚡ SportOS</div>
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
      <button onClick={()=>setWearablesOpen(true)} className="btn-hover" style={{...ss.btn,background:"transparent",color:"#8896B0",border:"1px solid rgba(255,255,255,0.1)",fontSize:"12px",padding:"6px 12px"}}>⌚ Wearables</button>
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
        {!demoMode
          ?<div style={{padding:"12px 8px 4px"}}>
            <div style={{...ss.label,paddingLeft:"8px"}}>Rol activo</div>
            {ROLES.map(r=><button key={r.id} onClick={()=>setRole(r.id)} className="nav-item" style={{display:"flex",alignItems:"center",gap:"8px",padding:"7px 10px",borderRadius:"8px",border:"none",cursor:"pointer",background:role===r.id?"#18181b":"transparent",color:role===r.id?"#fafafa":"#a1a1aa",width:"100%",textAlign:"left",fontSize:"13px",fontWeight:role===r.id?500:400,marginBottom:"1px",transition:"all 0.12s"}}>
              <span style={{fontSize:"14px"}}>{r.icon}</span><span style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.label}</span>
            </button>)}
          </div>
          :<div style={{padding:"12px 8px 4px"}}>
            <div style={{...ss.label,paddingLeft:"8px"}}>Sesión activa</div>
            <div style={{display:"flex",alignItems:"center",gap:"8px",padding:"8px",background:"rgba(59,130,246,0.1)",borderRadius:"8px",border:"1px solid rgba(59,130,246,0.2)"}}>
              <span style={{fontSize:"18px"}}>{ROLES.find(r=>r.id===role)?.icon}</span>
              <div>
                <div style={{fontSize:"12px",fontWeight:600,color:"#3B82F6"}}>{ROLES.find(r=>r.id===role)?.label}</div>
                <div style={{fontSize:"10px",color:"#8896B0"}}>SportOS Demo</div>
              </div>
            </div>
          </div>}
        <div style={{padding:"12px 8px 4px",borderTop:"1px solid rgba(255,255,255,0.07)",marginTop:"4px"}}>
          <div style={{...ss.label,paddingLeft:"8px"}}>Módulos</div>
          {sportModules.map(m=><button key={m.id} onClick={()=>setModule(m.id)} className="nav-item" style={{display:"flex",alignItems:"center",gap:"8px",padding:"7px 10px",borderRadius:"8px",border:"none",cursor:"pointer",background:module===m.id?"#18181b":"transparent",color:module===m.id?"#fafafa":"#a1a1aa",width:"100%",textAlign:"left",fontSize:"13px",fontWeight:module===m.id?500:400,marginBottom:"1px",transition:"all 0.12s"}}>{m.label}</button>)}
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
        <div key={role+module} className="module-enter">
          {role==="superadmin"&&<SuperAdminView module={module} commData={COMMISSION_DATA} clubList={clubList} setClubList={setClubList} showToast={showToast} COUNTRIES={COUNTRIES} COUNTRY_COUNTS={COUNTRY_COUNTS}/>}
          {role==="admin"&&<AdminView module={module} sport={sport} sp={sp} club={club} activeClubs={activeClubs} setActiveClubs={setActiveClubs} countryData={countryData} players={PLAYERS_RUGBY} showToast={showToast} sportColor={sportColor}/>}
          {role==="entrenador"&&<EntrenadorView module={module} sport={sport} sp={sp} club={club} players={PLAYERS_RUGBY} postLikes={postLikes} setPostLikes={setPostLikes} showToast={showToast} sportColor={sportColor} currentCategory={currentCategory} hiaModal={hiaModal} setHiaModal={setHiaModal} injuryReports={injuryReports} addInjuryReport={addInjuryReport} updateInjuryReport={updateInjuryReport} wellnessLogs={wellnessLogs}/>}
          {role==="preparador"&&<PreparadorView module={module} sp={sp} showToast={showToast} sportColor={sportColor} publishedPlan={publishedPlan} setPublishedPlan={setPublishedPlan} newExForm={newExForm} setNewExForm={setNewExForm} newEx={newEx} setNewEx={setNewEx} gymPlanExercises={gymPlanExercises} setGymPlanExercises={setGymPlanExercises} rankTab={rankTab} setRankTab={setRankTab} expandedDay={expandedDay} setExpandedDay={setExpandedDay} sesionesCreadas={sesionesCreadas} addSesion={addSesion}/>}
          {role==="jugador"&&<JugadorView module={module} sport={sport} sp={sp} club={club} player={PLAYERS_RUGBY[0]} players={PLAYERS_RUGBY} sportColor={sportColor} countryData={countryData} convocado={convocado} setConvocado={setConvocado} setWhatsappModal={setWhatsappModal} showToast={showToast} gymLog={gymLog} setGymLog={setGymLog} completedSession={completedSession} setCompletedSession={setCompletedSession} newRecord={newRecord} setNewRecord={setNewRecord} expandedEx={expandedEx} setExpandedEx={setExpandedEx} rankTab={rankTab} setRankTab={setRankTab} injuryReports={injuryReports} addInjuryReport={addInjuryReport} updateInjuryReport={updateInjuryReport} addWellnessLog={addWellnessLog} sesionesCreadas={sesionesCreadas}/>}
          {role==="padre"&&<PadreView showToast={showToast} setWearablesOpen={setWearablesOpen} injuryReports={injuryReports} updateInjuryReport={updateInjuryReport}/>}
          <BackendNotes open={backendOpen} setOpen={setBackendOpen}/>
        </div>
      </div>
    </div>
  </div>;
}

function severidadClasificacion(c) {
  if(!c) return null;
  if(["Muscular grado I","Contusión simple","Esguince grado I"].includes(c)) return "verde";
  if(["Muscular grado II","Tendinopatía","Esguince grado II","HIA leve"].includes(c)) return "amarillo";
  return "rojo";
}

function MiniChat({mensajes,onSend,autorLabel}) {
  const [msg,setMsg]=useState("");
  const send=()=>{if(!msg.trim())return;onSend({autor:autorLabel,texto:msg,time:new Date().toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit"})});setMsg("");};
  return <div style={{borderTop:"1px solid rgba(255,255,255,0.07)",marginTop:"10px",paddingTop:"10px"}}>
    <div style={{...ss.muted,fontSize:"10px",marginBottom:"6px",textTransform:"uppercase",letterSpacing:"0.05em"}}>💬 Chat</div>
    <div style={{maxHeight:"110px",overflowY:"auto",marginBottom:"8px",display:"flex",flexDirection:"column",gap:"4px"}}>
      {mensajes.length===0&&<div style={{...ss.muted,fontSize:"11px",textAlign:"center",padding:"6px"}}>Sin mensajes aún</div>}
      {mensajes.map((m,i)=>{
        const isMine=m.autor===autorLabel;
        return <div key={i} style={{display:"flex",justifyContent:isMine?"flex-end":"flex-start"}}>
          <div style={{background:isMine?"rgba(59,130,246,0.2)":"rgba(255,255,255,0.06)",borderRadius:"8px",padding:"5px 10px",maxWidth:"80%"}}>
            <div style={{fontSize:"10px",color:"#8896B0",marginBottom:"1px"}}>{m.autor} · {m.time}</div>
            <div style={{fontSize:"12px"}}>{m.texto}</div>
          </div>
        </div>;
      })}
    </div>
    <div style={{display:"flex",gap:"6px"}}>
      <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Escribe un mensaje..." style={{...ss.input,fontSize:"12px",padding:"6px 10px"}}/>
      <button onClick={send} className="btn-hover" style={{...ss.btn,background:"#3B82F6",color:"#fff",padding:"6px 14px",flexShrink:0}}>→</button>
    </div>
  </div>;
}

function InjuryForm({players,playerName,onSubmit,onCancel,showToast}) {
  const tipos=["Muscular","Articular","HIA","Fractura","Contusión","Otro"];
  const [form,setForm]=useState({player:playerName||(players?players[0].name:""),tipo:"Muscular",diagnostico:"",imagenNombre:null,imagenUrl:null});
  const handleImg=(e)=>{
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader();
    r.onload=(ev)=>setForm(p=>({...p,imagenNombre:f.name,imagenUrl:ev.target.result}));
    r.readAsDataURL(f);
  };
  const submit=()=>{
    if(!form.diagnostico.trim()){showToast("Ingresa el diagnóstico","warning");return;}
    onSubmit({...form,id:Date.now(),fecha:new Date().toLocaleDateString("es-CL"),severity:["HIA","Fractura"].includes(form.tipo)?"rojo":"amarillo"});
  };
  return <div style={{background:"rgba(59,130,246,0.05)",borderRadius:"10px",padding:"16px",border:"1px solid rgba(59,130,246,0.2)",marginBottom:"16px"}}>
    <div style={{fontWeight:600,fontSize:"13px",marginBottom:"14px",color:"#3B82F6"}}>📋 Nueva lesión</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"10px"}}>
      <div>
        <div style={ss.label}>Jugador</div>
        {players
          ? <select value={form.player} onChange={e=>setForm(p=>({...p,player:e.target.value}))} style={ss.input}>{players.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select>
          : <div style={{...ss.input,opacity:0.7,pointerEvents:"none"}}>{form.player}</div>}
      </div>
      <div>
        <div style={ss.label}>Tipo de lesión</div>
        <select value={form.tipo} onChange={e=>setForm(p=>({...p,tipo:e.target.value}))} style={ss.input}>{tipos.map(t=><option key={t} value={t}>{t}</option>)}</select>
      </div>
    </div>
    <div style={{marginBottom:"10px"}}>
      <div style={ss.label}>Diagnóstico</div>
      <textarea value={form.diagnostico} onChange={e=>setForm(p=>({...p,diagnostico:e.target.value}))} placeholder="Describe la lesión y el diagnóstico médico..." style={{...ss.input,height:"72px",resize:"vertical",fontFamily:"inherit"}}/>
    </div>
    <div style={{marginBottom:"14px"}}>
      <div style={ss.label}>Imagen del diagnóstico (opcional)</div>
      <input type="file" accept="image/*,.pdf" onChange={handleImg} style={{...ss.input,padding:"6px 8px"}}/>
      {form.imagenUrl&&form.imagenUrl.startsWith("data:image")&&<img src={form.imagenUrl} alt="preview" style={{marginTop:"8px",maxHeight:"120px",borderRadius:"6px",border:"1px solid rgba(255,255,255,0.1)",display:"block"}}/>}
      {form.imagenNombre&&!form.imagenUrl?.startsWith("data:image")&&<div style={{...ss.muted,marginTop:"4px",fontSize:"11px"}}>📎 {form.imagenNombre}</div>}
    </div>
    <div style={{display:"flex",gap:"8px"}}>
      <button onClick={submit} className="btn-hover" style={{...ss.btn,background:"#3B82F6",color:"#fff"}}>✅ Registrar lesión</button>
      <button onClick={onCancel} style={{...ss.btn,background:"transparent",color:"#8896B0",border:"1px solid rgba(255,255,255,0.1)"}}>Cancelar</button>
    </div>
  </div>;
}

function EquipoMedicoView({players,showToast,sportColor,injuryReports,addInjuryReport,updateInjuryReport,wellnessLogs}) {
  const [medStatuses,setMedStatuses]=useState(Object.fromEntries(players.map(p=>[p.id,p.med])));
  const [showForm,setShowForm]=useState(false);
  const update=(id,status)=>{
    setMedStatuses(prev=>({...prev,[id]:status}));
    const p=players.find(x=>x.id===id);
    const label=status==="verde"?"Apto":status==="amarillo"?"En alerta":"No apto";
    showToast(`${p.name} → ${label}`,status==="verde"?"success":"warning");
  };
  const wl=wellnessLogs||[];
  const getEffStatus=(p)=>{const l=wl.filter(x=>x.playerId===p.id)[0];return l?l.status:medStatuses[p.id];};
  const aptos=players.filter(p=>getEffStatus(p)==="verde").length;
  const alerta=players.filter(p=>getEffStatus(p)==="amarillo").length;
  const noAptos=players.filter(p=>getEffStatus(p)==="rojo").length;
  return <div>
    <SectionTitle title="Equipo Médico" sub="Control de lesiones y estado del plantel" action={<button onClick={()=>setShowForm(v=>!v)} className="btn-hover" style={{...ss.btn,background:showForm?"rgba(255,255,255,0.05)":"#3B82F6",color:showForm?"#8896B0":"#fff",fontSize:"12px"}}>{showForm?"✕ Cancelar":"⊕ Ingresar lesión"}</button>}/>
    {showForm&&<InjuryForm players={players} onSubmit={r=>{addInjuryReport(r);setShowForm(false);showToast("✅ Lesión registrada en el sistema","success");}} onCancel={()=>setShowForm(false)} showToast={showToast}/>}
    {injuryReports.length>0&&<div style={{...ss.card,marginBottom:"20px",border:"1px solid rgba(59,130,246,0.2)"}}>
      <div style={{fontWeight:600,fontSize:"14px",marginBottom:"14px",color:"#3B82F6"}}>🩺 Lesiones reportadas ({injuryReports.length})</div>
      {injuryReports.map((rep,i)=>{
        const c=rep.severity==="rojo"?"#EF4444":"#F59E0B";
        const sevClasif=severidadClasificacion(rep.clasificacionMedica);
        return <div key={rep.id} style={{borderLeft:`3px solid ${c}`,paddingLeft:"12px",padding:"12px 0 12px 12px",borderBottom:i<injuryReports.length-1?"1px solid rgba(255,255,255,0.07)":"none"}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px",flexWrap:"wrap"}}>
            <Badge color={c}>{rep.tipo}</Badge>
            <span style={{fontWeight:600,fontSize:"13px"}}>{rep.player}</span>
            <span style={{...ss.muted,fontSize:"11px",marginLeft:"auto"}}>{rep.fecha}</span>
          </div>
          <div style={{fontSize:"12px",color:"#C8D3E0",marginBottom:"8px"}}>{rep.diagnostico}</div>
          {rep.imagenUrl&&rep.imagenUrl.startsWith("data:image")&&<img src={rep.imagenUrl} alt="diagnóstico" style={{maxHeight:"80px",borderRadius:"4px",border:"1px solid rgba(255,255,255,0.1)",marginBottom:"8px",display:"block"}}/>}
          {rep.imagenNombre&&!rep.imagenUrl?.startsWith("data:image")&&<div style={{...ss.muted,fontSize:"11px",marginBottom:"8px"}}>📎 {rep.imagenNombre}</div>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"10px"}}>
            <div>
              <div style={ss.label}>Clasificación médica</div>
              <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                {sevClasif&&<Semaforo status={sevClasif}/>}
                <select value={rep.clasificacionMedica||""} onChange={e=>updateInjuryReport(rep.id,{clasificacionMedica:e.target.value})} style={{...ss.input,fontSize:"12px",flex:1}}>
                  <option value="">Sin clasificar</option>
                  {TIPOS_MEDICOS_CLASIFICACION.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <div style={ss.label}>Vuelta estimada a canchas</div>
              <input type="date" value={rep.fechaVuelta||""} onChange={e=>updateInjuryReport(rep.id,{fechaVuelta:e.target.value})} style={{...ss.input,fontSize:"12px",colorScheme:"dark"}}/>
            </div>
          </div>
          <div style={{marginBottom:"4px"}}>
            {!rep.acusadoRecibo
              ?<button onClick={()=>updateInjuryReport(rep.id,{acusadoRecibo:true,acusadoReciboAt:new Date().toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit"})})} className="btn-hover" style={{...ss.btn,background:"rgba(34,197,94,0.1)",color:"#22C55E",border:"1px solid rgba(34,197,94,0.2)",fontSize:"12px"}}>✉️ Acusar recibo</button>
              :<span style={{fontSize:"11px",color:"#22C55E"}}>✅ Recibido por equipo médico · {rep.acusadoReciboAt}</span>}
          </div>
          <MiniChat mensajes={rep.mensajes||[]} onSend={msg=>updateInjuryReport(rep.id,{mensajes:[...(rep.mensajes||[]),msg]})} autorLabel="Equipo Médico"/>
        </div>;
      })}
    </div>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px",marginBottom:"24px"}}>
      <Stat label="Aptos" value={aptos} sub="Para entrenar y jugar" color="#22C55E"/>
      <Stat label="En alerta" value={alerta} sub="Seguimiento preventivo" color="#F59E0B"/>
      <Stat label="No aptos" value={noAptos} sub="Fuera de actividad" color="#EF4444"/>
    </div>

    {(()=>{
      const recent=players.map(p=>wl.filter(l=>l.playerId===p.id)[0]).filter(Boolean);
      const verde=recent.filter(l=>l.status==="verde").length;
      const alertaCount=recent.filter(l=>l.status!=="verde").length;
      const alertaNames=players.filter(p=>{const lg=wl.filter(l=>l.playerId===p.id).slice(0,2);return lg.length>=2&&lg.every(l=>l.status!=="verde");}).map(p=>p.name.split(" ")[0]);
      return <div style={{...ss.card,marginBottom:"16px",background:"rgba(59,130,246,0.05)",border:"1px solid rgba(59,130,246,0.2)"}}>
        <div style={{fontWeight:600,fontSize:"13px",marginBottom:"10px"}}>📊 Tendencias · última sesión registrada</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",marginBottom:alertaNames.length>0?"10px":"0"}}>
          <div style={{textAlign:"center"}}><div style={{fontSize:"20px",fontWeight:700,color:"#22C55E"}}>{verde}</div><div style={{...ss.muted,fontSize:"11px"}}>Bien</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:"20px",fontWeight:700,color:"#F59E0B"}}>{alertaCount}</div><div style={{...ss.muted,fontSize:"11px"}}>Con alertas</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:"20px",fontWeight:700,color:"#8896B0"}}>{recent.length}/{players.length}</div><div style={{...ss.muted,fontSize:"11px"}}>Reportaron</div></div>
        </div>
        {alertaNames.length>0&&<div style={{padding:"8px 12px",background:"rgba(245,158,11,0.1)",borderRadius:"6px",fontSize:"11px",color:"#F59E0B"}}>⚠️ 2+ sesiones consecutivas en alerta: {alertaNames.join(", ")}</div>}
      </div>;
    })()}

    <div style={{...ss.card,marginBottom:"20px"}}>
      <div style={{fontWeight:600,fontSize:"14px",marginBottom:"14px"}}>Estado del plantel · auto-reporte post-sesión</div>
      {players.map(p=>{
        const logs=wl.filter(l=>l.playerId===p.id);
        const lastLog=logs[0];
        const effStatus=lastLog?lastLog.status:medStatuses[p.id];
        const history=logs.slice(0,5);
        return <div key={p.id} style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.05)",flexWrap:"wrap"}}>
          <Semaforo status={effStatus}/>
          <div style={{flex:1,minWidth:"120px"}}>
            <span style={{fontSize:"13px",fontWeight:500}}>{p.name}</span>
            <span style={{...ss.muted,fontSize:"11px",marginLeft:"8px"}}>{p.pos}</span>
            {lastLog&&<div style={{...ss.muted,fontSize:"10px",marginTop:"1px"}}>{lastLog.sesion}{lastLog.nota?` · ${lastLog.nota.substring(0,35)}`:""}</div>}
            {!lastLog&&<div style={{...ss.muted,fontSize:"10px",marginTop:"1px"}}>Sin reporte</div>}
          </div>
          <div style={{display:"flex",gap:"3px",alignItems:"center",marginRight:"4px"}}>
            {history.map((l,i)=>{const dc=l.status==="verde"?"#22C55E":l.status==="amarillo"?"#F59E0B":"#EF4444";return <span key={i} style={{width:"7px",height:"7px",borderRadius:"50%",background:dc,display:"inline-block",opacity:Math.max(0.4,1-i*0.15)}}/>;  })}
            {Array.from({length:Math.max(0,5-history.length)}).map((_,i)=><span key={i} style={{width:"7px",height:"7px",borderRadius:"50%",background:"rgba(255,255,255,0.08)",display:"inline-block"}}/>)}
          </div>
          <div style={{display:"flex",gap:"3px"}}>
            {[["verde","🟢"],["amarillo","🟡"],["rojo","🔴"]].map(([s,icon])=><button key={s} onClick={()=>update(p.id,s)} className="btn-hover" style={{...ss.btn,padding:"3px 7px",fontSize:"10px",background:medStatuses[p.id]===s?(s==="verde"?"rgba(34,197,94,0.2)":s==="amarillo"?"rgba(245,158,11,0.2)":"rgba(239,68,68,0.2)"):"transparent",color:medStatuses[p.id]===s?(s==="verde"?"#22C55E":s==="amarillo"?"#F59E0B":"#EF4444"):"#4A5568",border:"1px solid rgba(255,255,255,0.06)"}}>{icon}</button>)}
          </div>
        </div>;
      })}
    </div>

    <div style={{...ss.card,marginBottom:"20px"}}>
      <div style={{fontWeight:600,fontSize:"14px",marginBottom:"14px"}}>Staff médico</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px"}}>
        {STAFF_MEDICO.map(s=><div key={s.id} style={{background:"#070C18",borderRadius:"8px",padding:"14px"}}>
          <div style={{fontSize:"28px",marginBottom:"8px"}}>{s.icon}</div>
          <div style={{fontWeight:600,fontSize:"13px"}}>{s.name}</div>
          <div style={{...ss.muted,fontSize:"11px",marginTop:"2px",marginBottom:"10px"}}>{s.role}</div>
          <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"10px"}}>
            <span style={{width:"6px",height:"6px",borderRadius:"50%",background:s.status==="disponible"?"#22C55E":"#F59E0B",display:"inline-block"}}/>
            <span style={{fontSize:"11px",color:s.status==="disponible"?"#22C55E":"#F59E0B"}}>{s.status}</span>
          </div>
          <button onClick={()=>showToast(`📞 Llamando a ${s.name}...`)} className="btn-hover" style={{...ss.btn,background:"rgba(59,130,246,0.13)",color:"#3B82F6",border:"1px solid rgba(59,130,246,0.2)",width:"100%",fontSize:"11px"}}>📞 Contactar</button>
        </div>)}
      </div>
    </div>

    <div style={ss.card}>
      <div style={{fontWeight:600,fontSize:"14px",marginBottom:"14px"}}>Registro de incidentes</div>
      {INCIDENT_LOG.map((inc,i)=>{
        const c=inc.severity==="rojo"?"#EF4444":"#F59E0B";
        return <div key={inc.id} style={{borderLeft:`3px solid ${c}`,paddingLeft:"12px",padding:"10px 0 10px 12px",borderBottom:i<INCIDENT_LOG.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"4px",flexWrap:"wrap"}}>
            <Badge color={c}>{inc.type}</Badge>
            <span style={{fontWeight:600,fontSize:"13px"}}>{inc.player}</span>
            <span style={{...ss.muted,fontSize:"11px",marginLeft:"auto"}}>{inc.date}</span>
          </div>
          <div style={{fontSize:"12px",color:"#C8D3E0"}}>{inc.desc}</div>
        </div>;
      })}
    </div>

  </div>;
}

const EJERCICIOS_LISTA = ["Sentadilla","Sentadilla Frontal","Press Banca","Press Militar","Peso Muerto","Peso Muerto Rumano","Hip Thrust","Pull-up","Remo con Barra","Remo en Polea","Fondos","Zancada","Box Jump","Power Clean","Hang Clean","Push Press","Sled Push","Farmer Carry","Plancha","Core Press"];
const BLOQUE_COLORS = ["#F97316","#3B82F6","#22C55E","#A855F7","#F59E0B","#EF4444","#06B6D4"];

function NuevaSesionModal({onClose,showToast,addSesion,categorias=["M18","M16","M14"]}) {
  const hoy=new Date().toISOString().split("T")[0];
  const [fecha,setFecha]=useState(hoy);
  const [tipo,setTipo]=useState("Fuerza");
  const [titulo,setTitulo]=useState("");
  const [categoria,setCategoria]=useState("M18");
  const [bloques,setBloques]=useState([mkBloque("A")]);
  function mkBloque(letra){return {id:Date.now()+Math.random(),letra,nombre:"Principal",objetivo:"FUERZA",filas:[mkFila()]};}
  function mkFila(){return {id:Date.now()+Math.random(),patron:"",ejercicio:"",series:3,reps:8,tipoRep:"reps",kg:"",rir:"",rpe:""};}
  const addBloque=()=>{const l="ABCDEFGHIJ"[bloques.length]||String.fromCharCode(65+bloques.length);setBloques(p=>[...p,mkBloque(l)]);};
  const delBloque=(id)=>setBloques(p=>p.filter(b=>b.id!==id));
  const dupBloque=(id)=>{const i=bloques.findIndex(b=>b.id===id);const c={...bloques[i],id:Date.now(),letra:"ABCDEFGHIJ"[bloques.length]||"+"};setBloques(p=>[...p.slice(0,i+1),c,...p.slice(i+1)]);};
  const updBloque=(id,u)=>setBloques(p=>p.map(b=>b.id===id?{...b,...u}:b));
  const addFila=(bid)=>setBloques(p=>p.map(b=>b.id===bid?{...b,filas:[...b.filas,mkFila()]}:b));
  const delFila=(bid,fid)=>setBloques(p=>p.map(b=>b.id===bid?{...b,filas:b.filas.filter(f=>f.id!==fid)}:b));
  const updFila=(bid,fid,u)=>setBloques(p=>p.map(b=>b.id===bid?{...b,filas:b.filas.map(f=>f.id===fid?{...f,...u}:f)}:b));
  const save=()=>{if(!titulo.trim()){showToast("Ingresa un título para la sesión","warning");return;}addSesion({id:Date.now(),fecha,tipo,titulo,categoria,bloques});showToast(`✅ Sesión "${titulo}" asignada a ${categoria}`,"success");onClose();};
  const OBJETIVOS=["OBJETIVO","FUERZA","POTENCIA","HIPERTROFIA","RESISTENCIA","OTRO"];
  const inStyle={...ss.input,fontSize:"14px",padding:"10px 12px"};
  return <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:2000,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"20px",overflowY:"auto"}}>
    <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:"880px",background:"#111114",border:"1px solid #27272a",borderRadius:"14px",padding:"28px",margin:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"28px"}}>
        <h2 style={{margin:0,fontSize:"22px",fontWeight:700,letterSpacing:"-0.02em"}}>Nueva sesión</h2>
        <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
          <button onClick={()=>showToast("Función de importar disponible en versión Pro","warning")} style={{...ss.btn,background:"transparent",color:"#a1a1aa",border:"1px solid #3f3f46",fontSize:"12px",gap:"6px",display:"flex",alignItems:"center"}}>⬆ Subir Excel/PDF</button>
          <button onClick={onClose} style={{...ss.btn,background:"transparent",color:"#71717a",padding:"4px 10px",fontSize:"18px",lineHeight:1}}>✕</button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"16px",marginBottom:"16px"}}>
        <div><div style={ss.label}>Fecha</div><input type="date" value={fecha} onChange={e=>setFecha(e.target.value)} style={{...inStyle,colorScheme:"dark"}}/></div>
        <div><div style={ss.label}>Tipo</div>
          <select value={tipo} onChange={e=>setTipo(e.target.value)} style={inStyle}>
            {["Fuerza","Potencia","Hipertrofia","Resistencia","Técnica","Recuperación","Otro"].map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        <div><div style={ss.label}>Categoría</div>
          <select value={categoria} onChange={e=>setCategoria(e.target.value)} style={inStyle}>
            {categorias.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div style={{marginBottom:"24px"}}><div style={ss.label}>Título</div><input value={titulo} onChange={e=>setTitulo(e.target.value)} placeholder="Ej: Upper Body Push" style={inStyle}/></div>

      {bloques.map((b,bi)=>{
        const color=BLOQUE_COLORS[bi%BLOQUE_COLORS.length];
        return <div key={b.id} style={{marginBottom:"12px",border:"1px solid #27272a",borderRadius:"10px",overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 14px",background:"#0d0d10",borderBottom:"1px solid #27272a"}}>
            <span style={{color:"#3f3f46",fontSize:"14px",cursor:"grab"}}>⠿⠿</span>
            <span style={{background:color+"20",color,border:`1px solid ${color}44`,borderRadius:"6px",padding:"3px 10px",fontSize:"11px",fontWeight:700,letterSpacing:"0.06em",whiteSpace:"nowrap"}}>BLOQUE {b.letra}</span>
            <input value={b.nombre} onChange={e=>updBloque(b.id,{nombre:e.target.value})} style={{flex:1,background:"transparent",border:"none",outline:"none",color:"#fafafa",fontSize:"15px",fontWeight:500,fontFamily:"inherit"}}/>
            <button onClick={()=>dupBloque(b.id)} title="Duplicar" style={{...ss.btn,background:"transparent",color:"#52525b",padding:"4px 8px",fontSize:"15px"}}>⧉</button>
            <button onClick={()=>delBloque(b.id)} title="Eliminar" style={{...ss.btn,background:"transparent",color:"#52525b",padding:"4px 8px",fontSize:"13px"}}>🗑</button>
          </div>
          <div style={{display:"flex",gap:"0",padding:"0 14px",background:"#0d0d10",borderBottom:"1px solid #27272a"}}>
            {OBJETIVOS.map(obj=><button key={obj} onClick={()=>updBloque(b.id,{objetivo:obj})} style={{...ss.btn,padding:"8px 12px",fontSize:"11px",fontWeight:600,letterSpacing:"0.05em",background:b.objetivo===obj?"#fafafa":"transparent",color:b.objetivo===obj?"#09090b":"#52525b",borderRadius:"6px 6px 0 0",border:"none",transition:"all 0.1s"}}>{obj}</button>)}
          </div>
          <div style={{padding:"8px 14px 12px",background:"#09090b",overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:"680px"}}>
              <thead><tr style={{borderBottom:"1px solid #27272a"}}>
                {["PATRÓN","EJERCICIO","SERIES","REPETICIONES","","KG","RIR","RPE",""].map((h,i)=><th key={i} style={{textAlign:"left",color:"#52525b",padding:"6px 6px 8px",fontWeight:600,fontSize:"10px",letterSpacing:"0.07em",whiteSpace:"nowrap"}}>{h}</th>)}
              </tr></thead>
              <tbody>
                {b.filas.map(f=><tr key={f.id}>
                  <td style={{padding:"4px 4px"}}><div style={{display:"flex",alignItems:"center",gap:"6px"}}><span style={{color:"#3f3f46",cursor:"grab",fontSize:"12px"}}>⠿</span><input value={f.patron} onChange={e=>updFila(b.id,f.id,{patron:e.target.value})} placeholder="Patrón..." style={{...ss.input,width:"110px",fontSize:"12px",padding:"6px 8px"}}/></div></td>
                  <td style={{padding:"4px 4px"}}><select value={f.ejercicio} onChange={e=>updFila(b.id,f.id,{ejercicio:e.target.value})} style={{...ss.input,width:"180px",fontSize:"12px",padding:"6px 8px"}}><option value="">Ejercicio...</option>{EJERCICIOS_LISTA.map(e=><option key={e}>{e}</option>)}</select></td>
                  <td style={{padding:"4px 4px"}}><input type="number" value={f.series} onChange={e=>updFila(b.id,f.id,{series:Number(e.target.value)})} style={{...ss.input,width:"52px",fontSize:"13px",padding:"6px 8px",textAlign:"center"}}/></td>
                  <td style={{padding:"4px 4px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"3px"}}>
                      {[{icon:"🏋️",v:"reps"},{icon:"⏱",v:"time"},{icon:"🔗",v:"link"}].map(t=><button key={t.v} onClick={()=>updFila(b.id,f.id,{tipoRep:t.v})} style={{...ss.btn,padding:"4px 6px",fontSize:"11px",background:f.tipoRep===t.v?"#27272a":"transparent",color:f.tipoRep===t.v?"#fafafa":"#52525b",border:`1px solid ${f.tipoRep===t.v?"#3f3f46":"transparent"}`,borderRadius:"6px"}}>{t.icon}</button>)}
                      <input type="number" value={f.reps} onChange={e=>updFila(b.id,f.id,{reps:Number(e.target.value)})} style={{...ss.input,width:"48px",fontSize:"13px",padding:"6px 8px",textAlign:"center",marginLeft:"4px"}}/>
                    </div>
                  </td>
                  <td style={{padding:"4px 6px",color:"#52525b",fontSize:"13px"}}>×</td>
                  <td style={{padding:"4px 4px"}}><input value={f.kg} onChange={e=>updFila(b.id,f.id,{kg:e.target.value})} placeholder="kg" style={{...ss.input,width:"56px",fontSize:"12px",padding:"6px 8px",textAlign:"center"}}/></td>
                  <td style={{padding:"4px 4px"}}><input value={f.rir} onChange={e=>updFila(b.id,f.id,{rir:e.target.value})} placeholder="—" style={{...ss.input,width:"48px",fontSize:"12px",padding:"6px 8px",textAlign:"center"}}/></td>
                  <td style={{padding:"4px 4px"}}><input value={f.rpe} onChange={e=>updFila(b.id,f.id,{rpe:e.target.value})} placeholder="—" style={{...ss.input,width:"48px",fontSize:"12px",padding:"6px 8px",textAlign:"center"}}/></td>
                  <td style={{padding:"4px 4px"}}><button onClick={()=>delFila(b.id,f.id)} style={{...ss.btn,background:"transparent",color:"#52525b",padding:"4px 6px",fontSize:"12px"}}>✕</button></td>
                </tr>)}
              </tbody>
            </table>
            <button onClick={()=>addFila(b.id)} style={{...ss.btn,background:"transparent",color:"#a1a1aa",border:"none",fontSize:"13px",marginTop:"8px",padding:"4px 2px"}}>+ Añadir fila</button>
          </div>
        </div>;
      })}

      <button onClick={addBloque} style={{...ss.btn,width:"100%",background:"transparent",color:"#71717a",border:"1px dashed #3f3f46",padding:"14px",fontSize:"13px",marginBottom:"24px",borderRadius:"10px",transition:"all 0.15s"}}>+ Nuevo bloque</button>
      <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}>
        <button onClick={onClose} style={{...ss.btn,background:"transparent",color:"#a1a1aa",border:"1px solid #3f3f46"}}>Cancelar</button>
        <button onClick={save} className="btn-hover" style={{...ss.btn,background:"#fafafa",color:"#09090b",fontWeight:600}}>Guardar sesión</button>
      </div>
    </div>
  </div>;
}

function PadreView({showToast,setWearablesOpen,injuryReports,updateInjuryReport}) {
  const [riskExpanded,setRiskExpanded]=useState(false);
  const [device,setDevice]=useState("appleWatch");
  const player=PLAYERS_RUGBY[0];
  const club=CLUBS.rugby;
  const CATS_MENORES=["M6","M8","M10","M12","M14","M16","M18"];
  const puedeVerLesiones=CATS_MENORES.includes(player.cat);
  const misReps=(injuryReports||[]).filter(r=>r.player===player.name);
  const w=WEARABLES_ANDRES[device];
  return <div>
    <div style={{...ss.card,marginBottom:"20px",background:"linear-gradient(135deg,rgba(59,130,246,0.13),rgba(168,85,247,0.07))",border:"1px solid rgba(59,130,246,0.2)",padding:"22px"}}>
      <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
        <div style={{width:"64px",height:"64px",borderRadius:"50%",background:"rgba(59,130,246,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"30px",border:"3px solid rgba(59,130,246,0.5)"}}>👕</div>
        <div style={{flex:1}}>
          <div style={{...ss.muted,fontSize:"11px",marginBottom:"2px",textTransform:"uppercase",letterSpacing:"0.05em"}}>Mi hijo</div>
          <h1 style={{margin:0,fontSize:"24px",fontWeight:800}}>{player.name} 🏉</h1>
          <div style={{color:"#8896B0",fontSize:"13px",marginTop:"3px"}}>Número {player.num} · {player.pos} · {club.name} · Superior</div>
        </div>
        <Badge color="#3B82F6" size="lg">👨 Conectado hace 2 sem</Badge>
      </div>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px",marginBottom:"20px"}}>
      <div style={{...ss.card,border:"1px solid rgba(34,197,94,0.27)"}}>
        <div style={ss.label}>Estado médico</div>
        <div style={{display:"flex",alignItems:"center",gap:"10px",marginTop:"6px"}}>
          <Semaforo status={player.med}/>
          <span style={{fontSize:"18px",fontWeight:700,color:"#22C55E"}}>APTO</span>
        </div>
        <div style={{...ss.muted,marginTop:"6px",fontSize:"11px"}}>Última revisión hace 5 días</div>
      </div>
      <div style={{...ss.card,border:"1px solid rgba(59,130,246,0.27)"}}>
        <div style={ss.label}>Próximo partido</div>
        <div style={{fontSize:"16px",fontWeight:700,marginTop:"4px"}}>vs {club.next.rival}</div>
        <div style={{...ss.muted,marginTop:"4px",fontSize:"11px"}}>{club.next.dia} · 15:30</div>
      </div>
      <div onClick={()=>setRiskExpanded(!riskExpanded)} style={{...ss.card,border:"2px solid rgba(239,68,68,0.4)",background:"rgba(239,68,68,0.07)",cursor:"pointer",boxShadow:"0 0 24px rgba(239,68,68,0.13)"}}>
        <div style={ss.label}>Riesgo de lesión</div>
        <div style={{display:"flex",alignItems:"center",gap:"10px",marginTop:"4px"}}>
          <span style={{fontSize:"18px",fontWeight:800,color:"#EF4444"}}>🔴 ALTO</span>
          <span style={{color:"#8896B0",fontSize:"11px",marginLeft:"auto"}}>{riskExpanded?"▲":"▼"}</span>
        </div>
        <div style={{...ss.muted,marginTop:"4px",fontSize:"11px"}}>HRV en caída + sueño bajo</div>
      </div>
    </div>

    {riskExpanded&&<div style={{...ss.card,marginBottom:"20px",border:"1px solid rgba(239,68,68,0.27)",background:"rgba(239,68,68,0.05)"}}>
      <div style={{fontWeight:700,color:"#EF4444",marginBottom:"10px",fontSize:"14px"}}>¿Por qué riesgo alto?</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"12px",fontSize:"12px"}}>
        <div><div style={ss.label}>HRV (variabilidad)</div><div>Cayó de 52 a 38 ms en 4 semanas. Indicador de fatiga del sistema nervioso.</div></div>
        <div><div style={ss.label}>Sueño</div><div>Promedio 6.6 hrs en última semana (debería 8). Recuperación insuficiente.</div></div>
        <div><div style={ss.label}>Carga acumulada</div><div>Volumen de entrenamiento aumentó 15% mientras la recuperación bajó.</div></div>
      </div>
      <div style={{marginTop:"12px",padding:"10px 14px",background:"rgba(239,68,68,0.13)",borderRadius:"8px",fontSize:"12px",color:"#EF4444",fontWeight:600}}>El preparador físico ya recibió la alerta y ajustará el plan de {player.name.split(" ")[0]} esta semana.</div>
    </div>}

    <div style={{...ss.card,marginBottom:"20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
        <div><div style={{fontWeight:600,fontSize:"14px"}}>1RM Sentadilla — últimas 8 semanas</div><div style={{...ss.muted,fontSize:"11px",marginTop:"2px"}}>Progresión de {player.name.split(" ")[0]} vs promedio del equipo</div></div>
        <Badge color="#A855F7">🏆 +8 kg este mes</Badge>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={PROGRESSION_1RM}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
          <XAxis dataKey="week" stroke="#8896B0" fontSize={11}/>
          <YAxis stroke="#8896B0" fontSize={11} domain={[120,150]}/>
          <Tooltip contentStyle={{background:"#101829",border:"1px solid rgba(255,255,255,0.07)",color:"#E8EDF5",fontSize:12,borderRadius:8}}/>
          <Line type="monotone" dataKey="equipo" stroke="#8896B0" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Promedio equipo"/>
          <Line type="monotone" dataKey="mio" stroke="#3B82F6" strokeWidth={2.5} dot={{fill:"#3B82F6",r:4}} activeDot={{r:6,fill:"#A855F7"}} name={player.name.split(" ")[0]}/>
        </LineChart>
      </ResponsiveContainer>
    </div>

    <div style={{...ss.card,marginBottom:"20px"}}>
      <div style={{display:"flex",alignItems:"center",gap:"24px"}}>
        <div style={{position:"relative",width:"110px",height:"110px",flexShrink:0}}>
          <svg viewBox="0 0 36 36" width="110" height="110">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3"/>
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22C55E" strokeWidth="3" strokeDasharray="96 100" strokeDashoffset="0" transform="rotate(-90 18 18)" strokeLinecap="round"/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
            <div style={{fontSize:"22px",fontWeight:800,color:"#22C55E"}}>96%</div>
            <div style={{fontSize:"10px",color:"#8896B0"}}>22/23</div>
          </div>
        </div>
        <div style={{flex:1}}>
          <div style={{fontWeight:600,fontSize:"14px",marginBottom:"4px"}}>Asistencia a entrenamientos</div>
          <div style={{...ss.muted,fontSize:"12px",marginBottom:"10px"}}>Últimos 10 entrenamientos</div>
          <div style={{display:"flex",gap:"6px"}}>
            {ATTENDANCE_10.map((p,i)=><div key={i} style={{width:"24px",height:"24px",borderRadius:"5px",background:p?"rgba(34,197,94,0.2)":"rgba(255,255,255,0.05)",border:`1px solid ${p?"rgba(34,197,94,0.4)":"rgba(255,255,255,0.1)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px"}}>{p?"✅":"⏳"}</div>)}
          </div>
        </div>
      </div>
    </div>

    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
      <div style={{fontWeight:600,fontSize:"14px"}}>📊 Salud y recuperación</div>
      <select value={device} onChange={e=>setDevice(e.target.value)} style={{...ss.input,width:"160px",fontSize:"12px"}}>
        <option value="appleWatch">🍎 Apple Watch</option>
        <option value="ouraRing">⭕ Oura Ring</option>
        <option value="strava">🚴 Strava</option>
      </select>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px",marginBottom:"20px"}}>
      <div style={{...ss.card,border:"1px solid rgba(245,158,11,0.2)"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:"8px"}}><span style={{fontSize:"12px",fontWeight:600}}>😴 Sueño</span><Badge color="#F59E0B">↓ Degrading</Badge></div>
        <div style={{fontSize:"24px",fontWeight:800}}>{WEARABLES_ANDRES.ouraRing.sleepDuration} hrs</div>
        <Sparkline data={SLEEP_WEEK.map(s=>s.hrs)} color="#F59E0B" width={180} height={30}/>
        <div style={{...ss.muted,fontSize:"10px",marginTop:"6px"}}>Trend: 7.4 → 6.0 · Recomendación: dormir más</div>
      </div>
      <div style={{...ss.card,border:"1px solid rgba(239,68,68,0.27)",background:"rgba(239,68,68,0.03)"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:"8px"}}><span style={{fontSize:"12px",fontWeight:600}}>💗 HRV</span><Badge color="#EF4444">⚠️ EN CAÍDA</Badge></div>
        <div style={{fontSize:"24px",fontWeight:800,color:"#EF4444"}}>{WEARABLES_ANDRES.ouraRing.hrv} ms</div>
        <Sparkline data={HRV_10DAYS} color="#EF4444" width={180} height={30}/>
        <div style={{...ss.muted,fontSize:"10px",marginTop:"6px"}}>52 → 38 · Fatiga acumulada</div>
      </div>
      <div style={{...ss.card,border:"1px solid rgba(245,158,11,0.2)"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:"8px"}}><span style={{fontSize:"12px",fontWeight:600}}>💓 HR Reposo</span><Badge color="#F59E0B">+2 baseline</Badge></div>
        <div style={{fontSize:"24px",fontWeight:800}}>{WEARABLES_ANDRES.appleWatch.heartRateRest} bpm</div>
        <Sparkline data={[56,56,57,57,58,58,58]} color="#F59E0B" width={180} height={30}/>
        <div style={{...ss.muted,fontSize:"10px",marginTop:"6px"}}>Recuperación lenta · monitoreo 3 días</div>
      </div>
    </div>

    <div style={{...ss.card,marginBottom:"20px",borderLeft:"3px solid #3B82F6"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
        <div style={{fontWeight:600,fontSize:"13px"}}>{device==="appleWatch"?"🍎 Apple Watch":device==="ouraRing"?"⭕ Oura Ring":"🚴 Strava"} · Detalles</div>
        <span style={{...ss.muted,fontSize:"11px"}}>Sincronizado {w.lastSync}</span>
      </div>
      {device==="appleWatch"&&<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px",fontSize:"12px"}}>
        <div><div style={ss.label}>VO2 Max</div><div style={{fontSize:"18px",fontWeight:700}}>{w.vo2Max}</div></div>
        <div><div style={ss.label}>Cardio Load</div><div style={{fontSize:"18px",fontWeight:700}}>{w.cardioLoad}/10</div></div>
        <div><div style={ss.label}>HR Recovery</div><div style={{fontSize:"18px",fontWeight:700,color:"#EF4444"}}>{w.heartRateRecovery} bpm</div></div>
        <div><div style={ss.label}>Calorías</div><div style={{fontSize:"18px",fontWeight:700}}>{w.activeCalories}</div></div>
      </div>}
      {device==="ouraRing"&&<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px",fontSize:"12px"}}>
        <div><div style={ss.label}>Sleep Score</div><div style={{fontSize:"18px",fontWeight:700,color:"#F59E0B"}}>{w.sleepScore}/100</div></div>
        <div><div style={ss.label}>Readiness</div><div style={{fontSize:"18px",fontWeight:700,color:"#F59E0B"}}>{w.readinessScore}/100</div></div>
        <div><div style={ss.label}>REM</div><div style={{fontSize:"18px",fontWeight:700}}>{w.sleepStages.rem}%</div></div>
        <div><div style={ss.label}>Deep</div><div style={{fontSize:"18px",fontWeight:700}}>{w.sleepStages.deep}%</div></div>
      </div>}
      {device==="strava"&&<div>
        {w.weeklyActivities.map((a,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<w.weeklyActivities.length-1?"1px solid rgba(255,255,255,0.05)":"none",fontSize:"13px"}}>
          <span>{a.day} · {a.type}</span><span style={{color:"#8896B0"}}>{a.duration} min · {a.calories} kcal</span>
        </div>)}
      </div>}
    </div>

    <div style={{...ss.card,marginBottom:"20px",border:"2px solid rgba(34,197,94,0.33)",background:"rgba(34,197,94,0.04)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"12px"}}>
        <div>
          <Badge color="#22C55E">🏉 CONVOCADO — Titular</Badge>
          <div style={{fontSize:"18px",fontWeight:700,marginTop:"8px"}}>vs {club.next.rival}</div>
          <div style={{color:"#8896B0",fontSize:"13px",marginTop:"4px"}}>📅 {club.next.dia} · ⏰ 15:30 · 📍 Estadio El Bosque</div>
          <div style={{marginTop:"8px"}}><Badge color="#3B82F6">Número {player.num} · {player.pos}</Badge></div>
        </div>
        <button onClick={()=>{navigator.clipboard.writeText(`✅ ${player.name} convocado vs ${club.next.rival}\n📅 ${club.next.dia} 15:30\n📍 Estadio El Bosque\nNúmero ${player.num} — Titular`).catch(()=>{});showToast("📋 Mensaje copiado al portapapeles","success");}} className="btn-hover" style={{...ss.btn,background:"#25D366",color:"#fff"}}>📱 Compartir en WhatsApp</button>
      </div>
    </div>

    <div style={{...ss.card,marginBottom:"20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"12px"}}>
      <div>
        <div style={{fontWeight:600,fontSize:"13px",marginBottom:"4px"}}>💳 Cuota mensual</div>
        <div style={{color:"#22C55E",fontSize:"14px"}}>🟢 Pagada el 5 de Mayo · $45.000 CLP</div>
        <div style={{...ss.muted,fontSize:"11px",marginTop:"4px"}}>Próximo vencimiento: 15 Junio (32 días)</div>
      </div>
      <button onClick={()=>showToast("📄 Boleta descargada con QR de pago","success")} className="btn-hover" style={{...ss.btn,background:"#3B82F6",color:"#fff"}}>📄 Descargar boleta + QR</button>
    </div>

    <div style={{...ss.card,marginBottom:"20px"}}>
      <div style={{fontWeight:600,fontSize:"13px",marginBottom:"14px"}}>🔔 Alertas del preparador físico</div>
      {PARENT_ALERTS.map((a,i)=><div key={i} style={{display:"flex",gap:"12px",padding:"10px 0",borderBottom:i<PARENT_ALERTS.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
        <span style={{fontSize:"20px",lineHeight:1}}>{a.icon}</span>
        <div style={{flex:1}}>
          <div style={{fontSize:"13px",color:a.color,fontWeight:500,lineHeight:1.4}}>{a.text}</div>
          <div style={{...ss.muted,fontSize:"10px",marginTop:"4px"}}>{a.time}</div>
        </div>
      </div>)}
    </div>

    <div style={{...ss.card,marginBottom:"20px"}}>
      <div style={{fontWeight:600,fontSize:"13px",marginBottom:"10px"}}>🩺 Historial de lesiones · {player.name.split(" ")[0]}</div>
      {!puedeVerLesiones&&<div style={{display:"flex",alignItems:"center",gap:"12px",padding:"10px 12px",background:"rgba(255,255,255,0.04)",borderRadius:"8px"}}>
        <span style={{fontSize:"22px"}}>🔒</span>
        <div>
          <div style={{fontSize:"12px",fontWeight:500}}>Disponible solo para categorías hasta M18</div>
          <div style={{...ss.muted,fontSize:"11px",marginTop:"2px"}}>{player.name} está en categoría <strong>{player.cat}</strong>. El historial médico de jugadores adultos es privado.</div>
        </div>
      </div>}
      {puedeVerLesiones&&misReps.length===0&&<div style={{...ss.muted,fontSize:"12px"}}>Sin lesiones reportadas.</div>}
      {puedeVerLesiones&&misReps.map((rep,i)=>{
        const c=rep.severity==="rojo"?"#EF4444":"#F59E0B";
        const sevClasif=severidadClasificacion(rep.clasificacionMedica);
        return <div key={rep.id} style={{borderLeft:`3px solid ${c}`,paddingLeft:"12px",marginBottom:"12px",paddingBottom:i<misReps.length-1?"12px":"0",borderBottom:i<misReps.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
          <div style={{display:"flex",gap:"8px",alignItems:"center",marginBottom:"4px",flexWrap:"wrap"}}>
            <Badge color={c}>{rep.tipo}</Badge>
            <span style={{...ss.muted,fontSize:"11px"}}>{rep.fecha}</span>
            <span style={{marginLeft:"auto"}}>{rep.acusadoRecibo?<Badge color="#22C55E">✅ Recibido</Badge>:<Badge color="#8896B0">⏳ Pendiente</Badge>}</span>
          </div>
          <div style={{fontSize:"12px",color:"#C8D3E0",marginBottom:"6px"}}>{rep.diagnostico}</div>
          {(rep.clasificacionMedica||rep.fechaVuelta)&&<div style={{background:"rgba(255,255,255,0.04)",borderRadius:"6px",padding:"8px 10px"}}>
            <div style={{...ss.label,marginBottom:"5px"}}>Respuesta del equipo médico</div>
            {rep.clasificacionMedica&&<div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"3px"}}>
              {sevClasif&&<Semaforo status={sevClasif}/>}
              <span style={{fontSize:"11px"}}>{rep.clasificacionMedica}</span>
            </div>}
            {rep.fechaVuelta&&<div style={{fontSize:"11px",color:"#22C55E",fontWeight:600}}>🏃 Vuelta estimada: {new Date(rep.fechaVuelta+"T12:00:00").toLocaleDateString("es-CL")}</div>}
          </div>}
        </div>;
      })}
    </div>

    <button onClick={()=>setWearablesOpen(true)} className="btn-hover" style={{...ss.btn,background:"linear-gradient(135deg,#3B82F6,#A855F7)",color:"#fff",padding:"12px 24px",fontSize:"14px",fontWeight:600,width:"100%"}}>🍎 Conectar Apple Watch / Oura Ring / Strava</button>
  </div>;
}

function LesionesView({sportColor,showToast}) {
  const [selPlayer,setSelPlayer]=useState(INJURY_RISK_TEAM[0]);
  const [dropPlayer,setDropPlayer]=useState(1);
  const [planModal,setPlanModal]=useState(false);
  const sel=INJURY_RISK_TEAM.find(p=>p.id===dropPlayer)||INJURY_RISK_TEAM[0];
  const highRisk=INJURY_RISK_TEAM.filter(p=>p.riskLevel==="HIGH");
  const playerVsTeam=PROGRESSION_1RM.map(d=>({...d,mio:d.mio-(dropPlayer-1)*2}));
  return <div>
    <SectionTitle title="Análisis de Lesiones" sub={`Toros RC · Equipo Superior · ${INJURY_RISK_TEAM.length} jugadores`}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px",marginBottom:"24px"}}>
      <Stat label="Cumplimiento" value="87%" sub="↑ +3% vs sem pasada" color="#22C55E"/>
      <Stat label="En riesgo" value={`🔴 ${highRisk.length}`} sub="Click para ver lista" color="#EF4444"/>
      <Stat label="Récords PR" value="🏆 7" sub="Esta semana" color="#A855F7"/>
      <Stat label="Volumen total" value="2.847 t" sub="Meta: 3.000 t" color="#3B82F6"/>
    </div>

    <div style={{...ss.card,marginBottom:"24px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
        <div><div style={{fontWeight:700,fontSize:"15px"}}>🩺 Tabla de Riesgo de Lesión</div><div style={{...ss.muted,fontSize:"11px",marginTop:"2px"}}>Predicción basada en HRV, sueño y carga · Click en fila roja para detalles</div></div>
        <Badge color="#A855F7">🤖 Modelo IA · 82% conf.</Badge>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",fontSize:"12px",borderCollapse:"collapse"}}>
          <thead><tr>{["Jugador","Pos","Riesgo","HRV","Sueño","Cardio","Volumen","Tend.","Recomendación"].map(h=><th key={h} style={{textAlign:"left",color:"#8896B0",padding:"8px 6px",fontWeight:500,borderBottom:"1px solid rgba(255,255,255,0.07)",fontSize:"10px",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>{INJURY_RISK_TEAM.map(p=>{
            const isHigh=p.riskLevel==="HIGH",isSel=selPlayer.id===p.id;
            return <tr key={p.id} onClick={()=>isHigh&&setSelPlayer(p)} className="drag-row" style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:isSel&&isHigh?"rgba(239,68,68,0.08)":"transparent",cursor:isHigh?"pointer":"default",transition:"background 0.15s"}}>
              <td style={{padding:"8px 6px",fontWeight:500}}>{p.name}</td>
              <td style={{color:"#8896B0"}}>{p.pos}</td>
              <td><RiskBadge level={p.riskLevel}/></td>
              <td>{p.hrv} <span style={{color:p.hrvTrend.includes("↓")?"#EF4444":p.hrvTrend.includes("↑")?"#22C55E":"#8896B0",fontSize:"10px"}}>{p.hrvTrend}</span></td>
              <td>{p.sleep}h</td>
              <td>{p.cardioLoad}/10</td>
              <td>{p.volume.toLocaleString()} kg</td>
              <td style={{color:p.trend.includes("↑")?(p.riskLevel==="HIGH"?"#EF4444":"#F59E0B"):"#22C55E",fontSize:"11px"}}>{p.trend}</td>
              <td style={{color:isHigh?"#EF4444":p.riskLevel==="MEDIUM"?"#F59E0B":"#8896B0",fontSize:"11px",fontWeight:isHigh?600:400}}>{p.rec}</td>
            </tr>;
          })}</tbody>
        </table>
      </div>
    </div>

    {selPlayer.riskLevel==="HIGH"&&<div style={{...ss.card,marginBottom:"24px",border:"2px solid rgba(239,68,68,0.4)",background:"rgba(239,68,68,0.03)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"16px",flexWrap:"wrap",gap:"10px"}}>
        <div><div style={{fontWeight:700,fontSize:"15px"}}>Análisis Detallado — {selPlayer.name}</div><div style={{...ss.muted,fontSize:"12px",marginTop:"2px"}}>{selPlayer.pos} · #{selPlayer.num}</div></div>
        <RiskBadge level={selPlayer.riskLevel}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"16px"}}>
        <div style={{background:"#070C18",borderRadius:"8px",padding:"12px"}}>
          <div style={{fontSize:"11px",fontWeight:600,marginBottom:"6px",color:"#EF4444"}}>💗 HRV — Últimos 10 días</div>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={HRV_10DAYS.map((v,i)=>({d:i+1,hrv:v}))}>
              <Area type="monotone" dataKey="hrv" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} strokeWidth={2}/>
              <YAxis hide domain={[35,55]}/>
              <Tooltip contentStyle={{background:"#101829",border:"none",fontSize:11,borderRadius:6}}/>
            </AreaChart>
          </ResponsiveContainer>
          <div style={{fontSize:"10px",color:"#8896B0",marginTop:"4px"}}>⚠️ Caída del 27% en 4 semanas · Fatiga del SNC</div>
        </div>
        <div style={{background:"#070C18",borderRadius:"8px",padding:"12px"}}>
          <div style={{fontSize:"11px",fontWeight:600,marginBottom:"6px",color:"#F59E0B"}}>😴 Sueño — Últimas 7 noches</div>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={SLEEP_WEEK}>
              <Bar dataKey="hrs" radius={[3,3,0,0]}>{SLEEP_WEEK.map((s,i)=><Cell key={i} fill={s.hrs<7?"#EF4444":"#3B82F6"}/>)}</Bar>
              <XAxis dataKey="day" stroke="#8896B0" fontSize={10} tickLine={false} axisLine={false}/>
              <YAxis hide domain={[0,9]}/>
              <ReferenceLine y={8} stroke="#22C55E" strokeDasharray="3 3"/>
              <Tooltip contentStyle={{background:"#101829",border:"none",fontSize:11,borderRadius:6}}/>
            </BarChart>
          </ResponsiveContainer>
          <div style={{fontSize:"10px",color:"#8896B0",marginTop:"4px"}}>Promedio 6.6h · Falta 1.4h vs objetivo (8h)</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"16px"}}>
        <Stat label="Cardio Load" value={`${selPlayer.cardioLoad}/10`} sub="Alto · acumulado 7d" color="#EF4444"/>
        <Stat label="HR Recovery" value="-14 bpm" sub="vs baseline -28 bpm" color="#EF4444"/>
      </div>
      <div style={{padding:"14px 18px",background:"rgba(239,68,68,0.1)",borderRadius:"10px",border:"1px solid rgba(239,68,68,0.27)",marginBottom:"12px"}}>
        <div style={{fontWeight:700,color:"#EF4444",fontSize:"13px",marginBottom:"8px"}}>🔴 Recomendación · Confianza 82%</div>
        <ul style={{margin:0,paddingLeft:"18px",fontSize:"12px",lineHeight:1.7}}>
          <li>Reduce la intensidad <strong>30%</strong> en la sesión de hoy</li>
          <li>Considera descanso completo mañana</li>
          <li>Monitorea HRV los próximos 3 días</li>
          <li>Aumenta horas de sueño (apunta a 8 hrs)</li>
        </ul>
      </div>
      <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
        <button onClick={()=>showToast("📱 Notificación enviada a "+selPlayer.name+" vía push + WhatsApp","success")} className="btn-hover" style={{...ss.btn,background:"#3B82F6",color:"#fff"}}>📱 Notificar al jugador</button>
        <button onClick={()=>showToast("👨 Mensaje enviado al papá de "+selPlayer.name,"success")} className="btn-hover" style={{...ss.btn,background:"#A855F7",color:"#fff"}}>👨 Notificar al papá</button>
      </div>
    </div>}

    <div style={{...ss.card,marginBottom:"24px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px",flexWrap:"wrap",gap:"10px"}}>
        <div><div style={{fontWeight:700,fontSize:"14px"}}>Progresión individual vs promedio equipo</div><div style={{...ss.muted,fontSize:"11px",marginTop:"2px"}}>1RM Sentadilla · últimas 8 semanas</div></div>
        <select value={dropPlayer} onChange={e=>setDropPlayer(Number(e.target.value))} style={{...ss.input,width:"200px"}}>
          {INJURY_RISK_TEAM.slice(0,10).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={playerVsTeam}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
          <XAxis dataKey="week" stroke="#8896B0" fontSize={11}/>
          <YAxis stroke="#8896B0" fontSize={11}/>
          <Tooltip contentStyle={{background:"#101829",border:"1px solid rgba(255,255,255,0.07)",color:"#E8EDF5",fontSize:12,borderRadius:8}}/>
          <Line type="monotone" dataKey="equipo" stroke="#8896B0" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Promedio equipo"/>
          <Line type="monotone" dataKey="mio" stroke="#3B82F6" strokeWidth={2.5} dot={{fill:"#3B82F6",r:4}} name={sel.name}/>
        </LineChart>
      </ResponsiveContainer>
      <div style={{...ss.muted,fontSize:"11px",marginTop:"8px"}}>📈 {sel.name} está {playerVsTeam[playerVsTeam.length-1].mio-playerVsTeam[playerVsTeam.length-1].equipo} kg por encima del promedio</div>
    </div>

    <div style={{...ss.card,marginBottom:"24px"}}>
      <div style={{fontWeight:700,fontSize:"14px",marginBottom:"4px"}}>🔥 Heatmap de riesgo por posición</div>
      <div style={{...ss.muted,fontSize:"11px",marginBottom:"14px"}}>Distribución de carga y vulnerabilidad por puesto</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"6px"}}>
        {POSITIONS_HEATMAP.map(p=>{const c=p.risk==="green"?"#22C55E":p.risk==="yellow"?"#F59E0B":"#EF4444";return <div key={p.n} style={{background:c+"22",border:`1px solid ${c}55`,borderRadius:"6px",padding:"8px 6px",textAlign:"center",fontSize:"10px"}}>
          <div style={{color:c,fontWeight:700,fontSize:"11px"}}>#{p.n}</div>
          <div style={{color:"#E8EDF5",marginTop:"2px"}}>{p.label}</div>
        </div>;})}
      </div>
      <div style={{marginTop:"12px",padding:"10px 14px",background:"rgba(59,130,246,0.08)",borderRadius:"8px",fontSize:"12px",color:"#3B82F6"}}>💡 60% de las lesiones en tu equipo son extremidades inferiores. Aumenta trabajo de caderas y aductores en el plan.</div>
    </div>

    <button onClick={()=>setPlanModal(true)} className="btn-hover" style={{...ss.btn,background:"linear-gradient(135deg,#A855F7,#3B82F6)",color:"#fff",width:"100%",padding:"14px",fontSize:"14px",fontWeight:600,marginBottom:"16px"}}>🤖 Generar Plan Automático para la próxima semana</button>
    {planModal&&<PlanModal onClose={()=>setPlanModal(false)} onAccept={()=>{setPlanModal(false);showToast("✅ Plan publicado. 15 jugadores notificados","success");}}/>}
  </div>;
}

function OnboardingScreen({onSelect}) {
  const [selSport,setSelSport]=useState(null);
  const [selCountry,setSelCountry]=useState("CL");
  return <div style={{minHeight:"100vh",background:"#09090b",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",fontFamily:"'Inter',system-ui,sans-serif"}}>
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

function EntrenadorView({module,sport,sp,club,players,postLikes,setPostLikes,showToast,sportColor,currentCategory,hiaModal,setHiaModal,injuryReports,addInjuryReport,updateInjuryReport,wellnessLogs}) {
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
  if(module==="equipomedico") return <EquipoMedicoView players={players} showToast={showToast} sportColor={sportColor} injuryReports={injuryReports} addInjuryReport={addInjuryReport} updateInjuryReport={updateInjuryReport} wellnessLogs={wellnessLogs}/>;
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

function PreparadorView({module,sp,showToast,sportColor,publishedPlan,setPublishedPlan,newExForm,setNewExForm,newEx,setNewEx,gymPlanExercises,setGymPlanExercises,rankTab,setRankTab,expandedDay,setExpandedDay,sesionesCreadas,addSesion}) {
  const [nuevaSesionOpen,setNuevaSesionOpen]=useState(false);
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
    {nuevaSesionOpen&&<NuevaSesionModal onClose={()=>setNuevaSesionOpen(false)} showToast={showToast} addSesion={addSesion} categorias={["M18","M16","M14","M12","Senior"]}/>}
    <SectionTitle title={`Microciclo — Semana ${GYM_PLAN.week}`} sub={`${GYM_PLAN.coach} · ${sp.name}`} action={<div style={{display:"flex",gap:"8px"}}>
      <button onClick={()=>setNuevaSesionOpen(true)} className="btn-hover" style={{...ss.btn,background:"#fafafa",color:"#09090b",fontWeight:600,fontSize:"12px"}}>+ Nueva sesión</button>
      <button onClick={()=>{setPublishedPlan(true);showToast("Plan publicado. 15 jugadores notificados vía push y WhatsApp 📱");}} className="btn-hover" style={{...ss.btn,background:publishedPlan?"#22C55E22":"#22C55E",color:publishedPlan?"#22C55E":"#fff",border:publishedPlan?"1px solid #22C55E":"none",fontSize:"12px"}}>{publishedPlan?"✅ Plan publicado":"📢 Publicar plan"}</button>
    </div>}/>
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
  if(module==="lesiones") return <LesionesView sportColor={sportColor} showToast={showToast}/>;
  return null;
}

function JugadorView({module,sport,sp,club,player,players,sportColor,countryData,convocado,setConvocado,setWhatsappModal,showToast,gymLog,setGymLog,completedSession,setCompletedSession,newRecord,setNewRecord,expandedEx,setExpandedEx,rankTab,setRankTab,injuryReports,addInjuryReport,updateInjuryReport,addWellnessLog,sesionesCreadas}) {
  const camiseta = player.num;
  const isNominated = true;
  const [showLesionForm,setShowLesionForm]=useState(false);
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
    <div style={{...ss.card,marginTop:"16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div>
        <div style={{fontWeight:600,fontSize:"13px",marginBottom:"4px"}}>🩺 Mis lesiones</div>
        {injuryReports.filter(r=>r.player===player.name).length>0
          ?<div style={{...ss.muted,fontSize:"11px"}}>
              {injuryReports.filter(r=>r.player===player.name).length} reporte(s) · última: {injuryReports.filter(r=>r.player===player.name)[0].tipo} · {injuryReports.filter(r=>r.player===player.name)[0].fecha}
            </div>
          :<div style={{...ss.muted,fontSize:"11px"}}>Sin lesiones reportadas</div>}
      </div>
      <Badge color={injuryReports.filter(r=>r.player===player.name).length>0?sportColor:"#4A5568"}>{injuryReports.filter(r=>r.player===player.name).length} reportes</Badge>
    </div>
  </div>;
  if(module==="migym") return <GymJugador player={player} sportColor={sportColor} gymLog={gymLog} setGymLog={setGymLog} completedSession={completedSession} setCompletedSession={setCompletedSession} newRecord={newRecord} setNewRecord={setNewRecord} expandedEx={expandedEx} setExpandedEx={setExpandedEx} showToast={showToast} rankTab={rankTab} setRankTab={setRankTab} players={players} addWellnessLog={addWellnessLog} sesionesCreadas={sesionesCreadas}/>;
  if(module==="micuota"){
    const historial=[
      {mes:"Mayo 2026",monto:club.cuota,estado:"pagado",fecha:"05-05-2026",metodo:countryData.payments[0]},
      {mes:"Abril 2026",monto:club.cuota,estado:"pagado",fecha:"03-04-2026",metodo:countryData.payments[0]},
      {mes:"Marzo 2026",monto:club.cuota,estado:"pagado",fecha:"07-03-2026",metodo:countryData.payments[1]||countryData.payments[0]},
      {mes:"Febrero 2026",monto:club.cuota,estado:"pagado",fecha:"04-02-2026",metodo:countryData.payments[0]},
      {mes:"Enero 2026",monto:club.cuota,estado:"pagado",fecha:"06-01-2026",metodo:countryData.payments[0]},
    ];
    return <div>
      <SectionTitle title="Mi Cuota" sub={`${club.name} · ${countryData.flag} ${countryData.name}`}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px",marginBottom:"20px"}}>
        <Stat label="Cuota mensual" value={`${countryData.symbol}${club.cuota.toLocaleString()}`} sub={countryData.currency} color={sportColor}/>
        <Stat label="Estado" value="🟢 Al día" sub="Mayo 2026 pagado" color="#22C55E"/>
        <Stat label="Próximo vencimiento" value="15 Jun" sub="En 32 días" color="#F59E0B"/>
      </div>
      <div style={{...ss.card,marginBottom:"20px",border:"1px solid rgba(34,197,94,0.3)",background:"rgba(34,197,94,0.04)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"12px"}}>
          <div>
            <div style={{fontWeight:600,fontSize:"14px",marginBottom:"4px"}}>💳 Último pago</div>
            <div style={{color:"#22C55E",fontSize:"14px",marginBottom:"2px"}}>🟢 {countryData.symbol}{club.cuota.toLocaleString()} CLP — 5 de Mayo 2026</div>
            <div style={{...ss.muted,fontSize:"11px"}}>Método: {countryData.payments[0]} · Documento: {countryData.tax}</div>
          </div>
          <button onClick={()=>showToast("📄 Boleta descargada con QR de pago","success")} className="btn-hover" style={{...ss.btn,background:"#3B82F6",color:"#fff",fontSize:"12px"}}>📄 Descargar boleta + QR</button>
        </div>
      </div>
      <div style={ss.card}>
        <div style={{fontWeight:600,fontSize:"14px",marginBottom:"14px"}}>Historial de pagos</div>
        <table style={{width:"100%",fontSize:"12px",borderCollapse:"collapse"}}>
          <thead><tr>{["Mes","Monto","Método","Fecha","Estado"].map(h=><th key={h} style={{textAlign:"left",color:"#8896B0",padding:"6px 8px",fontWeight:500,borderBottom:"1px solid rgba(255,255,255,0.07)",fontSize:"11px"}}>{h}</th>)}</tr></thead>
          <tbody>{historial.map((p,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
            <td style={{padding:"8px"}}>{p.mes}</td>
            <td style={{padding:"8px"}}>{countryData.symbol}{p.monto.toLocaleString()}</td>
            <td style={{padding:"8px",color:"#8896B0"}}>{p.metodo}</td>
            <td style={{padding:"8px",color:"#8896B0"}}>{p.fecha}</td>
            <td style={{padding:"8px"}}><Badge color="#22C55E">✓ Pagado</Badge></td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>;
  }
  if(module==="mislesiones"){
    const misReps=injuryReports.filter(r=>r.player===player.name);
    return <div>
      <SectionTitle title="🩺 Mis Lesiones" sub="Historial de lesiones reportadas y seguimiento médico"
        action={!showLesionForm&&<button onClick={()=>setShowLesionForm(true)} className="btn-hover" style={{...ss.btn,background:sportColor,color:"#fff",fontSize:"12px"}}>+ Reportar lesión</button>}/>
      {showLesionForm&&<InjuryForm playerName={player.name} onSubmit={r=>{addInjuryReport(r);setShowLesionForm(false);showToast("✅ Lesión reportada al equipo médico","success");}} onCancel={()=>setShowLesionForm(false)} showToast={showToast}/>}
      {misReps.length===0&&!showLesionForm&&<div style={{...ss.card,textAlign:"center",padding:"48px 20px"}}>
        <div style={{fontSize:"36px",marginBottom:"12px"}}>🩺</div>
        <div style={{fontWeight:600,fontSize:"15px",marginBottom:"6px"}}>Sin lesiones reportadas</div>
        <div style={{...ss.muted,fontSize:"12px",marginBottom:"16px"}}>Cuando reportes una lesión aquí verás el historial y la respuesta del equipo médico.</div>
        <button onClick={()=>setShowLesionForm(true)} className="btn-hover" style={{...ss.btn,background:sportColor,color:"#fff",fontSize:"13px",padding:"10px 24px"}}>+ Reportar primera lesión</button>
      </div>}
      {misReps.map((rep,i)=>{
        const c=rep.severity==="rojo"?"#EF4444":"#F59E0B";
        const sevClasif=severidadClasificacion(rep.clasificacionMedica);
        return <div key={rep.id} style={{...ss.card,marginBottom:"16px",borderLeft:`4px solid ${c}`}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px",flexWrap:"wrap"}}>
            <Badge color={c}>{rep.tipo}</Badge>
            <span style={{...ss.muted,fontSize:"11px"}}>{rep.fecha}</span>
            <span style={{marginLeft:"auto"}}>{rep.acusadoRecibo?<Badge color="#22C55E">✅ Recibido</Badge>:<Badge color="#8896B0">⏳ Pendiente</Badge>}</span>
          </div>
          <div style={{fontSize:"13px",marginBottom:"8px",color:"#C8D3E0"}}>{rep.diagnostico}</div>
          {rep.imagenUrl&&rep.imagenUrl.startsWith("data:image")&&<img src={rep.imagenUrl} alt="diagnóstico" style={{maxHeight:"100px",borderRadius:"6px",border:"1px solid rgba(255,255,255,0.1)",marginBottom:"10px",display:"block"}}/>}
          {rep.imagenNombre&&!rep.imagenUrl?.startsWith("data:image")&&<div style={{...ss.muted,fontSize:"11px",marginBottom:"8px"}}>📎 {rep.imagenNombre}</div>}
          {(rep.clasificacionMedica||rep.fechaVuelta)&&<div style={{background:"rgba(255,255,255,0.04)",borderRadius:"8px",padding:"10px 12px",marginBottom:"10px"}}>
            <div style={{...ss.label,marginBottom:"6px"}}>Respuesta del equipo médico</div>
            {rep.clasificacionMedica&&<div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"4px"}}>
              {sevClasif&&<Semaforo status={sevClasif}/>}
              <span style={{fontSize:"12px"}}>{rep.clasificacionMedica}</span>
            </div>}
            {rep.fechaVuelta&&<div style={{fontSize:"12px",color:"#22C55E",fontWeight:600}}>🏃 Vuelta estimada: {new Date(rep.fechaVuelta+"T12:00:00").toLocaleDateString("es-CL")}</div>}
          </div>}
          <MiniChat mensajes={rep.mensajes||[]} onSend={msg=>updateInjuryReport(rep.id,{mensajes:[...(rep.mensajes||[]),msg]})} autorLabel="Jugador"/>
        </div>;
      })}
    </div>;
  }
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

function GymJugador({player,sportColor,gymLog,setGymLog,completedSession,setCompletedSession,newRecord,setNewRecord,expandedEx,setExpandedEx,showToast,rankTab,setRankTab,players,addWellnessLog,sesionesCreadas}) {
  const todayPlan=GYM_PLAN.sessions.lunes;
  const [wellnessDone,setWellnessDone]=useState(false);
  const [wellnessNota,setWellnessNota]=useState("");
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
    {completedSession&&!wellnessDone&&<div style={{...ss.card,marginBottom:"16px",border:"1px solid rgba(59,130,246,0.3)",background:"rgba(59,130,246,0.05)"}}>
      <div style={{fontWeight:600,fontSize:"13px",marginBottom:"12px",color:"#3B82F6"}}>¿Cómo te sentiste en esta sesión?</div>
      <div style={{display:"flex",gap:"8px",marginBottom:"10px",flexWrap:"wrap"}}>
        {[["verde","🟢 Bien · sin molestias"],["amarillo","🟡 Con molestia"],["rojo","🔴 Con dolor · aviso al médico"]].map(([s,label])=><button key={s} onClick={()=>{addWellnessLog&&addWellnessLog({id:Date.now(),playerId:player.id,playerName:player.name,status:s,nota:wellnessNota,fecha:new Date().toLocaleDateString("es-CL"),sesion:"Lunes 13 Mayo"});setWellnessDone(true);showToast("✅ Estado registrado al equipo médico","success");}} className="btn-hover" style={{...ss.btn,flex:1,padding:"10px 8px",fontSize:"12px",background:s==="verde"?"rgba(34,197,94,0.1)":s==="amarillo"?"rgba(245,158,11,0.1)":"rgba(239,68,68,0.1)",color:s==="verde"?"#22C55E":s==="amarillo"?"#F59E0B":"#EF4444",border:`1px solid ${s==="verde"?"rgba(34,197,94,0.2)":s==="amarillo"?"rgba(245,158,11,0.2)":"rgba(239,68,68,0.2)"}`}}>{label}</button>)}
      </div>
      <textarea value={wellnessNota} onChange={e=>setWellnessNota(e.target.value)} placeholder="Nota opcional — describe cómo te sentiste..." style={{...ss.input,height:"50px",resize:"none",fontFamily:"inherit",fontSize:"12px"}}/>
    </div>}
    {completedSession&&wellnessDone&&<div style={{...ss.card,marginBottom:"16px",padding:"10px 14px",background:"rgba(34,197,94,0.05)",border:"1px solid rgba(34,197,94,0.2)"}}>
      <span style={{fontSize:"12px",color:"#22C55E"}}>✅ Estado post-sesión registrado · el equipo médico ya puede verlo</span>
    </div>}
    {sesionesCreadas.filter(s=>s.categoria===player.cat).length>0&&<div style={{...ss.card,marginBottom:"16px",border:"1px solid #27272a"}}>
      <div style={{fontWeight:600,fontSize:"13px",marginBottom:"12px"}}>📋 Sesiones asignadas por el preparador</div>
      {sesionesCreadas.filter(s=>s.categoria===player.cat).map((ses,i)=><div key={ses.id} style={{padding:"10px 12px",background:"rgba(255,255,255,0.01)",borderRadius:"8px",marginBottom:i<sesionesCreadas.filter(s=>s.categoria===player.cat).length-1?"8px":"0",borderLeft:`3px solid ${sportColor}`,borderTop:"1px solid #27272a"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"6px"}}>
          <div style={{fontWeight:500,fontSize:"13px",color:"#fafafa"}}>{ses.titulo}</div>
          <Badge color={sportColor}>{ses.tipo}</Badge>
        </div>
        <div style={{fontSize:"11px",color:"#a1a1aa",display:"flex",gap:"12px"}}>
          <span>📅 {ses.fecha}</span><span>🏋️ {ses.bloques.length} bloques · {ses.bloques.reduce((t,b)=>t+b.filas.length,0)} ejercicios</span>
        </div>
      </div>)}
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
    {title:"Portal de Padres",body:"parent_players: parent_id → player_id (read-only). Rol 'padre' accede a estado médico, asistencia, convocatoria y cuotas del hijo. Alertas del preparador se reenvían al padre vía push + WhatsApp cuando injury_risk cambia a HIGH."},
    {title:"Integración de Wearables",body:"wearable_connections: player_id, provider (apple_health|oura|strava), access_token, last_sync. Métricas diarias en player_health_metrics: hrv_ms, sleep_hrs, resting_hr_bpm, cardio_load, vo2max. Sync vía webhooks. Solo se almacenan métricas agregadas — nunca datos raw."},
    {title:"Predicción de Lesiones",body:"injury_risk_scores: player_id, date, risk_level (HIGH|MEDIUM|LOW), confidence FLOAT, factors JSONB {hrv_trend, sleep_avg, volume_spike_pct, cardio_load}. Score recalculado diariamente por job. Trigger en cambio a HIGH: notifica a coach, preparador y padre."},
  ];
  return <div style={{marginTop:"32px",borderTop:"1px solid rgba(255,255,255,0.07)",paddingTop:"16px"}}>
    <button onClick={()=>setOpen(!open)} style={{...ss.btn,background:"transparent",color:"#8896B0",border:"1px solid rgba(255,255,255,0.1)",width:"100%",textAlign:"left",fontSize:"13px",padding:"10px 14px"}}>📋 Notas para el Backend Developer {open?"▲":"▼"}</button>
    {open&&<div style={{marginTop:"12px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
      {notes.map((n,i)=><div key={i} style={{...ss.card,padding:"12px"}}><div style={{fontWeight:600,fontSize:"12px",color:"#3B82F6",marginBottom:"6px"}}>{n.title}</div><div style={{fontSize:"11px",color:"#8896B0",lineHeight:"1.6"}}>{n.body}</div></div>)}
    </div>}
  </div>;
}