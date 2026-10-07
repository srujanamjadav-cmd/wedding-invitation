const opening = document.getElementById("opening");
const doorStage = document.getElementById("doorStage");
const openInvitation = document.getElementById("openInvitation");
const main = document.getElementById("mainInvitation");
const closing = document.getElementById("closing");
const closeStory = document.getElementById("closeStory");
const finalCard = document.getElementById("finalCard");
const openAgain = document.getElementById("openAgain");
const music = document.getElementById("weddingMusic");
const soundBtn = document.getElementById("soundBtn");
const shareBtn = document.getElementById("shareBtn");
const toast = document.getElementById("toast");

/* Door opening */
function openStory(){
  doorStage.classList.add("open");
  setTimeout(()=>{
    opening.classList.add("done");
    main.classList.remove("hidden");
    document.body.classList.remove("lock");
    window.scrollTo({top:0,behavior:"instant"});
  },1650);
}
openInvitation.addEventListener("click",openStory);
doorStage.addEventListener("click",e=>{
  if(e.target===doorStage || e.target.classList.contains("door-background")) openStory();
});

/* Mobile swipe-up gesture */
let touchStartY=0;
doorStage.addEventListener("touchstart",e=>touchStartY=e.touches[0].clientY,{passive:true});
doorStage.addEventListener("touchend",e=>{
  if(touchStartY-e.changedTouches[0].clientY>60 && !doorStage.classList.contains("open")) openStory();
},{passive:true});

/* Countdown */
const weddingTime = new Date("2026-10-28T19:30:00+05:30").getTime();
function countdown(){
  let d=Math.max(0,weddingTime-Date.now());
  const days=Math.floor(d/86400000); d-=days*86400000;
  const hours=Math.floor(d/3600000); d-=hours*3600000;
  const mins=Math.floor(d/60000); d-=mins*60000;
  const secs=Math.floor(d/1000);
  document.getElementById("days").textContent=String(days).padStart(2,"0");
  document.getElementById("hours").textContent=String(hours).padStart(2,"0");
  document.getElementById("minutes").textContent=String(mins).padStart(2,"0");
  document.getElementById("seconds").textContent=String(secs).padStart(2,"0");
}
countdown();setInterval(countdown,1000);

/* Scroll reveal */
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add("visible");
  });
},{threshold:.13});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

/* Canvas particles: subtle gold dust */
const canvas=document.getElementById("particleCanvas");
const ctx=canvas.getContext("2d");
let particles=[];
function resizeCanvas(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}
function seed(){
  particles=Array.from({length:Math.min(75,Math.floor(innerWidth/7))},()=>({
    x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.7+.3,
    a:Math.random()*.45+.08,v:Math.random()*.22+.05
  }));
}
function animateParticles(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  particles.forEach(p=>{
    p.y-=p.v;if(p.y<-5)p.y=innerHeight+5;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(184,149,88,${p.a})`;ctx.fill();
  });
  requestAnimationFrame(animateParticles);
}
resizeCanvas();seed();animateParticles();
addEventListener("resize",()=>{resizeCanvas();seed()});

/* Tilt interaction — mouse + touch */
const tilt=document.getElementById("tiltCard");
function tiltMove(x,y){
  const r=tilt.getBoundingClientRect();
  const px=(x-r.left)/r.width-.5, py=(y-r.top)/r.height-.5;
  tilt.style.transform=`perspective(800px) rotateX(${py*-7}deg) rotateY(${px*9}deg)`;
}
tilt.addEventListener("mousemove",e=>tiltMove(e.clientX,e.clientY));
tilt.addEventListener("mouseleave",()=>tilt.style.transform="");
tilt.addEventListener("touchmove",e=>{
  const t=e.touches[0];tiltMove(t.clientX,t.clientY);
},{passive:true});

/* Closing sequence */
closeStory.addEventListener("click",()=>{
  closing.classList.add("play");
  setTimeout(()=>closing.classList.add("finished"),3800);
});

openAgain.addEventListener("click",()=>{
  closing.classList.remove("finished","play");
  opening.classList.remove("done");
  doorStage.classList.remove("open");
  window.scrollTo({top:0,behavior:"instant"});
});

/* Web Share API with clipboard fallback */
shareBtn.addEventListener("click",async()=>{
  const shareData={title:"Hema & Nitish — Wedding Invitation",text:"You are invited to celebrate Hema P Jadav & Nitish V Todkar — 28 & 29 October 2026.",url:location.href};
  try{
    if(navigator.share) await navigator.share(shareData);
    else{
      await navigator.clipboard.writeText(location.href);
      showToast("Invitation link copied!");
    }
  }catch(e){}
});

/* Music toggle. Browser autoplay policies require a user gesture. */
soundBtn.addEventListener("click",async()=>{
  try{
    if(music.paused){await music.play();soundBtn.textContent="♫";showToast("Music on");}
    else{music.pause();soundBtn.textContent="♪";showToast("Music off");}
  }catch(e){showToast("Add assets/wedding-music.mp3 to enable music");}
});

/* Calendar .ics download */
document.getElementById("calendarBtn").addEventListener("click",()=>{
  const ics=[
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//HemaNitish//Wedding//EN",
    "BEGIN:VEVENT",
    "UID:hema-nitish-2026@example.com",
    "DTSTAMP:20261007T000000Z",
    "DTSTART:20261028T193000",
    "DTEND:20261028T230000",
    "SUMMARY:Hema & Nitish — Wedding Celebration",
    "LOCATION:Sri Manjunathaswamy Kalyana Mantapa, Near KSRTC Bus Stand, B.H. Road, Bhadravathi",
    "END:VEVENT",
    "BEGIN:VEVENT",
    "UID:hema-nitish-2026-2@example.com",
    "DTSTAMP:20261007T000000Z",
    "DTSTART:20261029T084500",
    "DTEND:20261029T120000",
    "SUMMARY:Hema & Nitish — Wedding Celebration",
    "LOCATION:Sri Manjunathaswamy Kalyana Mantapa, Near KSRTC Bus Stand, B.H. Road, Bhadravathi",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
  const blob=new Blob([ics],{type:"text/calendar;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download="Hema-Nitish-Wedding.ics";a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  showToast("Calendar file downloaded");
});

function showToast(text){
  toast.textContent=text;toast.classList.add("show");
  clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.classList.remove("show"),2200);
}
