import React = require("react");
import { IReleaseResult, LatestRelease, ReleaseStage } from "@serviceinterfaces";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { IconSize } from "azure-devops-ui/Icon";
import * as shimmy from "@locatorpath";
import "./Releases.scss";
import { IStatusProps, Status, Statuses, StatusSize, StatusType } from "azure-devops-ui/Status";
import { EnvironmentStatus } from "azure-devops-extension-api/Release";
import * as common from "../../Common"
import { Button } from "azure-devops-ui/Button";
import { Link } from "azure-devops-ui/Link";




export class ReleasePanelState {
    constructor() {
        this.environments = new Array<ReleaseStage>();
    }
    environments: ReleaseStage[] = new Array<ReleaseStage>();
    latestRelease: LatestRelease = new LatestRelease();
}

export default class ReleasePanel extends React.Component<{ model: IReleaseResult, loading: boolean }, ReleasePanelState> {
    mounted: boolean = false;
    constructor(props: { model: IReleaseResult, loading: boolean }) {
        super(props);
        this.state = new ReleasePanelState();
    }

    componentWillUnmount() {
        this.mounted = false;
     }

    componentDidMount() {

        if (!this.mounted) {

            this.mounted = true;
            console.log(`******************************** Release Panel Mounted  ${this.props.model.name} ********************************`);

            shimmy.serviceContext.releaseService.getLatestReleaseForDefinition(this.props.model.id).then((data)=>{
                console.debug(data, `data returned from getLatestReleaseForDefinition`);
                this.mounted && this.setState(prevState => {
                    return {
                        ...prevState,
                        environments: data.environments,
                        latestRelease: data
                    }
                });                
            });
        }
    }

    componentDidUpdate(prevProps: {}, prevState: ReleasePanelState) {
        if (!(this.state.environments.length == prevState.environments.length)) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
        {
        }
    }

    getComponentClass(releaseStage: ReleaseStage, showText:boolean) : string { 
        let color: string;
        console.log(releaseStage, "RELEASE STAGE " + releaseStage.status.toLocaleString())
        switch(releaseStage.status)
        {
            case EnvironmentStatus.Rejected:
                color = "red";
                break;
            case EnvironmentStatus.Scheduled:
            case EnvironmentStatus.Queued:
            case EnvironmentStatus.InProgress:
                color = "blue";
                break;
            case EnvironmentStatus.Canceled:
                color = "pink";
                break;
            case EnvironmentStatus.PartiallySucceeded:
                color = "organge";
                break;
            case EnvironmentStatus.NotStarted:
                color = "white";
                break;
            case EnvironmentStatus.Succeeded:
                color = "green";
                break;
            default:
                color = "white";
        }
        let withtext: string = showText ? "withtext" : "";
        let cssclass:string = `pipelinestatus clickable ${color} ${withtext}`;
        return cssclass;
    }

    getComponentStatusText(releaseStage: ReleaseStage) : string { 
        let statusText =  EnvironmentStatus[releaseStage.status];
        switch(releaseStage.status)
        {
            case EnvironmentStatus.InProgress:
                return "In Progress";
            case EnvironmentStatus.PartiallySucceeded:
                return "Partially Succeeded";
            case EnvironmentStatus.NotStarted:
                return "Not Started"
            default:
                return statusText == undefined ? "Unknown Status" : statusText;
        }
    }

    rpKey(r: ReleaseStage): string { 
        return "release_panel_" + r.name; 
    }

    public render(): JSX.Element {
        //export declare type StatusType = "Success" | "Failed" | "Warning" | "Information" | "Running" | "Waiting" | "Queued" | "Canceled" | "Skipped";
        return (
            <div className={"azdoPanel " + (this.props.loading == true ? "loading" : "loaded")}>
                <div className="pncontainer">
                    <div>
                        <Button
                                text="Open"
                                iconProps={{ iconName: "Rocket" }}
                                onClick={(e)=>{ common.nav(this.props.model.url, e.ctrlKey);}}
                            />
                        <span className="nameheader">
                        {
                            this.props.model.name
                        }
                        </span>
                    </div>                        
                    <div className="releaseEnvs">
                        <a onClick={(e)=>{ e.preventDefault(); common.nav(this.state.latestRelease.url, e.ctrlKey);}} className="bolt-link subtle" href={this.state.latestRelease.url}>{this.state.latestRelease.name}</a>                        
                        {
                            this.state.environments.map((item, index) => {
                            //let stat = this.getComponentStatus(b.result);
                                let releaseName;
                                let showText = (index == this.state.environments.length - 1);
                                if(showText == true)
                                {
                                    releaseName = <span>{item.name}</span>
                                }
                                return (
                                    <div onClick={(e)=>{ common.nav(item.Url, e.ctrlKey);}} className={this.getComponentClass(item, showText == true)} title={item.name + " " + this.getComponentStatusText(item)}>
                                        {releaseName}
                                    </div>)                                
                                })
                        }
                    </div>
                </div>
            </div>
        );
    }
}