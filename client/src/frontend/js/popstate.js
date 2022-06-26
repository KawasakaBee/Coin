import userData from './entry.js';
import { reCreateBills } from './bill.js';
import { createBillTable } from './table.js';
import { createDetailedBillTable } from './table.js';

// Основные секции

const appEntry = document.querySelector('.app-entry');
const appBills = document.querySelector('.app-bills');
const appBill = document.querySelector('.app-bill');
const appInfo = document.querySelector('.app-info');
const appCurrency = document.querySelector('.app-currency');
const appAtm = document.querySelector('.app-atm');

// Таблицы

const table = document.querySelector('.app-bill-table__body');
const detailedTable = document.querySelector('.app-info-table__body');

// Контейнер для изменения курса валют

const currencyChangeWrapper = document.querySelector(
  '.app-currency__real-time'
);

// Контейнер для карты

const cardContainer = document.getElementById('map');

// Смена адреса страницы

window.addEventListener('popstate', () => {
  reCreateBills();
  table.innerHTML = '';
  detailedTable.innerHTML = '';
  currencyChangeWrapper.innerHTML = '';
  cardContainer.innerHTML = '';
  createBillTable(userData.bill);
  createDetailedBillTable(userData.bill);

  switch (window.location.pathname) {
    case '/main.html':
      appEntry.style.display = 'block';
      appBills.style.display = 'none';
      appBill.style.display = 'none';
      appInfo.style.display = 'none';
      appCurrency.style.display = 'none';
      appAtm.style.display = 'none';
      break;

    case '/bills':
      appEntry.style.display = 'none';
      appBills.style.display = 'block';
      appBill.style.display = 'none';
      appInfo.style.display = 'none';
      appCurrency.style.display = 'none';
      appAtm.style.display = 'none';
      break;

    case '/bill':
      appEntry.style.display = 'none';
      appBills.style.display = 'none';
      appBill.style.display = 'block';
      appInfo.style.display = 'none';
      appCurrency.style.display = 'none';
      appAtm.style.display = 'none';
      break;

    case '/info':
      appEntry.style.display = 'none';
      appBills.style.display = 'none';
      appBill.style.display = 'none';
      appInfo.style.display = 'block';
      appCurrency.style.display = 'none';
      appAtm.style.display = 'none';
      break;

    case '/currency':
      appEntry.style.display = 'none';
      appBills.style.display = 'none';
      appBill.style.display = 'none';
      appInfo.style.display = 'none';
      appCurrency.style.display = 'block';
      appAtm.style.display = 'none';
      break;

    case '/atm':
      appEntry.style.display = 'none';
      appBills.style.display = 'none';
      appBill.style.display = 'none';
      appInfo.style.display = 'none';
      appCurrency.style.display = 'none';
      appAtm.style.display = 'block';
      break;
  }
});
