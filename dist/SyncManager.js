"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncManager = void 0;
var typedi_1 = require("typedi");
var DatabaseService_1 = require("./DatabaseService");
var DataPreparationService_1 = require("./DataPreparationService");
var DataSyncService_1 = require("./DataSyncService");
var LoggerService_1 = require("./LoggerService");
var SyncManager = /** @class */ (function () {
    function SyncManager(databaseService, dataPreparationService, dataSyncService, logger) {
        this.databaseService = databaseService;
        this.dataPreparationService = dataPreparationService;
        this.dataSyncService = dataSyncService;
        this.logger = logger;
    }
    SyncManager.prototype.performSync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rawData, preparedData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        this.logger.log("SyncManager: Starting the synchronization process.");
                        return [4 /*yield*/, this.databaseService.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.fetchData()];
                    case 2:
                        rawData = _a.sent();
                        return [4 /*yield*/, this.dataPreparationService.prepareData(rawData)];
                    case 3:
                        preparedData = _a.sent();
                        return [4 /*yield*/, this.dataSyncService.sync(preparedData)];
                    case 4:
                        _a.sent();
                        this.logger.log("SyncManager: Data synchronization completed successfully.");
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        this.logger.error("SyncManager: Error during synchronization - ".concat(error_1.message));
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SyncManager.prototype.fetchData = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Simulate fetching raw data that needs to be synchronized
                this.logger.log("SyncManager: Fetching data for preparation...");
                return [2 /*return*/, new Promise(function (resolve) { return setTimeout(function () { return resolve([{ id: 1, data: 'Example' }]); }, 1000); })];
            });
        });
    };
    SyncManager = __decorate([
        (0, typedi_1.Service)(),
        __param(0, (0, typedi_1.Inject)()),
        __param(1, (0, typedi_1.Inject)()),
        __param(2, (0, typedi_1.Inject)()),
        __param(3, (0, typedi_1.Inject)()),
        __metadata("design:paramtypes", [DatabaseService_1.DatabaseService,
            DataPreparationService_1.DataPreparationService,
            DataSyncService_1.DataSyncService,
            LoggerService_1.LoggerService])
    ], SyncManager);
    return SyncManager;
}());
exports.SyncManager = SyncManager;
