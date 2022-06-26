import { currencyChangeProcessing } from './processingData.js';

// Получение токена

export async function getUserToken(userLogin, userPassword) {
  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      login: userLogin,
      password: userPassword,
    }),
  });
  return response.json();
}

// Получение счетов пользователя

export async function getUserBills(token) {
  const response = await fetch('http://localhost:3000/accounts', {
    method: 'GET',
    headers: {
      Authorization: `Basic ${token}`,
    },
  });
  return response.json();
}

// Создание нового счёта

export async function createNewUserBill(token) {
  const response = await fetch('http://localhost:3000/create-account', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${token}`,
    },
  });
  return response.json();
}

// Получение подробных данных о счёте

export async function getBillData(id, token) {
  const response = await fetch(`http://localhost:3000/account/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${token}`,
    },
  });
  return response.json();
}

// Перевод с счёта на счёт

export async function moneyTransaction(from, to, amount, token) {
  const response = await fetch('http://localhost:3000/transfer-funds', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
    body: JSON.stringify({ from, to, amount }),
  });
  return response.json();
}

// Получение данны валют пользователя

export async function getUserCurrency(token) {
  const response = await fetch('http://localhost:3000/currencies', {
    method: 'GET',
    headers: {
      Authorization: `Basic ${token}`,
    },
  });
  return response.json();
}

// Обмен валют

export async function tradeCurrency(from, to, amount, token) {
  const response = await fetch('http://localhost:3000/currency-buy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
    body: JSON.stringify({ from, to, amount }),
  });
  return response.json();
}

// Открытие websocket-соединения

export function createWebsocket() {
  const socket = new WebSocket('ws://localhost:3000/currency-feed');

  let currencyArray = [];

  socket.onmessage = function (event) {
    currencyChangeProcessing(event.data, currencyArray);
  };
}

// Получение списка точек банкоматов

export async function getAtmPositions(token) {
  const response = await fetch('http://localhost:3000/banks', {
    method: 'GET',
    headers: {
      Authorization: `Basic ${token}`,
    },
  });
  return response.json();
}
