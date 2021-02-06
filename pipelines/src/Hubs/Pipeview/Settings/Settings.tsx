import * as React from "react";
import { CommonServiceIds, IExtensionDataManager, IExtensionDataService } from "azure-devops-extension-api";
import { Button } from "azure-devops-ui/Button";
import { TextField } from "azure-devops-ui/TextField";
import { IExtensionContext} from "azure-devops-extension-sdk";
import { Card } from "azure-devops-ui/Card";
import { FormItem } from "azure-devops-ui/FormItem";
import * as shimmy from "@locatorpath";
import { IAzDOSDK } from "@serviceinterfaces";


export interface IExtensionDataState {
    dataText?: string;
    persistedText?: string;
    ready?: boolean;
    extension?: IExtensionContext
}

export class Settings extends React.Component<{}, IExtensionDataState> {

    private _dataManager?: IExtensionDataManager;
    sdk: IAzDOSDK;

    constructor(props: {}) {
        super(props);
        this.state = {};

        this.sdk = shimmy.serviceContext.getSDK();
    }

    public componentDidMount() {
        this.initializeState();
    }

    private async initializeState(): Promise<void> {
        await this.sdk.ready();
        const accessToken = await this.sdk.getAccessToken();
        const extDataService = await this.sdk.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);
        this._dataManager = await extDataService.getExtensionDataManager(this.sdk.getExtensionContext().id, accessToken);
        let extensionInfo: IExtensionContext = await this.sdk.getExtensionContext();

        this._dataManager.getValue<string>("test-id").then((data) => {
            this.setState({
                dataText: data,
                persistedText: data,
                ready: true,
                extension: extensionInfo
            });
        }, () => {
            this.setState({
                dataText: "",
                ready: true
            });
        });
    }

    public render(): JSX.Element {
        const { dataText, ready, persistedText } = this.state;
        let version;
        if (this.state.extension != undefined) {
            version =
                <div className="versioninfo">
                    <div>
                        <strong>Version: </strong>
                        <span>{this.state.extension.version}</span>
                    </div>
                    <div>
                        <strong>Publisher Id: </strong>
                        <span>{this.state.extension.publisherId}</span>
                    </div>
                    <div>
                        <strong>Extension Id: </strong>
                        <span>{this.state.extension.extensionId}</span>
                    </div>
                    <div>
                        <strong>Id: </strong>
                        <span>{this.state.extension.id}</span>
                    </div>
                </div>      
        }
        return (
            <Card className="settings">
                <div className="settingsContent">
                    <div>
                        <FormItem label="JSON Data:">
                            <TextField
                                ariaLabel="Settings"
                                value={dataText}
                                multiline
                                rows={25}
                                onChange={this.onTextValueChanged}
                                disabled={!ready}
                            />
                        </FormItem>  
                        <br />                      
                        <Button
                            text="Save"
                            primary={true}
                            onClick={this.onSaveData}
                            disabled={!ready || dataText === persistedText}
                        />
                    </div>
                    {version}
                </div>
                
            </Card>                  
        );
    }

    private onTextValueChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value: string): void => {
        this.setState({ dataText: value });
    }

    private onSaveData = (): void => {
        const { dataText } = this.state;
        this.setState({ ready: false });
        this._dataManager!.setValue<string>("test-id", dataText || "").then(() => {
            this.setState({
                ready: true,
                persistedText: dataText
            });
        });
    }
}

Settings.contextType = shimmy.dependencyContext;