import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";

export function useComments(postId, clubId) {
  const [comments, setComments] = useState([]);
  const isReal = !!(postId && clubId);

  const load = useCallback(async () => {
    if (!isReal) return;
    const { data } = await supabase
      .from("post_comments")
      .select("id, author_name, text, created_at")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (data) setComments(data.map(c => ({
      id: c.id,
      author: c.author_name,
      text: c.text,
      time: timeAgo(c.created_at),
    })));
  }, [postId, clubId, isReal]);

  useEffect(() => { load(); }, [load]);

  const addComment = async ({ authorName, text, authorId = null }) => {
    if (!text.trim()) return;
    if (!isReal) {
      setComments(prev => [...prev, { id: Date.now(), author: authorName || "Yo", text, time: "Ahora" }]);
      return;
    }
    const { data, error } = await supabase.from("post_comments").insert({
      post_id: postId,
      club_id: clubId,
      author_id: authorId,
      author_name: authorName || "Usuario",
      text,
    }).select().single();
    if (!error && data) {
      setComments(prev => [...prev, { id: data.id, author: data.author_name, text: data.text, time: "Ahora" }]);
    }
  };

  return { comments, addComment };
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Ahora";
  if (m < 60) return `Hace ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Hace ${h}h`;
  return `Hace ${Math.floor(h / 24)}d`;
}
