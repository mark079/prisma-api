import { Request, Response } from 'express';
import { prisma } from '../database';

export default {
  async createPost(request: Request, response: Response) {
    try {
      const { title, content, userId } = request.body;
      const post = await prisma.post.create({
        data: {
          title: title,
          content: content,
          userId: userId,
        }
      });
      return response.json({
        error: false,
        message: 'Post criado com sucesso',
        post
      });
    } catch (error) {
      return response.json({
        error: true,
        message: error.message
      });
    }
  },
  async listPost(request: Request, response: Response) {
    const { id } = request.params;
    const post = await prisma.post.findUnique({ where: { id: Number(id) } });
    if (!post) {
      return response.json({
        error: true,
        message: 'Post não encontrado'
      });
    }
    return response.json({
      message: post
    });
  },
  async listPosts(request: Request, response: Response) {
    try {
      const posts = await prisma.post.findMany();
      return response.json({
        posts: posts
      });
    } catch (error) {
      return response.json({
        message: error.message
      });
    }
  },
  async updatePost(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const postExist = await prisma.post.findUnique({ where: { id: Number(id) } });
      if (!postExist) {
        return response.json({
          error: true,
          message: 'Post não encontrado!'
        });
      }
      const { title, content, userId } = request.body;
      const userExist = await prisma.user.findUnique({ where: { id: userId } });
      if (!userExist) {
        return response.json({
          error: true,
          message: 'Usuário não encontrado'
        });
      }
      const post = await prisma.post.update({ where: { id: Number(id) }, data: { title, content, userId } });
      return response.json({
        post
      });
    } catch (error) {
      return response.json({
        error: true,
        message: error.message
      });
    }
  },
  async deletePost(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const postExist = await prisma.post.findUnique({ where: { id: Number(id) } });
      if (!postExist) {
        return response.json({
          error: true,
          message: 'Post não encontrado'
        });
      }

      await prisma.post.delete({ where: { id: Number(id) } });
      return response.json({
        message: 'Post deletado com sucesso',
      });

    } catch (error) {
      return response.json({
        message: error.message
      });
    }
  }
};
