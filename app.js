const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s)),keys={clinic:'ls-clinic',faqs:'ls-faqs',bookings:'ls-bookings',handoffs:'ls-handoffs',blocks:'ls-blocks'};
const clinic0={clinicName:'Little Smiles',doctorName:'Dr. Visnu P.',location:'Clinic address to be added',phone:'Clinic phone number to be added',hours:'Clinic hours to be confirmed',paidPrice:'Price set by clinic',services:['Children’s dental check-ups','Preventive dental care','Parent and caregiver education']};
const faq0=[{q:'How do I request an appointment?',a:'Choose an open time on the Appointments page. The request is saved on this device; the clinic team still needs to confirm it.'},{q:'Where is the clinic?',a:'The clinic address has not been added yet. Please contact the team for directions.'},{q:'What are the clinic hours?',a:'Clinic hours are not confirmed yet. Please check with the team before visiting.'},{q:'What does a visit cost?',a:'Visit fees have not been provided. Ask the clinic team to confirm current prices.'},{q:'What should we bring to a first visit?',a:'Ask the clinic team for its current first-visit checklist.'},{q:'What ages does the clinic see?',a:'This is a pediatric dental clinic. Contact the team to confirm whether it is a fit for your child.'}];
function load(k,d){try{const x=sessionStorage.getItem(keys[k]);return x?JSON.parse(x):d}catch{return d}}function save(k,v){try{sessionStorage.setItem(keys[k],JSON.stringify(v))}catch{}}
function today(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}function dt(k){return new Date(k+'T12:00:00')}function plus(k,n){const d=dt(k);d.setDate(d.getDate()+n);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}function fmt(k,o){return dt(k).toLocaleDateString(undefined,o||{weekday:'short',month:'short',day:'numeric'})}function long(k){return dt(k).toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'})}function time(t){const p=t.split(':').map(Number);return new Date(2000,0,1,p[0],p[1]).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})}function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
const s={page:'dashboard',date:today(),slot:'',type:'standard',tab:'requests',clinic:load('clinic',clinic0),faqs:load('faqs',faq0),bookings:load('bookings',[]),handoffs:load('handoffs',[]),blocks:load('blocks',{}),api:false,server:false,provider:null,slotPeriod:'all',chat:[],busy:false};s.faqs=s.faqs.map(f=>({q:String(f.q||f.question||'').replace(/\bdemo\b/gi,'clinic'),a:String(f.a||f.answer||'').replace(/\bdemo\b/gi,'clinic')}));s.bookings=s.bookings.map(b=>Object.assign({},b,{label:b.label==='Demo family'?'Family':b.label,status:b.status==='New request'?'Requested':b.status}));
function dayTimes(times){return times.map(t=>[t,'open'])}
const weekdayTimes=['09:00','09:30','10:00','10:30','11:00','11:30','13:00','13:30','14:00','14:30','15:00','15:30'];
const saturdayTimes=['09:00','09:30','10:00','10:30','11:00','11:30'];
const week=[[],dayTimes(weekdayTimes),dayTimes(weekdayTimes),dayTimes(weekdayTimes),dayTimes(weekdayTimes),dayTimes(weekdayTimes),dayTimes(saturdayTimes)];
function slots(k){return week[dt(k).getDay()].map(x=>({id:k+'|'+x[0],date:k,time:x[0],seed:x[1]}))}function status(x){if(s.bookings.some(b=>b.slot===x.id&&b.status!=='Cancelled'))return'booked';if(Object.prototype.hasOwnProperty.call(s.blocks,x.id))return s.blocks[x.id]?'blocked':'open';return x.seed}function upcoming(){let a=[];for(let i=0;i<14;i++)a=a.concat(slots(plus(today(),i)));return a}function countOpen(){return upcoming().filter(x=>status(x)==='open').length}function countPending(){return s.handoffs.filter(x=>x.status!=='Resolved').length+s.bookings.filter(x=>x.status==='Requested').length}
function badge(x){const n={open:'Available',booked:'Booked',blocked:'Unavailable','Requested':'Awaiting confirmation','New request':'New request',Confirmed:'Confirmed',Resolved:'Resolved'};return '<span class="badge '+(x==='open'?'open':x==='booked'?'booked':x==='blocked'?'blocked':'request')+'">'+(n[x]||esc(x))+'</span>'}function updateAssistantState(){
  const mode=$('#assistantMode'),pill=$('#modePill'),connect=$('#assistantConnect');
  if(mode)mode.textContent=s.api?'Gemini AI is ready':s.server?'Clinic guide · connect Gemini for flexible answers':'Clinic guide · run the app to connect AI';
  if(pill)pill.textContent=s.api?'Gemini AI connected':s.server?'Clinic guide active':'Clinic guide';
  if(connect)connect.hidden=s.api;
}function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2200)}
function head(k,t,d,a){return '<div class="head"><div><label>'+k+'</label><h2>'+t+'</h2><p>'+d+'</p></div>'+(a||'')+'</div>'}
function bookingRow(b){return '<div class="row"><span class="rowmain"><b>'+esc(b.label)+' · '+esc(b.labelType)+'</b><small>'+fmt(b.date)+' at '+time(b.time)+' · '+esc(b.status)+'</small></span>'+badge(b.status)+'</div>'}
function pageDash(){
  const a=slots(today()).filter(x=>status(x)==='open').slice(0,5),b=s.bookings.slice().reverse().slice(0,3);
  return head('CLINIC WORKSPACE','A gentler day, one smile at a time.','Appointments, doctor availability, and family questions in one place.','<a class="btn primary" href="#appointments">＋ Request a visit</a>')+'<section class="hero"><div><label>WELCOME TO LITTLE SMILES</label><h2>Good day, Dr. Visnu P.</h2><p>Check upcoming availability, review requests, or help families find clinic information.</p><a class="btn soft" href="#schedule">View doctor schedule →</a></div><div class="heroart">✿</div></section><div class="metrics"><article><small>Open appointment times</small><strong>'+countOpen()+'</strong><span>Next 14 days</span></article><article><small>Appointment requests</small><strong>'+s.bookings.length+'</strong><span>Saved on this device</span></article><article><small>Team follow-ups</small><strong>'+countPending()+'</strong><span>Waiting for review</span></article><article><small>Assistant</small><strong class="smallvalue">'+(s.api?'Gemini AI':'Clinic guide')+'</strong><span>'+(s.api?'Key connected':'Open assistant to connect AI')+'</span></article></div><div class="cols"><section class="panel"><div class="panelhead"><div><h3>Available times today</h3><p>'+long(today())+' · suggested hours</p></div><a href="#schedule">Full timetable →</a></div>'+(a.length?a.map(x=>'<div class="row"><span>'+time(x.time)+'</span><span class="rowmain"><b>Open appointment time</b><small>'+esc(s.clinic.doctorName)+'</small></span>'+badge(status(x))+'</div>').join(''):'<div class="empty">No hours are listed today. Check another date.</div>')+'</section><section class="panel"><div class="panelhead"><div><h3>Quick actions</h3><p>Go straight to a task</p></div></div><div class="quick"><a href="#appointments"><b>＋</b><span><strong>Request an appointment</strong><small>Choose a date and open time</small></span></a><a href="#team"><b>♧</b><span><strong>Review team requests</strong><small>See messages and appointment requests</small></span></a><a href="#clinic"><b>✳</b><span><strong>Clinic information</strong><small>Hours, location, services, and FAQs</small></span></a></div></section></div><section class="panel gap"><div class="panelhead"><div><h3>Recent appointment requests</h3><p>Only saved on this device</p></div><a href="#appointments">Manage →</a></div>'+(b.length?b.map(bookingRow).join(''):'<div class="empty">No appointment requests yet.</div>')+'</section><div class="notice">Availability is a suggested timetable. Appointment requests are not sent to clinic staff until a booking service is connected.</div>'
}
function pageSchedule(){
  const days=Array.from({length:14},(_,i)=>{const d=plus(today(),i);return '<button class="day '+(d===s.date?'active':'')+'" data-date="'+d+'"><b>'+fmt(d,{weekday:'short'})+'</b><small>'+fmt(d,{month:'short',day:'numeric'})+'</small></button>'}).join('');
  const daySlots=slots(s.date);
  return head('DOCTOR AVAILABILITY','Doctor schedule','Review the next two weeks and keep the clinic’s working hours up to date.','<a class="btn soft" href="#team">Manage availability</a>')+'<section class="panel"><div class="panelhead"><div><h3>Next 14 days</h3><p>Choose a date to see listed appointment times</p></div><span class="badge open">'+countOpen()+' open</span></div><div class="days">'+days+'</div><div class="panelhead"><div><h3>'+long(s.date)+'</h3><p>'+esc(s.clinic.doctorName)+' · listed availability</p></div></div><div class="slotlist">'+(daySlots.length?daySlots.map(x=>'<article class="slotcard"><div><b>'+time(x.time)+'</b><small>'+(status(x)==='open'?'Available':status(x)==='booked'?'Appointment requested':'Unavailable')+'</small></div>'+badge(status(x))+'</article>').join(''):'<div class="empty">The clinic is closed on this day. Choose another date.</div>')+'</div><div class="notice">Times are editable suggestions. Confirm the clinic’s actual hours before accepting requests.</div></section>'
}
function pageBooking(){
  const all=slots(s.date),open=all.filter(x=>status(x)==='open'),morning=open.filter(x=>Number(x.time.slice(0,2))<12),afternoon=open.filter(x=>Number(x.time.slice(0,2))>=12);
  const shown=s.slotPeriod==='morning'?morning:s.slotPeriod==='afternoon'?afternoon:open;
  const days=Array.from({length:14},(_,i)=>{const d=plus(today(),i);return '<button class="day '+(d===s.date?'active':'')+'" data-date="'+d+'"><b>'+fmt(d,{weekday:'short'})+'</b><small>'+fmt(d,{month:'short',day:'numeric'})+'</small></button>'}).join('');
  const slotsHtml=shown.map(x=>'<button type="button" class="'+(s.slot===x.id?'selected':'')+'" data-slot="'+esc(x.id)+'"><b>'+time(x.time)+'</b><small>30 min</small></button>').join('');
  return head('APPOINTMENTS','Choose a visit time','Pick a date and an open time. The clinic team confirms each request before a visit is booked.')+'<div class="booking"><section class="panel booking-flow"><div class="step"><h3>1 · Appointment type</h3><div class="choices"><button class="choice '+(s.type==='standard'?'selected':'')+'" data-type="standard"><b>Standard visit</b><small>Ask the clinic to confirm the visit type</small></button><button class="choice '+(s.type==='paid'?'selected':'')+'" data-type="paid"><b>Paid consultation</b><small>'+esc(s.clinic.paidPrice)+' · payment is not collected here</small></button></div></div><div class="step"><h3>2 · Select a date</h3><div class="days booking-days">'+days+'</div><label class="field">Or choose another date<input id="bookDate" type="date" min="'+today()+'" max="'+plus(today(),30)+'" value="'+s.date+'"></label></div><div class="step"><div class="slot-heading"><div><h3>3 · Choose an open time</h3><small>'+long(s.date)+' · '+open.length+' available</small></div><div class="period-switch"><button class="'+(s.slotPeriod==='all'?'active':'')+'" data-period="all">All <i>'+open.length+'</i></button><button class="'+(s.slotPeriod==='morning'?'active':'')+'" data-period="morning">Morning <i>'+morning.length+'</i></button><button class="'+(s.slotPeriod==='afternoon'?'active':'')+'" data-period="afternoon">Afternoon <i>'+afternoon.length+'</i></button></div></div><div class="slotpick">'+(slotsHtml||'<div class="empty">No times in this part of the day. Try another filter or date.</div>')+'</div>'+(all.length>open.length?'<small class="availability-note">'+(all.length-open.length)+' times are already taken or unavailable.</small>':'')+'</div><form id="bookForm" class="step"><h3>4 · Save your request</h3><label class="field">Family reference <small>Optional · do not enter a child’s health details</small><input id="bookLabel" maxlength="40" placeholder="For example, first visit"></label><button class="btn primary">Save appointment request</button></form></section><aside class="panel summary"><h3>Your request</h3><div><small>Clinic</small><b>'+esc(s.clinic.clinicName)+'</b></div><div><small>Doctor</small><b>'+esc(s.clinic.doctorName)+'</b></div><div><small>Type</small><b>'+(s.type==='paid'?'Paid consultation':'Standard visit')+'</b></div><div><small>Price</small><b>'+(s.type==='paid'?esc(s.clinic.paidPrice):'Confirm with clinic')+'</b></div><div><small>Date</small><b>'+long(s.date)+'</b></div><div><small>Time</small><b>'+(s.slot?time(s.slot.split('|')[1]):'Choose an open time')+'</b></div><div class="notice">The request is saved on this device only. Clinic staff have not received it. No payment is collected.</div></aside></div><section class="panel gap"><div class="panelhead"><h3>Your appointment requests</h3><small>Saved on this device</small></div>'+(s.bookings.length?s.bookings.slice().reverse().map(bookingRow).join(''):'<div class="empty">Your requests will appear here.</div>')+'</section>'
}
function pageClinic(){
  return head('CLINIC INFORMATION','Clinic guide','The details families can use when contacting the clinic.')+'<div class="info"><article><small>DOCTOR</small><b>'+esc(s.clinic.doctorName)+'</b></article><article><small>ADDRESS</small><b>'+esc(s.clinic.location)+'</b></article><article><small>PHONE</small><b>'+esc(s.clinic.phone)+'</b></article><article><small>HOURS</small><b>'+esc(s.clinic.hours)+'</b></article><article><small>PAID CONSULTATION</small><b>'+esc(s.clinic.paidPrice)+'</b></article><article><small>SERVICES</small><b>'+esc((s.clinic.services||[]).join(' · '))+'</b></article></div><section class="panel gap"><div class="panelhead"><h3>Common questions</h3><small>Clinic-approved answers</small></div><div class="faqgrid">'+s.faqs.map(f=>'<article class="faq"><b>'+esc(f.q)+'</b><p>'+esc(f.a)+'</p></article>').join('')+'</div></section><div class="notice">Update missing address, phone, hours, and fees under Team desk before sharing them with families.</div>'
}
function pageTeam(){
  const entries=s.bookings.map(x=>Object.assign({kind:'booking'},x)).concat(s.handoffs.map(x=>Object.assign({kind:'message'},x))).sort((a,b)=>b.created.localeCompare(a.created));
  let panel='';
  if(s.tab==='requests')panel=entries.length?entries.map(x=>'<article class="inbox"><div class="rowmain"><b>'+(x.kind==='booking'?'Appointment · '+esc(x.labelType):esc(x.topic))+'</b><p>'+(x.kind==='booking'?esc(x.label)+' · '+fmt(x.date)+' at '+time(x.time)+' · '+esc(x.payment):esc(x.message))+'</p><small>'+new Date(x.created).toLocaleString()+' · saved on this device</small></div><div>'+badge(x.status)+'<p><button class="btn" data-resolve="'+x.id+'" data-kind="'+x.kind+'">Mark done</button></p></div></article>').join(''):'<div class="empty">Nothing is waiting for the team yet.</div>';
  if(s.tab==='faqs')panel='<section class="panel"><div class="panelhead"><h3>Approved answers</h3><button class="btn soft" id="addFaq">＋ Add answer</button></div><form id="faqForm" class="settings hidden"><label class="field">Family question<input id="fq" required></label><label class="field">Clinic-approved answer<input id="fa" required></label><button class="btn primary">Save answer</button></form>'+s.faqs.map((f,i)=>'<div class="faqedit"><b>'+esc(f.q)+'</b><span>'+esc(f.a)+'</span><button data-delete="'+i+'">×</button></div>').join('')+'<button id="restore" class="textbtn">Restore starter answers</button></section>';
  if(s.tab==='settings')panel='<section class="panel"><h3>Clinic information and availability</h3><p class="subtle">Changes are saved in this browser.</p><form id="settingsForm" class="settings">'+['clinicName','doctorName','location','phone','hours','paidPrice'].map(k=>'<label class="field">'+({clinicName:'Clinic name',doctorName:'Doctor name',location:'Address',phone:'Phone',hours:'Hours',paidPrice:'Paid consultation price'}[k])+'<input name="'+k+'" value="'+esc(s.clinic[k])+'"></label>').join('')+'<button class="btn primary">Save clinic details</button></form><hr>'+upcoming().slice(0,24).map(x=>'<div class="row"><span>'+fmt(x.date,{weekday:'short',month:'short',day:'numeric'})+' · '+time(x.time)+'</span>'+badge(status(x))+'<button class="btn" data-block="'+esc(x.id)+'" '+(status(x)==='booked'?'disabled':'')+'>'+(status(x)==='blocked'?'Reopen':'Block')+'</button></div>').join('')+'</section>';
  return head('CLINIC TEAM','Team desk','Review requests, update answers, and manage listed availability.')+'<div class="tabs"><button data-tab="requests" class="'+(s.tab==='requests'?'active':'')+'">Requests ('+countPending()+')</button><button data-tab="faqs" class="'+(s.tab==='faqs'?'active':'')+'">Clinic answers</button><button data-tab="settings" class="'+(s.tab==='settings'?'active':'')+'">Clinic & schedule</button></div>'+panel+'<div class="notice">Requests and messages are currently stored in this browser. They are not sent to clinic staff.</div>'
}
function pageAssistant(){
  const scenarios=[['Appointments','What times are available this week?'],['Hours & location','What are your hours and where is the clinic?'],['Services','What services do you offer?'],['First visit','What should we bring to a first visit?'],['Fees','How much does a visit cost?'],['Dental symptoms','My child has tooth pain. What should I do?']];
  const connection=s.api?'<section class="panel ai-connection connected"><div><span class="ai-dot"></span><b>Gemini key saved on this computer</b><p>Clinic questions can now get flexible, conversational answers.</p></div></section>':s.server?'<section class="panel ai-connection"><div><label class="orange-text">CONNECT FLEXIBLE AI ANSWERS</label><h3>Connect Gemini</h3><p>Gemini can understand questions in different words and use the clinic details, answers, and listed appointment times.</p><div class="ai-steps"><a class="btn soft" href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">1 · Get a free Gemini key ↗</a><span>2 · Paste it below and save</span></div><form id="aiKeyForm"><label class="field">Gemini API key<input id="geminiKey" type="password" autocomplete="new-password" required minlength="20" maxlength="256" placeholder="Paste the key from Google AI Studio"></label><button class="btn primary" id="saveGeminiKey">Save key on this computer</button></form><small class="privacy-note">The key is saved by the local server in a private file; it is not sent to clinic staff or other visitors. Gemini free-tier messages may be used by Google to improve its services. Never enter real patient or health information.</small></section>':'<section class="panel ai-connection"><label class="orange-text">CONNECT FLEXIBLE AI ANSWERS</label><h3>Start the local clinic app</h3><p>Open Run Little Smiles.bat to save a Gemini key securely on this computer. The FAQ guide still works when you open this file directly.</p></section>';
  return head('PARENT SUPPORT','AI assistant','Ask naturally about the clinic, appointments, services, and family information.')+'<section class="assistantintro"><div><label class="orange-text">SIMPLE, SAFE, HELPFUL</label><h2>Questions in your own words.</h2><p>'+(s.api?'Gemini uses the clinic’s saved details and open times to answer flexible clinic questions.':'The clinic guide answers known questions. Connect Gemini below for flexible responses beyond the saved answers.')+' The assistant will not diagnose symptoms or recommend treatment.</p><button class="btn primary" id="openAssistant">Open assistant</button></div><div class="heroart">✦</div></section>'+connection+'<div class="scenarios">'+scenarios.map(x=>'<article class="scenario"><b>'+esc(x[0])+'</b><p>Ask Little Smiles about this.</p><button class="btn soft" data-prompt="'+esc(x[1])+'">Ask →</button></article>').join('')+'</div><div class="notice">For symptoms or emergencies, contact a qualified dental professional or local emergency services.</div>'
}
function go(p){if(!['dashboard','schedule','appointments','clinic','team','assistant'].includes(p))p='dashboard';s.page=p;$('#title').textContent=({dashboard:'Overview',schedule:'Doctor schedule',appointments:'Appointments',clinic:'Clinic guide',team:'Team desk',assistant:'AI assistant'})[p];$$('[data-nav]').forEach(a=>a.classList.toggle('active',a.dataset.nav===p));$('#content').innerHTML=({dashboard:pageDash,schedule:pageSchedule,appointments:pageBooking,clinic:pageClinic,team:pageTeam,assistant:pageAssistant}[p])();$('#sidebar').classList.remove('open')}
function render(){ $('#today').textContent=fmt(today(),{weekday:'short',month:'short',day:'numeric'});go(s.page)}
function urgent(q){return /pain|toothache|hurt|injur|bleed|swelling|swollen|fever|infection|broken tooth|loose tooth|chipped|emergency|medicine|medication|diagnos|treatment|what should i do|chok(?:ing|ed)|allerg|rash|mouth sore|sore gums?|abscess|poison|dose|dosage|breath(?:ing)?|unconscious|swallow|fell|fall|bump on/i.test(q)}
function answerLocal(q){
  const t=q.toLowerCase();
  if(urgent(t))return'I can’t assess symptoms or recommend care in this chat. Please contact a qualified dental professional directly. If there may be immediate danger, contact your local emergency service.';
  if(/available|availability|open slot|free time|what times|when can|next appointment/i.test(t)){
    const opens=upcoming().filter(x=>status(x)==='open').slice(0,4);
    return opens.length?'The next listed times are '+opens.map(x=>fmt(x.date,{weekday:'short',month:'short',day:'numeric'})+' at '+time(x.time)).join(', ')+'. Choose one on Appointments to save a request; the clinic still needs to confirm it.':'I can’t see an open time in the next two weeks. Check another date or ask the clinic team.';
  }
  if(/service|treat|offer|provide/i.test(t))return'The clinic guide lists '+(s.clinic.services||[]).join(', ')+'. Contact the team to confirm a specific service.';
  if(/doctor|dentist|who works|who is/i.test(t))return s.clinic.doctorName+' is listed as the clinic doctor at '+s.clinic.clinicName+'.';
  if(/price|cost|paid|fee|payment/i.test(t))return'The listed paid consultation price is '+s.clinic.paidPrice+'. Ask the clinic to confirm current fees; no payment is collected here.';
  if(/hour|open|close|when.*clinic/i.test(t))return'The clinic hours are listed as: '+s.clinic.hours+'. Please confirm before visiting.';
  if(/where|address|location|phone|contact|call/i.test(t))return'The clinic contact details are: '+s.clinic.location+' · '+s.clinic.phone+'.';
  if(/age|ages|child|children|pediatric/i.test(t))return'This is a pediatric dental clinic offering children’s check-ups, preventive dental care, and parent education. Contact the team to confirm age eligibility.';
  if(/book|appointment|slot|schedule|resched|cancel/i.test(t))return'On the Appointments page, choose a date and one of the open 30-minute times. Your request is saved on this device; clinic staff still need to confirm it.';
  const terms=t.replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(w=>w.length>3&&!['what','when','where','your','clinic','does','with','have','could','would','about','from','this','that','please'].includes(w));
  let best=null,bestScore=0;
  for(const f of s.faqs){const text=(f.q+' '+f.a).toLowerCase();const score=terms.reduce((n,w)=>n+(text.includes(w)?1:0),0);if(score>bestScore){best=f;bestScore=score}}
  if(best&&bestScore>0)return best.a;
  return s.api?'I could not find that in the clinic details. Could you ask it another way?':'I can answer from the clinic guide, but flexible AI is not connected yet. Open AI assistant to connect Gemini, or add this answer under Team desk → Clinic answers.';
}
async function answer(q){
  if(urgent(q))return answerLocal(q);
  if(s.api){
    try{
      const availability=upcoming().filter(x=>status(x)==='open').slice(0,40).map(x=>({date:x.date,time:x.time}));
      const r=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:q,history:s.chat.slice(-8),faqs:s.faqs.map(f=>({question:f.q,answer:f.a})),clinic:s.clinic,availability})});
      if(!r.ok)throw new Error('unavailable');
      const data=await r.json();
      if(data.answer)return data.answer;
      throw new Error('empty');
    }catch{return'Gemini could not be reached just now. '+answerLocal(q)}
  }
  return answerLocal(q)
}
function bubble(t,role){const x=document.createElement('div');x.className='bubble'+(role==='user'?' user':'');x.textContent=t;$('#messages').append(x);$('#messages').scrollTop=$('#messages').scrollHeight}
function openAssistant(){$('#assistant').classList.add('open');$('#question').focus()}function closeAssistant(){$('#assistant').classList.remove('open')}
async function ask(q){q=q.trim();if(!q||s.busy)return;s.busy=true;bubble(q,'user');if(!urgent(q))s.chat.push({role:'user',text:q});$('#question').value='';const a=await answer(q);bubble(a,'bot');if(!urgent(q))s.chat.push({role:'assistant',text:a});s.busy=false;if(urgent(q)){const b=document.createElement('button');b.className='textbtn';b.textContent='Ask clinic team to follow up →';b.dataset.handoff='';$('#messages').append(b)}}
function submitBooking(e){
  e.preventDefault();
  if(!s.slot){toast('Choose an open time first');return}
  const p=s.slot.split('|'),x=slots(p[0]).find(z=>z.id===s.slot);
  if(!x||status(x)!=='open'){s.slot='';render();toast('That time is no longer open');return}
  s.bookings.push({id:String(Date.now()),slot:s.slot,date:p[0],time:p[1],label:$('#bookLabel').value.trim()||'Family',labelType:s.type==='paid'?'Paid consultation':'Standard visit',payment:s.type==='paid'?'No payment collected':'No payment',status:'Requested',created:new Date().toISOString()});
  save('bookings',s.bookings);s.slot='';render();toast('Request saved on this device. The clinic has not received it.')
}
function installMotion(){
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=window.matchMedia('(pointer: fine)').matches;
  const glow=document.createElement('div');
  glow.className='cursor-glow';
  glow.setAttribute('aria-hidden','true');
  document.body.append(glow);
  let frame=0,x=0,y=0,current=null;
  if(fine&&!reduced){
    document.addEventListener('pointermove',e=>{
      if(e.pointerType==='touch')return;
      x=e.clientX;y=e.clientY;
      document.body.classList.add('cursor-on');
      if(!frame)frame=requestAnimationFrame(()=>{
        glow.style.transform='translate3d('+(x-64)+'px,'+(y-64)+'px,0)';
        frame=0;
      });
      const card=e.target instanceof Element?e.target.closest('.hero,.panel,.metrics article,.quick a,.scenario,.faq,.info article,.slotcard,.inbox,.assistantintro'):null;
      if(current&&current!==card)current.classList.remove('pointer-lit');
      current=card;
      if(current){
        const rect=current.getBoundingClientRect();
        current.style.setProperty('--spot-x',(x-rect.left)+'px');
        current.style.setProperty('--spot-y',(y-rect.top)+'px');
        current.classList.add('pointer-lit');
      }
    });
    document.addEventListener('pointerout',e=>{
      if(e.relatedTarget===null){
        document.body.classList.remove('cursor-on');
        if(current)current.classList.remove('pointer-lit');
        current=null;
      }
    });
    window.addEventListener('blur',()=>{
      document.body.classList.remove('cursor-on');
      if(current)current.classList.remove('pointer-lit');
      current=null;
    });
  }
  document.addEventListener('click',e=>{
    if(reduced||!(e.target instanceof Element))return;
    const control=e.target.closest('button:not(:disabled),a[href]');
    if(!control)return;
    control.classList.remove('tap-flash');
    void control.offsetWidth;
    control.classList.add('tap-flash');
    setTimeout(()=>control.classList.remove('tap-flash'),430);
  });
}
installMotion();
// Store the key only on the local server; never keep it in browser storage.
document.addEventListener('submit',async e=>{
  if(e.target.id!=='aiKeyForm')return;
  e.preventDefault();
  const field=$('#geminiKey'),button=$('#saveGeminiKey'),apiKey=field.value.trim();
  if(!apiKey)return;
  button.disabled=true;button.textContent='Saving securely…';
  try{
    const r=await fetch('/api/configure-ai',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({apiKey})});
    const data=await r.json();
    if(!r.ok)throw new Error(data.error||'Could not save the key');
    field.value='';s.api=true;s.server=true;s.provider='gemini';updateAssistantState();render();toast('Gemini is ready for clinic questions.');
  }catch(error){toast(error.message||'Could not save the key. Try again.')}
  finally{if(document.body.contains(button)){button.disabled=false;button.textContent='Save key on this computer'}}
});
// Restore page startup, navigation, booking, and team interactions.
document.addEventListener('click',e=>{
  const date=e.target.closest('[data-date]');
  if(date){s.date=date.dataset.date;s.slot='';s.slotPeriod='all';render();return}
  const type=e.target.closest('[data-type]');
  if(type){s.type=type.dataset.type;s.slot='';render();return}
  const period=e.target.closest('[data-period]');
  if(period){s.slotPeriod=period.dataset.period;render();return}
  const slot=e.target.closest('[data-slot]');
  if(slot&&!slot.disabled){s.slot=slot.dataset.slot;render();return}
  const tab=e.target.closest('[data-tab]');
  if(tab){s.tab=tab.dataset.tab;render();return}
  const block=e.target.closest('[data-block]');
  if(block&&!block.disabled){
    const id=block.dataset.block,record=slots(id.split('|')[0]).find(x=>x.id===id);
    s.blocks[id]=status(record)!=='blocked';save('blocks',s.blocks);render();return
  }
  const resolve=e.target.closest('[data-resolve]');
  if(resolve){
    const list=resolve.dataset.kind==='booking'?s.bookings:s.handoffs,item=list.find(x=>x.id===resolve.dataset.resolve);
    const done=resolve.dataset.kind==='booking'?'Confirmed':'Resolved';
    if(item)item.status=item.status===done?'Requested':done;
    save(resolve.dataset.kind==='booking'?'bookings':'handoffs',list);render();return
  }
  const remove=e.target.closest('[data-delete]');
  if(remove){s.faqs.splice(Number(remove.dataset.delete),1);save('faqs',s.faqs);render();return}
  if(e.target.closest('#restore')){s.faqs=faq0.slice();save('faqs',s.faqs);render();return}
  if(e.target.closest('#addFaq')){$('#faqForm').classList.toggle('hidden');return}
  if(e.target.closest('[data-close]')){$('#handoff').close();return}
  if(e.target.closest('[data-handoff]')){$('#handoff').showModal();return}
  if(e.target.closest('#assistantToggle')){($('#assistant').classList.contains('open')?closeAssistant:openAssistant)();return}
  if(e.target.closest('#assistantClose')){closeAssistant();return}
  if(e.target.closest('#menu')){$('#sidebar').classList.toggle('open');return}
  if(e.target.closest('#openAssistant')){openAssistant();return}
  const prompt=e.target.closest('[data-prompt]');
  if(prompt){openAssistant();$('#question').value=prompt.dataset.prompt;$('#chatForm').requestSubmit()}
});
document.addEventListener('submit',e=>{
  if(e.target.id==='bookForm'){submitBooking(e);return}
  if(e.target.id==='chatForm'){e.preventDefault();ask($('#question').value);return}
  if(e.target.id==='handoffForm'){
    e.preventDefault();
    s.handoffs.push({id:String(Date.now()),topic:$('#topic').value,message:$('#message').value.trim()||'Please contact me about a clinic question.',status:'New request',created:new Date().toISOString()});
    save('handoffs',s.handoffs);$('#message').value='';$('#handoff').close();render();toast('Message saved on this device. The clinic has not received it.');
    if($('#assistant').classList.contains('open'))bubble('Your message is saved in this browser. Clinic staff have not received it yet.','bot');
    return
  }
  if(e.target.id==='settingsForm'){
    e.preventDefault();s.clinic=Object.assign({},s.clinic,Object.fromEntries(new FormData(e.target).entries()));
    save('clinic',s.clinic);render();toast('Clinic details saved');return
  }
  if(e.target.id==='faqForm'){
    e.preventDefault();const q=$('#fq').value.trim(),a=$('#fa').value.trim();
    if(q&&a){s.faqs.push({q:q,a:a});save('faqs',s.faqs);render();toast('Clinic answer saved')}
  }
});
document.addEventListener('change',e=>{
  if(e.target.id==='bookDate'){
    const max=plus(today(),30),picked=e.target.value||today();
    s.date=picked<today()?today():picked>max?max:picked;s.slot='';s.slotPeriod='all';render()
  }
});
async function init(){
  if(location.protocol!=='file:'){
    try{
      const response=await fetch('/api/config');
      if(response.ok){
        const config=await response.json();
        s.clinic=Object.assign({},clinic0,config,s.clinic);s.server=true;s.api=config.mode==='api';s.provider=config.provider||null
      }
    }catch{}
  }
  try{const response=await fetch('./clinic-info.json');if(response.ok)s.clinic=Object.assign({},clinic0,await response.json(),s.clinic)}catch{}
  const page=location.hash.slice(1);
  s.page=['dashboard','schedule','appointments','clinic','team','assistant'].includes(page)?page:'dashboard';
  if(!location.hash)history.replaceState(null,'','#dashboard');
  updateAssistantState();render()
}
window.addEventListener('hashchange',()=>{
  const page=location.hash.slice(1);
  if(['dashboard','schedule','appointments','clinic','team','assistant'].includes(page)){s.page=page;go(page)}
});
init();