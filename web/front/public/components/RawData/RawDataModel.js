import { RawDataService } from "../../modules/APIService";

class RawDataModel {
    #mainEventBus;
    #localEventBus;

    constructor(mainEventBus, localEventBus) {
        this.#mainEventBus = mainEventBus;
        this.#localEventBus = localEventBus;
        this.rawDataService = new RawDataService();

        this.#localEventBus.addEventListener(
            "needPlot",
            this.getPlot.bind(this)
        );
    }

    async getPlot({ startDate, endDate }) {
        const response = await this.rawDataService.getRawData(
            startDate,
            endDate
        );

        switch (response.status) {
            case 200:
                this.#localEventBus.emit("receivedPlot", response.data);
                break;
        }
    }
}

export default RawDataModel;
