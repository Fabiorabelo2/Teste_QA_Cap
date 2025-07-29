beforeEach(() => {  
  cy.log(`Iniciando o teste: ${Cypress.currentTest.title}`);
  
  cy.intercept('**', (req) => {
    req.headers['Accept'] = 'application/json';
    req.headers['Content-Type'] = 'application/json';
  });
});

afterEach(() => {
  if (typeof cy.cleanUpTestData === 'function') {
    try {
      cy.cleanUpTestData();
    } catch (error) {
      console.warn('Erro ao limpar dados de teste:', error);
    }
  }
  
  cy.window().then((win) => {
    const consoleErrors = [];
    
    cy.stub(win.console, 'error').callsFake((message) => {
      consoleErrors.push(message);
    });
    
    if (consoleErrors.length > 0) {
      throw new Error(`Foram encontrados erros no console: ${JSON.stringify(consoleErrors)}`);
    }
  });
});

// Hook modificado para usar console.log em vez de cy.log
Cypress.on('test:before:run', (test) => {
  const testTitle = test ? test.title : 'Teste não identificado';
  console.log(`[Cypress] Preparando ambiente para o teste: ${testTitle}`);
});

Cypress.on('request:event', (eventName, data) => {
  if (eventName === 'response') {
    cy.log(`[${data.request.method}] ${data.request.url} - ${data.response.statusCode}`);
  }
});

Cypress.on('fail', (error, runnable) => {
  const testTitle = runnable ? `${runnable.parent.title} -- ${runnable.title}` : 'Teste não identificado';
  const screenshotPath = `screenshots/failure-${Cypress.spec.name}/${testTitle} (failed).png`;
  cy.screenshot(screenshotPath, { overwrite: true });
  
  console.error('Erro no teste:', error);
  
  throw error;
});

Cypress.on('window:before:load', (win) => {
  win.localStorage.clear();
  win.sessionStorage.clear();
});

Cypress.on('uncaught:exception', (err, runnable) => {
  const ignoredErrors = [
    'ResizeObserver loop limit exceeded',
    'Script error',
    'TypeError: Cannot read property',
    'ReferenceError: ', 
  ];
  
  if (ignoredErrors.some(ignoredError => err.message && err.message.includes(ignoredError))) {
    return false;
  }
  
  console.error('Erro não capturado:', err);
  return true;
});