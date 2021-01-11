const dotenv = require('dotenv');
import { IServerConfig, IConfig, IMongoDBConfig, IAuth, IMail } from "./config.types";

class Config implements IConfig {
    public server: IServerConfig;
    public mongoDB: IMongoDBConfig;
    public auth: IAuth;
    public mail: IMail;

    constructor() {
        dotenv.config();
        this.loadServerConfig();
        this.loadMongoDBConfig();
        this.loadAuthConfig();
        this.loadMailConfig();
    }

    loadServerConfig(): void {
        this.server = {
            host: process.env.HOME,
            port: Number(process.env.PORT) || Number(process.env.NODE_PORT),
            protocol: process.env.NODE_PROTOCOL,
        }
    }

    loadMongoDBConfig(): void {
        this.mongoDB = {
            connectionString: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.xfwdi.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`,
        }
    }

    loadAuthConfig(): void {
        this.auth = {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRESIN,
            adminPass: process.env.ADMIN_PASS,
        }
    }

    loadMailConfig(): void {
        this.mail = {
            pass: process.env.MAIL_PASS,
            service: process.env.MAIL_SERVICE,
            user: process.env.MAIL_USER,
        }
    }
}

export default Config;