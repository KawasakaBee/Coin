import userData from './entry.js';
import { getUserCurrency, tradeCurrency } from './getData.js';

// Основные секции

const appEntry = document.querySelector('.app-entry');
const appBills = document.querySelector('.app-bills');
const appCurrency = document.querySelector('.app-currency');
const appAtm = document.querySelector('.app-atm');

// Кнопки навигации

const exitCurrencyButton = document.getElementById('exit-currency');
const billsCurrencyButton = document.getElementById('bills-currency');
const atmCurrencyButton = document.getElementById('atm-currency');

// Контейнер для валют пользователя

const ownCurrencyWrapper = document.querySelector('.app-currency__own');

// Селект

const selectorFrom = document.getElementById('select-from');
const selectorTo = document.getElementById('select-to');
const selectorListFrom = document.getElementById('list-from');
const selectorListTo = document.getElementById('list-to');
const selectorTextFrom = document.getElementById('text-from');
const selectorTextTo = document.getElementById('text-to');

// Кнопка обмена валют

const transactionButton = document.querySelector('.app-currency__button');

// Поле ввода суммы обмена

const transactoinInput = document.querySelector('.app-currency__input');

// Контейнер для изменения курса валют

const currencyChangeWrapper = document.querySelector(
  '.app-currency__real-time'
);

// Бургер

const burger = document.getElementById('currency-burger');

// Бургер-меню

const burgerMenu = document.getElementById('currency-burger-menu');

// Лоадеры

const oweCurrencyLoader = document.getElementById('own-currency-loader');

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

// Функция создания валют

export default async function createUserCurrency() {
  const data = await getUserCurrency(userData.slug);

  for (let currency in data.payload) {
    const row = document.createElement('div');
    row.classList.add('app-currency__row');

    const currencyName = document.createElement('p');
    currencyName.classList.add('app-currency__own-currency', 'text');
    currencyName.textContent = data.payload[currency].code;

    const currencyAmount = document.createElement('p');
    currencyAmount.classList.add('app-currency__own-amount', 'text');
    currencyAmount.textContent = Number(
      data.payload[currency].amount + ''
    ).toFixed(2);

    row.append(currencyName, currencyAmount);
    ownCurrencyWrapper.append(row);
  }
}

// Нажатие на кнопку выхода

exitCurrencyButton.addEventListener('click', () => {
  appCurrency.style.display = 'none';
  appEntry.style.display = 'block';
  history.pushState(null, '', 'main.html');
  ownCurrencyWrapper.innerHTML = '';
  currencyChangeWrapper.innerHTML = '';

  hideBurgerMenu();
  resetSelector();
});

// Нажатие на кнопку банкоматов

atmCurrencyButton.addEventListener('click', () => {
  appCurrency.style.display = 'none';
  appAtm.style.display = 'block';
  history.pushState(null, '', 'atm');

  hideBurgerMenu();
  resetSelector();
});

// Нажатие на кнопку счетов

billsCurrencyButton.addEventListener('click', () => {
  appCurrency.style.display = 'none';
  appBills.style.display = 'block';
  history.pushState(null, '', 'bills');

  hideBurgerMenu();
  resetSelector();
});

// Нажатие на выпадающий список счёта from

selectorFrom.addEventListener('click', () => {
  selectorFrom.classList.toggle('app-currency__select--active');
  selectorListFrom.classList.toggle('app-currency__list--visible');
});

// Нажатие на один из пунктов выпадающего списка  счёта from

selectorListFrom.addEventListener('click', (event) => {
  selectorTextFrom.textContent = event.target.textContent;
  userData.from = selectorTextFrom.textContent;
});

// Нажатие на выпадающий список счёта to

selectorTo.addEventListener('click', () => {
  selectorTo.classList.toggle('app-currency__select--active');
  selectorListTo.classList.toggle('app-currency__list--visible');
});

// Нажатие на один из пунктов выпадающего списка счёта to

selectorListTo.addEventListener('click', (event) => {
  selectorTextTo.textContent = event.target.textContent;
  userData.to = selectorTextTo.textContent;
});

// Функция сброса выпадающего списка

function resetSelector() {
  selectorTextFrom.textContent = 'Валюта';
  selectorFrom.classList.remove('app-currency__select--active');
  selectorListFrom.classList.remove('app-currency__list--visible');

  selectorTextTo.textContent = 'Валюта';
  selectorTo.classList.remove('app-currency__select--active');
  selectorListTo.classList.remove('app-currency__list--visible');
}

// Смена адреса страницы

window.addEventListener('popstate', resetSelector);

// Нажатие на кнопку обмена валют

transactionButton.addEventListener('click', async () => {
  const amount = transactoinInput.value;
  transactoinInput.value = '';

  if (amount >= 0) {
    if (userData.from !== '' && userData.to !== '') {
      oweCurrencyLoader.style.display = 'block';

      const response = await tradeCurrency(
        userData.from,
        userData.to,
        amount,
        userData.slug
      );
      if (response.error === '') {
        resetSelector();
        userData.from = '';
        userData.to = '';

        ownCurrencyWrapper.innerHTML = '';
        createUserCurrency();
      } else if (response.error === 'Overdraft prevented') {
        resetSelector();
        transactoinInput.setAttribute('placeholder', 'Недостаточно средств');
      }
      oweCurrencyLoader.style.display = 'none';
    }
  } else {
    transactoinInput.setAttribute(
      'placeholder',
      'Нельзя вводить отрицательное значение'
    );
  }
});

// Фокус на поле ввода суммы обмена валют

transactoinInput.addEventListener('focus', () => {
  transactoinInput.setAttribute('placeholder', 'Введите сумму');
});
