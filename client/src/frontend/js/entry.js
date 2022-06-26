import { getUserToken, getUserBills, createWebsocket } from './getData.js';
import createUserCurrency from './currency.js';
import { createUserBills } from './processingData.js';
import createMap from './map.js';

// Основные секции

const appEntry = document.querySelector('.app-entry');
const appBills = document.querySelector('.app-bills');

// Поля формы входа

const loginInput = document.getElementById('login');
const passwordInput = document.getElementById('password');
const entryButton = document.querySelector('.entry-form__button');

// Ошибка при неправильном логине или пароле

const entryError = document.querySelector('.entry-form-error');

// Объект, в котором будет храниться вся информация о счетах пользователя

const userData = {};

// Контейнер для валют пользователя

const ownCurrencyWrapper = document.querySelector('.app-currency__own');

// Лоадеры

const oweCurrencyLoader = document.getElementById('own-currency-loader');
const cardLoader = document.getElementById('card-loader');

// Функция валидции

function showError(input, errorType) {
  input.classList.add('validation-error');
  input.setAttribute('placeholder', `${errorType}`);
  input.value = '';
}

// Функция взаимодействия с полями ввода

function formValidation(input) {
  const validationRegExp = /^\S*$/;

  if (input.value.length > 5 && input.value.length < 21) {
    if (validationRegExp.test(input.value)) {
      input.classList.remove('validation-error');
      input.setAttribute('placeholder', `Введите значение`);
      return input.value;
    } else {
      showError(input, 'Строка не должна содержать пробельные символы');
    }
  } else {
    showError(input, 'Длина должна быть от 6 до 20 символов');
  }
  return false;
}

// Нажатие на кнопку входа

entryButton.addEventListener('click', async () => {
  const login = formValidation(loginInput);
  const password = formValidation(passwordInput);

  if (login && password) {
    const userToken = await getUserToken(login, password);
    if (userToken.payload === null) {
      entryError.style.display = 'block';
    } else {
      loginInput.value = '';
      passwordInput.value = '';
      userData.slug = userToken.payload.token;
      entryError.style.display = 'none';

      oweCurrencyLoader.style.loader = 'block';
      cardLoader.style.loader = 'block';

      userData.payloads = await getUserBills(userData.slug);
      appEntry.style.display = 'none';
      appBills.style.display = 'block';
      history.pushState(null, '', 'bills');

      ownCurrencyWrapper.innerHTML = '';

      createUserBills(userData.payloads.payload);
      createUserCurrency();
      createWebsocket();
      createMap(userData);

      oweCurrencyLoader.style.loader = 'none';
      cardLoader.style.loader = 'none';
    }
  }
});

export default userData;
