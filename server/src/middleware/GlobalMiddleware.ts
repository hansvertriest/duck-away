import { default as bodyParser } from 'body-parser';
import { default as cors } from 'cors';
import { Application } from 'express';

class GlobalMiddleware {
    public static load(app: Application) {
        app.use(bodyParser.json({ limit: '50mb' }))
        app.use(cors({
            origin: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
            exposedHeaders: ['x-auth-token'],
        }));
    }
}

export default GlobalMiddleware;