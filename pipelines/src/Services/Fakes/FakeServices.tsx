import { BuildDefinitionReference, BuildResult } from "azure-devops-extension-api/Build";
import { GitRepository } from "azure-devops-extension-api/Git";
import { IRepoService, IRepoSearchResult, AzdoRepo, IBuildService, IBuildSearchResult, GenericBuildSearchResult, IReleaseService, IReleaseResult, ReleaseStage, AzdoBuild, LatestRelease } from "@serviceinterfaces";
import { stat } from "fs";


class FakeService {

}

export class FakeBuildService extends FakeService implements IBuildService {

    constructor() {
        super()
    }

    randomIntFromInterval(min: number, max:number) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    getLatestBuildInfo(id: number): Promise<AzdoBuild[]> {
        let numBuilds = 3;
        let pause = Math.floor(Math.random() * 4) + 1;
        let statuses: number[] = [0, 1, 2, 4, 8, 32];

        //         /**
        //  * No status.
        //  */
        // None = 0,
        // /**
        //  * The build is currently in progress.
        //  */
        // InProgress = 1,
        // /**
        //  * The build has completed.
        //  */
        // Completed = 2,
        // /**
        //  * The build is cancelling
        //  */
        // Cancelling = 4,
        // /**
        //  * The build is inactive in the queue.
        //  */
        // Postponed = 8,
        // /**
        //  * The build has not yet started.
        //  */
        // NotStarted = 32,


        let builds = new Array<AzdoBuild>();
        for (let i = 0; i < numBuilds; i++) {
            let build: AzdoBuild = new AzdoBuild();
            Math.random()
            //build.status = statuses[this.randomIntFromInterval(0, statuses.length - 1)];
            build.buildNumber = "Build-" + i.toString();
            build.finishTime = "30 seconds";
            build.sourceBranch = "master";
            builds.push(build);
        }
        return new Promise<AzdoBuild[]>((resolve) => {
            setTimeout(resolve, pause * 1000, builds);
        });
    }

    searchForBuildsByRepoId(repoId: string): Promise<IBuildSearchResult[]> {
        return this.searchForBuilds("");
    }

    async searchForBuilds(text: string): Promise<IBuildSearchResult[]> {
        let hur: BuildDefinitionReference[] = this._fakebuilds;
        let data = new Array<GenericBuildSearchResult>();
        for (let i = 0; i < hur.length; i++) {
            if (text == null || text.length <= 0 || hur[i].name.toLocaleLowerCase().indexOf(text.toLocaleLowerCase()) >= 0) {
                hur[i].latestBuild.result = BuildResult.Succeeded;
                data.push(new GenericBuildSearchResult(hur[i]));
            }
        }
        return new Promise<IBuildSearchResult[]>((resolve) => {
            resolve(data);
        });
    }


    _fakebuilds: any[] = [
        {
            "_links": {
                "self": {
                    "href": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/build/Definitions/16?revision=2"
                },
                "web": {
                    "href": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_build/definition?definitionId=16"
                },
                "editor": {
                    "href": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_build/designer?id=16&_a=edit-build-definition"
                },
                "badge": {
                    "href": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/build/status/16"
                }
            },
            "latestBuild": {
                "_links": {
                    "self": {
                        "href": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/build/Builds/493"
                    },
                    "web": {
                        "href": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_build/results?buildId=493"
                    },
                    "sourceVersionDisplayUri": {
                        "href": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/build/builds/493/sources"
                    },
                    "timeline": {
                        "href": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/build/builds/493/Timeline"
                    },
                    "badge": {
                        "href": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/build/status/16"
                    }
                },
                "properties": {},
                "tags": [],
                "validationResults": [],
                "plans": [
                    {
                        "planId": "3ff2ff6e-317d-459d-9483-cfbdb5f5e00e"
                    }
                ],
                "triggerInfo": {},
                "id": 493,
                "buildNumber": "493",
                "status": "completed",
                "result": "succeeded",
                "queueTime": "2020-09-07T02:00:40.1049268Z",
                "startTime": "2020-09-07T02:00:47.4947114Z",
                "finishTime": "2020-09-07T02:01:03.335128Z",
                "url": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/build/Builds/493",
                "definition": {
                    "drafts": [],
                    "id": 16,
                    "name": "Ease-CI",
                    "url": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/build/Definitions/16?revision=2",
                    "uri": "vstfs:///Build/Definition/16",
                    "path": "\\",
                    "type": "build",
                    "queueStatus": "enabled",
                    "revision": 2,
                    "project": {
                        "id": "636e1096-9319-432d-ac44-cd220ff75d41",
                        "name": "Ease",
                        "description": "Code to make work easier. Better description at a later time.",
                        "url": "https://dubsalot.visualstudio.com/_apis/projects/636e1096-9319-432d-ac44-cd220ff75d41",
                        "state": "wellFormed",
                        "revision": 134,
                        "visibility": "private",
                        "lastUpdateTime": "2020-02-16T04:15:14.413Z"
                    }
                },
                "project": {
                    "id": "636e1096-9319-432d-ac44-cd220ff75d41",
                    "name": "Ease",
                    "description": "Code to make work easier. Better description at a later time.",
                    "url": "https://dubsalot.visualstudio.com/_apis/projects/636e1096-9319-432d-ac44-cd220ff75d41",
                    "state": "wellFormed",
                    "revision": 134,
                    "visibility": "private",
                    "lastUpdateTime": "2020-02-16T04:15:14.413Z"
                },
                "uri": "vstfs:///Build/Build/493",
                "sourceBranch": "refs/heads/master",
                "sourceVersion": "961e72ce1ff1545f6e8dad6f0e638d17621c3d80",
                "queue": {
                    "id": 89,
                    "name": "Azure Pipelines",
                    "pool": {
                        "id": 11,
                        "name": "Azure Pipelines",
                        "isHosted": true
                    }
                },
                "priority": "normal",
                "reason": "manual",
                "requestedFor": {
                    "displayName": "wes.goodwin",
                    "url": "https://spsprodeus27.vssps.visualstudio.com/A2714ae97-d05a-4ba0-8765-84ad70fd4044/_apis/Identities/d04a85e4-ae1e-48e4-b097-efb311db0327",
                    "_links": {
                        "avatar": {
                            "href": "https://dubsalot.visualstudio.com/_apis/GraphProfile/MemberAvatars/msa.NDQ4MWRhZTAtY2EzZi03NDQwLTk5MjQtYWYxNjFmM2E4YmE2"
                        }
                    },
                    "id": "d04a85e4-ae1e-48e4-b097-efb311db0327",
                    "uniqueName": "wes.goodwin@gmail.com",
                    "imageUrl": "https://dubsalot.visualstudio.com/_apis/GraphProfile/MemberAvatars/msa.NDQ4MWRhZTAtY2EzZi03NDQwLTk5MjQtYWYxNjFmM2E4YmE2",
                    "descriptor": "msa.NDQ4MWRhZTAtY2EzZi03NDQwLTk5MjQtYWYxNjFmM2E4YmE2"
                },
                "requestedBy": {
                    "displayName": "wes.goodwin",
                    "url": "https://spsprodeus27.vssps.visualstudio.com/A2714ae97-d05a-4ba0-8765-84ad70fd4044/_apis/Identities/d04a85e4-ae1e-48e4-b097-efb311db0327",
                    "_links": {
                        "avatar": {
                            "href": "https://dubsalot.visualstudio.com/_apis/GraphProfile/MemberAvatars/msa.NDQ4MWRhZTAtY2EzZi03NDQwLTk5MjQtYWYxNjFmM2E4YmE2"
                        }
                    },
                    "id": "d04a85e4-ae1e-48e4-b097-efb311db0327",
                    "uniqueName": "wes.goodwin@gmail.com",
                    "imageUrl": "https://dubsalot.visualstudio.com/_apis/GraphProfile/MemberAvatars/msa.NDQ4MWRhZTAtY2EzZi03NDQwLTk5MjQtYWYxNjFmM2E4YmE2",
                    "descriptor": "msa.NDQ4MWRhZTAtY2EzZi03NDQwLTk5MjQtYWYxNjFmM2E4YmE2"
                },
                "lastChangedDate": "2020-09-07T02:01:03.75Z",
                "lastChangedBy": {
                    "displayName": "Microsoft.VisualStudio.Services.TFS",
                    "url": "https://spsprodeus27.vssps.visualstudio.com/A2714ae97-d05a-4ba0-8765-84ad70fd4044/_apis/Identities/00000002-0000-8888-8000-000000000000",
                    "_links": {
                        "avatar": {
                            "href": "https://dubsalot.visualstudio.com/_apis/GraphProfile/MemberAvatars/s2s.MDAwMDAwMDItMDAwMC04ODg4LTgwMDAtMDAwMDAwMDAwMDAwQDJjODk1OTA4LTA0ZTAtNDk1Mi04OWZkLTU0YjAwNDZkNjI4OA"
                        }
                    },
                    "id": "00000002-0000-8888-8000-000000000000",
                    "uniqueName": "00000002-0000-8888-8000-000000000000@2c895908-04e0-4952-89fd-54b0046d6288",
                    "imageUrl": "https://dubsalot.visualstudio.com/_apis/GraphProfile/MemberAvatars/s2s.MDAwMDAwMDItMDAwMC04ODg4LTgwMDAtMDAwMDAwMDAwMDAwQDJjODk1OTA4LTA0ZTAtNDk1Mi04OWZkLTU0YjAwNDZkNjI4OA",
                    "descriptor": "s2s.MDAwMDAwMDItMDAwMC04ODg4LTgwMDAtMDAwMDAwMDAwMDAwQDJjODk1OTA4LTA0ZTAtNDk1Mi04OWZkLTU0YjAwNDZkNjI4OA"
                },
                "parameters": "{\"system.debug\":\"false\"}",
                "orchestrationPlan": {
                    "planId": "3ff2ff6e-317d-459d-9483-cfbdb5f5e00e"
                },
                "logs": {
                    "id": 0,
                    "type": "Container",
                    "url": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/build/builds/493/logs"
                },
                "repository": {
                    "id": "2f4124be-ba5c-4617-a13c-c661b72c8800",
                    "type": "TfsGit",
                    "name": "powershell-modules",
                    "url": "https://dubsalot.visualstudio.com/Ease/_git/powershell-modules",
                    "clean": null,
                    "checkoutSubmodules": false
                },
                "keepForever": true,
                "retainedByRelease": false,
                "triggeredByBuild": null
            },
            "quality": 1,
            "authoredBy": {
                "displayName": "wes.goodwin",
                "url": "https://spsprodeus27.vssps.visualstudio.com/A2714ae97-d05a-4ba0-8765-84ad70fd4044/_apis/Identities/d04a85e4-ae1e-48e4-b097-efb311db0327",
                "_links": {
                    "avatar": {
                        "href": "https://dubsalot.visualstudio.com/_apis/GraphProfile/MemberAvatars/msa.NDQ4MWRhZTAtY2EzZi03NDQwLTk5MjQtYWYxNjFmM2E4YmE2"
                    }
                },
                "id": "d04a85e4-ae1e-48e4-b097-efb311db0327",
                "uniqueName": "wes.goodwin@gmail.com",
                "imageUrl": "https://dubsalot.visualstudio.com/_apis/GraphProfile/MemberAvatars/msa.NDQ4MWRhZTAtY2EzZi03NDQwLTk5MjQtYWYxNjFmM2E4YmE2",
                "descriptor": "msa.NDQ4MWRhZTAtY2EzZi03NDQwLTk5MjQtYWYxNjFmM2E4YmE2"
            },
            "drafts": [],
            "queue": {
                "_links": {
                    "self": {
                        "href": "https://dubsalot.visualstudio.com/_apis/build/Queues/89"
                    }
                },
                "id": 89,
                "name": "Azure Pipelines",
                "url": "https://dubsalot.visualstudio.com/_apis/build/Queues/89",
                "pool": {
                    "id": 11,
                    "name": "Azure Pipelines",
                    "isHosted": true
                }
            },
            "id": 16,
            "name": "Ease-CI",
            "url": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/build/Definitions/16?revision=2",
            "uri": "vstfs:///Build/Definition/16",
            "path": "\\",
            "type": 2,
            "queueStatus": 0,
            "revision": 2,
            "createdDate": "2020-03-19T03:12:42.117Z",
            "project": {
                "id": "636e1096-9319-432d-ac44-cd220ff75d41",
                "name": "Ease",
                "description": "Code to make work easier. Better description at a later time.",
                "url": "https://dubsalot.visualstudio.com/_apis/projects/636e1096-9319-432d-ac44-cd220ff75d41",
                "state": 1,
                "revision": 134,
                "visibility": 0,
                "lastUpdateTime": new Date()
            }
        },
        {
            "_links": {
                "self": {
                    "href": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/build/Definitions/20?revision=1"
                },
                "web": {
                    "href": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_build/definition?definitionId=20"
                },
                "editor": {
                    "href": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_build/designer?id=20&_a=edit-build-definition"
                },
                "badge": {
                    "href": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/build/status/20"
                }
            },
            "latestBuild": {
                "_links": {
                    "self": {
                        "href": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/build/Builds/493"
                    },
                    "web": {
                        "href": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_build/results?buildId=493"
                    },
                    "sourceVersionDisplayUri": {
                        "href": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/build/builds/493/sources"
                    },
                    "timeline": {
                        "href": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/build/builds/493/Timeline"
                    },
                    "badge": {
                        "href": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/build/status/16"
                    }
                },
                "properties": {},
                "tags": [],
                "validationResults": [],
                "plans": [
                    {
                        "planId": "3ff2ff6e-317d-459d-9483-cfbdb5f5e00e"
                    }
                ],
                "triggerInfo": {},
                "id": 493,
                "buildNumber": "493",
                "status": "completed",
                "result": "succeeded",
                "queueTime": "2020-09-07T02:00:40.1049268Z",
                "startTime": "2020-09-07T02:00:47.4947114Z",
                "finishTime": "2020-09-07T02:01:03.335128Z",
                "url": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/build/Builds/493",
                "definition": {
                    "drafts": [],
                    "id": 16,
                    "name": "Ease-CI",
                    "url": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/build/Definitions/16?revision=2",
                    "uri": "vstfs:///Build/Definition/16",
                    "path": "\\",
                    "type": "build",
                    "queueStatus": "enabled",
                    "revision": 2,
                    "project": {
                        "id": "636e1096-9319-432d-ac44-cd220ff75d41",
                        "name": "Ease",
                        "description": "Code to make work easier. Better description at a later time.",
                        "url": "https://dubsalot.visualstudio.com/_apis/projects/636e1096-9319-432d-ac44-cd220ff75d41",
                        "state": "wellFormed",
                        "revision": 134,
                        "visibility": "private",
                        "lastUpdateTime": "2020-02-16T04:15:14.413Z"
                    }
                },
                "project": {
                    "id": "636e1096-9319-432d-ac44-cd220ff75d41",
                    "name": "Ease",
                    "description": "Code to make work easier. Better description at a later time.",
                    "url": "https://dubsalot.visualstudio.com/_apis/projects/636e1096-9319-432d-ac44-cd220ff75d41",
                    "state": "wellFormed",
                    "revision": 134,
                    "visibility": "private",
                    "lastUpdateTime": "2020-02-16T04:15:14.413Z"
                },
                "uri": "vstfs:///Build/Build/493",
                "sourceBranch": "refs/heads/master",
                "sourceVersion": "961e72ce1ff1545f6e8dad6f0e638d17621c3d80",
                "queue": {
                    "id": 89,
                    "name": "Azure Pipelines",
                    "pool": {
                        "id": 11,
                        "name": "Azure Pipelines",
                        "isHosted": true
                    }
                },
                "priority": "normal",
                "reason": "manual",
                "requestedFor": {
                    "displayName": "wes.goodwin",
                    "url": "https://spsprodeus27.vssps.visualstudio.com/A2714ae97-d05a-4ba0-8765-84ad70fd4044/_apis/Identities/d04a85e4-ae1e-48e4-b097-efb311db0327",
                    "_links": {
                        "avatar": {
                            "href": "https://dubsalot.visualstudio.com/_apis/GraphProfile/MemberAvatars/msa.NDQ4MWRhZTAtY2EzZi03NDQwLTk5MjQtYWYxNjFmM2E4YmE2"
                        }
                    },
                    "id": "d04a85e4-ae1e-48e4-b097-efb311db0327",
                    "uniqueName": "wes.goodwin@gmail.com",
                    "imageUrl": "https://dubsalot.visualstudio.com/_apis/GraphProfile/MemberAvatars/msa.NDQ4MWRhZTAtY2EzZi03NDQwLTk5MjQtYWYxNjFmM2E4YmE2",
                    "descriptor": "msa.NDQ4MWRhZTAtY2EzZi03NDQwLTk5MjQtYWYxNjFmM2E4YmE2"
                },
                "requestedBy": {
                    "displayName": "wes.goodwin",
                    "url": "https://spsprodeus27.vssps.visualstudio.com/A2714ae97-d05a-4ba0-8765-84ad70fd4044/_apis/Identities/d04a85e4-ae1e-48e4-b097-efb311db0327",
                    "_links": {
                        "avatar": {
                            "href": "https://dubsalot.visualstudio.com/_apis/GraphProfile/MemberAvatars/msa.NDQ4MWRhZTAtY2EzZi03NDQwLTk5MjQtYWYxNjFmM2E4YmE2"
                        }
                    },
                    "id": "d04a85e4-ae1e-48e4-b097-efb311db0327",
                    "uniqueName": "wes.goodwin@gmail.com",
                    "imageUrl": "https://dubsalot.visualstudio.com/_apis/GraphProfile/MemberAvatars/msa.NDQ4MWRhZTAtY2EzZi03NDQwLTk5MjQtYWYxNjFmM2E4YmE2",
                    "descriptor": "msa.NDQ4MWRhZTAtY2EzZi03NDQwLTk5MjQtYWYxNjFmM2E4YmE2"
                },
                "lastChangedDate": "2020-09-07T02:01:03.75Z",
                "lastChangedBy": {
                    "displayName": "Microsoft.VisualStudio.Services.TFS",
                    "url": "https://spsprodeus27.vssps.visualstudio.com/A2714ae97-d05a-4ba0-8765-84ad70fd4044/_apis/Identities/00000002-0000-8888-8000-000000000000",
                    "_links": {
                        "avatar": {
                            "href": "https://dubsalot.visualstudio.com/_apis/GraphProfile/MemberAvatars/s2s.MDAwMDAwMDItMDAwMC04ODg4LTgwMDAtMDAwMDAwMDAwMDAwQDJjODk1OTA4LTA0ZTAtNDk1Mi04OWZkLTU0YjAwNDZkNjI4OA"
                        }
                    },
                    "id": "00000002-0000-8888-8000-000000000000",
                    "uniqueName": "00000002-0000-8888-8000-000000000000@2c895908-04e0-4952-89fd-54b0046d6288",
                    "imageUrl": "https://dubsalot.visualstudio.com/_apis/GraphProfile/MemberAvatars/s2s.MDAwMDAwMDItMDAwMC04ODg4LTgwMDAtMDAwMDAwMDAwMDAwQDJjODk1OTA4LTA0ZTAtNDk1Mi04OWZkLTU0YjAwNDZkNjI4OA",
                    "descriptor": "s2s.MDAwMDAwMDItMDAwMC04ODg4LTgwMDAtMDAwMDAwMDAwMDAwQDJjODk1OTA4LTA0ZTAtNDk1Mi04OWZkLTU0YjAwNDZkNjI4OA"
                },
                "parameters": "{\"system.debug\":\"false\"}",
                "orchestrationPlan": {
                    "planId": "3ff2ff6e-317d-459d-9483-cfbdb5f5e00e"
                },
                "logs": {
                    "id": 0,
                    "type": "Container",
                    "url": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/build/builds/493/logs"
                },
                "repository": {
                    "id": "2f4124be-ba5c-4617-a13c-c661b72c8800",
                    "type": "TfsGit",
                    "name": "powershell-modules",
                    "url": "https://dubsalot.visualstudio.com/Ease/_git/powershell-modules",
                    "clean": null,
                    "checkoutSubmodules": false
                },
                "keepForever": true,
                "retainedByRelease": false,
                "triggeredByBuild": null
            },
            "quality": 1,
            "authoredBy": {
                "displayName": "wes.goodwin",
                "url": "https://spsprodeus27.vssps.visualstudio.com/A2714ae97-d05a-4ba0-8765-84ad70fd4044/_apis/Identities/d04a85e4-ae1e-48e4-b097-efb311db0327",
                "_links": {
                    "avatar": {
                        "href": "https://dubsalot.visualstudio.com/_apis/GraphProfile/MemberAvatars/msa.NDQ4MWRhZTAtY2EzZi03NDQwLTk5MjQtYWYxNjFmM2E4YmE2"
                    }
                },
                "id": "d04a85e4-ae1e-48e4-b097-efb311db0327",
                "uniqueName": "wes.goodwin@gmail.com",
                "imageUrl": "https://dubsalot.visualstudio.com/_apis/GraphProfile/MemberAvatars/msa.NDQ4MWRhZTAtY2EzZi03NDQwLTk5MjQtYWYxNjFmM2E4YmE2",
                "descriptor": "msa.NDQ4MWRhZTAtY2EzZi03NDQwLTk5MjQtYWYxNjFmM2E4YmE2"
            },
            "drafts": [],
            "queue": {
                "_links": {
                    "self": {
                        "href": "https://dubsalot.visualstudio.com/_apis/build/Queues/85"
                    }
                },
                "id": 85,
                "name": "Hosted Ubuntu 1604",
                "url": "https://dubsalot.visualstudio.com/_apis/build/Queues/85",
                "pool": {
                    "id": 7,
                    "name": "Hosted Ubuntu 1604",
                    "isHosted": true
                }
            },
            "id": 20,
            "name": "powershell-modules",
            "url": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/build/Definitions/20?revision=1",
            "uri": "vstfs:///Build/Definition/20",
            "path": "\\",
            "type": 2,
            "queueStatus": 0,
            "revision": 1,
            "createdDate": "2020-08-29T03:57:52.457Z",
            "project": {
                "id": "636e1096-9319-432d-ac44-cd220ff75d41",
                "name": "Ease",
                "description": "Code to make work easier. Better description at a later time.",
                "url": "https://dubsalot.visualstudio.com/_apis/projects/636e1096-9319-432d-ac44-cd220ff75d41",
                "state": 1,
                "revision": 134,
                "visibility": 0,
                "lastUpdateTime": new Date()
            }
            }
    ];
}


export class FakeRepoService extends FakeService implements IRepoService {
    constructor() {
        super()
    }
    getRepoType(): string {
        return 'FakeGit';
    }

    async searchForRepos(text: string): Promise<IRepoSearchResult[]> {
        let hur: GitRepository[] = this._fakerepos;
        let data = new Array<AzdoRepo>();

        for (let i = 0; i < hur.length; i++) {
            let r = hur[i];
            if (text == null || text.length <= 0 || r.name.toLocaleLowerCase().indexOf(text.toLocaleLowerCase()) >= 0) {
                data.push(new AzdoRepo(hur[i]));
            }
        }
        return new Promise<IRepoSearchResult[]>((resolve) => {
            data.sort((a, b) => a.repo.name.toLowerCase() == b.repo.name.toLowerCase() ? 0 : (a.repo.name.toLowerCase() < b.repo.name.toLowerCase() ? -1 : 1))
            resolve(data);
        });
    }

    _fakerepos: any[] = [
        {
            "id": "2b15dc30-29ae-4fe7-bc80-01e59049caf3",
            "name": "examples",
            "url": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/git/repositories/2b15dc30-29ae-4fe7-bc80-01e59049caf3",
            "project": {
                "id": "636e1096-9319-432d-ac44-cd220ff75d41",
                "name": "Ease",
                "description": "Code to make work easier. Better description at a later time.",
                "url": "https://dubsalot.visualstudio.com/_apis/projects/636e1096-9319-432d-ac44-cd220ff75d41",
                "state": 1,
                "revision": 134,
                "visibility": 0,
                "lastUpdateTime": "2020-02-16T04:15:14.413Z"
            },
            "defaultBranch": "refs/heads/master",
            "size": 178069,
            "remoteUrl": "https://dubsalot.visualstudio.com/Ease/_git/examples",
            "sshUrl": "dubsalot@vs-ssh.visualstudio.com:v3/dubsalot/Ease/examples",
            "webUrl": "https://dubsalot.visualstudio.com/Ease/_git/examples"
        },
        {
            "id": "67094c35-dce2-444d-ab12-35b18a2b962c",
            "name": "docker-wrapper",
            "url": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/git/repositories/67094c35-dce2-444d-ab12-35b18a2b962c",
            "project": {
                "id": "636e1096-9319-432d-ac44-cd220ff75d41",
                "name": "Ease",
                "description": "Code to make work easier. Better description at a later time.",
                "url": "https://dubsalot.visualstudio.com/_apis/projects/636e1096-9319-432d-ac44-cd220ff75d41",
                "state": 1,
                "revision": 134,
                "visibility": 0,
                "lastUpdateTime": "2020-02-16T04:15:14.413Z"
            },
            "defaultBranch": "refs/heads/master",
            "size": 22695,
            "remoteUrl": "https://dubsalot.visualstudio.com/Ease/_git/docker-wrapper",
            "sshUrl": "dubsalot@vs-ssh.visualstudio.com:v3/dubsalot/Ease/docker-wrapper",
            "webUrl": "https://dubsalot.visualstudio.com/Ease/_git/docker-wrapper"
        },
        {
            "id": "aa7c03a8-17d1-4881-b630-4dafebc5f3ce",
            "name": "performance-api",
            "url": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/git/repositories/aa7c03a8-17d1-4881-b630-4dafebc5f3ce",
            "project": {
                "id": "636e1096-9319-432d-ac44-cd220ff75d41",
                "name": "Ease",
                "description": "Code to make work easier. Better description at a later time.",
                "url": "https://dubsalot.visualstudio.com/_apis/projects/636e1096-9319-432d-ac44-cd220ff75d41",
                "state": 1,
                "revision": 134,
                "visibility": 0,
                "lastUpdateTime": "2020-02-16T04:15:14.413Z"
            },
            "defaultBranch": "refs/heads/master",
            "size": 8072,
            "remoteUrl": "https://dubsalot.visualstudio.com/Ease/_git/performance-api",
            "sshUrl": "dubsalot@vs-ssh.visualstudio.com:v3/dubsalot/Ease/performance-api",
            "webUrl": "https://dubsalot.visualstudio.com/Ease/_git/performance-api"
        },
        {
            "id": "11f98386-d6bd-4aee-b2bc-9c7777de3f48",
            "name": "Ease",
            "url": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/git/repositories/11f98386-d6bd-4aee-b2bc-9c7777de3f48",
            "project": {
                "id": "636e1096-9319-432d-ac44-cd220ff75d41",
                "name": "Ease",
                "description": "Code to make work easier. Better description at a later time.",
                "url": "https://dubsalot.visualstudio.com/_apis/projects/636e1096-9319-432d-ac44-cd220ff75d41",
                "state": 1,
                "revision": 134,
                "visibility": 0,
                "lastUpdateTime": "2020-02-16T04:15:14.413Z"
            },
            "defaultBranch": "refs/heads/master",
            "size": 7823,
            "remoteUrl": "https://dubsalot.visualstudio.com/Ease/_git/Ease",
            "sshUrl": "dubsalot@vs-ssh.visualstudio.com:v3/dubsalot/Ease/Ease",
            "webUrl": "https://dubsalot.visualstudio.com/Ease/_git/Ease"
        },
        {
            "id": "2f4124be-ba5c-4617-a13c-c661b72c8800",
            "name": "powershell-modules",
            "url": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/git/repositories/2f4124be-ba5c-4617-a13c-c661b72c8800",
            "project": {
                "id": "636e1096-9319-432d-ac44-cd220ff75d41",
                "name": "Ease",
                "description": "Code to make work easier. Better description at a later time.",
                "url": "https://dubsalot.visualstudio.com/_apis/projects/636e1096-9319-432d-ac44-cd220ff75d41",
                "state": 1,
                "revision": 134,
                "visibility": 0,
                "lastUpdateTime": "2020-02-16T04:15:14.413Z"
            },
            "defaultBranch": "refs/heads/master",
            "size": 8239,
            "remoteUrl": "https://dubsalot.visualstudio.com/Ease/_git/powershell-modules",
            "sshUrl": "dubsalot@vs-ssh.visualstudio.com:v3/dubsalot/Ease/powershell-modules",
            "webUrl": "https://dubsalot.visualstudio.com/Ease/_git/powershell-modules"
        },
        {
            "id": "fab3d718-173f-47a4-9455-e87859dbf368",
            "name": "adoextensions",
            "url": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/git/repositories/fab3d718-173f-47a4-9455-e87859dbf368",
            "project": {
                "id": "636e1096-9319-432d-ac44-cd220ff75d41",
                "name": "Ease",
                "description": "Code to make work easier. Better description at a later time.",
                "url": "https://dubsalot.visualstudio.com/_apis/projects/636e1096-9319-432d-ac44-cd220ff75d41",
                "state": 1,
                "revision": 134,
                "visibility": 0,
                "lastUpdateTime": "2020-02-16T04:15:14.413Z"
            },
            "defaultBranch": "refs/heads/master",
            "size": 207789,
            "remoteUrl": "https://dubsalot.visualstudio.com/Ease/_git/adoextensions",
            "sshUrl": "dubsalot@vs-ssh.visualstudio.com:v3/dubsalot/Ease/adoextensions",
            "webUrl": "https://dubsalot.visualstudio.com/Ease/_git/adoextensions"
        },
        {
            "id": "86d2528f-0b55-43b2-9593-e9f2578e2857",
            "name": "pipelions",
            "url": "https://dubsalot.visualstudio.com/636e1096-9319-432d-ac44-cd220ff75d41/_apis/git/repositories/86d2528f-0b55-43b2-9593-e9f2578e2857",
            "project": {
                "id": "636e1096-9319-432d-ac44-cd220ff75d41",
                "name": "Ease",
                "description": "Code to make work easier. Better description at a later time.",
                "url": "https://dubsalot.visualstudio.com/_apis/projects/636e1096-9319-432d-ac44-cd220ff75d41",
                "state": 1,
                "revision": 134,
                "visibility": 0,
                "lastUpdateTime": "2020-02-16T04:15:14.413Z"
            },
            "defaultBranch": "refs/heads/master",
            "size": 137998,
            "remoteUrl": "https://dubsalot.visualstudio.com/Ease/_git/pipelions",
            "sshUrl": "dubsalot@vs-ssh.visualstudio.com:v3/dubsalot/Ease/pipelions",
            "webUrl": "https://dubsalot.visualstudio.com/Ease/_git/pipelions"
        }
    ];
}

export class FakeReleaseService extends FakeService implements IReleaseService {
    async getLatestReleaseForDefinition(id: number): Promise<LatestRelease> {
        let result = new LatestRelease().init(`Release ${id}`, -1, "#");

        result.environments = await this.getStagesForRelease(id);

        return new Promise<LatestRelease>((resolve) => {
            resolve(result);
        });
    }

    async getStagesForRelease(id: number): Promise<ReleaseStage[]> {
        let numEnvironments = Math.floor(Math.random() * 6) + 1;
        let pause = Math.floor(Math.random() * 4) + 1;

        let envs = new Array<ReleaseStage>();
        for (let i = 0; i < numEnvironments; i++) {
            let renv: ReleaseStage = new ReleaseStage();
            renv.status = Math.floor(Math.random() * 4) + 1;   //status between 1 and 4
            renv.name = "Stage " + i.toString();
            envs.push(renv);
        }
        return new Promise<ReleaseStage[]>((resolve) => {
            setTimeout(resolve, pause * 1000, envs);
        });
    }

    async searchForReleases(text: string): Promise<IReleaseResult[]> {

        let ar: number[] = [0, 1, 2, 3, 4, 5];
        let data: IReleaseResult[] = new Array<IReleaseResult>();
        ar.forEach(n => {
            data.push({
                name: `Release ${n}`,
                id: n,
                projectId: 'fake project',
                url: "http://www.google.com"
            });
        });

        return new Promise<IReleaseResult[]>((resolve) => {
            resolve(data);
        });
    }
}
