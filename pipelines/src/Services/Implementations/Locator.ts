import React = require("react");
import { IServiceContext } from "@serviceinterfaces";
import { AzDoContext } from "./AzDoContext";

export const serviceContext: IServiceContext = new AzDoContext();
export const dependencyContext: React.Context<IServiceContext> = React.createContext(serviceContext);