/// <reference types="cypress" />

const cardsCount = 4;

describe('Авторизация', () => {
  it('Запуск приложения', () => {
    cy.visit('http://localhost:5000/main.html');
  });

  it('Существование формы', () => {
    cy.get('.entry-form').should('be.visible');
  });

  it('Ввод значений в поля авторизации', () => {
    cy.get('#login').type('developer');
    cy.get('#password').type('skillbox');
  });

  it('Нажатие на кнопку входа', () => {
    cy.get('.entry-form__button').click();
  });

  it('Проверка входа в приложение', () => {
    cy.get('.app-bills').should('be.visible');
  });
});

describe('Перевод со счёта на счёт', () => {
  it('Нажатие на кнопку счёта', () => {
    cy.get('#1>.app-bills-card__bottom>.app-bills-card__button').click();
  });

  it('Проверка открытия счёта', () => {
    cy.get('.app-bill').should('be.visible');
  });

  it('Ввод значений в поля перевода', () => {
    cy.get('#bill-number').type('56765042464818511266112613');
    cy.get('#transfer-count').type('20000');
  });

  it('Перевод на другой счёт', () => {
    cy.get('.app-bill__sum').then((val) => {
      const balance = val.text();

      cy.get('.app-bill-transfer__button').click();

      cy.wait(500);

      cy.get('.app-bill__sum').should('not.have.text', balance);
    });
  });

  it('Нажатие на кнопку возврата к списку счетов', () => {
    cy.get('.app-bill__button').click();
  });

  it('Проверка возврата к списку счетов', () => {
    cy.get('.app-bills').should('be.visible');
  });
});

describe('Создание нового счёта и перевод с него', () => {
  it('Нажатие на кнопку создания нового счёта', () => {
    cy.get('.app-bills-menu__button').click();
  });

  it('Перевод на новый счёт', () => {
    let elementsCount = 0;
    cy.get('.app-bills-card')
      .each((element) => {
        if (parseInt(element[0].id) > elementsCount) {
          elementsCount = parseInt(element[0].id);
        }
      })
      .then(() => {
        cy.get(`#${elementsCount}>.app-bills-card__title`).then((title) => {
          cy.get('#1>.app-bills-card__bottom>.app-bills-card__button').click();

          cy.get('.app-bill').should('be.visible');

          cy.get('#bill-number').type(title.text());
          cy.get('#transfer-count').type('10000');

          cy.get('.app-bill__sum').then((val) => {
            const balance = val.text();

            cy.get('.app-bill-transfer__button').click();

            cy.wait(500);

            cy.get('.app-bill__sum').should('not.have.text', balance);
          });
          cy.get('.app-bill__button').click();
        });
        cy.get(
          `#${elementsCount}>.app-bills-card__bottom>.app-bills-card__button`
        ).click();
      });
  });

  it('Ввод значений в поля перевода', () => {
    cy.get('#bill-number').type('74213041477477406320783754');
    cy.get('#transfer-count').type('2000');
  });

  it('Перевод с нового счёта', () => {
    cy.get('.app-bill__sum').then((val) => {
      const balance = val.text();

      cy.get('.app-bill-transfer__button').click();

      cy.wait(500);

      cy.get('.app-bill__sum').should('not.have.text', balance);
    });
  });
});
