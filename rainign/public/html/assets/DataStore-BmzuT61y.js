import{m,g as t,e as i}from"./index-DfofyrRG.js";const f=m("weather",()=>{const a=t("live"),s=t([]),c=t(""),n=t("now"),u=t([]),v=e=>{if(!e||e==="now")return"";const o=new Date(e);return isNaN(o.getTime())?"":o.toISOString()},r=i(()=>({mode:a.value,measures:s.value,stations:u.value,sdate:v(c.value),edate:n.value===""||n.value==="now"?"now":v(n.value)})),l=i(()=>{const e=s.value.filter(o=>o!=="position");return s.value.includes("position")&&e.push("lat","lon"),e}),d=i(()=>u.value.map(e=>a.value==="live"?`http://${e}.ensg.eu:3000/live/${l.value.join("-")}`:`http://${e}.ensg.eu:3000/sample/${r.value.sdate}/${r.value.edate}/${l.value.join("-")}`));return{mode:a,selectedMeasures:s,station:u,startDate:c,endDate:n,queryParams:r,url_fetch:d,queryMesures:l}}),h=m("weather",()=>({data:t(null)}));export{h as a,f as u};
