import userData from './entry.js';
import createBillPage from './bill.js';
import { createChartBar } from './chart.js';
import { createBillTable } from './table.js';
import { createNewUserBill, getUserBills, getBillData } from './getData.js';
import {
  createUserBills,
  sortByBillNumber,
  sortByBalance,
  sortByDate,
} from './processingData.js';

// Основные секции

const appEntry = document.querySelector('.app-entry');
const appBills = document.querySelector('.app-bills');
const appBill = document.querySelector('.app-bill');
const appCurrency = document.querySelector('.app-currency');
const appAtm = document.querySelector('.app-atm');

// Кнопки навигации

const currencyButton = document.getElementById('currency-bills');
const exitButton = document.getElementById('exit-bills');
const atmButton = document.getElementById('atm-bills');

// Выпадающий список

const selector = document.querySelector('.app-bills-menu__select');
const selectorText = document.querySelector('.app-bills-menu__text');
const selectorList = document.querySelector('.app-bills-menu__list');

const numberSort = document.getElementById('number-sort');
const balanceSort = document.getElementById('balance-sort');
const transactionSort = document.getElementById('transaction-sort');

// Контейнер и кнопка создания счета

const cardWrapper = document.querySelector('.app-bills-cards__container');
const createBillButtons = document.querySelector('.app-bills-menu__button');

// Бургер

const burger = document.getElementById('bills-burger');

// Бургер-меню

const burgerMenu = document.getElementById('bills-burger-menu');

// Лоадеры

const chardLoader = document.getElementById('chibi-chard-loader');
const tableLoader = document.getElementById('chibi-table-loader');

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

// Нажатие на выпадающий список

selector.addEventListener('click', () => {
  selector.classList.toggle('app-bills-menu__select--active');
  selectorList.classList.toggle('app-bills-menu__list--visible');
});

// Нажатие на один из пунктов выпадающего списка

selectorList.addEventListener('click', (event) => {
  selectorText.textContent = event.target.textContent;
});

// Функция создания карточки счёта

export default function creatBillCard(title, bill, transaction, id) {
  const card = document.createElement('div');
  card.classList.add('app-bills-card');
  card.setAttribute('id', id);

  const cardTitle = document.createElement('h3');
  cardTitle.textContent = title;
  cardTitle.classList.add('app-bills-card__title', 'title');

  const cardBill = document.createElement('p');
  cardBill.textContent = bill + ' ₽';
  cardBill.classList.add('app-bills-card__bill', 'text');

  const cardBottom = document.createElement('div');
  cardBottom.classList.add('app-bills-card__bottom');

  const cardTransaction = document.createElement('div');
  cardTransaction.classList.add('app-bills-card__transaction');

  const cardDescription = document.createElement('p');
  cardDescription.textContent = 'Последняя транзакция';
  cardDescription.classList.add('app-bills-card__description', 'text');

  const cardDate = document.createElement('p');
  cardDate.textContent = transaction;
  cardDate.classList.add('app-bills-card__date', 'text');

  const cardButton = document.createElement('button');
  cardButton.textContent = 'Открыть';
  cardButton.classList.add('app-bills-card__button');

  cardTransaction.append(cardDescription, cardDate);
  cardBottom.append(cardTransaction, cardButton);
  card.append(cardTitle, cardBill, cardBottom);

  cardWrapper.append(card);

  // Нажатие на карточку счёта

  cardButton.addEventListener('click', async (e) => {
    appBills.style.display = 'none';
    appBill.style.display = 'block';

    chardLoader.style.display = 'block';
    tableLoader.style.display = 'block';

    const data = await getBillData(
      e.target.parentNode.parentNode.firstChild.textContent,
      userData.slug
    );
    userData.bill = data.payload;
    history.pushState(null, '', 'bill');

    hideBurgerMenu();
    resetSelector();
    createBillPage(userData.bill);
    createChartBar(userData.bill, 6);

    chardLoader.style.display = 'none';
    tableLoader.style.display = 'none';

    createBillTable(userData.bill);
  });
}

// Изменение размера таблицы при изменении разера окна

window.addEventListener(
  'resize',
  function () {
    createChartBar(userData.bill, 6);
  },
  true
);

// Функция сброса выпадающего списка

function resetSelector() {
  selectorText.textContent = 'Сортировка';
  selector.classList.remove('app-bills-menu__select--active');
  selectorList.classList.remove('app-bills-menu__list--visible');

  numberSort.classList.remove('app-bills-menu__item--selected');
  balanceSort.classList.remove('app-bills-menu__item--selected');
  transactionSort.classList.remove('app-bills-menu__item--selected');
}

// Нажатие на кнопку создания нового счёта

createBillButtons.addEventListener('click', async () => {
  await createNewUserBill(userData.slug);
  cardWrapper.innerHTML = '';

  userData.payloads = await getUserBills(userData.slug);
  createUserBills(userData.payloads.payload);
});

// Нажатие на сортировку по номеру

numberSort.addEventListener('click', async () => {
  numberSort.classList.add('app-bills-menu__item--selected');
  balanceSort.classList.remove('app-bills-menu__item--selected');
  transactionSort.classList.remove('app-bills-menu__item--selected');
  cardWrapper.innerHTML = '';

  const arr = await sortByBillNumber(userData);
  createUserBills(arr);
});

// Нажатие на сортировку по балансу

balanceSort.addEventListener('click', async () => {
  cardWrapper.innerHTML = '';
  numberSort.classList.remove('app-bills-menu__item--selected');
  balanceSort.classList.add('app-bills-menu__item--selected');
  transactionSort.classList.remove('app-bills-menu__item--selected');

  const arr = await sortByBalance(userData);
  createUserBills(arr);
});

// Нажатие на сортировку по переводам

transactionSort.addEventListener('click', async () => {
  numberSort.classList.remove('app-bills-menu__item--selected');
  balanceSort.classList.remove('app-bills-menu__item--selected');
  transactionSort.classList.add('app-bills-menu__item--selected');
  cardWrapper.innerHTML = '';

  const arr = await sortByDate(userData);
  createUserBills(arr);
});

// Нажатие на кнопку банкоматов

atmButton.addEventListener('click', () => {
  appBills.style.display = 'none';
  appAtm.style.display = 'block';

  hideBurgerMenu();
  resetSelector();
  history.pushState(null, '', 'atm');
});

// Нажатие на кнопку валют

currencyButton.addEventListener('click', () => {
  appBills.style.display = 'none';
  appCurrency.style.display = 'block';

  hideBurgerMenu();
  resetSelector();
  history.pushState(null, '', 'currency');
});

// Нажатие на кнопку выхода

exitButton.addEventListener('click', () => {
  appEntry.style.display = 'block';
  appBills.style.display = 'none';

  hideBurgerMenu();
  resetSelector();
  history.pushState(null, '', 'main.html');
});

// Смена адреса страницы

window.addEventListener('popstate', () => {
  resetSelector();
  hideBurgerMenu();
});
