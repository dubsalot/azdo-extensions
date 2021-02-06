import React = require("react");
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { IReleaseResult, IReleaseService } from "@serviceinterfaces";
import ReleasePanel from "@components/ReleaseList/ReleasePanel"
import * as shimmy from "@locatorpath";
import "./Releases.scss";

interface ReleaseSearchProps {
    searchText: string;
}


interface ReleaseSearchState {
    loading: boolean
    Releases: Array<IReleaseResult>;
}

const loadingToggle = new ObservableValue<boolean>(false);


export default class ReleaseList extends React.Component<ReleaseSearchProps, ReleaseSearchState> {
    releaseService!: IReleaseService;
    mounted: boolean = false;

    constructor(props: ReleaseSearchProps) {
        super(props);
        this.state =
        {
            loading: false,
            Releases: new Array<IReleaseResult>(),
        };
    }

    componentDidMount() {
        console.debug(this.context, "******************************** ReleaseList Mounted ********************************");
        this.mounted = true;
        this.releaseService = this.context.releaseService as IReleaseService;
        this.searchReleases();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    componentDidUpdate(prevProps:ReleaseSearchProps) {
        if(!(this.props.searchText == prevProps.searchText)) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
        {
            this.searchReleases();
        }
    }     

    searchReleases() {
        this.setState({
            loading: true
        });


        this.releaseService.searchForReleases(this.props.searchText).then((releaseitems) => {
            if (this.mounted) {
                this.setState({ Releases: releaseitems, loading: false }, () => {
                });
            }
        });
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
                <div className="azdoListContainer">
                    <h3 className="listHeader">Release Definitions</h3>
                </div>
                <div className="azdoList Releases">
                    {
                        this.state.Releases.map(item => (<ReleasePanel key={item.name} model={item} loading={this.state.loading} />))
                    }
                </div>
            </div>
        );
    }
}

ReleaseList.contextType = shimmy.dependencyContext;