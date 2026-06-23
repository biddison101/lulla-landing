/* ============ Lulla landing — interactions ============ */
(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Nav background on scroll ---- */
  var nav = document.getElementById('nav');
  function onScroll(){
    if(window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ---- Breathing label sync (matches 12s breathe keyframe) ---- */
  var label = document.getElementById('breathLabel');
  if(label && !reduce){
    var phases = [
      {t:'Breathe in',  d:4000},
      {t:'Hold',        d:3000},
      {t:'Breathe out', d:5000}
    ];
    var i = 0;
    function cycle(){
      label.style.opacity = '0';
      setTimeout(function(){
        label.textContent = phases[i].t;
        label.style.opacity = '1';
        i = (i+1) % phases.length;
      }, 400);
    }
    cycle();
    (function loop(){
      var cur = phases[(i===0?phases.length-1:i-1)];
      setTimeout(function(){ cycle(); loop(); }, cur.d);
    })();
  } else if(label && reduce){
    label.textContent = 'Calm, on demand';
  }

  /* ---- Scroll reveal ---- */
  if('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, {threshold:.16, rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('[data-reveal]').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('[data-reveal]').forEach(function(el){ el.classList.add('in'); });
  }

  /* ---- Interactive symptom picker ---- */
  var cards = document.querySelectorAll('.sym-card');
  var stage = document.getElementById('symStage');
  if(cards.length && stage){
    var data = {
      heart:{tag:'Vagus nerve activation',title:'4-8 Breathing',body:'A long, slow exhale tells your nervous system the threat has passed. Twice the time breathing out as in — your heart rate follows the exhale down.',anim:'circle'},
      breath:{tag:'Restores CO₂ balance',title:'Box Breathing',body:'Equal counts in, hold, out, hold. The pattern interrupts hyperventilation and rebalances the oxygen-to-CO₂ ratio that fuels the panic.',anim:'box'},
      mind:{tag:'Sensory interruption',title:'5-4-3-2-1 Grounding',body:'Name five things you see, four you hear, three you feel. It pulls attention out of the spiral and back into the room you\u2019re actually in.',anim:'count'},
      numb:{tag:'Gentle re-embodiment',title:'Somatic Grounding',body:'No moving visuals — they make floating worse. Just slow pressure points: feet on the floor, hands on your lap. Quietly back into your body.',anim:'glow'},
      shaky:{tag:'Discharges adrenaline',title:'Somatic Release',body:'Restlessness is unspent energy. Short, deliberate movements let the adrenaline finish its job and drain, instead of buzzing under your skin.',anim:'wave'},
      overwhelmed:{tag:'Zero interaction needed',title:'Co-Regulation',body:'When you\u2019re flooded, choosing is too much. This screen advances on its own — one soft wave, breathing with you. Nothing to tap.',anim:'slow'}
    };
    function render(key){
      var d = data[key];
      stage.innerHTML =
        '<span class="stage-tag">'+d.tag+'</span>'+
        '<h3 class="stage-title">'+d.title+'</h3>'+
        '<p class="stage-body">'+d.body+'</p>'+
        '<div class="stage-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" stroke-linecap="round"/></svg>Matched the moment you tapped</div>';
      stage.classList.remove('flash');void stage.offsetWidth;stage.classList.add('flash');
    }
    cards.forEach(function(c){
      c.addEventListener('click', function(){
        cards.forEach(function(x){x.classList.remove('active');x.setAttribute('aria-pressed','false');});
        c.classList.add('active');c.setAttribute('aria-pressed','true');
        render(c.dataset.sym);
      });
    });
  }

  /* ---- Footer year ---- */
  var yr = document.getElementById('yr');
  if(yr) yr.textContent = new Date().getFullYear();
})();
