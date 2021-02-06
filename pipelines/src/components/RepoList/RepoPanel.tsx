import React = require("react");
import { IRepoSearchResult } from "@serviceinterfaces";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { IconSize } from "azure-devops-ui/Icon";
import { Link } from "azure-devops-ui/Link";
import * as shimmy from "@locatorpath";
import "./Repos.scss"
import { CommonServiceIds, IHostNavigationService } from "azure-devops-extension-api";
import * as common from "../../Common"
import { Button } from "azure-devops-ui/Button";



export default class RepoPanel extends React.Component<{ model: IRepoSearchResult, loading: boolean }, {}> {
    constructor(props: { model: IRepoSearchResult, loading: boolean }) {
        super(props);
    }


    // nav = async (url:string, ctrlKey: boolean) => {
    //     let navService = await shimmy.serviceContext.sdk.getService<IHostNavigationService>(CommonServiceIds.HostNavigationService);

    //     if(navService)
    //     {
    //         if(ctrlKey)
    //         {
    //             navService.openNewWindow(url, "");
    //         }            
    //         else{
    //             navService.navigate(url);
    //         }
    //     }
    //     else{
    //         if(ctrlKey)
    //         {
    //             window.open(url);
    //         }            
    //         else{
    //             window.location.href = url;
    //         }            
    //     }
    // }

    public render(): JSX.Element {


        return (
            <div className={"azdoPanel " + (this.props.loading == true ? "loading" : "loaded")}>
                <div className="pncontainer">
                    <div>
                        <Button
                                text="Open"
                                iconProps={{ iconName: "GitLogo" }}
                                onClick={(e)=>{ common.nav(this.props.model.repo.webUrl, e.ctrlKey);}}
                            />
                        <span className="nameheader">
                        {
                            this.props.model.repo.name
                        }
                        </span>
                    </div>
                    <div className="pnLinks">
                        <div>
                            <Link onClick={(e)=>{ common.nav(this.props.model.getCommitsLink(), e.ctrlKey);}}>History</Link>
                        </div>
                        <div>
                            <Link onClick={(e)=>{ common.nav(this.props.model.getBranchesLink(), e.ctrlKey);}}>Branches</Link>
                        </div>
                        <div>
                            <Link onClick={(e)=>{ common.nav(this.props.model.getPullRequestsLink(), e.ctrlKey);}}>Pull Requests</Link>
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}