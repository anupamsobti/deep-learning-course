"use client";

import { useEffect, useRef, useState } from "react";

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

function OneDPlot({ x, setX }: { x: number; setX: (n: number) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const dpr = devicePixelRatio || 1, w = c.clientWidth, h = c.clientHeight;
    c.width = w*dpr; c.height = h*dpr; const g = c.getContext("2d")!; g.scale(dpr,dpr);
    const X=(v:number)=>w/2+v*w/8, Y=(v:number)=>h*.62-v*h/12;
    g.clearRect(0,0,w,h); g.strokeStyle="#d8d4ca"; g.lineWidth=1;
    for(let i=-4;i<=4;i++){g.beginPath();g.moveTo(X(i),16);g.lineTo(X(i),h-16);g.stroke()}
    for(let i=-3;i<=6;i++){g.beginPath();g.moveTo(16,Y(i));g.lineTo(w-16,Y(i));g.stroke()}
    g.strokeStyle="#827d70"; g.lineWidth=1.5; g.beginPath();g.moveTo(16,Y(0));g.lineTo(w-16,Y(0));g.moveTo(X(0),16);g.lineTo(X(0),h-16);g.stroke();
    g.strokeStyle="#111c19";g.lineWidth=3;g.beginPath();
    for(let p=0;p<=w;p++){const xv=(p-w/2)*8/w; const yv=.45*xv*xv-1.2; p?g.lineTo(p,Y(yv)):g.moveTo(p,Y(yv))}g.stroke();
    const y=.45*x*x-1.2,m=.9*x; g.strokeStyle="#ed6946";g.lineWidth=2.5;g.beginPath();g.moveTo(X(-4),Y(y+m*(-4-x)));g.lineTo(X(4),Y(y+m*(4-x)));g.stroke();
    g.fillStyle="#ed6946";g.beginPath();g.arc(X(x),Y(y),6,0,Math.PI*2);g.fill();
  },[x]);
  function pick(e: React.PointerEvent<HTMLCanvasElement>){const r=e.currentTarget.getBoundingClientRect();setX(clamp(((e.clientX-r.left)-r.width/2)*8/r.width,-3.5,3.5))}
  return <canvas ref={ref} className="plot" onPointerDown={pick} onPointerMove={e=>e.buttons&&pick(e)} aria-label="Interactive parabola with tangent line; drag to move the point"/>;
}

function GradientPlot({ px, py, setPoint }:{px:number;py:number;setPoint:(x:number,y:number)=>void}){
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{const c=ref.current;if(!c)return;const dpr=devicePixelRatio||1,w=c.clientWidth,h=c.clientHeight;c.width=w*dpr;c.height=h*dpr;const g=c.getContext("2d")!;g.scale(dpr,dpr);const X=(v:number)=>w/2+v*w/7,Y=(v:number)=>h/2-v*h/7;
    g.clearRect(0,0,w,h);g.strokeStyle="#d9d4c8";g.lineWidth=1;
    [1,2,3,4,5,6,8].forEach(q=>{g.beginPath();for(let a=0;a<=Math.PI*2+.05;a+=.05){const rx=Math.sqrt(q),x=rx*Math.cos(a),y=rx*Math.sin(a)/Math.sqrt(1.7);a?g.lineTo(X(x),Y(y)):g.moveTo(X(x),Y(y))}g.stroke()});
    g.strokeStyle="#a6a094";g.beginPath();g.moveTo(14,Y(0));g.lineTo(w-14,Y(0));g.moveTo(X(0),14);g.lineTo(X(0),h-14);g.stroke();
    g.strokeStyle="rgba(17,28,25,.38)";g.fillStyle="#111c19";for(let x=-3;x<=3;x++){for(let y=-3;y<=3;y++){const dx=x*.18,dy=1.7*y*.18;g.beginPath();g.moveTo(X(x),Y(y));g.lineTo(X(x+dx),Y(y+dy));g.stroke();g.beginPath();g.arc(X(x+dx),Y(y+dy),1.8,0,7);g.fill()}}
    const dx=px*.55,dy=1.7*py*.55;g.strokeStyle="#ed6946";g.lineWidth=3;g.beginPath();g.moveTo(X(px),Y(py));g.lineTo(X(px+dx),Y(py+dy));g.stroke();g.fillStyle="#ed6946";g.beginPath();g.arc(X(px),Y(py),6,0,7);g.fill();
  },[px,py]);
  function pick(e:React.PointerEvent<HTMLCanvasElement>){const r=e.currentTarget.getBoundingClientRect();setPoint(clamp(((e.clientX-r.left)-r.width/2)*7/r.width,-3,3),clamp((r.height/2-(e.clientY-r.top))*7/r.height,-3,3))}
  return <canvas ref={ref} className="plot" onPointerDown={pick} onPointerMove={e=>e.buttons&&pick(e)} aria-label="Contour plot and gradient field; drag to choose a point"/>;
}

function Slider({label,value,min,max,step=.1,onChange}:{label:string;value:number;min:number;max:number;step?:number;onChange:(n:number)=>void}){return <label className="slider"><span>{label}</span><input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)}/><b>{value.toFixed(2)}</b></label>}

export default function Home(){
  const [x,setX]=useState(1.4),[t,setT]=useState(.7),[px,setPx]=useState(1.3),[py,setPy]=useState(-.8),[u,setU]=useState(.8),[v,setV]=useState(-.5);
  const gx=t*t+1, outer=2*Math.cos(2*gx), inner=2*t, chain=outer*inner;
  const grad=[2*px,3.4*py]; const z=u*u+u*v+2*v*v, gradz=[2*u+v,u+4*v];
  return <main>
    <nav><a className="brand" href="#top"><span>∇</span> FIELD NOTES</a><div><a href="#gradient">Gradients</a><a href="#chain">Chain rule</a><a href="#practice">Practice</a></div></nav>
    <section className="hero" id="top"><p className="eyebrow">MULTIVARIATE CALCULUS · VISUAL REVIEW</p><h1>See what the<br/><em>derivative</em> knows.</h1><p className="lede">Derivatives are local maps: they tell you how a small change here becomes a change there. Explore that idea from one variable to many—always in <strong>numerator layout</strong>.</p><a className="start" href="#gradient">Start exploring <span>↓</span></a></section>

    <section className="chapter" id="gradient"><header><span>01</span><div><p>LOCAL CHANGE</p><h2>Gradients</h2></div></header>
      <div className="concept"><div><h3>One dimension: the derivative is a slope</h3><p>For a scalar function <code>y = f(x)</code>, the derivative measures output change per unit input change. In numerator layout, outputs index rows and inputs index columns—even though this first case is just a 1 × 1 matrix.</p><div className="formula">D<sub>x</sub>y = <span className="frac"><i>∂y</i><i>∂x</i></span> = f′(x)</div><p className="hint">Drag across the curve. The coral tangent rotates to show the local slope.</p></div><div className="lab"><div className="labtop"><span>f(x) = 0.45x² − 1.2</span><b>x = {x.toFixed(2)}</b></div><OneDPlot x={x} setX={setX}/><div className="readout"><span>SLOPE</span><strong>{(.9*x).toFixed(2)}</strong><small>{x<-.08?"function decreasing":x>.08?"function increasing":"stationary point"}</small></div></div></div>
      <div className="concept reverse"><div><h3>Many inputs: the gradient is a direction</h3><p>For a scalar <code>f(x, y)</code>, stack partial derivatives across one row. The gradient points toward the steepest increase; its length tells you how steep that direction is.</p><div className="formula">∇f = D<sub>𝐱</sub>f = [ <span className="frac"><i>∂f</i><i>∂x</i></span> &nbsp; <span className="frac"><i>∂f</i><i>∂y</i></span> ]</div><p>The directional derivative is the gradient projected onto a unit direction <code>𝐝</code>: <code>D<sub>𝐝</sub>f = ∇f 𝐝</code>.</p></div><div className="lab"><div className="labtop"><span>f(x,y) = x² + 1.7y²</span><b>drag point</b></div><GradientPlot px={px} py={py} setPoint={(a,b)=>{setPx(a);setPy(b)}}/><div className="vector"><span>∇f =</span><strong>[ {grad[0].toFixed(1)} &nbsp; {grad[1].toFixed(1)} ]</strong></div></div></div>
    </section>

    <section className="chapter dark" id="chain"><header><span>02</span><div><p>COMPOSED CHANGE</p><h2>Chain rules</h2></div></header>
      <div className="concept"><div><h3>Single path: multiply local rates</h3><p>Let <code>x = g(t)</code> and <code>y = f(x)</code>. A small change in <code>t</code> passes through both links. Numerator layout makes the cancellation pattern visible.</p><div className="formula light"><span className="frac"><i>dy</i><i>dt</i></span> = <span className="frac"><i>∂y</i><i>∂x</i></span> <span className="frac"><i>dx</i><i>dt</i></span></div><p className="hint">Here x = t² + 1 and y = sin(2x). Move t to see each local rate and their product.</p></div><div className="chainlab"><Slider label="input t" value={t} min={-1.5} max={1.5} onChange={setT}/><div className="nodes"><div><small>t</small><strong>{t.toFixed(2)}</strong></div><i>× {inner.toFixed(2)}</i><div><small>x = g(t)</small><strong>{gx.toFixed(2)}</strong></div><i>× {outer.toFixed(2)}</i><div><small>y = f(x)</small><strong>{Math.sin(2*gx).toFixed(2)}</strong></div></div><div className="result"><span>dy / dt</span><strong>{chain.toFixed(2)}</strong><small>outer rate × inner rate</small></div></div></div>
      <div className="concept reverse"><div><h3>Many paths: multiply Jacobians</h3><p>Suppose <code>𝐱 ∈ ℝ² → 𝐲 ∈ ℝ² → z ∈ ℝ</code>. Each output derivative occupies a row; each input occupies a column. The shapes line up naturally:</p><div className="formula light">D<sub>𝐱</sub>z <span className="dim">1×2</span> = D<sub>𝐲</sub>z <span className="dim">1×2</span> · D<sub>𝐱</sub>𝐲 <span className="dim">2×2</span></div><p>Each route from an input to the final output contributes a product; matrix multiplication adds all routes.</p></div><div className="matrixlab"><p className="matrix-title">z = u² + uv + 2v²</p><Slider label="u" value={u} min={-2} max={2} onChange={setU}/><Slider label="v" value={v} min={-2} max={2} onChange={setV}/><div className="surface-read"><div><small>z</small><strong>{z.toFixed(2)}</strong></div><div><small>∂z/∂u</small><strong>{gradz[0].toFixed(2)}</strong></div><div><small>∂z/∂v</small><strong>{gradz[1].toFixed(2)}</strong></div></div><div className="formula compact">D<sub>[u v]</sub>z = [ {gradz[0].toFixed(2)} &nbsp; {gradz[1].toFixed(2)} ]</div></div></div>
    </section>

    <section className="practice" id="practice"><p className="eyebrow">CHECK YOUR INTUITION</p><h2>Three things to remember.</h2><div className="takeaways"><article><span>01</span><h3>Shape first</h3><p>Write dimensions beside every Jacobian. If inner dimensions do not match, the chain rule cannot multiply.</p></article><article><span>02</span><h3>Rows are outputs</h3><p>Numerator layout puts one output per row and one input per column: <code>(D<sub>𝐱</sub>𝐲)<sub>ij</sub> = ∂yᵢ/∂xⱼ</code>.</p></article><article><span>03</span><h3>Follow the paths</h3><p>Multiply derivatives along each computational path; add contributions when multiple paths meet.</p></article></div><div className="footerline"><span>CALCULUS FIELD NOTES</span><span>DRAG · OBSERVE · CONNECT</span></div></section>
  </main>
}
