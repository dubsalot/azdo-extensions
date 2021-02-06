import { IReleaseService, IReleaseResult, ReleaseStage, AdoReleaseResult, LatestRelease } from "@serviceinterfaces";
import { ReleaseRestClient, ReleaseExpands } from "azure-devops-extension-api/Release";
import { getClient } from "azure-devops-extension-api";
import * as shimmy from "@locatorpath";
import { release } from "os";

export class ReleaseService implements IReleaseService {

    async getLatestReleaseForDefinition(id: number) : Promise<LatestRelease> {
        await shimmy.serviceContext.sdk.ready();
        let projid = shimmy.serviceContext.sdk.project.id;
        let coreproj = shimmy.serviceContext.sdk.coreProject;

        let releaseClient = getClient<ReleaseRestClient>(ReleaseRestClient);

        console.debug(`calling releaseClient.getReleases(${id}, ...)`);
        let releases = await releaseClient.getReleases(projid, id, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 1, undefined, ReleaseExpands.Environments, undefined, undefined, undefined, undefined, false, undefined, undefined, undefined, undefined);
        
        console.debug(releases, `results for releaseClient.getReleases(${id}, ...)`);
        
        let result = new LatestRelease().init("", -1, "");
        if (releases != null && releases.length > 0) {
            let release = releases[0];
            result = new LatestRelease().init(release.name, release.id, release._links.web.href);
            console.debug(release.properties, "PROPERTIES FOR RELEASE");
            release.environments.forEach((env) => {
                let renv: ReleaseStage = new ReleaseStage();
                renv.status = env.status;
                renv.name = env.name;
                renv.Url = `${coreproj._links.web.href}/_releaseProgress?_a=release-environment-logs&releaseId=${release.id}&environmentId=${env.id}`
                //TODO REPLACE WITH THE CORRECT URL
                //   _releaseProgress?_a=release-environment-logs&releaseId=3&environmentId=12
                result.environments.push(renv);
            });
        }
        return new Promise<LatestRelease>((resolve) => {
            resolve(result);
        });
    }

    async getStagesForRelease(id: number): Promise<ReleaseStage[]> {


        await shimmy.serviceContext.sdk.ready();
        let projid = shimmy.serviceContext.sdk.project.id;

        let releaseClient = getClient<ReleaseRestClient>(ReleaseRestClient);

        console.debug(`calling releaseClient.getReleases(${projid}, ${id}, ...)`);
        let releases = await releaseClient.getReleases(projid, id, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 1, undefined, ReleaseExpands.Environments, undefined, undefined, undefined, undefined, false, undefined, undefined, undefined, undefined);
        console.debug(releases, `results for releaseClient.getReleases(${projid}, ${id}, ...)`);
        let envs = new Array<ReleaseStage>();
        if (releases != null && releases.length > 0 && releases[0].environments != null && releases[0].environments.length > 0) {
            releases[0].environments.forEach((env) => {
                let renv: ReleaseStage = new ReleaseStage();
                renv.status = env.status;
                renv.name = env.name;
                renv.Url = `${releases[0]._links.web.href}&environmentId=${env.id}`
                envs.push(renv);
            });
        }
        return new Promise<ReleaseStage[]>((resolve) => {
            resolve(envs);
        });
    }
    async searchForReleases(text: string): Promise<IReleaseResult[]> {

        await shimmy.serviceContext.sdk.ready();

        let releaseClient = getClient<ReleaseRestClient>(ReleaseRestClient);
        let projid = shimmy.serviceContext.sdk.project.id;
        let releases = await releaseClient.getReleaseDefinitions(projid)
        let data: IReleaseResult[] = new Array<AdoReleaseResult>();
        releases.forEach(r => {
            if (text == null || text.length <= 0 || r.name.toLocaleLowerCase().indexOf(text.toLocaleLowerCase()) >= 0) {
                data.push(new AdoReleaseResult(r.name, r.id, projid, r._links.web.href));
            }
        });

        return new Promise<IReleaseResult[]>((resolve) => {
            data.sort((a, b) => a.name.toLowerCase() == b.name.toLowerCase() ? 0 : (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1))
            resolve(data);
        });
    }
}