# SSH Terminal

> Breve descrição: Aplicação web para gerenciamento e interação com terminais, utilizando uma arquitetura baseada em componentes (Atomic Design) e funcionalidades como redimensionamento, atalhos de teclado e comunicação via WebSocket.

## Descrição

Esta aplicação foi desenvolvida utilizando **React**, **TypeScript** e **Vite**. A estrutura do projeto segue os princípios do Atomic Design, separando componentes em átomos, moléculas, organismos, páginas e templates. Além disso, o projeto conta com hooks customizados para funcionalidades específicas, interfaces e tipos para garantir a integridade dos dados, e utilitários para comunicação em tempo real via WebSocket.

A aplicação ainda possui configuração para containerização com Docker e distribuição com Nginx, facilitando o deploy em diferentes ambientes.

## Tecnologias Utilizadas

- **React** – Biblioteca para construção de interfaces.
- **TypeScript** – Superset do JavaScript com tipagem estática.
- **Vite** – Ferramenta de build e desenvolvimento.
- **Docker** – Containerização da aplicação.
- **Nginx** – Servidor web para distribuição.
- **WebSocket** – Comunicação em tempo real.

## Estrutura do Projeto

A estrutura de pastas está organizada da seguinte forma:

```
├── src
│   ├── core
│   │   ├── components
│   │   │   ├── atoms/
│   │   │   │   ├── button/
│   │   │   │   ├── input/
│   │   │   │   ├── select/
│   │   │   │   └── textarea/
│   │   │   ├── molecules/
│   │   │   │   ├── connectionCard/
│   │   │   │   └── terminalControls/
│   │   │   ├── organisms/
│   │   │   │   ├── connectionBar/
│   │   │   │   ├── openConnectionModal/
│   │   │   │   └── terminalWindow/
│   │   │   ├── pages/
│   │   │   │   └── terminalPage/
│   │   │   └── templates/
│   │   │       └── terminalTemplate/
│   │   ├── hooks/
│   │   ├── interfaces
│   │   │   └── components/
│   │   ├── types
│   │   │   └── components/
│   │   └── utils
│   │       └── websocket/
│   ├── global.d.ts
│   ├── index.css
│   ├── main.tsx
│   ├── not-found.tsx
│   └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
├── .env.delelopment
├── default.conf
└── vite.config.ts
```

**Observações:**

- **components/**: Contém todos os componentes da UI organizados segundo o padrão Atomic Design (atoms, molecules, organisms, pages, templates).
- **hooks/**: Hooks customizados para funcionalidades específicas, como redimensionamento e atalhos de teclado.
- **interfaces/** e **types/**: Definem as estruturas de dados e contratos utilizados em toda a aplicação.
- **utils/**: Funções utilitárias, incluindo a integração com WebSocket para comunicação em tempo real.

## Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) (recomenda-se a versão LTS)
- Docker (caso deseje executar a aplicação em contêiner)

### Passos para instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/PedroCamargo-dev/websocket-ssh-terminal.git
   cd websocket-ssh-terminal
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

## Desenvolvimento

Para iniciar a aplicação em modo de desenvolvimento, execute:

```bash
npm run dev
```

A aplicação será iniciada e poderá ser acessada em `http://localhost:8081` (a porta pode variar conforme a configuração no `vite.config.ts`).

## Build para Produção

Para gerar a build otimizada para produção, execute:

```bash
npm run build
```

Os arquivos de build serão gerados na pasta `dist`.

## Executando a Aplicação

Após a geração da build, a aplicação pode ser executada localmente com o comando:

```bash
npm run preview
```

## Executando com Docker

### Construindo a Imagem

Utilize o `Dockerfile` para construir a imagem da aplicação:

```bash
docker build -t websocket-ssh-terminal .
```

### Executando com Docker Compose

O arquivo `docker-compose.yml` facilita o gerenciamento dos contêineres. Para iniciar a aplicação via Docker Compose, execute:

```bash
docker-compose up --build
```

Após a inicialização, a aplicação estará disponível conforme as configurações definidas nos arquivos `nginx.conf` e `default.conf`.

## Configuração

- **Variáveis de ambiente:**  
  Para o ambiente de desenvolvimento, utilize o arquivo `.env.delelopment`. Ajuste as configurações de acordo com o ambiente (desenvolvimento, homologação, produção).

- **Configurações do Vite:**  
  O arquivo `vite.config.ts` contém as configurações da ferramenta de build e desenvolvimento.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
