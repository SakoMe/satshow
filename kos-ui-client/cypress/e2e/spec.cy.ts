import { cy, describe, it } from 'local-cypress';

// TODO: add tests for end to end user flow (login, logout, etc)

describe('<App /> end to end', () => {
  it('user can visit root route and find starter text', () => {
    cy.visit('http://localhost:3000/');
    cy.findByRole('heading', { name: /start here/i }).should('exist');
    cy.findByRole('heading', { name: /start here/i }).should('be.visible');
    cy.findByRole('heading', { name: /start here/i }).should('contain', 'Start here');
  });
});
