import React = require("react");
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { Toggle } from "azure-devops-ui/Toggle";
import { IBuildSearchResult, IBuildService } from "@serviceinterfaces";
import BuildPanel from "@components/BuildList/BuildPanel"
import * as shimmy from "@locatorpath";
import "./Builds.scss";

interface BuildSearchProps {
    searchText: string;
}


interface BuildSearchState {
    loading: boolean
    builds: Array<IBuildSearchResult>;
}

const loadingToggle = new ObservableValue<boolean>(false);


export default class BuildList extends React.Component<BuildSearchProps, BuildSearchState> {
    buildService!: IBuildService;
    mounted: boolean = false;

    constructor(props: BuildSearchProps) {
        super(props);
        this.state =
        {
            loading: false,
            builds: new Array<IBuildSearchResult>(),
        };
    }

    componentDidMount() {
        console.debug(this.context, "******************************** BuildList Mounted ********************************");
        this.mounted = true;
        this.buildService = this.context.buildService as IBuildService;
        this.searchBuilds();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    componentDidUpdate(prevProps: BuildSearchProps) {
        if (!(this.props.searchText == prevProps.searchText))
        {
            this.searchBuilds();
        }
    }

    searchBuilds() {
        if (this.mounted) {
            this.setState({
                loading: true
            });
        }

        this.buildService.searchForBuilds(this.props.searchText).then((builditems) => {
            if (this.mounted) {
                this.setState({ builds: builditems, loading: false }, () => {
                });
            }
        });
    }

    toggleLoading() {
        if (this.mounted) {
            this.setState(prevState => {
                loadingToggle.value = !prevState.loading;
                return {
                    ...prevState,
                    loading: !prevState.loading
                }
            });
        }
    }

    public render(): JSX.Element {
        return (
            <div className="flex-column">
                <div className="azdoListContainer">
                    <h3 className="listHeader">Build Definitions</h3>
                </div>
                <div className="azdoList builds">
                    {
                        this.state.builds.map(item => (<BuildPanel key={item.buildRef.name} model={item} loading={this.state.loading} />))
                    }
                </div>
            </div>
        );
    }
}

BuildList.contextType = shimmy.dependencyContext;