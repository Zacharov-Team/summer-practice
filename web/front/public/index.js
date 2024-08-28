"use strict";

import Header from "./components/Header/header";
import RawDataController from "./components/RawData/RawDataController";
import "./reset.css";
import "./index.scss";
import NeuralNetworkProcessingController from "./components/NeuralNetworkProcessing/NeuralNetworkProcessingController";
import SignInController from "./components/SignIn/SignInController";
import Register from "./components/Register/Register";
import EventBus from "./modules/EventBus";
import DataProcessingController from "./components/DataProcessing/DataProcessingController";

const eventBus = new EventBus([
    "clickedRenderSignInPage",
    "clickedRenderRegisterPage",
    "clickedRenderRawDataPage",
    "clickedRenderDataProcessingPage",
    "clickedRenderNNPPage",
    "enteredIntoAccount",
    "createdAnAccount",
    "exitedFromAccount",
    "clickedAddTag",
    "clickedEnterIntoAccount",
    "clickedCreateAnAccount",
    "checkIsAuthenticated",
]);

const header = new Header(eventBus);
const rawData = new RawDataController(eventBus);
const dp = new DataProcessingController(eventBus);
const nnp = new NeuralNetworkProcessingController(eventBus);
const signIn = new SignInController(eventBus);

if (!(await signIn.checkIsAuthenticated())) {
    signIn.renderView();
} else {
    header.enteredIntoAccount();
    rawData.renderRawDataView();
}
