import * as SDK from "azure-devops-extension-sdk";
import { IProjectInfo } from "azure-devops-extension-api";
import { GitRepository } from "azure-devops-extension-api/Git";
import { Build, BuildDefinitionReference, BuildResult, BuildStatus } from "azure-devops-extension-api/Build";
import { EnvironmentStatus } from "azure-devops-extension-api/Release";
import { TeamProject } from "azure-devops-extension-api/Core";

export interface IServiceContext {
    getSDK(): IAzDOSDK;
    getrepoService(): IRepoService;
    getbuildService() : IBuildService;
    getReleaseService() : IReleaseService;

    getProjectName() : string;


    repoService: IRepoService;
    buildService: IBuildService;
    releaseService: IReleaseService;
    sdk: IAzDOSDK;
}

export class ReleaseStage {
    name: string = "";
    status: EnvironmentStatus = 0;
    Url: string = "#";
}


export interface IRepoService {
    getRepoType(): string;
    searchForRepos(text: string): Promise<Array<IRepoSearchResult>>;
}

export interface IRepoSearchResult {
    repo: GitRepository;
    getPullRequestsLink(): string;
    getBranchesLink(): string;
    getCommitsLink(): string;
    getDefaultBranch(): string;
    getPoliciesLink(): string;
}

export interface IReleaseResult {
    name: string;
    id: number;
    projectId: string;
    url: string;
}

export class LatestRelease {
    id: number = -1;
    name: string = "";
    url: string = "";
    environments: ReleaseStage[] = new Array<ReleaseStage>();

    constructor() { 

    }
    
    init(name: string, id: number,  url: string) : LatestRelease {
        this.name = name;
        this.url = url;        
        this.id = id;
        return this;
    }
}

export class AdoReleaseResult implements IReleaseResult {
    name: string;
    id: number;
    projectId: string;
    url: string;

    constructor(name: string, id: number, projectId: string, url: string) {
        this.name = name;
        this.projectId = projectId;
        this.id = id;
        this.url = url;        
    }
}

export class AzdoRepo implements IRepoSearchResult {
    constructor(r: GitRepository) {
        this.repo = r
    }
    getPoliciesLink(): string {
        return this.repo.webUrl;
    }
    getDefaultBranch(): string {
        console.log(this.repo.defaultBranch, 'default branch');
        if(this.repo.defaultBranch  != null)
        {
           return this.repo.defaultBranch.replace('refs/heads/', '');
        }
        else{
            return '';
        }
    }

    repo: GitRepository;

    getPullRequestsLink(): string {
        return this.repo.webUrl + "/pullrequests"
    }

    getBranchesLink(): string {
        return this.repo.webUrl + "/branches"
    }
    getCommitsLink(): string {
        return this.repo.webUrl + "/commits"
    }
}

export interface IReleaseService {
    searchForReleases(text: string): Promise<Array<IReleaseResult>>;
    getStagesForRelease(id: number): Promise<Array<ReleaseStage>>;
    getLatestReleaseForDefinition(id: number) : Promise<LatestRelease>;
}


export class AzdoBuild {
    buildNumber: string = "";
    finishTime: string = "";
    sourceBranch: string = "";
    //status: BuildStatus = BuildStatus.None;
    result: BuildResult = BuildResult.None;
    Url: string = "#";
}

export interface IBuildService {
    getLatestBuildInfo(id: number): Promise<Array<AzdoBuild>>;
    searchForBuilds(text: string): Promise<Array<IBuildSearchResult>>;
    searchForBuildsByRepoId(repoId: string, repoType: string): Promise<IBuildSearchResult[]>;
}

export interface IBuildSearchResult {
    getBadgeUrl(): string | undefined;
    getWebUrl(): string | undefined;
    buildRef: BuildDefinitionReference;
}

export class GenericBuildSearchResult implements IBuildSearchResult {

    constructor(br: BuildDefinitionReference) {
        this.buildRef = br;        
    }
    getWebUrl(): string | undefined {
        return this.buildRef._links.web.href;
    }

    getBadgeUrl(): string | undefined {
        return this.buildRef._links.badge.href;
    }
    buildRef: BuildDefinitionReference;
}


export interface IAzDOSDK {
    getExtensionContext(): SDK.IExtensionContext;
    getService<T>(contributionId: string): Promise<T>;
    getUser(): SDK.IUserContext;
    getHost(): SDK.IHostContext;
    init(options: SDK.IExtensionInitOptions | undefined): Promise<void>;
    notifyLoadFailed(e: string | Error): Promise<void>;
    notifyLoadSucceeded(): Promise<void>;
    ready(): Promise<void>;
    register<T>(instanceId: string, instance: T): void;
    resize(width: number | undefined, height: number | undefined): void;
    getAccessToken(): Promise<string>;
    getConfiguration(): { [key: string]: any; };
    unregister(instanceId: string): void;
    getContributionId(): string;
    isReal(): boolean;
    coreProject: TeamProject
    
    project: IProjectInfo;
}
