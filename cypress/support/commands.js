// ***********************************************
// Comandos personalizados para a API Helpdesk
// ***********************************************

// Comandos para Usuários
Cypress.Commands.add('createUser', (userData) => {
  return cy.request({
    method: 'POST',
    url: '/users',
    body: userData,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('getUser', (userId) => {
  return cy.request({
    method: 'GET',
    url: `/users/${userId}`,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('updateUser', (userId, userData) => {
  return cy.request({
    method: 'PUT',
    url: `/users/${userId}`,
    body: userData,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('deleteUser', (userId) => {
  return cy.request({
    method: 'DELETE',
    url: `/users/${userId}`,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('getAllUsers', () => {
  return cy.request({
    method: 'GET',
    url: '/users',
    failOnStatusCode: false
  });
});

// Comandos para Tickets
Cypress.Commands.add('createTicket', (ticketData) => {
  return cy.request({
    method: 'POST',
    url: '/tickets',
    body: ticketData,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('getTicket', (ticketId) => {
  return cy.request({
    method: 'GET',
    url: `/tickets/${ticketId}`,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('updateTicketStatus', (ticketId, status) => {
  return cy.request({
    method: 'PUT',
    url: `/tickets/${ticketId}`,
    body: { status },
    failOnStatusCode: false
  });
});

Cypress.Commands.add('deleteTicket', (ticketId) => {
  return cy.request({
    method: 'DELETE',
    url: `/tickets/${ticketId}`,
    failOnStatusCode: false
  });
});

// Validação de Schema
Cypress.Commands.add('validateSchema', (schema, data) => {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(data);
  
  if (!valid) {
    const errors = validate.errors.map(err => {
      return `${err.instancePath} ${err.message}`;
    }).join('\n');
    
    throw new Error(`Schema validation failed:\n${errors}`);
  }
  
  return true;
});

// Utilitários
Cypress.Commands.add('cleanUpTestData', () => {
  // Implementar lógica para limpar dados de teste
  // Isso pode ser útil entre os testes para garantir isolamento
  cy.log('Limpando dados de teste...');
});
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })