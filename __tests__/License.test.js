"use strict";
// __tests__/License.test.ts
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
process.env.LOG_FILE = 'test.log'; // Set the environment variable before any imports
const fs = __importStar(require("fs"));
const git = __importStar(require("isomorphic-git"));
const License_1 = require("../src/License"); // Adjusted import path for src folder
jest.mock('fs');
jest.mock('isomorphic-git');
describe('getLicense', () => {
    const mockClone = git.clone;
    const mockReadFileSync = fs.readFileSync;
    const mockReaddirSync = fs.readdirSync;
    const mockRmSync = fs.rmSync;
    const testUrl = 'https://github.com/some/repo';
    const testRepo = 'repo';
    const cloneDir = 'clonedGitRepos/repo'; // Adjusted to match actual behavior
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should return 1 when a compatible LICENSE file is found', () => __awaiter(void 0, void 0, void 0, function* () {
        mockClone.mockResolvedValueOnce(undefined); // Simulate successful clone
        mockReaddirSync.mockReturnValueOnce(['LICENSE']); // Simulate LICENSE file exists
        mockReadFileSync.mockReturnValueOnce('MIT License'); // Simulate LICENSE content
        mockRmSync.mockReturnValueOnce(undefined); // Simulate successful removal
        const result = yield (0, License_1.getLicense)(testUrl, testRepo);
        expect(result).toBe(1); // License is compatible
        // expect(mockClone).toHaveBeenCalledWith({
        //   fs: expect.any(Object), // Use expect.any() to match the fs module
        //   http,
        //   dir: cloneDir, // Adjust the path as per actual behavior
        //   url: testUrl,
        //   singleBranch: true,
        //   depth: 1
        // });
    }));
    it('should return 0 when an incompatible LICENSE file is found', () => __awaiter(void 0, void 0, void 0, function* () {
        mockClone.mockResolvedValueOnce(undefined); // Simulate successful clone
        mockReaddirSync.mockReturnValueOnce(['LICENSE']); // Simulate LICENSE file exists
        mockReadFileSync.mockReturnValueOnce('Some Other License'); // Simulate incompatible LICENSE content
        mockRmSync.mockReturnValueOnce(undefined); // Simulate successful removal
        const result = yield (0, License_1.getLicense)(testUrl, testRepo);
        expect(result).toBe(0); // License found but not compatible
    }));
    it('should return 0 when no LICENSE file but README contains license information', () => __awaiter(void 0, void 0, void 0, function* () {
        mockClone.mockResolvedValueOnce(undefined); // Simulate successful clone
        mockReaddirSync.mockReturnValueOnce(['README']); // Simulate README exists
        mockReadFileSync.mockReturnValueOnce('This project is licensed under the MIT License.'); // Simulate README license content
        mockRmSync.mockReturnValueOnce(undefined); // Simulate successful removal
        const result = yield (0, License_1.getLicense)(testUrl, testRepo);
        expect(result).toBe(1); // README contains a compatible license
    }));
    it('should return -1 when no LICENSE or README file is found', () => __awaiter(void 0, void 0, void 0, function* () {
        mockClone.mockResolvedValueOnce(undefined); // Simulate successful clone
        mockReaddirSync.mockReturnValueOnce([]); // Simulate no LICENSE or README file
        mockRmSync.mockReturnValueOnce(undefined); // Simulate successful removal
        const result = yield (0, License_1.getLicense)(testUrl, testRepo);
        expect(result).toBe(-1); // No license found
    }));
});
//# sourceMappingURL=License.test.js.map