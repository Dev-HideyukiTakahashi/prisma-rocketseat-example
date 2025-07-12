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

Exemplo de relations:

```prisma
model Question {
  id      String @id @default(uuid())
  title   String
  content String

  createAt  DateTime @default(now()) @map("created_at") // mapeia como vai ficar no banco
  updatedAt DateTime @updatedAt @map("updated_at")

  userId String @map("user_id")

  user User @relation(fields: [userId], references: [id])

  @@map("questions")
}
```

---

Prisma Studio:

`npx prisma studio `

- http://localhost:5555/
  - É possível visualizar o banco de dados pelo browser

---

#### Controller:

Exemplo de consulta com prisma:

```javascript
  async index(request: Request, response: Response) {
    const questions = await prisma.question.findMany({
      where: {
        title: {
          contains: request.query.title?.toString().trim(),
          mode: 'insensitive', // não diferencia entre maiusculo ou minusculo
        },
      },
      orderBy: {
        title: 'asc',
      },
    });
```

Exemplo de consulta com prisma:

```javascript
    const refunds = await prisma.refunds.findMany({
      // pagination
      skip,
      take: perPage,
    
      where: {
        user: {
          name: {
            contains: name.trim(),
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      // inclui apenas o nome do user no payload
      include: { user: { select: { name: true } } },
    });
```

Create:

```javascript
  async create(request: Request, response: Response) {
    const { title, content, user_id } = request.body;

    await prisma.question.create({ data: { title, content, userId: user_id } });
    return response.status(201).json();
  }
```

---

#### Seed

- Criar arquivo seed.ts na pasta prisma

```javascript
import { prisma } from '@/prisma';

async function seed() {
  await prisma.user.createMany({
    data: [
      {
        name: 'Maria',
        email: 'maria@email.com',
      },
      {
        name: 'José',
        email: 'josé@email.com',
      },
      {
        name: 'João',
        email: 'joao@email.com',
      },
    ],
  });
}

seed().then(() => {
  console.log('Database seeded!');
  prisma.$disconnect();
});
```

package.json config:

```json
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  },
```

Depois é só executar no terminal para criar o seed

`npx prisma db seed  `

---

#### Exemplo de busca com pagination

```javascript
  async index(request: Request, response: Response) {
    const querySchema = z.object({
      name: z.string().optional().default(''),
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional().default(10),
    });

    const { name, page, perPage } = querySchema.parse(request.query);

    // calcula valor de skip
    const skip = (page - 1) * perPage;

    const refunds = await prisma.refunds.findMany({
      // pagination
      skip,
      take: perPage,

      where: {
        user: {
          name: {
            contains: name.trim(),
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      // inclui apenas o nome do user no payload
      include: { user: { select: { name: true } } },
    });

    // pegando a quantidade de registros
    const totalRecords = await prisma.refunds.count({
      where: {
        user: {
          name: {
            contains: name.trim(),
          },
        },
      },
    });

    const totalPages = Math.ceil(totalRecords / perPage);

    return response.json({
      refunds,
      pagination: {
        page,
        perPage,
        totalRecords,
        totalPages: totalPages > 0 ? totalPages : 1,
      },
    });
  }
```
