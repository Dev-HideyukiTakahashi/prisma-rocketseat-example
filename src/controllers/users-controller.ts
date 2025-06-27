import { Request, Response } from 'express';

import { prisma } from '@/prisma';

class UsersController {
  async index(request: Request, response: Response) {
    return response.json();
  }

  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    await prisma.user.create({ data: { name, email } });

    return response.status(201).json();
  }

  async show(request: Request, response: Response) {
    return response.json();
  }
}

export { UsersController };
