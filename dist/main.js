#!/usr/bin/env node 
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPackageData = processPackageData;
//got above line from ChatGPT REF: [1]
const fs = __importStar(require("fs"));
// import logger
const logger_1 = __importDefault(require("./logger"));
const logFile = process.env.LOG_FILE;
const githubToken = process.env.GITHUB_TOKEN;
// Exit with an error code if the required environment variables are not set
if (logFile == "" || githubToken == "") {
    logger_1.default.error("Error: LOG_FILE or GITHUB_TOKEN environment variable is not set.");
    process.exit(1); // Exit unsuccessfully
}
else {
    logger_1.default.info("LOG_FILE and GITHUB_TOKEN environment variables are set.");
}
logger_1.default.info("Getting URLs...");
//get the input from ./run {input}
let input_args = process.argv.slice(2); //gets user arguments pass in from run bash script REF: [2]
let filepath = input_args.length > 0 ? input_args[0] : "test"; //if no mode is passed in, default to test
// Read the URLs from the given filepath
const url_file = fs.readFileSync(filepath, 'utf-8'); // Import file
// Split the URLs, trim whitespace, and filter out any empty lines
const urls = url_file
    .split('\n')
    .map(url => url.trim())
    .filter(url => url.length > 0); // Filter out blank lines
// import fetch/print functions and interfaces
const CalculateMetrics_1 = __importStar(require("./CalculateMetrics"));
const GitHubAPIcaller_1 = require("./GitHubAPIcaller");
const License_1 = require("./License");
// Get the GitHub repository URL for a given NPM package
function processPackageData(packageName) {
    return __awaiter(this, void 0, void 0, function* () {
        const githubRepo = yield (0, GitHubAPIcaller_1.getNpmPackageGithubRepo)(packageName);
        if (githubRepo) {
            // Return the GitHub repository URL
            return githubRepo;
        }
        else {
            logger_1.default.error(`No GitHub repository found for ${packageName}`);
            // exit(1);
            //**LOGGING - we need better log here
            return "";
        }
    });
}
logger_1.default.info("Processing URLs...");
for (let i = 0; i < urls.length; i++) { //loop through all of the urls
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try { //Get data from url
            let link_split = urls[i].split("/"); //splits each url into different parts
            let owner;
            let repository;
            owner = "";
            repository = "";
            if (link_split[2] === "github.com") { //if its github we can just use owner repository from url
                owner = link_split[3];
                repository = link_split[4].replace(".git", "");
            }
            else if (link_split[2] === "www.npmjs.com") {
                //whatever our get link for npm will be (hard coding with working test case for now)
                const githubRepoOut = yield processPackageData(link_split[4]);
                urls[i] = githubRepoOut; //fix for license
                let link_split_npm = githubRepoOut.split("/"); //splits each url into different parts
                owner = link_split_npm[3];
                repository = link_split_npm[4].replace(".git", "");
            }
            else {
                logger_1.default.error("URL is not a valid GitHub or NPM URL");
            }
            //variables for latency calculations
            let start;
            let end;
            let netScoreStart;
            let netScoreEnd;
            netScoreStart = performance.now();
            //get non-api metrics
            start = performance.now();
            const foundLicense = yield (0, License_1.getLicense)(urls[i], repository);
            end = performance.now();
            const foundLicenseLatency = ((end - start) / 1000).toFixed(3);
            // get inferfaces to get all metrics for repository information
            const repoIssues = yield (0, GitHubAPIcaller_1.fetchRepositoryIssues)(owner, repository);
            const repoUsers = yield (0, GitHubAPIcaller_1.fetchRepositoryUsers)(owner, repository);
            const repoDependencies = yield (0, GitHubAPIcaller_1.fetchRepositoryDependencies)(owner, repository);
            // API metric calculations
            //bus factor
            start = performance.now();
            const busFactor = (0, CalculateMetrics_1.calculateBusFactorScore)(repoUsers);
            end = performance.now();
            const busFactorLatency = ((end - start) / 1000).toFixed(3);
            //correctness
            start = performance.now();
            const correctness = (0, CalculateMetrics_1.calculateCorrectness)(repoIssues);
            end = performance.now();
            const correctnessLatency = ((end - start) / 1000).toFixed(3);
            //ramp up
            start = performance.now();
            const rampUp = (0, CalculateMetrics_1.calculateRampUpScore)(repoUsers);
            end = performance.now();
            const rampUpLatency = ((end - start) / 1000).toFixed(3);
            //responsive maintainer
            start = performance.now();
            const responsiveMaintainer = (0, CalculateMetrics_1.calculateResponsiveMaintainerScore)(repoIssues);
            end = performance.now();
            const responsiveMaintainerLatency = ((end - start) / 1000).toFixed(3);
            //version pinning
            start = performance.now();
            const versionPinning = (0, CalculateMetrics_1.calculateVersionPinning)(repoDependencies);
            end = performance.now();
            const versionPinningLatency = ((end - start) / 1000).toFixed(3);
            //net score
            const netScore = (0, CalculateMetrics_1.default)(busFactor, correctness, responsiveMaintainer, rampUp, foundLicense, versionPinning);
            netScoreEnd = performance.now();
            const netScoreLatency = ((netScoreEnd - netScoreStart) / 1000).toFixed(3);
            // Assuming each variable is defined correctly for each URL
            var output_string = `{"URL":"${urls[i]}", "NetScore":${netScore}, "NetScore_Latency": ${netScoreLatency}, "RampUp":${rampUp}, "RampUp_Latency": ${rampUpLatency}, "Correctness":${correctness}, "Correctness_Latency":${correctnessLatency}, "BusFactor":${busFactor}, "BusFactor_Latency": ${busFactorLatency}, "ResponsiveMaintainer":${responsiveMaintainer}, "ResponsiveMaintainer_Latency": ${responsiveMaintainerLatency}, "VersionPinning": ${versionPinning}, "VersionPinning_Latency": ${versionPinningLatency}, "License":${foundLicense}, "License_Latency": ${foundLicenseLatency}}`;
            logger_1.default.info("Generating JSON output for URL: " + urls[i]);
            // Only write the JSON object followed by a newline
            logger_1.default.info(`netScore: ${netScore}\nrampUp: ${rampUp}\ncorrectness: ${correctness}\nbusFactor: ${busFactor}\nresponsiveMaintainer: ${responsiveMaintainer}\nversionPinning: ${versionPinning}\nfoundLicense: ${foundLicense}`);
            process.stdout.write(output_string + '\n');
        }
        catch (error) {
            logger_1.default.error('Error:', error);
        }
    }))();
}
//# sourceMappingURL=main.js.map