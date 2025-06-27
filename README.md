## Prisma ORM

---

Instalar extensão do Prisma no vscode para facilitar

Config útil:

```json
[prisma]": {
    "editor.formatOnSave": true
  },
```

---

#### Facilitador para exceptions:

- `npm i express-async-errors@3.1.1`

##### Como ele funciona?

- Ao importar express-async-errors no início do seu arquivo principal do Express (geralmente app.js ou server.js), ele "patcha" o Express, fazendo com que todas as exceções de funções assíncronas sejam automaticamente enviadas para o middleware de tratamento de erros do Express. Isso elimina a necessidade de envolver cada chamada async/await em um try/catch redundante.

---

#### Configurando:

Exemplo com porsgresql:

`npx prisma init --datasource-provider postgresql`

Após a instalação, configurar o .env

---

#### Exemplo model (migration):

Arquivo `schema.prisma`

```prisma
model User {
  id    String @id @default(uuid())
  name  String
  email String @unique

  @@map("users") // nome da tabela no db
}
```

- Executando a migration:
  - `npx prisma migrate dev `

---

Prisma Studio:

`npx prisma studio `

- http://localhost:5555/
  - É possível visualizar o banco de dados pelo browser

---
