// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    getByData(selector: string): Chainable<JQuery<HTMLElement>>
  }
}

Cypress.Commands.add('getByData', (selector) => {
  return cy.get(`[data-test=${selector}]`)
})
