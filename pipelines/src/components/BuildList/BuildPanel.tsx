import React = require("react");
import { AzdoBuild, IBuildSearchResult } from "@serviceinterfaces";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { IconSize } from "azure-devops-ui/Icon";
import { Link } from "azure-devops-ui/Link";
import { IStatusProps, Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import * as shimmy from "@locatorpath";
import { BuildResult, BuildStatus } from "azure-devops-extension-api/Build";
import "./Builds.scss"
import { Button } from "azure-devops-ui/Button";
import * as common from "../../Common"

export class BuildPanelState {
    constructor() {
        this.builds = new Array<AzdoBuild>();
    }
    builds: AzdoBuild[] = new Array<AzdoBuild>();
}

export default class BuildPanel extends React.Component<{ model: IBuildSearchResult, loading: boolean }, BuildPanelState> {
    mounted: boolean = false;
    constructor(props: { model: IBuildSearchResult, loading: boolean }) {
        super(props);
        this.state = new BuildPanelState();
        //sd
    }

    componentWillUnmount() {
        this.mounted = false;
     }

    componentDidMount() {

        if (!this.mounted) {

            this.mounted = true;
            console.log(`******************************** Build Panel Mounted  ${this.props.model.buildRef.name} ********************************`);

            shimmy.serviceContext.buildService.getLatestBuildInfo(this.props.model.buildRef.id).then((data)=>{
                console.debug(data, `data returned from getStagesForRelease`)
                if(this.mounted)
                {
                    this.setState(prevState => {
                        return {
                            ...prevState,
                            builds: data
                        }
                    });                
                }
            });
        }
    }

    getComponentClass(build: AzdoBuild, showText:boolean) : string { 
        let color: string;
        switch(build.result)
        {
            case BuildResult.Failed:
                color = "red";
                break;
            case BuildResult.Canceled:
                color = "pink";
                break;
            case BuildResult.PartiallySucceeded:
                color = "organge";
                break;
            case BuildResult.None:
                color = "white";
                break;
            case BuildResult.Succeeded:
                color = "green";
                break;
            default:
                color = "white";
        }
        let withtext: string = showText ? "withtext" : "";
        let cssclass:string = `pipelinestatus clickable ${color} ${withtext}`;

        return cssclass;
    }
    
    bpKey(b: AzdoBuild): string { 
        return "build_panel_" + b.buildNumber; 
    }

    cleanBranchName(b: string) : string { 
        if(b.startsWith("refs/heads/"))
        {
            return b.substring(11);
        }
        return b;
    }

    public render(): JSX.Element {

        return (
            <div className={"azdoPanel " + (this.props.loading == true ? "loading" : "loaded")}>
                <div className="pncontainer">
                    <div>
                        <Button
                                text="Open"
                                iconProps={{ iconName: "Build" }}
                                onClick={(e)=>{ common.nav(this.props.model.getWebUrl()!, e.ctrlKey);}}
                            />
                        <span className="nameheader">
                        {
                            this.props.model.buildRef.name
                        }
                        </span>
                    </div>
                    <div className="buildStages">
                    {
                        this.state.builds.map((b, index)=>{
                            //let stat = this.getComponentStatus(b.result);
                            let buildName;
                            let showText: boolean = (index == this.state.builds.length - 1);
                            if(showText == true)
                            {
                                buildName = <span>{b.buildNumber}</span>
                            }
                            return (
                                <div onClick={(e)=>{ common.nav(b.Url, e.ctrlKey);}} className={this.getComponentClass(b, showText == true)} title={b.buildNumber + " - " + this.cleanBranchName(b.sourceBranch)}>
                                    {buildName}
                                </div>)                                    
                            })
                    }
                    </div>
                </div>
            </div>            
        );
    }
}