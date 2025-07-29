/// <reference types="cypress" />

describe('API de Usuários', () => {
  const API_URL = 'http://localhost:3000';
  let userId;

  it('GET - deve listar todos os usuários', () => {
    cy.request('GET', `${API_URL}/users`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      
      if (response.body.length > 0) {
        const firstUser = response.body[0];
        expect(firstUser).to.have.property('id');
        expect(firstUser).to.have.property('name');
        expect(firstUser).to.have.property('email');
        cy.log(`Encontrados ${response.body.length} usuários`);
      } else {
        cy.log('Nenhum usuário encontrado no sistema');
      }
    });
  });

  it('POST - deve criar um novo usuário', () => {
    // Gera um timestamp único para o email
    const timestamp = new Date().getTime();
    const newUser = {
      name: `Usuário Teste ${timestamp}`,
      email: `test.${timestamp}@example.com`
    };

    cy.request({
      method: 'POST',
      url: `${API_URL}/users`,
      body: newUser,
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 409) {
        // Se o usuário já existir, gera um novo email e tenta novamente
        newUser.email = `test.${timestamp}.${Math.floor(Math.random() * 1000)}@example.com`;
        return cy.request('POST', `${API_URL}/users`, newUser);
      }
      return response;
    }).then((response) => {
      expect(response.status).to.eq(201, 'Falha ao criar usuário. Verifique se o email já está em uso.');
      expect(response.body).to.have.property('id');
      expect(response.body.name).to.eq(newUser.name);
      expect(response.body.email).to.eq(newUser.email);
      
      userId = response.body.id;
      cy.log(`Usuário criado com ID: ${userId}`);
    });
  });

  it('GET - deve buscar um usuário por ID', () => {
    if (!userId) {
      cy.log('Nenhum usuário disponível para teste');
      return;
    }

    cy.request('GET', `${API_URL}/users/${userId}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq(userId);
    });
  });

  it('PUT - deve atualizar um usuário existente', () => {
    if (!userId) {
      cy.log('Nenhum usuário disponível para teste');
      return;
    }

    const updatedUser = {
      name: 'Usuário Atualizado',
      email: `updated.${Date.now()}@example.com`
    };

    // Primeiro, atualiza o usuário
    cy.request('PUT', `${API_URL}/users/${userId}`, updatedUser).then((response) => {
      expect(response.status).to.eq(200);
      
      // Independente de ter corpo na resposta, vamos buscar o usuário para verificar a atualização
      cy.request('GET', `${API_URL}/users/${userId}`).then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        expect(getResponse.body.name).to.eq(updatedUser.name);
        expect(getResponse.body.email).to.eq(updatedUser.email);
      });
    });
  });
  
  it('DELETE - deve excluir um usuário existente', () => {
    if (!userId) {
      cy.log('Nenhum usuário disponível para teste');
      return;
    }

    cy.request('DELETE', `${API_URL}/users/${userId}`).then((response) => {
      expect(response.status).to.eq(200);
      
      // Verifica se o usuário foi realmente removido
      cy.request({
        method: 'GET',
        url: `${API_URL}/users/${userId}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });

  it('GET - deve retornar erro 404 para usuário inexistente', () => {
    const nonExistentUserId = 99999;
    
    cy.request({
      method: 'GET',
      url: `${API_URL}/users/${nonExistentUserId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });
}); 
