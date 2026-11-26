(function(){
  'use strict';
  const dictionaries=window.SCHOOL_I18N;
  function setLanguage(lang){
    if(!dictionaries[lang])lang='ru';
    document.documentElement.lang=lang;
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const value=dictionaries[lang][el.dataset.i18n];
      if(value===undefined)return;
      if(el.dataset.i18nAttr)el.setAttribute(el.dataset.i18nAttr,value);
      else el.textContent=value;
    });
    document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===lang)));
    try{localStorage.setItem('school548-language',lang)}catch(e){}
  }
  let lang='ru';try{lang=localStorage.getItem('school548-language')||'ru'}catch(e){}
  document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));
  setLanguage(lang);
  window.school548SetLanguage=setLanguage;
})();
