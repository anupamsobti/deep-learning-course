const $=s=>document.querySelector(s), clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const state={x:1.4,px:1.3,py:-.8,t:.7,x1:.8,x2:-.5};
function setup(canvas,draw){const resize=()=>{const d=devicePixelRatio||1,w=canvas.clientWidth,h=canvas.clientHeight;canvas.width=w*d;canvas.height=h*d;const g=canvas.getContext('2d');g.setTransform(d,0,0,d,0,0);draw(g,w,h)};new ResizeObserver(resize).observe(canvas);resize();return resize}
function tag(g,x,y,lines,dark=false){g.font='600 11px Arial';const W=g.canvas.width/(devicePixelRatio||1),w=Math.max(...lines.map(s=>g.measureText(s).width))+20,tx=clamp(x+12,8,W-w-8),ty=Math.max(8,y-lines.length*16-12);g.fillStyle=dark?'#ffffff':'#111111';g.beginPath();g.roundRect(tx,ty,w,lines.length*16+10,5);g.fill();g.fillStyle=dark?'#111111':'#ffffff';lines.forEach((s,i)=>g.fillText(s,tx+10,ty+17+i*16))}
function drag(canvas,fn){const pick=e=>{const r=canvas.getBoundingClientRect();fn(e.clientX-r.left,e.clientY-r.top,r.width,r.height)};canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);pick(e)});canvas.addEventListener('pointermove',e=>{if(e.buttons)pick(e)})}
const one=$('#one');let drawOne;drawOne=setup(one,(g,w,h)=>{const X=v=>w/2+v*w/8,Y=v=>h*.62-v*h/12;g.clearRect(0,0,w,h);g.strokeStyle='#dddddd';g.lineWidth=1;for(let i=-4;i<=4;i++){g.beginPath();g.moveTo(X(i),16);g.lineTo(X(i),h-16);g.stroke()}for(let i=-3;i<=6;i++){g.beginPath();g.moveTo(16,Y(i));g.lineTo(w-16,Y(i));g.stroke()}g.strokeStyle='#777777';g.beginPath();g.moveTo(16,Y(0));g.lineTo(w-16,Y(0));g.moveTo(X(0),16);g.lineTo(X(0),h-16);g.stroke();g.strokeStyle='#315efb';g.lineWidth=3;g.beginPath();for(let p=0;p<=w;p++){const x=(p-w/2)*8/w,y=.45*x*x-1.2;p?g.lineTo(p,Y(y)):g.moveTo(p,Y(y))}g.stroke();const x=state.x,y=.45*x*x-1.2,m=.9*x;g.strokeStyle='#ff6b35';g.lineWidth=2.5;g.beginPath();g.moveTo(X(-4),Y(y+m*(-4-x)));g.lineTo(X(4),Y(y+m*(4-x)));g.stroke();g.fillStyle='#ff6b35';g.beginPath();g.arc(X(x),Y(y),6,0,7);g.fill();tag(g,X(x),Y(y),[`x ${x.toFixed(2)} · f(x) ${y.toFixed(2)}`,`slope ${m.toFixed(2)}`]);$('#one-top').textContent=`x = ${x.toFixed(2)}`;$('#slope').textContent=m.toFixed(2);$('#trend').textContent=x<-.08?'function decreasing':x>.08?'function increasing':'stationary point'});drag(one,(x,y,w)=>{state.x=clamp((x-w/2)*8/w,-3.5,3.5);drawOne()});
const gp=$('#gradient-plot');let drawGrad;drawGrad=setup(gp,(g,w,h)=>{const X=v=>w/2+v*w/7,Y=v=>h/2-v*h/7;g.clearRect(0,0,w,h);g.strokeStyle='#dddddd';g.lineWidth=1;[1,2,3,4,5,6,8].forEach(q=>{g.beginPath();for(let a=0;a<6.34;a+=.05){const r=Math.sqrt(q),x=r*Math.cos(a),y=r*Math.sin(a)/Math.sqrt(1.7);a?g.lineTo(X(x),Y(y)):g.moveTo(X(x),Y(y))}g.stroke()});g.strokeStyle='rgba(0,160,140,.42)';for(let x=-3;x<=3;x++)for(let y=-3;y<=3;y++){g.beginPath();g.moveTo(X(x),Y(y));g.lineTo(X(x+x*.18),Y(y+1.7*y*.18));g.stroke()}const {px,py}=state,q=px*px+1.7*py*py;g.strokeStyle='#ff6b35';g.lineWidth=2.5;g.beginPath();for(let a=0;a<6.34;a+=.05){const r=Math.sqrt(q),x=r*Math.cos(a),y=r*Math.sin(a)/Math.sqrt(1.7);a?g.lineTo(X(x),Y(y)):g.moveTo(X(x),Y(y))}g.stroke();g.lineWidth=3;g.beginPath();g.moveTo(X(px),Y(py));g.lineTo(X(px+px*.55),Y(py+1.7*py*.55));g.stroke();g.fillStyle='#ff6b35';g.beginPath();g.arc(X(px),Y(py),6,0,7);g.fill();tag(g,X(px),Y(py),[`(${px.toFixed(1)}, ${py.toFixed(1)}) · f ${q.toFixed(2)}`,`∇f [${(2*px).toFixed(1)}, ${(3.4*py).toFixed(1)}]`]);$('#grad-value').textContent=`[ ${(2*px).toFixed(1)}  ${(3.4*py).toFixed(1)} ]`});drag(gp,(x,y,w,h)=>{state.px=clamp((x-w/2)*7/w,-3,3);state.py=clamp((h/2-y)*7/h,-3,3);drawGrad()});
const cp=$('#chain-plot');let drawChain;drawChain=setup(cp,(g,w,h)=>{const X=a=>28+(a+1.5)*(w-56)/3,Y=a=>h/2-a*(h-50)/2.2;g.clearRect(0,0,w,h);g.strokeStyle='#999999';[-1,0,1].forEach(a=>{g.beginPath();g.moveTo(20,Y(a));g.lineTo(w-16,Y(a));g.stroke()});g.strokeStyle='#315efb';g.lineWidth=3;g.beginPath();for(let p=0;p<=w;p++){const t=-1.5+3*p/w,y=Math.sin(2*(t*t+1));p?g.lineTo(X(t),Y(y)):g.moveTo(X(t),Y(y))}g.stroke();const t=state.t,x=t*t+1,y=Math.sin(2*x),inner=2*t,outer=2*Math.cos(2*x),chain=inner*outer;g.fillStyle='#ff6b35';g.beginPath();g.arc(X(t),Y(y),6,0,7);g.fill();tag(g,X(t),Y(y),[`t ${t.toFixed(2)} → x ${x.toFixed(2)}`,`y ${y.toFixed(2)} · dy/dt ${chain.toFixed(2)}`],true);$('#t-slider').value=t;$('#t-value').textContent=t.toFixed(2);$('#chain-value').textContent=chain.toFixed(2);$('#rates').textContent=`${outer.toFixed(2)} outer × ${inner.toFixed(2)} inner`});drag(cp,(x,y,w)=>{state.t=clamp(-1.5+3*x/w,-1.5,1.5);drawChain()});$('#t-slider').addEventListener('input',e=>{state.t=+e.target.value;drawChain()});
const mp=$('#multi-plot');let drawMulti;drawMulti=setup(mp,(g,w,h)=>{const gap=24,pw=(w-gap)/2,{x1,x2}=state,y1=x1*x1-x2,y2=Math.sin(1.4*x1)+.6*x2*x2,j11=2*x1,j12=-1,j21=1.4*Math.cos(1.4*x1),j22=1.2*x2;g.clearRect(0,0,w,h);const panel=(left,title,fn,value,slope)=>{const X=a=>left+pw/2+a*(pw-40)/4,Y=a=>h/2-a*(h-70)/7;g.save();g.beginPath();g.rect(left,0,pw,h);g.clip();g.strokeStyle='#999999';g.lineWidth=1;g.beginPath();g.moveTo(left+14,Y(0));g.lineTo(left+pw-14,Y(0));g.moveTo(X(0),28);g.lineTo(X(0),h-16);g.stroke();g.fillStyle='#777777';g.font='600 10px Arial';g.fillText(title,left+14,18);g.strokeStyle=left===0?'#315efb':'#9b51e0';g.lineWidth=3;g.beginPath();for(let p=0;p<=pw;p++){const a=-2+4*p/pw,b=fn(a);p?g.lineTo(X(a),Y(b)):g.moveTo(X(a),Y(b))}g.stroke();const px=X(x1),py=Y(value);g.strokeStyle='#bbbbbb';g.lineWidth=1.5;g.setLineDash([4,4]);g.beginPath();g.moveTo(px,Y(0));g.lineTo(px,py);g.stroke();g.setLineDash([]);g.fillStyle='#ff6b35';g.beginPath();g.arc(px,py,6,0,7);g.fill();tag(g,px,py,[`x₁ ${x1.toFixed(2)} → ${title.slice(0,2)} ${value.toFixed(2)}`,`∂${title.slice(0,2)}/∂x₁ ${slope.toFixed(2)}`],true);g.restore()};panel(0,'y₁ = x₁² − x₂',a=>a*a-x2,y1,j11);panel(pw+gap,'y₂ = sin(1.4x₁) + 0.6x₂²',a=>Math.sin(1.4*a)+.6*x2*x2,y2,j21);g.strokeStyle='#ff6b35';g.lineWidth=1;g.beginPath();g.moveTo(pw+gap/2,0);g.lineTo(pw+gap/2,h);g.stroke();$('#x1-value').textContent=x1.toFixed(2);$('#x2-value').textContent=x2.toFixed(2);$('#jacobian').innerHTML=`<span>${j11.toFixed(2)}</span><span>${j12.toFixed(2)}</span><span>${j21.toFixed(2)}</span><span>${j22.toFixed(2)}</span>`});['x1','x2'].forEach(k=>$('#'+k+'-slider').addEventListener('input',e=>{state[k]=+e.target.value;drawMulti()}));


// Two-layer sigmoid MLP: x(2) → h(3) → y(2)
(()=>{
  const W1=[[.8,-.4],[-.3,.9],[.5,.6]], b1=[.1,-.2,.05];
  const W2=[[.7,-.5,.4],[-.6,.8,.3]], b2=[.05,-.1];
  let mx=[.7,-.4], selected=[1,3];
  const sig=v=>1/(1+Math.exp(-v));
  const mv=(A,v,b)=>A.map((r,i)=>r.reduce((s,a,j)=>s+a*v[j],b?b[i]:0));
  const diag=v=>v.map((x,i)=>v.map((_,j)=>i===j?x:0));
  const mm=(A,B)=>A.map(r=>B[0].map((_,j)=>r.reduce((s,a,k)=>s+a*B[k][j],0)));
  const fmtVec=v=>`[ ${v.map(n=>n.toFixed(3)).join("  ")} ]`;
  const fmtMat=A=>A.map(r=>`[ ${r.map(n=>n.toFixed(3).padStart(7)).join(" ")} ]`).join("\n");
  const factor=(top,bottom,shape,A)=>`<div class="factor" tabindex="0" aria-label="partial ${top} over partial ${bottom}, shape ${shape}; hover or focus for its value"><span class="derivative-frac"><b>∂${top}</b><b>∂${bottom}</b></span><span class="factor-shape">${shape}</span><span class="hover-hint">hover for value</span><span class="factor-tooltip"><small>NUMERIC VALUE</small><code>${fmtMat(A)}</code></span></div>`;
  function forward(){
    const z1=mv(W1,mx,b1),h=z1.map(sig),s1=h.map(v=>v*(1-v));
    const z2=mv(W2,h,b2),y=z2.map(sig),s2=y.map(v=>v*(1-v));
    return {h,y,s1,s2,S1:diag(s1),S2:diag(s2)};
  }
  function render(){
    const q=forward(),J12=mm(q.S1,W1),J23=mm(q.S2,W2),J13=mm(J23,J12);
    $('#mx1-value').textContent=mx[0].toFixed(2); $('#mx2-value').textContent=mx[1].toFixed(2);
    $('#mlp-x').textContent=fmtVec(mx); $('#mlp-h').textContent=fmtVec(q.h); $('#mlp-y').textContent=fmtVec(q.y);
    $('#sigmoid-1').textContent=fmtVec(q.s1); $('#sigmoid-2').textContent=fmtVec(q.s2);
    document.querySelectorAll('.layer-card').forEach(el=>el.classList.toggle('selected',selected.includes(+el.dataset.layer)));
    if(selected.length<2){
      $('#chain-title').textContent=`Layer ${selected[0]} → choose another layer`;
      $('#chain-shape').textContent='—'; $('#mlp-chain').innerHTML='<span class="selection-help">Select a later layer to complete the path.</span>'; $('#mlp-result').textContent=''; return;
    }
    const [a,b]=selected;
    let factors=[],J,shape;
    if(a===1&&b===2){factors=[['𝐡','𝐳₁','3 × 3',q.S1],['𝐳₁','𝐱','3 × 2',W1]];J=J12;shape='3 × 2'}
    else if(a===2&&b===3){factors=[['𝐲','𝐳₂','2 × 2',q.S2],['𝐳₂','𝐡','2 × 3',W2]];J=J23;shape='2 × 3'}
    else {factors=[['𝐲','𝐳₂','2 × 2',q.S2],['𝐳₂','𝐡','2 × 3',W2],['𝐡','𝐳₁','3 × 3',q.S1],['𝐳₁','𝐱','3 × 2',W1]];J=J13;shape='2 × 2'}
    $('#chain-title').textContent=`Layer ${a} → Layer ${b}`; $('#chain-shape').textContent=shape;
    $('#mlp-chain').innerHTML=factors.map((f,i)=>(i?'<span class="factor-op">×</span>':'')+factor(...f)).join('');
    $('#mlp-result').textContent=fmtMat(J);
  }
  document.querySelectorAll('.layer-card').forEach(el=>el.addEventListener('click',()=>{
    const n=+el.dataset.layer;
    if(selected.length===2) selected=[n]; else if(n!==selected[0]) selected=[selected[0],n].sort();
    render();
  }));
  ['mx1','mx2'].forEach((k,i)=>$('#'+k+'-slider').addEventListener('input',e=>{mx[i]=+e.target.value;render()}));
  render();
})();
