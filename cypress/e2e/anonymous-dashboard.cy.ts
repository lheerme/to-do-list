describe('Anonymous dashboard', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.getByData('sign-in-anon-btn').click()
    cy.contains('Entrar mesmo assim').click()
  })

  it('should go back to sign-in corretly', () => {
    cy.contains('Entrar').click()
    cy.getByData('sign-in-title').contains('Acessar to-dos')
  })

  it('should add new to-do', () => {
    cy.contains('Novo to-do').click()
    cy.get('input').type('teste new to-do')
    cy.contains('Adicionar to-do').click()
    cy.contains('teste new to-do')
  })

  it('should prevent duplicated to-do', () => {
    cy.contains('Novo to-do').click()
    cy.get('input').type('teste new to-do')
    cy.contains('Adicionar to-do').click()

    cy.contains('Novo to-do').click()
    cy.get('input').type('teste new to-do')
    cy.contains('Adicionar to-do').click()
    cy.contains('O to-do teste new to-do já existe')
  })

  it('should open new to-do', () => {
    cy.contains('Novo to-do').click()
    cy.get('input').type('teste new to-do')
    cy.contains('Adicionar to-do').click()
    cy.contains('teste new to-do').click()

    cy.getByData('to-do-details-title').contains('teste new to-do')
  })
})
