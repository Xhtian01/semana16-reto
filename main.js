import './style.css';
import axios from 'axios';

const ShoppingFoodCart = document.querySelector('.cart-container');
const cartTotal = document.querySelector('.cart-total');
const countFoods = document.getElementById('count-foods');
const containerFood = document.querySelector('.food-grid');
const cartRow = document.querySelector('.cart-row');
let cartFoods = [];

const cartMessage = document.querySelector('.cart-message');
const cartContainer = document.querySelector('.cart-container');
const iconCart = document.querySelector('.icon-cart');

document.addEventListener('DOMContentLoaded', () => {
  cartFoods = JSON.parse(localStorage.getItem('cartFoods')) || [];
  printFoodToCart();
});

iconCart.addEventListener('click', () => {
  cartContainer.classList.toggle('cart-hidden');
});

async function readFood() {
  const { data } = await axios.get('http://localhost:3000/burger');
  console.log(data);

  printFood(data);
}

function printFood(data) {
  let cardsFood = '';
  data.forEach((food) => {
    cardsFood += `
    <div class="food-container">
              <div class="food-img">
                <img
                  src="${food.img}"
                  alt="imagen"
                />
              </div>
              <div class="food-info">
                <span class="food-name">${food.name}</span>
                <span class="food-price">$${food.price}</span>
                <button class="food-btn btnAddFood" data-id="${food.id}" data-name="${food.name}" data-price="${food.price}">Añadir al carrito</button>
              </div>
            </div>
    `;
  });

  containerFood.innerHTML = cardsFood;

  const foodBtns = document.querySelectorAll('.food-btn');
  foodBtns.forEach((btn) => {
    btn.addEventListener('click', readFoodToCart);
  });
}

function readFoodToCart(e) {
  const btn = e.target;
  const foodId = btn.getAttribute('data-id');
  const foodName = btn.getAttribute('data-name');
  const foodPrice = btn.getAttribute('data-price');

  const dataFoodSelected = {
    quantity: 1,
    name: foodName,
    price: foodPrice,
    id: foodId,
  };

  console.log(dataFoodSelected);

  const existFood = cartFoods.some((food) => food.id === dataFoodSelected.id);

  if (existFood) {
    const foodCartListFiltered = cartFoods.map((food) => {
      if (food.id === dataFoodSelected.id) {
        food.quantity++;
        return food;
      } else {
        return food;
      }
    });

    cartFoods = [...foodCartListFiltered];
  } else {
    cartFoods = [...cartFoods, dataFoodSelected];
  }
  console.log(cartFoods);
  printFoodToCart();
}

function printFoodToCart() {
  if (cartFoods.length) {
    cartRow.classList.remove('hidden');
    cartTotal.classList.remove('hidden');
    cartMessage.classList.add('hidden');
  } else {
    cartRow.classList.add('hidden');
    cartTotal.classList.add('hidden');
    cartMessage.classList.remove('hidden');
  }

  cartRow.innerHTML = '';

  let total = 0;
  let totalFoods = 0;

  let containerFood = '';

  cartFoods.forEach((food) => {
    const { quantity, name, price, id } = food;

    containerFood += `
    <div class="cart-hamburger">
      <div class="cart-info">
        <span class="cart-info-count">${quantity}</span>
        <span class="cart-info-name">${name}</span>
        <span class="cart-info-price">$${price}</span>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="icon-close"
        data-id="${id}"
          >
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
      </div>
    `;
    cartRow.innerHTML = containerFood;

    total = total + quantity * price;
    totalFoods = totalFoods + quantity;
  });

  /*cartTotalPrice.textContent = `$${total}`;*/
  cartTotal.innerHTML = `
    <span class="cart-total-title">Total</span>
    <span class="cart-total-price">$${total}</span>
  `;
  countFoods.textContent = totalFoods;
  readAllFood();
}

function deleteFood(e) {
  if (e.target.classList.contains('icon-close')) {
    const foodId = e.target.getAttribute('data-id');

    cartFoods = cartFoods.filter((food) => food.id !== foodId);

    printFoodToCart();
  }
}

ShoppingFoodCart.addEventListener('click', deleteFood);

readFood();

function readAllFood() {
  localStorage.setItem('cartFoods', JSON.stringify(cartFoods));
}
