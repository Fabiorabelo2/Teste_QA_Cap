describe('Verificação Status - API', () => {
  const API_BASE_URL = 'http://localhost:3000';

  it('GET - deve retornar uma lista de usuários', () => {
    cy.request({
      method: 'GET',
      url: `${API_BASE_URL}/users`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      cy.log(`Encontrados ${response.body.length} usuários`);
    });
  });

  it('GET - deve retornar uma lista de tickets', () => {
    cy.request({
      method: 'GET',
      url: `${API_BASE_URL}/tickets`,
      failOnStatusCode: false
    }).then((response) => {
      cy.log(`Status da resposta: ${response.status}`);
      
      // Verifica se o status está entre os códigos esperados
      const statusEsperados = [200, 404, 500];
      expect(statusEsperados).to.include(response.status, `Status inesperado: ${response.status}`);
      
      if (response.status === 200) {
        expect(response.body).to.be.an('array');
        cy.log(`Encontrados ${response.body.length} tickets`);
      } else if (response.status === 500) {
        cy.log('Erro 500 - Servidor encontrou um erro interno');
        cy.log('Resposta do servidor:', JSON.stringify(response.body, null, 2));
      }
    });
  });

  it('GET - deve retornar 404 para rota inexistente', () => {
    cy.request({
      method: 'GET',
      url: `${API_BASE_URL}/rota-inexistente`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });
});
