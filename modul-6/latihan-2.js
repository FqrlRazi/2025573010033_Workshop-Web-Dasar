const products = [
  {
    id: 1,
    name: 'Kopi Spesial Arabika',
    price: 52000,
    image: 'https://plus.unsplash.com/premium_photo-1675435644687-562e8042b9db?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29mZmV8ZW58MHx8MHx8fDA%3D'
  },
  {
    id: 2,
    name: 'Sate Ayam Madura',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1742808838159-1848c1a36209?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2F0ZXxlbnwwfHwwfHx8MA%3D%3D'
  },
  {
    id: 3,
    name: 'Roti Cokelat Premium',
    price: 32000,
    image: 'https://plus.unsplash.com/premium_photo-1664547606819-41e49a4806cf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGNob2NvbGF0ZSUyMGJyZWFkfGVufDB8fDB8fHww'
  },
  {
    id: 4,
    name: 'Nasi Goreng Seafood',
    price: 61000,
    image: 'https://images.unsplash.com/photo-1630914441929-0d8ea69f95e6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2VhZm9vZCUyMGZyaWVkJTIwcmljZXxlbnwwfHwwfHx8MA%3D%3D'
  },
  {
    id: 5,
    name: 'Salad Buah Segar',
    price: 38000,
    image: 'https://images.unsplash.com/photo-1658431618300-a69b07fb5782?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJ1aXQlMjBzYWxhZHxlbnwwfHwwfHx8MA%3D%3D'
  },
  {
    id: 6,
    name: 'Orange Juice Fresh',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b3JhbmdlJTIwanVpY2V8ZW58MHx8MHx8fDA%3D'
  }
];

let cart = [];

const productGrid = document.getElementById('productGrid');
const cartList = document.getElementById('cartList');
const cartCount = document.getElementById('cartCount');
const iconBadge = document.getElementById('iconBadge');
const cartStatus = document.getElementById('cartStatus');
const summaryItems = document.getElementById('summaryItems');
const summaryTotal = document.getElementById('summaryTotal');
const checkoutButton = document.getElementById('checkoutButton');

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value);
}

function renderProducts() {
  productGrid.innerHTML = products.map(product => {
    return `
      <article class="card">
        <img src="${product.image}" alt="Produk ${product.name}" />
        <div class="card-body">
          <h3 class="card-title">${product.name}</h3>
          <p class="card-price">${formatCurrency(product.price)}</p>
          <div class="card-actions">
            <span>${formatCurrency(product.price)}</span>
            <button class="button" type="button" data-action="add" data-id="${product.id}">Tambah ke Keranjang</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function getCartItemCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal() {
  return cart.reduce((sum, item) => {
    const product = products.find(product => product.id === item.productId);
    return sum + (product.price * item.quantity);
  }, 0);
}

function renderCart() {
  const totalItems = getCartItemCount();
  const totalPrice = getCartTotal();

  cartCount.textContent = totalItems;
  iconBadge.textContent = `${totalItems} item`;
  summaryItems.textContent = totalItems;
  summaryTotal.textContent = formatCurrency(totalPrice);
  cartStatus.textContent = totalItems === 0 ? 'Belum ada produk dalam keranjang.' : 'Item sudah ditambahkan ke keranjang.';
  checkoutButton.disabled = totalItems === 0;

  if (cart.length === 0) {
    cartList.innerHTML = `
      <li class="empty-state">Keranjang kosong. Tambahkan produk terlebih dahulu.</li>
    `;
    return;
  }

  cartList.innerHTML = cart.map(item => {
    const product = products.find(product => product.id === item.productId);
    return `
      <li class="cart-item">
        <div class="item-info">
          <strong>${product.name}</strong>
          <span class="item-subtitle">${formatCurrency(product.price)} × ${item.quantity}</span>
          <span class="item-subtitle">Subtotal: ${formatCurrency(product.price * item.quantity)}</span>
        </div>
        <div class="item-actions">
          <div class="qty-controls">
            <button class="icon-button" type="button" data-action="decrease" data-id="${item.productId}">−</button>
            <span>${item.quantity}</span>
            <button class="icon-button" type="button" data-action="increase" data-id="${item.productId}">+</button>
          </div>
          <button class="icon-button remove-button" type="button" data-action="remove" data-id="${item.productId}">Hapus</button>
        </div>
      </li>
    `;
  }).join('');
}

function findCartItem(productId) {
  return cart.find(item => item.productId === productId);
}

function addToCart(productId) {
  const existingItem = findCartItem(productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1 });
  }
  renderCart();
}

function updateCartItem(productId, change) {
  const existingItem = findCartItem(productId);
  if (!existingItem) return;

  existingItem.quantity += change;
  if (existingItem.quantity <= 0) {
    cart = cart.filter(item => item.productId !== productId);
  }
  renderCart();
}

function removeCartItem(productId) {
  cart = cart.filter(item => item.productId !== productId);
  renderCart();
}

function handleProductClick(event) {
  const button = event.target.closest('button');
  if (!button) return;

  const action = button.dataset.action;
  const id = Number(button.dataset.id);

  if (action === 'add') {
    addToCart(id);
  }
}

function handleCartClick(event) {
  const button = event.target.closest('button');
  if (!button) return;

  const action = button.dataset.action;
  const id = Number(button.dataset.id);

  if (action === 'increase') {
    updateCartItem(id, 1);
  }
  if (action === 'decrease') {
    updateCartItem(id, -1);
  }
  if (action === 'remove') {
    removeCartItem(id);
  }
}

function checkout() {
  if (cart.length === 0) {
    alert('Keranjang masih kosong. Tambahkan produk terlebih dahulu.');
    return;
  }

  const lines = cart.map(item => {
    const product = products.find(product => product.id === item.productId);
    return `${product.name} x ${item.quantity} = ${formatCurrency(product.price * item.quantity)}`;
  });

  const summary = [`Ringkasan Order:`, ...lines, '', `Total Item: ${getCartItemCount()}`, `Total Harga: ${formatCurrency(getCartTotal())}`];
  alert(summary.join('\n'));
}

function init() {
  renderProducts();
  renderCart();
  productGrid.addEventListener('click', handleProductClick);
  cartList.addEventListener('click', handleCartClick);
  checkoutButton.addEventListener('click', checkout);
}

window.addEventListener('DOMContentLoaded', init);
