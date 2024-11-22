describe('Sign-in', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should render sign-in with correct title', () => {
    cy.getByData('sign-in-title').contains('Acessar to-dos')
  })

  it('should sign-in anonymously correctly', () => {
    cy.getByData('sign-in-anon-btn').click()

    cy.contains('Entrar mesmo assim').click()

    cy.contains('Bem-vindo(a)')
    cy.contains('você não está logado')
    cy.contains('salvos apenas localmente')
  })
})
