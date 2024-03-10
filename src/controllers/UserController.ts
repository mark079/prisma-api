import { Request, Response } from 'express';
import { prisma } from '../database';

export default {
  async createUser(request: Request, response: Response) {
    try {
      const { name, email } = request.body;
      const userExist = await prisma.user.findUnique({ where: { email } });
      if (userExist) {
        return response.json({
          error: true,
          message: 'Usuário já existe'
        });
      }
      const user = await prisma.user.create({
        data: {
          name: name,
          email: email
        }
      });
      return response.json({
        error: false,
        message: 'Usuário criado com sucesso',
        user
      });
    } catch (error) {
      response.json({
        message: error.message
      });
    }
  },
};
