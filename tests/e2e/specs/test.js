// https://docs.cypress.io/api/introduction/api.html

describe('My First Test', () => {
    beforeEach(() => {
        // reset and seed the database prior to every test
        // cy.exec('npm run db:reset && npm run db:seed');
    });

    afterEach(() => {
        // reset and seed the database prior to every test
        // cy.exec('npm run db:');
    });

    it('Visits the app root url', () => {
        cy.visit('/');
        cy.contains('h1', 'Welcome to Your Vue.js + TypeScript App');
    });
});
