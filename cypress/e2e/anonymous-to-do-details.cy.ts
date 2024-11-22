describe('Anonymous to-do details', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.getByData('sign-in-anon-btn').click()
    cy.contains('Entrar mesmo assim').click()
    cy.contains('Novo to-do').click()
    cy.get('input').type('teste new to-do')
    cy.contains('Adicionar to-do').click()
    cy.contains('teste new to-do').click()
  })

  it('should edit to-do title', () => {
    cy.getByData('edit-to-do-title-btn').click()
    cy.getByData('edit-to-do-title-input').type('teste new to-do editado')
    cy.contains('Salvar alteração').click()

    cy.getByData('to-do-details-title').contains('teste new to-do editado')
  })

  it('should delete to-do title', () => {
    cy.getByData('delete-to-do-title-btn').click()
    cy.contains('Deletar').click()
    cy.contains(
      'Você não possui nenhum to-do, clique em novo to-do para criar.',
    )
  })

  it('should add task', () => {
    cy.getByData('new-task-input').type('teste new task')
    cy.contains('Adicionar').click()
    cy.contains('teste new task')
  })

  it('should mark task as completed', () => {
    cy.getByData('new-task-input').type('teste new task')
    cy.contains('Adicionar').click()
    cy.getByData('task-checkbox').click()
    cy.getByData('edit-task-btn').should('have.css', 'pointer-events', 'none')
  })

  it('should edit task', () => {
    cy.getByData('new-task-input').type('teste new task')
    cy.contains('Adicionar').click()
    cy.getByData('edit-task-btn').click()
    cy.getByData('edit-task-input').type('teste new task editada')
    cy.contains('Salvar alteração').click()
  })

  it('should delete task', () => {
    cy.getByData('new-task-input').type('teste new task')
    cy.contains('Adicionar').click()
    cy.getByData('delete-task-btn').click()
    cy.contains('Deletar').click()
  })
})
