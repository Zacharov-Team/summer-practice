import EventBus from "../../modules/EventBus.js";
import RawDataView from "./RawDataView.js";
import RawDataModel from "./RawDataModel.js";

const incomingEvents = ["needPlot", "receivedPlot"];

class RawDataController {
    constructor(mainEventBus) {
        this.localEventBus = new EventBus(incomingEvents);
        this.rawDataModel = new RawDataModel(mainEventBus, this.localEventBus);
        this.rawDataView = new RawDataView(mainEventBus, this.localEventBus);
    }

    renderRawDataView() {
        this.rawDataView.render();
    }
}

export default RawDataController;
