import { Connection } from 'mongoose';
import { ExecSyncOptionsWithBufferEncoding } from 'child_process';

export interface IServerConfig {
    host: string;
    port: number;
    protocol: string;
}

export interface IMongoDBConfig {
    connectionString: string;
}

export interface IAuth {
    secret: string;
    expiresIn: string
    adminPass: string;
}

export interface IMail {
    pass: string;
    user: string;
    service: string;
}

export interface IConfig {
    server: IServerConfig;
    mongoDB: IMongoDBConfig;
    auth: IAuth;
    mail: IMail;
}
