import * as SDK from "azure-devops-extension-sdk"
import { getClient } from "azure-devops-extension-api";
import { CoreRestClient, TeamProject } from "azure-devops-extension-api/Core"
import { IAzDOSDK } from "@serviceinterfaces"
import { IProjectPageService, CommonServiceIds, IProjectInfo } from "azure-devops-extension-api";

export class AzDOSDK implements IAzDOSDK {
    coreProject!: TeamProject;
    HostType: typeof SDK.HostType = SDK.HostType;
    project!: IProjectInfo;
    isReady: boolean = false;

    public getExtensionContext(): SDK.IExtensionContext {
        return SDK.getExtensionContext();
    }

    public getService<T>(contributionId: string): Promise<T> {
        return SDK.getService<T>(contributionId);
    }

    public getUser(): SDK.IUserContext {
        return SDK.getUser();
    }

    public getHost(): SDK.IHostContext {
        return SDK.getHost();
    }

    public init(options?: SDK.IExtensionInitOptions | undefined): Promise<void> {

        return SDK.init(options);
    }

    public notifyLoadFailed(e: string | Error): Promise<void> {

        return SDK.notifyLoadFailed(e);

    }

    public notifyLoadSucceeded(): Promise<void> {
        return SDK.notifyLoadSucceeded();
    }

    public async ready(): Promise<void> {

        console.debug("Ready Wrapper wait for SDK.ready()");
        await SDK.ready();
        console.debug("Ready Wrapper is Ready");


        if (this.isReal() && (!this.isReady || this.project == undefined)) {
            this.isReady = true;
            let projectService = await this.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
            let p = await projectService.getProject();
            if (p) {
                let coreClient =  getClient<CoreRestClient>(CoreRestClient);
                this.coreProject = await coreClient.getProject(p.id);
                this.project = p;
                console.debug(this.project, "Set Project in Ready Wrapper")
                console.debug(this.coreProject, "Project Info as returned from CoreRestClient")
            }
        }

        return new Promise<void>((r) => {
            r();
        });
    }

    private getWrapperState(): any {
        return { IsReady: this.isReady, isReal: this.isReal, projectHasVal: !(this.project == undefined) }
    }
    public register<T>(instanceId: string, instance: T) {
        return SDK.register<T>(instanceId, instance);
    }

    public resize(width?: number | undefined, height?: number | undefined) {
        SDK.resize(width, height);
    }

    public getAccessToken(): Promise<string> {
        return SDK.getAccessToken();
    }

    public getConfiguration(): { [key: string]: any; } {
        return SDK.getConfiguration();
    }

    public unregister(instanceId: string) {
        SDK.unregister(instanceId);
    }

    public getContributionId(): string {
        return SDK.getContributionId();
    }
    public isReal() {
        return true;
    }
}