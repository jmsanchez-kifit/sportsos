export default function Semaforo({status, pulse=true}) {
  const c = status==="verde"?"#22C55E":status==="amarillo"?"#F59E0B":"#EF4444";
  return (
    <span style={{position:"relative",display:"inline-block",width:"10px",height:"10px"}}>
      <span style={{position:"absolute",inset:0,borderRadius:"50%",background:c,boxShadow:`0 0 10px ${c}`}}/>
      {pulse&&<span style={{position:"absolute",inset:0,borderRadius:"50%",background:c,opacity:0.5,animation:"pulse-soft 2s var(--ease-in-out) infinite"}}/>}
    </span>
  );
}
