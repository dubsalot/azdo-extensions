import * as React from "react";
import * as shimmy from "@locatorpath";
import { IAzDOSDK, IRepoService, IRepoSearchResult, IBuildService, IBuildSearchResult } from "@serviceinterfaces";
import { IconSize, Icon } from "azure-devops-ui/Icon";
import "./Styles.scss"

//const simpleObservable = new ObservableValue<string>("");

export interface ISummaryProps
{
    initializedWithRepo: boolean;
    repoModel: IRepoSearchResult;
}

export interface ISummaryState
{
    buildDefinitions: IBuildSearchResult[];
}

export class PipelineSummary extends React.Component<ISummaryProps, ISummaryState> {

    sdk!: IAzDOSDK;
    buildService!: IBuildService;
    mounted: boolean = false;
    repoService!: IRepoService;

    constructor(props: ISummaryProps, state: ISummaryState) {
        super(props);
        this.initializeState();
    }

    public componentDidMount() {
        this.mounted = true;
        
        this.sdk = shimmy.serviceContext.getSDK();
        this.buildService = this.context.buildService as IBuildService;
        this.repoService = this.context.repoService as IRepoService;
        this.loadBuilds();
    }

    async loadBuilds() {
        let repoType = this.repoService.getRepoType();
        this.buildService.searchForBuildsByRepoId(this.props.repoModel.repo.id, repoType).then((builditems) => {
            if (this.mounted) {
                this.setState({ buildDefinitions: builditems })
            }
        });        
    }

    getRepoPolicyLink(repo: IRepoSearchResult): string {
        if(repo != null && this.sdk != null)
        {
            return `/${this.sdk.project.name}/_settings/repositories?repo=${repo.repo.id}&_a=policiesMid`;
        }
        return '#';
    }

    componentWillUnmount() {
        this.mounted = false;
    }       

    private initializeState(): void {
        this.state = {
            buildDefinitions: new Array<IBuildSearchResult>()
        };
    }

    
    public render(): JSX.Element {
        return (
        <div className="flex-grid bolt-list-row">
            <div className="col repos">
                <div className="flexPanel">
                    <div className="flexContent">
                        <div className="pipelineSummaryStatus">
                            <Icon ariaLabel="git logo icon" iconName="GitLogo" size={IconSize.medium} />                         
                        </div>
                        <div className="pipelineSummaryInfo">
                            <span className="repoName">{this.props.repoModel.repo.name}</span>
                            <br />
                            <span className="branchinfo"><span aria-hidden="true" className="pipelines-icon-right-margin flex-noshrink fabric-icon ms-Icon--OpenSource"></span>default: {this.props.repoModel.getDefaultBranch()}</span>
                                                    
                        </div>
                    </div>
                    <div className="flexButtons">
                        <a className="bolt-link" href={this.props.repoModel.repo.webUrl}>files</a>
                        <a className="bolt-link" href={this.props.repoModel.getCommitsLink()}>history</a>
                        <a className="bolt-link" href={this.props.repoModel.getBranchesLink()}>branches</a>
                        <a className="bolt-link" href={this.props.repoModel.getPullRequestsLink()}>pull requests</a>
                        <a className="bolt-link" href={this.getRepoPolicyLink(this.props.repoModel)}>policies</a>
                    </div>
                </div>
            </div>
            <div className="col builds">
                <div className="flexPanel">
                    <div className="flexContent">
                    {
                        this.state.buildDefinitions.map((build: IBuildSearchResult) => (
                            <div className="buildSummary">
                                <div className="buildSummaryInfo"> <a className="bolt-link" href="#">{build.buildRef.name} {build.buildRef.id} </a></div>
                            </div>
                        ))
                    }                            
                    </div>
                </div>
            </div>

        </div>
        );
    }
}

PipelineSummary.contextType = shimmy.dependencyContext;