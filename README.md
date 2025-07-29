# Automação de Testes - Helpdesk API

Este projeto contém testes automatizados para a API Helpdesk, desenvolvidos com Cypress.

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm (vem com o Node.js)
- Git


## 🚀 Configuração do Ambiente

1. Clone o repositório:
   ```bash
   git clone https://github.com/automacaohml/helpdesk-api.git
   cd helpdesk-api
   ```

2. Instale as dependências do projeto:
   ```bash
   npm install
   ```

3. Inicie a API localmente (opcional):
   ```bash
   npm run start
   ```

4. No diretório do projeto de testes, instale as dependências:
   ```bash
   cd ../testes-helpdesk-api
   npm install
   ```

## 🧪 Executando os Testes

### Modo Interativo (GUI)
```bash
npx cypress open
```

### Modo Headless
```bash
npx cypress run
```

### Executando testes específicos
```bash
# Executar apenas testes de usuários
npx cypress run --spec "cypress/e2e/api/users/*.spec.js"

# Executar apenas testes de tickets
npx cypress run --spec "cypress/e2e/api/tickets/*.spec.js"
```

## 📊 Relatórios

Os relatórios são gerados automaticamente após a execução dos testes em modo headless. Você pode encontrá-los em:

```
cypress/reports/html/index.html
```

## 🏗️ Estrutura do Projeto

```
cypress/
├── e2e/
│   ├── api/
│   │   ├── users/
│   │   │   └── users.spec.js     # Testes de usuários
│   │   └── tickets/
│   │       └── tickets.spec.js   # Testes de tickets
│   └── support/
│       ├── commands.js           # Comandos personalizados
│       └── e2e.js                # Configurações de suporte
├── fixtures/                     # Dados de teste
├── screenshots/                  # Capturas de tela de falhas
└── videos/                       # Gravações das execuções
```






