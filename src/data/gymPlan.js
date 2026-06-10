export const GYM_PLAN = {
  week:"13–19 Mayo",
  coach:"Prof. Marcos Díaz",
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
