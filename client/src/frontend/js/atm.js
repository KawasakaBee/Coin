// Основные секции

const appEntry = document.querySelector('.app-entry');
const appBills = document.querySelector('.app-bills');
const appCurrency = document.querySelector('.app-currency');
const appAtm = document.querySelector('.app-atm');

// Кнопки навигации

const billsAtmButton = document.getElementById('bills-atm');
const currencyAtmButton = document.getElementById('currency-atm');
const exitAtmButton = document.getElementById('exit-atm');

// Контейнер для карты

const cardContainer = document.getElementById('map');

// Бургер

const burger = document.getElementById('atm-burger');

// Бургер-меню

const burgerMenu = document.getElementById('atm-burger-menu');

// Функция скрытия бургер-меню

function hideBurgerMenu() {
  if (
    burgerMenu.classList.contains('app-header__list--show') &&
    burger.classList.contains('app-header-burger--active')
  ) {
    burgerMenu.classList.remove('app-header__list--show');
    burger.classList.remove('app-header-burger--active');
  }
}

// Нажатие на бургер

burger.addEventListener('click', () => {
  burgerMenu.classList.toggle('app-header__list--show');
  burger.classList.toggle('app-header-burger--active');
});

// Нажатие на кнопку счетов

billsAtmButton.addEventListener('click', () => {
  appBills.style.display = 'block';
  appAtm.style.display = 'none';

  hideBurgerMenu();
  history.pushState(null, '', 'bills');
});

// Нажатие на кнопку валют

currencyAtmButton.addEventListener('click', () => {
  appCurrency.style.display = 'block';
  appAtm.style.display = 'none';

  hideBurgerMenu();
  history.pushState(null, '', 'currency');
});

// Нажатие на кнопку выхода

exitAtmButton.addEventListener('click', () => {
  appEntry.style.display = 'block';
  appAtm.style.display = 'none';
  cardContainer.innerHTML = '';

  hideBurgerMenu();
  history.pushState(null, '', 'entry');
});
