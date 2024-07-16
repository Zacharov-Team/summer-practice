import "./NeuralNetworkProcessing.scss";
import DivComponent from "../DummyComponents/DivComponent";
import NoneInnerTextComponent from "../DummyComponents/NoneInnerTextComponent";
import PlotComponent from "../DummyComponents/PlotComponent";
import HasInnerTextComponent from "../DummyComponents/HasInnerTextComponent";
import { DPService } from "../../modules/APIService";

class NeuralNetworkProcessing {
    #eventBus;

    constructor(eventBus) {
        this.#eventBus = eventBus;

        this.#eventBus.addEventListener("clickedRenderNNPPage", () => {
            this.render();
        });
    }

    async render() {
        if (document.getElementById("nnp")) {
            return;
        }

        while (document.body.childNodes.length > 1) {
            document.body.removeChild(document.body.lastChild);
        }

        const dpService = new DPService();
        const tagNames = await dpService.getDataProcessing();

        const tags = [];

        for (let i = 0; i < tagNames.length; ++i) {
            tags.push(
                new DivComponent({ id: `tag-${tagNames[i]}` }, ["tag"], `Tag ${tagNames[i]}`)
            );
        }

        const resultTags = new DivComponent({ id: "result-tags" }, ["result-tags"]);

        const nnpDiv = document.createElement("div");
        nnpDiv.setAttribute("id", "nnp");
        nnpDiv.classList.add("nnp");
        (nnpDiv.innerHTML =
            new DivComponent({}, ["nnp-tags"], "", [
                new DivComponent(
                    { id: "tags-field" },
                    ["tags-field"],
                    "",
                    tags
                ),
                resultTags,
            ]).render() + (new DivComponent({ id: "calculating" }, ["calculating"], "", [
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
                                    { id: "date-variant" },
                                    ["variant-div"],
                                    "Дата",
                                    [
                                        new NoneInnerTextComponent(
                                            "input",
                                            { type: "date" },
                                            ["variant__input"]
                                        ),
                                    ]
                                ),
                                new DivComponent(
                                    { id: "period-variant" },
                                    ["variant-div"],
                                    "Период",
                                    [
                                        new NoneInnerTextComponent(
                                            "input",
                                            { type: "date" },
                                            ["variant__input"]
                                        ),
                                    ]
                                ),
                            ]
                        ),
                        new DivComponent(
                            { id: "second-string-variants" },
                            ["string-variants"],
                            "",
                            [
                                new DivComponent(
                                    { id: "bot-variant" },
                                    ["variant-div"],
                                    "Выбор бота",
                                    [
                                        new NoneInnerTextComponent(
                                            "input",
                                            { type: "text" },
                                            ["variant__input"]
                                        ),
                                    ]
                                ),
                                new DivComponent(
                                    { id: "weight-variant" },
                                    ["variant-div"],
                                    "Вес",
                                    [
                                        new NoneInnerTextComponent(
                                            "input",
                                            { type: "text" },
                                            ["variant__input"]
                                        ),
                                    ]
                                ),
                            ]
                        ),
                    ]
                ),
                new DivComponent(
                    { id: "calculate-div" },
                    ["calculate-div"],
                    "",
                    [
                        new HasInnerTextComponent(
                            "button",
                            { id: "calculate-button" },
                            ["calculate-button"],
                            "Вычислить"
                        ),
                    ]
                ),
            ])).render());

        document.body.appendChild(nnpDiv);

        tags.forEach((tag) => {
            tag.addListeners([{
                event: 'click',
                func: () => {
                    const tagId = tag.getAttr('id');

                    if (!tag.hasClass('tag_chosen')) {
                        resultTags.addInnerComponent(new DivComponent({ id: `${tagId}-chosen` }, ['tag', "tag_chosen"], tag.getText()));
                        resultTags.update();
                    } else {
                        resultTags.removeInnerComponent('id', `${tagId}-chosen`);
                        document.getElementById(`${tagId}-chosen`)?.remove();
                    }

                    tag.toggleClass('tag_chosen');
                    tag.update();
                },
            }]);
        });

        console.log('kek')

        const plotDiv = document.createElement('div');
        
        plotDiv.setAttribute('id', 'plot-div');
        plotDiv.classList.add('plot-div');

        document.body.appendChild(plotDiv);

        let trace1 = {
            x: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            y: [10, 15, 13, 17, 11, 8, 4, -2],
            mode: 'markers',
            type: 'scatter',
            marker: {
                size: 20,
            }
          };
          
          let data = [trace1];

          let layout = {
            autosize: false,
            width: 1000,
            height: 500,
            margin: {
              pad: 4
            },
            title: 'Zakharov team IQ'
          };
          
          Plotly.newPlot('plot-div', data, layout);
    }
}

export default NeuralNetworkProcessing;
