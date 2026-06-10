export default function Badge({color, children, size="sm", glow=false}) {
  const fs = size==="sm"?"10px":size==="md"?"12px":"13px";
  const px = size==="sm"?"7px":size==="md"?"10px":"12px";
  const py = size==="sm"?"3px":size==="md"?"5px":"6px";
  return (
    <span style={{
      background:color+"22",color,border:`1px solid ${color}55`,
      borderRadius:"99px",padding:`${py} ${px}`,fontSize:fs,fontWeight:600,
      whiteSpace:"nowrap",textTransform:"uppercase",letterSpacing:"0.04em",
      boxShadow:glow?`0 0 12px ${color}44`:"none",
    }}>{children}</span>
  );
}
