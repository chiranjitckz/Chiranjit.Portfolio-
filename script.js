function goTo(id){var e=document.getElementById(id);if(e)e.scrollIntoView({behavior:'smooth',block:'start'})}

/* ============ LOADER ============ */
(function(){
  var name='Chiranjit Chakma';
  var el=document.getElementById('ld-name');
  var bar=document.getElementById('ld-bar');
  var pct=document.getElementById('ld-pct');
  var loader=document.getElementById('loader');
  var i=0;
  function type(){
    if(i<name.length){el.textContent+=name[i];i++;setTimeout(type,50)}
    else{
      bar.style.width='100%';
      var s=Date.now(),d=1300;
      (function count(){
        var p=Math.min((Date.now()-s)/d,1);
        pct.textContent=Math.floor(p*100)+'%';
        if(p<1){requestAnimationFrame(count)}
        else{pct.textContent='100%';setTimeout(function(){loader.style.opacity='0';setTimeout(function(){loader.style.display='none'},600)},150)}
      })();
    }
  }
  setTimeout(type,150);
})();

/* ============ HAMBURGER / MOBILE NAV ============ */
var hbg=document.getElementById('hbg'),mnav=document.getElementById('mnav');
hbg.addEventListener('click',function(){hbg.classList.toggle('open');mnav.classList.toggle('open')});
function cM(){hbg.classList.remove('open');mnav.classList.remove('open')}
window.addEventListener('resize',function(){if(window.innerWidth>1024)cM()});

/* ============ NAV COMPACT + SCROLL PROGRESS + GO-TOP ============ */
var progressBar=document.getElementById('scrollProgress');
var navEl=document.getElementById('nav');
var goTopBtn=document.getElementById('goTop');
window.addEventListener('scroll',function(){
  navEl.style.padding=window.scrollY>50?'9px 0':'16px 0';
  if(window.scrollY>400){goTopBtn.classList.add('show')}else{goTopBtn.classList.remove('show')}
  var doc=document.documentElement;
  var scrollable=doc.scrollHeight-doc.clientHeight;
  var pct=scrollable>0?(window.scrollY/scrollable)*100:0;
  progressBar.style.width=pct+'%';
},{passive:true});

/* ============ ABOUT BIO READ-MORE ============ */
function toggleBio(){
  var bio=document.getElementById('aboutBio');
  var btn=document.getElementById('bioToggle');
  var expanded=bio.classList.toggle('expanded');
  btn.classList.toggle('expanded',expanded);
  btn.querySelector('span').textContent=expanded?'Show Less':'Read More';
}

/* ============ SKILL BARS (fill on scroll into view) ============ */
var skillsDone=false;
window.addEventListener('scroll',function(){
  if(skillsDone)return;
  var s=document.getElementById('skills');
  if(s&&s.getBoundingClientRect().top<window.innerHeight*0.85){
    skillsDone=true;
    document.querySelectorAll('.skill-fill').forEach(function(b){b.style.width=b.getAttribute('data-w')});
  }
},{passive:true});

/* ============ ANIMATED NUMBER COUNTERS ============ */
(function(){
  var counted=new WeakSet();
  function animateCount(el){
    if(counted.has(el))return;
    counted.add(el);
    var target=parseInt(el.getAttribute('data-count'),10);
    var suffix=el.getAttribute('data-suffix')||'';
    if(isNaN(target))return;
    var start=0,duration=1200,startTime=null;
    function step(ts){
      if(!startTime)startTime=ts;
      var progress=Math.min((ts-startTime)/duration,1);
      var eased=1-Math.pow(1-progress,3);
      el.textContent=Math.floor(eased*target)+suffix;
      if(progress<1)requestAnimationFrame(step);
      else el.textContent=target+suffix;
    }
    requestAnimationFrame(step);
  }
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var counters=document.querySelectorAll('[data-count]');
  if(reduce||!('IntersectionObserver' in window)){
    counters.forEach(function(el){el.textContent=el.getAttribute('data-count')+(el.getAttribute('data-suffix')||'')});
  }else{
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){animateCount(entry.target);io.unobserve(entry.target)}
      });
    },{threshold:0.5});
    counters.forEach(function(el){io.observe(el)});
  }
})();

/* ============ CONTACT FORM (front-end only, no backend wired) ============ */
document.getElementById('sBtn').addEventListener('click',function(){
  var btn=this,n=document.getElementById('fn').value.trim(),e=document.getElementById('fe').value.trim(),m=document.getElementById('fm').value.trim();
  if(!n||!e||!m){btn.textContent='Fill all fields';setTimeout(function(){btn.textContent='Send Message'},2000);return}
  btn.textContent='Sending...';btn.disabled=true;
  setTimeout(function(){
    btn.textContent='Sent!';btn.style.background='#4ade80';btn.style.color='#000';
    ['fn','fe','fs','fm'].forEach(function(id){document.getElementById(id).value=''});
    setTimeout(function(){btn.textContent='Send Message';btn.style.background='';btn.style.color='';btn.disabled=false},3000);
  },1500);
});

/* ============ SCREENSHOT GALLERY / LIGHTBOX ============ */
var galleries={
  netsafe:['netsafe-homepage.png','netsafe-connectpage-1.png','netsafe-connectpage-2.png','netsafe-profilepage.png'],
  netsafex:['netsafe.x-securitypage.png','netsafe.x-settingspage.png','netsafe.x-toolspage.png']
};
var currentGallery=[],currentIndex=0;
function openGallery(name){
  currentGallery=galleries[name];currentIndex=0;
  showLightboxImage();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow='hidden';
}
function showLightboxImage(){
  document.getElementById('lightbox-img').src=currentGallery[currentIndex];
  document.getElementById('lightbox-counter').textContent=(currentIndex+1)+' / '+currentGallery.length;
}
function lightboxNav(dir){
  currentIndex=(currentIndex+dir+currentGallery.length)%currentGallery.length;
  showLightboxImage();
}
function closeLightbox(){
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow='';
}
document.addEventListener('keydown',function(e){
  if(!document.getElementById('lightbox').classList.contains('open'))return;
  if(e.key==='Escape')closeLightbox();
  if(e.key==='ArrowLeft')lightboxNav(-1);
  if(e.key==='ArrowRight')lightboxNav(1);
});

/* ============ SCROLL REVEAL ============ */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els=document.querySelectorAll('.reveal');
  if(reduce||!('IntersectionObserver' in window)){
    els.forEach(function(e){e.classList.add('in')});
    return;
  }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var el=entry.target;
        var parent=el.parentElement;
        var siblings=Array.prototype.filter.call(parent.children,function(c){return c.classList.contains('reveal')});
        var idx=siblings.indexOf(el);
        setTimeout(function(){el.classList.add('in')},Math.max(0,idx)*80);
        io.unobserve(el);
      }
    });
  },{threshold:0.15,rootMargin:'0px 0px -40px 0px'});
  els.forEach(function(e){io.observe(e)});
})();

/* ============ SCROLL-SPY NAV HIGHLIGHTING ============ */
(function(){
  var navBtns=document.querySelectorAll('[data-section]');
  var sectionIds=['about','skills','projects','cyber','goals','contact'];
  var sections=sectionIds.map(function(id){return document.getElementById(id)}).filter(Boolean);
  function setActive(id){
    navBtns.forEach(function(b){b.classList.toggle('active',b.getAttribute('data-section')===id)});
  }
  function onScroll(){
    var scrollY=window.scrollY||window.pageYOffset;
    var probe=scrollY+140;
    var current=null;
    for(var i=0;i<sections.length;i++){
      var s=sections[i],top=s.offsetTop,bottom=top+s.offsetHeight;
      if(probe>=top&&probe<bottom){current=s.id;break}
    }
    if(sections.length&&probe<sections[0].offsetTop){current=null}
    var maxScroll=document.documentElement.scrollHeight-document.documentElement.clientHeight;
    if(sections.length&&scrollY>=maxScroll-2){current=sections[sections.length-1].id}
    setActive(current);
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll,{passive:true});
  onScroll();
})();

/* ============ CURSOR-FOLLOW SPOTLIGHT (project & goal cards) ============ */
document.querySelectorAll('.proj-card, .gc').forEach(function(card){
  card.addEventListener('mousemove',function(e){
    var r=card.getBoundingClientRect();
    card.style.setProperty('--mx',(e.clientX-r.left)+'px');
    card.style.setProperty('--my',(e.clientY-r.top)+'px');
  });
});

/* ============ 3D TILT (project & goal cards) — desktop only, subtle ============ */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce)return;
  if(window.matchMedia('(pointer: coarse)').matches)return; /* skip on touch devices */
  document.querySelectorAll('.proj-card, .gc').forEach(function(card){
    card.addEventListener('mousemove',function(e){
      var r=card.getBoundingClientRect();
      var px=(e.clientX-r.left)/r.width-0.5;
      var py=(e.clientY-r.top)/r.height-0.5;
      var rx=(py*-3.5).toFixed(2);
      var ry=(px*3.5).toFixed(2);
      card.style.transform='perspective(900px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateY(-2px)';
    });
    card.addEventListener('mouseleave',function(){
      card.style.transform='';
    });
  });
})();

/* ============ HERO BLOB PARALLAX (desktop only) ============ */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce)return;
  if(window.matchMedia('(pointer: coarse)').matches)return;
  var hero=document.getElementById('hero');
  var blobs=document.querySelectorAll('.blob-wrap');
  if(!hero||!blobs.length)return;
  hero.addEventListener('mousemove',function(e){
    var r=hero.getBoundingClientRect();
    var px=(e.clientX-r.left)/r.width-0.5;
    var py=(e.clientY-r.top)/r.height-0.5;
    blobs.forEach(function(b,i){
      var strength=(i+1)*10;
      b.style.transform='translate('+(px*strength).toFixed(1)+'px,'+(py*strength).toFixed(1)+'px)';
    });
  });
})();

/* ============ HERO PARTICLE NETWORK ============ */
(function(){
  var canvas=document.getElementById('heroCanvas');
  if(!canvas)return;
  var ctx=canvas.getContext('2d');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var host=canvas.parentElement;
  var particles=[],mouse={x:null,y:null};
  var W=0,H=0,dpr=Math.min(window.devicePixelRatio||1,2);

  function resize(){
    var rect=host.getBoundingClientRect();
    W=rect.width;H=rect.height;
    canvas.width=W*dpr;canvas.height=H*dpr;
    canvas.style.width=W+'px';canvas.style.height=H+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function initParticles(){
    var area=W*H;
    var count=Math.round(Math.min(95,Math.max(32,area/12500)));
    particles=[];
    for(var i=0;i<count;i++){
      particles.push({
        x:Math.random()*W,
        y:Math.random()*H,
        vx:(Math.random()-0.5)*0.3,
        vy:(Math.random()-0.5)*0.3,
        r:Math.random()*1.7+0.9,
        hue:Math.random()>0.7?'34,211,238':'130,190,255'
      });
    }
  }

  resize();initParticles();
  var resizeTimer;
  window.addEventListener('resize',function(){
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(function(){resize();initParticles()},150);
  });

  host.addEventListener('mousemove',function(e){
    var r=host.getBoundingClientRect();
    mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;
  });
  host.addEventListener('mouseleave',function(){mouse.x=null;mouse.y=null});

  var linkDist=130;

  function frame(){
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<particles.length;i++){
      var p=particles[i];
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>W)p.vx*=-1;
      if(p.y<0||p.y>H)p.vy*=-1;
      if(mouse.x!==null){
        var dx=mouse.x-p.x,dy=mouse.y-p.y;
        var d=Math.sqrt(dx*dx+dy*dy);
        if(d<130){p.x-=dx*0.0022;p.y-=dy*0.0022}
      }
    }
    for(var i=0;i<particles.length;i++){
      for(var j=i+1;j<particles.length;j++){
        var a=particles[i],b=particles[j];
        var dx=a.x-b.x,dy=a.y-b.y;
        var dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<linkDist){
          ctx.strokeStyle='rgba(79,157,255,'+(0.22*(1-dist/linkDist)).toFixed(3)+')';
          ctx.lineWidth=1;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }
    for(var i=0;i<particles.length;i++){
      var p=particles[i];
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba('+p.hue+',0.75)';
      ctx.shadowColor='rgba('+p.hue+',0.9)';
      ctx.shadowBlur=6;
      ctx.fill();
      ctx.shadowBlur=0;
    }
  }

  if(reduce){
    frame();
  }else{
    (function loop(){frame();requestAnimationFrame(loop)})();
  }
})();
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce)return;
  if(window.matchMedia('(pointer: coarse)').matches)return;
  document.querySelectorAll('.btn-solid, .btn-border').forEach(function(btn){
    btn.addEventListener('mousemove',function(e){
      var r=btn.getBoundingClientRect();
      var x=(e.clientX-r.left-r.width/2)*0.25;
      var y=(e.clientY-r.top-r.height/2)*0.35;
      btn.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)';
    });
    btn.addEventListener('mouseleave',function(){
      btn.style.transform='';
    });
  });
})();
