import * as winston from 'winston';
import * as fs from 'fs';
import 'winston-daily-rotate-file';
import {Logger as LoggerWinston} from "winston";
import {Application} from "../../application";

class LoggerGame {

    public winston: LoggerWinston;

    constructor() {

        let LOGS_PATH = Application.userDataPath + '/logs/game';
        fs.mkdirSync(LOGS_PATH, {recursive: true});

        this.winston = winston.createLogger({

            transports: [
                new (winston.transports.Console)({
                    handleExceptions: true,
                    level: "debug",
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.timestamp({format: "HH:mm:ss"}),
                        winston.format.printf(info => `${info.level} ${info.timestamp} : ${info.message}`),
                    )
                }),
                new winston.transports.DailyRotateFile({
                    filename: LOGS_PATH + '/logs-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    maxFiles: '28d',
                    handleExceptions: true,
                    level: "debug",
                    format: winston.format.combine(
                        winston.format.timestamp({format: "HH:mm:ss"}),
                        winston.format.printf(info => `${info.level} ${info.timestamp} : ${info.message}`),
                    )
                }),
            ],
            exitOnError: false
        });
    }

    public writeLindoLog(msg) {
        this.winston.debug(JSON.stringify(msg).substr(0, 1200));
    }
}

export const Logger = new LoggerGame();