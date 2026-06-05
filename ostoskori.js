const CART_KEY = 'hietalahdenpizzeria_cart';
const DELIVERY_FEE = 4.99;

let deliveryMode = 'toimitus'; // 'toimitus' | 'nouto'

// ── CART STORAGE ──────────────────────────────────────

function cartLoad() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
}

function cartSave(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function cartTotal(items) {
    return items.reduce((s, i) => s + i.price * i.qty, 0);
}

function fmt(n) { return n.toFixed(2).replace('.', ',') + ' €'; }

// ── RENDER ────────────────────────────────────────────

function render() {
    const items = cartLoad();
    renderItems(items);
    renderSummary(items);
    updateBadge(items);
}

function renderItems(items) {
    const list  = document.getElementById('cartItems');
    const empty = document.getElementById('cartEmpty');
    const count = document.getElementById('cartItemCount');

    if (!list) return;

    if (items.length === 0) {
        list.innerHTML = '';
        empty?.classList.add('visible');
        if (count) count.textContent = '';
        return;
    }

    empty?.classList.remove('visible');
    if (count) count.textContent = `${items.reduce((s, i) => s + i.qty, 0)} tuotetta`;

    list.innerHTML = items.map(item => `
        <div class="cart-item-card" data-id="${item.id}">
            ${item.img ? `<div class="cart-item-img-wrap"><img src="${item.img}" alt="${item.name}" class="cart-item-img"></div>` : ''}
            <div class="cart-item-content">
                <div class="cart-item-top">
                    <div>
                        <p class="cart-item-name">${item.name}</p>
                        ${item.description ? `<p class="cart-item-desc">${item.description}</p>` : ''}
                    </div>
                    <span class="cart-item-price">${fmt(item.price * item.qty)}</span>
                </div>
                <div class="cart-item-bottom">
                    <div class="qty-ctrl">
                        <button class="qty-btn" data-action="minus" data-id="${item.id}">−</button>
                        <span class="qty-val">${item.qty}</span>
                        <button class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-btn" data-action="remove" data-id="${item.id}">
                        <i class="fa-solid fa-trash"></i> Poista
                    </button>
                </div>
            </div>
        </div>`).join('');

    // events
    list.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id  = btn.dataset.id;
            const act = btn.dataset.action;
            let cart  = cartLoad();

            if (act === 'remove') {
                cart = cart.filter(i => i.id !== id);
            } else if (act === 'plus') {
                const idx = cart.findIndex(i => i.id === id);
                if (idx > -1) cart[idx].qty++;
            } else if (act === 'minus') {
                const idx = cart.findIndex(i => i.id === id);
                if (idx > -1) {
                    cart[idx].qty--;
                    if (cart[idx].qty <= 0) cart.splice(idx, 1);
                }
            }

            cartSave(cart);
            render();
        });
    });
}

function renderSummary(items) {
    const summaryItems  = document.getElementById('summaryItems');
    const subtotalEl    = document.getElementById('summarySubtotal');
    const totalEl       = document.getElementById('summaryTotal');
    const feeRow        = document.getElementById('deliveryFeeRow');
    const feeValEl      = document.getElementById('summaryDeliveryFee');

    if (!summaryItems) return;

    const subtotal = cartTotal(items);
    const fee      = deliveryMode === 'toimitus' ? DELIVERY_FEE : 0;
    const total    = subtotal + fee;

    if (items.length === 0) {
        summaryItems.innerHTML = '<p style="font-size:.82rem;color:#bbb">Lisää tuotteita ostoskoriin</p>';
    } else {
        summaryItems.innerHTML = items.map(i =>
            `<div class="summary-item-row">
                <span>${i.name}${i.qty > 1 ? ` ×${i.qty}` : ''}</span>
                <span>${fmt(i.price * i.qty)}</span>
            </div>`
        ).join('');
    }

    if (subtotalEl) subtotalEl.textContent = fmt(subtotal);
    if (feeValEl)  feeValEl.textContent  = fmt(fee);
    if (totalEl)   totalEl.textContent   = fmt(total);
    if (feeRow)    feeRow.style.display  = deliveryMode === 'toimitus' ? '' : 'none';
}

function updateBadge(items) {
    const badge = document.getElementById('cartCount');
    if (!badge) return;
    const count = items.reduce((s, i) => s + i.qty, 0);
    badge.textContent = count;
    badge.classList.toggle('visible', count > 0);
}

// ── DELIVERY TOGGLE ───────────────────────────────────

function initDeliveryToggle() {
    const btns = document.querySelectorAll('.dtoggle-btn');
    const osoiteField = document.getElementById('fieldOsoite');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            deliveryMode = btn.dataset.mode;

            if (osoiteField) {
                osoiteField.placeholder = deliveryMode === 'toimitus'
                    ? 'Toimitusosoite *' : 'Noutaja (nimi)';
                osoiteField.required = deliveryMode === 'toimitus';
            }

            render();
        });
    });
}

// ── ORDER FORM ────────────────────────────────────────

function buildWaMessage(items, nimi, puhelin, osoite, lisatiedot) {
    const lines = items.map(i => {
        let line = `• ${i.name}`;
        if (i.qty > 1) line += ` ×${i.qty}`;
        if (i.description) line += ` (${i.description})`;
        line += ` — ${fmt(i.price * i.qty)}`;
        return line;
    }).join('\n');

    const total = cartTotal(items);
    const mode  = deliveryMode === 'toimitus' ? 'Toimitus' : 'Nouto';

    let msg = `Hei! Uusi tilaus 🍕\n\n`;
    msg += `🛒 TILAUS:\n${lines}\n\n`;
    msg += `📦 TOIMITUSTAPA: ${mode}\n\n`;
    msg += `👤 ASIAKASTIEDOT:\n`;
    msg += `Nimi: ${nimi}\n`;
    msg += `Puhelin: ${puhelin}\n`;
    if (deliveryMode === 'toimitus') msg += `Osoite: ${osoite}\n`;
    if (lisatiedot) msg += `Lisätiedot: ${lisatiedot}\n`;
    msg += `\n💰 YHTEENSÄ: ${fmt(total)}`;

    return encodeURIComponent(msg);
}

function initForm() {
    const form = document.getElementById('orderForm');
    const btn  = document.getElementById('orderBtn');
    if (!form || !btn) return;

    btn.disabled = true;
    btn.textContent = 'TILAUS EI OLE KÄYTÖSSÄ';

    form.addEventListener('submit', e => e.preventDefault());
}

// ── MOBILE MENU ───────────────────────────────────────

function initMobileMenu() {
    const hamburger  = document.getElementById('hamburger');
    const toggleMenu = document.getElementById('toggleMenu');
    const overlay    = document.getElementById('overlay');
    if (!hamburger) return;
    hamburger.addEventListener('click', () => {
        toggleMenu.classList.add('open');
        overlay.classList.add('active');
    });
    overlay.addEventListener('click', () => {
        toggleMenu.classList.remove('open');
        overlay.classList.remove('active');
    });
}

// ── INIT ──────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    render();
    initDeliveryToggle();
    initForm();
    initMobileMenu();
});
