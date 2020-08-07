# Desenvolvimento do Back-End da aplicação

- Setup inicial
  - Mini-Framework Express
  - Ts-Node-Dev

- [x] Conexão com o Banco de Dados usando knex e SQLite;
- [x] Criação das tabelas do banco de dados;
- [x] Rotas da aplicação;
  - [x] Criar uma aula;
  - [x] Listar aulas com filtragem;
  - [x] Criar uma conexão;
  - [x] Listar o total de conexões;

## Conceitos

  ### Rotas e Recursos

  - [x] **GET**: Buscar ou listar alguma informação
  - [x] **POST**: Criar uma nova informação
  - [x] **PUT**: Atualizar alguma informação existente
  - [x] **DELETE**: Deletar uma informação existente

  ### Parâmetros

  - [x] **Request Body**: Dados para criação ou atualização de um registro  (request.body)
  - [x] **Route Params**: Identificar qual recurso (específico) eu quero atualizar ou deletar
  - [x] **Query Params**: Pagibação, filtros, ordenação... parâmetros não obrigatórios

  ### Funcionamento básico de cada tipo de parâmetro

  - request.body -> acessa os dados que o usuário inseriu na página
  - request:params + /users:id -> acessa um ID específico
  - request.query + /users?page=2 -> Lista os usuários da página 2, por exemplo

  ### Gerenciando rotas na aplicação

  - Para manter a organização no desenvolvimento, vamos utilizar um arquivo especialmente para as rotas (*routes.ts*).

  - Para manter a conexão com o arquivo server.ts:
    - No arquivo *rotes.ts*:
      - [x] import express;
      - [x] const routes = express.Router(); (assim trocamos tudo que costumava ser app por routes)
      - [x] export default routes;

    - No arquivo *server.ts*:
      - [x] app.use(routes);
      - [x] importar o arquivo routes.ts (caso não seja feito automáticamente)


  - Para configurar o VSCode para importar arquivos automáticamente, basta adicionar as configurações a seguir no *setting.json*:
    - *"javascript.suggest.autoImports": true,*
    - *"typescript.suggest.autoImports": true,*

  ### Short Sintaxe

  - Se o nome da propriedade que eu passo para o objeto é o mesmo do valor, eu posso omitir.
    
  - await db('users').insert({
      name: name, (//se fossediferente, então seria -> name: 'Pedro')
      avatar: avatar,
      whatsapp: whatsapp,
      bio: bio
    });

  - await db('users').insert({
      name,
      avatar,
      whatsapp,
      bio
    });


## Funcionalidades da Aplicação

  ### Conexões

  - Rota para criar uma conexão (ao clicar em 'Entrar em contato');
  - Rota para listar o total de conexões realizadas;

  ### Aulas

  - Rota para criar uma aula;
  - Rota para listar aulas;
    - Filtrar por matéria, dia da semana e horário;


## Conexão com o Banco de Dados

  - **SQLite**
    - + SQLite VSCode extension (sudo apt install sqlite, no Ubuntu)
  - **Knex (Query Builder)**
    - Escrever as querys para o banco de dados em JavaScript;
      - Isso facilita uma troca de tecnologia no banco de dados.
    - Migrations (controlam as versões do banco de dados);
  - **Path (método)**
    - path.resolve(__dirname...);
    - para padronizar as rotas para diretórios;


  ### Migrations

  - Controle de versões (fazer / desfazer)
  - Desenvolvimento em time (se outra pessoa pegar o código ela só precisa executar as migrations)

  - import knex;
  - export duas funções assíncronas -> 
    - up(knex: Knex) - cria a tabela
    - down(knex: Knex) - exclui a tabela

  - Para executar o arquivo de migration (criar ou deletar tabela):
  - "knex:migrate": "knex --knexfile knexfile.ts migrate:latest"
    "knex:migrate:rollback": "knex --knexfile knexfile.ts migrate:rollback"

  - * IMPORTANTE: Os arquivos de migrations são executados em ordem, então é importante organizá-los com o relacionamento estre as tabelas, para que não haja erros na criação por estruturas ainda não criadas.
    - 00_create_users.ts;
    - 01_create_classes.ts;
    - ...


## Criação das tabelas do banco de dados

- Tabelas:
    - [x] Users (id, name, avatar, whatsapp, bio)
    - [x] Classes (id, subject, cost, user_id)
    - [x] Class Schedule (id, week_day, from, to, class_id)
    - [x] Connections (id, user_id, created_at)

  ### Criar tabela usando o knex
  -

  ### Relacionamento entre tabelas

  - [x] .references('coluna que eu desejo relacionar');
  - [x] .inTable('nome da tabela')

  ### .onDelete e .onUpdate / CASCADE

  - O *método* CASCADE deleta ou atualiza a tabela toda quando necessário. Por exemplo, se o usuário (professor, nesse caso) excluir sua conta da plataforma, todas as aulas dele serão deletadas do banco de dados também.

  ### Timestamp e .defaultTo
  
  - defaultTo(knex.raw('CURRENT_TIMESTAMP')) - para o SQLite


##  * Transaction - trx *

- Realizar todas as operações do banco ao mesmo tempo. Se algo der errado, nada é inserido no banco de dados e um erro é mostrado. Do contrário, apenas uma parte do processo poderia ter erro e as demais seriam executadas normalmente, o que deixaria a operação incompleta e errada.

- [x] const trx = await db.transaction();
  - db -> o nome do banco de dados (que eu defini em connection.ts)
- [x] depois troco o nome do banco (todos os db) por trx
- [x] await trx.commit(); (no final de todas as operações que envolvem o banco de dados)

- [x] No tratamento de erros, no catch (err), adicionar um *await trx.rollback();* para desfazer das alterações.


## Abstração básica / Controllers

- [] Pasta Controllers -> arquivos.ts
- [] NameController (primeira maiúscula)
  
- [] No arquivo Controller
  - Exportar como uma classe
    *export default class ClassController {}*
    e dar o nome para o método (index, create...)
    *async index(request: Request, ...*
  - Não usar arrow function
  - Importar o que for necessário
    - + Tipagem de Request e Response (do express) no Typescript


- [] No arquivo Routes
  - importar a Classe
    - *import ClassController from './...'*
  - definir uma variável para ela
    - *const classController = new ClassController*
  - E a partir de agora as rotas ficam do tipo:
    - *routes.get('/users', classController.create);*

## Criação das rotas

  ### Criação da aula ('/classes')

  - Essa única rota vai criar -> usuário, aula e schedule da aula

    #### Enviar dados da rota /classes para o banco de dados (users, e classes)

    - [x] Primeiro, requisitar e armazenar os dados do body;
    - [x] Depois, adicionar, com uma função async e .insert()

    - Exemplo:
    - await db('users').insert({
        name,
        avatar,
        whatsapp,
        bio
      });

    #### Lidando com horários (class_schedule)

    - Os horários no banco de dados estão classificados como Inteiros, mas o usuário insere o horário em forma de String (8:00, 18:00, 12:00...). *Para tratar dos horários, então, o valor digitado pelo usuário será convertido em minutos*

    - [x] Uma função é responsável por fazer essa conversão
      - utils/convertHourToMinutes.ts
    - [x] Para inserir todos os dados no banco, vai ser criado um objeto (classSchedule), que separa cada valor de *schedule* (de request.body). *interface ScheduleItem* define o tipo de cada propriedade.





  ### Rota para listagem de aulas com filtros (week_day, subject, time)

  - where
  - join
  - whereExists (se não existir, retorna False e não mostra nada)
  - this
  - whereRaw (cada um é um filtro)

  ### Criar e listar connections

  - create
    - user_id de request.body
    - inserir na tabela connectoins
      *await db('connections').insert({ user_id });*
      user_id é um objeto que recebe o corpo da requisição e é o nome da coluna, então podemos omitir o ':'

  - index
    - .count('* as total')
    - Nesse caso, precisamos somente de uma coluna, mas o knex, por padrão, está pronto para retornar multiplos valores, então temos que selecionar apenas a primeira posição do array, mesmo que só tenha uma.
      - *const { total } = totalConnectoins[0]* 


## CORS

- Permitir que aplicações em endereços diferentes (front-end) acessem a API (do contrário, ele só permitiria quem estivesse na porta :3333.)

- instalar o cors (yarn add cors) e a tipagem como desenvolvimento (yarn add @types/cord -D)

- Depois que o CORS for adicionado, a API não roda mais na 3333.