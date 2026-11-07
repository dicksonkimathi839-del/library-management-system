
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting library database seeding...');

  // Create genres
  const genres = [
    {
      name: 'Technology',
      description: 'Books covering computers, programming and technology.',
    },
    {
      name: 'Fiction',
      description: 'Creative stories and imaginative literature.',
    },
    {
      name: 'Business',
      description: 'Books about management, entrepreneurship and leadership.',
    },
    {
      name: 'Science',
      description: 'Books exploring scientific knowledge and discoveries.',
    },
  ];

  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { name: genre.name },
      update: { description: genre.description },
      create: genre,
    });
  }

  console.log('Four genres created successfully.');

  // Retrieve genres for book relationships
  const technology = await prisma.genre.findUniqueOrThrow({
    where: { name: 'Technology' },
  });

  const fiction = await prisma.genre.findUniqueOrThrow({
    where: { name: 'Fiction' },
  });

  const business = await prisma.genre.findUniqueOrThrow({
    where: { name: 'Business' },
  });

  const science = await prisma.genre.findUniqueOrThrow({
    where: { name: 'Science' },
  });

  // Create at least 15 books across four genres
  const books = [
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '9780132350884',
      publicationYear: 2008,
      genreId: technology.id,
    },
    {
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt and David Thomas',
      isbn: '9780135957059',
      publicationYear: 2019,
      genreId: technology.id,
    },
    {
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      isbn: '9780262046305',
      publicationYear: 2022,
      genreId: technology.id,
    },
    {
      title: 'Design Patterns',
      author: 'Erich Gamma',
      isbn: '9780201633610',
      publicationYear: 1994,
      genreId: technology.id,
    },

    {
      title: 'Things Fall Apart',
      author: 'Chinua Achebe',
      isbn: '9780385474542',
      publicationYear: 1958,
      genreId: fiction.id,
    },
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '9780743273565',
      publicationYear: 1925,
      genreId: fiction.id,
    },
    {
      title: '1984',
      author: 'George Orwell',
      isbn: '9780451524935',
      publicationYear: 1949,
      genreId: fiction.id,
    },
    {
      title: 'Animal Farm',
      author: 'George Orwell',
      isbn: '9780451526342',
      publicationYear: 1945,
      genreId: fiction.id,
    },

    {
      title: 'Rich Dad Poor Dad',
      author: 'Robert T. Kiyosaki',
      isbn: '9781612680194',
      publicationYear: 1997,
      genreId: business.id,
    },
    {
      title: 'The Lean Startup',
      author: 'Eric Ries',
      isbn: '9780307887894',
      publicationYear: 2011,
      genreId: business.id,
    },
    {
      title: 'Good to Great',
      author: 'Jim Collins',
      isbn: '9780066620992',
      publicationYear: 2001,
      genreId: business.id,
    },
    {
      title: 'Think and Grow Rich',
      author: 'Napoleon Hill',
      isbn: '9781585424337',
      publicationYear: 1937,
      genreId: business.id,
    },

    {
      title: 'A Brief History of Time',
      author: 'Stephen Hawking',
      isbn: '9780553380163',
      publicationYear: 1988,
      genreId: science.id,
    },
    {
      title: 'The Selfish Gene',
      author: 'Richard Dawkins',
      isbn: '9780198788607',
      publicationYear: 1976,
      genreId: science.id,
    },
    {
      title: 'Cosmos',
      author: 'Carl Sagan',
      isbn: '9780345539434',
      publicationYear: 1980,
      genreId: science.id,
    },
    {
      title: 'The Origin of Species',
      author: 'Charles Darwin',
      isbn: '9781509827695',
      publicationYear: 1859,
      genreId: science.id,
    },
  ];

  for (const book of books) {
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: book,
      create: book,
    });
  }

  console.log(`${books.length} books seeded successfully.`);

  // Display database summary
  const genreCount = await prisma.genre.count();
  const bookCount = await prisma.book.count();

  console.log('--------------------------------');
  console.log('DATABASE SEEDING COMPLETED');
  console.log(`Total genres: ${genreCount}`);
  console.log(`Total books: ${bookCount}`);
  console.log('--------------------------------');
}

main()
  .catch((error) => {
    console.error('Database seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
