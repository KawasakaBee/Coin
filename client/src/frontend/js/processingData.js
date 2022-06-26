import creatBillCard from './bills.js';

// Контейнер для изменения курса валют

const currencyChangeWrapper = document.querySelector(
  '.app-currency__real-time'
);

const date = {
  1: 'Января',
  2: 'Февраля',
  3: 'Марта',
  4: 'Апреля',
  5: 'Мая',
  6: 'Июня',
  7: 'Июля',
  8: 'Августа',
  9: 'Сентября',
  10: 'Октября',
  11: 'Ноября',
  12: 'Декабря',
};

// Функция обработки даты транзакции

export function processingDate(data) {
  data.split('');
  return `${data[8]}${data[9]} ${date[parseInt(data[5] + data[6])]} ${data[0]}${
    data[1]
  }${data[2]}${data[3]}`;
}

// Функция обработки данных

export function createUserBills(billArray) {
  let count = 1;
  for (let bill of billArray) {
    const spaceBalance = (bill.balance + '').replace(
      /(\d)(?=(\d\d\d)+([^\d]|$))/g,
      '$1 '
    );
    let date;
    bill.transactions.length > 0
      ? (date = processingDate(bill.transactions[0].date))
      : (date = 'Транзакций ещё не было');

    creatBillCard(bill.account, spaceBalance, date, count);

    count++;
  }
}

// Функция сортировки по номеру счёта

export function sortByBillNumber(arr) {
  return arr.payloads.payload.sort(function (a, b) {
    if (a.account > b.account) {
      return 1;
    }
    if (a.account < b.account) {
      return -1;
    }
    return 0;
  });
}

// Функция сортировки по балансу

export function sortByBalance(arr) {
  return arr.payloads.payload.sort(function (a, b) {
    if (a.balance > b.balance) {
      return 1;
    }
    if (a.balance < b.balance) {
      return -1;
    }
    return 0;
  });
}

// Функция сортировки по дате транзакции

export function sortByDate(arr) {
  return arr.payloads.payload.sort(function (a, b) {
    if (a.transactions[0] === undefined || b.transactions[0] === undefined)
      return;
    if (a.transactions[0].date > b.transactions[0].date) {
      return 1;
    }
    if (a.transactions[0].date < b.transactions[0].date) {
      return -1;
    }
    return 0;
  });
}

// Функция обработки данных изменения курса валют

export function currencyChangeProcessing(data, array) {
  currencyChangeWrapper.innerHTML = '';

  if (array.length === 21) {
    array.splice(0, 1);
  }
  array.push(JSON.parse(data));

  for (let element of array) {
    const elementWrapper = document.createElement('div');
    elementWrapper.classList.add('app-currency__change-wrapper');

    const currencyName = document.createElement('p');
    currencyName.textContent = `${element.from}/${element.to}`;
    currencyName.classList.add('app-currency__change-name', 'text');

    const currencyAmount = document.createElement('p');
    currencyAmount.textContent = element.rate;
    currencyAmount.classList.add('app-currency__change-amount', 'text');

    if (element.change === 1) {
      elementWrapper.classList.add('app-currency__currency-up');
    } else if (element.change === -1) {
      elementWrapper.classList.add('app-currency__currency-down');
    }

    elementWrapper.append(currencyName, currencyAmount);

    currencyChangeWrapper.append(elementWrapper);
  }
}
