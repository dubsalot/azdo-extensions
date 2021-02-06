import * as React from "react";
import { TextField, TextFieldWidth } from "azure-devops-ui/TextField";
import * as shimmy from "@locatorpath";
import { IAzDOSDK, IRepoService, IRepoSearchResult } from "@serviceinterfaces";
import { PipelineSummary } from "./PipelineSummary";
import "./Styles.scss"

interface SearchState {
    searchText: string;
    loading: boolean;
    repos: Array<IRepoSearchResult>;
}


export class PipelineList extends React.Component<{}, SearchState> {
    sdk!: IAzDOSDK;
    repoService!: IRepoService;
    mounted: boolean = false;

    constructor(props: {}) {
        super(props);
        this.state = {
            loading: false,
            searchText: "",
            repos: new Array<IRepoSearchResult>()
        }
    }

    public componentDidMount() {
        this.initializeState().then(()=>{
        });
        this.mounted = true;
        this.repoService = this.context.repoService as IRepoService;
        this.searchRepos();
    }


    componentWillUnmount() {
        this.mounted = false;
    }    

    private async initializeState(): Promise<void> {
        this.setState({
            loading: false,
            searchText: "",
            repos: new Array<IRepoSearchResult>()
        });
    }

    private onTextValueChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value: string): void => {
        this.setState({ searchText: value });
    }


    componentDidUpdate(prevProps: { }, prevState: SearchState) {
        if(!(this.state.searchText == prevState.searchText)) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
        {
            this.repoService = this.context.repoService as IRepoService;
            this.searchRepos();
        }
    } 


    searchRepos() {
        this.setState({
            loading: true
        });

        console.log(`searchForRepos(calling \"${this.state.searchText}\")  `)
        this.repoService.searchForRepos(this.state.searchText).then((repos: IRepoSearchResult[]) => {
            if (this.mounted) {
                this.setState({ repos: repos, loading: false }, () => {
                    console.debug("setState() called in searchRepos()");
                });
            }
        });
    }

    public render(): JSX.Element {
        return (
            <div className="page-content page-content-top rhythm-vertical-16 pipelinesummary">
                <TextField
                        className="pipelineSearchText"
                        value={this.state.searchText}
                        onChange={this.onTextValueChanged}
                        placeholder="Enter search text..."
                        width={TextFieldWidth.standard} />                      
                <div className="depth-4">
                    <div className="">
                    {
                        this.state.repos.map((repo: IRepoSearchResult) => (
                            <PipelineSummary initializedWithRepo={true} repoModel={repo} />
                        ))
                    }
                    </div>
                </div>
            </div>
        );
    }
}

PipelineList.contextType = shimmy.dependencyContext;