import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    const genre = await this.prisma.genre.findUnique({
      where: { id: createBookDto.genreId },
    });

    if (!genre) {
      throw new NotFoundException(
        `Genre with ID ${createBookDto.genreId} not found.`,
      );
    }

    try {
      return await this.prisma.book.create({
        data: {
          title: createBookDto.title.trim(),
          author: createBookDto.author.trim(),
          isbn: createBookDto.isbn.trim(),
          totalCopies: createBookDto.totalCopies,
          availableCopies: createBookDto.totalCopies,
          genreId: createBookDto.genreId,
          description: createBookDto.description,
          publicationYear: createBookDto.publicationYear,
        },
        include: {
          genre: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'A book with this ISBN already exists.',
        );
      }

      throw error;
    }
  }

  async findAll(
    genreId?: number,
    search?: string,
    page = 1,
    limit = 10,
  ) {
    const where: Prisma.BookWhereInput = {};

    if (genreId !== undefined) {
      where.genreId = genreId;
    }

    if (search?.trim()) {
      const keyword = search.trim();

      where.OR = [
        {
          title: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        {
          author: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [books, total] = await this.prisma.$transaction([
      this.prisma.book.findMany({
        where,
        skip,
        take: limit,
        include: {
          genre: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data: books,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        genre: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!book) {
      throw new NotFoundException(
        `Book with ID ${id} not found.`,
      );
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const existingBook = await this.findOne(id);

    if (updateBookDto.genreId !== undefined) {
      const genre = await this.prisma.genre.findUnique({
        where: { id: updateBookDto.genreId },
      });

      if (!genre) {
        throw new NotFoundException(
          `Genre with ID ${updateBookDto.genreId} not found.`,
        );
      }
    }

    const data: Prisma.BookUpdateInput = {};

    if (updateBookDto.title !== undefined) {
      data.title = updateBookDto.title.trim();
    }

    if (updateBookDto.author !== undefined) {
      data.author = updateBookDto.author.trim();
    }

    if (updateBookDto.isbn !== undefined) {
      data.isbn = updateBookDto.isbn.trim();
    }

    if (updateBookDto.description !== undefined) {
      data.description = updateBookDto.description;
    }

    if (updateBookDto.publicationYear !== undefined) {
      data.publicationYear = updateBookDto.publicationYear;
    }

    if (updateBookDto.genreId !== undefined) {
      data.genre = {
        connect: { id: updateBookDto.genreId },
      };
    }

    if (updateBookDto.totalCopies !== undefined) {
      const borrowedCopies =
        existingBook.totalCopies - existingBook.availableCopies;

      if (updateBookDto.totalCopies < borrowedCopies) {
        throw new BadRequestException(
          `Total copies cannot be less than the ${borrowedCopies} currently borrowed.`,
        );
      }

      data.totalCopies = updateBookDto.totalCopies;
      data.availableCopies =
        updateBookDto.totalCopies - borrowedCopies;
    }

    try {
      return await this.prisma.book.update({
        where: { id },
        data,
        include: {
          genre: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'A book with this ISBN already exists.',
        );
      }

      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.book.delete({
      where: { id },
    });
  }
}
