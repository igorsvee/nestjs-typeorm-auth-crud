## Instructions:
1) Requires docker to be installed on the host machine. Uses **ports**: `5432` - main  DB and `5433` - test DB
```bash
$ npm run start:db
```
2) Install dependencies
```bash
$ npm install
```
3) Run API on the **host** machine            
```bash
$ npm run start:dev
```

## Postman collection to interact with the api              
https://www.postman.com/navigation-technologist-23570004/workspace/tundra/collection/34119409-c03bc48a-4817-4cf0-b955-43e8e9ec166d?action=share&creator=34119409

4) Testing
```bash
$ npm run test
```

## Endpoints
• POST /auth/register: Register a new user.

• POST /auth/login: Authenticate a user and return a JWT.

• GET /cats: Retrieve a list of all cats.

• POST /cats: Create a new cat profile (admin only).

• GET /cats/{id}: Retrieve a cat profile by ID.

• PUT /cats/{id}: Update a cat profile by ID (admin only).

• DELETE /cats/{id}: Delete a cat profile by ID (admin only).

**• POST /cats/{id}/favourite: Mark the cat as a favourite (admin/user only).**


## Tech used

- Nest.JS
- TypeORM
- Docker
- Passport
- Postgres DB
