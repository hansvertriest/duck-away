import { Application, NextFunction, Request, Response } from 'express';
import { default as multer } from 'multer';
import { memoryStorage } from 'multer';

import {
    TestController,
    DuckController,
    PictureController,
    CheckPointController,
    TeamController,
    SubscriberController
} from '../controllers';
import { AuthService, IConfig, GridFs } from '../services';

class Router {
    private app: Application;
    private config: IConfig;

    private AuthService: AuthService;
    private TestController: TestController;
    private DuckController: DuckController;
    private PictureController: PictureController;
    private CheckPointController: CheckPointController;
    private TeamController: TeamController;
    private SubscriberController: SubscriberController;

    constructor( app: Application, config: IConfig ) {
        this.app = app;
        this.config = config;

        this.AuthService = new AuthService(config);
        this.registerControllers();
        this.registerRoutes();
    }

    private sendAdminToken = (req: Request, res: Response, next: NextFunction): void => {
        try {
            const token = this.AuthService.createAdminToken(req.body.password);
            if (token == '') {
                throw {msg: 'Incorrect admin credentials'};
            } else {
                res.status(200).send({token});
            }
        } catch( error ) {
            console.log(`ERROR! ${error}`)
            res.status(412).send({message: error.msg});
        }
    }

    private sendDuckToken = (req: Request, res: Response, next: NextFunction): void => {
        try {
            const { duckId } = req.body;
            const token = this.AuthService.createDuckToken(duckId);
            if (token == '') {
                throw {msg: 'Couldn\'t create duck token'};
            } else {
                res.status(200).send({token});
            }
        } catch( error ) {
            console.log(`ERROR! ${error}`)
            res.status(412).send({message: error.msg});
        }
    }

    private verifyTokenForAdmin = (req: Request, res: Response, next: NextFunction): void => {
        try {
            if (!req.headers.authorization) throw {status: 403, msg: 'Acces denied' };
            const verification = this.AuthService.verifyToken(req.headers.authorization.split(' ')[1]);
            if (verification.result && verification.content.role === 'admin') {
                next();
            } else {
                throw {status: 403, msg: 'Acces denied' }
            }
        } catch( error ) {
            console.log(`!!! ERROR ${error.msg}`)
            res.status(error.status).send({message: error.msg});
        }
    }

    private verifyTokenForDuck = (req: Request, res: Response, next: NextFunction): void => {
        try {
            if (!req.headers.authorization) throw {status: 403, msg: 'Acces denied' };
            const verification = this.AuthService.verifyToken(req.headers.authorization.split(' ')[1]);
            if (verification.result) {
                req.body.verifiedDuckId = verification.content.id || undefined;
                next();
            } else {
                throw {status: 403, msg: 'Acces denied' }
            }
        } catch( error ) {
            console.log(`!!! ERROR ${error.msg}`)
            res.status(error.status).send({message: error.msg});
        }
    }

    private registerControllers() {
        this.TestController = new TestController();
        this.DuckController = new DuckController();
        this.PictureController = new PictureController();
        this.CheckPointController = new CheckPointController(this.config);
        this.TeamController = new TeamController();
        this.SubscriberController = new SubscriberController();
    }

    private registerRoutes() {
        // get admin token
        this.app.post('/admin', this.sendAdminToken);
        this.app.patch('/admin/duck', this.verifyTokenForAdmin, this.DuckController.updateDuck);
        this.app.post('/admin/duck', this.verifyTokenForAdmin, this.DuckController.newDuck);
        this.app.get('/admin/duck/:id', this.verifyTokenForAdmin, this.DuckController.getDuckAdmin);
        this.app.get('/admin/ducks', this.verifyTokenForAdmin, this.DuckController.getDucksAdmin);
        this.app.post('/admin/team/add', this.verifyTokenForAdmin, this.TeamController.addDuck);
        this.app.post('/admin/team', this.verifyTokenForAdmin, this.TeamController.new);
        this.app.patch('/admin/team', this.verifyTokenForAdmin, this.TeamController.update);
        this.app.get('/admin/team/:id', this.verifyTokenForAdmin, this.TeamController.getByIdAdmin);
        this.app.get('/admin/teams', this.verifyTokenForAdmin, this.TeamController.getAllAdmin);
        this.app.get('/admin/checkpoints', this.verifyTokenForAdmin, this.CheckPointController.getCheckPoints);
        this.app.delete('/admin/checkpoint', this.verifyTokenForAdmin, this.CheckPointController.delete);
        this.app.get('/admin/approve/checkpoint/:id', this.CheckPointController.approve);

        this.app.get('/scanned/team', this.verifyTokenForDuck, this.TeamController.getByDuckIdAdmin);
        this.app.get('/scanned/duck', this.verifyTokenForDuck, this.DuckController.getDuckAdmin);
        this.app.post('/scanned/checkpoint', this.verifyTokenForDuck, this.CheckPointController.newCheckPoint);

        this.app.post('/subscribe', this.verifyTokenForDuck, this.SubscriberController.subscribe);
        this.app.get('/subscribers', this.verifyTokenForAdmin, this.SubscriberController.getAll);
        this.app.delete('/subscriber', this.verifyTokenForAdmin, this.SubscriberController.delete);

        this.app.post(
            '/picture',
            this.verifyTokenForDuck,
			multer({ storage: memoryStorage() }).single('picture'),
			GridFs.resizeAndUploadImage,
			this.PictureController.uploadImage
        );
        this.app.post(
            '/admin/picture',
            this.verifyTokenForAdmin,
			multer({ storage: memoryStorage() }).single('picture'),
			GridFs.resizeAndUploadDuckPic,
			this.PictureController.uploadImage
        );
        this.app.get('/picture/:filename', this.PictureController.show);
        this.app.delete('/picture/:filename', this.PictureController.delete);

        this.app.post('/duck', this.sendDuckToken);
        this.app.patch('/duck/description', this.DuckController.submitDescription);
        this.app.get('/ducks', this.DuckController.getDucksPublic);
        this.app.get('/duck/totalDistance/:id', this.DuckController.getDuckTotalDistance);
        this.app.get('/duck/:id', this.DuckController.getDuckPublic);
        this.app.get('/duck/distance/total/:id', this.DuckController.getTotalDistance);
        this.app.get('/duck/distance/start/:id', this.DuckController.getDistanceFromStart);


        this.app.patch('/team/description', this.TeamController.submitDescription);
        this.app.get('/team/:id', this.TeamController.getByIdPublic);
        this.app.get('/teams', this.TeamController.getAllPublic);





    }
}

export default Router;