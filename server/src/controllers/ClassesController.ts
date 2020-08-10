import { Request, Response } from 'express';

import db from '../database/connection';
import convertHourToMinutes from "../utils/convertHourToMinutes";

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string
}

export default class ClassesController {
  async index(request: Request, response: Response) {
    const filters = request.query;

    const week_day = filters.week_day as string;
    const subject = filters.subject as string;
    const time = filters.time as string;

    // Se o usuário não adicionou nenhum filtro
    if(!filters.week_day || !filters.subject || !filters.time) {
      return response.status(400).json({
        error: 'Missing filter to search classes'
      });
    };

    const timeInMinutes = convertHourToMinutes(time);

    // classes.subject -> tabela.coluna
    const classes = await db('classes')
      //Verificar se existe um horário que o user escolheu
      .whereExists(function() {
        this.select('class_schedule.*')
        .from('class_schedule')
        .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
        .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
        .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
        .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
      })
      .where('classes.subject', '=', subject)
      .join('users', 'classes.user_id', '=', 'users.id')
      .select(['classes.*', 'users.*']);

    return response.json(classes);
  };


  async create(request: Request, response: Response) {
    const {
        name,
        avatar,
        whatsapp,
        bio,
        subject,
        cost,
        schedule
    } = request.body;

    const trx = await db.transaction();

    try {
      // Envia os dados para a tabela USERS
      const insertedUsersId = await trx('users').insert({
        name,
        avatar,
        whatsapp,
        bio
      });

      // Pega o ID do usuário criado
      const user_id = insertedUsersId[0]

      // Envia os dados para a tabela CLASSES
      const insertedClassesId = await trx('classes').insert({
        subject,
        cost,
        user_id
      });

      // Pega o ID da aula criada
      const class_id = insertedClassesId[0];

      // Envia os dados para a tabela CLASS-SCHEDULE
      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
            week_day: scheduleItem.week_day,
            from: convertHourToMinutes(scheduleItem.from),
            to: convertHourToMinutes(scheduleItem.to),
            class_id
        };
      });

      await trx('class_schedule').insert(classSchedule);

      await trx.commit(); //Aqui ele faz alterações no banco

      return response.status(201).send();

    } catch (err) {
        
        await trx.rollback();

        return response.status(400).json({
            error: 'Unexpected error while creating new class'
        });
    };
  };
};