describe('Cenário 1 - Cadastro - Signup Demoblaze', () => {

  beforeEach(() => {
    cy.visit('https://www.demoblaze.com/index.html');
  });

  it('Deve realizar cadastro com sucesso', () => {
    const username = `user_${Date.now()}`;
    const password = `pass123`;

    cy.get('#signin2').click();
    cy.get('#sign-username').should('be.visible');

    cy.get('#sign-username').type(username, { force: true });
    cy.get('#sign-password').type(password, { force: true });

    cy.intercept('POST', '**/signup').as('signup');
    cy.get('#signInModal .btn-primary').click();

    cy.on('window:alert', (msg) => {
      const mensagensValidas = [
        'Sign up successful.',
        'This user already exist.'
      ];
      expect(mensagensValidas).to.include(msg);
    });

    cy.wait('@signup').its('response.statusCode').should('eq', 200);
  });

});
describe('Cenário 2 - Login - Demoblaze', () => {

  beforeEach(() => {
    cy.visit('https://www.demoblaze.com/index.html');
  });

  it('Login - Caminho Negativo', () => {
    cy.get('#login2').click();
    cy.get('#loginusername').type('usuario_invalido');
    cy.get('#loginpassword').type('senha_errada');

    cy.intercept('POST', '**/login').as('login');
    cy.get('#logInModal .btn-primary').click();

    cy.on('window:alert', (msg) => {
      const mensagensPossiveis = [
        'User does not exist.',
        'Wrong password.'
      ];
      expect(mensagensPossiveis).to.include(msg);
    });

    cy.wait('@login').its('response.statusCode').should('eq', 200);
  });


  it('Login - Caminho Positivo', () => {
    const username = `user_${Date.now()}`;
    const password = 'pass123';

    cy.get('#signin2').click();
    cy.get('#sign-username').type(username, { force: true });
    cy.get('#sign-password').type(password, { force: true });
    cy.intercept('POST', '**/signup').as('signup');
    cy.get('#signInModal .btn-primary').click();
    cy.wait('@signup');

    cy.get('#login2').click();
    cy.get('#loginusername').type(username);
    cy.get('#loginpassword').type(password);

    cy.intercept('POST', '**/login').as('login');
    cy.get('#logInModal .btn-primary').click();
    cy.wait('@login');

    cy.get('#nameofuser', { timeout: 10000 })
      .should('exist')
      .and('not.have.css', 'display', 'none')
      .and('contain', username);
  });

});
describe('Cenário 3 - Validar Usuário Logado', () => {

  it('Deve validar que o usuário está logado após login bem-sucedido', () => {
    const username = `user_${Date.now()}`;
    const password = 'pass123';

    cy.visit('https://www.demoblaze.com/index.html');

    cy.get('#signin2').click();
    cy.get('#sign-username').type(username, { force: true });
    cy.get('#sign-password').type(password, { force: true });
    cy.intercept('POST', '**/signup').as('signup');
    cy.get('#signInModal .btn-primary').click();
    cy.wait('@signup');

    cy.get('#login2').click();
    cy.get('#loginusername').type(username);
    cy.get('#loginpassword').type(password);

    cy.intercept('POST', '**/login').as('login');
    cy.get('#logInModal .btn-primary').click();
    cy.wait('@login');

    cy.get('#nameofuser', { timeout: 12000 })
      .should('exist')
      .and('not.have.css', 'display', 'none')
      .and('contain', username);
  });

});
describe('Cenário 4 - Efetuar Compra de Produto', () => {

  beforeEach(() => {
    cy.visit('https://demoblaze.com/index.html');
  });

  it('Deve realizar a compra de um produto com sucesso', () => {

    cy.get('.hrefch').first().click();

    cy.intercept('POST', '**/addtocart').as('addcart');
    cy.contains('Add to cart').click();

    cy.on('window:alert', (msg) => {
      const mensagens = ['Product added', 'Product added.'];
      expect(mensagens).to.include(msg);
    });

    cy.wait('@addcart').its('response.statusCode').should('eq', 200);

    cy.get('#cartur').click();
    cy.get('#tbodyid tr').should('have.length.at.least', 1);

    cy.contains('Place Order').click();

    cy.get('#name').type('Pedro QA');
    cy.get('#country').type('Brasil');
    cy.get('#city').type('São Paulo');
    cy.get('#card').type('1234123412341234');
    cy.get('#month').type('12');
    cy.get('#year').type('2026');

    cy.contains('Purchase').click();

    cy.get('.sweet-alert').should('be.visible');
    cy.get('.sweet-alert h2').should('contain', 'Thank you for your purchase!');

    cy.contains('OK').click();

    cy.get('.modal.show .btn-secondary').click();
  });

});


