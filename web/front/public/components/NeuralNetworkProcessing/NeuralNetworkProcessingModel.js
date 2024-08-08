import { NNPService } from "../../modules/APIService";

class NeuralNetworkProcessingModel {
    #mainEventBus;
    #localEventBus;

    constructor(mainEventBus, localEventBus) {
        this.#mainEventBus = mainEventBus;
        this.#localEventBus = localEventBus;
        this.nnpService = new NNPService();

        this.#localEventBus.addEventListener(
            "needHeatMap",
            this.getHeatMap.bind(this)
        );
        this.#localEventBus.addEventListener('needInitialPlot', this.getInitialPlot.bind(this));
        this.#localEventBus.addEventListener('needPictureNNPPlot', this.calculatePicture.bind(this));
    }

    async getHeatMap({ startDate, endDate }) {
        const response = await this.nnpService.getHeatMap(
            startDate,
            endDate
        );

        switch (response.status) {
            case 200:
                this.#localEventBus.emit("receivedHeatMap", response.data);
                break;
            case 401:
                this.#mainEventBus.emit('clickedRenderSignInPage');
                break;
        }
    }

    async calculatePicture(picture) {
        const response = await this.nnpService.calculatePicture(picture);

        console.log(response);

        switch (response.status) {
            case 200:
                this.#localEventBus.emit("receivedPictureHeatmapPlot", response.data);
                break;
            case 401:
                this.#mainEventBus.emit('clickedRenderSignInPage');
                break;
        }
    }

    async getInitialPlot({ startDate, endDate }) {
        const response = await this.nnpService.getInitialPlot(
            startDate,
            endDate
        );

        switch (response.status) {
            case 200:
                this.#localEventBus.emit("receivedInitialPlot", response.data);
                break;
            case 401:
                this.#mainEventBus.emit('clickedRenderSignInPage');
                break;
        }
    }
}

export default NeuralNetworkProcessingModel;
