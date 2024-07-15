"use strict";

import Header from "./components/Header/header";
import RawData from "./components/RawData/rawdata";
import "./reset.css";
import "./index.scss";
import NeuralNetworkProcessing from "./components/NeuralNetworkProcessing/NeuralNetworkProcessing";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
import EventBus from "./modules/EventBus";
import DataProcessing from "./components/DataProcessing/DataProcessing";

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
]);

const header = new Header(eventBus);
const rawData = new RawData(eventBus, 8);
const dp = new DataProcessing(eventBus);
const nnp = new NeuralNetworkProcessing(eventBus, 8);
const signIn = new SignIn(eventBus);
const register = new Register(eventBus);

header.render();
rawData.render();
