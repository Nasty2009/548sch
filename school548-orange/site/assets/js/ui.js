(function(){
  'use strict';
  const toggle=document.querySelector('.menu-toggle'),menu=document.querySelector('.nav-menu');
  function closeMenu(){menu.classList.remove('is-open');toggle.setAttribute('aria-expanded','false')}
  toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));menu.classList.toggle('is-open',open)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus()}});
  document.addEventListener('click',e=>{if(!e.target.closest('.nav-pill'))closeMenu()});
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  let toastTimer;
  document.querySelectorAll('[data-demo-form]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const toast=document.querySelector('.toast');toast.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.hidden=true,5500)}));
  document.querySelectorAll('[data-role]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-role]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.getElementById('demo-login').href=b.dataset.role+'.html'}));
  const child=document.getElementById('child-select');
  if(child)child.addEventListener('change',()=>document.querySelectorAll('[data-child]').forEach(el=>el.hidden=el.dataset.child!==child.value));
  document.querySelectorAll('[data-class]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-class]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelectorAll('[data-register]').forEach(el=>el.hidden=el.dataset.register!==b.dataset.class)}));
  const stories=document.querySelectorAll('[data-article]');
  if(stories.length){let id=new URLSearchParams(location.search).get('article')||'radio';if(!Array.from(stories).some(x=>x.dataset.article===id))id='radio';stories.forEach(x=>x.hidden=x.dataset.article!==id)}
})();
