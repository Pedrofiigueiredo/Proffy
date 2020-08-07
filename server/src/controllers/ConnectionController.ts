import { Request, Response } from 'express';
import db from '../database/connection';

export default class ConnectionController {
  async index(request: Request, response: Response) {
    try {
      const totalConnections = await db('connections').count('* as total');

      const { total } = totalConnections[0];

      return response.json({ total })
    } catch (err) {
      console.log(err)

      return response.send();
    }
  }

  async create(request: Request, response: Response) {
    const { user_id } = request.body;

    await db('connections').insert({ user_id });

    return response.status(201).send();
  }
}