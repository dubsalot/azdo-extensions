import { IBuildService,IBuildSearchResult,GenericBuildSearchResult, AzdoBuild } from "@serviceinterfaces";
import { getClient } from "azure-devops-extension-api";
import { BuildQueryOrder, BuildRestClient } from "azure-devops-extension-api/Build";
import * as shimmy from "@locatorpath";

export class BuildService implements IBuildService {
    
    async getLatestBuildInfo(id: number): Promise<AzdoBuild[]> {
        await shimmy.serviceContext.sdk.ready();
        let projid = shimmy.serviceContext.sdk.project.id;

        let buildRestClient = getClient<BuildRestClient>(BuildRestClient);

        console.debug(`calling buildRestClient.getBuilds(${projid}, ${id}, ...)`);
        let properties = undefined;
        let builds = await buildRestClient.getBuilds(projid, [id], undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,undefined, properties, 3, undefined, 3, undefined, BuildQueryOrder.FinishTimeDescending, undefined, undefined, undefined, undefined); 
        console.debug(builds, `results for buildRestClient.getBuilds(${projid}, [${id}], ...)`);
        
        let retBuilds = new Array<AzdoBuild>();
        if (builds != null && builds.length > 0) {
            builds.forEach((b) => {
                let buildR: AzdoBuild = new AzdoBuild();
                buildR.buildNumber = b.buildNumber;
                buildR.result = b.result;
                buildR.finishTime = b.finishTime == null ? "" : b.finishTime.toLocaleTimeString();
                buildR.sourceBranch = b.sourceBranch;
                buildR.Url = b._links.web.href;
                retBuilds.push(buildR);
            });
        }
        return new Promise<AzdoBuild[]>((resolve) => {
            resolve(retBuilds);
        });
    }

    async searchForBuilds(text: string): Promise<IBuildSearchResult[]> {
        await shimmy.serviceContext.sdk.ready();

        let buildClient = getClient<BuildRestClient>(BuildRestClient);

        console.debug(`BuildService.searchForBuilds() -> await buildClient.getDefinitions(${shimmy.serviceContext.sdk.project.id})`);
        let buildDefinitions = await buildClient.getDefinitions(shimmy.serviceContext.sdk.project.id)
       
        let build_array = new Array<IBuildSearchResult>();
        let i:number = 0;
        for(i = 0; i < buildDefinitions.length; i++)
        {
            let b = buildDefinitions[i];
            if(text == undefined || text == null || text.length <= 0 || b.name.toLocaleLowerCase().indexOf(text.toLocaleLowerCase()) >= 0)
            {
                let bm = new GenericBuildSearchResult(b);
                build_array.push(bm);
            }
        }

        return new Promise<IBuildSearchResult[]>((resolve) => {
            if (build_array.length > 1) {
                console.debug("Sorting Builds");
                build_array.sort((a, b) => a.buildRef.name.toLowerCase() == b.buildRef.name.toLowerCase() ? 0 : (a.buildRef.name.toLowerCase() < b.buildRef.name.toLowerCase() ? -1 : 1))
            }
            resolve(build_array);
        });        
    }

    async searchForBuildsByRepoId(repoId: string, repoType: string): Promise<IBuildSearchResult[]> {
        await shimmy.serviceContext.sdk.ready();
        let buildClient = getClient<BuildRestClient>(BuildRestClient);
        console.debug(`BuildService.searchForBuilds() -> await buildClient.getDefinitions(${shimmy.serviceContext.sdk.project.id})`);
        
        let buildDefinitions = await buildClient.getDefinitions(shimmy.serviceContext.sdk.project.id, undefined, repoId, 'TfsGit');

        return new Promise<IBuildSearchResult[]>((resolve) => {
            let build_array = new Array<IBuildSearchResult>();
            buildDefinitions.forEach(r=> {
                var x = new GenericBuildSearchResult(r);
                build_array.push(x);
            });
            if (build_array.length > 1) {
                console.debug("Sorting Build Definitions");
                build_array.sort((a, b) => a.buildRef.name.toLowerCase() == b.buildRef.name.toLowerCase() ? 0 : (a.buildRef.name.toLowerCase() < b.buildRef.name.toLowerCase() ? -1 : 1))
            }
            resolve(build_array);
        });            
    }
}