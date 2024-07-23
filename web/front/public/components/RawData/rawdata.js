import DivComponent from "../DummyComponents/DivComponent";
import "./rawdata.scss";

class RawData {
    #rawsCount;
    #eventBus;

    constructor(eventBus, rawsCount) {
        this.#rawsCount = rawsCount;
        this.#eventBus = eventBus;

        this.#eventBus.addEventListener("clickedRenderRawDataPage", () => {
            this.render();
        });
    }

    render() {
        if (document.getElementById("rawData")) {
            return;
        }

        while (document.body.childNodes.length > 1) {
            document.body.removeChild(document.body.lastChild);
        }

        const rawsCount = [];

        for (let i = 0; i < this.#rawsCount; ++i) {
            rawsCount.push(new DivComponent({}, ["raw-item"], "", []));
        }

        const rawDataDiv = document.createElement("div");
        rawDataDiv.setAttribute("id", "raw-data");
        rawDataDiv.classList.add("raw-data");
        rawDataDiv.innerHTML = new DivComponent(
            {},
            ["raw-column"],
            "",
            rawsCount
        ).render();

        document.body.appendChild(rawDataDiv);
    }
}

export default RawData;
