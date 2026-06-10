import { ss } from "../styles/tokens";

export default function MedalBadge({rank}) {
  const medals = ["🥇","🥈","🥉"];
  const colors = ["#F59E0B","#94A3B8","#CD7F32"];
  return rank <= 3
    ? <span style={{fontSize:"18px",filter:`drop-shadow(0 0 8px ${colors[rank-1]}66)`}}>{medals[rank-1]}</span>
    : <span style={{...ss.muted,fontSize:"12px",fontWeight:600}}>#{rank}</span>;
}
