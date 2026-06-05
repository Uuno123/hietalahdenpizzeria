/* ── TOGGLE MENU ── */
const hamburger = document.querySelector('.hamburger');
const toggleMenu = document.getElementById('toggleMenu');
const overlay    = document.getElementById('overlay');

hamburger.addEventListener('click', () => {
    toggleMenu.classList.toggle('open');
    overlay.classList.toggle('open');
});
overlay.addEventListener('click', () => {
    toggleMenu.classList.remove('open');
    overlay.classList.remove('open');
});

/* ── SCROLL ANIMATIONS ── */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

function observeAnimated() {
    document.querySelectorAll('.animate:not(.visible)').forEach(el => observer.observe(el));
}

/* ── CART (localStorage) ── */
const CART_KEY = 'hietalahdenpizzeria_cart';

function cartLoad() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
}
function cartSave(items) { localStorage.setItem(CART_KEY, JSON.stringify(items)); }

function cartAddItem(name, description, price, qty, img) {
    const cart = cartLoad();
    const existing = cart.find(i => i.name === name && i.description === description);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ id: Date.now().toString(), name, description, price, qty, img: img || '' });
    }
    cartSave(cart);
    updateBadge();
}

function updateBadge() {
    const badge = document.getElementById('cartCount');
    if (!badge) return;
    const count = cartLoad().reduce((s, i) => s + i.qty, 0);
    badge.textContent = count;
    badge.classList.toggle('visible', count > 0);
}

/* ── BOTTOM SHEET ── */
const sheet        = document.getElementById('itemSheet');
const sheetOverlay = document.getElementById('sheetOverlay');
const sheetClose   = document.getElementById('sheetClose');

let sheetQty    = 1;
let sheetData   = null;
let sheetExtras = [];
let sheetGluten = false;
let sheetSize   = 'normal';

function initSizeToggle() {
    const label = document.getElementById('sizeExtraLabel');
    if (label) label.textContent = `+${PB_FAMILY_EXTRA.toFixed(2).replace('.', ',')} €`;

    document.querySelectorAll('.sheet-size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.sheet-size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            sheetSize = btn.dataset.size;
            updateSheetQty();
        });
    });
}

function renderExtras() {
    const list = document.getElementById('sheetExtrasList');
    if (!list) return;

    const priceNote = document.getElementById('extraPriceNote');
    if (priceNote) priceNote.textContent = `+${EXTRA_PRICE.toFixed(2).replace('.', ',')} € / kpl`;

    list.innerHTML = EXTRAS.map(name => `
        <label class="sheet-extra-item">
            <input type="checkbox" class="extra-check" data-name="${name}">
            <span class="extra-name">${name}</span>
            <span class="extra-price">+${EXTRA_PRICE.toFixed(2).replace('.', ',')} €</span>
        </label>`).join('');

    list.querySelectorAll('.extra-check').forEach(cb => {
        cb.addEventListener('change', () => {
            const name = cb.dataset.name;
            sheetExtras = cb.checked
                ? [...sheetExtras, name]
                : sheetExtras.filter(e => e !== name);
            updateSheetQty();
        });
    });

    const glutenCb = document.getElementById('sheetGluten');
    if (glutenCb) {
        glutenCb.checked = false;
        glutenCb.onchange = () => { sheetGluten = glutenCb.checked; };
    }
}

function openSheet(data) {
    sheetData   = data;
    sheetQty    = 1;
    sheetExtras = [];
    sheetGluten = false;
    sheetSize   = 'normal';

    // näytä koko+extras vain pizzoille
    const isPizza = data.category === 'pizzat';
    document.querySelector('.sheet-size-section')?.style.setProperty('display', isPizza ? '' : 'none');
    document.querySelector('.sheet-extras-section')?.style.setProperty('display', isPizza ? '' : 'none');

    // reset size buttons
    document.querySelectorAll('.sheet-size-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('sizeNormal')?.classList.add('active');

    document.getElementById('sheetImg').src              = data.imgSrc;
    document.getElementById('sheetImg').alt              = data.name;
    document.getElementById('sheetName').textContent     = data.name;
    document.getElementById('sheetIngredients').textContent = data.description;
    document.getElementById('sheetBadge').textContent    = data.badge || '';

    renderExtras();
    updateSheetQty();

    sheet.classList.add('open');
    sheetOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSheet() {
    sheet.classList.remove('open');
    sheetOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

const GLUTEN_PRICE = 2.00;

function unitPrice() {
    const isPizza = sheetData?.category === 'pizzat';
    return sheetData.price
        + (isPizza && sheetSize === 'perhe' ? PB_FAMILY_EXTRA : 0)
        + (isPizza ? sheetExtras.length * EXTRA_PRICE : 0)
        + (isPizza && sheetGluten ? GLUTEN_PRICE : 0);
}

function updateSheetQty() {
    document.getElementById('sheetQty').textContent = sheetQty;
    const total = (unitPrice() * sheetQty).toFixed(2).replace('.', ',') + ' €';
    const el = document.getElementById('sheetAddPrice');
    if (el) el.textContent = total;
}

sheetClose.addEventListener('click', closeSheet);
sheetOverlay.addEventListener('click', closeSheet);

document.getElementById('sheetMinus').addEventListener('click', () => {
    if (sheetQty > 1) { sheetQty--; updateSheetQty(); }
});
document.getElementById('sheetPlus').addEventListener('click', () => {
    if (sheetQty < 10) { sheetQty++; updateSheetQty(); }
});

document.getElementById('sheetAddBtn').addEventListener('click', () => {
    const sizeDesc   = sheetSize === 'perhe' ? ' [Perhepizza]' : '';
    const extrasDesc = sheetExtras.length > 0 ? `, +${sheetExtras.join(', ')}` : '';
    const glutenDesc = sheetGluten ? ' (gluteeniton)' : '';
    cartAddItem(
        sheetData.name,
        sheetData.description + sizeDesc + extrasDesc + glutenDesc,
        unitPrice(),
        sheetQty,
        sheetData.imgSrc
    );

    const btn = document.getElementById('sheetAddBtn');
    btn.classList.add('added');
    btn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Lisätty!</span>';
    setTimeout(() => {
        btn.classList.remove('added');
        btn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i><span>Lisää ostoskoriin</span><span class="sheet-add-price" id="sheetAddPrice"></span>`;
        updateSheetQty();
        closeSheet();
    }, 900);
});

/* ── RENDER MENU FROM PRODUCTS ── */
function fmtPrice(p) { return p.toFixed(2).replace('.', ',') + ' €'; }

function renderMenus() {
    PRODUCTS.forEach(p => {
        const grid = document.getElementById(`grid-${p.category}`);
        if (!grid) return;

        const card = document.createElement('div');
        card.className = 'pizza-card animate' + (p.badge ? ' featured' : '');

        const isRulla = p.category === 'rullat';
        card.innerHTML = `
            ${p.badge ? `<span class="pizza-badge">${p.badge}</span>` : ''}
            <div class="pizza-img-wrap${isRulla ? ' rulla-img-wrap' : ''}">
                <img src="${p.img}" alt="${p.name}" class="pizza-img" loading="lazy">
            </div>
            <div class="pizza-info">
                <h3 class="pizza-name">${p.name}</h3>
                <p class="pizza-ingredients">${p.ingredients}</p>
            </div>
            <div class="pizza-bottom">
                <span class="pizza-price">${fmtPrice(p.price)}</span>
                <button class="add-btn"><i class="fa-solid fa-plus"></i></button>
            </div>`;

        card.querySelector('.add-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            openSheet({ name: p.name, description: p.ingredients, price: p.price, imgSrc: p.img, badge: p.badge || '', category: p.category });
        });

        grid.appendChild(card);
    });
}

renderMenus();
initSizeToggle();
updateBadge();

// Observe after browser has done layout
requestAnimationFrame(() => {
    observeAnimated();
    // Fallback: jos observer ei toimi, näytä kaikki kortit 600ms jälkeen
    setTimeout(() => {
        document.querySelectorAll('.animate').forEach(el => el.classList.add('visible'));
    }, 600);
});
