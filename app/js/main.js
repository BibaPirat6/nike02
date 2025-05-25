window.addEventListener("load", () => {
  const track = document.querySelector(".collection-box-slider-track");
  const slides = document.querySelectorAll(".slide");
  const leftArrow = document.querySelector(".collection-box-arrows-left");
  const rightArrow = document.querySelector(".collection-box-arrows-right");

  const slideGap = 20;
  const slideWidth = slides[0].getBoundingClientRect().width + slideGap;
  const slidesPerView = 1;
  let currentIndex = 0;

  function updateSliderPosition() {
    const newPosition = -slideWidth * currentIndex;
    track.style.transform = `translateX(${newPosition}px)`;
    leftArrow.classList.toggle("disabled", currentIndex === 0);
    rightArrow.classList.toggle(
      "disabled",
      currentIndex >= slides.length - slidesPerView
    );
  }

  rightArrow.addEventListener("click", () => {
    if (currentIndex < slides.length - slidesPerView) {
      currentIndex++;
      updateSliderPosition();
    }
  });

  leftArrow.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSliderPosition();
    }
  });
  let startX = 0;
  let isDragging = false;

  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  track.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      const diffX = startX - currentX;
      if (Math.abs(diffX) > 10) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  track.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    isDragging = false;
    const endX = e.changedTouches[0].clientX;
    const deltaX = startX - endX;

    if (deltaX > 50 && currentIndex < slides.length - slidesPerView) {
      currentIndex++;
      updateSliderPosition();
    } else if (deltaX < -50 && currentIndex > 0) {
      currentIndex--;
      updateSliderPosition();
    }
  });

  updateSliderPosition();
});



const formHandle = () => {
  alert("Вы подписались на нас!");
};

const sizes = document.querySelectorAll(".header-size-variable");
sizes.forEach((size) => {
  size.addEventListener("click", () => {
    if (size.classList.contains("disabled")) return;

    sizes.forEach((s) => s.classList.remove("filled"));
    size.classList.add("filled");
  });
});

const colorsNike = document.querySelectorAll(".header-color-variable");
colorsNike.forEach((color) => {
  color.addEventListener("click", () => {
    if (color.classList.contains("checked")) {
      return;
    } else {
      colorsNike.forEach((s) => s.classList.remove("checked"));
      color.classList.add("checked");
    }
  });
});

const imageList = [
  "../images/header-banner1.png",
  "../images/header-banner2.png",
  "../images/header-banner3.png",
  "../images/header-banner4.png",
];
let currentIndex = 0;
const mainImg = document.querySelector(".mainImg");
const arrow = document.querySelector(".move-toggle-slider");
const toggleImg = (src) => {
  currentIndex = imageList.indexOf(src);
  mainImg.src = src;
};
arrow.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % imageList.length;
  mainImg.src = imageList[currentIndex];
});

document.addEventListener("DOMContentLoaded", () => {
  const addButtons = document.querySelectorAll(".add-to-cart-circle");
  const mainBuyButton = document.getElementById("buy-nike-winterized");
  function parsePrice(priceString) {
    return Number(priceString.replace(/[^\d]/g, ""));
  }
  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (totalQuantity >= 99) {
      alert("Нельзя добавить больше 99 товаров в корзину");
      return;
    }

    const existingProduct = cart.find(
      (item) =>
        item.title === product.title && item.newPrice === product.newPrice
    );

    if (existingProduct) {
      if (totalQuantity + 1 <= 99) {
        existingProduct.quantity += 1;
        console.log("Добавлено ещё 1 шт.");
      } else {
        alert("Нельзя добавить больше 99 товаров!");
      }
    } else {
      cart.push(product);
      console.log("Товар добавлен в корзину");
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
  }
  function updateCartUI() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalSumProducts = cart.reduce(
      (sum, item) => sum + parsePrice(item.newPrice) * item.quantity,
      0
    );

    document.getElementById("cart-count-products").textContent = totalItems;
    document.getElementById("buy-box-count").textContent = totalItems;
    document.getElementById("buy-box-cost").textContent = totalSumProducts;
  }
  updateCartUI();
  addButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const slide = button.closest(".slide");
      const img = slide.querySelector("img").getAttribute("src");
      const title = slide.querySelector("h6").textContent;
      const newPrice = slide.querySelector(".slide-cost h5").textContent;
      const oldPrice = slide.querySelector(".slide-cost h6").textContent;

      const product = {
        id: Date.now().toString(),
        title,
        img,
        newPrice,
        oldPrice,
        quantity: 1,
      };

      addToCart(product);
    });
  });

  mainBuyButton.addEventListener("click", (e) => {
    e.preventDefault();
    const title = document.querySelector(
      ".header-content-text-name h1"
    ).textContent;
    const img = document
      .querySelector(".header-products .header-product img")
      .getAttribute("src");
    const newPrice = document.querySelector(".header-content h2").textContent;
    const oldPrice = "";

    const product = {
      id: Date.now().toString(),
      title,
      img,
      newPrice,
      oldPrice,
      quantity: 1,
    };

    addToCart(product);
  });
});

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
} catch (e) { }
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

document.getElementById('close-modal-burger').addEventListener('click', () => {
  document.querySelector(".modal-burger-menu").classList.remove("open-modal");
  enableScroll()
})


const linkBurgerMenu = document.querySelectorAll('.burger-menu-link')
linkBurgerMenu.forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector(".modal-burger-menu").classList.remove("open-modal");
    enableScroll()
  })
})