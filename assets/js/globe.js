/* ══════════════════════════════════════
   ATOMIC GLOBE
   Real Earth landmass point cloud (512×256
   equirectangular mask), Fibonacci-sphere
   sampling, perspective projection, Lambert
   shading, drag + momentum, hover lens,
   great-circle arcs with comet heads.
══════════════════════════════════════ */
(function(){
  const canvas = document.getElementById('globeCanvas');
  const stage  = document.getElementById('globeStage');
  const hint   = document.getElementById('globeHint');
  /* MOBILE_GLOBE_LIGHT */
  if(!canvas || !stage) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    canvas.style.display = 'none';
    if(hint) hint.style.display = 'none';
    return;
  }
  const isMobile = window.matchMedia('(max-width: 700px)').matches
    || window.matchMedia('(pointer: coarse)').matches;
  if(hint && isMobile) hint.style.display = 'none';

  if(!canvas || !stage) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const MW = 512, MH = 256;
  const MASK_B64 = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//wAAAA/98//gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+////+AqPHv///4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM////2APf//////z8j+AAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP47/n//D/////////7/8AAAAAAAAAAAAAATB/FwAAAAAA/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACA/x9//8Hv/////////+AAAAAAAAC79BAAACAGAAAAAAAAMYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5/7/3AAP//////////AAAAAAAf3n8AAAAAAAAAAAAAAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAHzB/33/4P///////////IAAAAAAF++AAAAAAAAAAAAAAAAAAB+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATwAGOAAf/wf///////////gAAAAAAAH8OAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHwADAAAY/jAAO///////////AAAAAAAA+AgAAAAAAAAAAAAAAAAAB8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPYAwYcf5/b4AD///////////AAAAAAAAAAAAAAAAAAAADwAAAAAQg/38AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYfPw/hHgAAAAAAf////////8AAAAAAAAAAAAAAAAAAP+AAACAAH////wAAAABzAAAAAAAAAAAAAAAAAAAAAAAB9f9h55//+AAAAA////////+QAAAAAAAAAAAAAAAABfgAAAAAH/////4AAAAAf+PgAAAAAAAAAAAAAAAAAAAAwAYAAAAAQAAAAAAD////////4AAAAAAAAAAAAAAAAAPAAAAAAH/////mAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+AAIGz/DwAAAAAAf//////74AAAAAAAAAAAAAAAAA/AAAAAAH/////cgACAAADgAAAAAAAAAAAAAAAAAAAAAf/cAeAy/Hl/8AAAAH//////9AAAAAAAAAAAAAAAAAAfAAAAQD/////9///h/wAAAAAAAAAAAAAAAAAAAAAAAAP+//3h/mD5//gAAAA///////kAAAAAAAAAAAAAAAAAHgAAPgef//////////8AA/+AAAAAAAAAAAAAAAAAAAAA+H//8BTg/f/+gAAAbf//////AAAAAAAAAAAAAAAAAH4AAHzv/f/////////+CAP/+AAAAAAAQAAAAPgAAAAAAAD///AB8H7///AAAAH/////E4AAEAAAAAAAEwAAAAAPgAP+f/v//////////5////8fgAAAAgAAAB///AAAAAAAD3//AfwH3z/5AAA3/////5gAAAAAAAAAA2/gAAAAABgB/n/7/////////////////+AAAAAAAAB/////4F37eB///I26AeKf+wAAHP/////8AAAAAAAAAD///AAAAAAH4f5////////////////////79j/wwAAP//////7////5/MBHvmH4E/sAAAH/////4AAAAAAAAAf////4AAQYM/4+O/////////////////////+///gAB///////////+ABwBz/j8B7/wAAF////2AAAAAAAAAAD/////4HB/////z//////////////////////////AAH////////////5//9/9/g4f/gAD////4AAAAAAAAAAB//////DD/////5//////////////////////////3gAP/////////////////9gAH//gAX///4AAAAAAAAAAB////7/yf/////s/////////////////////////7/8H//////////////////9gAH/rwAP///wAAPf4AAAAAB/////gD////////////////////////////////+D8A//////////////////wgA//4QAA///AAAA//AAAAAAP/wP/4D/////////////////////////////////AGAPT/////////////////fwdf/gAAL//gAAAP/gAAAAAf/8H//P////////////////////////////////8AAAAA////////////////8HnAA/8AAA//wAAAD/AAAAAAP//P////////////////////////////////////wAAQF////////////////+AgBAPjAAAP/4AAAAAAAAAAAf/+H////////////////////////////////////+AAAH////////////////8ABgIAPIAAB/8AAAAAAAAAAAv/+D/////////////////////////////////x//5AAAD/////////////////AAAn+AAAAAP/AAAAAAAAIAAf//gf///////////////////////////////i5//gAAAAP//5v////////////AAAA/8AAAAB7gAAAAAAAAAAH//wP///////////////////////////////wY//gAAAAD//98P///////////wAAAP/kIAAAAwAAAAAAAAAAB///N9H/////////////////////////////wA/hAAAAAAD/+YAA//////////4AAAD/4GAAAAAAAAAAAAAAAAP//4Aj////////////////////////////34A8AAAAAAAA3/AAAD//////////AAAB/+DwAAAAAAAAAAAAAEAB8/8D///////////////////////////+AAQAeQAAAAAAAAPmAAAJ/////////8AAAP//+AAAAAAAAAAAAAmAAMP8BH///////////////////////////AAAAfAAAAAAAAADnAAAB//////////gAAB///wAAAAAAAAAAAAH4AAJ/IR///////////////////////////AAAAf8AAAAAAAABBAAAAO//////////wAAf//8AAAAAAAAAAAAA+AAOPgP///////////////////////////AAAAP+AAAAAAAADgAAAABn//////////AAH///gAAAAAAAAAAAAPAADjoD///////////////////////////gAAAH/QAAAAAAAEgAAAAAN//////////+AD///8AAAAAAAAAAAAB8AA6gA///////////////////////////gAAAB/wAAAAAAAOAAAAAABH//////////+H////8AAAAAAAAAAAPHAAMgO///////////////////////////xAAAAf8CAAAAAAQAAAAAAAZ///////////g////9gAAAAAAAAAAPg8ABvf////////////////////////////GIAAH4AAAAAAAAAAAAAAACX//////////4v///9+AAAAAAAAAAD4PAP///////////////////////////////+AAA+AAAAAAAAAAAAAAAABv//////////D/////gAAAAAAAAAAeP8D////////////////////////////////gAAOAAAAACAAAAAAAAAAAP//////////4/////wAAAAAAAAAAeP/D////////////////////////////////YAADgAAAAAAAAAAAAAAAAB////////////////kAAAAAAAAAAAA/z////////////////////////////////zAAAgAAAAAAAAAAAAAAAAAf///////////////jAAAAAAAAAAAAYD////////////////////////////////4wAAAAAAAAAAAAAAAAAAAADv////////////+EAoAAAAAAAAAAAAB////////////////////////////////+OAAAAAAAAAAAAAAAAAAAAAO////////////+cAPwAAAAAAAAAAAD/////////////////////////////////iAAAAAAAAAAAAAAAAAAAAAAv///////////+/AH8AAAAAAAAAAAf/////////////////////////////////4gAAAAAAAAAAAAAAAAAAAAAf////////////fwC7AAAAAAAAAAAB/////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAD////////////v8ABYAAAAAAAAAAAH////////+f//////////////////////+CAAAAAAAAAAAAAAAAAAAAAAf/////////////JgAAAAAAAAAAAAA///////48P///////////////////////DAAAAAAAAAAAAAAAAAAAAAAP//////////////gAAAAAAAAAAAAAH//9///8PH///////////////////////gAAAAAAAAAAAAAAAAAAAAAAD/////////////ngAAAAAAAAAAAAAD//+P///Ax///////////////////////wGAAAAAAAAAAAAAAAAAAAAAA/////////////DAAAAAAAAAAAAAAA//zw///gAH//////////////////////4B4AAAAAAAAAAAAAAAAAAAAAP////////////AAAAAAAAAAAAAAD6P5weD//wAAf/////////////////////8AfAAAAAAAAAAAAAAAAAAAAAH////////////wAAAAAAAAAAAAAB//8ADwP/8AAB/////////////////////AAfAAAAAAAAAAAAAAAAAAAAAA////////////8AAAAAAAAAAAAAAf//gIeB//AUAf////////////////////gAEAAAAAAAAAAAAAAAAAAAAAAP///////////8AAAAAAAAAAAAAAD//gAD4P/4fwP////////////////////wAAgAAAAAAAAAAAAAAAAAAAAAH///////////8AAAAAAAAAAAAAAA//gAwH30B/////////////////////5/4AAYAAAAAAAAAAAAAAAAAAAAAA///////////+AAAAAAAAAAAAAAAf/wAMAw8H/////////////////////8f4AAPAAAAAAAAAAAAAAAAAAAAAAP//////////6AAAAAAAAAAAAAAAH/8ADAEHB/////////////////////6AOAABgAAAAAAAAAAAAAAAAAAAAAB//////////+gAAAAAAAAAAQAAAA//AAABA8P////////////////////+AHwAA4AAAAAAAAAAAAAAAAAAAAAAP//////////4AAAAAAAAAAAQAAAP/gAAPAeB/////////////////////5AeAAcAAAAAAAAAAAAAAAAAAAAAAD//////////8AAAAAAAAAAAAAAAAfgABAwBgf/////////////////////8DwAvAAAAAAAAAAAAAAAAAAAAAAAf//////////AAAAAAAAAAAAAAAAGAf/4AAABjH///////////////////4A8APwAAAAAAAAAAAAAAAAAAAAAAD//////////4AAAAAAAAAAAAAAAAg///AAACAB///////////////////8APAX0AAAAAAAAAAAAAAAAAAAAAAAf/////////8AAAAAAAAAAAAAAAAf///wAAEAMf//////////////////+AGA/2AAAAAAAAAAAAAAAAAAAAAAAB/////////8AAAAAAAAAAAAAAAAH///wAAAAAH///////////////////4AEywAAAAAAAAAAAAAAAAAAAAAAAAH////////8AAAAAAAAAAAAAAAAH////AAAAAD///////////////////+AA7oAAAAAAAAAAAAAAAAAAAAAAAAA////////+AAAAAAAAAAAAAAAAH////+ABAAA////////////////////wAOgAAAAAAAAAAAAAAAAAAAAAAAAAP///////+AAAAAAAAAAAAAAAAB/////8D8AAf///////////////////8ABgAAAAAAAAAAAAAAAAAAAAAAAAABn///////gAAAAAAAAAAAAAAAA//////A/8CH////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAZ///////wAAAAAAAAAAAAAAAAP//////P///////////////////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAACP////8BeAAAAAAAAAAAAAAAAD/////////////x/////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAZ///+DADgAAAAAAAAAAAAAAAB//////////b//8P////////////////gAAAAAAAAAAAAAAAAAAAAAAAAAAAACf//+AAAcAAAAAAAAAAAAAAAA//////////////h////////////////4AAAAAAAAAAAAAAAAAAAAAAAAAAAACx///AAAPAAAAAAAAAAAAAAAA///////////v//4f///////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAOf//wAABwAAAAAAAAAAAAAAAf//////////x///B///////////////+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAx//8AAAMIAAAAAAAAAAAAAAP//////////8P//4Af//////////////ABAAAAAAAAAAAAAAAAAAAAAAAAAAAAEf//AAADQAAAAAAAAAAAAAAH///////////j//+gX//////////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAABh//gAAAAAAAAAAAAAAAAAAB///////////8f//4MAAf///////////4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYf/4AAAAAAAAAAAAAAAAAAA////////////H//+HgAH///////////8YAAAAAAAAAAAAAAAAAAAAAAAAAAAAABD/+AAAAAAAAAAAAAAAAAAAP///////////wf///+AAf//////////8GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/gAADwAAAAAAAAAAAAAAH///////////+H////wAD//////////+BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/4AADPiAAAAAAAAAAAAAD////////////x////+AA/////v////4AQAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAf+AA4IMAAAAAAAAAAAAAA////////////8P////AAH///8D///94AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/wA+AB4AAAAAAAAAAAAAP////////////j////gAAn//+Af//8IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+APAAPgAAAAAAAAAAAAB////////////4f///wAAB///gD//+AAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAf/gHwAAB4AAAAAAAAAAAAf///////////+D///8AAAf//gAf//DgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/+D8AAAfgAAAAAAAAAAAH////////////w///+AAAH//wAD//w4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH//+AAMCBAAAAAAAAAAAB////////////+H///AAAA//4AA//+AAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//gAAAAAAAAAAAAAAAAf////////////g///AAAAP/4AAP//wAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//4AAAAAAAAAAAAAAEAH////////////8H/+AAAAD/+AADv/+AABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADH9MAAAAAAAAAAAAAAAB/////////////B//AAAAA/+AAAR//wAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//wAAAAAAAAAAAAAIA/////////////wf/gAAAAH/AAAAf/+AAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/8AAAABAAAAAAAAAAP/////////////n/AAAAAA/wAAAH//gAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+AAAAAQAAAAAAAAAD/////////////9+AAAAAAP8AAAB//4AAHgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgAAAABAAAAAAAAAA//////////////sAAAAAAD/AAAAd/+AAEQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAIAAAAAAAAAAAAP/////////////8AAgAAAAfwAAADH/gAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAAEgAAAAAAAAAAAA/////////////+ACAAAAAH4AAABw/4AAEQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAfeAAAAAAAAAAAAH/////////////wfgAAAAA+AAAAIP8AARAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8AH3+4AAAAAAAAAAB///////////////wAAAAAPgAAACA8AAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADhB9//gAAAAAAAAAAH//////////////8AAAAADwAAAAwGAAACIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdt///8AAAAAAAAAAB///////////////AAAAAAZgAAAcBAAAAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAx////wAAAAAAAAAAP//////////////gAAAAAAcAAADAAAAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEf///+AAAAAAAAAAD//////////////wAAAAAAHAAAAYAAAAG8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////wAAAAAAAAAAP/////////////8AAAAAABwAAADAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////+AAAAAAAAAAA//4H/////////+AAAAAAAIAAAA4AABwBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/////gAAAAAAAAAH/4A//////////gAAAAAAAAAAQHAAB+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/////8AAAAAAAAAAwAAP/////////wAAAAAAAAAADh4AA/AAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAA//////gAAAAAAAAAAAAAD////////4AAAAAAAAAAAceBAfgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/////8AAAAAAAAAAAAAA////////8AAAAAAAAAAADzgAP4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH//////AAAAAAAAAAAAAAP///////+AAAAAAAAAAAAcYAP+AAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//////4AAAAAAAAAAAAAD////////AAAAAAAAAAAADzAT/wBEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//////+AAAAAAAAAAAAAA////////AAAAAAAAAAAAC/YH/+YggAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAA///////wAAAAAAAAAAAAEf///////gAAAAAAAAAAAAH4B/+IQYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAP//////+AAAAAAAAAAAAAH///////wAAAAAAAAAAAAA+Af/gAMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH///////8AAAAAAAAAAAAB///////8AAAAAAAAAAAAAHwH/wsAD0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB///////vwAAAAAAAAAAAAf//////+AAAAAAAAAAAAAJ8g/4eMCcWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///////+gAAAAAAAAAAAD///////AAAAAAAAAAAAAAf4P+HgAAn8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB////////fwAAAAAAAAAAAf//////gAAAAAAAAAAAAAL+AXhsF47/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//////////AAAAAAAAAAAD//////4AAAAAAAAAAAAAAfAAQLAgL//gAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/////////4AAAAAAAAAAAf/////8AAAAAAAAAAAAAADwAACoAAH/+AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH//////////wAAAAAAAAAAH/////+gAAAAAAAAAAAAAAMAABjAAAP/kMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//////////8AAAAAAAAAAA//////gAAAAAAAAAAAAAAAgAAAAAAD/+cCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//////////AAAAAAAAAAAP/////8AAAAAAAAAAAAAAAfEAAAAAgf/wAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//////////4AAAAAAAAAAD//////AAAAAAAAAAAAAAAB/wAAACAP/4ABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/////////8AAAAAAAAAAAf/////wAAAAAAAAAAAAAAAAfxAgQAC/HAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//////////AAAAAAAAAAAH/////8AAAAAAAAAAAAAAAAAGxgwAADw4ACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/////////gAAAAAAAAAAB//////AAAAAAAAAAAAAAAAAABggAAAAHAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/////////4AAAAAAAAAAAf/////4AAAAAAAAAAAAAAAAAAAQAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/////////4AAAAAAAAAAAD/////+AAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP////////+AAAAAAAAAAAA//////hAAAAAAAAAAAAAAAAAAAAEgAIAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/////////AAAAAAAAAAAAf/////4AAAAAAAAAAAAAAAAAAAAA/wGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf////////gAAAAAAAAAAAP//////ABgAAAAAAAAAAAAAAAAAAf4BwAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAD////////4AAAAAAAAAAAD//////wAYAAAAAAAAAAAAAAAAAAP+AcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////+AAAAAAAAAAAA//////8AOAAAAAAAAAAAAAAAAABj/AHgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH////////gAAAAAAAAAAAf/////+AHwAAAAAAAAAAAAAAAAB//4B8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf///////4AAAAAAAAAAAH//////gH4AAAAAAAAAAAAAAAAAf//AfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB///////+AAAAAAAAAAAB//////wH+AAAAAAAAAAAAAAAAA///8P4AAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAH///////AAAAAAAAAAAAf/////wB/AAAAAAAAAAAAAAAAAf///z+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB///////wAAAAAAAAAAAH/////4A/wAAAAAAAAAAAAAAAAD/////gAAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAP//////8AAAAAAAAAAAB/////8AH8AAAAAAAAAAAAAAAAB/////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////AAAAAAAAAAAAP////8AB+AAAAAAAAAAAAAAAAA//////gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA///////gAAAAAAAAAAAB////+AAfgAAAAAAAAAAAAAAAB//////+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//////wAAAAAAAAAAAAf////wAP4AAAAAAAAAAAAAAAH///////gAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//////8AAAAAAAAAAAAD////8AD+AAAAAAAAAAAAAAAD///////8AAAEgAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////+AAAAAAAAAAAAA/////AB/AAAAAAAAAAAAAAAD////////AAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/////+AAAAAAAAAAAAAP////4APwAAAAAAAAAAAAAAA////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/////8AAAAAAAAAAAAAB////8AD8AAAAAAAAAAAAAAAf////////gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/////4AAAAAAAAAAAAAAf////AA+AAAAAAAAAAAAAAAH////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP////8AAAAAAAAAAAAAAH////AAHgAAAAAAAAAAAAAAB/////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////+AAAAAAAAAAAAAAB////AAAAAAAAAAAAAAAAAAAP////////4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/////gAAAAAAAAAAAAAAf///4AAAAAAAAAAAAAAAAAAD////////+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf////4AAAAAAAAAAAAAAD///+AAAAAAAAAAAAAAAAAAA/////////gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH////+AAAAAAAAAAAAAAA////AAAAAAAAAAAAAAAAAAAP////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/////gAAAAAAAAAAAAAAH///wAAAAAAAAAAAAAAAAAAB/////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf////gAAAAAAAAAAAAAAA///4AAAAAAAAAAAAAAAAAAAf////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH////4AAAAAAAAAAAAAAAP//8AAAAAAAAAAAAAAAAAAAH////////4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////4AAAAAAAAAAAAAAAB//+AAAAAAAAAAAAAAAAAAAB////////+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////8AAAAAAAAAAAAAAAAf//AAAAAAAAAAAAAAAAAAAAP////////gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP////AAAAAAAAAAAAAAAAD//gAAAAAAAAAAAAAAAAAAAD//4B////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////wAAAAAAAAAAAAAAAB//wAAAAAAAAAAAAAAAAAAAA//gAP///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////4AAAAAAAAAAAAAAAAP/wAAAAAAAAAAAAAAAAAAAAP/wAB7//+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//78AAAAAAAAAAAAAAAAB4AAAAAAAAAAAAAAAAAAAAAH8AAAJ///AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAA3//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB///4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//4AAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAf//+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/+AAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAP///gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//gAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAH///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/gAAAAAMgAAAAAAAAAAAAAAAAAAAAAAAAA///4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzgAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6AAAAAAAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAB//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAf/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB+AAAAAOwAAAAAAAAAAAAAAAAAAAAAAAAAF/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAAAHgAAAAAAAAAAAAAAAAAAAAAAAAAAf/QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwAAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAP/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAB4AAAAAAAAAAAAAAAAAAAAAAAAAAP/4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8AAAAAAAAAAAAAAAAAAAAAAAAAABf+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+AAAAAAAAAAAAAAAAAAAAAAAAAAA/+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfAAAAAAAAAAAAAAAAAAAAAAAAAAAf/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgAAAAAAAAAAAAAAAAAAAAAAAAAAB/4AAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAA//gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABf8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3wAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/4AAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB9AAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAAAAAAPADwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE4AAAAAAAAAAAAAAAAAAAAAAAAAAH/gAAAAAAAf///j/AAcP/+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAAn//QAAAAD//////////////gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAAAAAAAAAAAH/////+AAf///////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAABD8AAAAAAAAAAAAAAAAAAAAAAOAf//////AAf/////////////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC5/gAAAAAAAAAAAAAAAAAAAAABwP//////wA///////////////////+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAADf4AAAAAAAAAAAAAAAAAAwAAH////////8H////////////////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAb/gAAAAAAAAAAABwAf////8//////////D//////////////////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAf+/wAAAAAAAAAAAff+////////////////x///////////////////////wAAAAAAAAAAAAAAAAAAAAD+AAAAATH+AAAAAAAAAAAD//////////////////////////////////////////8AAAAAAAAAAAAAAAAAAACf4IkACggP/4AAAAAAAAAAv//////////////////////////////////////////+AAAAAAAAAAAAAAARgAAADf///5+///8AAAAAAAAAAf//////////////////////////////////////////wAAAAAAAAAAAAABwwAYYwAP/////////AAAAAAAAAAf//////////////////////////////////////////4AAAAAAAAAAAAD//////yD4f///////8AAAAAAAAAAf//////////////////////////////////////////gAAAAAAAAAAAD//////////////////4AAAAAAAAA////////////////////////////////////////////4AAAAAAAAAAAH////////////////H8AAAAAAAAAP////////////////////////////////////////////+AAAAAAAAAPxNf///////////////8AAAAAAAAAD//////////////////////////////////////////////wgAAAAAAAD/////////////////+B8AAAAAHwAD///////////////////////////////////////////////AAAAAAAAAH////////////////8/ABwAAAH8AD///////////////////////////////////////////////gAAAAAAA/AB////////////////78DgAAAB/4AA/////////////////////////////////////////////8AAAAAAAAAAAD////////////////wAAAAAD/8AAA////////////////////////////////////////////+AAAAAAAAAAAB/////////////////4AAAAH4AAB//////////////////////////////////////////////wAAAAAAAAAAf////////////////////gAAAAD///////////////////////////////////////////////+AAAAAAAAAAD////////////////////wAAf/j////////////////////////////////////////////////4AAAAAAAAAH/////////////////////4D////////////////////////////////////////////////////+AAAAAAAD//////////////////////////////////////////////////////////////////////////////wAOAAAAf///////////////////////////////////////////////////////////////////////////////////8AAA///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////w==";
  const maskBytes = (() => {
    const bin = atob(MASK_B64);
    const u = new Uint8Array(bin.length);
    for(let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return u;
  })();

  function isLand(lat, lon){
    let col = Math.floor((lon + 180) / 360 * MW);
    let row = Math.floor((90 - lat) / 180 * MH);
    if(col < 0) col = 0; else if(col >= MW) col = MW - 1;
    if(row < 0) row = 0; else if(row >= MH) row = MH - 1;
    const idx = row * MW + col;
    return (maskBytes[idx >> 3] >> (7 - (idx & 7))) & 1;
  }

  /* the disc area grows with R², so the cloud grows with it or the
     continents read as scattered dots instead of landmass */
  /* mobile: few dots, still readable landmass; desktop stays moderate */
  const TARGET     = isMobile ? 750 : (window.innerWidth < 1100 ? 1800 : 2600);
  const CANDIDATES = isMobile ? 4200 : (window.innerWidth < 1100 ? 10000 : 14000);
  const GOLDEN = Math.PI * (3 - Math.sqrt(5));

  const P = [];
  for(let i = 0; i < CANDIDATES && P.length < TARGET; i++){
    const y   = 1 - (i / (CANDIDATES - 1)) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y*y));
    const th  = GOLDEN * i;
    const x = Math.cos(th) * rad;
    const z = Math.sin(th) * rad;
    const lat = Math.asin(y) * 180 / Math.PI;
    const lon = Math.atan2(z, x) * 180 / Math.PI;
    if(!isLand(lat, lon)) continue;
    /* equirectangular over-samples the poles — thin Antarctica out */
    if(lat < -62 && Math.random() > 0.22) continue;

    const su = Math.random() * 2 - 1;
    const sp = Math.random() * Math.PI * 2;
    const sr = Math.sqrt(Math.max(0, 1 - su*su));
    const dist = 1.9 + Math.random() * 1.7;
    P.push({
      x, y, z,
      sx: Math.cos(sp) * sr * dist, sy: su * dist, sz: Math.sin(sp) * sr * dist,
      delay: Math.random() * 0.42,
      tone: Math.random() > 0.86 ? 1 : 0
    });
  }
  const N = P.length;

  function toVec(lat, lon){
    const la = lat * Math.PI / 180, lo = lon * Math.PI / 180;
    return { x: Math.cos(la)*Math.cos(lo), y: Math.sin(la), z: Math.cos(la)*Math.sin(lo) };
  }
  const HOME = { name:'MONTEVIDEO', lat:-34.90, lon:-56.16, c:[255,115,0], home:true };
  const CITIES = [
    HOME,
    { name:'BUENOS AIRES', lat:-34.60, lon:-58.38, c:[255,149,56] },
    { name:'SÃO PAULO',    lat:-23.55, lon:-46.63, c:[255,178,94] },
    { name:'SANTIAGO',     lat:-33.45, lon:-70.67, c:[240,238,232] },
    { name:'CDMX',         lat: 19.43, lon:-99.13, c:[255,149,56] },
    { name:'MIAMI',        lat: 25.76, lon:-80.19, c:[255,178,94] },
    { name:'MADRID',       lat: 40.42, lon: -3.70, c:[240,238,232] },
  ];
  CITIES.forEach(c => { const v = toVec(c.lat, c.lon); c.x=v.x; c.y=v.y; c.z=v.z; });

  const ARC_SEG = 54;
  const ARCS = CITIES.slice(1).map((city, i) => {
    const a = HOME, b = city;
    const dot = Math.max(-1, Math.min(1, a.x*b.x + a.y*b.y + a.z*b.z));
    const omega = Math.acos(dot);
    const so = Math.sin(omega);
    const lift = 0.10 + (omega / Math.PI) * 0.26;
    const pts = [];
    for(let s = 0; s <= ARC_SEG; s++){
      const t = s / ARC_SEG;
      let px, py, pz;
      if(so < 1e-6){ px=a.x; py=a.y; pz=a.z; }
      else {
        const k1 = Math.sin((1-t)*omega) / so, k2 = Math.sin(t*omega) / so;
        px = a.x*k1 + b.x*k2; py = a.y*k1 + b.y*k2; pz = a.z*k1 + b.z*k2;
      }
      const len = Math.hypot(px, py, pz) || 1;
      const r = 1 + lift * Math.sin(Math.PI * t);
      pts.push({ x: px/len*r, y: py/len*r, z: pz/len*r });
    }
    return { pts, c: city.c, phase: i * 0.34, speed: 0.20 + i * 0.018 };
  });

  /* negative tilt = camera just south of the equator. Our subject is the
     southern hemisphere, so a positive tilt buried Montevideo on the limb. */
  const TILT = -16 * Math.PI / 180;
  const CAM  = 2.75;
  const AUTO = 0.155;
  /* a point at longitude L faces the camera when rotY = L − 90°.
     Centring South America (≈ −62°) puts Montevideo just right of centre. */
  let rotY = (-62 - 90) * Math.PI / 180;
  const MAX_VEL = 3.2;
  let vel = 0, dragging = false, lastPX = 0, tiltX = 0, tiltXTarget = 0;
  let mx = -1e5, my = -1e5, lensOn = 0, lensTarget = 0;

  /* a sphere in perspective projects to a disc LARGER than R: the silhouette
     radius is max over z of sqrt(1−z²)·CAM/(CAM−z) = 1.0735 for CAM=2.75 */
  const SIL = 1.0735;

  let W=0, H=0, cx=0, cy=0, R=0, dpr=1, dotScale=1, uiScale=1;
  function resize(){
    const rect = canvas.getBoundingClientRect();
    if(!rect.width) return;
    dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.35);
    W = rect.width; H = rect.height;
    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    /* centre below the midline so the headline clears the planet and the
       lower limb crops against the fold — "planet rising" */
    cx = W / 2;
    cy = H * 0.58;
    R  = Math.min(W * 0.50, H * 0.44);
    dotScale = Math.max(0.85, Math.min(2.1, R / 200));
    uiScale  = Math.max(1, Math.min(1.75, R / 240));
  }
  resize();
  window.addEventListener('resize', resize);

  let intro = reduce ? 1 : 0;
  const INTRO_MS = 2100;
  let started = false, startT = 0;
  function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }
  function easeOutQuint(t){ return 1 - Math.pow(1 - t, 5); }

  const BUCKETS = 22;
  const bufO = Array.from({length: BUCKETS}, () => []);
  const bufA = Array.from({length: BUCKETS}, () => []);
  const LX = 0.52, LY = 0.42, LZ = 0.75;
  let lastTime = performance.now();

  function frame(now){
    /* GLOBE_FRAME_THROTTLE */
    if(isMobile){
      frame._t = (frame._t|0) + 1;
      if((frame._t & 1) === 1){ if(running) requestAnimationFrame(frame); return; }
    }
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    if(started && intro < 1) intro = Math.min(1, (now - startT) / INTRO_MS);

    if(!dragging){
      vel *= Math.pow(0.945, dt * 60);
      if(Math.abs(vel) < 0.0006) vel = 0;
      rotY += (AUTO + vel) * dt;
    }
    tiltX  += (tiltXTarget - tiltX) * Math.min(1, dt * 7);
    lensOn += (lensTarget - lensOn) * Math.min(1, dt * 8);

    const cR = Math.cos(rotY), sR = Math.sin(rotY);
    const tt = TILT + tiltX, cT = Math.cos(tt), sT = Math.sin(tt);

    ctx.clearRect(0, 0, W, H);

    const sr = R * SIL;
    if(intro > 0.02){
      const g = ctx.createRadialGradient(cx, cy, sr * 0.5, cx, cy, sr * 1.42);
      g.addColorStop(0,    'rgba(255,115,0,' + (0.11 * intro).toFixed(3) + ')');
      g.addColorStop(0.52, 'rgba(255,115,0,' + (0.055 * intro).toFixed(3) + ')');
      g.addColorStop(1,    'rgba(255,115,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(cx - sr*1.45, cy - sr*1.45, sr*2.9, sr*2.9);
    }

    for(let i = 0; i < BUCKETS; i++){ bufO[i].length = 0; bufA[i].length = 0; }
    const introE = easeOutQuint(intro);
    const lensR = R * 0.42, lensK = lensOn;

    for(let i = 0; i < N; i++){
      const p = P[i];
      let bx = p.x, by = p.y, bz = p.z;
      if(intro < 1){
        const local = Math.max(0, Math.min(1, (introE - p.delay*(1-introE)) / (1 - p.delay*0.5)));
        const e = easeOutCubic(local);
        bx = p.sx + (p.x - p.sx)*e; by = p.sy + (p.y - p.sy)*e; bz = p.sz + (p.z - p.sz)*e;
      }
      const x1 =  bx * cR + bz * sR;
      const z1 = -bx * sR + bz * cR;
      const y2 = by * cT - z1 * sT;
      const z2 = by * sT + z1 * cT;

      const depth = CAM - z2;
      if(depth <= 0.05) continue;
      const persp = CAM / depth;
      let sx = cx + x1 * R * persp;
      let sy = cy - y2 * R * persp;

      const lam = x1*LX + y2*LY + z2*LZ;
      const light = 0.42 + 0.58 * Math.max(0, lam);
      const front = z2 > 0;
      let a = (front ? 0.30 + 0.42*z2 : 0.115 + 0.075*(1+z2)) * light;
      let size = (p.tone ? 1.45 : 1.25) * persp * dotScale * (dpr > 1 ? 1 : 1.12);

      if(lensK > 0.01){
        const ddx = sx - mx, ddy = sy - my;
        const d2 = ddx*ddx + ddy*ddy;
        if(d2 < lensR*lensR){
          const d = Math.sqrt(d2) || 0.0001;
          const f = 1 - d/lensR, ff = f*f*lensK;
          sx += (ddx/d)*ff*16; sy += (ddy/d)*ff*16;
          size *= 1 + ff*1.35;
          a = Math.min(0.95, a + ff*0.4);
        }
      }
      if(intro < 1) a *= introE;
      if(a <= 0.012) continue;
      let b = (a * BUCKETS) | 0;
      if(b >= BUCKETS) b = BUCKETS - 1;
      (p.tone ? bufA : bufO)[b].push(sx, sy, size);
    }

    for(let b = 0; b < BUCKETS; b++){
      const alpha = ((b + 0.5) / BUCKETS).toFixed(3);
      const ao = bufO[b];
      if(ao.length){
        ctx.fillStyle = 'rgba(255,115,0,' + alpha + ')';
        for(let k = 0; k < ao.length; k += 3){ const s = ao[k+2]; ctx.fillRect(ao[k]-s/2, ao[k+1]-s/2, s, s); }
      }
      const aa = bufA[b];
      if(aa.length){
        ctx.fillStyle = 'rgba(255,205,150,' + alpha + ')';
        for(let k = 0; k < aa.length; k += 3){ const s = aa[k+2]; ctx.fillRect(aa[k]-s/2, aa[k+1]-s/2, s, s); }
      }
    }

    if(intro > 0.3){
      ctx.strokeStyle = 'rgba(255,115,0,' + (0.13 * intro).toFixed(3) + ')';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, sr, 0, Math.PI*2); ctx.stroke();
    }

    if(intro > 0.55){
      const arcAlpha = (intro - 0.55) / 0.45;
      const tSec = now / 1000;
      ctx.lineCap = 'round';
      ARCS.forEach(arc => {
        const head = ((tSec * arc.speed + arc.phase) % 1.45) / 1.0;
        for(let s = 0; s < ARC_SEG; s++){
          const p0 = arc.pts[s], p1 = arc.pts[s+1];
          const x0 =  p0.x*cR + p0.z*sR, z0 = -p0.x*sR + p0.z*cR;
          const y0 =  p0.y*cT - z0*sT,  Z0 =  p0.y*sT + z0*cT;
          const x1 =  p1.x*cR + p1.z*sR, z1b = -p1.x*sR + p1.z*cR;
          const y1 =  p1.y*cT - z1b*sT, Z1 =  p1.y*sT + z1b*cT;
          const d0 = CAM - Z0, d1 = CAM - Z1;
          if(d0 <= 0.05 || d1 <= 0.05) continue;
          const k0 = CAM/d0, k1 = CAM/d1;
          const t = s / ARC_SEG, zMid = (Z0 + Z1) / 2;
          let a = (zMid > 0 ? 0.30 : 0.055) * arcAlpha;
          const dHead = head - t;
          if(dHead >= 0 && dHead < 0.16) a += (1 - dHead/0.16) * (zMid > 0 ? 0.82 : 0.18) * arcAlpha;
          if(a <= 0.02) continue;
          ctx.strokeStyle = `rgba(${arc.c[0]},${arc.c[1]},${arc.c[2]},${a.toFixed(3)})`;
          ctx.lineWidth = zMid > 0 ? 1.25 : 0.8;
          ctx.beginPath();
          ctx.moveTo(cx + x0*R*k0, cy - y0*R*k0);
          ctx.lineTo(cx + x1*R*k1, cy - y1*R*k1);
          ctx.stroke();
        }
      });
    }

    if(intro > 0.7){
      const la = (intro - 0.7) / 0.3, tSec = now / 1000;
      ctx.textBaseline = 'middle';

      /* project every city once, then draw pins, then labels with collision
         avoidance — Montevideo/Buenos Aires/Santiago sit within a few degrees
         of each other and their labels overlapped into mush */
      const vis = [];
      CITIES.forEach((city, ci) => {
        const x1 =  city.x*cR + city.z*sR;
        const z1 = -city.x*sR + city.z*cR;
        const y2 =  city.y*cT - z1*sT;
        const z2 =  city.y*sT + z1*cT;
        if(z2 <= 0.06) return;
        const persp = CAM / (CAM - z2);
        const a = Math.min(1, (z2 - 0.06) / 0.30) * la;
        if(a <= 0.02) return;
        vis.push({ city, ci, z2, a, sx: cx + x1*R*persp, sy: cy - y2*R*persp });
      });

      vis.forEach(v => {
        const [r, g, b] = v.city.c;
        const rad = (v.city.home ? 3.6 : 2.6) * uiScale;
        const rp = ((tSec * (v.city.home ? 0.75 : 0.5) + v.ci*0.31) % 1);
        const rr = rad + rp * (v.city.home ? 20 : 13) * uiScale;

        ctx.strokeStyle = `rgba(${r},${g},${b},${((1-rp)*0.42*v.a).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(v.sx, v.sy, rr, 0, Math.PI*2); ctx.stroke();

        const gr = ctx.createRadialGradient(v.sx, v.sy, 0, v.sx, v.sy, rad*4.5);
        gr.addColorStop(0, `rgba(${r},${g},${b},${(0.55*v.a).toFixed(3)})`);
        gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = gr;
        ctx.beginPath(); ctx.arc(v.sx, v.sy, rad*4.5, 0, Math.PI*2); ctx.fill();

        ctx.fillStyle = `rgba(255,${Math.min(255,g+70)},${Math.min(255,b+90)},${v.a.toFixed(3)})`;
        ctx.beginPath(); ctx.arc(v.sx, v.sy, rad, 0, Math.PI*2); ctx.fill();
      });

      /* home always gets its label; the rest compete, most face-on first */
      const order = vis.slice().sort((p, q) =>
        (q.city.home ? 2 : 0) - (p.city.home ? 2 : 0) || q.z2 - p.z2);
      const taken = [];
      order.forEach(v => {
        if(!v.city.home && v.z2 <= 0.34) return;
        const [r, g, b] = v.city.c;
        const rad = (v.city.home ? 3.6 : 2.6) * uiScale;
        const lw  = (v.city.home ? 15 : 11) * uiScale;
        const fs  = Math.min(12.5, (v.city.home ? 9.5 : 8.5) * uiScale);

        ctx.font = `500 ${fs}px 'Poppins', system-ui, sans-serif`;
        if('letterSpacing' in ctx) ctx.letterSpacing = '0.14em';
        const tw = ctx.measureText(v.city.name).width;
        const tx = v.sx + rad + lw + 5, ty = v.sy - lw*0.62;
        const box = { x: tx - 4, y: ty - fs*0.8, w: tw + 8, h: fs*1.6 };

        const hit = taken.some(t => !(box.x + box.w < t.x || t.x + t.w < box.x ||
                                      box.y + box.h < t.y || t.y + t.h < box.y));
        if(hit){ if('letterSpacing' in ctx) ctx.letterSpacing = '0px'; return; }
        taken.push(box);

        ctx.strokeStyle = `rgba(${r},${g},${b},${(0.5*v.a).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(v.sx + rad + 2, v.sy - 1);
        ctx.lineTo(v.sx + rad + lw, ty);
        ctx.stroke();

        /* dark halo so the name reads over the dot cloud */
        ctx.shadowColor = 'rgba(3,7,14,0.95)';
        ctx.shadowBlur = 6;
        ctx.fillStyle = v.city.home
          ? `rgba(255,225,190,${v.a.toFixed(3)})`
          : `rgba(${r},${g},${b},${(0.82*v.a).toFixed(3)})`;
        ctx.fillText(v.city.name, tx, ty);
        ctx.shadowBlur = 0;
        if('letterSpacing' in ctx) ctx.letterSpacing = '0px';
      });
    }

    if(running) requestAnimationFrame(frame); /* GLOBE_FRAME_THROTTLE */
  }

  /* three other rAF loops share this page — don't burn frames off-screen */
  let running = false;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        if(!started){ started = true; startT = performance.now(); }
        if(!running){ running = true; lastTime = performance.now(); requestAnimationFrame(frame); }
      } else { running = false; }
    });
  }, { threshold: 0.05 });
  io.observe(stage);

  let hintHidden = false;
  function hideHint(){ if(!hintHidden && hint){ hintHidden = true; hint.style.opacity = '0'; } }

  canvas.addEventListener('pointerdown', e => {
    dragging = true; lastPX = e.clientX; vel = 0;
    canvas.setPointerCapture(e.pointerId);
    hideHint();
  });
  canvas.addEventListener('pointermove', e => {
    const rect = canvas.getBoundingClientRect();
    mx = e.clientX - rect.left; my = e.clientY - rect.top;
    if(e.pointerType === 'mouse') lensTarget = 1;
    if(dragging){
      const dx = e.clientX - lastPX;
      lastPX = e.clientX;
      rotY += dx * 0.0068;
      /* clamped so a hard flick can't strobe */
      vel = Math.max(-MAX_VEL, Math.min(MAX_VEL, dx * 0.34));
    }
  });
  function endDrag(e){
    if(!dragging) return;
    dragging = false;
    try { canvas.releasePointerCapture(e.pointerId); } catch(_){}
  }
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('pointerleave', () => { lensTarget = 0; mx = -1e5; my = -1e5; });
})();
