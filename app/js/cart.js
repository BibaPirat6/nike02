document.querySelector(".burger-menu").addEventListener("click", () => {
  document.querySelector(".modal-burger-menu").classList.add("open-modal");
  disableScroll();
});
let keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
function preventDefault(e) {
  e.preventDefault();
}
function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}
let supportsPassive = false;
try {
  window.addEventListener(
    "test",
    null,
    Object.defineProperty({}, "passive", {
      get: function () {
        supportsPassive = true;
      },
    })
  );
} catch (e) {}
let wheelOpt = supportsPassive ? { passive: false } : false;
let wheelEvent =
  "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";
function disableScroll() {
  window.addEventListener("DOMMouseScroll", preventDefault, false);
  window.addEventListener(wheelEvent, preventDefault, wheelOpt);
  window.addEventListener("touchmove", preventDefault, wheelOpt);
  window.addEventListener("keydown", preventDefaultForScrollKeys, false);
}
function enableScroll() {
  window.removeEventListener("DOMMouseScroll", preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
  window.removeEventListener("touchmove", preventDefault, wheelOpt);
  window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
}

document.getElementById("close-modal-burger").addEventListener("click", () => {
  document.querySelector(".modal-burger-menu").classList.remove("open-modal");
  enableScroll();
});

const linkBurgerMenu = document.querySelectorAll(".burger-menu-link");
linkBurgerMenu.forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(".modal-burger-menu").classList.remove("open-modal");
    enableScroll();
  });
});

function parsePrice(priceString) {
  return Number(priceString.replace(/[^\d]/g, ""));
}

document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  let totalSumProducts = cart.reduce(
    (sum, item) => sum + parsePrice(item.newPrice) * item.quantity,
    0
  );

  document.getElementById("cart-count-products").textContent = cartCount;
  document.getElementById("cart-count-items").textContent = cartCount;
  document.getElementById("cart-result-price-h4").textContent =
    totalSumProducts;

  const cartListContainer = document.querySelector(".cart-element-list");
  cartListContainer.innerHTML = "";
  cart.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.classList.add("cart-item");
    itemElement.innerHTML = `
      <div class="cart-item-desc">
          <img src="${item.img}">
          <div class="cart-item-text">
            <h6>${item.title}</h6>
            <div class="cart-item-price">
              <h5>${item.newPrice}</h5>
              <p>${item.quantity} шт</p>
            </div>
          </div>
      </div>
    `;
    cartListContainer.appendChild(itemElement);
  });
});

const pageBuy = () => {
  document.querySelector(".cart-delivery").classList.add("page-active");
  document.querySelector(".cart-all-products").classList.add("page-off");
  document
    .querySelector(".cart-step-ellipse.step-off")
    .classList.remove("step-off");
  document.querySelectorAll(".cart-step-ellipse svg path").forEach((path) => {
    path.setAttribute("stroke", "white");
  });
  document.querySelector(".cart-step-line").classList.add("active-line");
};
const prevPage = () => {
  document.querySelector(".cart-delivery").classList.remove("page-active");
  document.querySelector(".cart-all-products").classList.remove("page-off");
  document.querySelector(".cart-step-delivery").classList.add("step-off");
  document.querySelectorAll(".cart-step-ellipse svg path").forEach((path) => {
    path.setAttribute("stroke", "gray");
    document.querySelector(".cart-step-line").classList.remove("active-line");
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("order-form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    localStorage.clear();
    alert("Вы успешно купили продукты. Они отправлены к вам домой.");
    window.location.href = "/";
  });
});
