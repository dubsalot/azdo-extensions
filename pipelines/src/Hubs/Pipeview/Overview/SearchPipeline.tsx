//react and ui/ux related imports
import * as React from "react";
import { debounce } from "throttle-debounce";

// azure devops sdk related imports
import { CommonServiceIds, IProjectPageService, IHostNavigationService, INavigationElement, IPageRoute, getClient } from "azure-devops-extension-api";
import { TextField, TextFieldWidth } from "azure-devops-ui/TextField";
import { IHostContext, IExtensionContext } from "azure-devops-extension-sdk";

//project code imports
import RepoList from "@components/RepoList/RepoList"
import BuildList from "@components/BuildList/BuildList";
import * as shimmy from "@locatorpath";
import { IAzDOSDK } from "@serviceinterfaces";
import ReleaseList from "@components/ReleaseList/ReleaseList";
import "./SearchPipeline.scss";


export interface ISearchPipelineState {
    userName?: string;
    projectName?: string;
    extensionData?: string;
    extensionContext?: IExtensionContext;
    host?: IHostContext;
    navElements?: INavigationElement[];
    route?: IPageRoute;
}

export class SearchPipeline extends React.Component<{}, any> {
    sdk: IAzDOSDK;
    debouncedQuery: any;

    constructor(props: {}) {
        super(props);
        this.sdk = shimmy.serviceContext.getSDK();
        this.state = {
        };
        this.debouncedQuery = debounce(500, this.performQueryBySettingState);
    }

    public componentDidMount() {
        this.initializeState();
    }

    //This function is called from debounce. It allows the users to finish typing before performing the search
    performQueryBySettingState = (newQueryText: any) => {
        console.log(`debounced: Setting state.queryText to perform search. search text: ${newQueryText}`);
        this.setState({ queryText: newQueryText });
    };

    //This function is fired from the search box change event. We maintain its state in state.searchText. We set the state.queryText via the debounce function. It allows the users to finish typing before performing the search.
    private onTextValueChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value: string): void => {
        this.setState({ searchText: value }, () => {
            this.debouncedQuery(this.state.searchText);
        });
    }

    private async initializeState(): Promise<void> {
        await this.sdk.ready();

        const userName = this.sdk.getUser().displayName;
        const hst = this.sdk.getHost();
        this.setState({
            userName,
            extensionContext: this.sdk.getExtensionContext(),
            host: this.sdk.getHost(),
            searchText: "",
            queryText: ""
        });

        const projectService = await this.sdk.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
        if (projectService) {
            const project = await projectService.getProject();
            if (project) {
                console.debug(project.id, "Project Id");
                console.debug(project.name, "Project Name");
                this.setState({ projectName: project.name });
            }
        }
        
        const navService = await this.sdk.getService<IHostNavigationService>(CommonServiceIds.HostNavigationService);
        if(navService)
        {
            const navElements = await navService.getPageNavigationElements();
            this.setState({ navElements });
            const route = await navService.getPageRoute();
            this.setState({ route });
        }
    }

    public render(): JSX.Element {
        return (
            <div id="searchpipelinecontent" className="page-content page-content-top rhythm-vertical-16">
                <div className="searchBox flex-row">
                    <TextField
                        value={this.state.searchText}
                        onChange={this.onTextValueChanged}
                        placeholder="Enter search text..."
                        width={TextFieldWidth.auto} prefixIconProps={{ iconName: "Search" }} />
                </div>
                <div className="flex-row">
                    <div className="flex-grow devhubpanel quarter depth-4">
                        <RepoList searchText={this.state.queryText} />
                    </div>
                    <div className="flex-grow devhubpanel quarter depth-4">
                        <BuildList searchText={this.state.queryText} />
                    </div>
                    <div className="flex-grow devhubpanel half depth-4">
                        <ReleaseList searchText={this.state.queryText} />
                    </div>
                </div>
            </div>
        );
    }
}

SearchPipeline.contextType = shimmy.dependencyContext;