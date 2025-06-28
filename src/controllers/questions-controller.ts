import { prisma } from '@/prisma';
import { Request, Response } from 'express';

class QuestionsController {
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

    return response.json(questions);
  }

  async create(request: Request, response: Response) {
    const { title, content, user_id } = request.body;

    await prisma.question.create({ data: { title, content, userId: user_id } });
    return response.status(201).json();
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { title, content } = request.body;

    await prisma.question.update({
      data: {
        title,
        content,
      },
      where: {
        id,
      },
    });

    return response.json();
  }

  async remove(request: Request, response: Response) {
    const { id } = request.params;

    await prisma.question.delete({
      where: { id },
    });

    return response.json();
  }
}

export { QuestionsController };
