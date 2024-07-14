"use strict";

import Header from "./components/Header/header";
import RawData from "./components/RawData/rawdata";
import "./reset.css";
import "./index.scss";
import NeuralNetworkProcessing from "./components/NeuralNetworkProcessing/NeuralNetworkProcessing";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";

const header = new Header();
const rawData = new RawData(8);
const nnp = new NeuralNetworkProcessing(8);
const signIn = new SignIn();
const register = new Register();

header.render();
nnp.render();
