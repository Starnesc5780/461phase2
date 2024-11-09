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
Object.defineProperty(exports, "__esModule", { value: true });
const GitHubAPIcaller_1 = require("../src//GitHubAPIcaller");
let repoInfo;
let repoDeps;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    repoInfo = yield (0, GitHubAPIcaller_1.fetchRepositoryInfo)("nullivex", "nodist");
    repoDeps = yield (0, GitHubAPIcaller_1.fetchRepositoryDependencies)("nullivex", "nodist");
}));
it('should output correct repo name', () => {
    expect(repoInfo.data.repository.name).toBe("nodist");
});
it('should output correct owner name', () => {
    expect(repoInfo.data.repository.owner.login).toBe("nodists");
});
it('should output correct fork count', () => {
    // fork count might update after creating this test case
    expect(repoInfo.data.repository.forks.totalCount).toBeGreaterThanOrEqual(209);
});
it('should output correct dependency count', () => {
    expect(repoDeps.data.repository.dependencyGraphManifests.nodes[0].dependencies.totalCount).toBeGreaterThanOrEqual(0);
});
//# sourceMappingURL=fetchRepoInfo.test.js.map