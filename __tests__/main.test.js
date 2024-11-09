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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const logger_1 = __importDefault(require("../src/logger"));
// Mock external dependencies
jest.mock('fs');
jest.mock('../src/logger', () => ({
    error: jest.fn(),
    info: jest.fn(),
}));
jest.mock('../src/License');
jest.mock('../src/GitHubAPIcaller', () => ({
    __esModule: true,
    default: jest.fn(),
    fetchRepositoryIssues: jest.fn(),
    fetchRepositoryUsers: jest.fn(),
}));
// Mock Winston's File transport
jest.mock('winston', () => {
    const mLogger = {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
    };
    return {
        createLogger: jest.fn(() => mLogger),
        transports: {
            File: jest.fn()
        },
        format: {
            combine: jest.fn(),
            timestamp: jest.fn(),
            printf: jest.fn()
        }
    };
});
// Mock environment variables
process.env.LOG_FILE = 'logfile.log';
process.env.GITHUB_TOKEN = 'token123';
describe('Main file tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should exit with code 1 if LOG_FILE or GITHUB_TOKEN is not set', () => {
        process.env.LOG_FILE = '';
        process.env.GITHUB_TOKEN = '';
        const mockExit = jest.spyOn(process, 'exit').mockImplementation((code) => {
            throw new Error(`process.exit(${code})`);
        });
        try {
            require('../src/main');
        }
        catch (e) {
            expect(mockExit).toHaveBeenCalledWith(1);
            expect(logger_1.default.error).toHaveBeenCalledWith("Error: LOG_FILE or GITHUB_TOKEN environment variable is not set.");
        }
        finally {
            mockExit.mockRestore();
        }
    });
    it('should log success when environment variables are set', () => {
        process.env.LOG_FILE = 'logfile.log';
        process.env.GITHUB_TOKEN = 'token123';
        jest.spyOn(fs, 'readFileSync').mockReturnValue('https://github.com/user/repo\n');
        require('../src/main');
        expect(logger_1.default.info).toHaveBeenCalledWith("LOG_FILE and GITHUB_TOKEN environment variables are set.");
        expect(logger_1.default.info).toHaveBeenCalledWith("Getting URLs...");
        expect(fs.readFileSync).toHaveBeenCalledWith('test', 'utf-8');
    });
});
//# sourceMappingURL=main.test.js.map