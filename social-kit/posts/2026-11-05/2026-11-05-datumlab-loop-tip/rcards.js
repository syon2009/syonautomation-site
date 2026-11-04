const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+process.cwd()+'/cards.html');await p.waitForTimeout(600);
for(const id of ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11"]){await p.evaluate(i=>{document.querySelectorAll('.c').forEach(c=>c.classList.toggle('on',c.id==i))},id);await p.waitForTimeout(200);await p.screenshot({path:`card_${id}.png`});}
await b.close();})();