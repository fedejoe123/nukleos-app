// React hooks from CDN
const { useState, useRef, useCallback, useEffect } = React;

// ─────────────────────────────────────────────────────────────────────────────
// TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  navy:"#0d1f3c", navyMid:"#1a3260", blue1:"#1a6fc4", blue2:"#38b6e8",
  teal:"#2dd4bf", cream:"#f4f0e8", white:"#ffffff", ink:"#0d1f3c",
  muted:"#6a7a9a", border:"#d8dde8", green:"#1e8449", red:"#c0392b",
  orange:"#d35400", yellow:"#c9a800", purple:"#7d3c98", gold:"#c9a84c",
};
const FONT  = "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif";
const FONT2 = "'Trebuchet MS','Gill Sans',sans-serif";
const grad  = `linear-gradient(140deg,${T.navy} 0%,${T.navyMid} 55%,${T.blue1} 100%)`;
const gradH = `linear-gradient(140deg,#0a1628 0%,#162a54 55%,#1560b0 100%)`;

// ─────────────────────────────────────────────────────────────────────────────
// SEED DATA
// ─────────────────────────────────────────────────────────────────────────────
const SEED_PATIENTS = [
  { id:1,  name:"González, María",    dni:"28441302", dob:"12/03/1985", phone:"011-4523-8871", email:"maria.g@gmail.com",     occupation:"Docente",    ficha:true,
    sessions:[ {id:101,date:"28 abr 2026",amount:13500,method:"transferencia",absent:false,signed:true,doctorId:"admin",findings:{L4:{findingId:"restriccion",technique:"Gonstead",notes:""}}}, {id:102,date:"21 abr 2026",amount:13500,method:"efectivo",absent:false,signed:true,doctorId:"admin",findings:{}}, {id:103,date:"07 abr 2026",amount:12000,method:"efectivo",absent:true,signed:false,doctorId:"admin",findings:{}} ],
    anamnesis:{motivo:"Dolor lumbar crónico",antecedentes:"Hernia L4-L5 (2019)",medicacion:"Ibuprofeno ocasional",cirugias:"Ninguna",deportes:"Caminata 3x semana",observaciones:"8hs sentada"}
  },
  { id:2,  name:"Mendoza, Carlos",    dni:"31220445", dob:"05/07/1978", phone:"011-6677-2234", email:"cmendoza@hotmail.com",   occupation:"Albañil",    ficha:true,
    sessions:[ {id:201,date:"05 may 2026",amount:14000,method:"efectivo",absent:false,signed:true,doctorId:"admin",findings:{T6:{findingId:"subluxacion",technique:"Thompson",notes:""}}} ],
    anamnesis:{motivo:"Dolor cervical y cefaleas",antecedentes:"Sin antecedentes",medicacion:"Ninguna",cirugias:"Apendicectomía 2005",deportes:"Fútbol fines de semana",observaciones:"Trabajo físico"}
  },
  { id:3,  name:"Fitzpatrick, Laura", dni:"35008119", dob:"22/11/1992", phone:"011-5544-9900", email:"lauraf@gmail.com",       occupation:"Diseñadora", ficha:false, sessions:[], anamnesis:{} },
  { id:4,  name:"Álvarez, Diego",     dni:"29334455", dob:"01/01/1980", phone:"011-1111-2222", email:"dalvarez@gmail.com",     occupation:"Contador",   ficha:true,  sessions:[ {id:301,date:"02 may 2026",amount:13500,method:"efectivo",absent:false,signed:true,doctorId:"admin",findings:{}} ], anamnesis:{motivo:"Lumbalgia",antecedentes:"",medicacion:"",cirugias:"",deportes:"",observaciones:""} },
  { id:5,  name:"Romero, Valeria",    dni:"38990011", dob:"15/06/1995", phone:"011-3333-4444", email:"vromero@gmail.com",      occupation:"Enfermera",  ficha:true,  sessions:[], anamnesis:{motivo:"Cervicalgia",antecedentes:"",medicacion:"",cirugias:"",deportes:"",observaciones:""} },
  { id:6,  name:"Torres, Ignacio",   dni:"27665544", dob:"22/09/1975", phone:"011-5555-6666", email:"itorres@gmail.com",      occupation:"Docente",    ficha:true,  sessions:[ {id:401,date:"06 may 2026",amount:14000,method:"transferencia",absent:false,signed:true,doctorId:"admin",findings:{}} ], anamnesis:{} },
  { id:7,  name:"Pérez, Natalia",    dni:"33221100", dob:"08/03/1990", phone:"011-7777-8888", email:"nperez@gmail.com",       occupation:"Abogada",    ficha:true,  sessions:[], anamnesis:{} },
];

const SEED_PENDING = [
  { id:"p1", name:"Suárez, Roberto", dni:"40112233", dob:"15/06/2000", phone:"011-9988-7766", email:"rsuarez@gmail.com", occupation:"Estudiante", anamnesis:{motivo:"Escoliosis leve",antecedentes:"Ninguno",medicacion:"Ninguna",cirugias:"Ninguna",deportes:"Natación",observaciones:""} },
];

const SEED_DOCTORS = [
  { id:"admin", name:"Dr. Martín Ríos", role:"admin", pattern:[0,1,2,5,8] },
];

// ─────────────────────────────────────────────────────────────────────────────
// VERTEBRAE
// ─────────────────────────────────────────────────────────────────────────────
const VERTEBRAE = [
  ...[1,2,3,4,5,6,7].map(n=>({id:`C${n}`,label:`C${n}`,region:"cervical"})),
  ...[1,2,3,4,5,6,7,8,9,10,11,12].map(n=>({id:`T${n}`,label:`T${n}`,region:"thoracic"})),
  ...[1,2,3,4,5].map(n=>({id:`L${n}`,label:`L${n}`,region:"lumbar"})),
  {id:"S",label:"Sacro",region:"sacrum"},{id:"Co",label:"Cóc",region:"coccyx"},
];
const RM = { cervical:{label:"Cervical",color:"#1565c0",bg:"#e3f2fd"}, thoracic:{label:"Torácica",color:"#2e7d32",bg:"#e8f5e9"}, lumbar:{label:"Lumbar",color:"#6a1b9a",bg:"#f3e5f5"}, sacrum:{label:"Sacro",color:"#e65100",bg:"#fff3e0"}, coccyx:{label:"Cóccix",color:"#4e342e",bg:"#efebe9"} };
const FT = [ {id:"subluxacion",label:"Subluxación",color:T.red,light:"#fdecea"}, {id:"restriccion",label:"Restricción",color:T.orange,light:"#fef0e6"}, {id:"tension",label:"Tensión muscular",color:T.yellow,light:"#fefce6"}, {id:"inflamacion",label:"Inflamación",color:T.purple,light:"#f5eefa"} ];
const TECH = ["Diversificada","Gonstead","Thompson","Activador","SOT","Toggle Recoil","Flexión-Distracción","NUCCA"];

function geom(v) {
  const wM={cervical:[22,22,22,23,24,24,25],thoracic:[26,27,28,29,30,30,31,31,31,30,30,29],lumbar:[34,36,38,38,37],sacrum:[44],coccyx:[22]};
  const hM={cervical:14,thoracic:15,lumbar:20,sacrum:38,coccyx:14};
  const sY={cervical:28,thoracic:136,lumbar:352,sacrum:462,coccyx:508};
  const sp={cervical:15,thoracic:16,lumbar:21,sacrum:0,coccyx:0};
  const rv=VERTEBRAE.filter(x=>x.region===v.region),ri=rv.findIndex(x=>x.id===v.id);
  const wA=wM[v.region]??[30];
  return{w:wA[ri]??wA[wA.length-1],h:hM[v.region]??16,y:(sY[v.region]??30)+ri*(sp[v.region]??16),cx:80};
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────────────────
const fARS   = n => new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0}).format(n);
const todayStr   = () => new Date().toLocaleDateString("es-AR",{day:"numeric",month:"long",year:"numeric"});
const todayShort = () => new Date().toLocaleDateString("es-AR",{day:"numeric",month:"short",year:"numeric"});
const firstLetter = name => {
  const clean = name.replace(/^[^a-záéíóúüñ]*/i,"");
  return clean[0]?.toUpperCase() ?? "#";
};

// ─────────────────────────────────────────────────────────────────────────────
// LOGO — uses real image if provided, fallback to text mark
// ─────────────────────────────────────────────────────────────────────────────
const LOGO_URL = "https://i.imgur.com/placeholder.png"; // ← reemplazar con URL real

function Logo({ size=1, light=true }) {
  const W = Math.round(160 * size);
  const H = Math.round(80 * size);
  const textCol  = light ? "#ffffff" : "#0d1f3c";
  const subCol   = light ? "rgba(255,255,255,0.75)" : "#1a3260";
  return (
    <svg width={W} height={H} viewBox="0 0 160 80" style={{flexShrink:0,display:"block"}}>
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%"   stopColor="#1a6fc4"/>
          <stop offset="55%"  stopColor="#38b6e8"/>
          <stop offset="100%" stopColor="#2bbfbf"/>
        </linearGradient>
      </defs>

      {/* Spine — right side, curved S-shape, matching logo */}
      {/* Vertebrae blocks stacked, curving right then left */}
      {[
        {x:112,y:4, w:10,r:2},
        {x:114,y:10,w:12,r:2},
        {x:116,y:16,w:13,r:2},
        {x:117,y:22,w:14,r:2},
        {x:116,y:28,w:13,r:2},
        {x:114,y:34,w:12,r:2},
        {x:112,y:40,w:11,r:2},
        {x:110,y:46,w:10,r:2},
        {x:109,y:52,w:11,r:2},
        {x:110,y:58,w:13,r:2},
        {x:112,y:64,w:14,r:2},
      ].map((v,i)=>(
        <rect key={i} x={v.x} y={v.y} width={v.w} height={4.5} rx={v.r}
          fill="url(#lg1)" opacity={0.92}/>
      ))}
      {/* Tail flick at bottom */}
      <path d="M115 70 Q108 75 112 80 Q118 75 115 70" fill="url(#lg1)" opacity={0.85}/>

      {/* "Núkleos" — script italic style */}
      <text x="6" y="44"
        fontFamily="Palatino Linotype, Book Antiqua, Palatino, Georgia, serif"
        fontStyle="italic"
        fontWeight="400"
        fontSize="36"
        fill={textCol}
        letterSpacing="0.5">Núkleos</text>

      {/* "QUIROPRAXIA" — spaced caps */}
      <text x="6" y="62"
        fontFamily="Trebuchet MS, Gill Sans, Arial, sans-serif"
        fontWeight="600"
        fontSize="14"
        fill={subCol}
        letterSpacing="3.5">QUIROPRAXIA</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PATTERN LOCK
// ─────────────────────────────────────────────────────────────────────────────
function PatternLock({ onMatch, savedPattern, isSetup=false, onCancel }) {
  const SIZE  = 260;
  const DOT_R = 14;
  const GRID  = 3;
  const PAD   = 44;
  const STEP  = (SIZE - PAD*2) / (GRID-1);

  const dots = Array.from({length:GRID*GRID},(_,i)=>{
    const row=Math.floor(i/GRID), col=i%GRID;
    return { id:i, x:PAD+col*STEP, y:PAD+row*STEP };
  });

  const svgRef    = useRef(null);
  const pathRef   = useRef([]);   // source of truth for path (avoids stale closure)
  const firstRef  = useRef(null);
  const drawing   = useRef(false);
  const [path, setPath]   = useState([]);
  const [cur,  setCur]    = useState(null);
  const [phase, setPhase] = useState("draw");
  const [fade,  setFade]  = useState(false);

  const getPos = (e) => {
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const scaleX = SIZE / rect.width;
    const scaleY = SIZE / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return { x:(src.clientX-rect.left)*scaleX, y:(src.clientY-rect.top)*scaleY };
  };

  const nearestDot = (pos) => {
    let best=null, bestD=DOT_R*2.8;
    dots.forEach(d=>{
      const dist=Math.hypot(d.x-pos.x,d.y-pos.y);
      if(dist<bestD){bestD=dist;best=d;}
    });
    return best;
  };

  const resetState = () => {
    pathRef.current = [];
    setPath([]);
    setCur(null);
    drawing.current = false;
  };

  const flashAndReset = (status, delay=900) => {
    setFade(status);
    setTimeout(()=>{
      setFade(false);
      resetState();
      if(status==="error") setPhase(isSetup && firstRef.current ? "confirm" : "draw");
    }, delay);
  };

  const onStart = useCallback(e => {
    e.preventDefault();
    drawing.current = true;
    const p = getPos(e);
    const d = nearestDot(p);
    if(d) { pathRef.current = [d.id]; setPath([d.id]); }
    setCur(p);
  // eslint-disable-next-line
  },[]);

  const onMove = useCallback(e => {
    e.preventDefault();
    if(!drawing.current) return;
    const p = getPos(e);
    setCur(p);
    const d = nearestDot(p);
    if(d && !pathRef.current.includes(d.id)) {
      pathRef.current = [...pathRef.current, d.id];
      setPath([...pathRef.current]);
    }
  // eslint-disable-next-line
  },[]);

  const onEnd = useCallback(e => {
    e.preventDefault();
    const cur_path = pathRef.current;
    if(!drawing.current || cur_path.length < 2) { resetState(); return; }
    drawing.current = false;
    setCur(null);

    if(isSetup) {
      if(!firstRef.current) {
        firstRef.current = cur_path;
        setPhase("confirm");
        pathRef.current = [];
        setPath([]);
      } else {
        if(JSON.stringify(cur_path)===JSON.stringify(firstRef.current)) {
          setFade("success");
          setTimeout(()=>onMatch(cur_path), 700);
        } else {
          firstRef.current = null;
          setPhase("draw");
          flashAndReset("error");
        }
      }
    } else {
      if(JSON.stringify(cur_path)===JSON.stringify(savedPattern)) {
        setFade("success");
        setTimeout(()=>onMatch(), 600);
      } else {
        flashAndReset("error");
      }
    }
  // eslint-disable-next-line
  },[isSetup, savedPattern, onMatch]);

  const lineColor = fade==="error" ? "#ff5252" : fade==="success" ? T.teal : "rgba(56,182,232,0.7)";
  const dotActive = fade==="error" ? "#ff5252" : fade==="success" ? T.teal : T.blue2;

  const pathSegments = [];
  for(let i=0;i<path.length-1;i++){
    const a=dots[path[i]],b=dots[path[i+1]];
    pathSegments.push(`M${a.x},${a.y} L${b.x},${b.y}`);
  }
  const lastDot = path.length>0 ? dots[path[path.length-1]] : null;
  const liveSegment = lastDot && cur ? `M${lastDot.x},${lastDot.y} L${cur.x},${cur.y}` : "";

  const messages = {
    draw:    isSetup ? "Dibujá tu patrón" : "Dibujá el patrón",
    confirm: "Repetí el patrón para confirmar",
    error:   "Patrón incorrecto — intentá de nuevo",
    success: "✓",
  };

  return (
    <div style={{minHeight:"100vh",background:grad,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:FONT,padding:24}}>
      <div style={{marginBottom:40}}><Logo size={1.3}/></div>

      <div style={{background:"rgba(255,255,255,0.07)",backdropFilter:"blur(14px)",borderRadius:28,padding:"36px 32px",textAlign:"center",border:"1px solid rgba(255,255,255,0.12)",minWidth:300}}>
        <div style={{fontSize:12,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,255,255,0.38)",marginBottom:6}}>
          {isSetup ? "Configurar patrón" : "Acceso Doctor"}
        </div>
        <div style={{fontSize:16,color: fade==="error"?"#ff8a80": fade==="success"?T.teal:"rgba(255,255,255,0.75)",marginBottom:28,fontStyle:"italic",minHeight:24,transition:"color 0.3s"}}>
          {messages[phase]}
        </div>

        <svg ref={svgRef} width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}
          onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd}
          onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
          style={{display:"block",cursor:"crosshair",touchAction:"none",userSelect:"none"}}>

          {/* Connection lines */}
          {[...pathSegments, liveSegment].filter(Boolean).map((d,i)=>(
            <path key={i} d={d} stroke={lineColor} strokeWidth={3} strokeLinecap="round" fill="none" opacity={fade?"0.9":"0.7"} style={{transition:"stroke 0.3s"}}/>
          ))}

          {/* Dots */}
          {dots.map(d => {
            const active = path.includes(d.id);
            return (
              <g key={d.id}>
                <circle cx={d.x} cy={d.y} r={DOT_R*1.8} fill={active?"rgba(56,182,232,0.08)":"transparent"}/>
                <circle cx={d.x} cy={d.y} r={DOT_R*0.38}
                  fill={active ? dotActive : "rgba(255,255,255,0.25)"}
                  style={{transition:"fill 0.2s, r 0.2s"}}/>
                <circle cx={d.x} cy={d.y} r={active?DOT_R*0.85:DOT_R*0.58}
                  fill="none" stroke={active?dotActive:"rgba(255,255,255,0.35)"}
                  strokeWidth={active?2:1.5}
                  style={{transition:"all 0.2s"}}/>
              </g>
            );
          })}
        </svg>

        {onCancel && (
          <button onClick={onCancel} style={{marginTop:16,background:"none",border:"none",color:"rgba(255,255,255,0.3)",fontSize:13,cursor:"pointer",textDecoration:"underline",fontFamily:FONT}}>Cancelar</button>
        )}
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-10px)}40%,80%{transform:translateX(10px)}}`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED UI
// ─────────────────────────────────────────────────────────────────────────────
function Btn({children,onClick,disabled,variant="primary",small,full}){
  const vs={primary:{bg:T.navy,color:"#fff",border:"none"},blue:{bg:T.blue1,color:"#fff",border:"none"},outline:{bg:"transparent",color:T.navy,border:`1.5px solid ${T.navy}`},danger:{bg:"#fff",color:T.red,border:`1.5px solid ${T.red}`},green:{bg:T.green,color:"#fff",border:"none"},ghost:{bg:"rgba(255,255,255,0.1)",color:"#fff",border:"1px solid rgba(255,255,255,0.2)"}};
  const s=vs[variant]??vs.primary;
  return <button onClick={onClick} disabled={disabled} style={{padding:small?"8px 16px":"14px 22px",borderRadius:11,border:s.border,background:disabled?"#cdd5e0":s.bg,color:disabled?"#8a96aa":s.color,fontSize:small?12:14,fontWeight:"bold",letterSpacing:1,textTransform:"uppercase",fontFamily:FONT2,cursor:disabled?"not-allowed":"pointer",width:full?"100%":"auto",transition:"all 0.18s",boxShadow:disabled?"none":"0 2px 8px rgba(0,0,0,0.1)"}}>{children}</button>;
}
function Pill({children,color=T.navy,bg="#e3f2fd"}){return <span style={{display:"inline-block",background:bg,color,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:"bold",letterSpacing:1,textTransform:"uppercase",fontFamily:FONT2}}>{children}</span>;}
function Tag({method}){return method==="transferencia"?<Pill color="#1565c0" bg="#dbeafe">📲 Transf.</Pill>:<Pill color={T.green} bg="#dcfce7">💵 Efectivo</Pill>;}

function SigCanvas({onSigned,clearTick,height=140,canvasRef:externalRef}){
  const internalRef=useRef(null);
  const ref = externalRef || internalRef;
  const dr=useRef(false),last=useRef(null),mk=useRef(false);
  const p=(e,c)=>{const r=c.getBoundingClientRect(),sx=c.width/r.width,sy=c.height/r.height,src=e.touches?e.touches[0]:e;return{x:(src.clientX-r.left)*sx,y:(src.clientY-r.top)*sy};};
  useEffect(()=>{const c=ref.current;c.getContext("2d").clearRect(0,0,c.width,c.height);mk.current=false;dr.current=false;},[clearTick]);
  const start=useCallback(e=>{e.preventDefault();dr.current=true;last.current=p(e,ref.current);},[]);
  const move=useCallback(e=>{e.preventDefault();if(!dr.current)return;const c=ref.current,ctx=c.getContext("2d"),pt=p(e,c);ctx.beginPath();ctx.moveTo(last.current.x,last.current.y);ctx.lineTo(pt.x,pt.y);ctx.strokeStyle=T.navy;ctx.lineWidth=2.5;ctx.lineCap="round";ctx.stroke();last.current=pt;if(!mk.current){mk.current=true;onSigned&&onSigned(true);}},[onSigned]);
  const end=useCallback(()=>{dr.current=false;},[]);
  return <canvas ref={ref} width={900} height={220} onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end} onTouchStart={start} onTouchMove={move} onTouchEnd={end} style={{width:"100%",height,display:"block",cursor:"crosshair",touchAction:"none"}}/>;
}

function Spine({findings={},onSelect,selected}){
  return(
    <svg viewBox="0 0 160 540" style={{width:"100%",maxWidth:162,display:"block",margin:"0 auto"}}>
      <line x1={80} y1={18} x2={80} y2={530} stroke={T.border} strokeWidth={1.2} strokeDasharray="3,3"/>
      {VERTEBRAE.map(v=>{
        const{w,h,y,cx}=geom(v),f=findings[v.id],ft=f?FT.find(x=>x.id===f.findingId):null;
        const isSel=selected===v.id,rm=RM[v.region];
        const fill=ft?ft.color:isSel?T.navyMid:rm.bg,stroke=ft?ft.color:isSel?T.navy:rm.color;
        const nw=Math.max(4,w*0.18),nh=h*0.35;
        return(
          <g key={v.id} onClick={()=>onSelect&&onSelect(v.id)} style={{cursor:onSelect?"pointer":"default"}}>
            {v.region!=="sacrum"&&v.region!=="coccyx"&&(<><rect x={cx-w/2-5} y={y+h*0.3} width={5} height={h*0.4} rx={2} fill={stroke} opacity={0.25}/><rect x={cx+w/2} y={y+h*0.3} width={5} height={h*0.4} rx={2} fill={stroke} opacity={0.25}/></>)}
            <rect x={cx-w/2} y={y} width={w} height={h} rx={v.region==="sacrum"?7:3} fill={fill} stroke={stroke} strokeWidth={isSel?2:1} opacity={ft?0.92:0.78}/>
            {v.region!=="sacrum"&&v.region!=="coccyx"&&<rect x={cx-nw/2} y={y-nh} width={nw} height={nh+2} rx={1.5} fill={stroke} opacity={0.45}/>}
            <text x={cx} y={y+h/2+3} textAnchor="middle" fontSize={v.region==="sacrum"?6.5:6} fill={ft?"#fff":rm.color} fontWeight={isSel||ft?"bold":"normal"}>{v.label}</text>
            {ft&&<circle cx={cx+w/2+9} cy={y+h/2} r={3} fill={ft.color}/>}
          </g>
        );
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC SCREEN — pro-facing, alphabetical index
// ─────────────────────────────────────────────────────────────────────────────
function PublicHome({patients,onSelect,onNewPatient,onDoctorAccess}){
  const [search,setSearch] = useState("");
  const [activeLetter,setActiveLetter] = useState(null);
  const sectionRefs = useRef({});

  // Build alphabet index from actual patients
  const letters = [...new Set(patients.map(p=>firstLetter(p.name)))].sort();

  const filtered = search.trim()
    ? patients.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||p.dni.includes(search.replace(/\D/g,"")))
    : activeLetter
      ? patients.filter(p=>firstLetter(p.name)===activeLetter)
      : patients;

  const sorted = [...filtered].sort((a,b)=>a.name.localeCompare(b.name,"es"));

  const scrollToLetter = (l) => {
    setActiveLetter(l); setSearch("");
  };

  return(
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:"#f0ecf8",fontFamily:FONT}}>

      {/* ── HEADER ── */}
      <div style={{background:grad,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 24px 12px"}}>
          <Logo size={0.95}/>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",letterSpacing:2,textTransform:"uppercase",marginRight:4}}>{todayStr()}</div>
            <button onClick={onNewPatient}
              style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:10,padding:"10px 16px",color:"#fff",cursor:"pointer",fontSize:13,fontFamily:FONT2,letterSpacing:0.5,display:"flex",alignItems:"center",gap:6,fontWeight:"bold"}}>
              <span style={{fontSize:16}}>+</span> Nuevo paciente
            </button>
            <button onClick={onDoctorAccess}
              style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,padding:"10px 16px",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:12,fontFamily:FONT2,letterSpacing:1,display:"flex",alignItems:"center",gap:7}}>
              <span style={{fontSize:15}}>🔒</span> Doctor
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div style={{padding:"0 24px 18px"}}>
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",fontSize:17,color:"rgba(255,255,255,0.35)"}}>🔍</span>
            <input value={search} onChange={e=>{setSearch(e.target.value);setActiveLetter(null);}}
              placeholder="Buscar paciente por nombre o DNI…"
              style={{width:"100%",boxSizing:"border-box",padding:"14px 18px 14px 46px",fontSize:16,fontFamily:FONT,border:"none",borderRadius:14,background:"rgba(255,255,255,0.12)",color:"#fff",outline:"none",backdropFilter:"blur(8px)"}}
            />
            {(search||activeLetter) && (
              <button onClick={()=>{setSearch("");setActiveLetter(null);}} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:18}}>×</button>
            )}
          </div>
        </div>
      </div>

      {/* ── BODY: index + list ── */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>

        {/* Alphabetical index sidebar */}
        <div style={{width:44,background:T.white,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",alignItems:"center",paddingTop:8,gap:2,overflowY:"auto",flexShrink:0}}>
          <button onClick={()=>{setActiveLetter(null);setSearch("");}}
            style={{width:32,height:22,borderRadius:6,border:"none",background:!activeLetter&&!search?T.navy:"transparent",color:!activeLetter&&!search?"#fff":T.muted,fontSize:10,cursor:"pointer",fontFamily:FONT2,fontWeight:"bold",marginBottom:4}}>
            Todos
          </button>
          {letters.map(l=>(
            <button key={l} onClick={()=>scrollToLetter(l)}
              style={{width:32,height:28,borderRadius:6,border:"none",background:activeLetter===l?T.blue1:"transparent",color:activeLetter===l?"#fff":T.muted,fontSize:14,fontWeight:"bold",cursor:"pointer",fontFamily:FONT2,transition:"all 0.15s"}}>
              {l}
            </button>
          ))}
        </div>

        {/* Patient list */}
        <div style={{flex:1,overflowY:"auto",padding:"0"}}>
          {sorted.length===0 ? (
            <div style={{padding:"48px 24px",textAlign:"center",color:T.muted,fontStyle:"italic",fontSize:15}}>
              No se encontraron pacientes
            </div>
          ) : (
            sorted.map((p,i) => {
              const last = p.sessions[0];
              const showLetter = i===0 || firstLetter(sorted[i-1].name)!==firstLetter(p.name);
              return (
                <div key={p.id}>
                  {showLetter && (
                    <div style={{padding:"10px 20px 6px",fontSize:12,fontWeight:"bold",letterSpacing:3,color:T.blue1,textTransform:"uppercase",background:"#f0ecf8",borderBottom:`1px solid ${T.border}`,fontFamily:FONT2}}>
                      {firstLetter(p.name)}
                    </div>
                  )}
                  <div onClick={()=>onSelect(p)}
                    style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"15px 20px",background:T.white,borderBottom:`1px solid ${T.border}`,cursor:"pointer",transition:"background 0.12s"}}>
                    <div style={{display:"flex",alignItems:"center",gap:14}}>
                      <div style={{width:42,height:42,borderRadius:"50%",background:grad,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:"bold",flexShrink:0,fontFamily:FONT2}}>
                        {p.name.split(",")[0]?.[0]?.toUpperCase()??""}{p.name.split(", ")?.[1]?.[0]?.toUpperCase()??""}
                      </div>
                      <div>
                        <div style={{fontSize:16,color:T.ink,fontWeight:"bold",fontFamily:FONT}}>{p.name}</div>
                        <div style={{fontSize:12,color:T.muted,marginTop:2,fontFamily:FONT2}}>
                          DNI {p.dni}
                          {last && <span> · Última sesión: {last.date}</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
                      {!p.ficha && <Pill color={T.orange} bg="#fff3e0">Sin ficha</Pill>}
                      {last && <Tag method={last.method}/>}
                      <div style={{textAlign:"right",minWidth:36}}>
                        <div style={{fontSize:19,fontWeight:"bold",color:T.navy,fontFamily:FONT2}}>{p.sessions.length}</div>
                        <div style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:1,fontFamily:FONT2}}>ses.</div>
                      </div>
                      <span style={{fontSize:20,color:T.border}}>›</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}


        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC — SESSION SETUP + SIGN
// ─────────────────────────────────────────────────────────────────────────────
function PublicSession({patient,onBack,onSave,sigCanvasRef}){
  const last = patient.sessions[0];
  const [amount,setAmount] = useState(last?String(last.amount):"");
  const [method,setMethod] = useState(last?last.method:"efectivo");
  const [absent,setAbsent] = useState(false);
  const [signed,setSigned] = useState(false);
  const [clearTick,setClearTick] = useState(0);
  const [saving,setSaving] = useState(false);
  // Mini signature canvases for history — stored as data URLs
  const sigImgs = patient.sessions.map(s=>s.sigImg||null);

  const doSave = async() => {
    setSaving(true);
    await new Promise(r=>setTimeout(r,1200));
    onSave({amount:Number(amount),method,absent,signed:!absent});
  };

  // ── SETUP — doctor fills amount ─────────────────────────────────────────────
  if(!amount || saving===false && amount==="__setup__") { /* never */ }

  // Single unified view: doctor sets amount at top, patient sees history + signs below
  return(
    <div style={{minHeight:"100vh",background:"#f0f4fa",display:"flex",flexDirection:"column",fontFamily:FONT}}>

      {/* Header */}
      <div style={{background:grad,padding:"14px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={onBack} style={{background:"none",border:"none",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:26,padding:0,lineHeight:1}}>‹</button>
          <Logo size={0.75}/>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:16,color:"#fff",fontStyle:"italic"}}>{patient.name}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.45)",fontFamily:FONT2}}>{todayStr()} · Sesión #{patient.sessions.length+1}</div>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto"}}>

        {/* ── DOCTOR ZONE: amount + method ── */}
        <div style={{background:T.navy,padding:"18px 22px",borderBottom:`3px solid ${T.blue1}`}}>
          <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,255,255,0.4)",marginBottom:12,fontFamily:FONT2}}>
            Configurar sesión
          </div>
          <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
            {/* Amount */}
            <div style={{flex:1}}>
              {last&&<div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginBottom:6,fontFamily:FONT2}}>Anterior: {fARS(last.amount)}</div>}
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:T.blue2,fontWeight:"bold",fontSize:20,fontFamily:FONT2}}>$</span>
                <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0"
                  style={{width:"100%",boxSizing:"border-box",padding:"12px 14px 12px 30px",fontSize:24,fontFamily:FONT,border:`2px solid ${amount?T.blue2:"rgba(255,255,255,0.2)"}`,borderRadius:10,outline:"none",background:"rgba(255,255,255,0.08)",color:"#fff",transition:"border-color 0.2s"}}/>
              </div>
            </div>
            {/* Method */}
            <div style={{display:"flex",flexDirection:"column",gap:7,paddingTop:20}}>
              {["efectivo","transferencia"].map(m=>(
                <button key={m} onClick={()=>setMethod(m)}
                  style={{padding:"8px 14px",borderRadius:9,border:`1.5px solid ${method===m?T.blue2:"rgba(255,255,255,0.2)"}`,background:method===m?"rgba(56,182,232,0.2)":"transparent",color:method===m?T.blue2:"rgba(255,255,255,0.4)",fontSize:12,cursor:"pointer",fontFamily:FONT2,fontWeight:method===m?"bold":"normal",whiteSpace:"nowrap"}}>
                  {m==="efectivo"?"💵 Efectivo":"📲 Transf."}
                </button>
              ))}
            </div>
          </div>
          {/* Absent toggle */}
          <button onClick={()=>setAbsent(a=>!a)}
            style={{marginTop:12,width:"100%",padding:"9px",borderRadius:9,border:`1.5px solid ${absent?"#fb923c":"rgba(255,255,255,0.15)"}`,background:absent?"rgba(251,146,60,0.15)":"transparent",color:absent?"#fb923c":"rgba(255,255,255,0.35)",fontSize:12,cursor:"pointer",fontFamily:FONT2,transition:"all 0.2s"}}>
            {absent?"⚠️ Marcado como ausente — tocar para desmarcar":"Marcar como ausente (sin firma)"}
          </button>
        </div>

        {/* ── PATIENT ZONE: history + sign ── */}
        <div style={{padding:"20px 20px 20px"}}>

          {/* Session history */}
          {patient.sessions.length===0 ? (
            <div style={{textAlign:"center",padding:"28px 0",color:T.muted,fontStyle:"italic",fontSize:16}}>
              ¡Bienvenido/a! Esta es tu primera sesión.
            </div>
          ) : (
            <div>
              <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:T.muted,marginBottom:14,fontFamily:FONT2,textAlign:"center"}}>
                Tus sesiones anteriores
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
                {[...patient.sessions].reverse().map((s,i)=>(
                  <div key={s.id} style={{background:T.white,borderRadius:14,padding:"12px 16px",border:`1px solid ${T.border}`,borderLeft:`4px solid ${s.absent?T.orange:T.green}`,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                    {/* Date + status */}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:14,fontWeight:"bold",color:T.ink,fontFamily:FONT}}>{s.date}</div>
                      <div style={{fontSize:11,color:s.absent?T.orange:T.green,fontFamily:FONT2,marginTop:2}}>
                        {s.absent?"⚠️ Ausente":"✓ Firmado"}
                      </div>
                    </div>
                    {/* Amount */}
                    <div style={{fontSize:14,fontWeight:"bold",color:T.navy,fontFamily:FONT2,textAlign:"right",flexShrink:0}}>
                      {fARS(s.amount)}
                    </div>
                    {/* Signature thumbnail */}
                    {s.sigImg ? (
                      <div style={{width:80,height:40,borderRadius:8,border:`1px solid ${T.border}`,overflow:"hidden",flexShrink:0,background:"#fafaf8"}}>
                        <img src={s.sigImg} alt="firma" style={{width:"100%",height:"100%",objectFit:"contain"}}/>
                      </div>
                    ) : !s.absent ? (
                      <div style={{width:80,height:40,borderRadius:8,border:`1px dashed ${T.border}`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:"#fafaf8"}}>
                        <span style={{fontSize:10,color:T.muted,fontFamily:FONT2}}>sin img</span>
                      </div>
                    ) : (
                      <div style={{width:80,flexShrink:0}}/>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Today's session + signature */}
          {!absent && (
            <div style={{background:T.white,borderRadius:16,padding:"20px",boxShadow:"0 4px 20px rgba(0,0,0,0.08)",border:`2px solid ${amount?T.blue1:T.border}`}}>
              {/* Today info */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,paddingBottom:14,borderBottom:`1px solid ${T.border}`}}>
                <div>
                  <div style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:T.muted,fontFamily:FONT2}}>Sesión de hoy</div>
                  <div style={{fontSize:13,color:T.ink,fontFamily:FONT2,marginTop:2}}>{todayStr()}</div>
                  <div style={{fontSize:22,fontWeight:"bold",color:T.blue1,fontFamily:FONT2,marginTop:4}}>
                    #{patient.sessions.length + 1}
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:32,fontWeight:"bold",color:T.navy,fontFamily:FONT2,lineHeight:1}}>
                    {amount?fARS(Number(amount)):"—"}
                  </div>
                  <div style={{marginTop:6}}><Tag method={method}/></div>
                </div>
              </div>

              {/* Signature area */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:12,letterSpacing:2,textTransform:"uppercase",color:T.muted,fontFamily:FONT2}}>Tu firma</span>
                <button onClick={()=>{setClearTick(c=>c+1);setSigned(false);}}
                  style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.muted,textDecoration:"underline",fontFamily:FONT2}}>
                  Limpiar
                </button>
              </div>
              <div style={{border:`2px dashed ${signed?T.blue1:T.border}`,borderRadius:14,background:signed?"#f0f8ff":"#fafaf8",overflow:"hidden",position:"relative",minHeight:150,marginBottom:16,transition:"all 0.3s"}}>
                {!signed&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",color:"#ccc",fontSize:16,fontStyle:"italic"}}>Firmá aquí con el dedo</div>}
                <SigCanvas onSigned={setSigned} clearTick={clearTick} height={150} canvasRef={sigCanvasRef}/>
              </div>
              {signed&&<div style={{fontSize:13,color:T.green,marginBottom:14,fontFamily:FONT2}}>✓ Firma registrada</div>}

              <button onClick={doSave} disabled={!signed||saving||!amount}
                style={{width:"100%",padding:"16px",borderRadius:12,border:"none",fontFamily:FONT2,
                  background:saving?T.green:signed&&amount?T.blue1:T.border,
                  color:saving||signed&&amount?"#fff":"#aaa",
                  fontSize:15,fontWeight:"bold",letterSpacing:2,textTransform:"uppercase",
                  cursor:signed&&amount&&!saving?"pointer":"not-allowed",
                  transition:"all 0.25s",
                  boxShadow:signed&&amount?"0 4px 20px rgba(26,111,196,0.28)":"none"}}>
                {saving?"✓ ¡Gracias! Hasta la próxima":"Confirmar y firmar →"}
              </button>
            </div>
          )}

          {/* Absent — just save button */}
          {absent && (
            <div style={{background:T.white,borderRadius:16,padding:"20px",border:`2px solid ${T.orange}`,textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:12}}>⚠️</div>
              <div style={{fontSize:16,color:T.orange,fontWeight:"bold",fontFamily:FONT2,marginBottom:6}}>Sesión registrada como ausente</div>
              <div style={{fontSize:13,color:T.muted,marginBottom:20,fontFamily:FONT2}}>{todayStr()}</div>
              <button onClick={doSave} disabled={saving||!amount}
                style={{width:"100%",padding:"15px",borderRadius:12,border:"none",fontFamily:FONT2,background:saving?T.green:T.orange,color:"#fff",fontSize:14,fontWeight:"bold",letterSpacing:2,textTransform:"uppercase",cursor:"pointer",transition:"all 0.25s"}}>
                {saving?"✓ Guardado":"Guardar sesión →"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC — NEW PATIENT
// ─────────────────────────────────────────────────────────────────────────────
function PublicNewPatient({onBack,onDone}){
  const STEPS = ["Datos","Salud","Síntomas","Antecedentes","Firma"];
  const [step,setStep]   = useState(0);
  const [form,setForm]   = useState({});
  const [anam,setAnam]   = useState({});
  const [syms,setSyms]   = useState({});   // symptom checkboxes
  const [bodyPts,setBodyPts] = useState([]); // [{x,y,view}] pain points on body
  const [intensity,setIntensity] = useState(null);
  const [interference,setInterf] = useState({});
  const [signed,setSigned]   = useState(false);
  const [clearTick,setClearTick] = useState(0);
  const [saving,setSaving]   = useState(false);
  const sf = (k,v) => setForm(p=>({...p,[k]:v}));
  const sa = (k,v) => setAnam(p=>({...p,[k]:v}));

  // Auto-format date
  const handleDob = raw => {
    const d=raw.replace(/\D/g,"").slice(0,8);
    let o=d;
    if(d.length>4) o=d.slice(0,2)+"/"+d.slice(2,4)+"/"+d.slice(4);
    else if(d.length>2) o=d.slice(0,2)+"/"+d.slice(2);
    sf("dob",o);
  };
  const handleDni = raw => {
    const d=raw.replace(/\D/g,"").slice(0,8);
    let o=d;
    if(d.length>6) o=d.slice(0,2)+"."+d.slice(2,5)+"."+d.slice(5);
    else if(d.length>2) o=d.slice(0,2)+"."+d.slice(2);
    sf("dni",o);
  };

  const canNext0 = form.nombre?.trim()&&form.apellido?.trim()&&form.dni?.trim()&&form.dob?.length===10&&form.phone?.trim();

  const finish = async () => {
    setSaving(true);
    await new Promise(r=>setTimeout(r,1100));
    onDone({
      ...form,
      name: (form.apellido?.trim()+", "+form.nombre?.trim()),
      anamnesis: { ...anam, symptoms:syms, bodyPoints:bodyPts, intensity, interference },
    });
  };

  // ── SYMPTOM LIST ─────────────────────────────────────────────────────────────
  const SYMPTOMS = [
    "Cansancio/Fatiga","Falta de concentración","Náuseas/Vómitos",
    "Dolor de cabeza","Mareos/Vértigo","Falta de movilidad",
    "Debilidad muscular","Problemas respiratorios","Zumbidos en oídos",
    "Alteración en la visión","Adormec. brazos/manos","Adormec. piernas/pies",
    "Hipertensión","Problemas cardíacos","Diabetes","Tumores",
  ];

  const INTERF = ["Trabajo","Descanso","Vida diaria","Relaciones familiares","Humor"];

  // ── MOTIVO OPTIONS ────────────────────────────────────────────────────────────
  const MOTIVOS = ["Mejorar calidad de vida","Rendir al máximo","Dolor","Enfermedad","Otra"];

  // ── BODY DIAGRAM ─────────────────────────────────────────────────────────────
  function BodyDiagram(){
    const [activeView, setActiveView] = useState("frente");
    const svgRef = useRef(null);

    const handleTap = e => {
      const svg = svgRef.current;
      const rect = svg.getBoundingClientRect();
      const src = e.touches ? e.touches[0] : e;
      const x = ((src.clientX - rect.left) / rect.width * 100).toFixed(1);
      const y = ((src.clientY - rect.top)  / rect.height * 100).toFixed(1);
      setBodyPts(prev => [...prev, { x:parseFloat(x), y:parseFloat(y), view:activeView, id:Date.now() }]);
    };

    const myPts = bodyPts.filter(p=>p.view===activeView);

    // Simple body silhouette paths per view
    const BODIES = {
      frente: (
        <g>
          {/* Head */}
          <ellipse cx="50" cy="12" rx="10" ry="11" fill="#e8eef8" stroke="#1a3260" strokeWidth="1.2"/>
          {/* Neck */}
          <rect x="45" y="22" width="10" height="7" rx="3" fill="#e8eef8" stroke="#1a3260" strokeWidth="1"/>
          {/* Torso */}
          <path d="M30 29 Q25 32 24 55 Q24 70 30 72 L70 72 Q76 70 76 55 Q75 32 70 29 Z" fill="#e8eef8" stroke="#1a3260" strokeWidth="1.2"/>
          {/* Left arm */}
          <path d="M30 30 Q18 35 16 60 Q15 68 20 70 Q25 71 27 65 Q28 50 33 38 Z" fill="#e8eef8" stroke="#1a3260" strokeWidth="1"/>
          {/* Right arm */}
          <path d="M70 30 Q82 35 84 60 Q85 68 80 70 Q75 71 73 65 Q72 50 67 38 Z" fill="#e8eef8" stroke="#1a3260" strokeWidth="1"/>
          {/* Left hand */}
          <ellipse cx="19" cy="73" rx="5" ry="7" fill="#e8eef8" stroke="#1a3260" strokeWidth="1"/>
          {/* Right hand */}
          <ellipse cx="81" cy="73" rx="5" ry="7" fill="#e8eef8" stroke="#1a3260" strokeWidth="1"/>
          {/* Left leg */}
          <path d="M38 72 Q34 85 33 100 Q32 112 36 113 Q42 114 44 100 Q46 86 46 72 Z" fill="#e8eef8" stroke="#1a3260" strokeWidth="1"/>
          {/* Right leg */}
          <path d="M62 72 Q66 85 67 100 Q68 112 64 113 Q58 114 56 100 Q54 86 54 72 Z" fill="#e8eef8" stroke="#1a3260" strokeWidth="1"/>
          {/* Left foot */}
          <ellipse cx="35" cy="116" rx="6" ry="4" fill="#e8eef8" stroke="#1a3260" strokeWidth="1"/>
          {/* Right foot */}
          <ellipse cx="65" cy="116" rx="6" ry="4" fill="#e8eef8" stroke="#1a3260" strokeWidth="1"/>
        </g>
      ),
      espalda: (
        <g>
          <ellipse cx="50" cy="12" rx="10" ry="11" fill="#e8eef8" stroke="#1a3260" strokeWidth="1.2"/>
          <rect x="45" y="22" width="10" height="7" rx="3" fill="#e8eef8" stroke="#1a3260" strokeWidth="1"/>
          <path d="M30 29 Q25 32 24 55 Q24 70 30 72 L70 72 Q76 70 76 55 Q75 32 70 29 Z" fill="#dde6f4" stroke="#1a3260" strokeWidth="1.2"/>
          {/* Spine line */}
          <line x1="50" y1="29" x2="50" y2="72" stroke="#1a6fc4" strokeWidth="1" strokeDasharray="2,2" opacity="0.5"/>
          <path d="M30 30 Q18 35 16 60 Q15 68 20 70 Q25 71 27 65 Q28 50 33 38 Z" fill="#e8eef8" stroke="#1a3260" strokeWidth="1"/>
          <path d="M70 30 Q82 35 84 60 Q85 68 80 70 Q75 71 73 65 Q72 50 67 38 Z" fill="#e8eef8" stroke="#1a3260" strokeWidth="1"/>
          <ellipse cx="19" cy="73" rx="5" ry="7" fill="#e8eef8" stroke="#1a3260" strokeWidth="1"/>
          <ellipse cx="81" cy="73" rx="5" ry="7" fill="#e8eef8" stroke="#1a3260" strokeWidth="1"/>
          <path d="M38 72 Q34 85 33 100 Q32 112 36 113 Q42 114 44 100 Q46 86 46 72 Z" fill="#e8eef8" stroke="#1a3260" strokeWidth="1"/>
          <path d="M62 72 Q66 85 67 100 Q68 112 64 113 Q58 114 56 100 Q54 86 54 72 Z" fill="#e8eef8" stroke="#1a3260" strokeWidth="1"/>
          <ellipse cx="35" cy="116" rx="6" ry="4" fill="#e8eef8" stroke="#1a3260" strokeWidth="1"/>
          <ellipse cx="65" cy="116" rx="6" ry="4" fill="#e8eef8" stroke="#1a3260" strokeWidth="1"/>
        </g>
      ),
    };

    return (
      <div>
        {/* View selector */}
        <div style={{display:"flex",gap:8,marginBottom:12,justifyContent:"center"}}>
          {["frente","espalda","derecha","izquierda"].map(v=>(
            <button key={v} onClick={()=>setActiveView(v)}
              style={{padding:"6px 12px",borderRadius:8,border:`1.5px solid ${activeView===v?T.blue1:T.border}`,background:activeView===v?"#dbeafe":T.cream,color:activeView===v?T.blue1:T.muted,fontSize:11,fontWeight:activeView===v?"bold":"normal",cursor:"pointer",fontFamily:FONT2,textTransform:"capitalize"}}>
              {v}
            </button>
          ))}
        </div>
        <div style={{fontSize:11,color:T.muted,textAlign:"center",marginBottom:8,fontFamily:FONT2}}>
          Tocá el cuerpo para marcar la zona de dolor
        </div>
        <div style={{display:"flex",gap:20,alignItems:"flex-start"}}>
          {/* SVG body */}
          <div style={{flex:1,position:"relative"}}>
            <svg ref={svgRef} viewBox="0 0 100 125"
              style={{width:"100%",maxWidth:200,display:"block",margin:"0 auto",cursor:"crosshair",touchAction:"none"}}
              onClick={handleTap} onTouchEnd={handleTap}>
              {BODIES[activeView] || BODIES.frente}
              {/* Pain points */}
              {myPts.map(pt=>(
                <g key={pt.id}>
                  <circle cx={pt.x} cy={pt.y} r="3.5" fill="#e53935" opacity="0.85"/>
                  <circle cx={pt.x} cy={pt.y} r="5.5" fill="none" stroke="#e53935" strokeWidth="1" opacity="0.5"/>
                </g>
              ))}
            </svg>
          </div>
          {/* Controls */}
          <div style={{width:140}}>
            <div style={{fontSize:11,letterSpacing:1,textTransform:"uppercase",color:T.muted,marginBottom:8,fontFamily:FONT2}}>Zonas marcadas</div>
            {bodyPts.length===0
              ? <div style={{fontSize:12,color:T.muted,fontStyle:"italic",fontFamily:FONT2}}>Ninguna aún</div>
              : <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  {bodyPts.map((pt,i)=>(
                    <div key={pt.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:11,fontFamily:FONT2,background:"#fdecea",borderRadius:6,padding:"4px 8px"}}>
                      <span style={{color:T.red}}>● {pt.view}</span>
                      <button onClick={()=>setBodyPts(p=>p.filter(x=>x.id!==pt.id))}
                        style={{background:"none",border:"none",color:T.muted,cursor:"pointer",fontSize:13,padding:0}}>×</button>
                    </div>
                  ))}
                </div>
            }
            {bodyPts.length>0&&(
              <button onClick={()=>setBodyPts([])}
                style={{marginTop:8,fontSize:11,color:T.muted,background:"none",border:`1px solid ${T.border}`,borderRadius:6,padding:"4px 8px",cursor:"pointer",fontFamily:FONT2,width:"100%"}}>
                Limpiar todo
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── PROGRESS BAR ──────────────────────────────────────────────────────────────
  function ProgressBar(){
    return(
      <div style={{display:"flex",alignItems:"center",gap:0,paddingBottom:14}}>
        {STEPS.map((s,i)=>(
          <div key={s} style={{display:"flex",alignItems:"center",flex:i<STEPS.length-1?1:"auto"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{width:28,height:28,borderRadius:"50%",
                background:i<step?"#fff":i===step?"rgba(255,255,255,0.92)":"rgba(255,255,255,0.18)",
                color:i<step?T.blue1:i===step?T.navy:"rgba(255,255,255,0.4)",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:11,fontWeight:"bold",fontFamily:FONT2,transition:"all 0.3s"}}>
                {i<step?"✓":i+1}
              </div>
              <span style={{fontSize:9,letterSpacing:0.5,textTransform:"uppercase",
                color:i===step?"#fff":"rgba(255,255,255,0.3)",fontFamily:FONT2,whiteSpace:"nowrap"}}>
                {s}
              </span>
            </div>
            {i<STEPS.length-1&&(
              <div style={{flex:1,height:2,background:i<step?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.15)",margin:"0 6px",marginBottom:16,transition:"all 0.3s"}}/>
            )}
          </div>
        ))}
      </div>
    );
  }

  // ── RENDER ────────────────────────────────────────────────────────────────────
  return(
    <div style={{minHeight:"100vh",background:T.white,display:"flex",flexDirection:"column",fontFamily:FONT}}>
      {/* Header */}
      <div style={{background:grad,padding:"14px 22px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <button onClick={onBack} style={{background:"none",border:"none",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:26,padding:0,lineHeight:1}}>‹</button>
          <Logo size={0.78}/>
        </div>
        <ProgressBar/>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"22px 24px",maxWidth:660,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>

        {/* ── STEP 0: Datos personales ── */}
        {step===0&&(
          <>
            <div style={{fontSize:20,color:T.navy,fontStyle:"italic",marginBottom:20}}>Tus datos personales</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              {[
                {k:"apellido",l:"Apellido",req:true,col:1},
                {k:"nombre",  l:"Nombre",  req:true,col:1},
                {k:"dni",     l:"DNI",     req:true,col:1,ph:"12.345.678",custom:handleDni},
                {k:"dob",     l:"Fecha de nac.",req:true,col:1,ph:"DD/MM/AAAA",custom:handleDob,im:"numeric"},
                {k:"phone",   l:"Tel/cel", req:true,col:1,t:"tel"},
                {k:"email",   l:"Email",   req:false,col:1,t:"email"},
                {k:"address", l:"Dirección",req:false,col:1},
                {k:"localidad",l:"Localidad",req:false,col:1},
                {k:"occupation",l:"Ocupación",req:false,col:1},
                {k:"activity", l:"Actividad física",req:false,col:1},
              ].map(f=>(
                <div key={f.k} style={{gridColumn:`span ${f.col}`}}>
                  <label style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:T.muted,display:"block",marginBottom:6,fontFamily:FONT2}}>
                    {f.l}{f.req&&<span style={{color:T.red}}> *</span>}
                  </label>
                  <input
                    type={f.t||"text"}
                    placeholder={f.ph||""}
                    inputMode={f.im||undefined}
                    value={form[f.k]||""}
                    onChange={e=>f.custom?f.custom(e.target.value):sf(f.k,e.target.value)}
                    style={{width:"100%",boxSizing:"border-box",padding:"12px 14px",fontSize:15,fontFamily:FONT,border:`1.5px solid ${T.border}`,borderRadius:10,outline:"none",background:T.cream,color:T.ink,
                      borderColor:f.k==="dob"&&form.dob?.length===10?T.green:T.border}}
                  />
                </div>
              ))}
            </div>
            <div style={{marginTop:22}}><Btn onClick={()=>setStep(1)} disabled={!canNext0} variant="blue" full>Siguiente →</Btn></div>
          </>
        )}

        {/* ── STEP 1: Historia de salud ── */}
        {step===1&&(
          <>
            <div style={{fontSize:20,color:T.navy,fontStyle:"italic",marginBottom:20}}>Historia de salud</div>

            {/* Motivo */}
            <div style={{background:"#f0f4fa",borderRadius:12,padding:"16px 18px",marginBottom:18}}>
              <div style={{fontSize:12,fontWeight:"bold",color:T.navy,marginBottom:12,fontFamily:FONT2}}>¿Motivo de consulta?</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>
                {MOTIVOS.map(m=>(
                  <button key={m} onClick={()=>sa("motivo",anam.motivo===m?"":m)}
                    style={{padding:"8px 14px",borderRadius:8,border:`1.5px solid ${anam.motivo===m?T.blue1:T.border}`,background:anam.motivo===m?"#dbeafe":T.white,color:anam.motivo===m?T.blue1:T.ink,fontSize:13,cursor:"pointer",fontFamily:FONT2,fontWeight:anam.motivo===m?"bold":"normal"}}>
                    {m}
                  </button>
                ))}
              </div>
              <textarea rows={2} placeholder="Breve descripción…" value={anam.descripcion||""} onChange={e=>sa("descripcion",e.target.value)}
                style={{width:"100%",boxSizing:"border-box",padding:"10px 12px",fontSize:13,fontFamily:FONT,border:`1.5px solid ${T.border}`,borderRadius:8,resize:"none",outline:"none",background:T.white}}/>
            </div>

            {/* Body diagram */}
            <div style={{background:"#f0f4fa",borderRadius:12,padding:"16px 18px",marginBottom:18}}>
              <div style={{fontSize:12,fontWeight:"bold",color:T.navy,marginBottom:12,fontFamily:FONT2}}>
                Si vino por dolor, indicá la zona afectada
              </div>
              <BodyDiagram/>

              {/* Intensity */}
              <div style={{marginTop:16}}>
                <div style={{fontSize:12,fontWeight:"bold",color:T.navy,marginBottom:10,fontFamily:FONT2}}>
                  Intensidad del dolor: <span style={{color:T.blue1}}>{intensity!==null?intensity:"—"}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:0}}>
                  {[0,1,2,3,4,5,6,7,8,9].map(n=>(
                    <button key={n} onClick={()=>setIntensity(n)}
                      style={{flex:1,padding:"10px 0",border:`1px solid ${T.border}`,borderRadius:n===0?"8px 0 0 8px":n===9?"0 8px 8px 0":"0",
                        background:intensity===n?`hsl(${120-n*13},70%,45%)`:intensity!==null&&n<intensity?`hsl(${120-n*13},40%,85%)`:"#f8f8f8",
                        color:intensity===n?"#fff":T.ink,fontSize:13,fontWeight:intensity===n?"bold":"normal",cursor:"pointer",fontFamily:FONT2,transition:"all 0.15s"}}>
                      {n}
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.muted,fontFamily:FONT2,marginTop:4}}>
                  <span>LEVE</span><span>INTENSO</span>
                </div>
              </div>
            </div>

            {/* Desde cuándo */}
            <div style={{marginBottom:18}}>
              <label style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:T.muted,display:"block",marginBottom:8,fontFamily:FONT2}}>¿Desde cuándo tiene este problema?</label>
              <input value={anam.desdeCuando||""} onChange={e=>sa("desdeCuando",e.target.value)} placeholder="Ej: hace 3 meses, desde 2020…"
                style={{width:"100%",boxSizing:"border-box",padding:"12px 14px",fontSize:15,fontFamily:FONT,border:`1.5px solid ${T.border}`,borderRadius:10,outline:"none",background:T.cream}}/>
            </div>

            {/* Interference */}
            <div style={{background:"#f0f4fa",borderRadius:12,padding:"16px 18px",marginBottom:18}}>
              <div style={{fontSize:12,fontWeight:"bold",color:T.navy,marginBottom:12,fontFamily:FONT2}}>
                Esta condición interfiere en:
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {INTERF.map(it=>(
                  <button key={it} onClick={()=>setInterf(p=>({...p,[it]:!p[it]}))}
                    style={{padding:"8px 14px",borderRadius:8,border:`1.5px solid ${interference[it]?T.blue1:T.border}`,background:interference[it]?"#dbeafe":T.white,color:interference[it]?T.blue1:T.ink,fontSize:13,cursor:"pointer",fontFamily:FONT2,fontWeight:interference[it]?"bold":"normal"}}>
                    {it}
                  </button>
                ))}
              </div>
            </div>

            <div style={{display:"flex",gap:12}}>
              <Btn onClick={()=>setStep(0)} variant="outline" small>← Atrás</Btn>
              <Btn onClick={()=>setStep(2)} variant="blue" full>Siguiente →</Btn>
            </div>
          </>
        )}

        {/* ── STEP 2: Síntomas ── */}
        {step===2&&(
          <>
            <div style={{fontSize:20,color:T.navy,fontStyle:"italic",marginBottom:6}}>Síntomas</div>
            <div style={{fontSize:13,color:T.muted,marginBottom:20,fontFamily:FONT2}}>
              Marcá con una X si presentás o presentaste alguno de estos problemas
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24}}>
              {SYMPTOMS.map(s=>(
                <button key={s} onClick={()=>setSyms(p=>({...p,[s]:!p[s]}))}
                  style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:10,border:`1.5px solid ${syms[s]?T.blue1:T.border}`,background:syms[s]?"#dbeafe":T.cream,cursor:"pointer",textAlign:"left",fontFamily:FONT2,transition:"all 0.15s"}}>
                  <div style={{width:20,height:20,borderRadius:4,border:`2px solid ${syms[s]?T.blue1:T.border}`,background:syms[s]?T.blue1:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {syms[s]&&<span style={{color:"#fff",fontSize:13,fontWeight:"bold"}}>✕</span>}
                  </div>
                  <span style={{fontSize:12,color:syms[s]?T.blue1:T.ink,fontWeight:syms[s]?"bold":"normal"}}>{s}</span>
                </button>
              ))}
            </div>
            <div style={{display:"flex",gap:12}}>
              <Btn onClick={()=>setStep(1)} variant="outline" small>← Atrás</Btn>
              <Btn onClick={()=>setStep(3)} variant="blue" full>Siguiente →</Btn>
            </div>
          </>
        )}

        {/* ── STEP 3: Antecedentes ── */}
        {step===3&&(
          <>
            <div style={{fontSize:20,color:T.navy,fontStyle:"italic",marginBottom:6}}>Antecedentes</div>
            <div style={{fontSize:13,color:T.muted,marginBottom:20,fontFamily:FONT2}}>
              Marcá O y especificá según corresponda
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {[
                {k:"medicacion",   l:"Medicación",      ph:"¿Cuáles?"},
                {k:"fuma",         l:"Fuma",            ph:"¿Cantidad diaria?"},
                {k:"cirugias",     l:"Cirugías",        ph:"¿Fecha y motivo?"},
                {k:"accidentes",   l:"Accidentes",      ph:"¿Año?"},
                {k:"fracturas",    l:"Fracturas",       ph:"¿Cuáles?"},
                {k:"otrasEnferm",  l:"Otras enfermedades o condiciones", ph:"Especificá…"},
                {k:"otrosProfes",  l:"¿Ha visto otro profesional?", ph:"¿Especialidad?"},
              ].map(f=>(
                <div key={f.k} style={{background:T.cream,borderRadius:10,padding:"14px 16px",border:`1.5px solid ${T.border}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:anam[f.k+"_si"]?10:0}}>
                    <span style={{fontSize:14,fontWeight:"bold",color:T.ink,flex:1,fontFamily:FONT}}>{f.l}</span>
                    <div style={{display:"flex",gap:6}}>
                      {["SI","NO"].map(opt=>(
                        <button key={opt} onClick={()=>sa(f.k+"_si",opt==="SI")}
                          style={{padding:"6px 14px",borderRadius:7,border:`1.5px solid ${anam[f.k+"_si"]===(opt==="SI")?T.blue1:T.border}`,background:anam[f.k+"_si"]===(opt==="SI")?"#dbeafe":T.white,color:anam[f.k+"_si"]===(opt==="SI")?T.blue1:T.muted,fontSize:13,fontWeight:"bold",cursor:"pointer",fontFamily:FONT2}}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  {anam[f.k+"_si"]===true&&(
                    <input value={anam[f.k]||""} onChange={e=>sa(f.k,e.target.value)} placeholder={f.ph}
                      style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",fontSize:13,fontFamily:FONT,border:`1.5px solid ${T.border}`,borderRadius:8,outline:"none",background:T.white}}/>
                  )}
                </div>
              ))}
            </div>
            <div style={{marginTop:22,display:"flex",gap:12}}>
              <Btn onClick={()=>setStep(2)} variant="outline" small>← Atrás</Btn>
              <Btn onClick={()=>setStep(4)} variant="blue" full>Siguiente →</Btn>
            </div>
          </>
        )}

        {/* ── STEP 4: Firma ── */}
        {step===4&&(
          <>
            <div style={{fontSize:20,color:T.navy,fontStyle:"italic",marginBottom:6}}>Firma y aclaración</div>
            <div style={{fontSize:13,color:T.muted,marginBottom:24,fontFamily:FONT2}}>
              Al firmar confirmás que los datos ingresados son correctos.
            </div>
            {/* Summary */}
            <div style={{background:"#f0f4fa",borderRadius:12,padding:"14px 16px",marginBottom:20,fontSize:13,fontFamily:FONT2,color:T.ink}}>
              <div style={{fontWeight:"bold",marginBottom:6}}>{form.apellido}, {form.nombre}</div>
              <div style={{color:T.muted}}>DNI {form.dni} · {form.dob} · {form.phone}</div>
              {anam.motivo&&<div style={{marginTop:4}}>Motivo: {anam.motivo}</div>}
              {Object.keys(syms).filter(k=>syms[k]).length>0&&(
                <div style={{marginTop:4,color:T.muted}}>Síntomas: {Object.keys(syms).filter(k=>syms[k]).join(", ")}</div>
              )}
            </div>
            <div style={{border:`2px dashed ${signed?T.blue1:T.border}`,borderRadius:16,background:signed?"#f0f8ff":T.cream,overflow:"hidden",position:"relative",minHeight:160,marginBottom:12,transition:"all 0.3s"}}>
              {!signed&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",color:"#bbb",fontSize:15,fontStyle:"italic"}}>Firmá aquí</div>}
              <SigCanvas onSigned={setSigned} clearTick={clearTick} height={160}/>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}>
              <button onClick={()=>{setClearTick(c=>c+1);setSigned(false);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.muted,textDecoration:"underline",fontFamily:FONT2}}>Limpiar</button>
            </div>
            {signed&&<div style={{fontSize:13,color:T.green,marginBottom:14,fontFamily:FONT2}}>✓ Firma registrada</div>}
            {saving&&<div style={{fontSize:13,color:T.muted,fontStyle:"italic",marginBottom:14,textAlign:"center",fontFamily:FONT2}}>Tus datos serán revisados por el profesional.</div>}
            <div style={{display:"flex",gap:12}}>
              <Btn onClick={()=>setStep(3)} variant="outline" small>← Atrás</Btn>
              <button onClick={finish} disabled={!signed||saving}
                style={{flex:1,padding:"15px",borderRadius:12,border:"none",fontFamily:FONT2,background:saving?T.green:signed?T.blue1:T.border,color:saving||signed?"#fff":"#aaa",fontSize:14,fontWeight:"bold",letterSpacing:2,textTransform:"uppercase",cursor:signed&&!saving?"pointer":"not-allowed",transition:"all 0.25s"}}>
                {saving?"✓ Enviado — Gracias":"Enviar →"}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// EDIT SESSION
// ─────────────────────────────────────────────────────────────────────────────
function EditSession({session, onSave, onCancel}){
  const [amount, setAmount] = useState(String(session.amount));
  const [method, setMethod] = useState(session.method);
  const [absent, setAbsent] = useState(session.absent);
  const [saving, setSaving] = useState(false);
  const handleSave = async () => {
    setSaving(true);
    await new Promise(r=>setTimeout(r,800));
    onSave({ amount:Number(amount), method, absent });
  };
  return(
    <div style={{minHeight:"100vh",background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT,padding:24}}>
      <div style={{background:T.white,borderRadius:20,padding:"28px 30px",width:"100%",maxWidth:440,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div>
            <div style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:T.muted,fontFamily:FONT2}}>Editar sesión</div>
            <div style={{fontSize:20,fontStyle:"italic",color:T.navy,marginTop:4}}>{session.date}</div>
          </div>
          <button onClick={onCancel} style={{background:"none",border:"none",fontSize:24,color:T.muted,cursor:"pointer"}}>×</button>
        </div>
        <div style={{background:"#fff3e0",borderRadius:10,padding:"10px 14px",marginBottom:20,fontSize:12,color:T.orange,fontFamily:FONT2}}>
          ⚠️ Los cambios se actualizan en Google Sheets
        </div>
        <div style={{marginBottom:16}}>
          <label style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:T.muted,display:"block",marginBottom:8,fontFamily:FONT2}}>Monto</label>
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:T.blue1,fontWeight:"bold",fontSize:20}}>$</span>
            <input type="number" value={amount} onChange={e=>setAmount(e.target.value)}
              style={{width:"100%",boxSizing:"border-box",padding:"12px 14px 12px 30px",fontSize:22,fontFamily:FONT,border:`2px solid ${T.blue1}`,borderRadius:10,outline:"none",background:T.cream,color:T.ink}}/>
          </div>
        </div>
        <div style={{marginBottom:16}}>
          <label style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:T.muted,display:"block",marginBottom:8,fontFamily:FONT2}}>Forma de pago</label>
          <div style={{display:"flex",gap:10}}>
            {["efectivo","transferencia"].map(m=>(
              <button key={m} onClick={()=>setMethod(m)}
                style={{flex:1,padding:"11px 0",borderRadius:10,border:`2px solid ${method===m?T.blue1:T.border}`,background:method===m?"#dbeafe":T.cream,color:method===m?T.blue1:T.muted,fontWeight:method===m?"bold":"normal",fontSize:13,cursor:"pointer",fontFamily:FONT2}}>
                {m==="efectivo"?"💵 Efectivo":"📲 Transferencia"}
              </button>
            ))}
          </div>
        </div>
        <button onClick={()=>setAbsent(a=>!a)}
          style={{width:"100%",padding:"12px",borderRadius:10,border:`2px solid ${absent?T.orange:T.border}`,background:absent?"#fff3e0":T.cream,color:absent?T.orange:T.muted,fontSize:13,fontFamily:FONT2,cursor:"pointer",marginBottom:24,transition:"all 0.2s"}}>
          {absent?"⚠️ Ausente — tocar para desmarcar":"Marcar como ausente"}
        </button>
        <div style={{display:"flex",gap:12}}>
          <button onClick={onCancel} style={{flex:1,padding:"13px",borderRadius:10,border:`1.5px solid ${T.border}`,background:T.white,color:T.muted,fontSize:14,fontFamily:FONT2,cursor:"pointer"}}>Cancelar</button>
          <button onClick={handleSave} disabled={!amount||saving}
            style={{flex:2,padding:"13px",borderRadius:10,border:"none",background:saving?T.green:T.navy,color:"#fff",fontSize:14,fontWeight:"bold",fontFamily:FONT2,cursor:"pointer",transition:"all 0.2s"}}>
            {saving?"✓ Guardado":"Guardar cambios →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DoctorApp({doctor,patients,pending,onLogout,onApprovePending,onRejectPending,onUpdatePattern}){
  const [tab,setTab]=useState("pacientes");
  const [selP,setSelP]=useState(null);
  const [search,setSearch]=useState("");
  const [findings,setFindings]=useState({});
  const [selVert,setSelVert]=useState(null);
  const [fid,setFid]=useState(""),[ftech,setFtech]=useState(""),[ ,setFnotes]=useState("");
  const [changingPattern,setChangingPattern]=useState(false);
  const [editSes,setEditSes]=useState(null);
  const isAdmin=doctor.role==="admin";

  const openV=vid=>{if(selVert===vid){setSelVert(null);return;}setSelVert(vid);const ex=findings[vid];setFid(ex?.findingId??"");setFtech(ex?.technique??"");};
  const saveV=()=>{if(!fid&&!ftech)return;setFindings(p=>({...p,[selVert]:{findingId:fid,technique:ftech,notes:""}}));setSelVert(null);};
  const clearV=()=>{setFindings(p=>{const n={...p};delete n[selVert];return n;});setSelVert(null);};
  const selV2=selVert?VERTEBRAE.find(v=>v.id===selVert):null,selRM2=selV2?RM[selV2.region]:null;

  const myTotal=patients.reduce((a,p)=>a+p.sessions.filter(s=>s.doctorId===doctor.id).reduce((b,s)=>b+s.amount,0),0);
  const mySessions=patients.reduce((a,p)=>a+p.sessions.filter(s=>s.doctorId===doctor.id).length,0);
  const filtered=[...patients].filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||p.dni.includes(search.replace(/\D/g,""))).sort((a,b)=>a.name.localeCompare(b.name,"es"));

  if(changingPattern) return <PatternLock isSetup savedPattern={doctor.pattern} onMatch={np=>{onUpdatePattern(np);setChangingPattern(false);}} onCancel={()=>setChangingPattern(false)}/>;

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:"#f0ecf8",fontFamily:FONT}}>
      <div style={{background:gradH,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 22px 12px"}}>
          <Logo size={0.82}/>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {isAdmin&&<Pill color="rgba(255,255,255,0.9)" bg="rgba(255,255,255,0.12)">Admin</Pill>}
            <span style={{color:"rgba(255,255,255,0.55)",fontSize:13,fontFamily:FONT2}}>{doctor.name}</span>
            <button onClick={onLogout} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.18)",borderRadius:8,padding:"7px 14px",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:12,fontFamily:FONT2}}>Salir</button>
          </div>
        </div>
        <div style={{display:"flex",gap:0,paddingLeft:8}}>
          {[{id:"pacientes",label:"Pacientes"},{id:"finanzas",label:"Mis finanzas"},...(isAdmin?[{id:"pendientes",label:`Pendientes${pending.length>0?` (${pending.length})`:""}`,alert:pending.length>0}]:[]),{id:"ajustes",label:"Ajustes"}].map(t=>(
            <button key={t.id} onClick={()=>{setTab(t.id);setSelP(null);}} style={{padding:"10px 18px",border:"none",background:"none",fontFamily:FONT2,color:t.alert?T.orange:tab===t.id?"#fff":"rgba(255,255,255,0.38)",fontSize:13,cursor:"pointer",borderBottom:tab===t.id?`2.5px solid ${t.alert?T.orange:"#fff"}`:"2.5px solid transparent",fontWeight:tab===t.id?"bold":"normal",transition:"all 0.15s"}}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"18px 22px"}}>

        {tab==="pacientes"&&!selP&&(<>
          <div style={{position:"relative",marginBottom:16}}>
            <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:T.muted,fontSize:15}}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar…" style={{width:"100%",boxSizing:"border-box",padding:"12px 14px 12px 36px",fontSize:14,fontFamily:FONT,border:`1.5px solid ${T.border}`,borderRadius:12,background:T.white,color:T.ink,outline:"none"}}/>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {filtered.map(p=>{const last=p.sessions[0];return(
              <div key={p.id} onClick={()=>{setSelP(p);setFindings({});setSelVert(null);}} style={{background:T.white,borderRadius:12,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",border:`1.5px solid ${T.border}`,boxShadow:"0 2px 6px rgba(0,0,0,0.05)"}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:40,height:40,borderRadius:"50%",background:grad,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:"bold",flexShrink:0,fontFamily:FONT2}}>{p.name.split(",")[0]?.[0]?.toUpperCase()??""}{p.name.split(", ")?.[1]?.[0]?.toUpperCase()??""}</div>
                  <div><div style={{fontSize:15,color:T.ink,fontWeight:"bold"}}>{p.name}</div><div style={{fontSize:12,color:T.muted,fontFamily:FONT2}}>{last?`${last.date} · ${fARS(last.amount)}`:"Sin sesiones"}</div></div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  {!p.ficha&&<Pill color={T.orange} bg="#fff3e0">Sin ficha</Pill>}
                  <div style={{textAlign:"right"}}><div style={{fontSize:18,fontWeight:"bold",color:T.navy,fontFamily:FONT2}}>{p.sessions.length}</div><div style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:1,fontFamily:FONT2}}>ses.</div></div>
                  <span style={{fontSize:20,color:T.border}}>›</span>
                </div>
              </div>
            );})}
          </div>
        </>)}

        {tab==="pacientes"&&selP&&(
          <div>
            <button onClick={()=>setSelP(null)} style={{background:"none",border:"none",color:T.muted,cursor:"pointer",fontSize:14,fontFamily:FONT2,marginBottom:14,display:"flex",alignItems:"center",gap:5}}>‹ Volver</button>
            <div style={{background:T.navy,borderRadius:14,padding:"16px 20px",color:"#fff",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:20,fontStyle:"italic"}}>{selP.name}</div><div style={{fontSize:12,opacity:0.45,marginTop:2,fontFamily:FONT2}}>DNI {selP.dni}</div></div>
              <div style={{display:"flex",gap:20,textAlign:"center"}}>
                <div><div style={{fontSize:24,fontWeight:"bold",color:T.blue2,fontFamily:FONT2}}>{selP.sessions.length}</div><div style={{fontSize:10,opacity:0.4,textTransform:"uppercase",letterSpacing:1,fontFamily:FONT2}}>sesiones</div></div>
                <div style={{width:1,background:"rgba(255,255,255,0.1)"}}/>
                <div><div style={{fontSize:17,fontWeight:"bold",color:T.blue2,fontFamily:FONT2}}>{fARS(selP.sessions.reduce((a,s)=>a+s.amount,0))}</div><div style={{fontSize:10,opacity:0.4,textTransform:"uppercase",letterSpacing:1,fontFamily:FONT2}}>total</div></div>
              </div>
            </div>
            <div style={{background:T.white,borderRadius:14,padding:"16px 18px",marginBottom:14,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:T.muted,marginBottom:12,fontFamily:FONT2}}>Ideograma · Sesión actual</div>
              <div style={{display:"grid",gridTemplateColumns:"155px 1fr",gap:12}}>
                <Spine findings={findings} onSelect={openV} selected={selVert}/>
                <div>
                  {selV2?(
                    <div style={{border:`2px solid ${selRM2.color}`,borderRadius:10,padding:"12px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><div><Pill color={selRM2.color} bg={selRM2.bg}>{selRM2.label}</Pill> <strong style={{marginLeft:6,fontFamily:FONT2}}>{selV2.label}</strong></div><button onClick={()=>setSelVert(null)} style={{background:"none",border:"none",fontSize:18,color:T.muted,cursor:"pointer"}}>×</button></div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:8}}>{FT.map(ft=><button key={ft.id} onClick={()=>setFid(fid===ft.id?"":ft.id)} style={{padding:"5px 9px",borderRadius:7,border:`2px solid ${ft.color}`,background:fid===ft.id?ft.color:ft.light,color:fid===ft.id?"#fff":ft.color,fontSize:11,cursor:"pointer",fontFamily:FONT2}}>{ft.label}</button>)}</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>{TECH.map(t=><button key={t} onClick={()=>setFtech(ftech===t?"":t)} style={{padding:"4px 8px",borderRadius:6,border:`1.5px solid ${ftech===t?T.navy:T.border}`,background:ftech===t?T.navy:T.cream,color:ftech===t?T.gold:T.ink,fontSize:10,cursor:"pointer",fontFamily:FONT2}}>{t}</button>)}</div>
                      <div style={{display:"flex",gap:6}}><Btn onClick={saveV} small disabled={!fid&&!ftech}>OK</Btn>{findings[selVert]&&<Btn onClick={clearV} small variant="danger">×</Btn>}</div>
                    </div>
                  ):(
                    <div style={{color:T.muted,fontStyle:"italic",fontSize:12,fontFamily:FONT2}}>
                      {Object.keys(findings).length===0?"← Tocá una vértebra":
                        <div style={{display:"flex",flexDirection:"column",gap:4}}>{Object.entries(findings).map(([vid,data])=>{const v=VERTEBRAE.find(x=>x.id===vid),ft=FT.find(x=>x.id===data.findingId),rm=RM[v?.region??"cervical"];return(<div key={vid} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 8px",borderRadius:7,background:ft?ft.light:T.cream}}><div style={{width:24,height:24,borderRadius:4,background:rm.bg,color:rm.color,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bold",fontSize:9,fontFamily:FONT2}}>{vid}</div><div><div style={{fontSize:11,color:ft?.color,fontWeight:"bold",fontFamily:FONT2}}>{ft?.label}</div>{data.technique&&<div style={{fontSize:10,color:T.muted,fontFamily:FONT2}}>{data.technique}</div>}</div></div>);})}</div>}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div style={{background:T.white,borderRadius:14,padding:"14px 18px",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:T.muted,marginBottom:12,fontFamily:FONT2}}>Historial</div>
              {selP.sessions.length===0?<div style={{color:T.muted,fontStyle:"italic",fontSize:13,textAlign:"center",padding:"20px 0",fontFamily:FONT2}}>Sin sesiones</div>:
                <div style={{display:"flex",flexDirection:"column",gap:7}}>{selP.sessions.map((s,i)=>(
                  <div key={s.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 13px",borderRadius:9,background:i===0?"#f0f8ff":T.cream,borderLeft:`4px solid ${s.absent?T.orange:s.signed?T.green:T.border}`}}>
                    <div>
                      <div style={{fontSize:11,color:T.blue1,fontWeight:"bold",fontFamily:FONT2,marginBottom:2}}>#{s.sesNo||selP.sessions.length-i}</div>
                      <div style={{fontSize:14,fontWeight:"bold",color:T.ink,fontFamily:FONT}}>{s.date}</div>
                      {s.absent&&<div style={{fontSize:11,color:T.orange,fontFamily:FONT2}}>⚠️ Ausente</div>}
                      {Object.keys(s.findings||{}).length>0&&<div style={{fontSize:11,color:T.navyMid,fontFamily:FONT2}}>🦴 {Object.keys(s.findings).length} vértebra(s)</div>}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <Tag method={s.method}/>
                      <div style={{fontSize:16,fontWeight:"bold",color:T.navy,fontFamily:FONT2}}>{fARS(s.amount)}</div>
                      {s.signed&&<div style={{fontSize:11,color:T.green,fontFamily:FONT2}}>✓</div>}
                      <button onClick={()=>setEditSes({...s, patientDni:selP.dni})}
                        style={{background:"none",border:`1px solid ${T.border}`,borderRadius:7,padding:"4px 10px",fontSize:11,color:T.muted,cursor:"pointer",fontFamily:FONT2}}>
                        ✏️ Editar
                      </button>
                    </div>
                  </div>
                ))}</div>}
            </div>
          </div>
        )}

        {tab==="finanzas"&&(
          <div>
            <div style={{fontSize:22,color:T.navy,fontStyle:"italic",marginBottom:18,fontFamily:FONT}}>Mis finanzas</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
              <div style={{background:T.navy,borderRadius:14,padding:"18px 20px",color:"#fff"}}><div style={{fontSize:30,fontWeight:"bold",color:T.blue2,fontFamily:FONT2}}>{mySessions}</div><div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",opacity:0.4,fontFamily:FONT2}}>Sesiones atendidas</div></div>
              <div style={{background:T.navy,borderRadius:14,padding:"18px 20px",color:"#fff"}}><div style={{fontSize:24,fontWeight:"bold",color:T.blue2,fontFamily:FONT2}}>{fARS(myTotal)}</div><div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",opacity:0.4,fontFamily:FONT2}}>Total recaudado</div></div>
            </div>
            <div style={{background:T.white,borderRadius:14,padding:"14px 18px",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:T.muted,marginBottom:12,fontFamily:FONT2}}>Últimas sesiones</div>
              {patients.flatMap(p=>p.sessions.filter(s=>s.doctorId===doctor.id).map(s=>({...s,patientName:p.name}))).slice(0,8).map(s=>(
                <div key={s.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",borderRadius:8,marginBottom:6,background:T.cream}}>
                  <div><div style={{fontSize:14,fontWeight:"bold",color:T.ink,fontFamily:FONT}}>{s.patientName}</div><div style={{fontSize:12,color:T.muted,fontFamily:FONT2}}>{s.date}</div></div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><Tag method={s.method}/><div style={{fontSize:15,fontWeight:"bold",color:T.navy,fontFamily:FONT2}}>{fARS(s.amount)}</div></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="pendientes"&&isAdmin&&(
          <div>
            <div style={{fontSize:22,color:T.navy,fontStyle:"italic",marginBottom:18}}>Pendientes de aprobación</div>
            {pending.length===0?<div style={{textAlign:"center",padding:"40px",color:T.muted,fontStyle:"italic",background:T.white,borderRadius:14,fontFamily:FONT2}}>Sin pacientes pendientes</div>:
              pending.map(p=>(
                <div key={p.id} style={{background:T.white,borderRadius:14,padding:"16px 18px",border:`1.5px solid ${T.orange}`,marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                    <div><div style={{fontSize:17,fontWeight:"bold",color:T.ink}}>{p.name}</div><div style={{fontSize:13,color:T.muted,fontFamily:FONT2}}>DNI {p.dni} · {p.phone}</div>{p.anamnesis?.motivo&&<div style={{fontSize:13,color:T.ink,fontStyle:"italic",marginTop:4}}>"{p.anamnesis.motivo}"</div>}</div>
                    <Pill color={T.orange} bg="#fff3e0">Pendiente</Pill>
                  </div>
                  <div style={{display:"flex",gap:10}}><Btn onClick={()=>onApprovePending(p)} variant="green" small>✓ Aprobar</Btn><Btn onClick={()=>onRejectPending(p.id)} variant="danger" small>✗ Rechazar</Btn></div>
                </div>
              ))
            }
          </div>
        )}

        {tab==="ajustes"&&(
          <div style={{maxWidth:460}}>
            <div style={{fontSize:22,color:T.navy,fontStyle:"italic",marginBottom:18}}>Ajustes</div>
            <div style={{background:T.white,borderRadius:14,padding:"18px 20px",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:14,fontWeight:"bold",color:T.ink,marginBottom:4}}>Patrón de acceso</div>
              <div style={{fontSize:13,color:T.muted,marginBottom:14,fontFamily:FONT2}}>Cambialo regularmente por seguridad</div>
              <Btn onClick={()=>setChangingPattern(true)} variant="outline" small>Cambiar patrón</Btn>
            </div>
            <div style={{background:T.white,borderRadius:14,padding:"18px 20px",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:14,fontWeight:"bold",color:T.ink,marginBottom:4}}>Google Drive</div>
              <div style={{fontSize:13,color:T.green,marginBottom:4,fontFamily:FONT2}}>☁️ Conectado · Última sync: hace 2 min</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE SHEETS / DRIVE INTEGRATION
// ─────────────────────────────────────────────────────────────────────────────
const GAPI_CLIENT_ID = "479013151158-05tjvlt82p1h35egobc9isdqe3qoiddn.apps.googleusercontent.com";
const SHEET_ID       = "17XAa8vqc7AAvl6w0_i9-exZs5qNEi6Gmcp1vffsjK90";
const SCOPES         = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file";

// Load gapi + gis scripts dynamically
function loadScript(src) {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) { res(); return; }
    const s = document.createElement("script");
    s.src = src; s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
}

// ── Google Auth hook ──────────────────────────────────────────────────────────
function useGoogleAuth() {
  const [authState, setAuthState] = useState("idle"); // idle|loading|authed|error
  const [accessToken, setAccessToken] = useState(null);
  const tokenClientRef = useRef(null);

  const initGapi = useCallback(async () => {
    setAuthState("loading");
    try {
      await loadScript("https://apis.google.com/js/api.js");
      await new Promise(res => window.gapi.load("client", res));
      await window.gapi.client.init({
        apiKey: null,
        discoveryDocs: [
          "https://sheets.googleapis.com/$discovery/rest?version=v4",
          "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
        ],
      });

      await loadScript("https://accounts.google.com/gsi/client");
      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: GAPI_CLIENT_ID,
        scope: SCOPES,
        callback: (resp) => {
          if (resp.error) { setAuthState("error"); return; }
          window.gapi.client.setToken({ access_token: resp.access_token });
          setAccessToken(resp.access_token);
          setAuthState("authed");
        },
      });
      setAuthState("ready"); // ready to request token
    } catch(e) {
      console.error("GAPI init error", e);
      setAuthState("error");
    }
  }, []);

  const requestToken = useCallback(() => {
    if (tokenClientRef.current) tokenClientRef.current.requestAccessToken({ prompt: "consent" });
  }, []);

  useEffect(() => { initGapi(); }, [initGapi]);

  return { authState, accessToken, requestToken };
}

// ── Sheets helpers ─────────────────────────────────────────────────────────────
async function sheetsGet(range) {
  const res = await window.gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID, range,
  });
  return res.result.values || [];
}

async function sheetsAppend(range, values) {
  await window.gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID, range,
    valueInputOption: "USER_ENTERED",
    resource: { values },
  });
}

async function sheetsUpdate(range, values) {
  await window.gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID, range,
    valueInputOption: "USER_ENTERED",
    resource: { values },
  });
}

// Parse pacientes sheet rows → patient objects
function parsePatients(rows) {
  if (!rows || rows.length < 2) return [];
  // Skip header rows (row 1 = title, row 2 = headers)
  return rows.slice(2).filter(r => r[3]?.trim()).map((r, i) => ({
    id:         r[3]?.trim(), // DNI as ID
    name:       `${r[1]?.trim() || ""}, ${r[2]?.trim() || ""}`,
    apellido:   r[1]?.trim() || "",
    nombre:     r[2]?.trim() || "",
    dni:        r[3]?.trim() || "",
    phone:      r[4]?.trim() || "",
    email:      r[5]?.trim() || "",
    occupation: r[6]?.trim() || "",
    dob:        r[7]?.trim() || "",
    ficha:      true,
    sessions:   [], // populated separately
  }));
}

// Parse sesiones sheet rows → session objects per patient DNI
function parseSessions(rows) {
  if (!rows || rows.length < 2) return {};
  const byDni = {};
  rows.slice(2).filter(r => r[1]?.trim()).forEach(r => {
    const dni   = r[1]?.trim();
    const sesNo = r[0];
    const sess  = {
      id:     `${dni}-${r[3]}`,
      sesNo:  sesNo,
      date:   r[3]?.trim() || "",
      amount: parseInt(r[4]) || 0,
      method: r[5]?.trim() || "efectivo",
      signed: r[6]?.trim() === "si",
      absent: r[7]?.trim() === "si",
      sigImg: r[8]?.trim() || null,
    };
    if (!byDni[dni]) byDni[dni] = [];
    byDni[dni].push(sess);
  });
  // Sort each patient's sessions newest first
  Object.keys(byDni).forEach(dni => {
    byDni[dni].sort((a, b) => {
      const pa = a.date.split("/").reverse().join(""); // AAAAMMDD
      const pb = b.date.split("/").reverse().join("");
      return pb.localeCompare(pa);
    });
  });
  return byDni;
}

// Upload signature image to Drive, return public URL
async function uploadSignatureToDrive(canvasEl, patientDni, date) {
  return new Promise((resolve) => {
    canvasEl.toBlob(async (blob) => {
      try {
        const fileName = `firma_${patientDni}_${date.replace(/\//g,"-")}.png`;
        const meta = { name: fileName, mimeType: "image/png", parents: [] };
        const form = new FormData();
        form.append("metadata", new Blob([JSON.stringify(meta)], { type: "application/json" }));
        form.append("file", blob);
        const token = window.gapi.client.getToken()?.access_token;
        const res = await fetch(
          "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webContentLink",
          { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form }
        );
        const data = await res.json();
        // Make file publicly readable so thumbnails work
        await fetch(`https://www.googleapis.com/drive/v3/files/${data.id}/permissions`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ role: "reader", type: "anyone" }),
        });
        resolve(`https://drive.google.com/thumbnail?id=${data.id}&sz=w200`);
      } catch(e) {
        console.error("Drive upload failed", e);
        resolve(null);
      }
    }, "image/png");
  });
}

// Append new patient to sheet (pendientes tab)
async function appendPendingPatient(p) {
  const row = [
    "", p.apellido, p.nombre, p.dni, p.phone, p.email || "", p.occupation || "",
    todayShort(), "pendiente"
  ];
  await sheetsAppend("pendientes!A:I", [row]);
}

// ── Google Login Screen ────────────────────────────────────────────────────────
function GoogleLoginScreen({ authState, onLogin }) {
  return (
    <div style={{ minHeight:"100vh", background:grad, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:FONT, padding:32 }}>
      <Logo size={1.4}/>
      <div style={{ marginTop:48, background:"rgba(255,255,255,0.08)", backdropFilter:"blur(14px)", borderRadius:24, padding:"40px 44px", textAlign:"center", border:"1px solid rgba(255,255,255,0.12)", maxWidth:340, width:"100%" }}>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.45)", letterSpacing:3, textTransform:"uppercase", marginBottom:8, fontFamily:FONT2 }}>Bienvenido</div>
        <div style={{ fontSize:18, color:"#fff", fontStyle:"italic", marginBottom:32 }}>Iniciá sesión para continuar</div>

        {authState === "error" && (
          <div style={{ fontSize:12, color:"#ff8a80", marginBottom:16, fontFamily:FONT2 }}>
            Error de autenticación. Intentá de nuevo.
          </div>
        )}

        <button onClick={onLogin} disabled={authState==="loading"||authState==="idle"}
          style={{ width:"100%", padding:"15px 20px", borderRadius:12, border:"none", background: authState==="loading"||authState==="idle" ? "rgba(255,255,255,0.1)" : "#fff", color: authState==="loading"||authState==="idle" ? "rgba(255,255,255,0.3)" : T.navy, fontSize:15, fontWeight:"bold", cursor: authState==="ready"||authState==="error" ? "pointer":"not-allowed", display:"flex", alignItems:"center", justifyContent:"center", gap:12, fontFamily:FONT2, transition:"all 0.2s" }}>
          {authState==="loading"||authState==="idle" ? (
            <span style={{ fontSize:13, letterSpacing:1 }}>Cargando...</span>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              Continuar con Google
            </>
          )}
        </button>
        <div style={{ marginTop:16, fontSize:11, color:"rgba(255,255,255,0.25)", fontFamily:FONT2, lineHeight:1.5 }}>
          Solo cuentas autorizadas pueden acceder
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
function App(){
  const { authState, accessToken, requestToken } = useGoogleAuth();

  // Data state — starts with seed, gets replaced by Sheets data after auth
  const [data, setData]           = useState({ patients:SEED_PATIENTS, pending:SEED_PENDING, doctors:SEED_DOCTORS });
  const [loadingData, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState("idle"); // idle|syncing|ok|error
  const [view, setView]           = useState("login");  // login|public|pattern|doctor
  const [pubScreen, setPubScreen] = useState("home");
  const [selPatient, setSelPatient] = useState(null);
  const [activeDoctor, setActiveDoctor] = useState(null);
  const sigCanvasRef = useRef(null); // ref to capture signature for upload

  // ── Load data from Sheets after auth ────────────────────────────────────────
  const loadFromSheets = useCallback(async () => {
    setLoading(true);
    setSyncStatus("syncing");
    try {
      const [patRows, sesRows] = await Promise.all([
        sheetsGet("pacientes!A1:I200"),
        sheetsGet("sesiones!A1:I2000"),
      ]);
      const patients   = parsePatients(patRows);
      const sessionMap = parseSessions(sesRows);
      // Attach sessions to patients
      patients.forEach(p => { p.sessions = sessionMap[p.dni] || []; });
      setData(prev => ({ ...prev, patients }));
      setSyncStatus("ok");
    } catch(e) {
      console.error("Sheets load error", e);
      setSyncStatus("error");
    }
    setLoading(false);
  }, []);

  // When auth succeeds → load data and go to public screen
  useEffect(() => {
    if (authState === "authed") {
      loadFromSheets().then(() => setView("public"));
    }
  }, [authState, loadFromSheets]);

  // ── Save session to Sheets + upload signature ────────────────────────────────
  const saveSession = async (sessionData) => {
    const p = selPatient;
    const dateStr = todayShort();
    let sigImgUrl = null;

    // 1. Upload signature to Drive if signed
    if (!sessionData.absent && sigCanvasRef.current) {
      setSyncStatus("syncing");
      sigImgUrl = await uploadSignatureToDrive(sigCanvasRef.current, p.dni, dateStr);
    }

    // 2. Append row to sesiones sheet
    const sesNo = p.sessions.length + 1;
    const row = [
      sesNo, p.dni, `${p.apellido}, ${p.nombre}`,
      dateStr, sessionData.amount,
      sessionData.method,
      sessionData.absent ? "no" : "si",
      sessionData.absent ? "si" : "no",
      sigImgUrl || "",
    ];
    try {
      await sheetsAppend("sesiones!A:I", [row]);
      setSyncStatus("ok");
    } catch(e) {
      console.error("Sheets write error", e);
      setSyncStatus("error");
    }

    // 3. Update local state
    const newSes = {
      id: `${p.dni}-${dateStr}`,
      sesNo, date: dateStr,
      amount: sessionData.amount,
      method: sessionData.method,
      signed: !sessionData.absent,
      absent: sessionData.absent,
      sigImg: sigImgUrl,
    };
    setData(prev => ({
      ...prev,
      patients: prev.patients.map(pat =>
        pat.dni === p.dni ? { ...pat, sessions: [newSes, ...pat.sessions] } : pat
      ),
    }));
    setSelPatient(null);
    setPubScreen("home");
  };

  const approvePending = async (p) => {
    // Move from pending to patients in local state
    const np = { id:p.id, name:`${p.apellido}, ${p.nombre}`, apellido:p.apellido, nombre:p.nombre, dni:p.dni, dob:p.dob||"", phone:p.phone||"", email:p.email||"", occupation:p.occupation||"", ficha:true, sessions:[], anamnesis:p.anamnesis||{} };
    // Append to pacientes sheet
    try {
      const row = ["", p.apellido, p.nombre, p.dni, p.phone||"", p.email||"", p.occupation||"", p.dob||""];
      await sheetsAppend("pacientes!A:I", [row]);
    } catch(e) { console.error("Approve error", e); }
    setData(d => ({ ...d, patients:[...d.patients, np], pending:d.pending.filter(x=>x.id!==p.id) }));
  };

  const rejectPending = (id) => setData(d => ({ ...d, pending:d.pending.filter(x=>x.id!==id) }));

  const updatePattern = (np) => {
    setData(d => ({ ...d, doctors:d.doctors.map(doc => doc.id===activeDoctor.id ? {...doc,pattern:np} : doc) }));
    setActiveDoctor(a => ({ ...a, pattern:np }));
  };

  const saveNewPatient = async (p) => {
    try { await appendPendingPatient(p); } catch(e) { console.error("Pending write error", e); }
    setData(d => ({ ...d, pending:[...d.pending, { id:"p"+Date.now(), ...p }] }));
    setPubScreen("home");
  };

  // ── Sync status indicator ────────────────────────────────────────────────────
  const SyncBadge = () => (
    <div style={{ position:"fixed", bottom:12, right:14, fontSize:11, fontFamily:FONT2, display:"flex", alignItems:"center", gap:5, background:"rgba(255,255,255,0.85)", backdropFilter:"blur(8px)", borderRadius:20, padding:"4px 10px", boxShadow:"0 2px 8px rgba(0,0,0,0.1)", zIndex:9999 }}>
      {syncStatus==="syncing" && <><span style={{color:T.blue1}}>⏳</span><span style={{color:T.muted}}>Sincronizando...</span></>}
      {syncStatus==="ok"      && <><span style={{color:T.green}}>☁️</span><span style={{color:T.green}}>Guardado en Drive</span></>}
      {syncStatus==="error"   && <><span style={{color:T.red}}>⚠️</span><span style={{color:T.red}}>Error de sync</span></>}
    </div>
  );

  // ── Render ───────────────────────────────────────────────────────────────────
  if (view === "login") return <GoogleLoginScreen authState={authState} onLogin={requestToken}/>;

  if (loadingData) return (
    <div style={{ minHeight:"100vh", background:grad, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:FONT }}>
      <Logo size={1.2}/>
      <div style={{ marginTop:40, color:"rgba(255,255,255,0.6)", fontSize:16, fontStyle:"italic" }}>Cargando pacientes...</div>
      <div style={{ marginTop:16, display:"flex", gap:8 }}>
        {[0,1,2].map(i => <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:"rgba(255,255,255,0.4)", animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite` }}/>)}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );

  if (view==="pattern") return <PatternLock savedPattern={data.doctors[0].pattern} onMatch={()=>{ setActiveDoctor(data.doctors[0]); setView("doctor"); }} onCancel={()=>setView("public")}/>;

  if (view==="doctor" && activeDoctor) return (
    <>
      <DoctorApp doctor={activeDoctor} patients={data.patients} pending={data.pending}
        onLogout={()=>{ setView("public"); setActiveDoctor(null); }}
        onApprovePending={approvePending} onRejectPending={rejectPending} onUpdatePattern={updatePattern}/>
      <SyncBadge/>
    </>
  );

  if (pubScreen==="session" && selPatient) return (
    <>
      <PublicSession patient={selPatient} sigCanvasRef={sigCanvasRef}
        onBack={()=>{ setSelPatient(null); setPubScreen("home"); }} onSave={saveSession}/>
      <SyncBadge/>
    </>
  );

  if (pubScreen==="newpatient") return (
    <PublicNewPatient onBack={()=>setPubScreen("home")} onDone={saveNewPatient}/>
  );

  return (
    <>
      <PublicHome patients={data.patients}
        onSelect={p=>{ setSelPatient(p); setPubScreen("session"); }}
        onNewPatient={()=>setPubScreen("newpatient")}
        onDoctorAccess={()=>setView("pattern")}/>
      <SyncBadge/>
    </>
  );
}
