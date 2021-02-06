import React = require("react");
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { Toggle } from "azure-devops-ui/Toggle";
import * as shimmy from "@locatorpath";
import { IRepoSearchResult, IRepoService } from "@serviceinterfaces";
import RepoPanel from "@components/RepoList/RepoPanel";
import { equal, strictEqual } from "assert";
import "./Repos.scss"

interface RepoSearchProps {
    searchText: string;
}


interface RepoSearchState {
    loading: boolean
    repos: Array<IRepoSearchResult>;
}

const loadingToggle = new ObservableValue<boolean>(false);


export default class RepoList extends React.Component<RepoSearchProps, RepoSearchState> {
    repoService!: IRepoService;
    mounted: boolean = false;

    constructor(props: RepoSearchProps) {
        super(props);
        this.state =
        {
            loading: false,
            repos: new Array<IRepoSearchResult>()
        };
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    componentDidUpdate(prevProps:RepoSearchProps) {
        if(!(this.props.searchText == prevProps.searchText)) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
        {
            this.repoService = this.context.repoService as IRepoService;
            this.searchRepos();
        }
    } 

    searchRepos() {
        this.setState({
            loading: true
        });

        console.log(`searchForRepos(calling \"${this.props.searchText}\")  `)
        this.repoService.searchForRepos(this.props.searchText).then((repos: IRepoSearchResult[]) => {
            if (this.mounted) {
                this.setState({ repos: repos, loading: false }, () => {
                });
            }
        })
    }

    toggleLoading() {
        this.setState(prevState => {
            loadingToggle.value = !prevState.loading;
            return {
                ...prevState,
                loading: !prevState.loading
            }
        });
    }

    public render(): JSX.Element {
        return (
            <div className="flex-column">
                {/* <Toggle
                    offText={"Turn on loading"}
                    onText={"Turn off loading"}
                    checked={loadingToggle}
                    onChange={(event, value) => this.toggleLoading()}
                /> */}
                <div className="azdoListContainer">
                    <h3 className="listHeader">Repositories</h3>
                </div>
                <div className="azdoList">
                    {
                        this.state.repos.map(item => (<RepoPanel key={item.repo.name} model={item} loading={this.state.loading} />))
                    }
                </div>
            </div>
        );
    }
}

RepoList.contextType = shimmy.dependencyContext;