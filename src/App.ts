import * as path from 'path';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';
import * as logger from './logger/Logger';

import AgentRouter from './routes/AgentRouter';
import NetworkRouter from './routes/NetworkRouter';
import ProjectRouter from './routes/ProjectRouter';
import TemplateRouter from './routes/TemplateRouter';

class App {

  // ref to Express instance
  public express: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(cors());
    this.express.use(bodyParser.urlencoded({extended: true}));
    this.express.use(bodyParser.json());
    this.express.use(logger.before);
  }

  // Configure API endpoints.
  private routes(): void {
    this.express.get('/', (req, res, next) => {
      res.send('API is running');
    });

    this.express.use('/api/agent', AgentRouter);
    this.express.use('/api/network', NetworkRouter);
    this.express.use('/api/project', ProjectRouter);
    this.express.use('/api/template', TemplateRouter);

    this.express.use(logger.after);

  }

}

export default new App().express;
