import React = require("react");
import { IServiceContext } from "@serviceinterfaces";
import { FakeContext } from "./FakeContext";

export const serviceContext: IServiceContext = new FakeContext();
export const dependencyContext: React.Context<IServiceContext> = React.createContext(serviceContext);