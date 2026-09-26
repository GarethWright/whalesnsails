export const WHALES=[
{id:'orca',name:'Orca',title:'The all-round adventurer',power:'Super ram',speed:270,damage:2,air:32,size:1,stat:4},
{id:'humpback',name:'Humpback',title:'A tail with a mighty tale',power:'Mighty tail',speed:215,damage:3,air:38,size:1.15,stat:5},
{id:'minke',name:'Minke',title:'Small, speedy & sneaky',power:'Net escape',speed:345,damage:1,air:30,size:.8,stat:3},
{id:'fin',name:'Fin',title:'The ocean’s racing champion',power:'Turbo dash',speed:380,damage:2,air:35,size:1.05,stat:5},
{id:'blue',name:'Blue',title:'Big heart. Bigger bubbles.',power:'Bubble storm',speed:195,damage:3,air:48,size:1.35,stat:5},
{id:'gray',name:'Gray',title:'Your brave, sturdy friend',power:'Tough skin',speed:240,damage:2,air:42,size:1.1,stat:4}];
export const LEVELS=[{name:'Coral Cove',boss:'Captain Crabclaw',target:6,hp:14},{name:'Moonlit Lagoon',boss:'The Net Kraken',target:8,hp:20},{name:'Treasure Tides',boss:'Admiral Barnacle',target:10,hp:28}];
export const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
export function airAfter(air,dt,atSurface,capacity){return clamp(air+dt*(atSurface?32:-100/capacity),0,100)}
export function attackDamage(whale,kind,powered=false){return (kind==='tail'&&whale.id==='humpback'?5:kind==='ram'&&whale.id==='orca'?4:kind==='bubble'&&whale.id==='blue'?4:whale.damage)*(powered?2:1)}
