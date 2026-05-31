/* =============================================
   SANTOLOMEO STORE – main.js
   ============================================= */

// ===== PRODUCTS DATA =====
const products = [
  { id: 1,   brand: 'NVIDIA',   name: 'GeForce RTX 5070 Ti 12GB GDDR7',         price: 4990000, oldPrice: 5800000, icon: 'fa-display',       badges: ['sale','hot'],  category: 'gpu',         img: 'assets/rtx5070ti.jpg' },
  { id: 2,   brand: 'AMD',      name: 'Ryzen 9 9900X 4.4GHz 12 Core',           price: 2890000, oldPrice: 3400000, icon: 'fa-microchip',     badges: ['sale'],         category: 'cpu',         img: 'assets/ryzen9-9900x.jpg' },
  { id: 3,   brand: 'CORSAIR',  name: 'Vengeance DDR5 32GB (2x16) 6000MHz',     price: 890000,  oldPrice: 1100000, icon: 'fa-memory',        badges: ['sale'],         category: 'ram',         img: 'assets/corsair-ddr5.jpg' },
  { id: 4,   brand: 'SAMSUNG',  name: 'SSD 990 Pro NVMe M.2 2TB Gen 4',         price: 790000,  oldPrice: 950000,  icon: 'fa-hard-drive',    badges: ['hot'],          category: 'storage',     img: 'assets/ssd-990pro.jpg' },
  { id: 5,   brand: 'ASUS',     name: 'ROG Strix B850-F Gaming WiFi DDR5',       price: 1690000, oldPrice: 1980000, icon: 'fa-server',        badges: ['new'],          category: 'motherboard', img: 'assets/rog-b850f.jpg' },
  { id: 6,   brand: 'CORSAIR',  name: 'RM1000x Modular 80+ Gold 1000W',         price: 590000,  oldPrice: 720000,  icon: 'fa-bolt',          badges: ['sale'],         category: 'psu',         img: 'assets/corsair-rm1000x.jpg' },
  { id: 7,   brand: 'MSI',      name: 'MAG Forge 321R Mid Tower ATX RGB',       price: 390000,  oldPrice: 490000,  icon: 'fa-box',           badges: ['sale'],         category: 'case',        img: 'assets/msi-mag-forge.jpg' },
  { id: 8,   brand: 'NZXT',     name: 'Kraken Elite 360 RGB AIO Liquid',        price: 780000,  oldPrice: 920000,  icon: 'fa-wind',          badges: ['new'],          category: 'cooling',     img: 'assets/nzxt-kraken.jpg' },
];

const peripherals = [
  { id: 101, brand: 'LOGITECH', name: 'G Pro X Superlight 2 Gaming Mouse',      price: 490000,  oldPrice: 590000,  icon: 'fa-computer-mouse', badges: ['hot'],         category: 'mouse',       img: 'assets/logitech-g-pro.jpg' },
  { id: 102, brand: 'ASUS',     name: 'ROG Swift 27" 280Hz IPS 1ms QHD',       price: 2190000, oldPrice: 2590000, icon: 'fa-desktop',        badges: ['sale','hot'],  category: 'monitor',     img: 'assets/asus-rog-swift.jpg' },
  { id: 103, brand: 'CORSAIR',  name: 'K70 RGB Pro Mecánico Cherry MX Red',    price: 690000,  oldPrice: 820000,  icon: 'fa-keyboard',       badges: ['sale'],        category: 'keyboard',    img: 'assets/corsair-k70.jpg' },
  { id: 104, brand: 'RAZER',    name: 'BlackShark V2 Pro Wireless 7.1',        price: 590000,  oldPrice: 720000,  icon: 'fa-headphones',     badges: ['new'],         category: 'headset',     img: 'assets/razer-blackshark.jpg' },
];

// ===== CART STATE =====
let cart = [];

// ===== RENDER PRODUCTS =====
function renderProducts(list, gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  grid.innerHTML = list.map(p => {
    const badgeHtml = p.badges.map(b => {
      const labels  = { sale: 'Oferta', new: 'Nuevo', hot: '🔥 Popular' };
      const classes = { sale: 'badge-sale', new: 'badge-new', hot: 'badge-hot' };
      return `<span class="badge ${classes[b]}">${labels[b]}</span>`;
    }).join('');

    const imgHtml = p.img
      ? `<img src="${p.img}" alt="${p.name}" onerror="this.style.display='none'; this.parentNode.innerHTML += '<i class=\\'fa ${p.icon}\\'></i>'"/>`
      : `<i class="fa ${p.icon}"></i>`;

    return `
      <div class="product-card" onclick="viewProduct(${p.id})">
        <div class="product-img">
          ${imgHtml}
          <div class="product-badge-wrap">${badgeHtml}</div>
        </div>
        <div class="product-info">
          <div class="product-brand">${p.brand}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-price-row">
            <div>
              <div class="product-price-main">${formatPrice(p.price)}</div>
              ${p.oldPrice ? `<div class="product-price-old">${formatPrice(p.oldPrice)}</div>` : ''}
            </div>
            <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart('${p.name.replace(/'/g, "\\'")}', ${p.price}, '${p.icon}')">
              <i class="fa fa-cart-plus"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

renderProducts(products,    'products-grid');
renderProducts(peripherals, 'perificos-grid');

// ===== FORMAT PRICE =====
function formatPrice(n) {
  return 'G. ' + n.toLocaleString('es-PY');
}

// ===== CART FUNCTIONS =====
function addToCart(name, price, icon = 'fa-box') {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, icon, qty: 1 });
  }
  updateCartUI();
  showToast(`${name.substring(0, 32)}… agregado`);
  bumpCartCount();
  openCartMoment();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function changeQty(index, delta) {
  if (!cart[index]) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    removeFromCart(index);
  } else {
    updateCartUI();
  }
}

function clearCart() {
  if (cart.length === 0) return;
  if (confirm('¿Vaciar el carrito?')) {
    cart = [];
    updateCartUI();
  }
}

function updateCartUI() {
  const count    = cart.reduce((sum, i) => sum + i.qty, 0);
  const total    = cart.reduce((s, i)   => s + i.price * i.qty, 0);
  const countEl  = document.getElementById('cart-count');
  const itemsEl  = document.getElementById('cart-items');
  const footerEl = document.getElementById('cart-footer');

  countEl.textContent = count;

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <i class="fa fa-cart-shopping"></i>
        <p>Tu carrito está vacío</p>
      </div>`;
    footerEl.style.display = 'none';
    return;
  }

  itemsEl.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item-icon"><i class="fa ${item.icon}"></i></div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${idx}, -1)"><i class="fa fa-minus"></i></button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${idx}, 1)"><i class="fa fa-plus"></i></button>
        </div>
      </div>
      <button class="cart-item-del" onclick="removeFromCart(${idx})" title="Quitar"><i class="fa fa-trash"></i></button>
    </div>
  `).join('');

  // Update summary
  document.getElementById('cart-item-count').textContent = count;
  document.getElementById('cart-subtotal').textContent    = formatPrice(total);
  document.getElementById('cart-total-price').textContent = formatPrice(total);
  footerEl.style.display = 'flex';
}

function bumpCartCount() {
  const el = document.getElementById('cart-count');
  el.classList.add('bump');
  setTimeout(() => el.classList.remove('bump'), 250);
}

function showToast(msg) {
  const toast  = document.getElementById('cart-toast');
  const msgEl  = document.getElementById('toast-msg');
  msgEl.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
}

function toggleCart() {
  const drawer  = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  drawer.classList.toggle('open');
  overlay.classList.toggle('open');
}

function openCartMoment() {
  const drawer  = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  drawer.classList.add('open');
  overlay.classList.add('open');
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
  const nav  = document.getElementById('mobile-nav');
  const btn  = document.getElementById('hamburger');
  nav.classList.toggle('open');
  btn.classList.toggle('open');
}

// ===== HERO SLIDER =====
let currentSlide = 0;
let slideTimer;

function goToSlide(n) {
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.dot');
  if (!slides.length) return;
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = ((n % slides.length) + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function changeSlide(dir) {
  goToSlide(currentSlide + dir);
  resetTimer();
}

function resetTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => goToSlide(currentSlide + 1), 5500);
}

resetTimer();

// Touch swipe on hero
(function() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  let startX = 0;
  hero.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend',   e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { changeSlide(diff > 0 ? 1 : -1); }
  }, { passive: true });
})();

// ===== COMPONENTES FILTER =====
function filterComp(type, btn) {
  // Update tab active state
  document.querySelectorAll('.comp-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  // Show/hide cards
  const cards = document.querySelectorAll('#comp-cards .sc-card');
  cards.forEach(card => {
    if (type === 'all') {
      card.classList.remove('hidden');
    } else {
      const match = card.dataset.comp === type;
      card.classList.toggle('hidden', !match);
    }
  });
}

// ===== SEARCH =====
function handleSearch(query) {
  if (!query || query.length < 2) return;
  // Basic: scroll to section if category matches
  const q = query.toLowerCase();
  const map = {
    'monitor':      '#cat-monitores',
    'placa de video':'#cat-placas-de-video',
    'video':        '#cat-placas-de-video',
    'rtx':          '#cat-placas-de-video',
    'notebook':     '#cat-notebooks',
    'laptop':       '#cat-notebooks',
    'juego':        '#cat-juegos',
    'consola':      '#cat-juegos',
    'ps5':          '#cat-juegos',
    'xbox':         '#cat-juegos',
    'gabinete':     '#cat-gabinetes',
    'componente':   '#featured-cats',
    'gpu':          '#cat-placas-de-video',
    'procesador':   '#featured-cats',
    'ram':          '#featured-cats',
    'ssd':          '#cat-almacenamiento',
    'almacenamiento':'#cat-almacenamiento',
    'hd':           '#cat-almacenamiento',
    'fuente':       '#featured-cats',
    'refrigeracion':'#featured-cats',
    'periferico':   '#cat-perifericos',
    'mouse':        '#cat-perifericos',
    'teclado':      '#cat-perifericos',
  };
  for (const [key, anchor] of Object.entries(map)) {
    if (q.includes(key)) {
      document.querySelector(anchor)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
  }
}

// ===== CHECKOUT =====
let currentStep = 1;

function openCheckout() {
  toggleCart();
  buildOrderSummary();
  document.getElementById('checkout-modal').style.display = 'flex';
}

function closeCheckout() {
  document.getElementById('checkout-modal').style.display = 'none';
}

function nextStep(n) {
  document.getElementById(`step${currentStep}`).style.display = 'none';
  document.getElementById(`step${currentStep}-tab`).classList.remove('active');
  currentStep = n;
  document.getElementById(`step${currentStep}`).style.display = 'block';
  document.getElementById(`step${currentStep}-tab`).classList.add('active');
  if (n === 3) buildOrderSummary();
}

function buildOrderSummary() {
  const el = document.getElementById('order-summary-mini');
  if (!el || cart.length === 0) return;
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  el.innerHTML = `
    <strong style="display:block;margin-bottom:8px;color:var(--text)">Resumen del pedido</strong>
    ${cart.map(i => `
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="max-width:65%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${i.name} ×${i.qty}</span>
        <span style="font-weight:600;color:var(--text)">${formatPrice(i.price * i.qty)}</span>
      </div>`).join('')}
    <div style="display:flex;justify-content:space-between;margin-top:10px;padding-top:10px;border-top:1px solid var(--border);color:var(--text);font-weight:700;font-family:var(--font-head);font-size:16px">
      <span>Total</span><span style="color:var(--red)">${formatPrice(total)}</span>
    </div>`;
}

function showPayForm(type) {
  ['card-form','transfer-form','cash-form'].forEach(id => {
    document.getElementById(id).style.display = id === `${type}-form` ? 'block' : 'none';
  });
  document.querySelectorAll('.pay-method').forEach(el => el.classList.remove('active-pay'));
  document.getElementById(`pm-${type}`).classList.add('active-pay');
}

function placeOrder() {
  closeCheckout();
  const orderNum = Math.floor(Math.random() * 90000) + 10000;
  document.getElementById('order-number').textContent = orderNum;
  document.getElementById('success-modal').style.display = 'flex';
  cart = [];
  updateCartUI();
  currentStep = 1;
  resetCheckoutSteps();
}

function resetCheckoutSteps() {
  ['step1','step2','step3'].forEach((id, i) => {
    document.getElementById(id).style.display = i === 0 ? 'block' : 'none';
    document.getElementById(`${id}-tab`).classList.toggle('active', i === 0);
  });
}

function closeSuccess() {
  document.getElementById('success-modal').style.display = 'none';
}

// ===== CARD FORMATTING =====
function formatCardNum(el) {
  let v = el.value.replace(/\D/g, '').substring(0, 16);
  el.value = v.replace(/(.{4})/g, '$1 ').trim();
  const disp = v.padEnd(16, '•').replace(/(.{4})/g, '$1 ').trim();
  document.getElementById('card-number-display').textContent = disp;
}

function formatExpiry(el) {
  let v = el.value.replace(/\D/g, '');
  if (v.length >= 2) v = v.substring(0,2) + '/' + v.substring(2,4);
  el.value = v;
}

function viewProduct(id) {
  // placeholder – could open a product detail modal
  console.log('View product:', id);
}

// ===== MODAL CLOSE ON OVERLAY =====
document.getElementById('checkout-modal').addEventListener('click', function(e) {
  if (e.target === this) closeCheckout();
});
document.getElementById('success-modal').addEventListener('click', function(e) {
  if (e.target === this) closeSuccess();
});

// ===== ESC KEY =====
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeCheckout();
    closeSuccess();
    const drawer = document.getElementById('cart-drawer');
    if (drawer.classList.contains('open')) toggleCart();
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav.classList.contains('open')) toggleMobileMenu();
  }
});

