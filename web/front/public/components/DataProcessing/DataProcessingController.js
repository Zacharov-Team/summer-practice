import EventBus from "../../modules/EventBus.js";
import DataProcessingModel from "./DataProcessingModel.js";
import DataProcessingView from "./DataProcessingView.js";

const incomingEvents = ["needPlot", "receivedPlot"];

class DataProcessingController {
    constructor(mainEventBus) {
        this.localEventBus = new EventBus(incomingEvents);
        this.dpModel = new DataProcessingModel(mainEventBus, this.localEventBus);
        this.dpView = new DataProcessingView(mainEventBus, this.localEventBus);
    }
}

export default DataProcessingController;
