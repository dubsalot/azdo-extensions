import React = require("react");
import { IServiceContext, IReleaseService } from "@serviceinterfaces";
import { IAzDOSDK } from "@serviceinterfaces";
import { IRepoService } from "@serviceinterfaces";
import { IBuildService } from "@serviceinterfaces";
import { AzDOSDKWrapper } from "./AzDOSDKWrapper";
import { FakeBuildService, FakeRepoService, FakeReleaseService } from "./FakeServices";


export class FakeContext implements IServiceContext 
{
    project: import("azure-devops-extension-api").IProjectInfo | undefined;
    initialized: boolean = false;

    initialize(): void {
        this.initialized = true;
    }
    
    getProjectName(): string {
        return "Ease";
    }

    getSDK(): IAzDOSDK {
        return new AzDOSDKWrapper();
    }

    getrepoService(): IRepoService {
        return new FakeRepoService();
    }

    getbuildService() : IBuildService {
        return new FakeBuildService();
    }

    getReleaseService() : IReleaseService {
        return new FakeReleaseService();
    }

    buildService: IBuildService = this.getbuildService();
    repoService: IRepoService = this.getrepoService();
    releaseService: IReleaseService = this.getReleaseService();
    sdk: IAzDOSDK = this.getSDK(); 
}

