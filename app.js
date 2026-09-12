const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const state=JSON.parse(localStorage.getItem("teyvatTracker")||'{"primogems":12480,"fates":12,"acquaint":4,"stardust":340,"pity":64,"goal":180,"goalDate":"2026-10-25","goalTitle":"Ahorrar para el próximo personaje","banner":"character","guaranteed":false}');
const save=()=>localStorage.setItem("teyvatTracker",JSON.stringify(state));
const fmt=n=>Number(n).toLocaleString("es");
function render(){
 $("#primogems").textContent=fmt(state.primogems);
 $("#fates").textContent=fmt(state.fates);
 $("#acquaint").textContent=fmt(state.acquaint);
 $("#stardust").textContent=fmt(state.stardust);
 const wishes=Math.floor(state.primogems/160)+state.fates;
 $("#wishEquivalent").textContent=wishes;
 $("#goalWish").textContent=wishes;
 const pct=Math.min(100,Math.round(wishes/state.goal*100));
 $("#goalPercent").textContent=pct+"%"; $("#goalProgress").style.width=pct+"%";
 $("#goalRemaining").textContent=Math.max(0,state.goal-wishes);
 const days=Math.max(1,Math.ceil((new Date(state.goalDate)-new Date())/86400000));
 $("#dailyNeed").textContent=(Math.max(0,state.goal-wishes)/days).toFixed(1);
 $("#goalTitle").textContent=state.goalTitle;
 $("#goalRing").style.background=`conic-gradient(var(--accent) 0 ${pct}%,#29344a ${pct}% 100%)`;
 $("#pityNumber").textContent=state.pity;
 $("#pityTrack i").style.width=Math.min(100,state.pity/90*100)+"%";
 $("#lastFive").textContent="Hace "+state.pity+" deseos";
 $("#pityStatus").textContent=state.guaranteed?"Garantizado":"50/50 en juego";
}
function toast(msg){let t=$("#toast");if(!t){t=document.createElement("div");t.id="toast";t.className="toast";document.body.append(t)}t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
function openModal(type){
 const b=$("#modalBackdrop"),m=$("#modal");
 if(type==="resources")m.innerHTML=`<h2>Actualizar recursos</h2><p>Elige cómo quieres actualizar tu inventario.</p>
 <div class="modal-grid">
 <button class="primary" id="addRes">＋ Añadir</button><button class="ghost" id="spendRes">－ Gastar</button>
 <button class="ghost" id="setRes">↺ Establecer</button><button class="ghost" id="rewardRes">🎁 Recompensa</button></div>
 <div class="modal-actions"><button class="ghost" id="closeM">Cerrar</button></div>`;
 else if(type==="goal")m.innerHTML=`<h2>Editar meta</h2><p>Define cuántos deseos quieres tener y para cuándo.</p>
 <div class="modal-grid"><div class="field"><label>Deseos objetivo</label><input id="goalInput" type="number" value="${state.goal}"></div>
 <div class="field"><label>Fecha</label><input id="dateInput" type="date" value="${state.goalDate}"></div></div>
 <div class="field" style="margin-top:10px"><label>Nombre de la meta</label><input id="titleInput" value="${state.goalTitle}"></div>
 <div class="modal-actions"><button class="ghost" id="closeM">Cancelar</button><button class="primary" id="saveGoal">Guardar</button></div>`;
 b.classList.add("open");
 $("#closeM").onclick=()=>b.classList.remove("open");
 if(type==="resources"){
  $("#addRes").onclick=()=>resourceFlow(1,"Añadir protogemas");
  $("#spendRes").onclick=()=>resourceFlow(-1,"Gastar protogemas");
  $("#setRes").onclick=()=>{let v=prompt("Nueva cantidad de protogemas",state.primogems);if(v!==null){state.primogems=Math.max(0,+v||0);save();render();b.classList.remove("open");toast("Protogemas actualizadas ✓")}};
  $("#rewardRes").onclick=()=>{state.primogems+=60;save();render();b.classList.remove("open");toast("+60 protogemas registrados ✦")};
 } else $("#saveGoal").onclick=()=>{state.goal=Math.max(1,+$("#goalInput").value||1);state.goalDate=$("#dateInput").value||state.goalDate;state.goalTitle=$("#titleInput").value||"Mi meta";save();render();b.classList.remove("open");toast("Meta actualizada ✓")};
}
function resourceFlow(mult,title){let v=prompt(title+" — ¿cuántas protogemas?",mult>0?"160":"160");if(v!==null){state.primogems=Math.max(0,state.primogems+mult*(+v||0));save();render();$("#modalBackdrop").classList.remove("open");toast("Inventario actualizado ✓")}}
$$("[data-modal]").forEach(x=>x.onclick=()=>openModal(x.dataset.modal));
$("#editGoal").onclick=()=>openModal("goal");
$$("[data-nav]").forEach(x=>x.onclick=()=>{let n=x.dataset.nav;if(n==="wishes"){openModal("wishes")}else if(n==="goals"){openModal("goal")}else toast(n==="stats"?"Estadísticas próximamente ✦":"Sección seleccionada")});
$$("[data-banner]").forEach(x=>x.onclick=()=>{ $$(".tab").forEach(t=>t.classList.remove("active"));x.classList.add("active"); state.banner=x.dataset.banner; state.pity=state.banner==="weapon"?27:state.banner==="standard"?18:64;save();render();toast("Banner cambiado")});
$$(".task input").forEach(i=>i.onchange=()=>{let checked=[...$$(".task input")].filter(x=>x.checked).length;$("#taskCount").textContent=checked+"/4"});
$("#settingsBtn").onclick=()=>toast("Configuración: datos guardados localmente");
render();

if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
