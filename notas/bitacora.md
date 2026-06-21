# Bitácora — sportsos

## 2026-06-18 — Membresías y super admin completados

### Supabase: RLS y tabla nueva
- Añadidas políticas RLS para que `admin@sportostest.com` (UUID `fe1c22a4-...`) pueda:
  - **SELECT y UPDATE en `clubs`** — leer y modificar todos los clubes
  - **SELECT y UPDATE en `profiles`** — leer y modificar perfiles de cualquier usuario
- Nuevas columnas en `clubs`: `plan_vence` (date), `plan_notas` (text), `suspended` (boolean), `plan_updated_at` (timestamptz)
- Nueva tabla `plan_history`: registra cada cambio de plan con plan anterior, plan nuevo, notas y quién lo cambió

### SuperAdminView — módulo Membresías
- Reescrito con editor inline por club: selector de plan (Free/Pro/Elite), fecha de vencimiento, notas internas
- Indicador visual de plan vencido (rojo) y por vencer (naranja)
- Botón Suspender / Reactivar usa campo `suspended` (booleano) en vez de cambiar el plan
- Historial de cambios visible por club (últimos 3) y listado completo colapsable
- KPIs: clubes activos, MRR total, cuenta Elite, cuenta suspendidos
- Doble escritura: actualiza `clubs.plan` y también `profiles.plan` de todos los usuarios del club

## IDEAS FUTURAS (pendientes de implementar)

### QR de asistencia
- Entrenador genera QR único del día → jugadores escanean con su celular → confirma presencia automática
- Vista entrenador: lista en tiempo real (Supabase Realtime)
- Vista jugador: pantalla "Confirmar presencia ✅" al abrir el link del QR
- Tabla Supabase: `asistencia` con jugador_id, club_id, fecha, metodo (qr/manual)
- Librería: qrcode.react
- URL del QR: sportsos-iota.vercel.app?asistencia=<club_id>&fecha=<hoy>


## 2026-06-14
- Creado `src/views/HomeView.jsx`: dashboard de inicio con métricas por rol
  - Admin: jugadores activos, cuotas (pagadas/pendientes/vencidas), próximo partido, barra de progreso
  - Entrenador: próximo partido hero, asistencia del día, victorias, últimos partidos
  - Preparador: estado del plantel wellness (lesionados/alertas/aptos), microciclo, ranking fuerza
  - Jugador: ¿Estoy convocado? hero (grande), cuota, wellness, ranking gym
  - SuperAdmin: clubes activos, comisiones, usuarios, retención
- HomeView conectado en App.jsx como módulo por defecto al entrar/cambiar de rol
- Todas las tarjetas clickeables navegan al módulo correspondiente (`onNavigate`)


## 2026-06-08
- Repo clonado y configurado con stack de IA (Cline + CLAUDE.md)
- .env protegido (sacado de git)

## 2026-06-10
- UX/UI completo — refactorización mayor
  - Proyecto dividido en src/components/, src/views/, src/data/, src/styles/
  - Aurora background animado con blobs de color
  - Glassmorphism en topbar, sidebar, cards y modales
  - Onboarding inmersivo con animaciones framer-motion
  - Design tokens en CSS custom properties (tokens.js + index.css)
  - framer-motion instalado para transiciones y micro-interacciones
  - Fuente Inter + meta tags en index.html
- Git push a GitHub (commit 9f43910)
- Deploy producción Vercel: https://sportsos-iota.vercel.app
- Proyecto 100% independiente — fuera de Lovable, en repo propio + Vercel

## 2026-06-10 (Supabase + datos reales)
- Supabase integrado como backend real
  - src/lib/supabase.js — cliente Supabase
  - src/lib/auth.js — signIn/signUp/signOut/getProfile
  - src/lib/useAuth.jsx — AuthProvider + useAuth hook
  - src/lib/db.js — funciones CRUD para todas las tablas
  - supabase/schema.sql — schema completo con RLS
- Hooks de datos creados:
  - src/lib/usePlayers.js — jugadores con fallback mock
  - src/lib/usePosts.js — El Muro con realtime Supabase
  - src/lib/useAttendance.js — asistencia con guardado en BD
- App.jsx actualizado: usa usePlayers() en lugar de PLAYERS_RUGBY hardcodeado
- Login tiene modo dual: Supabase real + fallback mock usuarios demo
- Variables de entorno configuradas en Vercel (no en git)
