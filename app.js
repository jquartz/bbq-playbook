
(() => {
  const pathKey = location.pathname.replace(/[^a-z0-9]/gi,'_');
  const boxes = [...document.querySelectorAll('input[type="checkbox"][data-save]')];
  boxes.forEach((box, i) => {
    const key = `pit_${pathKey}_${i}`;
    box.checked = localStorage.getItem(key) === '1';
    box.addEventListener('change', () => localStorage.setItem(key, box.checked ? '1' : '0'));
  });
  document.querySelectorAll('[data-reset-checks]').forEach(btn => btn.addEventListener('click', () => {
    if (!confirm('Reset the checkboxes on this page?')) return;
    boxes.forEach((box,i) => {
      box.checked = false;
      localStorage.removeItem(`pit_${pathKey}_${i}`);
    });
  }));

  const timerEls = [...document.querySelectorAll('[data-timer]')];
  const timers = new Map();
  function fmt(sec){
    sec=Math.max(0,sec|0); const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=sec%60;
    return h>0 ? `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` :
                 `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }
  timerEls.forEach((el,idx)=>{
    const display=el.querySelector('[data-display]');
    const mins=parseInt(el.dataset.minutes||'60',10);
    const state={left:Math.max(1,mins)*60, running:false, id:null};
    display.textContent=fmt(state.left);
    timers.set(el,state);
    el.querySelector('[data-start]').addEventListener('click',()=>{
      if(state.running)return; state.running=true;
      state.id=setInterval(()=>{state.left--;display.textContent=fmt(state.left);if(state.left<=0){clearInterval(state.id);state.running=false;display.textContent='DONE';}},1000);
    });
    el.querySelector('[data-pause]').addEventListener('click',()=>{if(state.id)clearInterval(state.id);state.running=false;});
    el.querySelector('[data-reset]').addEventListener('click',()=>{if(state.id)clearInterval(state.id);state.running=false;state.left=Math.max(1,mins)*60;display.textContent=fmt(state.left);});
  });
})();
