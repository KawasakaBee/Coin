// Тест функции преобразования даты

function processingDate(data) {
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

  data.split('');
  return `${data[8]}${data[9]} ${date[parseInt(data[5] + data[6])]} ${data[0]}${
    data[1]
  }${data[2]}${data[3]}`;
}

test('Правильный тест даты', () => {
  expect(processingDate('2020-09-21T10:19:41.656Z')).toBe('21 Сентября 2020');
});

test('Неправильный тест даты', () => {
  expect(processingDate('2021-04-14T10:19:41.656Z')).not.toBe(
    '21 Сентября 2020'
  );
});

// Тест сортировки

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

test('Правильный тест сортировки', () => {
  expect(
    sortByBillNumber({
      payloads: {
        payload: [
          21351235, 34253263426, 32542334, 5475, 1234, 56857854, 123421,
          12344215,
        ],
      },
    })
  ).toStrictEqual([
    21351235, 34253263426, 32542334, 5475, 1234, 56857854, 123421, 12344215,
  ]);
});

test('Правильный тест сортировки', () => {
  expect(
    sortByBillNumber({
      payloads: {
        payload: [
          21351235, 34253263426, 32542334, 5475, 1234, 56857854, 123421,
          12344215,
        ],
      },
    })
  ).not.toStrictEqual([
    32542334, 1234, 5475, 12344215, 123421, 21351235, 56857854, 34253263426,
  ]);
});
