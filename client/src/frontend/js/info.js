import userData from './entry.js';
import { reCreateBills, hideBurgerMenu } from './bill.js';
import { createChartBar, createDoubleChartBar } from './chart.js';
import { createDetailedBillTable } from './table.js';
import { getBillData } from './getData.js';

// Основные секции

const appEntry = document.querySelector('.app-entry');
const appBills = document.querySelector('.app-bills');
const appBill = document.querySelector('.app-bill');
const appInfo = document.querySelector('.app-info');
const appCurrency = document.querySelector('.app-currency');
const appAtm = document.querySelector('.app-atm');

// Контейнер графика и таблицы

const chartWrapper = document.querySelector('.app-bill-chart');
const tableWrapper = document.querySelector('.app-bill-table');

// Кнопки навигации

const billsInfoButton = document.getElementById('bills-info');
const currencyInfoButton = document.getElementById('currency-info');
const exitInfoButton = document.getElementById('exit-info');
const atmInfoButton = document.getElementById('atm-info');

// Элементы счёта

const infoNumber = document.querySelector('.app-info__number');
const infoBalance = document.querySelector('.app-info__sum');

// Таблица

const detailedTable = document.querySelector('.app-info-table__body');

// Кнопка возврата

const backButton = document.querySelector('.app-info__button');

// Бургер

const burger = document.getElementById('info-burger');

// Бургер-меню

const burgerMenu = document.getElementById('info-burger-menu');

// Лоадеры

const chardLoader = document.getElementById('chart-loader');
const doubleChardLoader = document.getElementById('double-chart-loader');
const tableLoader = document.getElementById('table-loader');

// Функция скрытия бургер-меню

function hideInfoBurgerMenu() {
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

// Изменение размера таблицы при изменении разера окна

window.addEventListener(
  'resize',
  function () {
    createChartBar(userData.bill, 12);
  },
  true
);

// Изменение размера подробной таблицы при изменении разера окна

window.addEventListener(
  'resize',
  function () {
    createDoubleChartBar(userData.bill);
  },
  true
);

// Функция отрисовки данных счёта

function createBillPage(data) {
  infoNumber.textContent = `№ ${data.account}`;
  infoBalance.textContent =
    (data.balance + '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + ' ₽';
}

// Функция показа блока информации счёта

async function showInfoBlock() {
  appBill.style.display = 'none';
  appInfo.style.display = 'block';

  chardLoader.style.display = 'block';
  doubleChardLoader.style.display = 'block';
  tableLoader.style.display = 'block';

  const newBill = await getBillData(userData.bill.account, userData.slug);
  userData.bill = newBill.payload;

  hideBurgerMenu();
  createBillPage(userData.bill);
  createChartBar(userData.bill, 12);
  createDoubleChartBar(userData.bill);
  createDetailedBillTable(userData.bill);

  chardLoader.style.display = 'none';
  doubleChardLoader.style.display = 'none';
  tableLoader.style.display = 'none';
  history.pushState(null, '', 'info');
}

// Нажатие на график

chartWrapper.addEventListener('click', showInfoBlock);

// Нажатие на таблицу

tableWrapper.addEventListener('click', showInfoBlock);

// Нажатие на кнопку банкоматов

atmInfoButton.addEventListener('click', async () => {
  appAtm.style.display = 'block';
  appInfo.style.display = 'none';
  detailedTable.innerHTML = '';

  hideInfoBurgerMenu();
  reCreateBills();
  history.pushState(null, '', 'atm');
});

// Нажатие на кнопку счетов

billsInfoButton.addEventListener('click', async () => {
  appBills.style.display = 'block';
  appInfo.style.display = 'none';
  detailedTable.innerHTML = '';

  hideInfoBurgerMenu();
  reCreateBills();
  history.pushState(null, '', 'bills');
});

// Нажатие на кнопку валют

currencyInfoButton.addEventListener('click', async () => {
  appInfo.style.display = 'none';
  appCurrency.style.display = 'block';
  detailedTable.innerHTML = '';

  hideInfoBurgerMenu();
  reCreateBills();
  history.pushState(null, '', 'currency');
});

// Нажатие на кнопку выхода

exitInfoButton.addEventListener('click', () => {
  appEntry.style.display = 'block';
  appInfo.style.display = 'none';
  detailedTable.innerHTML = '';
  history.pushState(null, '', 'main.html');

  hideInfoBurgerMenu();
});

// Нажатие на кнопку вовзрата

backButton.addEventListener('click', async () => {
  appBill.style.display = 'block';
  appInfo.style.display = 'none';
  detailedTable.innerHTML = '';

  hideInfoBurgerMenu();
  history.pushState(null, '', 'bill');
});
