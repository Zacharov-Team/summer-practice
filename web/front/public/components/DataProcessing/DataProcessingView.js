import "./DataProcessing.scss";
import DivComponent from "../DummyComponents/DivComponent";
import NoneInnerTextComponent from "../DummyComponents/NoneInnerTextComponent";
import HasInnerTextComponent from "../DummyComponents/HasInnerTextComponent";
import { DAY_DURATION_HEAT_MAP, TOOLS_COUNT } from "../../modules/consts";
import { makeHeatPlot } from "../../modules/plots";

class DataProcessingView {
    #mainEventBus;
    #localEventBus;
    #toolsCount = TOOLS_COUNT;

    constructor(mainEventBus, localEventBus) {
        this.#mainEventBus = mainEventBus;
        this.#localEventBus = localEventBus;

        this.#mainEventBus.addEventListener(
            "clickedRenderDataProcessingPage",
            this.render.bind(this),
        );

        this.#localEventBus.addEventListener('receivedPlot', this.uploadPlot.bind(this));
    }

    render() {
        if (document.getElementById("dp")) {
            return;
        }

        while (document.body.childNodes.length > 1) {
            document.body.removeChild(document.body.lastChild);
        }

        const tools = [];

        for (let i = 0; i < this.#toolsCount; i++) {
            tools.push(new DivComponent({id: `tool-${i}`, value: i}, ['tag'], `Tool ${i}`));
        }

        const resultTags = new DivComponent({ id: "result-tags" }, ["result-tags"]);

        const calcButton = new HasInnerTextComponent(
            "button",
            { id: "calculate-button" },
            ["calculate-button"],
            "Вычислить"
        );

        const endDate = new NoneInnerTextComponent(
            "input",
            { type: "date", id: 'end-date-input' },
            ["variant__input"]
        );

        const dpDiv = document.createElement("div");
        dpDiv.setAttribute("id", "dp");
        dpDiv.classList.add("dp");
        (dpDiv.innerHTML = (new DivComponent({ id: "calculating" }, ["calculating"], "", [
                new DivComponent({}, ['left-side-radios'], '', [
                    new DivComponent(
                        { id: "calculating-variants" },
                        ["calculating-variants"],
                        "",
                        [
                            new DivComponent(
                                { id: "first-string-variants" },
                                ["string-variants"],
                                "",
                                [
                                    new DivComponent(
                                        { id: "period-variant" },
                                        ["variant-div"],
                                        "Конечная дата",
                                        [
                                            endDate,
                                        ]
                                    ),
                                ]
                            ),
                        ]
                    ),
                ]),
                new DivComponent(
                    { id: "calculate-div" },
                    ["calculate-div"],
                    "",
                    [
                        calcButton,
                    ]
                ),
            ])).render());

        document.body.appendChild(dpDiv);

        const endInput = document.getElementById(endDate.getAttr('id'));
        endInput.valueAsDate = new Date('2021-01-08');

        tools.forEach((tool) => {
            tool.addListeners([{
                event: 'click',
                func: () => {
                    const toolId = tool.getAttr('id');

                    if (!tool.hasClass('tag_chosen')) {
                        resultTags.addInnerComponent(new DivComponent({ id: `${toolId}-chosen` }, ['tag', "tag_chosen"], tool.getText()));
                        resultTags.update();
                    } else {
                        resultTags.removeInnerComponent('id', `${toolId}-chosen`);
                        document.getElementById(`${toolId}-chosen`)?.remove();
                    }

                    tool.toggleClass('tag_chosen');
                    tool.update();
                },
            }]);
        });

        calcButton.addListeners([{
            event: 'click',
            func: () => {
                const startDate = new Date(endInput.value);

                startDate.setDate(startDate.getDate() - DAY_DURATION_HEAT_MAP);
                console.log(endInput.value, startDate)
                this.#localEventBus.emit('needPlot', {startDate: `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`, endDate: endInput.value});
            },
        }])
    }

    uploadPlot(plotData) {
        makeHeatPlot(plotData);
    }
}

export default DataProcessingView;
