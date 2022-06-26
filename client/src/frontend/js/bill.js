import userData from './entry.js';
import { createChartBar } from './chart.js';
import { createBillTable } from './table.js';
import { moneyTransaction, getUserBills, getBillData } from './getData.js';
import { createUserBills } from './processingData.js';

// Основные секции

const appEntry = document.querySelector('.app-entry');
const appBills = document.querySelector('.app-bills');
const appBill = document.querySelector('.app-bill');
const appCurrency = document.querySelector('.app-currency');
const appAtm = document.querySelector('.app-atm');

// Кнопки навигации

const atmBillButton = document.getElementById('atm-bill');
const billsBillButton = document.getElementById('bills-bill');
const currencyBillButton = document.getElementById('currency-bill');
const exitBillButton = document.getElementById('exit-bill');

// Элементы счёта

const billNumber = document.querySelector('.app-bill__number');
const billBalance = document.querySelector('.app-bill__sum');

// Кнопка назад

const backButton = document.querySelector('.app-bill__button');

// Контейнер для платёжной системы

const cardType = document.getElementById('card-type');

// Форма перевода

const billNumberInput = document.getElementById('bill-number');
const billCountInput = document.getElementById('transfer-count');
const transferButton = document.querySelector('.app-bill-transfer__button');

// Автодополнение

const buttonWrapper = document.querySelector('.app-bill-transfer__box');
const billNumberWrapper = document.getElementById('blll-number-wrapper');

// Таблица и график

const table = document.querySelector('.app-bill-table__body');
const chartBar = document.getElementById('chart_div');

// Контейнер для счетов

const cardWrapper = document.querySelector('.app-bills-cards__container');

// Бургер

const burger = document.getElementById('bill-burger');

// Бургер-меню

const burgerMenu = document.getElementById('bill-burger-menu');

// Лоадеры

const chardLoader = document.getElementById('chibi-chard-loader');
const tableLoader = document.getElementById('chibi-table-loader');

// Функция скрытия бургер-меню

export function hideBurgerMenu() {
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

// Функция перерисовки счетов

export async function reCreateBills() {
  cardWrapper.innerHTML = '';
  userData.payloads = await getUserBills(userData.slug);
  createUserBills(userData.payloads.payload);
}

// Функция отрисовки данных счёта

export default function createBillPage(data) {
  billNumber.textContent = `№ ${data.account}`;
  billBalance.textContent =
    (data.balance + '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + ' ₽';
}

// Функция удаления ошибки перевода

function deleteTransactionError() {
  const error = document.querySelector('.app-bill-transfer-error');
  if (error !== null) error.remove();
}

// Перевод на другой счёт

transferButton.addEventListener('click', async () => {
  let localArray = [];
  const ownBillNumber = userData.bill;
  const numberBill = billNumberInput.value;
  const transferCount = billCountInput.value;

  if (localStorage.getItem('bills')) {
    localArray = JSON.parse(localStorage.getItem('bills'));
  }

  if (
    numberBill !== '' &&
    transferCount !== '' &&
    transferCount < ownBillNumber.balance &&
    transferCount > 0
  ) {
    await moneyTransaction(
      ownBillNumber.account,
      numberBill,
      transferCount,
      userData.slug
    );

    if (localArray.indexOf(numberBill) === -1) {
      localArray.push(numberBill);
      localStorage.setItem('bills', JSON.stringify(localArray));
    }

    const response = await getBillData(userData.bill.account, userData.slug);

    billBalance.textContent =
      (response.payload.balance + '').replace(
        /(\d)(?=(\d\d\d)+([^\d]|$))/g,
        '$1 '
      ) + ' ₽';
    deleteTransactionError();
  } else {
    const error = document.createElement('p');
    error.textContent = 'Недостаточно средств на счету';
    error.classList.add('app-bill-transfer-error', 'text');
    buttonWrapper.prepend(error);
  }

  chardLoader.style.display = 'block';
  tableLoader.style.display = 'block';

  const newBill = await getBillData(userData.bill.account, userData.slug);
  userData.bill = newBill.payload;

  chartBar.innerHTML = '';
  table.innerHTML = '';

  createChartBar(userData.bill, 6);
  createBillTable(userData.bill);

  chardLoader.style.display = 'none';
  tableLoader.style.display = 'none';

  billNumberInput.value = '';
  billCountInput.value = '';
});

// Функция удаления элементов

function removeElements() {
  const autocompleteArray = document.querySelectorAll(
    '.app-bill-transfer-autocomplete'
  );
  for (let element of autocompleteArray) {
    element.remove();
  }
  if (cardType.classList.contains('card-type-MIR')) {
    cardType.classList.remove('card-type-MIR');
  }
  if (cardType.classList.contains('card-type-visa')) {
    cardType.classList.remove('card-type-visa');
  }
  if (cardType.classList.contains('card-type-mastercard')) {
    cardType.classList.remove('card-type-mastercard');
  }
}

// Функция создания автодополнения

function createAutocomplete(array, value) {
  let shift = 0;

  removeElements();

  for (let element of array) {
    if (element.startsWith(value)) {
      const wrapper = document.createElement('div');
      wrapper.textContent = element;
      wrapper.classList.add('app-bill-transfer-autocomplete');
      wrapper.style.top = `${100 * shift}%`;
      billNumberWrapper.append(wrapper);

      shift++;

      wrapper.addEventListener('mousedown', () => {
        billNumberInput.value = wrapper.textContent;

        removeElements();
      });
    }
  }
}

// Функция получения данных для автодополнения из localStorage

function getLocalAutocomplete() {
  if (localStorage.getItem('bills')) {
    const localArray = JSON.parse(localStorage.getItem('bills'));
    createAutocomplete(localArray, billNumberInput.value);
    if (billNumberInput.value.length === 16) {
      if (billNumberInput.value.startsWith('2')) {
        cardType.classList.add('card-type-MIR');
      } else if (billNumberInput.value.startsWith('4')) {
        cardType.classList.add('card-type-visa');
      } else if (billNumberInput.value.startsWith('5')) {
        cardType.classList.add('card-type-mastercard');
      }
    }
  }
}

// Фокус на поле автодополнения

billNumberInput.addEventListener('focus', getLocalAutocomplete);

// Ввод значения в поле автодополнения

billNumberInput.addEventListener('input', getLocalAutocomplete);

// Снятие фокуса с поля автодополнения

billNumberInput.addEventListener('blur', removeElements);

// Нажатие на кнопку банкоматов

atmBillButton.addEventListener('click', async () => {
  appAtm.style.display = 'block';
  appBill.style.display = 'none';

  hideBurgerMenu();
  reCreateBills();
  history.pushState(null, '', 'atm');
});

// Нажатие на кнопку счетов

billsBillButton.addEventListener('click', async () => {
  appBills.style.display = 'block';
  appBill.style.display = 'none';

  hideBurgerMenu();
  reCreateBills();
  history.pushState(null, '', 'bills');
});

// Нажатие на кнопку валют

currencyBillButton.addEventListener('click', async () => {
  appBill.style.display = 'none';
  appCurrency.style.display = 'block';

  hideBurgerMenu();
  reCreateBills();
  history.pushState(null, '', 'currency');
});

// Нажатие на кнопку выхода

exitBillButton.addEventListener('click', () => {
  appEntry.style.display = 'block';
  appBill.style.display = 'none';
  history.pushState(null, '', 'main.html');

  hideBurgerMenu();
});

// Удаление ошибки при выходе назад

window.addEventListener('popstate', () => {
  deleteTransactionError();
  hideBurgerMenu();
});

// Нажатие на кнопку вовзрата

backButton.addEventListener('click', async () => {
  appBills.style.display = 'block';
  appBill.style.display = 'none';
  table.innerHTML = '';

  hideBurgerMenu();
  reCreateBills();
  history.pushState(null, '', 'bills');
});
