describe('basic tests', () => {
  it('has expected title', () => {
    cy.visit('/');
    cy.title().should('eq', 'FSA Food Hygiene Ratings');
  });
  it('has Document-Policy: js-profiling header', () => {
    cy.request({url: '/'}).then((response) => {
      const headers = response.headers;
      // cypress lowercases the headers! https://github.com/cypress-io/cypress/issues/2879
      expect(headers['document-policy']).to.equal('js-profiling');
    });
  });
});