import { supabase } from "./supabase";

/** Registrar usuario nuevo */
export async function signUp({ email, password, nombre, rol, clubId }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nombre, rol, club_id: clubId },
    },
  });
  if (error) throw error;
  return data;
}

/** Iniciar sesión */
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/** Cerrar sesión */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/** Obtener sesión activa */
export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/** Obtener perfil completo del usuario (tabla profiles) */
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*, clubs(name, sport, country)")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}
