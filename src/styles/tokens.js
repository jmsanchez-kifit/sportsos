export const ss = {
  wrap:{position:"relative",display:"flex",flexDirection:"column",height:"100vh",minHeight:"100vh",background:"transparent",color:"var(--text-1)",fontFamily:"'Inter',system-ui,sans-serif",overflow:"hidden",zIndex:1},
  topbar:{display:"flex",alignItems:"center",gap:"10px",padding:"0 18px",height:"60px",background:"var(--bg-glass)",backdropFilter:"blur(24px) saturate(180%)",WebkitBackdropFilter:"blur(24px) saturate(180%)",borderBottom:"1px solid var(--border-soft)",flexShrink:0,position:"sticky",top:0,zIndex:50},
  sidebar:{width:"220px",background:"var(--bg-glass)",backdropFilter:"blur(24px) saturate(180%)",WebkitBackdropFilter:"blur(24px) saturate(180%)",borderRight:"1px solid var(--border-soft)",display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto",position:"relative",zIndex:10},
  main:{flex:1,overflowY:"auto",padding:"28px 32px",scrollbarWidth:"thin",scrollbarColor:"var(--border-mid) transparent",position:"relative",zIndex:1},
  card:{background:"var(--bg-glass)",backdropFilter:"blur(16px) saturate(140%)",WebkitBackdropFilter:"blur(16px) saturate(140%)",border:"1px solid var(--border-soft)",borderRadius:"var(--r-lg)",padding:"18px",transition:"all 0.25s var(--ease-out)",position:"relative",overflow:"hidden"},
  cardHover:{transition:"all 0.3s var(--ease-out)"},
  muted:{color:"var(--text-2)",fontSize:"12px",letterSpacing:"0.01em"},
  label:{color:"var(--text-3)",fontSize:"10px",textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600,marginBottom:"6px"},
  btn:{padding:"8px 16px",borderRadius:"var(--r-sm)",border:"none",cursor:"pointer",fontSize:"12px",fontWeight:600,transition:"all 0.2s var(--ease-out)",fontFamily:"inherit",display:"inline-flex",alignItems:"center",gap:"6px",justifyContent:"center",letterSpacing:"0.01em"},
  input:{background:"var(--bg-elev-2)",border:"1px solid var(--border-soft)",borderRadius:"var(--r-sm)",color:"var(--text-1)",padding:"9px 12px",fontSize:"13px",outline:"none",width:"100%",boxSizing:"border-box",transition:"all 0.2s",fontFamily:"inherit"},
  sectionTitle:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"24px",gap:"16px",flexWrap:"wrap"},
};
