import "./DataProcessing.scss";
import DivComponent from "../DummyComponents/DivComponent";
import NoneInnerTextComponent from "../DummyComponents/NoneInnerTextComponent";
import PlotComponent from "../DummyComponents/PlotComponent";
import HasInnerTextComponent from "../DummyComponents/HasInnerTextComponent";
import { DPService } from "../../modules/APIService";

class DataProcessing {
    #eventBus;

    constructor(eventBus) {
        this.#eventBus = eventBus;

        this.#eventBus.addEventListener("clickedRenderDataProcessingPage", () => {
            this.render();
        });
    }

    async render() {
        if (document.getElementById("dp")) {
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

        const dpDiv = document.createElement("div");
        dpDiv.setAttribute("id", "dp");
        dpDiv.classList.add("dp");
        (dpDiv.innerHTML =
            new DivComponent({}, ["dp-tags"], "", [
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
            ])).render() + new PlotComponent().render());

        document.body.appendChild(dpDiv);

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
    }
}

export default DataProcessing;
