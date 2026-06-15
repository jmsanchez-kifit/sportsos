// ── Planes y features de SportOS ─────────────────────────────────────────
// plan: "free" | "pro" | "elite"
// En demo (currentUser===null) se usa "pro" para ver todo sin bloqueos

export const PLANS = {
  free:  { label:"Free",  price:0,    color:"#6B5A5A", icon:"🆓" },
  pro:   { label:"Pro",   price:29,   color:"#C0392B", icon:"⚡" },
  elite: { label:"Elite", price:59,   color:"#C98408", icon:"👑" },
};

// Qué módulos / features requieren qué plan mínimo
// "free" = todos pueden usarlo
export const FEATURE_PLAN = {
  // Módulos por id
  muro:           "free",
  asistencia:     "free",
  calendario:     "free",
  jugadores:      "free",   // hasta 15 — el gate de 15 se aplica por separado
  matchcenter:    "pro",
  estadoplantel:  "pro",
  microciclo:     "pro",
  rankingfuerza:  "pro",
  nomina:         "pro",
  estadisticas:   "pro",
  salud:          "pro",
  finanzas:       "elite",
  miclub:         "free",
  miconvocatoria: "free",
  midashboard:    "free",
  noticias:       "free",
  micuota:        "pro",
  migym:          "pro",
  nominasclub:    "pro",
  // Features especiales (no módulos)
  plantel_ilimitado: "pro",
  importar_partido:  "elite",
};

const PLAN_ORDER = ["free","pro","elite"];

// Devuelve true si el plan del usuario permite acceder a la feature
export function canAccess(userPlan, featureId) {
  const required = FEATURE_PLAN[featureId] || "free";
  return PLAN_ORDER.indexOf(userPlan) >= PLAN_ORDER.indexOf(required);
}

// Qué plan mínimo necesita una feature
export function requiredPlan(featureId) {
  return FEATURE_PLAN[featureId] || "free";
}

// Texto de upgrade según el plan necesario
export const UPGRADE_TEXT = {
  pro:   { title:"Función Pro", desc:"Esta función requiere el plan Pro.", cta:"Subir a Pro — $29 USD/mes" },
  elite: { title:"Función Elite", desc:"Esta función requiere el plan Elite.", cta:"Subir a Elite — $59 USD/mes" },
};

// Agrega campo `plan` a mockUsers según rol para demo
export const DEMO_PLAN = "pro"; // en demo mostramos todo hasta pro
