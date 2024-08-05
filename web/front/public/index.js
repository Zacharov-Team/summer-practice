"use strict";

import Header from "./components/Header/header";
import RawDataController from "./components/RawData/RawDataController";
import "./reset.css";
import "./index.scss";
import NeuralNetworkProcessing from "./components/NeuralNetworkProcessing/NeuralNetworkProcessing";
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
const nnp = new NeuralNetworkProcessing(eventBus, 8);
const signIn = new SignInController(eventBus);
const register = new Register(eventBus);

if (await signIn.checkIsAuthenticated()) {
    header.enteredIntoAccount();
}

header.render();
rawData.renderRawDataView();
