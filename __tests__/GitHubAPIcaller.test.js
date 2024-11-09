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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GitHubAPIcaller_1 = require("../src/GitHubAPIcaller");
const axios_1 = __importDefault(require("axios"));
jest.mock('axios');
describe('GitHubAPIcaller tests', () => {
    let spyConsoleError;
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
        spyConsoleError = jest.spyOn(console, 'error').mockImplementation(() => { }); // Mock console.error to suppress logs
    });
    afterEach(() => {
        jest.restoreAllMocks(); // Restore original console.error after tests
    });
    it('should return GitHub repo URL for a valid package', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockNpmData = {
            repository: {
                url: 'https://github.com/test-user/test-repo',
            },
        };
        axios_1.default.get.mockResolvedValueOnce({ data: mockNpmData });
        const result = yield (0, GitHubAPIcaller_1.getNpmPackageGithubRepo)('test-package');
        expect(result).toBe('https://github.com/test-user/test-repo');
    }));
    it('should return null if no GitHub repo found', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockNpmData = {
            repository: {
                url: 'https://bitbucket.org/test-user/test-repo',
            },
        };
        axios_1.default.get.mockResolvedValueOnce({ data: mockNpmData });
        const result = yield (0, GitHubAPIcaller_1.getNpmPackageGithubRepo)('test-package');
        expect(result).toBeNull();
    }));
    it('should log an error and return null if the NPM API fails', () => __awaiter(void 0, void 0, void 0, function* () {
        axios_1.default.get.mockRejectedValueOnce(new Error('NPM API is down'));
        const result = yield (0, GitHubAPIcaller_1.getNpmPackageGithubRepo)('nonexistent-package');
        expect(result).toBeNull();
        // Ensure that console.error was called with the correct message
        expect(spyConsoleError).toHaveBeenCalledWith('Failed to fetch NPM package data for nonexistent-package:', expect.any(Error));
    }));
});
//# sourceMappingURL=GitHubAPIcaller.test.js.map