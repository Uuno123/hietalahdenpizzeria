/*=====================
    TOGGLE-MENU
=======================*/

const overlay = document.getElementById('overlay');
const hamburger = document.querySelector('.hamburger');
const toggleMenu = document.getElementById('toggleMenu');

hamburger.addEventListener('click', () => {
    toggleMenu.classList.toggle('open');
    overlay.classList.toggle('open');
});

overlay.addEventListener('click', () => {
    toggleMenu.classList.remove('open');
    overlay.classList.remove('open');
});

/*=====================
    SCROLL ANIMATIONS
=======================*/

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.animate').forEach(el => observer.observe(el));

/*=====================
    PIZZA BUILDER
=======================*/

// Hinnat products.js:stä (BASE_PIZZA_PRICE, PB_SAUCE_EXTRA, PB_CHEESE_EXTRA, PB_TOPPING_PRICE)
const PB_INGREDIENTS = {
    sauces: [
        { id: 'tomaatti',    name: 'Tomaattikastike', price: 0,              c1: '#c0392b', c2: '#8e1a10' },
        { id: 'valkosipuli', name: 'Valkosipuli',     price: PB_SAUCE_EXTRA, c1: '#f0e08c', c2: '#c8b840' },
        { id: 'bbq',         name: 'BBQ-kastike',     price: PB_SAUCE_EXTRA, c1: '#7B3D1F', c2: '#4a200a' },
        { id: 'kerma',       name: 'Kermakastike',    price: PB_SAUCE_EXTRA, c1: '#fffbea', c2: '#e8d8a0' },
    ],
    cheeses: [
        { id: 'mozzarella', name: 'Mozzarella',  price: 0               },
        { id: 'feta',       name: 'Fetajuusto',  price: PB_CHEESE_EXTRA },
        { id: 'aura',       name: 'Aurajuusto',  price: PB_CHEESE_EXTRA },
        { id: 'tupla',      name: 'Tuplajuusto', price: PB_CHEESE_EXTRA },
    ],
    meats: [
        { id: 'kebab',        name: 'Kebab',        price: PB_TOPPING_PRICE },
        { id: 'kana',         name: 'Kana',         price: PB_TOPPING_PRICE },
        { id: 'pepperoni',    name: 'Pepperoni',    price: PB_TOPPING_PRICE },
        { id: 'pekoni',       name: 'Pekoni',       price: PB_TOPPING_PRICE },
        { id: 'pizzasuikale', name: 'Pizzasuikale', price: PB_TOPPING_PRICE },
        { id: 'jauheliha',    name: 'Jauheliha',    price: PB_TOPPING_PRICE },
        { id: 'salami',       name: 'Salami',       price: PB_TOPPING_PRICE },
    ],
    veggies: [
        { id: 'paprika',     name: 'Paprika',     price: PB_TOPPING_PRICE },
        { id: 'herkkusieni', name: 'Herkkusieni', price: PB_TOPPING_PRICE },
        { id: 'tomaatti_v',  name: 'Tomaatti',    price: PB_TOPPING_PRICE },
        { id: 'sipuli',      name: 'Sipuli',      price: PB_TOPPING_PRICE },
        { id: 'oliivi',      name: 'Oliivi',      price: PB_TOPPING_PRICE },
        { id: 'ananas',      name: 'Ananas',      price: PB_TOPPING_PRICE },
        { id: 'jalapeno',    name: 'Jalapeño',    price: PB_TOPPING_PRICE },
    ],
};

const PB_TABS = [
    { id: 'kastike', label: 'KASTIKE',  icon: 'fa-droplet',        key: 'sauces'  },
    { id: 'juusto',  label: 'JUUSTO',   icon: 'fa-cheese',         key: 'cheeses' },
    { id: 'liha',    label: 'LIHA',     icon: 'fa-drumstick-bite', key: 'meats'   },
    { id: 'kasvis',  label: 'KASVIS',   icon: 'fa-seedling',       key: 'veggies' },
];

const pbState = { sauce: 'tomaatti', cheeses: ['mozzarella'], toppings: [], tab: 'kastike', size: 'normal' };

function pbRng(seed) {
    let s = (seed ^ 0xdeadbeef) >>> 0;
    return () => {
        s = Math.imul(s ^ (s >>> 15), 0x2c1b3c6d) >>> 0;
        s = Math.imul(s ^ (s >>> 12), 0x297a2d39) >>> 0;
        return (s ^ (s >>> 15)) / 0xffffffff;
    };
}

function pbHash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    return Math.abs(h);
}

function pbPositions(id, count, maxR) {
    const rng = pbRng(pbHash(id));
    const out = [];
    let tries = 0;
    while (out.length < count && tries++ < 300) {
        const a = rng() * Math.PI * 2;
        const r = Math.sqrt(rng() * 0.78) * maxR;
        const x = Math.cos(a) * r, y = Math.sin(a) * r;
        if (!out.some(p => Math.hypot(p.x - x, p.y - y) < maxR * 0.23))
            out.push({ x, y, rot: rng() * Math.PI * 2 });
    }
    return out;
}

function pbDrawTopping(ctx, id, x, y, rot, r) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    switch (id) {
        case 'pepperoni': case 'salami':
            ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI*2);
            ctx.fillStyle = id==='pepperoni' ? '#cc2200' : '#a82020'; ctx.fill();
            ctx.beginPath(); ctx.arc(r*.32,-r*.28,r*.22,0,Math.PI*2); ctx.fillStyle='rgba(60,0,0,.4)'; ctx.fill();
            ctx.beginPath(); ctx.arc(-r*.2,r*.3,r*.17,0,Math.PI*2); ctx.fillStyle='rgba(60,0,0,.4)'; ctx.fill();
            break;
        case 'kebab': case 'jauheliha':
            ctx.beginPath(); ctx.ellipse(0,0,r*1.35,r*.7,0,0,Math.PI*2);
            ctx.fillStyle = id==='kebab' ? '#9a6010' : '#8B4513'; ctx.fill();
            ctx.strokeStyle='rgba(0,0,0,.25)'; ctx.lineWidth=1;
            ctx.beginPath(); ctx.moveTo(-r,0); ctx.lineTo(r,0); ctx.stroke();
            break;
        case 'kana': case 'pizzasuikale':
            ctx.beginPath(); ctx.ellipse(0,0,r*1.25,r*.75,0,0,Math.PI*2);
            ctx.fillStyle = id==='kana' ? '#F5DEB3' : '#e0b878'; ctx.fill();
            ctx.strokeStyle='rgba(140,90,40,.35)'; ctx.lineWidth=1; ctx.stroke();
            break;
        case 'pekoni':
            ctx.beginPath(); ctx.rect(-r*1.4,-r*.45,r*2.8,r*.9);
            ctx.fillStyle='#f4a0a0'; ctx.fill();
            ctx.beginPath(); ctx.rect(-r*1.4,-r*.12,r*2.8,r*.24);
            ctx.fillStyle='#c84040'; ctx.fill();
            break;
        case 'paprika':
            ctx.beginPath(); ctx.arc(0,0,r*1.1,0,Math.PI); ctx.arc(0,0,r*.5,Math.PI,0,true); ctx.closePath();
            ctx.fillStyle=['#e74c3c','#27ae60','#f39c12','#2980b9'][pbHash(id+Math.round(x))%4]; ctx.fill();
            break;
        case 'herkkusieni':
            ctx.beginPath(); ctx.arc(0,-r*.25,r,0,Math.PI); ctx.fillStyle='#a07860'; ctx.fill();
            ctx.beginPath(); ctx.rect(-r*.3,-r*.25,r*.6,r*.9); ctx.fillStyle='#c8a882'; ctx.fill();
            break;
        case 'ananas':
            ctx.beginPath(); ctx.moveTo(0,-r*1.1); ctx.lineTo(r*.85,r*.65); ctx.lineTo(-r*.85,r*.65); ctx.closePath();
            ctx.fillStyle='#ffdb4d'; ctx.fill(); ctx.strokeStyle='#cc9900'; ctx.lineWidth=1; ctx.stroke();
            break;
        case 'oliivi':
            ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fillStyle='#2c4a2c'; ctx.fill();
            ctx.beginPath(); ctx.arc(0,0,r*.42,0,Math.PI*2); ctx.fillStyle='#c8a870'; ctx.fill();
            break;
        case 'sipuli':
            ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2);
            ctx.strokeStyle='#9b59b6'; ctx.lineWidth=r*.65; ctx.stroke();
            break;
        case 'jalapeno':
            ctx.beginPath(); ctx.ellipse(0,0,r*1.3,r*.6,0,0,Math.PI*2); ctx.fillStyle='#27ae60'; ctx.fill();
            ctx.beginPath(); ctx.arc(0,0,r*.28,0,Math.PI*2); ctx.fillStyle='#e8f0a0'; ctx.fill();
            break;
        case 'tomaatti_v':
            ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fillStyle='#e74c3c'; ctx.fill();
            break;
        default:
            ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fillStyle='#888'; ctx.fill();
    }
    ctx.restore();
}

function pbDrawCheese(ctx, id, cx, cy, sR) {
    const pal = { mozzarella:['#fffde0','#fff8c0','#fffef5'], feta:['#fff','#f8f8f8','#f0f0f0'],
                  aura:['#dde4ff','#c8d2f8','#b8c4f0'], tupla:['#ffee88','#ffe044','#fff4aa'] };
    const p = pal[id] || pal.mozzarella;
    const rng = pbRng(pbHash(id)*7);
    for (let i = 0; i < (id==='tupla'?14:9); i++) {
        const a=rng()*Math.PI*2, d=Math.sqrt(rng()*.72)*sR;
        ctx.beginPath(); ctx.arc(cx+Math.cos(a)*d,cy+Math.sin(a)*d,sR*(.1+rng()*.1),0,Math.PI*2);
        ctx.fillStyle=p[i%3]; ctx.globalAlpha=.82+rng()*.18; ctx.fill(); ctx.globalAlpha=1;
    }
}

function pbDraw() {
    const canvas = document.getElementById('homeCanvas');
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const size = canvas.clientWidth;
    if (canvas.width !== size*dpr) { canvas.width=size*dpr; canvas.height=size*dpr; }
    const ctx=canvas.getContext('2d'), w=canvas.width, cx=w/2, cy=w/2;
    const cR=w*.455, sR=cR*.865;
    ctx.clearRect(0,0,w,w);

    ctx.shadowColor='rgba(0,0,0,.5)'; ctx.shadowBlur=30*dpr; ctx.shadowOffsetY=8*dpr;
    const cG=ctx.createRadialGradient(cx-cR*.2,cy-cR*.2,cR*.05,cx,cy,cR);
    cG.addColorStop(0,'#e8a835'); cG.addColorStop(.65,'#d4903a'); cG.addColorStop(1,'#9e6020');
    ctx.beginPath(); ctx.arc(cx,cy,cR,0,Math.PI*2); ctx.fillStyle=cG; ctx.fill();
    ctx.shadowColor='transparent'; ctx.shadowBlur=0; ctx.shadowOffsetY=0;

    const bRng=pbRng(42);
    for(let i=0;i<22;i++){const a=(i/22)*Math.PI*2+bRng()*.22,r=cR*(.895+bRng()*.065),br=cR*(.022+bRng()*.022);ctx.beginPath();ctx.arc(cx+Math.cos(a)*r,cy+Math.sin(a)*r,br,0,Math.PI*2);ctx.fillStyle=`rgba(120,70,20,${.25+bRng()*.3})`;ctx.fill();}

    const sauce=PB_INGREDIENTS.sauces.find(s=>s.id===pbState.sauce)||PB_INGREDIENTS.sauces[0];
    const sG=ctx.createRadialGradient(cx-sR*.25,cy-sR*.25,sR*.05,cx,cy,sR);
    sG.addColorStop(0,sauce.c1); sG.addColorStop(1,sauce.c2);
    ctx.beginPath(); ctx.arc(cx,cy,sR,0,Math.PI*2); ctx.fillStyle=sG; ctx.fill();

    pbState.cheeses.forEach(id=>pbDrawCheese(ctx,id,cx,cy,sR));
    const tR=sR*.092;
    pbState.toppings.forEach(id=>pbPositions(id,7,sR*.83).forEach(p=>pbDrawTopping(ctx,id,cx+p.x,cy+p.y,p.rot,tR)));
}

function pbCalcPrice() {
    let p = BASE_PIZZA_PRICE + (pbState.size === 'perhe' ? PB_FAMILY_EXTRA : 0);
    const all=[...PB_INGREDIENTS.sauces,...PB_INGREDIENTS.cheeses,...PB_INGREDIENTS.meats,...PB_INGREDIENTS.veggies];
    [pbState.sauce,...pbState.cheeses,...pbState.toppings].forEach(id=>{const i=all.find(x=>x.id===id);if(i)p+=i.price;});
    return p;
}

function pbGetName(id) {
    return [...PB_INGREDIENTS.sauces,...PB_INGREDIENTS.cheeses,...PB_INGREDIENTS.meats,...PB_INGREDIENTS.veggies].find(x=>x.id===id)?.name??id;
}

const CART_KEY = 'hietalahdenpizzeria_cart';

function cartLoadIndex() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
}

function cartSaveIndex(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function cartUpdateBadge() {
    const badge = document.getElementById('cartCount');
    if (!badge) return;
    const count = cartLoadIndex().reduce((s, i) => s + i.qty, 0);
    badge.textContent = count;
    badge.classList.toggle('visible', count > 0);
}

function pbRenderChips() {
    const el=document.getElementById('homeChips'); if(!el) return;
    el.innerHTML='';
    const add=(text,cls,rd)=>{
        const c=document.createElement('div'); c.className=`sb-chip ${cls}`;
        c.innerHTML=rd?`${text} <span class="sb-chip-remove" data-id="${rd.id}" data-type="${rd.type}">×</span>`:text;
        el.appendChild(c);
    };
    add(pbState.size === 'perhe' ? 'Perhepizza' : 'Normal', 'sb-chip-sauce', null);
    add(pbGetName(pbState.sauce),'sb-chip-sauce',null);
    pbState.cheeses.forEach(id=>add(pbGetName(id),'sb-chip-cheese',{id,type:'cheese'}));
    pbState.toppings.forEach(id=>add(pbGetName(id),'sb-chip-topping',{id,type:'topping'}));
    el.querySelectorAll('.sb-chip-remove').forEach(btn=>btn.addEventListener('click',e=>{
        const{id,type}=e.target.dataset;
        if(type==='cheese') pbState.cheeses=pbState.cheeses.filter(c=>c!==id);
        else pbState.toppings=pbState.toppings.filter(t=>t!==id);
        pbRenderAll(); pbRenderPanel();
    }));
}

function pbIsSel(id,type) {
    if(type==='sauce') return pbState.sauce===id;
    if(type==='cheese') return pbState.cheeses.includes(id);
    return pbState.toppings.includes(id);
}

function pbFmtPrice(p) { return p===0?'sis.':'+'+p.toFixed(2).replace('.',',')+'€'; }

function pbRenderAll() {
    pbDraw();
    const pEl=document.getElementById('homePrice');
    if(pEl) pEl.textContent=pbCalcPrice().toFixed(2).replace('.',',') + ' €';
    pbRenderChips();
}

function pbRenderPanel() {
    const panel=document.getElementById('homePanel'); if(!panel) return;
    const tab=PB_TABS.find(t=>t.id===pbState.tab)||PB_TABS[0];
    const items=PB_INGREDIENTS[tab.key].map(item=>({...item,type:tab.id==='kastike'?'sauce':tab.id==='juusto'?'cheese':'topping'}));

    panel.innerHTML=`
        <div class="sb-size-section">
            <p class="sb-size-label">KOKO</p>
            <div class="sb-size-toggle">
                <button class="sb-size-btn${pbState.size==='normal'?' active':''}" data-size="normal">
                    Normal
                </button>
                <button class="sb-size-btn${pbState.size==='perhe'?' active':''}" data-size="perhe">
                    Perhepizza <span class="sb-size-extra">+${PB_FAMILY_EXTRA.toFixed(2).replace('.',',')} €</span>
                </button>
            </div>
        </div>
        <div class="sb-tabs">
            ${PB_TABS.map(t=>`<button class="sb-tab-btn${pbState.tab===t.id?' active':''}" data-tab="${t.id}">
                <i class="fa-solid ${t.icon}"></i><span>${t.label}</span></button>`).join('')}
        </div>
        <div class="sb-ing-grid">
            ${items.map(item=>`<button class="sb-ing-btn${pbIsSel(item.id,item.type)?' active':''}" data-id="${item.id}" data-type="${item.type}">
                <i class="sb-ing-icon fa-solid ${pbIsSel(item.id,item.type)?'fa-check':'fa-plus'}"></i>
                <span class="sb-ing-name">${item.name}</span>
                <span class="sb-ing-price">${pbFmtPrice(item.price)}</span></button>`).join('')}
        </div>`;

    panel.querySelectorAll('.sb-size-btn').forEach(btn=>btn.addEventListener('click',()=>{pbState.size=btn.dataset.size;pbRenderAll();pbRenderPanel();}));
    panel.querySelectorAll('.sb-tab-btn').forEach(btn=>btn.addEventListener('click',()=>{pbState.tab=btn.dataset.tab;pbRenderPanel();}));
    panel.querySelectorAll('.sb-ing-btn').forEach(btn=>btn.addEventListener('click',()=>{
        const{id,type}=btn.dataset;
        if(type==='sauce') pbState.sauce=id;
        else if(type==='cheese') pbState.cheeses.includes(id)?pbState.cheeses=pbState.cheeses.filter(c=>c!==id):pbState.cheeses.push(id);
        else pbState.toppings.includes(id)?pbState.toppings=pbState.toppings.filter(t=>t!==id):pbState.toppings.push(id);
        pbRenderAll(); pbRenderPanel();
    }));
}

function pbAddToCart() {
    const cheeses = pbState.cheeses.map(pbGetName).join(', ');
    const tops    = pbState.toppings.map(pbGetName).join(', ');
    const parts   = [pbGetName(pbState.sauce), cheeses, tops].filter(Boolean);

    const item = {
        id:          Date.now().toString(),
        name:        'Oma pizza',
        description: parts.join(', '),
        price:       pbCalcPrice(),
        qty:         1
    };

    const cart = cartLoadIndex();
    cart.push(item);
    cartSaveIndex(cart);
    cartUpdateBadge();

    const btn = document.getElementById('homeCartBtn'); if (!btn) return;
    btn.classList.add('added');
    btn.innerHTML = '<i class="fa-solid fa-check"></i> LISÄTTY OSTOSKORIIN';
    setTimeout(() => {
        btn.classList.remove('added');
        btn.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> LISÄÄ OSTOSKORIIN';
    }, 2000);
}

function pbSizeCanvas() {
    const canvas=document.getElementById('homeCanvas'); if(!canvas) return;
    const w = window.innerWidth;
    let size;
    if (w >= 1750) size = 520;
    else if (w >= 1400) size = 440;
    else if (w >= 900) size = 380;
    else if (w >= 600) size = Math.min(260, Math.floor((w - 60) / 2));
    else size = Math.min(280, w - 32);
    canvas.style.width=size+'px'; canvas.style.height=size+'px';
}

window.addEventListener('load',()=>{
    cartUpdateBadge();
    if(!document.getElementById('homeCanvas')) return;
    pbSizeCanvas(); pbRenderPanel(); pbRenderAll();
    document.getElementById('homeCartBtn')?.addEventListener('click', pbAddToCart);
    window.addEventListener('resize',()=>{pbSizeCanvas();pbRenderAll();});
});

/*=====================
    PIZZA SLIDESHOW
=======================*/

const pizzas = [
    { src: 'https://imageproxy.wolt.com/assets/68f9db4ccd0321dabf32d784?w=600', alt: 'Hietalahti Special' },
    { src: 'https://imageproxy.wolt.com/assets/68f9da2fcd0321dabf32d724?w=600', alt: 'Mexicana' },
    { src: 'https://imageproxy.wolt.com/assets/68f9db8acd0321dabf32d78e?w=600', alt: 'Hot Pizza' },
    { src: 'https://imageproxy.wolt.com/assets/68f9db0152f5fcdd085a899f?w=600', alt: 'Kebabpizza' },
    { src: 'https://imageproxy.wolt.com/assets/68f9da9952f5fcdd085a8989?w=600', alt: 'Alla Pollo' },
    { src: 'https://imageproxy.wolt.com/assets/68f9db1652f5fcdd085a89a6?w=600', alt: 'Diavola' },
    { src: 'https://imageproxy.wolt.com/assets/68f9da29cd0321dabf32d723?w=600', alt: 'Capricciosa' },
    { src: 'https://imageproxy.wolt.com/assets/68f9db3fcd0321dabf32d781?w=600', alt: 'Pekonipizza' },
];

let pizzaIndex = 0;
const container = document.getElementById('section2Imgs');

if (container) {
    setInterval(() => {
        pizzaIndex = (pizzaIndex + 1) % pizzas.length;
        const current = container.querySelector('.section2-img');

        const next = document.createElement('div');
        next.className = 'section2-img';
        next.innerHTML = `<img src="${pizzas[pizzaIndex].src}" alt="${pizzas[pizzaIndex].alt}">`;
        container.appendChild(next);
        next.getBoundingClientRect();
        next.classList.add('s2-entering');

        current.classList.add('s2-leaving');
        setTimeout(() => current.remove(), 500);
    }, 4000);
}

