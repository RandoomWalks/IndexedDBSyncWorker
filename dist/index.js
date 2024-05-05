"use strict";
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
require("reflect-metadata"); // Required for Typedi to use decorators
var typedi_1 = require("typedi");
var DatabaseService_1 = require("./DatabaseService");
var DataPreparationService_1 = require("./DataPreparationService");
var DataSyncService_1 = require("./DataSyncService");
var SyncManager_1 = require("./SyncManager");
var LoggerService_1 = require("./LoggerService");
var ConflictResolver_1 = require("./ConflictResolver");
function setup() {
    return __awaiter(this, void 0, void 0, function () {
        var syncManager, error_1, logger;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Register services with the container
                    // Container.set(LoggerService, new LoggerService());
                    typedi_1.Container.set(LoggerService_1.LoggerService, new LoggerService_1.LoggerService());
                    typedi_1.Container.set(ConflictResolver_1.ConflictResolver, new ConflictResolver_1.ConflictResolver());
                    typedi_1.Container.set(DataPreparationService_1.DataPreparationService, new DataPreparationService_1.DataPreparationService(typedi_1.Container.get(LoggerService_1.LoggerService)));
                    typedi_1.Container.set(DataSyncService_1.DataSyncService, new DataSyncService_1.DataSyncService(typedi_1.Container.get(LoggerService_1.LoggerService), typedi_1.Container.get(ConflictResolver_1.ConflictResolver)));
                    typedi_1.Container.set(DatabaseService_1.DatabaseService, new DatabaseService_1.DatabaseService());
                    syncManager = typedi_1.Container.get(SyncManager_1.SyncManager);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, syncManager.performSync()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    logger = typedi_1.Container.get(LoggerService_1.LoggerService);
                    logger.error("An error occurred during the synchronization process: " + error_1.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function shutdown() {
    return __awaiter(this, void 0, void 0, function () {
        var logger, databaseService;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger = typedi_1.Container.get(LoggerService_1.LoggerService);
                    databaseService = typedi_1.Container.get(DatabaseService_1.DatabaseService);
                    return [4 /*yield*/, databaseService.close()];
                case 1:
                    _a.sent();
                    logger.log("Application shutdown gracefully.");
                    return [2 /*return*/];
            }
        });
    });
}
// Set up process listeners for graceful shutdown
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
// Start the application setup
setup();
