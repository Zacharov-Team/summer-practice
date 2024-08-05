import { DPService } from "../../modules/APIService";

class DataProcessingModel {
    #mainEventBus;
    #localEventBus;

    constructor(mainEventBus, localEventBus) {
        this.#mainEventBus = mainEventBus;
        this.#localEventBus = localEventBus;
        this.dpService = new DPService();

        this.#localEventBus.addEventListener(
            "needPlot",
            this.getPlot.bind(this)
        );
    }

    async getPlot({ startDate, endDate }) {
        const response = await this.dpService.getDataProcessing(
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

export default DataProcessingModel;