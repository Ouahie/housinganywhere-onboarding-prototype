const steps=["Profile","Verify","Rules","Property","Media","Pricing","Screening","Review","Publish"];

const defaults={
  current:-1,
  notes:false,
  account:{firstName:"",lastName:"",email:"",phone:"",units:"2",role:"side-investor"},
  verified:{email:false,phone:false,identity:false,payout:false},
  rules:{platform:false,viewings:false,transparency:false,payout:false},
  ruleAcknowledged:false,
  ruleQuiz:null,
  property:{country:"Netherlands",city:"Amsterdam",address:"",type:"Apartment",size:"",bedrooms:"1",registration:"Yes",rules:""},
  pricing:{rent:"",utilities:"",deposit:"",extra:"",availableFrom:"",availableTo:"",minimumStay:"3",maximumStay:"12"},
  tenant:{id:true,income:true,employment:false,enrollment:false,preference:"No preference",notes:""},
  published:false
};

let state=loadState();
const app=document.getElementById("app");
const progressList=document.getElementById("progressList");
const toastEl=document.getElementById("toast");

function cloneDefaults(){return JSON.parse(JSON.stringify(defaults))}
function loadState(){
  try{
    const saved=JSON.parse(localStorage.getItem("haPrototypeState")||"{}");
    return deepMerge(cloneDefaults(),saved);
  }catch{return cloneDefaults()}
}
function deepMerge(target,source){
  if(!source||typeof source!=="object")return target;
  Object.keys(source).forEach(k=>{
    if(source[k]&&typeof source[k]==="object"&&!Array.isArray(source[k])&&target[k]&&typeof target[k]==="object"){
      target[k]=deepMerge(target[k],source[k]);
    }else target[k]=source[k];
  });
  return target;
}
function save(){localStorage.setItem("haPrototypeState",JSON.stringify(state))}
function esc(v=""){return String(v).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]))}
function money(v){const n=Number(v||0);return n?new Intl.NumberFormat("en-GB",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n):"—"}
function toast(msg){toastEl.textContent=msg;toastEl.classList.add("show");clearTimeout(window.__toastTimer);window.__toastTimer=setTimeout(()=>toastEl.classList.remove("show"),2200)}
function scrollTop(){window.scrollTo({top:0,behavior:"smooth"})}

function renderProgress(){
  progressList.innerHTML=steps.map((s,i)=>`<li class="progress-item ${state.current>i?"done":state.current===i?"active":""}"><span class="dot">${state.current>i?"✓":i+1}</span><span>${s}</span></li>`).join("");
  const i=Math.max(0,state.current);
  document.getElementById("mobileStepLabel").textContent=`Step ${Math.min(i+1,9)} of 9`;
  document.getElementById("mobileStepName").textContent=state.current<0?"Welcome":steps[i]||"Complete";
  document.getElementById("mobileProgressBar").style.width=state.current<0?"0%":`${((i+1)/9)*100}%`;
  const remaining=state.current<0?7:Math.max(1,7-Math.floor((i+1)*.7));
  document.getElementById("progressMeta").textContent=state.current>=8?"Complete":`About ${remaining} min left`;
}

function header(step,title,copy){
  return `<div class="screen-header"><div class="kicker"><span class="step-pill">${step}</span> Your HousingAnywhere journey</div><h2>${title}</h2><p>${copy}</p></div>`;
}
function solutionNote(title,copy){
  return `<div class="solution-note"><strong>${title}</strong><span>${copy}</span></div>`;
}
function nav(nextLabel="Continue",disabled=false,nextFn="next()",back=true,left=""){
  return `<div class="actions"><div class="actions-left">${left}</div><div class="actions-right">${back?'<button class="btn btn-secondary" type="button" onclick="prev()">Back</button>':""}<button class="btn btn-primary" type="button" ${disabled?"disabled":""} onclick="${nextFn}">${nextLabel}</button></div></div>`;
}

function welcome(){
  app.innerHTML=`<section class="screen hero-screen">
    <div class="hero-layout">
      <div>
        <div class="eyebrow">Your next booking starts here</div>
        <h2>Find the right tenant. Keep control. Skip the endless viewings.</h2>
        <p class="hero-copy">Create a clear listing, reach international students and working professionals, and review applicants online while keeping the final decision in your hands.</p>
        <div class="hero-cta-row">
          <button class="btn btn-primary" type="button" onclick="start()">List your property</button>
          <button class="btn btn-ghost" type="button" onclick="demo()">Try demo profile</button>
        </div>
        <div class="stat-strip">
          <span class="stat-chip">✓ Reach tenants internationally</span>
          <span class="stat-chip">✓ Review verified profiles</span>
          <span class="stat-chip">✓ Secure online booking</span>
        </div>
        <p class="microcopy">Educational prototype. Progress is saved on this device.</p>
        ${solutionNote("Design rationale","The value proposition appears before any form fields. This addresses the Week 2 barrier that landlords need a clear reason to invest time in onboarding.")}
      </div>
      <div class="hero-benefits">
        <div class="benefit-card"><div class="benefit-icon">↗</div><div><strong>Reach international demand</strong><span>Connect with students and young professionals relocating from abroad.</span></div></div>
        <div class="benefit-card"><div class="benefit-icon">✓</div><div><strong>Screen with confidence</strong><span>Use verified profiles and request supporting documents before deciding.</span></div></div>
        <div class="benefit-card"><div class="benefit-icon">⌂</div><div><strong>No physical viewings</strong><span>A transparent listing with strong media supports remote decisions.</span></div></div>
        <div class="benefit-card"><div class="benefit-icon">€</div><div><strong>Secure payment flow</strong><span>Keep booking and payment on-platform through the move-in protection period.</span></div></div>
      </div>
    </div>
  </section>`;
}

function account(){
  const a=state.account;
  app.innerHTML=`<section class="screen">
    ${header("1 of 9","Your journey to HousingAnywhere","Create your account and tell us a little about the property you want to list.")}
    <div class="form-grid">
      <div class="field"><label for="firstName">First name</label><input id="firstName" autocomplete="given-name" value="${esc(a.firstName)}"></div>
      <div class="field"><label for="lastName">Last name</label><input id="lastName" autocomplete="family-name" value="${esc(a.lastName)}"></div>
      <div class="field"><label for="email">Email</label><input id="email" type="email" autocomplete="email" value="${esc(a.email)}"></div>
      <div class="field"><label for="phone">Phone number</label><input id="phone" autocomplete="tel" value="${esc(a.phone)}"></div>
      <div class="field"><label for="units">How many rentable units do you manage?</label><select id="units"><option>1</option><option>2</option><option>3</option><option>4–6</option><option>7–12</option></select></div>
      <div class="field"><label for="role">Which description fits best?</label><select id="role"><option value="side-investor">I own a rental property alongside my career.</option><option value="full-time">Property rental is my main profession.</option><option value="other">Other</option></select></div>
    </div>
    <div class="segment-card"><div class="mini-icon">i</div><div><strong>Why we ask</strong><p>Your details help us set up your account and keep listing and booking updates in one place.</p></div></div>
    ${solutionNote("Our solution: a clear start","A short account setup gives landlords a clear path into the listing journey.")}
    ${nav("Continue",false,"saveAccount()",false)}
  </section>`;
  document.getElementById("units").value=a.units;
  document.getElementById("role").value=a.role;
}

function verifyRow(key,title,copy,tag){
  const done=state.verified[key];
  return `<div class="verify-card"><div class="verify-icon">${done?"✓":"•"}</div><div><strong>${title}</strong><div class="inline-note">${copy}</div></div><button class="status ${done?"done":"pending"}" type="button" onclick="verify('${key}')">${done?"Verified":tag}</button></div>`;
}
function verification(){
  const v=state.verified,all=v.email&&v.phone&&v.identity&&v.payout;
  app.innerHTML=`<section class="screen">
    ${header("2 of 9","Set up your account for a successful booking.","Here are a few important legal and account checks. Complete them now to get your listing ready for its first booking.")}
    ${verifyRow("email","Email address","Confirm account and booking updates.","Verify")}
    ${verifyRow("phone","Mobile number","Confirm a reachable contact number.","Send code")}
    ${verifyRow("identity","Identity check","Confirm your identity so tenants know who they are booking with.","Start check")}
    ${verifyRow("payout","Payout details","Confirm where successful booking payouts should be sent.","Set up")}
    <div class="info-box"><strong>Your details stay protected.</strong> Complete each check once so your account is ready when a tenant books.</div>
    ${solutionNote("Our solution: low-touch verification","The scalable default is self-service. A Business Development Representative only steps in when verification fails, information conflicts or the landlord asks for help.")}
    ${nav("Continue",!all)}
  </section>`;
}

function ruleCard(n,title,copy){
  return `<article class="rule-card">
    <div class="rule-top"><span class="rule-number">RULE ${n}</span></div>
    <h3>${title}</h3><p>${copy}</p>
  </article>`;
}
function rules(){
  const acknowledged=!!state.ruleAcknowledged;
  app.innerHTML=`<section class="screen">
    ${header("3 of 9","A few important guidelines for your listing.","These guidelines help keep communication clear and create a smooth booking experience for you and your tenants.")}
    <div class="rules-grid">
      ${ruleCard("01","Keep communication and booking on HousingAnywhere","Keep conversations and the booking on the platform so the details stay together and the booking remains protected.")}
      ${ruleCard("02","Help tenants understand the property remotely","Clear photos, video and property information help tenants make an informed decision before they arrive.")}
      ${ruleCard("03","Make sure your listing reflects the property","Photos, descriptions, costs and property details should accurately represent what the tenant will receive.")}
      ${ruleCard("04","Payout follows the move-in protection period","The first month's rent is released after the tenant has had the move-in protection period.")}
    </div>

    <label class="acknowledgement-card"><input type="checkbox" ${acknowledged?"checked":""} onchange="acknowledgeRules(this.checked)"><span><strong>Acknowledgement</strong><span>I acknowledge the rules listed above and understand what they mean.</span></span></label>
    ${solutionNote("Our solution: teach, do not just disclose","The landlord learns the platform rules inside the task, with a short scenario to check understanding. This replaces repetitive verbal onboarding while keeping compliance visible.")}
    ${nav("Continue",!acknowledged)}
  </section>`;
}

function property(){
  const p=state.property;
  app.innerHTML=`<section class="screen">
    ${header("4 of 9","Build your property profile.","Give tenants the details they need to understand your home and decide remotely.")}
    <div class="segment-card"><div class="mini-icon">✓</div><div><strong>Your listing</strong><p>${esc(state.account.units)} rentable unit(s) in your account.</p></div></div>
    <div class="form-grid">
      <div class="field"><label for="country">Country</label><select id="country"><option>Netherlands</option><option>Germany</option><option>France</option><option>Spain</option><option>Italy</option></select></div>
      <div class="field"><label for="city">City</label><input id="city" value="${esc(p.city)}"></div>
      <div class="field full"><label for="address">Property address</label><input id="address" value="${esc(p.address)}"><small>Shown according to HousingAnywhere's listing and booking rules.</small></div>
      <div class="field"><label for="type">Property type</label><select id="type"><option>Apartment</option><option>Studio</option><option>Room</option></select></div>
      <div class="field"><label for="size">Size (m²)</label><input id="size" type="number" min="1" value="${esc(p.size)}"></div>
      <div class="field"><label for="bedrooms">Bedrooms</label><select id="bedrooms"><option>1</option><option>2</option><option>3</option><option>4+</option></select></div>
      <div class="field"><label for="registration">Registration possible?</label><select id="registration"><option>Yes</option><option>No</option><option>Unsure</option></select></div>
      <div class="field full"><label for="houseRules">House rules</label><textarea id="houseRules" placeholder="e.g. no smoking, quiet hours, pets...">${esc(p.rules)}</textarea></div>
    </div>
    <div class="info-box"><strong>Autosaved:</strong> you can leave and continue later instead of finishing the listing in one sitting.</div>
    ${solutionNote("Our solution: progressive disclosure","The listing is broken into focused stages rather than one large form, making it easier to complete at your own pace.")}
    ${nav("Continue",false,"saveProperty()")}
  </section>`;
  ["country","type","bedrooms","registration"].forEach(id=>document.getElementById(id).value=p[id]);
}

function media(){
  app.innerHTML=`<section class="screen">
    ${header("5 of 9","Show every room at its best.","Bright, accurate photos help tenants picture themselves in your home and make an informed decision remotely.")}
    <div class="upload-box">
      <strong>Add your property photos</strong>
      <p class="inline-note">Use the room examples below for inspiration, then upload clear photos of your own bedroom, kitchen and bathroom.</p>
      <input id="mediaInput" type="file" accept="image/*" multiple>
    </div>
    <div id="mediaPreview" class="media-preview">
      <figure class="room-card"><div class="media-tile"><img src="assets/bedroom-example.jpg" alt="Bright, elegantly furnished bedroom example" loading="lazy"><span class="media-label">Bedroom example</span></div><figcaption>Bedroom · show the full sleeping area and storage</figcaption></figure>
      <figure class="room-card"><div class="media-tile"><img src="assets/kitchen-v3.jpg" alt="Modern white kitchen with a hob, extractor hood and breakfast bar" loading="lazy"><span class="media-label">Kitchen example</span></div><figcaption>Kitchen · include appliances and dining space</figcaption></figure>
      <figure class="room-card"><div class="media-tile"><img src="assets/bathroom-example.jpg" alt="Clean contemporary bathroom example" loading="lazy"><span class="media-label">Bathroom example</span></div><figcaption>Bathroom · use good light and a clear angle</figcaption></figure>
    </div>
    <div class="media-coach"><div><strong>Transparency coach</strong><div class="inline-note" id="mediaCoachText">Add clear photos of each major room. The prototype can flag gaps before publication.</div></div><div class="media-score" id="mediaScore">Guidance ready</div></div>
    ${solutionNote("Our solution: media coaching","Instead of simply enforcing transparency at the end, the interface helps the landlord create a listing capable of replacing a physical viewing.")}
    ${nav()}
  </section>`;

  document.getElementById("mediaInput").addEventListener("change",e=>{
    const box=document.getElementById("mediaPreview");
    box.innerHTML="";
    const files=[...e.target.files].slice(0,6);
    files.forEach((file,i)=>{
      const tile=document.createElement("div");
      tile.className="media-tile";
      const img=document.createElement("img");
      img.src=URL.createObjectURL(file);
      img.alt=`Uploaded property photo ${i+1}`;
      tile.appendChild(img);
      box.appendChild(tile);
    });
    const count=files.length;
    document.getElementById("mediaCoachText").textContent=count>=5?"Strong coverage. Before publishing, check that the bedroom, kitchen, bathroom and living area are all represented.":`${count} photo${count===1?"":"s"} added. Add several clear angles so tenants can evaluate the property remotely.`;
    document.getElementById("mediaScore").textContent=count>=5?"Strong coverage":count?"Keep adding":"Guidance ready";
  });
}

function pricing(){
  const p=state.pricing;
  app.innerHTML=`<section class="screen">
    ${header("6 of 9","Set your pricing and availability.","Add the rent, other property costs and available dates so tenants can plan their stay.")}
    <div class="form-grid">
      <div class="field"><label for="rent">Monthly rent (€)</label><input id="rent" type="number" min="1" value="${esc(p.rent)}"></div>
      <div class="field"><label for="utilities">Utilities (€)</label><input id="utilities" type="number" min="0" value="${esc(p.utilities)}"></div>
      <div class="field"><label for="deposit">Deposit (€)</label><input id="deposit" type="number" min="0" value="${esc(p.deposit)}"></div>
      <div class="field"><label for="extra">Other mandatory fees (€)</label><input id="extra" type="number" min="0" value="${esc(p.extra)}"></div>
      <div class="field"><label for="availableFrom">Available from</label><input id="availableFrom" type="date" value="${esc(p.availableFrom)}"></div>
      <div class="field"><label for="availableTo">Available to</label><input id="availableTo" type="date" value="${esc(p.availableTo)}"></div>
      <div class="field"><label for="minimumStay">Minimum stay (months)</label><input id="minimumStay" type="number" min="1" max="24" value="${esc(p.minimumStay)}"></div>
      <div class="field"><label for="maximumStay">Maximum stay (months)</label><input id="maximumStay" type="number" min="1" max="24" value="${esc(p.maximumStay)}"></div>
    </div>
    ${solutionNote("Our solution: clear pricing","This step focuses on the costs and dates tenants need to compare listings. The booking fee is shown with the completed listing at final review.")}
    ${nav("Continue",false,"savePricing()")}
  </section>`;
}

function tenant(){
  const t=state.tenant;
  const ck=(k,l,sub)=>`<label class="chip"><input data-tenant="${k}" type="checkbox" ${t[k]?"checked":""}><span><strong>${l}</strong>${sub?` · ${sub}`:""}</span></label>`;
  app.innerHTML=`<section class="screen">
    ${header("7 of 9","Choose what you need to trust a tenant.","The platform structures the screening. You keep control over the final decision.")}
    <div class="form-grid">
      <div class="field full"><label>Supporting information</label><div class="chips">${ck("id","Verified ID","identity")}${ck("income","Proof of income","affordability")}${ck("employment","Proof of employment","working professionals")}${ck("enrollment","University enrolment","students")}</div><small>Request the information that matters for your decision without forcing every applicant through unnecessary steps.</small></div>
      <div class="field"><label for="preference">Preferred tenant profile</label><select id="preference"><option>No preference</option><option>Student</option><option>Young professional</option><option>Either student or professional</option></select></div>
      <div class="field full"><label for="tenantNotes">Additional screening notes</label><textarea id="tenantNotes" placeholder="e.g. short introduction, planned move-in date...">${esc(t.notes)}</textarea></div>
    </div>
    <div class="success-box"><strong>Your property, your decision.</strong> HousingAnywhere can reduce repetitive screening work, but you still choose whether to accept a tenant.</div>
    ${solutionNote("Our solution: automate routine work, preserve your control","The flow reduces time spent on admin while leaving the final tenant decision with the landlord.")}
    ${nav("Continue",false,"saveTenant()")}
  </section>`;
  document.getElementById("preference").value=t.preference;
}

function summaryCard(title,rows){
  return `<article class="summary-card"><h3>${title}</h3><dl>${rows.map(([k,v])=>`<dt>${k}</dt><dd>${esc(v)}</dd>`).join("")}</dl></article>`;
}
function review(){
  const a=state.account,p=state.property,pr=state.pricing,t=state.tenant;
  const feeRate=["netherlands","france"].includes((p.country||"").toLowerCase()) ? 0.05 : 0.08;
  const feeEstimate=Number(pr.rent||0)*Number(pr.minimumStay||0)*feeRate;
  app.innerHTML=`<section class="screen">
    ${header("8 of 9","Review your listing and booking fee.","Check the details below. You will see the estimated commission here before you choose to publish.")}
    <div class="readiness"><div class="readiness-score">100%</div><div><strong>Ready to publish</strong><div class="inline-note">Required prototype checks are complete. In a production version, image quality, field consistency and policy compliance could be checked automatically here.</div></div></div>
    <div class="summary-grid">
      ${summaryCard("Landlord",[["Name",(a.firstName+" "+a.lastName).trim()||"—"],["Portfolio",a.units+" unit(s)"],["Profile","Landlord"]])}
      ${summaryCard("Property",[["Location",(p.city||"—")+", "+p.country],["Type",p.type],["Size",p.size?p.size+" m²":"—"],["Bedrooms",p.bedrooms]])}
      ${summaryCard("Pricing",[["Monthly rent",money(pr.rent)],["Utilities",money(pr.utilities)],["Deposit",money(pr.deposit)],["Minimum stay",(pr.minimumStay||"—")+" months"]])}
      ${summaryCard("Screening",[["Verified ID",t.id?"Required":"Optional"],["Income",t.income?"Required":"Optional"],["Employment",t.employment?"Required":"Optional"],["Enrolment",t.enrollment?"Required":"Optional"]])}
    </div>
    <div class="fee-card"><div><strong>Commission after a successful booking</strong><div class="inline-note">Estimated at ${Math.round(feeRate*100)}% of rent for the minimum stay of ${esc(pr.minimumStay||"—")} months${feeRate===.08?", plus VAT where applicable":""}. The exact amount and terms are confirmed before publication.</div></div><div class="fee-value">${feeEstimate?money(feeEstimate):"Add rent to estimate"}</div></div>
    <ul class="checklist">
      <li><span class="checkmark">✓</span>Landlord verification completed</li>
      <li><span class="checkmark">✓</span>Platform rules acknowledged</li>
      <li><span class="checkmark">✓</span>Property information structured for remote booking</li>
      <li><span class="checkmark">✓</span>Pricing and availability transparent</li>
      <li><span class="checkmark">✓</span>Tenant-screening preferences set</li>
    </ul>
    ${solutionNote("Our solution: exception-based support","The high-touch account-manager model becomes an exception path. The default journey can scale across many small landlords without proportionally increasing headcount.")}
    ${nav("Publish listing",false,"publish()",true,'<button class="btn btn-ghost" type="button" onclick="openHelp()">Ask for human review</button>')}
  </section>`;
}

function published(){
  app.innerHTML=`<section class="screen">
    <div class="success-hero">
      <div class="success-icon">✓</div>
      <div class="eyebrow">Listing published</div>
      <h2>Your property is ready for international tenants.</h2>
      <p class="hero-copy" style="margin:0 auto">Applications arrive through HousingAnywhere. Review profiles, request documents, communicate securely and decide who you want to rent to.</p>
      <div class="next-steps">
        <div class="next-step"><strong>1</strong>Receive applications</div>
        <div class="next-step"><strong>2</strong>Review & screen</div>
        <div class="next-step"><strong>3</strong>Accept booking</div>
        <div class="next-step"><strong>4</strong>Move-in & payout</div>
      </div>
      <div class="info-box" style="text-align:left"><strong>Secure payout:</strong> after a successful move-in, the first month's rent is released after the 48-hour move-in protection period.</div>
      ${solutionNote("What the prototype changes","The journey moves from mandatory account-manager calls to segment-aware self-service onboarding, digital verification, interactive policy education, guided listing creation, transparent fee communication, landlord-controlled screening and automated readiness checks.")}
      <div class="actions" style="justify-content:center">
        <button class="btn btn-secondary" type="button" onclick="restart()">Restart prototype</button>
        <button class="btn btn-ghost" type="button" onclick="backToReview()">Review listing</button>
        <button class="btn btn-primary" type="button" onclick="dashboardDemo()">Open landlord dashboard</button>
      </div>
    </div>
  </section>`;
}

function render(){
  document.body.classList.toggle("show-notes",!!state.notes);
  const notesBtn=document.getElementById("notesBtn");
  notesBtn.textContent=state.notes?"Hide design notes":"Show design notes";
  notesBtn.setAttribute("aria-pressed",String(!!state.notes));
  renderProgress();
  if(state.current<0)return welcome();
  [account,verification,rules,property,media,pricing,tenant,review,published][state.current]();
}

function start(){state.current=0;save();render();scrollTop()}
function next(){state.current=Math.min(8,state.current+1);save();render();scrollTop()}
function prev(){state.current=Math.max(0,state.current-1);save();render();scrollTop()}
function verify(key){state.verified[key]=true;save();render();toast("Verified for prototype")}
function setRule(key,value){state.rules[key]=value;save();render()}
function answerQuiz(value){state.ruleQuiz=value;save();render()}
function acknowledgeRules(value){state.ruleAcknowledged=value;save();render()}

function saveAccount(){
  const required=["firstName","lastName","email","phone"];
  if(required.some(id=>!document.getElementById(id).value.trim()))return alert("Please complete your name, email and phone number.");
  state.account={
    firstName:document.getElementById("firstName").value.trim(),
    lastName:document.getElementById("lastName").value.trim(),
    email:document.getElementById("email").value.trim(),
    phone:document.getElementById("phone").value.trim(),
    units:document.getElementById("units").value,
    role:document.getElementById("role").value
  };
  next();
}
function saveProperty(){
  state.property={
    country:document.getElementById("country").value,
    city:document.getElementById("city").value.trim(),
    address:document.getElementById("address").value.trim(),
    type:document.getElementById("type").value,
    size:document.getElementById("size").value,
    bedrooms:document.getElementById("bedrooms").value,
    registration:document.getElementById("registration").value,
    rules:document.getElementById("houseRules").value.trim()
  };
  if(!state.property.city||!state.property.address)return alert("Please add a city and property address.");
  next();
}
function savePricing(){
  ["rent","utilities","deposit","extra","availableFrom","availableTo","minimumStay","maximumStay"].forEach(k=>state.pricing[k]=document.getElementById(k).value);
  if(!state.pricing.rent||!state.pricing.availableFrom||!state.pricing.availableTo)return alert("Please enter rent and availability dates.");
  next();
}
function saveTenant(){
  document.querySelectorAll("[data-tenant]").forEach(el=>state.tenant[el.dataset.tenant]=el.checked);
  state.tenant.preference=document.getElementById("preference").value;
  state.tenant.notes=document.getElementById("tenantNotes").value.trim();
  next();
}
function publish(){state.published=true;state.current=8;save();render();scrollTop()}
function backToReview(){state.current=7;save();render();scrollTop()}
function dashboardDemo(){toast("Demo complete — dashboard is outside this prototype scope.")}
function restart(){localStorage.removeItem("haPrototypeState");state=cloneDefaults();render();scrollTop()}
function demo(){
  state=cloneDefaults();
  state.current=0;
  state.account={firstName:"Alex",lastName:"de Vries",email:"alex@example.com",phone:"+31 6 12345678",units:"2",role:"side-investor"};
  state.verified={email:true,phone:true,identity:true,payout:true};
  state.rules={platform:true,viewings:true,transparency:true,payout:true};
  state.ruleAcknowledged=true;
  state.ruleQuiz="platform";
  state.property={country:"Netherlands",city:"Amsterdam",address:"Wibautstraat 131-D",type:"Apartment",size:"58",bedrooms:"1",registration:"Yes",rules:"No smoking. Respect quiet hours after 22:00."};
  state.pricing={rent:"1450",utilities:"150",deposit:"1450",extra:"0",availableFrom:"2026-11-01",availableTo:"2027-08-31",minimumStay:"3",maximumStay:"10"};
  state.tenant={id:true,income:true,employment:false,enrollment:true,preference:"Either student or professional",notes:"Please provide a short introduction and expected move-in date."};
  save();
  render();
  toast("Demo profile loaded");
}
function toggleNotes(){
  state.notes=!state.notes;
  save();
  render();
  toast(state.notes?"Design notes shown":"Design notes hidden");
}
function openHelp(){document.getElementById("helpDialog").showModal()}
function closeHelp(){document.getElementById("helpDialog").close()}

document.getElementById("saveExitBtn").addEventListener("click",()=>{save();toast("Progress saved on this device")});
document.getElementById("notesBtn").addEventListener("click",toggleNotes);
document.getElementById("helpBtn").addEventListener("click",openHelp);
document.getElementById("closeHelpBtn").addEventListener("click",closeHelp);
document.getElementById("closeHelpPrimary").addEventListener("click",closeHelp);
document.getElementById("helpDialog").addEventListener("click",e=>{if(e.target===e.currentTarget)closeHelp()});

Object.assign(window,{start,next,prev,verify,setRule,answerQuiz,acknowledgeRules,saveAccount,saveProperty,savePricing,saveTenant,publish,backToReview,dashboardDemo,restart,demo,toggleNotes,openHelp,closeHelp});
render();
