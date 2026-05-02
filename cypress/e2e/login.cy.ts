/// <reference types="cypress" />

describe('Flujo de Autenticación de RutaDigital', () => {
  
  it('Debería iniciar sesión correctamente y mostrar el catálogo de viajes', () => {

    cy.visit('http://localhost:8100/login'); 

    cy.get('ion-input[type="email"]')
      .click()
      .type('mdiegoirvin010@gmail.com'); 

    cy.get('ion-input[type="password"]')
      .click()
      .type('123456');

    cy.contains('ion-button', 'Iniciar Sesión').click();
    cy.wait(1000);
    cy.contains('Iniciar Sesión').click();

    cy.url({ timeout: 10000 }).should('include', '/buscar-viajes');
    cy.wait(5000);

    cy.get('ion-menu-button').click();
    cy.contains('Salir').click();
    cy.wait(3000);
    cy.contains('Salir').click();
    
  });

});