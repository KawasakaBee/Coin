// Создание стандартной таблицы

export function createChartBar(obj, count) {
  // Стандартные методы гугл графиков

  google.charts.load('current', { packages: ['corechart', 'bar'] });
  google.charts.setOnLoadCallback(drawBasic);

  // Создание объектов месяцев

  const firtsMonth = { month: 'янв', balance: 0 };
  const secondMonth = { month: 'фев', balance: 0 };
  const thirdMonth = { month: 'мар', balance: 0 };
  const fourthMonth = { month: 'апр', balance: 0 };
  const fifthMonth = { month: 'май', balance: 0 };
  const sixthMonth = { month: 'июн', balance: 0 };
  const seventhMonth = { month: 'июл', balance: 0 };
  const eighthMonth = { month: 'авг', balance: 0 };
  const ninthMonth = { month: 'сен', balance: 0 };
  const tenthMonth = { month: 'окт', balance: 0 };
  const eleventhMonth = { month: 'ноя', balance: 0 };
  const twelfthMonth = { month: 'дек', balance: 0 };

  // Массивы для месяцев

  const transactionsArray = [];
  const filteredArray = [];

  // Заголовок для графика и максимальная сумма на гарфике

  const monthArray = [['Year', '']];
  let maxNumber = 0;

  // Считывание баланса всех месяцев

  for (let transactoin of obj.transactions) {
    transactoin.amount = Math.round(transactoin.amount);
    if (obj.account !== transactoin.to) continue;
    switch (transactoin.date.split('-')[1]) {
      case '01':
        firtsMonth.balance += transactoin.amount;
        break;
      case '02':
        secondMonth.balance += transactoin.amount;
        break;
      case '03':
        thirdMonth.balance += transactoin.amount;
        break;
      case '04':
        fourthMonth.balance += transactoin.amount;
        break;
      case '05':
        fifthMonth.balance += transactoin.amount;
        break;
      case '06':
        sixthMonth.balance += transactoin.amount;
        break;
      case '07':
        seventhMonth.balance += transactoin.amount;
        break;
      case '08':
        eighthMonth.balance += transactoin.amount;
        break;
      case '09':
        ninthMonth.balance += transactoin.amount;
        break;
      case '10':
        tenthMonth.balance += transactoin.amount;
        break;
      case '11':
        eleventhMonth.balance += transactoin.amount;
        break;
      case '12':
        twelfthMonth.balance += transactoin.amount;
        break;
    }
  }

  transactionsArray.push(
    twelfthMonth,
    eleventhMonth,
    tenthMonth,
    ninthMonth,
    eighthMonth,
    seventhMonth,
    sixthMonth,
    fifthMonth,
    fourthMonth,
    thirdMonth,
    secondMonth,
    firtsMonth
  );

  // Берём только последние 6 месяцев с переводами
  if (count === 6) {
    for (let month of transactionsArray) {
      if (month.balance !== 0) {
        month.balance = Math.round(month.balance);
        filteredArray.unshift(month);
      }
      if (filteredArray.length === 6) break;
    }
  } else if (count === 12) {
    for (let month of transactionsArray) {
      month.balance = Math.round(month.balance);
      filteredArray.unshift(month);
    }
  }

  // Создание конечного массива для графика

  for (let obj of filteredArray) {
    monthArray.push([obj.month, obj.balance]);
    if (maxNumber < obj.balance) maxNumber = obj.balance;
  }

  // На случай отсутстви переводов

  if (monthArray.length < 2) monthArray.push(['Нет данных', 0]);

  // Отрисовка графика

  function drawBasic() {
    var data = google.visualization.arrayToDataTable(monthArray);

    // Опции графика

    var options = {
      height: 200,
      hAxis: {
        textStyle: {
          fontSize: 14,
          bold: true,
        },
      },
      vAxis: {
        textStyle: {
          fontSize: 14,
          bold: true,
        },
        gridlines: { color: 'transparent' },
        minValue: 0,
        ticks: [0, maxNumber],
      },
      chartArea: {
        backgroundColor: {
          stroke: '#000000',
          strokeWidth: 1,
        },
      },
      legend: {
        position: 'none',
      },
      series: {
        0: { targetAxisIndex: 1 },
      },
    };

    if (count === 6) {
      const chart = new google.visualization.ColumnChart(
        document.getElementById('chart_div')
      );
      chart.draw(data, options);
    } else if (count === 12) {
      const chart = new google.visualization.ColumnChart(
        document.getElementById('chart__div')
      );
      chart.draw(data, options);
    }
  }
}

// Создание двойной таблицы

export function createDoubleChartBar(obj) {
  google.charts.load('current', { packages: ['corechart', 'bar'] });
  google.charts.setOnLoadCallback(drawStacked);

  // Создание объекта месяцев

  const mounths = {
    firtsMonth: { month: 'янв', in: 0, out: 0 },
    secondMonth: { month: 'фев', in: 0, out: 0 },
    thirdMonth: { month: 'мар', in: 0, out: 0 },
    fourthMonth: { month: 'апр', in: 0, out: 0 },
    fifthMonth: { month: 'май', in: 0, out: 0 },
    sixthMonth: { month: 'июн', in: 0, out: 0 },
    seventhMonth: { month: 'июл', in: 0, out: 0 },
    eighthMonth: { month: 'авг', in: 0, out: 0 },
    ninthMonth: { month: 'сен', in: 0, out: 0 },
    tenthMonth: { month: 'окт', in: 0, out: 0 },
    eleventhMonth: { month: 'ноя', in: 0, out: 0 },
    twelfthMonth: { month: 'дек', in: 0, out: 0 },
  };

  // Основной массив с данными

  const newArray = [['Genre', 'out', 'in']];

  // Добавление сумм переводов

  for (let transactoin of obj.transactions) {
    transactoin.amount = Math.round(transactoin.amount);
    switch (transactoin.date.split('-')[1]) {
      case '01':
        obj.account !== transactoin.to
          ? (mounths.firtsMonth.in += transactoin.amount)
          : (mounths.firtsMonth.out += transactoin.amount);
        break;
      case '02':
        obj.account !== transactoin.to
          ? (mounths.secondMonth.in += transactoin.amount)
          : (mounths.secondMonth.out += transactoin.amount);
        break;
      case '03':
        obj.account !== transactoin.to
          ? (mounths.thirdMonth.in += transactoin.amount)
          : (mounths.thirdMonth.out += transactoin.amount);
        break;
      case '04':
        obj.account !== transactoin.to
          ? (mounths.fourthMonth.in += transactoin.amount)
          : (mounths.fourthMonth.out += transactoin.amount);
        break;
      case '05':
        obj.account !== transactoin.to
          ? (mounths.fifthMonth.in += transactoin.amount)
          : (mounths.fifthMonth.out += transactoin.amount);
        break;
      case '06':
        obj.account !== transactoin.to
          ? (mounths.sixthMonth.in += transactoin.amount)
          : (mounths.sixthMonth.out += transactoin.amount);
        break;
      case '07':
        obj.account !== transactoin.to
          ? (mounths.seventhMonth.in += transactoin.amount)
          : (mounths.seventhMonth.out += transactoin.amount);
        break;
      case '08':
        obj.account !== transactoin.to
          ? (mounths.eighthMonth.in += transactoin.amount)
          : (mounths.eighthMonth.out += transactoin.amount);
        break;
      case '09':
        obj.account !== transactoin.to
          ? (mounths.ninthMonth.in += transactoin.amount)
          : (mounths.ninthMonth.out += transactoin.amount);
        break;
      case '10':
        obj.account !== transactoin.to
          ? (mounths.tenthMonth.in += transactoin.amount)
          : (mounths.tenthMonth.out += transactoin.amount);
        break;
      case '11':
        obj.account !== transactoin.to
          ? (mounths.eleventhMonth.in += transactoin.amount)
          : (mounths.eleventhMonth.out += transactoin.amount);
        break;
      case '12':
        obj.account !== transactoin.to
          ? (mounths.twelfthMonth.in += transactoin.amount)
          : (mounths.twelfthMonth.out += transactoin.amount);
        break;
    }
  }

  // Добавление месяцев в массив

  newArray.push(
    [mounths.firtsMonth.month, mounths.firtsMonth.in, mounths.firtsMonth.out],
    [
      mounths.secondMonth.month,
      mounths.secondMonth.in,
      mounths.secondMonth.out,
    ],
    [mounths.thirdMonth.month, mounths.thirdMonth.in, mounths.thirdMonth.out],
    [
      mounths.fourthMonth.month,
      mounths.fourthMonth.in,
      mounths.fourthMonth.out,
    ],
    [mounths.fifthMonth.month, mounths.fifthMonth.in, mounths.fifthMonth.out],
    [mounths.sixthMonth.month, mounths.sixthMonth.in, mounths.sixthMonth.out],
    [
      mounths.seventhMonth.month,
      mounths.seventhMonth.in,
      mounths.seventhMonth.out,
    ],
    [
      mounths.eighthMonth.month,
      mounths.eighthMonth.in,
      mounths.eighthMonth.out,
    ],
    [mounths.ninthMonth.month, mounths.ninthMonth.in, mounths.ninthMonth.out],
    [mounths.tenthMonth.month, mounths.tenthMonth.in, mounths.tenthMonth.out],
    [
      mounths.eleventhMonth.month,
      mounths.eleventhMonth.in,
      mounths.eleventhMonth.out,
    ],
    [
      mounths.twelfthMonth.month,
      mounths.twelfthMonth.in,
      mounths.twelfthMonth.out,
    ]
  );

  // Максимальная сумма переводов

  let maxNumber = 0;
  let meanNumber = 0;

  for (let obj in mounths) {
    if (maxNumber < mounths[obj].in + mounths[obj].out) {
      maxNumber = mounths[obj].in + mounths[obj].out;
      mounths[obj].in < mounths[obj].out
        ? (meanNumber = mounths[obj].in)
        : (meanNumber = mounths[obj].out);
    }
  }

  // Основная функция отрисовки

  function drawStacked() {
    var data = google.visualization.arrayToDataTable(newArray);

    var options = {
      height: 200,
      isStacked: true,
      hAxis: {
        textStyle: {
          fontSize: 14,
          bold: true,
        },
        format: 'h:mm a',
        viewWindow: {
          min: [7, 30, 0],
          max: [17, 30, 0],
        },
        gridlines: { color: 'transparent' },
        minValue: 0,
      },
      vAxis: {
        textStyle: {
          fontSize: 14,
          bold: true,
        },
        gridlines: { color: 'transparent' },
        minValue: 0,
        ticks: [0, meanNumber, maxNumber],
      },
      chartArea: {
        backgroundColor: {
          stroke: '#000000',
          strokeWidth: 1,
        },
      },
      legend: {
        position: 'none',
      },
      series: {
        0: { targetAxisIndex: 1 },
        1: { targetAxisIndex: 1 },
      },
      colors: ['#FD4E5D', '#76CA66'],
    };

    var chart = new google.visualization.ColumnChart(
      document.getElementById('chart__double')
    );
    chart.draw(data, options);
  }
}
