import { IRepoService, IRepoSearchResult, AzdoRepo } from "@serviceinterfaces";
import * as shimmy from "@locatorpath";
import { getClient } from "azure-devops-extension-api";
import { GitRestClient } from "azure-devops-extension-api/Git";
import { BuildRestClient, BuildDefinition, BuildDefinitionReference } from "azure-devops-extension-api/Build";

export class RepoService implements IRepoService {
    getRepoType(): string {
        return 'TfsGit';
    }
    async searchForRepos(text: string): Promise<IRepoSearchResult[]> {

        await shimmy.serviceContext.sdk.ready();

        let gitClient = getClient<GitRestClient>(GitRestClient);

        console.debug(`RepoService.searchForRepos() -> await gitClient.getRepositories(${shimmy.serviceContext.sdk.project.id})`);
        let repos = await gitClient.getRepositories(shimmy.serviceContext.sdk.project.id);

        return new Promise<IRepoSearchResult[]>(async (resolve) => {
            let repo_array = new Array<IRepoSearchResult>();
            repos.forEach(r=> {
                if(text == null || text.length <= 0 || r.name.toLocaleLowerCase().indexOf(text.toLocaleLowerCase()) >= 0)
                {
                    repo_array.push(new AzdoRepo(r));
                }
            });        
            if (repo_array.length > 1) {
                console.debug("Sorting results");
                repo_array.sort((a, b) => a.repo.name.toLowerCase() == b.repo.name.toLowerCase() ? 0 : (a.repo.name.toLowerCase() < b.repo.name.toLowerCase() ? -1 : 1))
            }
            resolve(repo_array);
        });
    }
}
