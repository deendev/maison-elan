// Art-directed image system. Every image on the site goes through <Picture>.
// If a real photograph is registered in PHOTOS (src/photos.js), it is used.
// Otherwise an SVG composition in the brand palette is drawn in its place.
import { useId } from 'react';
import { PHOTOS, FOCUS } from './photos.js';

/* ------------------------------------------------------------------ */
/* Colour helpers                                                       */
/* ------------------------------------------------------------------ */
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = amt < 0 ? 0 : 255, t = Math.abs(amt);
  r = Math.round((f - r) * t + r); g = Math.round((f - g) * t + g); b = Math.round((f - b) * t + b);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
const lum = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
};

/* ------------------------------------------------------------------ */
/* Garment silhouettes, viewBox 0 0 400 500                             */
/* ------------------------------------------------------------------ */
const BODY = {
  sweater: 'M150 78 C175 92 225 92 250 78 L318 104 C338 112 348 126 351 146 L372 330 C373 341 366 347 356 348 L326 351 C316 352 309 345 308 336 L292 214 L294 418 C294 428 287 434 277 434 L123 434 C113 434 106 428 106 418 L108 214 L92 336 C91 345 84 352 74 351 L44 348 C34 347 27 341 28 330 L49 146 C52 126 62 112 82 104 Z',
  shirt: 'M155 70 L245 70 L310 98 C328 106 336 118 339 136 L362 318 C363 328 357 334 348 335 L322 338 C313 339 307 333 306 325 L290 200 L292 438 C292 448 270 456 200 456 C130 456 108 448 108 438 L110 200 L94 325 C93 333 87 339 78 338 L52 335 C43 334 37 328 38 318 L61 136 C64 118 72 106 90 98 Z',
  blazer: 'M158 66 L242 66 L312 92 C332 100 341 114 343 134 L360 336 C361 346 355 352 346 352 L320 354 C311 355 305 349 304 340 L292 214 L296 430 C296 440 289 446 279 446 L121 446 C111 446 104 440 104 430 L108 214 L96 340 C95 349 89 355 80 354 L54 352 C45 352 39 346 40 336 L57 134 C59 114 68 100 88 92 Z',
  coat: 'M162 58 L238 58 L308 84 C328 92 337 106 339 126 L358 352 C359 362 353 368 344 368 L318 370 C309 371 303 365 302 356 L292 214 L304 474 C304 482 298 486 290 486 L110 486 C102 486 96 482 96 474 L108 214 L98 356 C97 365 91 371 82 370 L56 368 C47 368 41 362 42 352 L61 126 C63 106 72 92 92 84 Z',
  dress: 'M170 48 L176 48 L184 132 L216 132 L224 48 L230 48 L240 142 C246 170 244 196 236 214 C268 300 300 392 318 462 C268 476 132 476 82 462 C100 392 132 300 164 214 C156 196 154 170 160 142 Z',
  skirt: 'M128 70 L272 70 L278 100 C300 220 324 360 336 462 C280 476 120 476 64 462 C76 360 100 220 122 100 Z',
  trousers: 'M126 50 L274 50 L280 92 L306 456 C307 464 301 470 293 470 L228 470 C221 470 216 465 215 458 L200 172 L185 458 C184 465 179 470 172 470 L107 470 C99 470 93 464 94 456 L120 92 Z',
  bag: 'M98 214 L302 214 L326 444 C327 455 320 462 309 462 L91 462 C80 462 73 455 74 444 Z',
  tote: 'M84 170 L316 170 L336 452 C337 462 330 468 320 468 L80 468 C70 468 63 462 64 452 Z',
  sneaker: 'M48 330 C48 302 62 286 88 282 L168 272 C196 268 214 252 232 236 C248 222 266 220 282 228 L306 240 C326 250 340 264 352 282 C364 298 368 314 368 330 L368 344 L48 344 Z',
  loafer: 'M48 334 C50 312 64 300 90 298 L200 294 C226 292 246 280 266 274 C292 266 320 270 340 286 C356 298 366 314 368 334 L368 346 L48 346 Z',
  scarf: 'M138 40 L262 40 L262 120 C262 150 250 168 236 182 L248 446 L176 446 L184 196 C160 182 138 156 138 120 Z',
  belt: '',
  card: 'M96 176 L304 176 C314 176 320 182 320 192 L320 326 C320 336 314 342 304 342 L96 342 C86 342 80 336 80 326 L80 192 C80 182 86 176 96 176 Z',
};
BODY.polo = BODY.sweater;
BODY.cardigan = BODY.sweater;

function GarmentDetails({ shape, line, light }) {
  const s = { fill: 'none', stroke: line, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const thin = { ...s, strokeWidth: 1.2, opacity: 0.7 };
  switch (shape) {
    case 'sweater':
    case 'polo':
    case 'cardigan': {
      const ribs = [];
      for (let x = 112; x < 290; x += 7) ribs.push(<line key={x} x1={x} y1={410} x2={x} y2={432} {...thin} />);
      for (let x = 50; x < 75; x += 6) ribs.push(<line key={'l' + x} x1={x - 2} y1={330} x2={x - 4} y2={348} {...thin} />);
      for (let x = 330; x < 356; x += 6) ribs.push(<line key={'r' + x} x1={x + 2} y1={330} x2={x + 4} y2={348} {...thin} />);
      return (
        <g>
          {shape === 'sweater' && <path d="M150 78 C168 114 232 114 250 78" {...s} />}
          {shape === 'sweater' && <path d="M156 82 C172 106 228 106 244 82" {...thin} />}
          {shape === 'polo' && (
            <>
              <path d="M150 78 L176 92 L200 150 L224 92 L250 78" {...s} />
              <path d="M150 78 L136 112 L188 128" fill={light} stroke={line} strokeWidth="1.5" />
              <path d="M250 78 L264 112 L212 128" fill={light} stroke={line} strokeWidth="1.5" />
            </>
          )}
          {shape === 'cardigan' && (
            <>
              <path d="M150 78 L200 232 L250 78" {...s} />
              <line x1="200" y1="232" x2="200" y2="432" {...s} />
              {[262, 302, 342, 382].map((y) => <circle key={y} cx="210" cy={y} r="5" fill={line} opacity=".75" />)}
            </>
          )}
          <line x1="108" y1="410" x2="294" y2="410" {...thin} />
          {ribs}
        </g>
      );
    }
    case 'shirt':
      return (
        <g>
          <path d="M155 70 L200 104 L245 70 L236 54 L200 80 L164 54 Z" fill={light} stroke={line} strokeWidth="1.5" />
          <line x1="200" y1="104" x2="200" y2="452" {...thin} />
          <line x1="212" y1="104" x2="212" y2="452" {...thin} />
          {[132, 182, 232, 282, 332, 382].map((y) => <circle key={y} cx="206" cy={y} r="3.6" fill={light} stroke={line} strokeWidth="1" />)}
          <path d="M120 150 L160 150 L160 196 L140 204 L120 196 Z" {...thin} />
          <line x1="58" y1="300" x2="96" y2="304" {...thin} />
          <line x1="342" y1="300" x2="304" y2="304" {...thin} />
        </g>
      );
    case 'blazer':
    case 'coat': {
      const end = shape === 'coat' ? 482 : 442;
      return (
        <g>
          <path d="M158 66 L200 250 L242 66" {...s} />
          <path d="M158 66 L144 118 L170 130 L160 150 L200 250" fill={light} stroke={line} strokeWidth="1.5" opacity=".9" />
          <path d="M242 66 L256 118 L230 130 L240 150 L200 250" fill={light} stroke={line} strokeWidth="1.5" opacity=".9" />
          <line x1="200" y1="250" x2={shape === 'coat' ? 196 : 198} y2={end} {...thin} />
          {(shape === 'coat' ? [290, 350] : [282, 330]).map((y) => <circle key={y} cx="214" cy={y} r="6" fill={line} opacity=".8" />)}
          <line x1="122" y1="346" x2="176" y2="342" {...s} />
          <line x1="224" y1="342" x2="278" y2="346" {...s} />
          <line x1="236" y1="168" x2="270" y2="166" {...thin} />
        </g>
      );
    }
    case 'dress':
      return (
        <g>
          <path d="M164 214 C186 226 214 226 236 214" {...thin} />
          <path d="M184 132 C192 140 208 140 216 132" {...thin} />
          <path d="M150 300 C170 360 168 420 160 466" {...thin} opacity=".35" />
          <path d="M250 300 C232 360 236 420 246 466" {...thin} opacity=".35" />
        </g>
      );
    case 'skirt':
      return (
        <g>
          <line x1="122" y1="100" x2="278" y2="100" {...thin} />
          <path d="M240 100 C250 220 262 340 282 470" {...s} />
          <path d="M240 104 L292 146 L284 156 L236 116" fill={light} stroke={line} strokeWidth="1.2" />
        </g>
      );
    case 'trousers':
      return (
        <g>
          <line x1="120" y1="92" x2="280" y2="92" {...thin} />
          <line x1="200" y1="50" x2="200" y2="170" {...thin} />
          <path d="M160 92 L156 170" {...thin} />
          <path d="M240 92 L244 170" {...thin} />
          <path d="M134 98 L154 150" {...thin} />
          <path d="M266 98 L246 150" {...thin} />
          <line x1="142" y1="200" x2="132" y2="468" {...thin} opacity=".45" />
          <line x1="258" y1="200" x2="268" y2="468" {...thin} opacity=".45" />
          {[150, 180, 220, 250].map((x) => <rect key={x} x={x - 3} y={48} width="6" height="22" fill={line} opacity=".35" />)}
        </g>
      );
    case 'bag':
      return (
        <g>
          <path d="M150 214 C150 116 250 116 250 214" fill="none" stroke={line} strokeWidth="13" strokeLinecap="round" />
          <path d="M150 214 C150 116 250 116 250 214" fill="none" stroke={light} strokeWidth="3" opacity=".4" />
          <path d="M92 214 L308 214 L314 300 C260 318 140 318 86 300 Z" fill={light} opacity=".22" stroke={line} strokeWidth="1.5" />
          <rect x="186" y="294" width="28" height="20" rx="3" fill="#C9A86A" stroke="#8E7444" strokeWidth="1.2" />
          <path d="M84 440 L316 440" {...thin} />
        </g>
      );
    case 'tote':
      return (
        <g>
          <path d="M132 170 C132 70 196 70 196 170" fill="none" stroke={line} strokeWidth="11" />
          <path d="M204 170 C204 70 268 70 268 170" fill="none" stroke={line} strokeWidth="11" />
          <path d="M84 190 L316 190" {...thin} />
          <path d="M120 170 L110 468 M280 170 L290 468" {...thin} opacity=".35" />
        </g>
      );
    case 'sneaker':
      return (
        <g>
          <rect x="44" y="340" width="328" height="26" rx="10" fill={shade('#F2EEE6', 0)} stroke={line} strokeWidth="1.5" />
          <line x1="52" y1="352" x2="366" y2="352" {...thin} />
          <path d="M196 262 L272 236" {...s} />
          {[0, 1, 2, 3].map((i) => <line key={i} x1={206 + i * 16} y1={256 - i * 5} x2={218 + i * 16} y2={272 - i * 5} {...s} />)}
          <path d="M300 240 C320 262 328 290 330 330" {...thin} />
          <path d="M90 300 C130 296 168 300 196 312" {...thin} />
        </g>
      );
    case 'loafer':
      return (
        <g>
          <rect x="44" y="342" width="328" height="16" rx="6" fill={shade(line, 0.2)} />
          <rect x="300" y="356" width="68" height="14" rx="4" fill={shade(line, 0.1)} />
          <path d="M150 300 C180 290 240 286 276 278" {...s} />
          <rect x="196" y="290" width="44" height="12" rx="6" fill="none" stroke={line} strokeWidth="2" transform="rotate(-6 218 296)" />
          <path d="M110 298 C112 288 140 284 150 300" {...thin} />
        </g>
      );
    case 'scarf': {
      const fr = [];
      for (let x = 180; x < 248; x += 6) fr.push(<line key={x} x1={x} y1={446} x2={x + (x % 12 ? 1 : -1)} y2={474} {...thin} />);
      return (
        <g>
          <path d="M138 120 C160 140 240 140 262 120" {...s} />
          <path d="M196 196 L190 446" {...thin} />
          <path d="M226 186 L232 446" {...thin} />
          {fr}
        </g>
      );
    }
    case 'card':
      return (
        <g>
          {[206, 236, 266].map((y) => <path key={y} d={`M80 ${y} C150 ${y + 16} 250 ${y + 16} 320 ${y}`} {...thin} />)}
          <rect x="176" y="296" width="48" height="16" rx="2" fill="none" stroke={line} strokeWidth="1" opacity=".55" />
        </g>
      );
    default:
      return null;
  }
}

function Belt({ color, line, light }) {
  return (
    <g>
      <ellipse cx="200" cy="270" rx="140" ry="96" fill="none" stroke={line} strokeWidth="38" opacity=".9" />
      <ellipse cx="200" cy="270" rx="140" ry="96" fill="none" stroke={color} strokeWidth="34" />
      <ellipse cx="200" cy="270" rx="140" ry="96" fill="none" stroke={light} strokeWidth="1" strokeDasharray="4 6" opacity=".7" />
      <rect x="322" y="236" width="40" height="70" rx="6" fill="none" stroke="#B8975A" strokeWidth="7" />
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={200 + 30 * Math.cos(-0.6 - i * 0.18) * 4.2} cy={270 + Math.sin(-0.6 - i * 0.18) * 96} r="4" fill={line} />)}
    </g>
  );
}

/* A single garment on a studio backdrop. variant 'detail' crops in close. */
export function GarmentArt({ shape = 'sweater', color = '#D6C7AF', tone = '#ECE6DC', variant = 'front', label }) {
  const uid = useId().replace(/:/g, '');
  const dark = lum(color) < 0.35;
  const line = dark ? shade(color, 0.28) : shade(color, -0.32);
  const light = dark ? shade(color, 0.12) : shade(color, 0.22);
  const bgTop = variant === 'detail' ? shade(tone, -0.06) : shade(tone, 0.04);
  const bgBot = variant === 'detail' ? shade(tone, -0.12) : shade(tone, -0.05);
  const isFoot = shape === 'sneaker' || shape === 'loafer';
  const isSmall = shape === 'card' || shape === 'belt';
  let t = 'translate(100 60) scale(1)';
  if (variant === 'detail') {
    t = isFoot ? 'translate(-150 -260) scale(2.3)' : shape === 'bag' ? 'translate(-210 -380) scale(2.4)' : 'translate(-160 -10) scale(2.2)';
  }
  const floorY = isFoot ? 430 : isSmall ? 470 : 560;
  return (
    <svg viewBox="0 0 600 750" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={'bg' + uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={bgTop} />
          <stop offset="1" stopColor={bgBot} />
        </linearGradient>
        <linearGradient id={'vol' + uid} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="#fff" stopOpacity=".22" />
          <stop offset=".45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".2" />
        </linearGradient>
        <radialGradient id={'sh' + uid} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#000" stopOpacity=".22" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="600" height="750" fill={`url(#bg${uid})`} />
      <rect y="600" width="600" height="150" fill="#000" opacity=".025" />
      <g transform={t}>
        <ellipse cx="200" cy={floorY - 60} rx={isSmall ? 150 : 170} ry="20" fill={`url(#sh${uid})`} transform={variant === 'detail' ? '' : 'translate(0 40)'} />
        {shape === 'belt' ? (
          <Belt color={color} line={line} light={light} />
        ) : (
          <>
            <path d={BODY[shape]} fill={color} stroke={line} strokeWidth="1.6" strokeLinejoin="round" />
            <path d={BODY[shape]} fill={`url(#vol${uid})`} />
            <GarmentDetails shape={shape} line={line} light={light} />
          </>
        )}
      </g>
      {label && (
        <text x="36" y="714" fontFamily="Manrope, sans-serif" fontSize="15" letterSpacing="4" fill={shade(tone, -0.45)}>
          {label}
        </text>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Editorial scenes, viewBox 0 0 1600 1000                              */
/* ------------------------------------------------------------------ */
function Figure({ x, y = 860, h = 560, kind = 'woman', fill = '#1E1D1C', coat, light = '#fff', shadow = true, flip = false, walk = false }) {
  const s = h / 600;
  const c = coat || fill;
  const W = kind === 'woman';
  return (
    <g transform={`translate(${x} ${y - h}) scale(${flip ? -s : s} ${s})`}>
      {shadow && (
        <g transform="translate(0 600) skewX(-58) scale(1 .22) translate(0 -600)" opacity=".16">
          <FigureBody W={W} fill="#000" coat="#000" walk={walk} />
        </g>
      )}
      <FigureBody W={W} fill={fill} coat={c} walk={walk} light={light} />
    </g>
  );
}
function FigureBody({ W, fill, coat, walk, light }) {
  return (
    <g>
      {/* legs */}
      {walk ? (
        <>
          <path d="M-10 400 L-34 588 L-14 592 L4 420 Z" fill={fill} />
          <path d="M6 400 L30 586 L50 584 L20 404 Z" fill={fill} />
        </>
      ) : (
        <>
          <path d={W ? 'M-22 400 L-22 584 L-30 592 L-4 592 L-4 404 Z' : 'M-30 380 L-30 584 L-36 593 L-4 593 L-4 384 Z'} fill={fill} />
          <path d={W ? 'M4 404 L6 592 L30 592 L22 584 L20 400 Z' : 'M4 384 L4 593 L36 593 L30 584 L30 380 Z'} fill={fill} />
        </>
      )}
      {/* coat / torso */}
      {W ? (
        <path d="M-30 86 C-14 80 14 80 30 86 L44 112 L52 250 L66 440 C30 452 -30 452 -66 440 L-52 250 L-44 112 Z" fill={coat} />
      ) : (
        <path d="M-42 92 C-20 84 20 84 42 92 L54 120 L56 260 L60 420 C24 430 -24 430 -60 420 L-56 260 L-54 120 Z" fill={coat} />
      )}
      {/* arms */}
      <path d={W ? 'M-40 104 L-58 250 L-54 330 L-42 330 L-40 250 L-30 140 Z' : 'M-50 108 L-68 260 L-64 340 L-50 340 L-48 260 L-38 146 Z'} fill={coat} />
      <path d={W ? 'M40 104 L56 240 L48 316 L36 314 L40 240 L30 140 Z' : 'M50 108 L68 260 L64 340 L50 340 L48 260 L38 146 Z'} fill={coat} />
      {light && <path d={W ? 'M30 86 L44 112 L52 250 L66 440 C56 444 50 444 44 445 L36 250 L26 100 Z' : 'M42 92 L54 120 L56 260 L60 420 C52 423 46 424 40 425 L40 260 L34 110 Z'} fill={light} opacity=".1" />}
      {/* lapel line */}
      <path d={W ? 'M-10 84 L4 200 L12 440' : 'M-14 90 L0 210 L0 424'} stroke={light || '#fff'} strokeOpacity=".12" strokeWidth="2" fill="none" />
      {/* neck + head */}
      <path d={W ? 'M-8 66 L8 66 L10 90 L-10 90 Z' : 'M-10 68 L10 68 L12 94 L-12 94 Z'} fill={fill} />
      <ellipse cx="0" cy="50" rx={W ? 16.5 : 18.5} ry={W ? 21 : 23} fill={fill} />
      {W ? <><ellipse cx="2" cy="32" rx="19" ry="12" fill={fill} /><ellipse cx="-14" cy="30" rx="10" ry="10" fill={fill} /></> : <path d="M-19 44 C-20 22 20 20 20 42 C12 34 -10 32 -19 44 Z" fill={fill} />}
    </g>
  );
}

function Arch({ x, y, w, h, fill, inner, stroke }) {
  const r = w / 2;
  const d = `M${x} ${y + h} L${x} ${y + r} A${r} ${r} 0 0 1 ${x + w} ${y + r} L${x + w} ${y + h} Z`;
  return (
    <g>
      <path d={d} fill={fill} />
      {inner && <path d={d} fill={inner} />}
      {stroke && <path d={d} fill="none" stroke={stroke} strokeWidth="2" />}
    </g>
  );
}

const SCENES = {
  hero: { bg: ['#CFC4B5', '#B7AA98'], floor: '#A39582', mood: 'arches2', figs: [
    { x: 1190, kind: 'man', fill: '#1A1918', coat: '#2A2826', h: 600 },
    { x: 1330, kind: 'woman', fill: '#1A1918', coat: '#E8E0D3', h: 575, light: '#000' },
  ], align: 'xMaxYMid' },
  campaign: { bg: ['#2A2725', '#1A1817'], floor: '#141312', mood: 'columns', beam: true, figs: [
    { x: 1270, kind: 'woman', fill: '#0E0D0C', coat: '#D9CDBB', h: 560, light: '#000', walk: true },
  ], align: 'xMaxYMid' },
  women: { bg: ['#E3DACC', '#CFC3B2'], floor: '#BFB19E', mood: 'arch1', figs: [{ x: 820, kind: 'woman', fill: '#1E1C1B', coat: '#B08D66', h: 600 }] },
  men: { bg: ['#B9B1A6', '#9D9488'], floor: '#8A8177', mood: 'columns', figs: [{ x: 780, kind: 'man', fill: '#151413', coat: '#2B2A28', h: 620 }] },
  essentials: { bg: ['#EAE3D8', '#DDD3C4'], floor: '#CEC3B2', mood: 'stack' },
  accessories: { bg: ['#D9CFC1', '#C3B6A4'], floor: '#B0A28E', mood: 'plinth' },
  story: { bg: ['#D8CEBF', '#BCAE9A'], floor: '#A89A86', mood: 'arches3', figs: [{ x: 640, kind: 'woman', fill: '#1A1918', coat: '#222', h: 470, walk: true }] },
  journal1: { bg: ['#ECE6DC', '#DCD3C5'], floor: '#CFC4B4', mood: 'sphere' },
  journal2: { bg: ['#D6CCBD', '#C2B5A3'], floor: '#AE9F8B', mood: 'rail' },
  journal3: { bg: ['#2B2826', '#1D1B1A'], floor: '#161514', mood: 'button' },
  atelier: { bg: ['#E6DED2', '#D2C7B7'], floor: '#C2B5A3', mood: 'arch1', figs: [{ x: 1040, kind: 'man', fill: '#1E1C1B', coat: '#7A6252', h: 520 }, { x: 560, kind: 'woman', fill: '#1E1C1B', coat: '#E8E0D3', h: 500, flip: true }] },
};

function Mood({ m, s, u }) {
  const [top, bot] = s.bg;
  const deep = shade(bot, -0.18);
  switch (m) {
    case 'arches2':
      return (
        <g>
          <Arch x={480} y={200} w={280} h={660} fill={shade(bot, -0.06)} inner={'url(#archLight' + u + ')'} />
          <Arch x={1030} y={90} w={460} h={770} fill={shade(bot, -0.1)} inner={'url(#archLight' + u + ')'} />
          <rect x={0} y={858} width={1600} height={4} fill={shade(bot, -0.12)} />
        </g>
      );
    case 'arches3':
      return (
        <g>
          {[220, 680, 1140].map((x) => <Arch key={x} x={x} y={180} w={260} h={680} fill={shade(bot, -0.12)} inner={'url(#archLight' + u + ')'} />)}
        </g>
      );
    case 'arch1':
      return <Arch x={560} y={70} w={480} h={790} fill={shade(top, -0.08)} inner={'url(#archLight' + u + ')'} />;
    case 'columns':
      return (
        <g>
          {[160, 460, 1120, 1420].map((x, i) => (
            <g key={x}>
              <rect x={x - 50} y={0} width={100} height={860} fill={shade(top, i % 3 ? 0.06 : 0.1)} />
              <rect x={x - 50} y={0} width={36} height={860} fill="#000" opacity=".12" />
            </g>
          ))}
        </g>
      );
    case 'stack':
      return (
        <g>
          <rect x={560} y={600} width={480} height={260} fill={shade(top, 0.06)} />
          <rect x={560} y={600} width={480} height={12} fill="#000" opacity=".06" />
          {[
            ['#D6C7AF', 0], ['#3A3836', 1], ['#EFE9DE', 2], ['#B08D66', 3], ['#9C958B', 4],
          ].map(([c, i]) => (
            <g key={i}>
              <rect x={620 + (i % 2) * 12} y={540 - i * 58} width={360} height={56} rx={10} fill={c} />
              <rect x={620 + (i % 2) * 12} y={540 - i * 58} width={360} height={56} rx={10} fill={'url(#volH' + u + ')'} />
              <line x1={640 + (i % 2) * 12} y1={568 - i * 58} x2={960 + (i % 2) * 12} y2={568 - i * 58} stroke="#000" opacity=".08" />
            </g>
          ))}
        </g>
      );
    case 'plinth':
      return (
        <g>
          <rect x={520} y={560} width={560} height={300} fill={shade(top, 0.08)} />
          <rect x={520} y={560} width={180} height={300} fill="#000" opacity=".05" />
          <g transform="translate(610 230) scale(.95)">
            <path d={BODY.bag} fill="#8A5532" />
            <path d={BODY.bag} fill={'url(#volH' + u + ')'} />
            <GarmentDetails shape="bag" line="#5E3A21" light="#A97A55" />
          </g>
        </g>
      );
    case 'sphere':
      return (
        <g>
          <Arch x={300} y={140} w={360} h={720} fill={shade(top, -0.06)} />
          <circle cx={1060} cy={720} r={140} fill={shade(bot, -0.08)} />
          <circle cx={1060} cy={720} r={140} fill={'url(#sphereShade' + u + ')'} />
          <rect x={860} y={856} width={420} height={6} fill="#000" opacity=".06" />
        </g>
      );
    case 'rail':
      return (
        <g>
          <rect x={300} y={200} width={1000} height={8} fill="#2A2826" />
          <rect x={300} y={200} width={8} height={660} fill="#2A2826" />
          <rect x={1292} y={200} width={8} height={660} fill="#2A2826" />
          {[
            ['coat', '#B08D66'], ['shirt', '#F4F2EE'], ['blazer', '#2B2A28'], ['dress', '#D4BE9C'], ['sweater', '#9C958B'], ['coat', '#3A3836'],
          ].map(([sh, c], i) => (
            <g key={i} transform={`translate(${360 + i * 150} 214) scale(.42)`}>
              <path d="M200 0 L200 40 M150 70 L200 40 L250 70" stroke="#2A2826" strokeWidth="6" fill="none" />
              <g transform="translate(0 20)">
                <path d={BODY[sh]} fill={c} stroke={shade(c, -0.25)} strokeWidth="2" />
                <path d={BODY[sh]} fill={'url(#volH' + u + ')'} />
              </g>
            </g>
          ))}
        </g>
      );
    case 'button':
      return (
        <g>
          <rect x={0} y={0} width={1600} height={1000} fill={'url(#fabric' + u + ')'} opacity=".5" />
          <line x1={-20} y1={520} x2={1620} y2={470} stroke="#D9CDBB" strokeWidth="3" strokeDasharray="22 14" opacity=".55" />
          <g transform="translate(800 470)">
            <circle r={150} fill="#E9E1D4" />
            <circle r={150} fill={'url(#pearl' + u + ')'} />
            <circle r={118} fill="none" stroke="#C9BFAE" strokeWidth="3" />
            {[[-34, -34], [34, -34], [-34, 34], [34, 34]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={13} fill="#3B3734" />)}
            <path d="M-34 -34 L34 34 M34 -34 L-34 34" stroke="#D9CDBB" strokeWidth="5" />
          </g>
        </g>
      );
    default:
      return null;
  }
}

export function SceneArt({ name = 'hero', className = '' }) {
  const u = useId().replace(/:/g, '');
  const s = SCENES[name] || SCENES.hero;
  const [top, bot] = s.bg;
  const darkScene = lum(top) < 0.3;
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio={(s.align || 'xMidYMid') + ' slice'} className={'h-full w-full ' + className} aria-hidden="true">
      <defs>
        <linearGradient id={'sceneBg' + u} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bot} />
        </linearGradient>
        <linearGradient id={'archLight' + u} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={darkScene ? '#3a3632' : '#F5F1EA'} stopOpacity=".55" />
          <stop offset="1" stopColor={darkScene ? '#3a3632' : '#F5F1EA'} stopOpacity=".05" />
        </linearGradient>
        <linearGradient id={'volH' + u} x1="0" y1="0" x2="1" y2=".3">
          <stop offset="0" stopColor="#fff" stopOpacity=".2" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".18" />
        </linearGradient>
        <radialGradient id={'sphereShade' + u} cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#fff" stopOpacity=".35" />
          <stop offset="1" stopColor="#000" stopOpacity=".25" />
        </radialGradient>
        <radialGradient id={'pearl' + u} cx=".35" cy=".3" r=".9">
          <stop offset="0" stopColor="#fff" stopOpacity=".7" />
          <stop offset=".5" stopColor="#E7DCEB" stopOpacity=".2" />
          <stop offset="1" stopColor="#000" stopOpacity=".25" />
        </radialGradient>
        <pattern id={'fabric' + u} width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 8 L8 0" stroke="#fff" strokeOpacity=".05" strokeWidth="2" />
        </pattern>
        <linearGradient id={'beam' + u} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F5F1EA" stopOpacity=".28" />
          <stop offset="1" stopColor="#F5F1EA" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={'vignette' + u} cx=".5" cy=".45" r=".75">
          <stop offset=".6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".28" />
        </radialGradient>
      </defs>
      <rect width="1600" height="1000" fill={'url(#sceneBg' + u + ')'} />
      <rect y="860" width="1600" height="140" fill={s.floor} />
      <Mood m={s.mood} s={s} u={u} />
      {(s.beam || !darkScene) && (
        <polygon points={darkScene ? '1000,0 1500,0 1100,1000 420,1000' : '1100,0 1600,0 1600,300 700,1000 300,1000'} fill={'url(#beam' + u + ')'} />
      )}
      {(s.figs || []).map((f, i) => <Figure key={i} {...f} />)}
      <rect width="1600" height="1000" fill={'url(#vignette' + u + ')'} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Picture: photo if registered, otherwise art                          */
/* ------------------------------------------------------------------ */
export function Picture({ photo, alt = '', className = '', children, priority = false, zoom = 1, position }) {
  const src = photo && PHOTOS[photo];
  const pos = position || FOCUS[photo] || '50% 50%';
  return (
    <div className={'relative overflow-hidden ' + (src ? 'bg-cream ' : 'grain ') + className} role={alt ? 'img' : undefined} aria-label={alt || undefined}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: pos, transform: zoom !== 1 ? `scale(${zoom})` : undefined, transformOrigin: pos }}
        />
      ) : (
        <div className="absolute inset-0">{children}</div>
      )}
    </div>
  );
}

export function Scene({ name, alt, className = '', priority }) {
  return (
    <Picture photo={'scene-' + name} alt={alt} className={className} priority={priority}>
      <SceneArt name={name} />
    </Picture>
  );
}

const TONES = ['#ECE6DC', '#E7E0D5', '#EFEAE2', '#E9E3D9'];
const VIEW = {
  front: { zoom: 1, pos: '50% 40%' },
  detail: { zoom: 1.9, pos: '50% 32%' },
  studio: { zoom: 1.45, pos: '50% 78%' },
  stone: { zoom: 2.4, pos: '42% 45%' },
};
export function ProductImage({ product, colorIndex = 0, variant = 'front', className = '', alt }) {
  const color = product.colors[colorIndex] || product.colors[0];
  const photoKey = `p-${product.id}-${colorIndex}`;
  const label = variant;
  const text = alt ?? `${product.name} in ${color.name}${label === 'detail' ? ', detail view' : ''}`;
  if (PHOTOS[photoKey]) {
    const v = VIEW[variant] || VIEW.front;
    return <Picture photo={photoKey} alt={text} className={className} zoom={v.zoom} position={v.pos} />;
  }
  let tone = TONES[product.name.length % TONES.length];
  if (variant === 'studio') { tone = lum(color.hex) < 0.3 ? '#CFC5B6' : '#2E2B29'; variant = 'front'; }
  if (variant === 'stone') { tone = '#D8CFC1'; variant = 'front'; }
  return (
    <Picture alt={text} className={className}>
      <GarmentArt shape={product.shape} color={color.hex} tone={tone} variant={variant} />
    </Picture>
  );
}

export const hasPhoto = (product, i = 0) => !!PHOTOS[`p-${product.id}-${i}`];
