# Vintage Bike Data

An open-source database and API foundation for vintage bicycle specifications,
geometry, and component compatibility.

## Requirements

- Node.js 20 or newer
- PostgreSQL (for database access)

## Setup

```sh
npm install
cp .env.example .env
```

Set `DATABASE_URL` in `.env` to your PostgreSQL connection string before running
database commands that connect to the database.

## Validation and type checking

```sh
npm run typecheck
npm test
```

## Web directory

Start the Next.js bicycle directory locally with:

```sh
npm run dev
```

The web directory supports make/model search and category filtering. Bicycle
specifications and JSON inspection are available from each record's detail page.

## Database schema and migrations

The Drizzle schema is defined in `src/db/schema.ts`. Generate SQL migrations with:

```sh
npm run db:generate
```

Explore and edit the schema with Drizzle Studio:

```sh
npm run db:studio
```

Apply generated migrations with:

```sh
npm run db:migrate
```

The example record at `src/seed/1988-stumpjumper.json` is covered by the
validation test suite.
