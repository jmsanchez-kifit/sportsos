import { useState, useCallback } from "react";
import { supabase } from "./supabase";

/**
 * Hook para asistencia — guarda en Supabase.
 * En modo demo, solo estado local.
 */
export function useAttendance(clubId, date) {
  const [present, setPresent] = useState({});
  const [saving,  setSaving]  = useState({});
  const isReal = !!clubId;

  const load = useCallback(async () => {
    if (!isReal) return;
    const { data, error } = await supabase
      .from("attendance")
      .select("player_id, present")
      .eq("club_id", clubId)
      .eq("date", date);
    if (error) return;
    const map = {};
    data.forEach(r => { map[r.player_id] = r.present; });
    setPresent(map);
  }, [clubId, date, isReal]);

  const toggle = async (playerId) => {
    const next = !present[playerId];
    setPresent(p => ({ ...p, [playerId]: next }));
    if (!isReal) return;
    setSaving(s => ({ ...s, [playerId]: true }));
    try {
      await supabase.from("attendance").upsert({
        club_id: clubId, player_id: playerId, date, present: next,
      });
    } catch {
      // revertir si falla
      setPresent(p => ({ ...p, [playerId]: !next }));
    } finally {
      setSaving(s => ({ ...s, [playerId]: false }));
    }
  };

  return { present, saving, toggle, load };
}
