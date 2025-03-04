import{_ as h,c,a as o,F as y,e as b,o as d,w as k,f as x,u as p,t as C,g as V,r as v,h as S,i as w,j as D,n as M,k as $}from"./index-BOrR50vf.js";import{u as f,a as B}from"./DataStore-C8cQKtu4.js";const L={class:"station-form"},P=["id","value","checked"],z=["for"],E={__name:"ChoixStation",setup(m){const a=f();return(e,t)=>(d(),c("fieldset",L,[t[1]||(t[1]=o("legend",{class:"station-legend"},"Choisissez la/les station(s) à afficher :",-1)),(d(),c(y,null,b(["piensg027","piensg028","piensg030","piensg031","piensg032"],n=>o("div",{class:"station-option",key:n},[k(o("input",{type:"checkbox",id:n,value:n,"onUpdate:modelValue":t[0]||(t[0]=i=>p(a).station=i),checked:n==="piensg031"},null,8,P),[[x,p(a).station]]),o("label",{for:n},C(n),9,z)])),64))]))}},O=h(E,[["__scopeId","data-v-41cbb2f4"]]),U={class:"weather-form"},F={class:"weather-option-all"},N=["checked"],T=["id","value"],j=["for"],q={__name:"ChoixCapteur",setup(m){const a=f(),e=i=>({temperature:"Température",pressure:"Pression",humidity:"Humidité",rain:"Précipitations",luminosity:"Luminosité",wind_heading:"Direction du vent",wind_speed_avg:"Vitesse moyenne du vent",position:"Position"})[i]||i,t=V(()=>a.selectedMeasures.length===8),n=()=>{t.value?a.selectedMeasures=[]:a.selectedMeasures=["temperature","pressure","humidity","rain","luminosity","wind_heading","wind_speed_avg","position"]};return(i,s)=>(d(),c("fieldset",U,[s[2]||(s[2]=o("legend",{class:"weather-legend"},"Choisissez les mesures que vous souhaitez voir :",-1)),o("div",F,[o("input",{type:"checkbox",id:"select-all",checked:t.value,onChange:n},null,40,N),s[1]||(s[1]=o("label",{for:"select-all"},"Tout sélectionner",-1))]),(d(),c(y,null,b(["temperature","pressure","humidity","rain","luminosity","wind_heading","wind_speed_avg","position"],l=>o("div",{class:"weather-option",key:l},[k(o("input",{type:"checkbox",id:l,value:l,"onUpdate:modelValue":s[0]||(s[0]=_=>p(a).selectedMeasures=_)},null,8,T),[[x,p(a).selectedMeasures]]),o("label",{for:l},C(e(l)),9,j)])),64))]))}},Q=h(q,[["__scopeId","data-v-c156437b"]]),A=["disabled"],R={key:0,class:"spinner"},H={key:1,class:"cross"},W={__name:"ValidationBouton",setup(m){const a=$(),e=f(),t=B();let n=e.mode;const i=v(!1),s=v(!1),l=async()=>{console.log("Mesures sélectionnées :",e.queryParams),console.log("URL auto ?:",e.url_fetch),i.value=!0,s.value=!1;try{if(e.url_fetch.length>1){const u=e.url_fetch.map(r=>g(r));t.data=await Promise.all(u),console.log("Données récupérées:",t.data)}else t.data=await g(e.url_fetch),console.log("Données récupérées:",t.data);a.push("/dashboard"+n)}catch(u){console.error("Une erreur s'est produite, impossible de récupérer les données",u),s.value=!0}finally{i.value=!1}},_=V(()=>e.mode==="sample"&&!e.startDate||e.selectedMeasures.length===0||e.station.length===0),g=async u=>{try{const r=await fetch(u);if(!r.ok)throw new Error("Erreur de récupération des données");return await r.json()}catch(r){throw console.error("Erreur lors de la récupération des données:",r),r}};return S(()=>e.station,()=>{s.value=!1}),(u,r)=>(d(),c("button",{class:M(["validate-btn",{"fetch-failed":s.value}]),onClick:l,disabled:_.value},[i.value?(d(),c("span",R)):w("",!0),s.value?(d(),c("span",H,"✖")):w("",!0),r[0]||(r[0]=D(" Valider "))],10,A))}},X=h(W,[["__scopeId","data-v-cc858411"]]);export{Q as C,X as V,O as a};
