import EventBus from "../../modules/EventBus.js";
import NeuralNetworkProcessingModel from "./NeuralNetworkProcessingModel.js";
import NeuralNetworkProcessingView from "./NeuralNetworkProcessingView.js";

const incomingEvents = ["needHeatMap", 'needInitialPlot', "receivedHeatMap", 'receivedInitialPlot'];

class NeuralNetworkProcessingController {
    constructor(mainEventBus) {
        this.localEventBus = new EventBus(incomingEvents);
        this.nnpModel = new NeuralNetworkProcessingModel(mainEventBus, this.localEventBus);
        this.nnpView = new NeuralNetworkProcessingView(mainEventBus, this.localEventBus);
    }
}

export default NeuralNetworkProcessingController;
