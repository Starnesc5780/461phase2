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
const CalculateMetrics_1 = __importStar(require("../src/CalculateMetrics"));
const GitHubAPIcaller_1 = require("../src//GitHubAPIcaller");
let repoIssues;
let repoUsers;
let repoDeps;
let foundLicense;
let busFactorScore;
let correctnessScore;
let rampUpScore;
let responsiveMaintainerScore;
let versionPinningScore;
let netScore;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    repoIssues = yield (0, GitHubAPIcaller_1.fetchRepositoryIssues)("cloudinary", "cloudinary_npm");
    repoUsers = yield (0, GitHubAPIcaller_1.fetchRepositoryUsers)("cloudinary", "cloudinary_npm");
    repoDeps = yield (0, GitHubAPIcaller_1.fetchRepositoryDependencies)("cloudinary", "cloudinary_npm");
    foundLicense = 1;
    busFactorScore = (0, CalculateMetrics_1.calculateBusFactorScore)(repoUsers);
    correctnessScore = (0, CalculateMetrics_1.calculateCorrectness)(repoIssues);
    rampUpScore = (0, CalculateMetrics_1.calculateRampUpScore)(repoUsers);
    responsiveMaintainerScore = (0, CalculateMetrics_1.calculateResponsiveMaintainerScore)(repoIssues);
    versionPinningScore = (0, CalculateMetrics_1.calculateVersionPinning)(repoDeps);
    netScore = (0, CalculateMetrics_1.default)(busFactorScore, correctnessScore, responsiveMaintainerScore, rampUpScore, foundLicense, versionPinningScore);
}));
it('should calculate the correct bus factor score', () => {
    expect(busFactorScore).toBeCloseTo(0.2);
});
it('should calculate the correct correctness score', () => {
    expect(correctnessScore).toBeGreaterThanOrEqual(0.9);
});
it('should calculate the correct ramp-up score', () => {
    expect(rampUpScore).toBeGreaterThanOrEqual(0.1);
    expect(rampUpScore).toBeLessThanOrEqual(0.5);
});
it('should calculate the correct responsive maintainer score', () => {
    expect(responsiveMaintainerScore).toBeGreaterThanOrEqual(0);
    expect(responsiveMaintainerScore).toBeLessThanOrEqual(1);
});
it('should calculate the correct license score', () => {
    expect(foundLicense == 1);
});
it('should calculate the correct version pinning score', () => {
    expect(versionPinningScore).toBeCloseTo(0.33, 1);
});
it('should calculate the correct net score', () => {
    expect(netScore).toBeGreaterThanOrEqual(0.25);
    expect(netScore).toBeLessThanOrEqual(0.75);
});
//# sourceMappingURL=cloudinary.test.js.map