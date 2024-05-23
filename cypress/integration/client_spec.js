describe('Client Integration Test', () => {
  it('successfully loads and fetches data from the server', () => {
    cy.visit('http://localhost:3000'); // Adjust the URL to where your client is served
    cy.contains('Fetch Data').click();
    cy.get('#dataDisplay').should('contain', 'Item1'); // Adjust based on actual expected output
  });
});

describe('Asynchronous Data Handling', () => {
  it('displays loading indicators and loads data', () => {
    cy.visit('/data-page');
    cy.get('.loading-indicator').should('be.visible');
    cy.wait('@fetchData'); // Assume you've set up an alias for your request
    cy.get('.loading-indicator').should('not.exist');
    cy.get('.data-container').should('contain', 'Data fetched');
  });
});


describe('Network Failure', () => {
  it('shows error message on network failure', () => {
    cy.visit('/data-page');
    cy.intercept('GET', '/api/data', { forceNetworkError: true }).as('getDataFailure');
    cy.get('#fetchDataButton').click();
    cy.wait('@getDataFailure');
    cy.get('.error-message').should('be.visible');
  });
});