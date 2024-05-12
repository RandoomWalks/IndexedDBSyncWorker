describe('End-to-End Test', () => {
  it('handles user login, data fetch, and logout', () => {
    // Visiting the login page
    cy.visit('/login');

    // Typing into the input fields
    cy.get('input[name=username]').type('user1');
    cy.get('input[name=password]').type('password123{enter}');

    // Should be redirected to the dashboard after login
    cy.url().should('include', '/dashboard');

    // Clicking the fetch data button
    cy.contains('Fetch Data').click();
    cy.get('#dataDisplay').should('contain', 'Item1');

    // Logging out
    cy.contains('Logout').click();

    // Should be redirected to the login page
    cy.url().should('include', '/login');
  });
});
