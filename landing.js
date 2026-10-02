const market=document.getElementById("calcMarket");
const rent=document.getElementById("calcRent");
const months=document.getElementById("calcMonths");
const contract=document.getElementById("calcContract");
const fee=document.getElementById("calcFee");

function euros(value){
  return new Intl.NumberFormat("en-GB",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(value||0);
}
function updateCalculator(){
  const monthly=Math.max(0,Number(rent?.value||0));
  const period=Math.max(1,Number(months?.value||1));
  const rate=Number(market?.value||0.08);
  const total=monthly*period;
  contract.textContent=euros(total);
  fee.textContent=euros(total*rate);
}
[market,rent,months].forEach(el=>el?.addEventListener("input",updateCalculator));
updateCalculator();

document.querySelectorAll('a[href^="#"]').forEach(link=>{
  link.addEventListener("click",event=>{
    const target=document.querySelector(link.getAttribute("href"));
    if(target){
      event.preventDefault();
      target.scrollIntoView({behavior:"smooth",block:"start"});
    }
  });
});
