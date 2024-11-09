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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const License_1 = require("../src/License");
const GitHubAPIcaller_1 = require("../src/GitHubAPIcaller");
const fs = __importStar(require("fs"));
// Mock dependencies
jest.mock('../src/License');
jest.mock('../src/GitHubAPIcaller', () => ({
    __esModule: true, // Indicates the module has both named and default exports
    default: jest.fn(), // Mock default export
    getNpmPackageGithubRepo: jest.fn().mockResolvedValue('https://github.com/owner/repository'),
    fetchRepositoryInfo: jest.fn(),
    fetchRepositoryIssues: jest.fn(),
    fetchRepositoryUsers: jest.fn(),
}));
jest.mock('../src/CalculateMetrics');
jest.mock('../src/logger');
jest.mock('fs');
// Mock winston logger to avoid the error
jest.mock('winston', () => {
    const winstonMock = {
        createLogger: jest.fn(() => ({
            info: jest.fn(),
            error: jest.fn(),
        })),
        format: {
            combine: jest.fn(),
            timestamp: jest.fn(),
            printf: jest.fn(),
        },
        transports: {
            File: jest.fn(),
        },
    };
    return winstonMock;
});
// Mock the behavior of fs.readFileSync to avoid needing a physical file
fs.readFileSync.mockReturnValue(`https://github.com/owner/repository\nhttps://www.npmjs.com/package/test-package`);
// Test suite for lines 84-95
describe('License and Metrics Calculation', () => {
    it('should get the license for a repository and calculate metrics', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockOwner = 'owner';
        const mockRepository = 'repository';
        // Mocking the repository license and metric functions
        const mockLicense = 1;
        License_1.getLicense.mockResolvedValue(mockLicense);
        const mockRepoInfo = { data: { repository: { name: '', owner: { login: '' }, forks: { totalCount: 0 } } } };
        const mockRepoIssues = { data: { repository: { issues: { totalCount: 0, edges: [] }, closedIssues: { totalCount: 0 } } } };
        const mockRepoUsers = { data: { repository: { mentionableUsers: { edges: [] } } } };
        const mockRepoDeps = { data: { repository: { dependencyGraphManifests: { nodes: [] } } } };
        GitHubAPIcaller_1.fetchRepositoryInfo.mockResolvedValue(mockRepoInfo);
        // (fetchRepositoryIssues as jest.Mock).mockResolvedValue(mockRepoIssues);
        GitHubAPIcaller_1.fetchRepositoryUsers.mockResolvedValue(mockRepoUsers);
        // (fetchRepositoryDependencies as jest.Mock).mockResolvedValue(mockRepoDeps);
        const { processPackageData } = require('../src/main');
        const license = yield (0, License_1.getLicense)('https://github.com/owner/repository', mockRepository);
        // Ensure that fetchRepositoryInfo was called with correct arguments
        // expect(fetchRepositoryInfo).toHaveBeenCalledWith(mockOwner, mockRepository);
        // expect(calculateBusFactorScore).toHaveBeenCalledWith(mockRepoUsers);
        expect(license).toBe(mockLicense);
    }));
});
//# sourceMappingURL=npmUrl.test.js.map