import express from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionController from './controllers/ConnectionController';

const routes = express.Router();

const classesController = new ClassesController();
const connectionController = new ConnectionController();

// Criar aula -> user, class, classSchedule
routes.post('/classes', classesController.create);

// Lista aulas com filtros (week_day, subject e time)
routes.get('/classes', classesController.index);

// Criar uma conexão
routes.post('/connections', connectionController.create);

// Listar conexões
routes.get('/connections', connectionController.index);

export default routes;