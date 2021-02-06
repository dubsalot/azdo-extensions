import * as SDK from "../../../node_modules/azure-devops-extension-sdk/SDK"
import {IAzDOSDK} from "@serviceinterfaces"
import { IProjectInfo } from "azure-devops-extension-api";
import { TeamProject } from "azure-devops-extension-api/Core";

//wrap SDK functions with fakes/mocks where we can - things that would cause errors during local dev.


export class FakeHostContext implements SDK.IHostContext {
    id: string;
    name: string;
    serviceVersion: string;
    type: SDK.HostType;

    constructor() {
        this.id = "";
        this.name = "";
        this.serviceVersion = "";
        this.type = SDK.HostType.Deployment
    }


}

export class AzDOSDKWrapper implements IAzDOSDK {
    HostType: typeof SDK.HostType;
    constructor() {
        this.HostType = SDK.HostType;

    }
    coreProject!: TeamProject;
    project: IProjectInfo =  { id: "12345", name: "FakeProject"};
    
    isReal(): boolean {
       return false;
    }

    public getExtensionContext(): SDK.IExtensionContext {
        return {
            id: "localdebug",
            publisherId: "localdebug",
            extensionId: "localdebug",
            version: "localdebug"
        };
    }

    public getService<T>(contributionId: string): Promise<T> {
        return new Promise<T>((resolve) => {
            console.log("Fake SDK getService called");
            resolve();
        });
    }

    public getUser(): SDK.IUserContext {
        return {
            descriptor: "1234-1234",
            id: "12",
            name: "Wes.Goodwin",
            displayName: "Wes Gooodwin",
            imageUrl: ""
        };
    }

    public getHost(): SDK.IHostContext {
        return new FakeHostContext();
    }

    public init(options?: SDK.IExtensionInitOptions | undefined): Promise<void> {

        return new Promise<void>(() => {
            console.log("Fake SDK init called");
        });
    }

    public notifyLoadFailed(e: string | Error) : Promise<void> {

        
        return new Promise<void>(() => {
            console.log("Fake SDK notifyLoadFailed called");
        });
    }

    public notifyLoadSucceeded() : Promise<void> {
        return new Promise<void>(() => {
            console.log("Fake SDK notifyLoadSucceeded called");
        });
    }

    public ready() :Promise<void> {

        return new Promise<void>((r) => {
            console.log("Fake SDK ready called");
            r();
        });
    }

    public register<T>(instanceId: string, instance: T) {
        console.log("Fake SDK register was called");
    }

    public resize(width?: number | undefined, height?: number | undefined) {
        console.log("Fake SDK resize was called");
    }

   

    public getAccessToken(): Promise<string> {
        return new Promise<string>((resolve) => {
            console.log("Fake SDK getAccessToken called");
            resolve();
        })
    }

    public getConfiguration(): { [key: string]: any; } {
        var configs: { [key: string]: any; } = {};
        configs["connectionstring"] = "my connection string"
        return configs;
    }

    public unregister (instanceId: string) {
        console.log("Fake SDK unregister called");    }

    public getContributionId(): string {
        return "stuff";
    }
}
