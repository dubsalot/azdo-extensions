import React = require("react");
import { AzDOSDK } from "./AzDOSDK";
import { IAzDOSDK, IReleaseService } from "@serviceinterfaces";
import { IRepoService } from "@serviceinterfaces";
import { IBuildService } from "@serviceinterfaces";
import { IServiceContext } from "@serviceinterfaces";

import { RepoService } from "./RepoService";
import { BuildService } from "./BuildService";
import { ReleaseService } from "./ReleaseService";

export function getContextProv() : IServiceContext { 
    return new AzDoContext();
}

export class AzDoContext implements IServiceContext {
    sdk: AzDOSDK;
    buildService!: IBuildService;
    repoService!: IRepoService;
    releaseService!: IReleaseService;

    constructor() {
        this.sdk = new AzDOSDK();
        this.buildService = new BuildService();
        this.repoService = new RepoService();
        this.releaseService = new ReleaseService();
    }
    getReleaseService(): IReleaseService {
        return this.releaseService;
    }
    

    getProjectName(): string {
        return this.sdk.project.name;
    }

    getSDK(): IAzDOSDK {
        return this.sdk;
    }

    getrepoService(): IRepoService {
        return this.repoService;
    }

    getbuildService(): IBuildService {
        return this.buildService;
    }
}