export default function FieldMarkings({type, color}) {
  const ln="rgba(255,255,255,0.32)", ln2="rgba(255,255,255,0.18)";
  const stripes=(c)=>[0,1,2,3,4,5].map(i=><rect key={i} x="3" y={3+i*22.3} width="94" height="11.1" fill={c}/>);
  if(type==="rugby") return <>
    <defs><linearGradient id="pitch-rugby" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0d2c1a"/><stop offset="100%" stopColor="#0a1f12"/></linearGradient></defs>
    <rect x="3" y="3" width="94" height="134" rx="1" fill="url(#pitch-rugby)" stroke={ln} strokeWidth="0.6"/>
    {stripes("rgba(255,255,255,0.025)")}
    <rect x="3" y="3" width="94" height="14" fill="rgba(255,255,255,0.06)"/>
    <rect x="3" y="123" width="94" height="14" fill="rgba(255,255,255,0.06)"/>
    <line x1="3" y1="17" x2="97" y2="17" stroke={ln} strokeWidth="0.5"/>
    <line x1="3" y1="123" x2="97" y2="123" stroke={ln} strokeWidth="0.5"/>
    <line x1="3" y1="42" x2="97" y2="42" stroke={ln2} strokeWidth="0.5" strokeDasharray="2 2"/>
    <line x1="3" y1="98" x2="97" y2="98" stroke={ln2} strokeWidth="0.5" strokeDasharray="2 2"/>
    <line x1="3" y1="70" x2="97" y2="70" stroke={ln} strokeWidth="0.5"/>
    <path d="M45 17 L45 9 M55 17 L55 9 M45 12 L55 12" stroke={color} strokeWidth="0.9" fill="none"/>
    <path d="M45 123 L45 131 M55 123 L55 131 M45 128 L55 128" stroke={color} strokeWidth="0.9" fill="none"/>
  </>;
  if(type==="futbol") return <>
    <defs><linearGradient id="pitch-futbol" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0d2c1a"/><stop offset="100%" stopColor="#0a1f12"/></linearGradient></defs>
    <rect x="3" y="3" width="94" height="134" fill="url(#pitch-futbol)" stroke={ln} strokeWidth="0.6"/>
    {stripes("rgba(255,255,255,0.025)")}
    <line x1="3" y1="70" x2="97" y2="70" stroke={ln} strokeWidth="0.5"/>
    <circle cx="50" cy="70" r="12" fill="none" stroke={ln} strokeWidth="0.5"/>
    <circle cx="50" cy="70" r="0.9" fill={ln}/>
    <rect x="28" y="3" width="44" height="22" fill="none" stroke={ln} strokeWidth="0.5"/>
    <rect x="40" y="3" width="20" height="9" fill="none" stroke={ln} strokeWidth="0.5"/>
    <circle cx="50" cy="17" r="0.9" fill={ln}/>
    <path d="M43 25 A 10 10 0 0 0 57 25" fill="none" stroke={ln} strokeWidth="0.5"/>
    <rect x="28" y="115" width="44" height="22" fill="none" stroke={ln} strokeWidth="0.5"/>
    <rect x="40" y="128" width="20" height="9" fill="none" stroke={ln} strokeWidth="0.5"/>
    <circle cx="50" cy="123" r="0.9" fill={ln}/>
    <path d="M43 115 A 10 10 0 0 1 57 115" fill="none" stroke={ln} strokeWidth="0.5"/>
    <rect x="44" y="2" width="12" height="2.5" fill={color}/>
    <rect x="44" y="135.5" width="12" height="2.5" fill={color}/>
  </>;
  if(type==="handball") return <>
    <defs><linearGradient id="pitch-handball" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#11233c"/><stop offset="100%" stopColor="#0a182c"/></linearGradient></defs>
    <rect x="3" y="3" width="94" height="134" fill="url(#pitch-handball)" stroke={ln} strokeWidth="0.6"/>
    <line x1="3" y1="70" x2="97" y2="70" stroke={ln} strokeWidth="0.5"/>
    <path d="M24 3 A 26 26 0 0 0 76 3" fill="rgba(255,255,255,0.05)" stroke={ln} strokeWidth="0.5"/>
    <path d="M18 3 A 32 32 0 0 0 82 3" fill="none" stroke={ln2} strokeWidth="0.5" strokeDasharray="2 1.5"/>
    <path d="M24 137 A 26 26 0 0 1 76 137" fill="rgba(255,255,255,0.05)" stroke={ln} strokeWidth="0.5"/>
    <path d="M18 137 A 32 32 0 0 1 82 137" fill="none" stroke={ln2} strokeWidth="0.5" strokeDasharray="2 1.5"/>
    <rect x="44" y="2.2" width="12" height="2.5" fill={color}/>
    <rect x="44" y="135.3" width="12" height="2.5" fill={color}/>
  </>;
  if(type==="basketball") return <>
    <defs><linearGradient id="pitch-basketball" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2a2012"/><stop offset="100%" stopColor="#1a140a"/></linearGradient></defs>
    <rect x="3" y="3" width="94" height="134" fill="url(#pitch-basketball)" stroke={ln} strokeWidth="0.6"/>
    <rect x="35" y="3" width="30" height="41" fill="rgba(255,255,255,0.04)" stroke={ln} strokeWidth="0.5"/>
    <circle cx="50" cy="44" r="12" fill="none" stroke={ln} strokeWidth="0.5"/>
    <path d="M14 3 L14 22 A 36 36 0 0 0 86 22 L86 3" fill="none" stroke={ln} strokeWidth="0.5"/>
    <line x1="42" y1="7" x2="58" y2="7" stroke={color} strokeWidth="1.2"/>
    <circle cx="50" cy="10.5" r="3" fill="none" stroke={color} strokeWidth="0.9"/>
    <path d="M38 137 A 12 12 0 0 1 62 137" fill="none" stroke={ln} strokeWidth="0.5"/>
  </>;
  if(type==="hockey") return <>
    <defs><linearGradient id="pitch-hockey" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0e3320"/><stop offset="100%" stopColor="#082015"/></linearGradient></defs>
    <rect x="3" y="3" width="94" height="134" fill="url(#pitch-hockey)" stroke={ln} strokeWidth="0.6"/>
    {stripes("rgba(255,255,255,0.022)")}
    <line x1="3" y1="70" x2="97" y2="70" stroke={ln} strokeWidth="0.5"/>
    <line x1="3" y1="33" x2="97" y2="33" stroke={ln2} strokeWidth="0.5"/>
    <line x1="3" y1="107" x2="97" y2="107" stroke={ln2} strokeWidth="0.5"/>
    <path d="M20 3 A 30 30 0 0 0 80 3" fill="rgba(255,255,255,0.04)" stroke={ln} strokeWidth="0.5"/>
    <path d="M20 137 A 30 30 0 0 1 80 137" fill="rgba(255,255,255,0.04)" stroke={ln} strokeWidth="0.5"/>
    <rect x="45" y="2.2" width="10" height="2.5" fill={color}/>
    <rect x="45" y="135.3" width="10" height="2.5" fill={color}/>
  </>;
  return null;
}
