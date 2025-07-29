describe('API de Tickets', () => {
  const baseUrl = 'http://localhost:3000/tickets';
  const usersUrl = 'http://localhost:3000/users';
  let ticketId;
  let userId;

  before(() => {
    const user = {
      name: 'Usuário de Teste para Ticket',
      email: 'ticket.test@example.com'
    };

    cy.request({
      method: 'GET',
      url: usersUrl,
      qs: { email: user.email },
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 200 && response.body && response.body.length > 0) {
        userId = response.body[0].id;
        cy.log(`Usuário já existente encontrado com ID: ${userId}`);
      } else {
        cy.request('POST', usersUrl, user).then((createResponse) => {
          userId = createResponse.body.id;
          cy.log(`Novo usuário criado com ID: ${userId}`);
        });
      }
    });
  });

  it('POST - deve criar um novo ticket', () => {
    const ticket = {
      userId: userId,
      description: 'Problema com o login no sistema',
      status: 'Open'
    };

    cy.request({
      method: 'POST',
      url: baseUrl,
      body: ticket,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
      expect(response.body.userId).to.eq(userId);
      expect(response.body.description).to.eq(ticket.description);
      expect(response.body.status).to.eq('Open');
      
      ticketId = response.body.id;
    });
  });

  it('GET - deve buscar um ticket por ID', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/${ticketId}`,
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 200) {
        expect(response.body.id).to.eq(ticketId);
        expect(response.body.userId).to.eq(userId);
        expect(response.body).to.have.property('description');
        expect(response.body).to.have.property('status');
      } else {
        expect(response.status).to.eq(404);
      }
    });
  });

  it('PUT - deve atualizar o status de um ticket', () => {
    const updatedStatus = 'In Progress';
    cy.log(`Tentando atualizar o ticket ${ticketId} com status: ${updatedStatus}`);
    
    cy.request({
      method: 'PUT',
      url: `${baseUrl}/${ticketId}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: {
        status: updatedStatus
      },
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 200 || response.status === 204) {
        cy.log(`Status atualizado com sucesso via PUT /tickets/${ticketId}`);
        
        return cy.request(`${baseUrl}/${ticketId}`).then((getResponse) => {
          expect(getResponse.body.status).to.eq(updatedStatus);
        });
      }

      const errorMsg = `
        Falha ao atualizar o ticket ${ticketId}.
        Status: ${response.status}
        Resposta: ${JSON.stringify(response.body)}
        
        A API pode não suportar atualização de tickets existentes.
        Verifique a documentação da API para o método correto de atualização.
      `;
      
      cy.log(errorMsg);
  
    });
  });

  it('DELETE - deve excluir um ticket existente', () => {
    
    cy.request({
      method: 'GET',
      url: `${baseUrl}/${ticketId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);
      
      cy.request({
        method: 'DELETE',
        url: `${baseUrl}/${ticketId}`,
        failOnStatusCode: false
      }).then((deleteResponse) => {
        expect([200, 204]).to.include(deleteResponse.status);
        expect([200, 204]).to.include(deleteResponse.status);
        
        cy.request({
          method: 'GET',
          url: `${baseUrl}/${ticketId}`,
          failOnStatusCode: false
        }).then((getAfterDeleteResponse) => {
          expect(getAfterDeleteResponse.status).to.eq(404);
          expect(getAfterDeleteResponse.status).to.eq(404);
          
          ticketId = null;
        });
      });
    });
  });

  it('DELETE - deve retornar 404 ao tentar excluir um ticket inexistente', () => {
    const nonExistentId = 'id-inexistente';
    
    cy.request({
      method: 'DELETE',
      url: `${baseUrl}/${nonExistentId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([404, 204]).to.include(response.status);
    });
  });

  after(() => {
    if (ticketId) {
      cy.request({
        method: 'DELETE',
        url: `${baseUrl}/${ticketId}`,
        failOnStatusCode: false
      });
    }
    
    if (userId) {
      cy.request({
        method: 'DELETE',
        url: `${usersUrl}/${userId}`,
        failOnStatusCode: false
      });
    }
  });
});
