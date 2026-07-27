import { nanoid } from "nanoid";

const app = document.getElementById('app');

/* Simple in-browser "DB" using localStorage.
   Keeps all features portable and non-destructive.
   This preserves any existing data and augments it.
*/
const DB_KEY = 'lecoinbrico_db_v1';

function defaultData(){
  return {
    meta: { created_at: Date.now() },
    categories: [
      { id: 'c1', name: 'Outillage', slug:'outillage', description:'Outils électriques et manuels', image:'assets/outillage.jpg'},
      { id: 'c2', name: 'Quincaillerie', slug:'quincaillerie', description:'Fixations, ferrures et quincaillerie', image:'assets/quincaillerie.jpg'},
      { id: 'c3', name: 'Coffres-forts', slug:'coffres-forts', description:'Sécurité et protection', image:'assets/coffres.jpg'}
    ],
    products: [
      { id:'p-'+nanoid(6), name:'Perceuse sans fil 18V', slug:'perceuse-18v', description:'Perceuse performante pour bricolage et usage professionnel.', images:['assets/perceuse1.jpg','assets/perceuse2.jpg'], price:14500, category:'c1', stock:24, brand:'Makita', views:120, created_at:Date.now()-1000*60*60*24*10},
      { id:'p-'+nanoid(6), name:'Coffre-fort 40L', slug:'coffre-40l', description:'Coffre-fort robuste avec serrure électronique.', images:['assets/coffre1.jpg','assets/coffre2.jpg'], price:32000, category:'c3', stock:5, brand:'SecurePro', views:88, created_at:Date.now()-1000*60*60*24*20}
    ],
    orders: [],
    users: [],
    settings: {
      admin_pass: 'admin123', // in real deploy, replace with secure auth
      currency: 'DZD',
      shipping: { wilaya_rates: {}, base: 500, per_km: 0 }
    }
  };
}

function loadDB(){
  const raw = localStorage.getItem(DB_KEY);
  if(!raw) {
    const d = defaultData();
    localStorage.setItem(DB_KEY, JSON.stringify(d));
    return d;
  }
  try {
    return JSON.parse(raw);
  } catch(e){
    const d = defaultData();
    localStorage.setItem(DB_KEY, JSON.stringify(d));
    return d;
  }
}
function saveDB(db){ localStorage.setItem(DB_KEY, JSON.stringify(db)); }

const DB = loadDB();

/* Utilities */
function formatPrice(n){ return new Intl.NumberFormat('fr-FR').format(n) + ' ' + DB.settings.currency; }
function el(tag, props={}, ...children){
  const node = document.createElement(tag);
  for(const k in props){
    if(k.startsWith('on') && typeof props[k] === 'function') node.addEventListener(k.slice(2).toLowerCase(), props[k]);
    else if(k==='html') node.innerHTML = props[k];
    else node.setAttribute(k, props[k]);
  }
  for(const c of children) if(c) node.appendChild(typeof c==='string' ? document.createTextNode(c) : c);
  return node;
}

/* Routing */
const ROUTES = {};
let currentRoute = '';

function registerRoute(name, fn){ ROUTES[name]=fn; }

function navigate(route, opts={}){
  if(typeof ROUTES[route]==='function'){
    currentRoute=route;
    ROUTES[route](opts);
    window.scrollTo({top:0,behavior:'smooth'});
  }
}

/* Header & Footer rendering (preserve existing components if present) */
function renderShell(){
  app.innerHTML = '';
  const headerT = document.getElementById('header-template');
  app.appendChild(headerT.content.cloneNode(true));
  const container = el('main',{class:'container', id:'container'});
  app.appendChild(container);
  const footerT = document.getElementById('footer-template');
  app.appendChild(footerT.content.cloneNode(true));

  document.getElementById('year').textContent = new Date().getFullYear();

  // populate categories select
  const catSelect = document.getElementById('category-select');
  DB.categories.forEach(c => {
    const o = el('option',{value:c.id}, c.name);
    catSelect.appendChild(o);
  });

  // wire nav links
  document.querySelectorAll('[data-route]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const r = a.getAttribute('data-route');
      navigate(r);
    });
  });

  document.getElementById('search-btn').addEventListener('click', ()=>{
    const q = document.getElementById('search-input').value.trim();
    const cat = document.getElementById('category-select').value;
    navigate('search',{q,cat});
  });

  document.getElementById('search-input').addEventListener('keydown', (e)=>{
    if(e.key==='Enter') document.getElementById('search-btn').click();
  });

  document.getElementById('cart-btn').addEventListener('click', ()=> navigate('cart'));
  document.getElementById('account-btn').addEventListener('click', ()=> navigate('account'));
}

/* Components */
function renderHome(){
  const container = document.getElementById('container');
  container.innerHTML = '';

  const hero = el('section',{class:'hero'});
  const banner = el('div',{class:'banner', id:'hero-carousel'});
  banner.innerHTML = `<div style="padding:22px;text-align:left;max-width:560px;">
    <h1 style="margin:0;font-size:20px">Le Coin Brico</h1>
    <p style="margin:6px 0 12px;color:var(--muted)">La puissance entre vos mains — Outils et quincaillerie pour particuliers et professionnels en Algérie.</p>
    <div><button class="btn-primary" id="cta-shop">Voir nos catégories</button></div>
  </div>`;
  const cards = el('div',{class:'cards'});
  cards.appendChild(el('div',{class:'adv-card'}, el('div',{},'🚚'), el('div',{}, el('div',{class:'title'},"Livraison Algérie"), el('div',{class:'muted'}, "Partout en Algérie"))));
  cards.appendChild(el('div',{class:'adv-card'}, el('div',{},'🔒'), el('div',{}, el('div',{class:'title'},"Paiement sécurisé"), el('div',{class:'muted'}, "CIB, Edahabia, Livraison"))));
  cards.appendChild(el('div',{class:'adv-card'}, el('div',{},'⭐'), el('div',{}, el('div',{class:'title'},"Produits garantis"), el('div',{class:'muted'},"Qualité & SAV"))));

  hero.appendChild(banner);
  hero.appendChild(cards);

  container.appendChild(hero);

  // categories showcase
  const csec = el('section',{});
  csec.appendChild(el('h2',{},'Nos catégories principales'));
  const catGrid = el('div',{class:'categories'});
  DB.categories.forEach(c=>{
    const card = el('div',{class:'cat-card', onclick:()=> navigate('category',{id:c.id})});
    const img = el('img',{src:c.image, alt:c.name});
    card.appendChild(img);
    card.appendChild(el('div',{class:'cat-name'},c.name));
    card.appendChild(el('div',{class:'muted small'},c.description));
    catGrid.appendChild(card);
  });
  csec.appendChild(catGrid);
  container.appendChild(csec);

  // recently added & most viewed
  const row = el('div',{style':'display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px'});
  const recent = el('div',{}, el('h3',{},'Produits récemment ajoutés'), productGrid({filter:(p)=>true, sort:'new'}));
  const popular = el('div',{}, el('h3',{},'Les plus consultés'), productGrid({filter:(p)=>true, sort:'popular'}));
  row.appendChild(recent);
  row.appendChild(popular);
  container.appendChild(row);

  // how it works
  const how = el('section',{}, el('h3',{},'Comment ça marche ?'));
  const steps = el('div',{style':'display:flex;gap:12px;flex-wrap:wrap;margin-top:8px'});
  const s1 = el('div',{class:'adv-card'}, el('div',{},'1'), el('div',{},el('strong',{},'Choisissez'), el('div',{class:'muted small'},'Parcourez nos catégories')));
  const s2 = el('div',{class:'adv-card'}, el('div',{},'2'), el('div',{},el('strong',{},'Commandez'), el('div',{class:'muted small'},'Formulaire simple sur chaque produit')));
  const s3 = el('div',{class:'adv-card'}, el('div',{},'3'), el('div',{},el('strong',{},'Recevez'), el('div',{class:'muted small'},'Livraison partout en Algérie')));
  steps.appendChild(s1);steps.appendChild(s2);steps.appendChild(s3);
  how.appendChild(steps);
  container.appendChild(how);

  document.getElementById('cta-shop').addEventListener('click', ()=> navigate('categories'));
}

function productGrid({filter=(()=>true), sort=null, limit=8} = {}){
  const grid = el('div',{class:'grid'});
  let items = DB.products.slice();
  if(filter) items = items.filter(filter);
  if(sort==='new') items.sort((a,b)=>b.created_at - a.created_at);
  if(sort==='popular') items.sort((a,b)=>b.views - a.views);
  items.slice(0,limit).forEach(p=>{
    const card = el('div',{class:'product'});
    const img = el('img',{src:p.images[0] || 'assets/no-image.png', alt:p.name, onclick:()=> navigate('product',{id:p.id})});
    card.appendChild(img);
    card.appendChild(el('div',{class:'title'},p.name));
    card.appendChild(el('div',{class:'muted small'}, p.brand || ''));
    card.appendChild(el('div',{class:'price'}, formatPrice(p.price)));
    card.appendChild(el('div',{}, el('div',{class:'muted small'}, p.stock>0 ? 'En stock':'Rupture de stock')));
    const btn = el('button',{class:'btn-primary', onclick:()=> navigate('product',{id:p.id})}, 'Voir le produit');
    card.appendChild(btn);
    grid.appendChild(card);
  });
  return grid;
}

/* Category page */
registerRoute('category', ({id})=>{
  const container = document.getElementById('container');
  container.innerHTML = '';
  const cat = DB.categories.find(c=>c.id===id);
  if(!cat) { container.appendChild(el('div',{},'Catégorie introuvable.')); return; }
  container.appendChild(el('h2',{},cat.name));
  container.appendChild(el('p',{},cat.description));

  // filters and search
  const bar = el('div',{style':'display:flex;gap:8px;align-items:center'});
  const q = el('input',{class:'input', placeholder:'Rechercher dans cette catégorie'});
  const priceMin = el('input',{class:'input', placeholder:'Prix min', type:'number'});
  const priceMax = el('input',{class:'input', placeholder:'Prix max', type:'number'});
  const avail = el('select',{class:'input'});
  avail.innerHTML = '<option value="">Disponibilité</option><option value="in">En stock</option><option value="out">Rupture</option>';
  const apply = el('button',{class:'btn-primary'},'Filtrer');
  bar.appendChild(q);bar.appendChild(priceMin);bar.appendChild(priceMax);bar.appendChild(avail);bar.appendChild(apply);
  container.appendChild(bar);

  const gridWrap = el('div',{id:'category-grid'});
  container.appendChild(gridWrap);

  function refresh(){
    const qv=q.value.trim().toLowerCase();
    const min=Number(priceMin.value)||0; const max=Number(priceMax.value)||Infinity;
    const av=avail.value;
    const filtered = DB.products.filter(p=>{
      if(p.category!==cat.id) return false;
      if(qv && !(p.name.toLowerCase().includes(qv) || (p.brand||'').toLowerCase().includes(qv))) return false;
      if(p.price < min || p.price > max) return false;
      if(av==='in' && p.stock<=0) return false;
      if(av==='out' && p.stock>0) return false;
      return true;
    });
    gridWrap.innerHTML = '';
    const grid = el('div',{class:'grid'});
    filtered.forEach(p=>{
      const card = el('div',{class:'product'});
      card.appendChild(el('img',{src:p.images[0]}));
      card.appendChild(el('div',{class:'title'},p.name));
      card.appendChild(el('div',{class:'price'},formatPrice(p.price)));
      card.appendChild(el('div',{class:'muted small'}, p.stock>0 ? 'En stock' : 'Rupture'));
      card.appendChild(el('button',{class:'btn-primary', onclick:()=> navigate('product',{id:p.id})}, 'Voir le produit'));
      grid.appendChild(card);
    });
    gridWrap.appendChild(grid);
  }
  apply.addEventListener('click', refresh);
  refresh();
});

/* All products */
registerRoute('all-products', ()=>{
  const container = document.getElementById('container');
  container.innerHTML = '';
  container.appendChild(el('h2',{},'Tous les produits'));
  container.appendChild(productGrid({filter:()=>true, limit:50}));
});

/* Product page with large gallery, zoom and order form */
registerRoute('product', ({id})=>{
  const container = document.getElementById('container');
  const p = DB.products.find(x=>x.id===id);
  if(!p) { container.innerHTML = ''; container.appendChild(el('div',{},'Produit introuvable')); return; }

  // increment views
  p.views = (p.views||0)+1;
  saveDB(DB);

  container.innerHTML = '';
  const wrap = el('div',{class:'product-page'});
  const left = el('div',{class:'gallery'});
  const mainImg = el('div',{class:'main'});
  const imgEl = el('img',{src:p.images[0], style:'width:100%;height:100%;object-fit:contain'});
  mainImg.appendChild(imgEl);
  left.appendChild(mainImg);
  const thumbs = el('div',{class:'thumbs'});
  p.images.forEach(src=>{
    const t = el('img',{src, style:'height:64px;width:64px;object-fit:cover;border-radius:6px;cursor:pointer'});
    t.addEventListener('click', ()=> imgEl.src = src);
    thumbs.appendChild(t);
  });
  left.appendChild(thumbs);

  const right = el('div',{}, el('h2',{},p.name), el('div',{class:'muted small'},p.brand||''), el('div',{class:'price'},formatPrice(p.price)), el('p',{},p.description));
  right.appendChild(el('div',{class:'muted small'}, 'Disponibilité: ' + (p.stock>0 ? `En stock (${p.stock})` : 'Rupture de stock')));

  // order form
  const form = el('form',{style:'margin-top:12px'});
  const fields = el('div',{class:'form-row'});
  const first = el('input',{class:'input', placeholder:'Prénom', name:'first', required:true});
  const last = el('input',{class:'input', placeholder:'Nom', name:'last', required:true});
  const phone = el('input',{class:'input', placeholder:'Téléphone', name:'phone', required:true});
  const wilaya = el('input',{class:'input', placeholder:'Wilaya', name:'wilaya', required:true});
  const commune = el('input',{class:'input', placeholder:'Commune', name:'commune', required:true});
  const address = el('input',{class:'input', placeholder:'Adresse complète', name:'address', required:true});
  const qty = el('input',{class:'input', type:'number', name:'qty', value:1, min:1, max: p.stock>0?p.stock:1});
  const remark = el('input',{class:'input', placeholder:'Remarque (optionnel)', name:'remark'});
  fields.append(first,last,phone,wilaya,commune,address,qty,remark);
  form.appendChild(fields);

  // price calc
  const totalLine = el('div',{}, el('strong',{}, 'Total: '), el('span',{id:'order-total'}, formatPrice(p.price)));
  form.appendChild(totalLine);

  // payment methods
  const payments = el('div',{style:'margin-top:8px'}, el('div',{class:'muted small'},'Modes de paiement:'), el('div',{},'• Paiement à la livraison • CIB • Edahabia'));
  form.appendChild(payments);

  const orderBtn = el('button',{class:'btn-primary', type:'submit'}, 'Commander maintenant');
  form.appendChild(orderBtn);
  right.appendChild(form);

  wrap.appendChild(left);
  wrap.appendChild(right);
  container.appendChild(wrap);

  // dynamic price
  qty.addEventListener('input', ()=> {
    const qv = Math.max(1, Number(qty.value)||1);
    document.getElementById('order-total').textContent = formatPrice(p.price * qv);
  });

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = new FormData(form);
    const order = {
      id: 'o-'+nanoid(8),
      product_id: p.id,
      product_snapshot: {id:p.id, name:p.name, price:p.price, images:p.images.slice(0,1)},
      customer: {
        first: data.get('first'),
        last: data.get('last'),
        phone: data.get('phone'),
        wilaya: data.get('wilaya'),
        commune: data.get('commune'),
        address: data.get('address'),
      },
      qty: Number(data.get('qty')||1),
      remark: data.get('remark'),
      total: p.price * Number(data.get('qty')||1),
      payment: 'COD', // default; extendable
      status: 'pending',
      created_at: Date.now()
    };
    DB.orders.push(order);
    // decrement stock safely
    p.stock = Math.max(0, p.stock - order.qty);
    saveDB(DB);
    alert('Commande enregistrée. ID : ' + order.id + '\nNous vous contacterons bientôt pour confirmation.');
    navigate('account');
  });
});

/* Search */
registerRoute('search', ({q,cat} = {})=>{
  const container = document.getElementById('container');
  container.innerHTML = '';
  container.appendChild(el('h2',{},'Résultats de recherche'));

  const results = DB.products.filter(p=>{
    if(q && !((p.name||'').toLowerCase().includes(q.toLowerCase()) || (p.brand||'').toLowerCase().includes(q.toLowerCase()))) return false;
    if(cat && cat!=='') return p.category===cat;
    return true;
  });
  container.appendChild(el('div',{}, `${results.length} résultat(s)`));
  container.appendChild(el('div',{}, productGrid({filter:(p)=> results.includes(p), limit:100})));
});

/* Cart and Account pages (basic) */
registerRoute('cart', ()=>{
  const container = document.getElementById('container'); container.innerHTML = '';
  container.appendChild(el('h2',{},'Panier'));
  container.appendChild(el('p',{},'Panier simplifié — La commande se fait depuis la fiche produit.'));
  container.appendChild(el('div',{}, 'Panier actif non implémenté (préservation des fonctionnalités existantes).'));
});

registerRoute('account', ()=>{
  const container = document.getElementById('container'); container.innerHTML = '';
  container.appendChild(el('h2',{},'Mon compte'));
  container.appendChild(el('p',{},'Historique des commandes :'));
  if(!DB.orders.length) container.appendChild(el('div',{},'Aucune commande trouvée'));
  else {
    const list = el('div',{});
    DB.orders.slice().reverse().forEach(o=>{
      const p = el('div',{style:'background:#fff;padding:10px;margin-bottom:8px;border-radius:8px;box-shadow:var(--card-shadow)'});
      p.appendChild(el('div',{}, el('strong',{}, o.id), ' — ', o.product_snapshot.name));
      p.appendChild(el('div',{}, 'Quantité: '+o.qty+' — Total: '+formatPrice(o.total)));
      p.appendChild(el('div',{}, 'Statut: '+o.status));
      list.appendChild(p);
    });
    container.appendChild(list);
  }
});

/* Static pages */
['contact','about','faq','terms','privacy','categories'].forEach(k=>{
  registerRoute(k, ()=>{
    const container = document.getElementById('container'); container.innerHTML = '';
    container.appendChild(el('h2',{}, k==='categories' ? 'Catégories' : k.charAt(0).toUpperCase()+k.slice(1)));
    if(k==='categories'){
      const grid = el('div',{class:'categories'});
      DB.categories.forEach(c=>{
        const card = el('div',{class:'cat-card', onclick:()=> navigate('category',{id:c.id})});
        card.appendChild(el('img',{src:c.image}));
        card.appendChild(el('div',{}, c.name));
        card.appendChild(el('div',{class:'muted small'}, c.description));
        grid.appendChild(card);
      });
      container.appendChild(grid);
    } else {
      container.appendChild(el('p',{}, 'Contenu ' + k + ' — à personnaliser dans le panneau d\'administration.'));
    }
  });
});

/* Admin dashboard (protected) */
registerRoute('admin', ()=>{
  const pass = prompt('Mot de passe administrateur :');
  if(pass !== DB.settings.admin_pass){
    alert('Accès refusé');
    return;
  }
  const container = document.getElementById('container'); container.innerHTML = '';
  container.appendChild(el('h2',{},'Tableau de bord administrateur'));
  const stats = el('div',{style:'display:flex;gap:12px;flex-wrap:wrap'});
  stats.appendChild(el('div',{class:'adv-card'}, el('div',{},'Produits'), el('div',{}, DB.products.length)));
  stats.appendChild(el('div',{class:'adv-card'}, el('div',{},'Commandes'), el('div',{}, DB.orders.length)));
  stats.appendChild(el('div',{class:'adv-card'}, el('div',{},'Clients'), el('div',{}, DB.users.length)));
  container.appendChild(stats);

  // management panels
  const panels = el('div',{style:'margin-top:12px'});
  const prodPanel = el('div',{}, el('h3',{},'Gérer les produits'));
  const prodList = el('div',{});
  DB.products.forEach(p=>{
    const row = el('div',{style:'display:flex;gap:8px;align-items:center;margin-bottom:8px;padding:8px;background:#fff;border-radius:8px;box-shadow:var(--card-shadow)'});
    row.appendChild(el('img',{src:p.images[0], style:'width:64px;height:64px;object-fit:cover;border-radius:6px'}));
    row.appendChild(el('div',{}, el('div',{},p.name), el('div',{class:'muted small'}, p.brand)));
    const edit = el('button',{class:'btn-primary', style:'margin-left:auto'}, 'Éditer');
    edit.addEventListener('click', ()=> editProduct(p.id));
    row.appendChild(edit);
    prodList.appendChild(row);
  });
  prodPanel.appendChild(prodList);
  panels.appendChild(prodPanel);
  container.appendChild(panels);
});

/* Product edit (admin) - improves existing product management instead of replacing */
function editProduct(id){
  const p = DB.products.find(x=>x.id===id);
  if(!p) return alert('Produit introuvable');
  const modal = el('div',{style:'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000'});
  const card = el('div',{style:'width:680px;background:#fff;padding:16px;border-radius:12px;max-height:90vh;overflow:auto'});
  card.appendChild(el('h3',{},'Éditer le produit'));
  const form = el('form',{});
  form.appendChild(el('label',{},'Nom'));
  const name = el('input',{class:'input', value:p.name, required:true});
  form.appendChild(name);
  form.appendChild(el('label',{},'Prix'));
  const price = el('input',{class:'input', type:'number', value:p.price});
  form.appendChild(price);
  form.appendChild(el('label',{},'Stock'));
  const stock = el('input',{class:'input', type:'number', value:p.stock});
  form.appendChild(stock);
  form.appendChild(el('label',{},'Description'));
  const desc = el('textarea',{class:'input', style:'min-height:120px'}, p.description);
  form.appendChild(desc);
  form.appendChild(el('label',{},'Marque'));
  const brand = el('input',{class:'input', value:p.brand||''});
  form.appendChild(brand);

  const save = el('button',{class:'btn-primary', type:'submit'}, 'Enregistrer');
  const cancel = el('button',{type:'button', style:'margin-left:8px'}, 'Annuler');
  form.appendChild(el('div',{}, save, cancel));
  card.appendChild(form);
  modal.appendChild(card);
  document.body.appendChild(modal);

  cancel.addEventListener('click', ()=> modal.remove());
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    p.name = name.value.trim();
    p.price = Number(price.value)||p.price;
    p.stock = Number(stock.value)||p.stock;
    p.description = desc.value;
    p.brand = brand.value;
    saveDB(DB);
    modal.remove();
    alert('Produit mis à jour');
    navigate('admin');
  });
}

/* Initialize app */
renderShell();
navigate('home');

/* Expose some utilities for future extension while keeping security rules:
   - admin-only actions must require admin_pass validation in this demo.
   This preserves existing features and improves admin management.
*/
window.LCB = {
  db: DB,
  save: ()=> saveDB(DB),
  navigate,
  addProduct(product, admin_pass){
    if(admin_pass !== DB.settings.admin_pass) throw new Error('Unauthorized');
    product.id = 'p-'+nanoid(6);
    DB.products.push(product);
    saveDB(DB);
    return product;
  }
};