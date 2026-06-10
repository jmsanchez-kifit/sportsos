import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";
import { PLAYERS_RUGBY } from "../data/players";

/**
 * Hook que carga jugadores desde Supabase.
 * Si no hay club_id (modo demo) devuelve los mock data.
 */
export function usePlayers(clubId) {
  const [players, setPlayers]   = useState(PLAYERS_RUGBY);
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState(null);
  const isReal = !!clubId;

  const load = useCallback(async () => {
    if (!isReal) { setPlayers(PLAYERS_RUGBY); return; }
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from("players")
        .select("*")
        .eq("club_id", clubId)
        .order("number");
      if (err) throw err;
      // Si la tabla está vacía, mostrar mock data para que no se vea vacío
      setPlayers(data.length > 0 ? data : PLAYERS_RUGBY);
    } catch (e) {
      setError(e.message);
      setPlayers(PLAYERS_RUGBY); // fallback
    } finally {
      setLoading(false);
    }
  }, [clubId, isReal]);

  useEffect(() => { load(); }, [load]);

  const addPlayer = async (player) => {
    if (!isReal) { setPlayers(p => [...p, { ...player, id: Date.now() }]); return; }
    const { data, error: err } = await supabase
      .from("players")
      .insert({ ...player, club_id: clubId })
      .select().single();
    if (err) throw err;
    setPlayers(p => [...p, data]);
    return data;
  };

  const updatePlayer = async (id, changes) => {
    if (!isReal) { setPlayers(p => p.map(x => x.id === id ? { ...x, ...changes } : x)); return; }
    const { data, error: err } = await supabase
      .from("players").update(changes).eq("id", id).select().single();
    if (err) throw err;
    setPlayers(p => p.map(x => x.id === id ? data : x));
    return data;
  };

  const removePlayer = async (id) => {
    if (!isReal) { setPlayers(p => p.filter(x => x.id !== id)); return; }
    const { error: err } = await supabase.from("players").delete().eq("id", id);
    if (err) throw err;
    setPlayers(p => p.filter(x => x.id !== id));
  };

  return { players, loading, error, addPlayer, updatePlayer, removePlayer, reload: load };
}
