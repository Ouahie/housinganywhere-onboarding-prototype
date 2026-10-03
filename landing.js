const audienceButtons = document.querySelectorAll('.audience-switch [data-select-audience]');
const audienceLinks = {
  tenant: {benefits:'#tenant-benefits',journey:'#tenant-journey',costs:'#tenant-costs',faq:'#tenant-faq'},
  landlord: {benefits:'#why',journey:'#how',costs:'#pricing',faq:'#faq'}
};
function setAudience(audience, scroll = false) {
  const selected = audience === 'landlord' ? 'landlord' : 'tenant';
  document.querySelectorAll('[data-audience]').forEach(el => { el.hidden = el.dataset.audience !== selected; });
  audienceButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.selectAudience === selected)));
  document.querySelectorAll('[data-nav]').forEach(link => { link.href = audienceLinks[selected][link.dataset.nav]; });
  const url = new URL(window.location.href);
  url.searchParams.set('audience', selected);
  // Clear an anchor belonging to the other view when changing focus.
  if (url.hash && document.getElementById(url.hash.slice(1))?.closest('[hidden]')) url.hash = '';
  history.replaceState(null, '', url);
  if (scroll) window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('[data-select-audience]').forEach(button => {
  button.addEventListener('click', () => setAudience(button.dataset.selectAudience, button.hasAttribute('data-scroll-top')));
});
const initialAudience = new URLSearchParams(window.location.search).get('audience');
const landlordAnchors = ['#why','#how','#pricing','#faq'];
setAudience(initialAudience || (landlordAnchors.includes(window.location.hash) ? 'landlord' : 'tenant'));

function readSaved(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}
const storedHomes = readSaved('haPrototypeSavedHomes', []);
const savedHomes = new Set(Array.isArray(storedHomes) ? storedHomes.filter(id => ['amsterdam','rotterdam','utrecht'].includes(id)) : []);
let onlySaved = false;
const savedFilter = document.getElementById('savedFilter');
function refreshSaved() {
  document.querySelectorAll('[data-save-home]').forEach(button => {
    const saved = savedHomes.has(button.dataset.saveHome);
    button.textContent = saved ? '♥' : '♡';
    button.setAttribute('aria-pressed', String(saved));
    const city = button.dataset.saveHome[0].toUpperCase() + button.dataset.saveHome.slice(1);
    button.setAttribute('aria-label', `${saved ? 'Unsave' : 'Save'} ${city} example home`);
  });
  document.getElementById('savedHomesSummary').textContent = savedHomes.size ? `${savedHomes.size} example home${savedHomes.size === 1 ? '' : 's'} saved` : 'Explore homes and save your favourites';
  savedFilter.textContent = `Saved homes (${savedHomes.size})`;
  savedFilter.setAttribute('aria-pressed', String(onlySaved));
}
document.querySelectorAll('[data-save-home]').forEach(button => button.addEventListener('click', () => {
  const id = button.dataset.saveHome;
  savedHomes.has(id) ? savedHomes.delete(id) : savedHomes.add(id);
  try { localStorage.setItem('haPrototypeSavedHomes', JSON.stringify([...savedHomes])); } catch { /* Browsing still works without storage. */ }
  refreshSaved();
  if (onlySaved) filterHomes();
}));
function filterHomes() {
  const city = document.getElementById('searchCity').value;
  const budget = document.getElementById('searchBudget').value;
  let count = 0;
  document.querySelectorAll('[data-home]').forEach(card => {
    const matches = (city === 'all' || card.dataset.city === city) && (budget === 'all' || Number(card.dataset.rent) <= Number(budget)) && (!onlySaved || savedHomes.has(card.dataset.home));
    card.hidden = !matches;
    if (matches) count++;
  });
  document.getElementById('homesResultCount').textContent = `${count} ${onlySaved ? 'saved ' : ''}example home${count === 1 ? '' : 's'}`;
  document.getElementById('homesEmpty').hidden = count > 0;
  refreshSaved();
}
document.getElementById('homeSearch').addEventListener('submit', event => { event.preventDefault(); filterHomes(); });
savedFilter.addEventListener('click', () => { onlySaved = !onlySaved; filterHomes(); });
document.getElementById('resetSearch').addEventListener('click', () => { document.getElementById('homeSearch').reset(); onlySaved = false; filterHomes(); });
refreshSaved();

const accountDialog = document.getElementById('accountDialog');
document.getElementById('openAccount').addEventListener('click', () => {
  const listing = readSaved('haPrototypeState', {});
  const current = Number(listing.current);
  const hasProgress = Number.isInteger(current) && current >= 0 && current <= 8;
  const firstName = typeof listing.account?.firstName === 'string' ? listing.account.firstName.trim() : '';
  document.getElementById('accountGreeting').textContent = firstName ? `Welcome back, ${firstName}. Pick up where you left off.` : 'Pick up your search or continue your listing.';
  document.getElementById('listingAccountLabel').textContent = listing.published ? 'View my published example' : hasProgress ? 'Continue my listing' : 'Create my listing';
  document.getElementById('listingAccountSummary').textContent = hasProgress ? `Your progress is saved · Step ${current + 1} of 9` : 'Start your guided property journey';
  refreshSaved();
  accountDialog.showModal();
});
document.getElementById('accountHomes').addEventListener('click', () => {
  accountDialog.close();
  setAudience('tenant');
  document.getElementById('homeSearch').reset();
  onlySaved = savedHomes.size > 0;
  filterHomes();
  document.getElementById('tenant-homes').scrollIntoView({behavior:'smooth'});
});
document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));

const homes = {
  amsterdam: {city:'Amsterdam',title:'Light-filled city apartment',summary:'Apartment · €1,450/month · Illustrative price',features:'1 bedroom · Furnished · 65 m²',image:'assets/bedroom-example.jpg',alt:'Sunlit double bedroom in the example apartment'},
  rotterdam: {city:'Rotterdam',title:'Your space, a shared home',summary:'Private room · €850/month · Illustrative price',features:'Private room · Shared living room and kitchen',image:'assets/living-room-example.jpg',alt:'Comfortable shared living room in the example home'},
  utrecht: {city:'Utrecht',title:'A fresh start in Utrecht',summary:'Studio · €1,100/month · Illustrative price',features:'Furnished studio · Own kitchen and bathroom',image:'assets/kitchen-v3.jpg',alt:'Modern white kitchen with a hob, extractor hood and breakfast bar'}
};
document.querySelectorAll('[data-view-home]').forEach(button => button.addEventListener('click', () => {
  const home = homes[button.dataset.viewHome];
  document.getElementById('homeDialogTitle').textContent = home.title;
  document.getElementById('homeDialogSummary').textContent = `${home.city} · ${home.summary}`;
  document.getElementById('homeDialogFeatures').textContent = home.features;
  const images = document.getElementById('homeDialogImages');
  images.replaceChildren();
  [{src:home.image,alt:home.alt},{src:'assets/kitchen-v3.jpg',alt:'Illustrative kitchen with white cabinets, a hob and breakfast bar'},{src:'assets/bathroom-example.jpg',alt:'Illustrative modern bathroom'}].forEach((photo, index) => {
    if (index === 1 && home.image === photo.src) return;
    const image = document.createElement('img');
    image.src = photo.src; image.alt = photo.alt; images.append(image);
  });
  const link = document.getElementById('realHomesLink');
  link.href = `https://housinganywhere.com/s/${home.city}--Netherlands`;
  link.textContent = `Search live homes in ${home.city} ↗`;
  document.getElementById('homeDialog').showModal();
}));
document.querySelectorAll('[data-review-profile]').forEach(button => button.addEventListener('click', () => document.getElementById('profileDialog').showModal()));

document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  const id = link.getAttribute('href').slice(1);
  const target = document.getElementById(id);
  if (target && !target.closest('[hidden]')) {
    event.preventDefault();
    target.scrollIntoView({behavior:'smooth',block:'start'});
    history.replaceState(null, '', `#${id}`);
  }
}));
