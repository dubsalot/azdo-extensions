import * as React from "react";
import { CommonServiceIds, IHostPageLayoutService } from "azure-devops-extension-api";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { Page } from "azure-devops-ui/Page";
import { Tab, TabBar, TabSize } from "azure-devops-ui/Tabs";
import { VssPersona } from "azure-devops-ui/VssPersona";

import { IAzDOSDK } from "@serviceinterfaces";
import { showRootComponent } from "../../Common";
import { SearchPipeline } from "./Overview/SearchPipeline";
import { Settings } from "./Settings/Settings";
import * as shimmy from "@locatorpath";
import "./Pipeview.scss";
import { PipelineList } from "./PipelineList/PipelineList";
import { IExtensionContext } from "azure-devops-extension-sdk";
import ExtensionVersion from "@components/ExtensionVersion/ExtensionVersion";

interface IHubContentState {

    selectedTabId: string;

    fullScreenMode: boolean;

    useLargeTitle?: boolean;

    headerDescription?: string;

    useCompactPivots?: boolean;
    
    extension?: IExtensionContext;
}


class PipeviewContent extends React.Component<{}, IHubContentState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            selectedTabId: "searchpipelines",
            fullScreenMode: false,
        };
    }

    public componentDidMount() {
        var sdk = this.context.sdk as IAzDOSDK
        sdk.init({ loaded: true});

        
        
        this.initializeFullScreenState();
    }

    getFakeHeader() : JSX.Element { 
        let initialsIdentityProvider = {
            getDisplayName() {
                return "Wes Goodwin";
            },
            getIdentityImageUrl(size: number) {
                return undefined;
            }
        };
        return <div className="fakeHeader">
                        <div className="fhItem">
                            <VssPersona
                                    className="fhId"
                                    identityDetailsProvider={initialsIdentityProvider}
                                    size={"medium-plus"}
                            />
                        </div>                     
                    </div>      
    }

    public render(): JSX.Element {
        const { selectedTabId, headerDescription, useCompactPivots, useLargeTitle } = this.state;
        let fakeHeader;
        let version;
        var sdk = this.context.sdk as IAzDOSDK
        if(!sdk.isReal())
        {
            fakeHeader = this.getFakeHeader()
        }
  
        return (
            <Page className="dubs-hub flex-grow hubcontainer">
                {fakeHeader}
                <Header title="Search Pipelines and Repos"
                    description={headerDescription}
                    titleSize={TitleSize.Large} />
                {
                
                /* 
                //TODO: after this is pushed up to master, implement feature flags for the other sections & tabs

                <TabBar
                    onSelectedTabChanged={this.onSelectedTabChanged}
                    selectedTabId={selectedTabId}
                    tabSize={useCompactPivots ? TabSize.Compact : TabSize.Tall}>

                    <Tab name="Search" id="searchpipelines" />
                    <Tab name="Pipeline Summary" id="PipelineList" />
                    <Tab name="Settings" id="settings" />
                </TabBar> */}
                {this.getPageContent()}
                <ExtensionVersion />
            </Page>
        );
    }

    // private onSelectedTabChanged = (newTabId: string) => {
    //     this.setState({
    //         selectedTabId: newTabId
    //     })
    // }

    private getPageContent() {
        const { selectedTabId } = this.state;

        // removing the other sections and the TabControl to put out an MVP.
        //TODO: after this is pushed up to master, implement feature flags for the other sections & tabs

        return <SearchPipeline />;
        
        // REMOVED - SEE ABOVE ABOUT FEATURE FLAGS

        // if (selectedTabId === "searchpipelines") {
        //     return <SearchPipeline />;
        // }
        // else if (selectedTabId === "settings") {
        //     return <Settings />;
        // }
        // else if (selectedTabId === "PipelineList") {
        //     return <PipelineList />;
        // }
    }

    private async initializeFullScreenState() {
        var sdk = this.context.sdk as IAzDOSDK
        if(sdk.isReal())
        {
            await sdk.ready();
            let extensionInfo: IExtensionContext = await sdk.getExtensionContext();

            const layoutService = await sdk.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
            const fullScreenMode = await layoutService.getFullScreenMode();
            if (fullScreenMode !== this.state.fullScreenMode) {

                this.setState(prevState => {
                    return {
                        ...prevState,
                        fullScreenMode: fullScreenMode,
                        extension: extensionInfo
                    }
                });
            }
        }
    }
}

PipeviewContent.contextType = shimmy.dependencyContext;

showRootComponent(
    <PipeviewContent />
);