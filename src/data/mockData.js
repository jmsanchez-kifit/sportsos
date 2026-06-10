export const MOCK_POSTS = [
  {id:1,type:"resultado",author:"Entrenador Jefe",time:"Hace 2h",text:"¡Gran victoria! El equipo mostró una defensa sólida en los últimos 10 minutos. Próxima semana preparamos al rival.",likes:12},
  {id:2,type:"médico",author:"Dr. García",time:"Hace 5h",text:"Cristóbal Vega completó el protocolo paso 1. Evaluación mañana a las 10:00 para determinar disponibilidad.",likes:3},
  {id:3,type:"admin",author:"Admin Club",time:"Hace 1d",text:"Recordatorio: cuotas de este mes vencen el día 30. Matías Herrera y Marco Silva aún tienen cuota pendiente.",likes:1},
  {id:4,type:"advertencia",author:"Preparador Díaz",time:"Hace 2d",text:"Sesión de fuerza viernes 7:00 AM obligatoria para plantel principal. Planilla de asistencia activa.",likes:7},
];

export const COMMISSION_DATA = [
  {month:"Dic",val:8200},{month:"Ene",val:9100},{month:"Feb",val:8700},
  {month:"Mar",val:10400},{month:"Abr",val:11200},{month:"May",val:12800}
];

export const CLUB_LIST = [
  {id:1,sport:"rugby",country:"CL",name:"Toros RC",plan:"Pro",players:45,mrr:450000,status:"active"},
  {id:2,sport:"futbol",country:"CL",name:"Andes FC",plan:"Enterprise",players:72,mrr:880000,status:"active"},
  {id:3,sport:"handball",country:"CL",name:"Club Atlético",plan:"Starter",players:28,mrr:180000,status:"active"},
  {id:4,sport:"basketball",country:"CL",name:"Halcones BC",plan:"Pro",players:36,mrr:320000,status:"active"},
  {id:5,sport:"hockey",country:"CL",name:"Las Leonas",plan:"Enterprise",players:52,mrr:900000,status:"past_due"},
  {id:6,sport:"futbol",country:"CL",name:"Cóndores FC",plan:"Pro",players:88,mrr:640000,status:"active"},
];

export const COUNTRY_COUNTS = { CL: 65 };

// Estructura preparada para análisis de video con IA en el futuro.
// Campos aiAnalysis y videoUrl serán completados por el agente de IA cuando el coach suba el video.
export const MOCK_RESULTADOS = [
  {
    id:1, cat:"Primer Equipo", rival:"Universitario RC", fecha:"2025-06-07", lugar:"Local",
    golesLocal:3, golesVisita:1, resultado:"victoria",
    autor:"Eduardo Ramírez", autorRol:"entrenador",
    resumen:"Partido dominado desde el inicio. Excelente defensa en el segundo tiempo.",
    destacados:["Andrés Castro","Felipe Morales"],
    // ── Futuro: IA completa estos campos al analizar el video ──
    videoUrl: null,
    aiAnalysis: null,   // { posesion, tackles, lineBreaks, heatmap, eventos[] }
    aiStatus: null,     // null | "procesando" | "listo"
  },
  {
    id:2, cat:"Reserva", rival:"Santiago RC", fecha:"2025-06-07", lugar:"Visita",
    golesLocal:2, golesVisita:0, resultado:"victoria",
    autor:"Carlos Vidal", autorRol:"entrenador",
    resumen:"Sólida actuación del equipo. Dos tries en los primeros 20 minutos.",
    destacados:["Diego Saavedra","Matías Herrera"],
    videoUrl: null, aiAnalysis: null, aiStatus: null,
  },
  {
    id:3, cat:"Sub-20", rival:"Cóndores RC", fecha:"2025-06-06", lugar:"Local",
    golesLocal:1, golesVisita:1, resultado:"empate",
    autor:"Rodrigo Muñoz", autorRol:"entrenador",
    resumen:"Empate justo. El equipo creció en la segunda mitad. A mejorar la melé.",
    destacados:["Pablo Rodríguez"],
    videoUrl: null, aiAnalysis: null, aiStatus: null,
  },
  {
    id:4, cat:"Primer Equipo", rival:"Stade Français RC", fecha:"2025-05-31", lugar:"Local",
    golesLocal:2, golesVisita:4, resultado:"derrota",
    autor:"Eduardo Ramírez", autorRol:"entrenador",
    resumen:"Resultado duro. Rival muy intenso en los rucks. Semana de análisis táctico.",
    destacados:["Cristóbal Vega"],
    videoUrl: null, aiAnalysis: null, aiStatus: null,
  },
];

export const MOCK_PAYMENTS = [
  {id:1,playerId:6,playerName:"Pablo Rodríguez",amount:45000,method:"Khipu",date:"2025-05-28",status:"pagado"},
  {id:2,playerId:7,playerName:"Ignacio Pérez",amount:45000,method:"Transbank",date:"2025-05-27",status:"pagado"},
  {id:3,playerId:9,playerName:"Tomás López",amount:45000,method:"Transferencia",date:"2025-05-26",status:"pagado"},
  {id:4,playerId:11,playerName:"Carlos Contreras",amount:45000,method:"Khipu",date:"2025-05-25",status:"pagado"},
  {id:5,playerId:2,playerName:"Felipe Morales",amount:45000,method:"Transbank",date:"2025-05-24",status:"pagado"},
];
