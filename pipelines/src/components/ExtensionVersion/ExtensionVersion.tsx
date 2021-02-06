import { IAzDOSDK } from "@serviceinterfaces";
import React = require("react");
import * as shimmy from "@locatorpath";
import { CommonServiceIds, IExtensionDataService } from "azure-devops-extension-api";
import { IExtensionContext } from "azure-devops-extension-sdk";
import { Dialog } from "azure-devops-ui/Dialog";
import { Observer } from "azure-devops-ui/Observer";
import { ObservableValue } from "azure-devops-ui/Core/Observable";



export default class ExtensionVersion extends React.Component<{}, any> {
    sdk: IAzDOSDK;
    private _dataManager: any;
    
    /**
     *
     */
    constructor(props: {}) {
        super(props);

        this.sdk = shimmy.serviceContext.getSDK();

        this.state =
        {
            extension: {
                version: null,
                publisherId: "",
                extensionId: null,
                id: ""
            }
        };
    }
    public componentDidMount() {
        this.initializeState();
    }

    private async initializeState(): Promise<void> {
        await this.sdk.ready();
        const accessToken = await this.sdk.getAccessToken();
        const extDataService = await this.sdk.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);
        let extensionInfo: IExtensionContext = await this.sdk.getExtensionContext();
        this.setState({

            extension: {
                version: extensionInfo.version,
                publisherId: extensionInfo.publisherId,
                extensionId: extensionInfo.extensionId,
                id: extensionInfo.id
            }
        });
    }
    private isDialogOpen = new ObservableValue<boolean>(false);
    public render(): JSX.Element {
        const onDismiss = () => {
            this.isDialogOpen.value = false;
        };        
        return (
            <div className="versioninfo">
                <div onClick={()=> {this.isDialogOpen.value = true;}} className="clickable">
                    <strong>Version: </strong>
                    <span>{this.state.extension.version}</span>
                </div>
                <Observer isDialogOpen={this.isDialogOpen}>
                    {(props: { isDialogOpen: boolean }) => {
                        return props.isDialogOpen ? (
                            <Dialog
                                titleProps={{ text: "Version and Publisher Information" }}
                                footerButtonProps={[
                                    {
                                        text: "Ok",
                                        onClick: onDismiss
                                    }
                                ]}
                                onDismiss={onDismiss}
                            >
                                <strong>Version: </strong>
                                <span>{this.state.extension.version}</span> <br />                      
                                <strong>Publisher Id: </strong>
                                <span>{this.state.extension.publisherId}</span> <br />
                                <strong>Extension Id: </strong>
                                <span>{this.state.extension.extensionId}</span> <br />
                                <strong>Id: </strong>
                                <span>{this.state.extension.id}</span>                     
                            </Dialog>
                        ) : null;
                    }}
                </Observer>                
            </div> 
        );
    }
}