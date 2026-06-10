/**
 * Hook React para manejar autenticación con Supabase.
 * Provee: user, profile, loading, signIn, signUp, signOut
 */
import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "./supabase";
import { signIn as _signIn, signOut as _signOut, signUp as _signUp, getProfile } from "./auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else setLoading(false);
    });

    // Escuchar cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId) {
    try {
      const p = await getProfile(userId);
      setProfile(p);
    } catch {
      // Perfil aún no existe (primer login), se crea después del signup
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email, password) {
    const data = await _signIn({ email, password });
    return data;
  }

  async function signUp(email, password, extra) {
    const data = await _signUp({ email, password, ...extra });
    return data;
  }

  async function signOut() {
    await _signOut();
    setUser(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
