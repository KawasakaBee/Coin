import userData from './entry.js';

// Таблицы

const table = document.querySelector('.app-bill-table__body');
const detailedTable = document.querySelector('.app-info-table__body');

// Пагинация

const paginationWrapper = document.querySelector(
  '.app-info-table__button-wrapper'
);
const backButton = document.getElementById('back-button');
const forwardButton = document.getElementById('forward-button');
const pageText = document.querySelector('.app-info-table__count');

// Объект для большой таблицы

const transactionsArray = {};

// Функция создания строк таблицы

function createTableRows(array, data, container) {
  for (let transaction of array) {
    const row = document.createElement('tr');
    row.classList.add('app-bill-table__row');

    const ownBill = document.createElement('td');
    ownBill.textContent = transaction.from;
    ownBill.classList.add('app-bill-table__column');

    const otherBill = document.createElement('td');
    otherBill.textContent = transaction.to;
    otherBill.classList.add('app-bill-table__column');

    const amount = document.createElement('td');
    amount.textContent =
      (transaction.amount + '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') +
      ' ₽';
    if (transaction.from !== data.account) {
      amount.textContent = '+ ' + amount.textContent;
      amount.style.color = '#76CA66';
    } else {
      amount.textContent = '- ' + amount.textContent;
      amount.style.color = '#FD4E5D';
    }
    amount.classList.add('app-bill-table__column');

    const date = transaction.date.split('-');

    const transactionDate = document.createElement('td');
    transactionDate.textContent =
      date[2].slice(0, 2) + '.' + date[1] + '.' + date[0];
    transactionDate.classList.add('app-bill-table__column');

    row.append(ownBill, otherBill, amount, transactionDate);
    container.append(row);
  }
}

// Функция создания обычной таблицы

export function createBillTable(array) {
  if (array.transactions.length === 0) return;

  const transactionsArray = [];

  for (
    let i = array.transactions.length - 1;
    i > array.transactions.length - 11;
    i--
  ) {
    if (array.transactions[i] !== undefined)
      transactionsArray.push(array.transactions[i]);
  }

  createTableRows(transactionsArray, array, table);
}

// Функция создания большой таблицы

export function createDetailedBillTable(array) {
  paginationWrapper.style.display = 'none';
  if (array.transactions.length === 0) return;

  paginationWrapper.style.display = 'inline-flex';

  const pageCount = Math.ceil(array.transactions.length / 25);

  userData.pageNumber = 1;
  pageText.textContent = `Страница ${userData.pageNumber} из ${pageCount}`;

  array.transactions = array.transactions.reverse();
  for (let i = 0; i < pageCount; i++) {
    transactionsArray[i] = array.transactions.slice(i * 25, (i + 1) * 25);
  }

  createTableRows(transactionsArray[0], array, detailedTable);
}

// Нажатие на кнопку предыдущей страницы

backButton.addEventListener('click', () => {
  if (userData.pageNumber !== 1) {
    detailedTable.innerHTML = '';
    userData.pageNumber--;
    pageText.textContent = `Страница ${userData.pageNumber} из ${Math.ceil(
      userData.bill.transactions.length / 25
    )}`;

    createTableRows(
      transactionsArray[userData.pageNumber - 1],
      userData.bill,
      detailedTable
    );
  }
});

// Нажатие на кнопку следующей страницы

forwardButton.addEventListener('click', () => {
  if (
    userData.pageNumber !== Math.ceil(userData.bill.transactions.length / 25)
  ) {
    detailedTable.innerHTML = '';
    userData.pageNumber++;
    pageText.textContent = `Страница ${userData.pageNumber} из ${Math.ceil(
      userData.bill.transactions.length / 25
    )}`;

    createTableRows(
      transactionsArray[userData.pageNumber - 1],
      userData.bill,
      detailedTable
    );
  }
});
