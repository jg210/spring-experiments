describe('basic tests', () => {
  it('has expected title', () => {
    cy.visit('/');
    cy.title().should('eq', 'FSA Food Hygiene Ratings');
  });
});