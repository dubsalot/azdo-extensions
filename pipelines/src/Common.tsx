import "azure-devops-ui/Core/override.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "./Common.scss";
import * as shimmy from "@locatorpath";
import { CommonServiceIds, IHostNavigationService } from "azure-devops-extension-api";


export function showRootComponent(component: React.ReactElement<any>) {
    ReactDOM.render(component, document.getElementById("root"));
}


export const nav = async (url:string, ctrlKey: boolean) => {
    let navService = await shimmy.serviceContext.sdk.getService<IHostNavigationService>(CommonServiceIds.HostNavigationService);

    if(navService)
    {
        if(ctrlKey)
        {
            navService.openNewWindow(url, "");
        }            
        else{
            navService.navigate(url);
        }
    }
    else{
        if(ctrlKey)
        {
            window.open(url);
        }            
        else{
            window.location.href = url;
        }            
    }
}