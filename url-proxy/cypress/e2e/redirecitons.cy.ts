describe("Redirections", () => {
  before(() => {
    cy.loginByCognitoApi(
      Cypress.env("cognitoUsername"),
      Cypress.env("cognitoPassword")
    );
  });

  it("must render redirections table", () => {
    cy.visit("/redirects");
    cy.get(".Table").should("be.visible");
  });
});

export {};
