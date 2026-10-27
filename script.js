(()=>{'use strict';
const $=(sel)=>document.querySelector(sel);
const nav=$('#main-nav'), toggle=$('#nav-toggle');
function menu(open){if(!nav||!toggle)return;nav.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');}
toggle?.addEventListener('click',()=>menu(toggle.getAttribute('aria-expanded')!=='true'));
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu(false);const dlg=$('#photo-dialog');if(dlg?.open)dlg.close();}});
window.addEventListener('resize',()=>{if(innerWidth>860)menu(false)});
const selected=new Set(),cards=[...document.querySelectorAll('.service-card')],count=$('#selected-count'),message=$('#selected-message'),hidden=$('#selected-services'),selectedBox=$('#selected-services-visible'),chips=$('#selected-chips'),select=$('#primary-service');
function waUrl(text){return 'https://wa.me/27648794566?text='+encodeURIComponent(text)}
function render(){const values=[...selected];cards.forEach(c=>{const on=selected.has(c.dataset.service);c.setAttribute('aria-pressed',String(on));const t=c.querySelector('.card-foot');if(t)t.textContent=on?'Selected': 'Select service';});if(count)count.textContent=`${values.length} service${values.length===1?'':'s'} selected`;if(message)message.textContent=values.length?'Included in your enquiry below.':'Click a card to include it in your enquiry.';if(hidden)hidden.value=values.join('; ');if(selectedBox)selectedBox.hidden=values.length===0;if(chips){chips.replaceChildren();values.forEach(v=>{const c=document.createElement('span');c.className='chip';c.append(document.createTextNode(v));const b=document.createElement('button');b.type='button';b.textContent='×';b.setAttribute('aria-label','Remove '+v);b.addEventListener('click',()=>{selected.delete(v);render()});c.append(b);chips.append(c);});}
 if(select){if(values.length&&(!select.value||select.dataset.auto==='yes')){select.value=values[0];select.dataset.auto='yes'}else if(!values.length&&select.dataset.auto==='yes'){select.value='';select.dataset.auto='no'}};
 const msg=values.length?`Hi CoreSafe, I would like a quotation for: ${values.join(', ')}.`:'Hi CoreSafe, I would like a quotation for safety compliance services.';document.querySelectorAll('[data-whatsapp]').forEach(a=>{a.href=waUrl(msg)});
}
cards.forEach(c=>c.addEventListener('click',()=>{const v=c.dataset.service;selected.has(v)?selected.delete(v):selected.add(v);render()}));select?.addEventListener('change',()=>{select.dataset.auto='no'});render();
const dialog=$('#photo-dialog');document.querySelectorAll('[data-photo]').forEach(btn=>btn.addEventListener('click',()=>{if(!dialog?.showModal)return;const img=$('#dialog-image');img.src=btn.dataset.photo;img.alt=btn.dataset.caption||'CoreSafe project photo';$('#dialog-caption').textContent=btn.dataset.caption||'';dialog.showModal();}));dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
const form=$('#quote-form'),formNotice=$('#form-notice');function formMsg(){const d=new FormData(form);const list=[`Hi CoreSafe, please quote me for the following:`,`Name: ${d.get('name')||'Not supplied'}`,`Company: ${d.get('company')||'Not supplied'}`,`Phone: ${d.get('phone')||'Not supplied'}`,`Email: ${d.get('email')||'Not supplied'}`,`Services: ${d.get('selected-services')||d.get('service')||'Not selected'}`,`Main service: ${d.get('service')||'Not selected'}`,`Site: ${d.get('site')||'Not supplied'}`,`Needed by: ${d.get('required-date')||'Not specified'}`,`Scope: ${d.get('scope')||'Not supplied'}`];return list.join('\n')}

// A customer must press Send in WhatsApp; wa.me cannot automatically send messages.
// Open WhatsApp directly in the user's submit gesture so popup blockers don't interfere.
// Keep the existing Netlify Forms submission as an independent backup of the enquiry.
form?.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const d=new FormData(form);
  if(String(d.get('bot-field')||'').trim())return;

  const whatsappLink=waUrl(formMsg());
  const openTab=window.open(whatsappLink,'_blank');
  if(openTab){try{openTab.opener=null}catch(_e){/* cross-origin window */}}

  if(formNotice){
    formNotice.hidden=false;
    formNotice.textContent='WhatsApp is ready with your enquiry details. Please press Send in WhatsApp to deliver the message to CoreSafe.';
  }

  // Preserve an independent record in Netlify Forms where the site is actually hosted.
  // This is best effort; sending the WhatsApp message is still the customer's action.
  const hosted=/^(?:www\.)?coresafe\.co\.za$|\.netlify\.app$/i.test(location.hostname);
  if(hosted){
    fetch('/',{
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:new URLSearchParams(d).toString(),
      keepalive:true
    }).then(response=>{
      if(!response.ok)throw new Error('Form backup failed');
    }).catch(()=>{
      if(formNotice)formNotice.textContent='WhatsApp is ready with your enquiry details. Please press Send in WhatsApp; the website backup could not be confirmed.';
    });
  }

  // If the browser blocks a new tab, navigate in the current tab instead.
  if(!openTab)window.location.assign(whatsappLink);
});
$('#year').textContent=new Date().getFullYear();
$('#back-to-top')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
let ticking=false;function scrollInfo(){const max=document.documentElement.scrollHeight-innerHeight;if($('#page-progress'))$('#page-progress').style.width=(max>0?Math.max(0,Math.min(100,scrollY/max*100)):0)+'%';$('#site-header').classList.toggle('scrolled',scrollY>14);const wa=$('.header-whatsapp');if(wa)wa.classList.toggle('is-pinned',scrollY>90);const backToTop=$('#back-to-top');if(backToTop)backToTop.hidden=scrollY<420;ticking=false}addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(scrollInfo)}},{passive:true});scrollInfo();
if('IntersectionObserver' in window&&!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)){const ob=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');ob.unobserve(entry.target)}})},{threshold:.08,rootMargin:'0px 0px -22px 0px'});document.querySelectorAll('[data-reveal]').forEach(e=>ob.observe(e));}
})();
