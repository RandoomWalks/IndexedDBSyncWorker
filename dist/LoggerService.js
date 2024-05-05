"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
var typedi_1 = require("typedi");
var winston = __importStar(require("winston"));
var os = __importStar(require("os"));
var LoggerService = /** @class */ (function () {
    function LoggerService() {
        this.configureLogger();
    }
    LoggerService.prototype.configureLogger = function () {
        var logFormat = winston.format.combine(winston.format.timestamp(), winston.format.printf(function (info) { return "".concat(info.timestamp, " [").concat(info.level, "]: ").concat(info.message); }), winston.format.json());
        var transports = [];
        if (process.env.NODE_ENV !== 'production') {
            transports.push(new winston.transports.Console({
                format: winston.format.simple(),
            }));
        }
        else {
            transports.push(new winston.transports.File({ filename: 'logs/error.log', level: 'error' }));
            transports.push(new winston.transports.File({ filename: 'logs/combined.log' }));
        }
        this.logger = winston.createLogger({
            level: 'info',
            format: logFormat,
            defaultMeta: { service: 'user-service', hostname: os.hostname() },
            transports: transports
        });
    };
    LoggerService.prototype.log = function (message, level) {
        if (level === void 0) { level = 'info'; }
        this.logger.log({ level: level, message: message });
    };
    LoggerService.prototype.info = function (message) {
        this.log(message, 'info');
    };
    LoggerService.prototype.error = function (message) {
        this.log(message, 'error');
    };
    LoggerService.prototype.debug = function (message) {
        this.log(message, 'debug');
    };
    LoggerService = __decorate([
        (0, typedi_1.Service)(),
        __metadata("design:paramtypes", [])
    ], LoggerService);
    return LoggerService;
}());
exports.LoggerService = LoggerService;
