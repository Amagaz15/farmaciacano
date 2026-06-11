const WHATSAPP_NUMBER = "5492257000000";

const PRODUCTS = [
  {
    id: 1,
    name: "Protector Solar FPS 50",
    brand: "Dermaglós",
    description: "Protección alta para rostro y cuerpo.",
    category: "solar",
    price: 0,
    badge: "Consultar",
    image: "assets/productos/protector-solar.png",
    fallback: "☀️"
  },
  {
    id: 2,
    name: "Agua Micelar",
    brand: "Garnier",
    description: "Limpieza facial diaria para todo tipo de piel.",
    category: "facial",
    price: 0,
    badge: "Nuevo",
    image: "assets/productos/agua-micelar.png",
    fallback: "✨"
  },
  {
    id: 3,
    name: "Crema Hidratante Facial",
    brand: "Nivea",
    description: "Hidratación diaria para piel normal a seca.",
    category: "facial",
    price: 0,
    badge: "",
    image: "assets/productos/crema-facial.png",
    fallback: "🧴"
  },
  {
    id: 4,
    name: "Shampoo Cuidado Capilar",
    brand: "Elvive",
    description: "Cuidado y reparación para uso diario.",
    category: "capilar",
    price: 0,
    badge: "",
    image: "assets/productos/shampoo.png",
    fallback: "💆‍♀️"
  },
  {
    id: 5,
    name: "Crema Corporal",
    brand: "Bagóvit",
    description: "Nutrición corporal con textura suave.",
    category: "dermo",
    price: 0,
    badge: "Más pedido",
    image: "assets/productos/crema-corporal.png",
    fallback: "🧴"
  },
  {
    id: 6,
    name: "Jabón Líquido",
    brand: "Dove",
    description: "Higiene diaria para manos y cuerpo.",
    category: "higiene",
    price: 0,
    badge: "",
    image: "assets/productos/jabon-liquido.png",
    fallback: "🧼"
  },
  {
    id: 7,
    name: "Toallitas Húmedas",
    brand: "Huggies",
    description: "Cuidado suave para bebés.",
    category: "bebes",
    price: 0,
    badge: "",
    image: "assets/productos/toallitas.png",
    fallback: "🍼"
  },
  {
    id: 8,
    name: "Desodorante Aerosol",
    brand: "Rexona",
    description: "Protección diaria y fragancia fresca.",
    category: "higiene",
    price: 0,
    badge: "Oferta",
    image: "assets/productos/desodorante.png",
    fallback: "🌸"
  },
  {
    id: 9,
    name: "Perfume Corporal",
    brand: "Algabo",
    description: "Fragancia fresca para todos los días.",
    category: "ofertas",
    price: 0,
    badge: "Oferta",
    image: "assets/productos/perfume-corporal.png",
    fallback: "🌷"
  },
  {
    id: 10,
    name: "Pañales",
    brand: "Pampers",
    description: "Consultar talles y disponibilidad.",
    category: "bebes",
    price: 0,
    badge: "",
    image: "assets/productos/panales.png",
    fallback: "👶"
  }
];

let cart = JSON.parse(localStorage.getItem("canoCart")) || [];
let currentCategory = "all";
let currentSearch = "";

const productsGrid = document.getElementById("productsGrid");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

function saveCart() {
  localStorage.setItem("canoCart", JSON.stringify(cart));
}

function formatPrice(price) {
  if (!price || price <= 0) {
    return "Consultar precio";
  }

  return "$" + price.toLocaleString("es-AR");
}

function renderProducts() {
  const filteredProducts = PRODUCTS.filter(product => {
    const matchesCategory =
      currentCategory === "all" || product.category === currentCategory;

    const searchText = currentSearch.toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(searchText) ||
      product.brand.toLowerCase().includes(searchText) ||
      product.description.toLowerCase().includes(searchText);

    return matchesCategory && matchesSearch;
  });

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `
      <div class="no-results">
        No encontramos productos con esa búsqueda.
      </div>
    `;
    return;
  }

  productsGrid.innerHTML = filteredProducts.map(product => {
    const priceClass = product.price > 0 ? "product-price" : "product-price consult";

    return `
      <article class="product-card">
        <div class="product-image">
  ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}

  <img 
    src="${product.image}" 
    alt="${product.name}" 
    onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';"
  >

  <div class="image-fallback">
    ${product.fallback}
  </div>
</div>

        <div class="product-info">
          <span class="product-brand">${product.brand}</span>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="${priceClass}">${formatPrice(product.price)}</div>

          <button onclick="addToCart(${product.id})">
            Agregar a mi pedido
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function filterProducts(category, button) {
  currentCategory = category;

  document.querySelectorAll(".category").forEach(item => {
    item.classList.remove("active");
  });

  button.classList.add("active");

  renderProducts();
}

function searchProducts() {
  currentSearch = document.getElementById("searchInput").value.trim();
  renderProducts();
}

function openCart() {
  cartPanel.classList.add("open");
  cartOverlay.classList.add("open");
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("open");
}

function addToCart(productId) {
  const product = PRODUCTS.find(item => item.id === productId);

  if (!product) return;

  const existingProduct = cart.find(item => item.id === productId);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      quantity: 1
    });
  }

  saveCart();
  renderCart();
  showToast("Producto agregado a tu pedido");
}

function removeFromCart(index) {
  cart.splice(index, 1);

  saveCart();
  renderCart();
}

function increaseQuantity(index) {
  cart[index].quantity++;

  saveCart();
  renderCart();
}

function decreaseQuantity(index) {
  cart[index].quantity--;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
}

function renderCart() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalQuantity;

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="empty-cart">Todavía no agregaste productos.</p>`;
    cartTotal.textContent = "$0";
    return;
  }

  let total = 0;

  cartItems.innerHTML = cart.map((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const priceText =
      item.price > 0
        ? "$" + subtotal.toLocaleString("es-AR")
        : "A consultar";

    return `
      <div class="cart-item">
        <h4>${item.name}</h4>
        <p>${item.brand} · ${priceText}</p>

        <div class="cart-item-controls">
          <button onclick="decreaseQuantity(${index})">−</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQuantity(${index})">+</button>
          <button class="remove" onclick="removeFromCart(${index})">Eliminar</button>
        </div>
      </div>
    `;
  }).join("");

  cartTotal.textContent =
    total > 0 ? "$" + total.toLocaleString("es-AR") : "A consultar";
}

function sendOrderToWhatsApp() {
  const customerName = document.getElementById("customerName").value.trim();
  const customerAddress = document.getElementById("customerAddress").value.trim();
  const deliveryType = document.getElementById("deliveryType").value;
  const paymentMethod = document.getElementById("paymentMethod").value;

  if (cart.length === 0) {
    alert("Primero agregá productos al pedido.");
    return;
  }

  if (!customerName) {
    markError("customerName");
    alert("Ingresá tu nombre.");
    return;
  }

  let message = "Hola! Quiero consultar por estos productos:%0A%0A";

  message += `👤 Cliente: ${encodeURIComponent(customerName)}%0A`;
  message += `📦 Modalidad: ${encodeURIComponent(deliveryType)}%0A`;
  message += `💳 Pago: ${encodeURIComponent(paymentMethod)}%0A`;

  if (customerAddress) {
    message += `📍 Dirección: ${encodeURIComponent(customerAddress)}%0A`;
  }

  message += "%0A🛍️ Productos:%0A";

  let total = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const priceText =
      item.price > 0
        ? "$" + subtotal.toLocaleString("es-AR")
        : "A consultar";

    message += `• ${item.quantity}x ${encodeURIComponent(item.name)} (${encodeURIComponent(item.brand)}) — ${encodeURIComponent(priceText)}%0A`;
  });

  if (total > 0) {
    message += `%0A💰 Total estimado: $${total.toLocaleString("es-AR")}`;
  } else {
    message += "%0A💰 Total: A consultar";
  }

  message += "%0A%0A¿Me confirmás disponibilidad y precio final?";

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}="5492257404061"; ?text=${message}`;

  window.open(whatsappUrl, "_blank");
}

function markError(inputId) {
  const input = document.getElementById(inputId);

  input.focus();
  input.style.borderColor = "#d92d20";

  setTimeout(() => {
    input.style.borderColor = "";
  }, 2000);
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

renderProducts();
renderCart();