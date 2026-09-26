import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StdioClientTransport} from '@modelcontextprotocol/sdk/client/stdio.js';
import fs from 'node:fs';
const client=new Client({name:'whale-assets',version:'2.0'});
await client.connect(new StdioClientTransport({command:'node',args:['node_modules/rive-mcp-server/dist/index.js']}));
async function call(name,args){const r=await client.callTool({name,arguments:args});if(r.isError)throw new Error(JSON.stringify(r));for(const c of r.content||[])if(c.type==='text')console.log(name,c.text.slice(0,220));return r;}
const {palette:p,gradients:g}=JSON.parse(fs.readFileSync('scripts/design-tokens.json'));
const definitions=[
{name:'orca',color:p.text,light:p.textMuted,body:'M78 102 C107 83 130 54 189 57 C239 53 279 76 281 100 C278 130 234 149 181 144 C126 141 107 115 78 114Z',dorsal:'M133 73 Q132 37 151 21 Q170 35 170 64Z',fin:'M168 121 Q158 151 132 159 Q127 140 147 116Z',eye:[251,88]},
{name:'humpback',color:p.primaryStrong,light:g.primary[0],body:'M76 107 Q114 100 133 75 Q151 48 186 59 Q207 56 244 72 Q264 76 274 93 L280 99 Q278 124 243 139 Q187 160 143 139 Q108 121 76 118Z',dorsal:'M139 80 Q147 49 157 53 L173 65Z',fin:'M179 121 Q159 164 111 176 Q98 173 108 161 L152 118Z',eye:[251,95]},
{name:'minke',color:p.primary,light:p.primarySoft,body:'M75 104 Q133 75 189 70 Q229 68 277 95 Q288 102 273 110 Q212 140 165 134 Q112 126 75 115Z',dorsal:'M132 85 Q138 54 153 48 Q152 71 170 78Z',fin:'M178 119 Q166 144 143 147 L153 115Z',eye:[251,99]},
{name:'fin',color:p.textMuted,light:p.outline,body:'M73 105 Q145 71 201 76 Q249 77 290 99 Q296 105 279 113 Q223 138 179 130 Q110 121 73 114Z',dorsal:'M116 91 Q117 59 139 48 Q135 70 151 82Z',fin:'M189 117 Q163 142 144 144 L163 114Z',eye:[267,100]},
{name:'blue',color:g.primary[1],light:g.primary[0],body:'M72 104 Q123 65 186 58 Q250 50 281 74 Q294 87 289 106 Q284 135 235 146 Q162 161 121 133 Q94 114 72 116Z',dorsal:'M110 88 Q113 69 126 70 L139 77Z',fin:'M188 127 Q166 150 131 153 Q137 134 157 121Z',eye:[266,88]},
{name:'gray',color:p.textMuted,light:p.outline,body:'M75 105 Q119 79 165 70 Q215 55 249 71 Q273 82 280 105 Q273 132 227 142 Q168 149 127 131 Q96 116 75 117Z',dorsal:'M102 97 L111 82 L119 84 L127 77 L138 80 L145 72 L155 78Z',fin:'M176 124 Q163 149 139 148 Q136 132 152 119Z',eye:[252,97]}
];
const path=(d,fill,extra='')=>`<path d="${d}" fill="${fill}" ${extra}/>`;
for(const d of definitions){
 const {name,color,light,body,dorsal,fin,eye:[ex,ey]}=d;
 const parts=[];const parents=[];function add(svg,parent='body'){parts.push(svg);parents.push(parent)}
 add(path('M91 109 C63 111 54 78 26 75 Q20 96 48 112 Q24 111 17 137 Q47 147 68 124 L91 117Z','url(#skin)'),'tail');
 add(path('M181 111 Q200 136 218 138 Q224 130 207 111Z',color));
 add(path(dorsal,'url(#skin)'));
 add(path(body,'url(#skin)'));
 add(path(name==='minke'||name==='fin'?'M89 113 Q176 144 277 108 Q215 136 174 130 Q125 125 89 113Z':'M89 116 Q163 150 227 126 Q261 122 281 105 Q276 134 231 145 Q162 160 122 133Z',name==='orca'?p.surface:p.primarySoft));
 add(path('M118 95 Q178 62 229 73', 'none',`stroke="${light}" stroke-width="4" stroke-linecap="round" opacity=".6"`));
 if(name==='orca')add(path('M202 79 Q214 66 235 74 Q235 86 213 89Z',p.surface));
 if(name==='humpback'||name==='blue')for(let j=0;j<5;j++)add(path(`M${185+j*13} 123 Q${181+j*13} 132 ${189+j*10} 142`,'none',`stroke="${color}" stroke-width="1.5" opacity=".45"`));
 if(name==='humpback')for(let j=0;j<4;j++)add(`<circle cx="${237+j*10}" cy="${78+j*4}" r="2.5" fill="${p.primarySoft}"/>`);
 if(name==='blue'||name==='gray')for(let j=0;j<12;j++)add(`<ellipse cx="${125+(j*31)%121}" cy="${87+(j*17)%35}" rx="${3+j%4}" ry="${2+j%2}" fill="${light}" opacity=".3"/>`);
 add(path(fin,'url(#flipper)'),'flipper');
 if(name==='minke')add(path('M158 124 L173 127 L166 138 L151 136Z',p.surface),'flipper');
 add(`<ellipse cx="${ex}" cy="${ey}" rx="10" ry="11" fill="${p.surface}"/>`,'eye');
 add(`<ellipse cx="${ex+3}" cy="${ey}" rx="5" ry="6.5" fill="${p.text}"/>`,'eye');
 add(`<circle cx="${ex+4}" cy="${ey-3}" r="2" fill="${p.surface}"/>`,'eye');
 add(path(`M${ex+3} ${ey+19} Q${ex+16} ${ey+26} ${ex+24} ${ey+14}`,'none',`stroke="${p.text}" stroke-width="2.5" stroke-linecap="round"`));
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200"><defs><linearGradient id="skin" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${light}"/><stop offset="1" stop-color="${color}"/></linearGradient><linearGradient id="flipper" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${light}"/><stop offset="1" stop-color="${color}"/></linearGradient></defs>${parts.join('')}</svg>`;
 fs.writeFileSync(`public/assets/${name}.svg`,svg);
 await call('riv_import_svg',{svgPath:`public/assets/${name}.svg`,outSpec:`public/assets/${name}.scene.json`,idPrefix:name});
 const frag=JSON.parse(fs.readFileSync(`public/assets/${name}.scene.json`));
 if(frag.shapes.length!==parents.length)throw Error('SVG part count mismatch');
 const pivots={body:[160,105],tail:[84,111],flipper:[164,123],eye:[ex,ey]};
 const groups=[{id:'body',x:160,y:105},...['tail','flipper','eye'].map(id=>({id,parent:'body',x:pivots[id][0]-160,y:pivots[id][1]-105}))];
 const shapes=frag.shapes.map((s,i)=>({...s,parent:parents[i],x:s.x-pivots[parents[i]][0],y:s.y-pivots[parents[i]][1]}));
 const track=(target,property,values,duration)=>({target,property,keyframes:values.map((value,i)=>({frame:i*duration/(values.length-1),value,easing:'ease-in-out'}))});
 const swimDuration=144;
 const animations=[{name:'swim',duration:swimDuration,fps:60,loop:'loop',presets:[{preset:'float-idle',target:'body',intensity:.25}],tracks:[track('tail','rotation',[0,-17,0,17,0],swimDuration),track('flipper','rotation',[8,-9,8,20,8],swimDuration),{target:'eye',property:'scaleY',keyframes:[{frame:0,value:1},{frame:109,value:1,easing:'hold'},{frame:114,value:.08,easing:'ease-in-out'},{frame:120,value:1,easing:'ease-in-out'},{frame:144,value:1,easing:'hold'}]}]},
 {name:'tail',duration:36,fps:60,loop:'oneshot',tracks:[track('tail','rotation',[0,25,-48,13,0],36),track('body','rotation',[0,-7,9,-3,0],36),track('flipper','rotation',[8,22,-20,13,8],36)]},
 {name:'ram',duration:36,fps:60,loop:'oneshot',tracks:[track('tail','rotation',[0,22,-28,12,0],36),track('flipper','rotation',[8,-24,-30,4,8],36),track('body','scaleX',[1,.93,1.08,1.03,1],36),track('body','scaleY',[1,1.07,.93,.98,1],36)]}];
 const scene={artboard:{name,width:320,height:200},groups,shapes,animations};fs.writeFileSync(`public/assets/${name}.animation.json`,JSON.stringify(scene,null,2));
 await call('riv_create',{outPath:`public/assets/${name}.riv`,scene});
 for(const animation of ['swim','tail','ram'])await call('riv_render_sprites',{path:`public/assets/${name}.riv`,animation,count:36,width:320,height:200,out:`public/assets/${name}-${animation}.png`});
}
for(const [i,name] of ['orca','humpback'].entries()){const r=await call('riv_critique',{path:`public/assets/${name}.riv`,animation:i?'tail':'swim',frames:6,width:240});let j=0;for(const c of r.content||[])if(c.type==='image')fs.writeFileSync(`public/assets/critique-${i}-${j++}.png`,Buffer.from(c.data,'base64'));fs.writeFileSync(`scripts/critique-${i}.json`,JSON.stringify(r.content.filter(c=>c.type==='text')));}
await client.close();
