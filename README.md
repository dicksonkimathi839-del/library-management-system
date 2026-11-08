
# Library Management System

## Project Overview

The Library Management System is a database-driven application
designed to manage library books, genres, users and book reviews.

The system uses PostgreSQL as its relational database and Prisma
ORM for database modelling, migrations and data management.
NestJS provides the backend application framework.

The main objective of the project is to design and implement
a reliable, structured and scalable database layer for managing
a library's book catalog.

## Technologies Used

- Node.js
- TypeScript
- NestJS
- Prisma ORM
- PostgreSQL
- npm

## Project Structure

```text
library-management-system/
├── api/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   └── prisma/
│   │       └── prisma.service.ts
│   ├── .env.example
│   └── package.json
├── README.md
└── .gitignore
```

## Database Models

### 1. User

The User model stores information about registered library
users. Each user has a unique email address and a role.

The Role enum defines two categories:

- PATRON: A normal library user.
- LIBRARIAN: A user responsible for library administration.

### 2. Genre

The Genre model categorizes books according to their subject
or literary classification.

Each genre can contain multiple books.

### 3. Book

The Book model stores the details of individual books,
including:

- Title
- Author
- ISBN
- Description
- Publication year
- Total copies
- Available copies
- Genre ID

Every book belongs to one genre through the genreId foreign key.

### 4. Review (Stretch Goal)

The Review model allows registered users to review books.

It contains:

- bookId
- userId
- rating
- comment

Each review belongs to one book and one user. A composite
unique constraint prevents a user from reviewing the same
book more than once.

## Schema Decisions

### Why does Book reference Genre instead of embedding genre data?

The database uses PostgreSQL, which is a relational database.
In relational database design, relationships between different
entities are represented using primary keys and foreign keys.

The Book model references the Genre model through genreId.
This creates a one-to-many relationship in which one genre
can be associated with several books, while each book belongs
to one genre.

This approach was selected for several reasons:

1. Data normalization:
   Genre information is stored once instead of being duplicated
   across multiple book records.

2. Data consistency:
   Updating a genre name automatically makes the updated name
   available whenever related books are queried.

3. Referential integrity:
   The foreign key ensures that every book references an
   existing genre.

4. Reduced data redundancy:
   Storing genre information separately avoids unnecessary
   repetition.

5. Maintainability:
   Genres can be managed independently without updating
   individual book records.

Therefore, using a genreId foreign key provides a structured,
consistent and maintainable relational database design.

## Database Relationships

- Genre to Book: One-to-Many.
- Book to Review: One-to-Many.
- User to Review: One-to-Many.

The Review model also establishes a many-to-many relationship
between User and Book through the Review junction model.

## Database Setup

### Prerequisites

Ensure that the following are installed:

- Node.js
- npm
- PostgreSQL database
- Git

### 1. Clone the repository

```bash
git clone https://github.com/dicksonkimathi839-del/library-management-system.git
```

### 2. Navigate to the API directory

```bash
cd library-management-system/api
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file using `.env.example` as a reference.

Add your hosted PostgreSQL connection string:

```env
DATABASE_URL="your_postgresql_connection_string"
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Run database migrations

```bash
npx prisma migrate dev --name init
```

This creates the database tables and records the migration
in the Prisma migrations directory.

### 7. Seed the database

```bash
npx prisma db seed
```

The seed script inserts:

- 4 book genres.
- 16 books distributed across the four genres.

The script uses upsert operations to avoid duplicate records
when executed multiple times.

### 8. Verify the database

```bash
npx prisma studio
```

Prisma Studio provides a graphical interface for inspecting
the User, Genre, Book and Review tables.

## Prisma Service

The PrismaService extends PrismaClient and implements
NestJS lifecycle hooks.

On application initialization, it establishes a connection
to PostgreSQL using this.$connect().

When the application shuts down, it disconnects using
this.$disconnect().

## Prisma vs Document Databases

One thing that felt different when modelling in Prisma
compared to a document database was how relationships
are explicitly defined.

In Prisma with PostgreSQL, relationships require foreign
keys and relation fields. For example, a Book references
a Genre through genreId.

In a document database such as MongoDB, related information
can instead be embedded inside a document or referenced
through document identifiers.

This experience demonstrated the importance of relational
database normalization, referential integrity and structured
relationships.

## Conclusion

The Library Management System database layer demonstrates
the use of Prisma ORM and PostgreSQL to implement a structured
relational data model.

It includes user roles, genre categorization, book management,
referential integrity, database migrations and automated
database seeding.

The additional Review model demonstrates how related entities
can be connected through relational database design.
