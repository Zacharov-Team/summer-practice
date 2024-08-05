import DivComponent from "../DummyComponents/DivComponent";
import HasInnerTextComponent from "../DummyComponents/HasInnerTextComponent";
import NoneInnerTextComponent from "../DummyComponents/NoneInnerTextComponent";
import "./rawdata.scss";
import {makeCandlePlot, makeLinearPlot } from "../../modules/plots";
import { TOOLS_COUNT } from "../../modules/consts";

class RawDataView {
    #mainEventBus;
    #localEventBus;
    #typeOfPlot = 'linear';
    #plotData = null;
    #toolsCount = TOOLS_COUNT;
    #traces = [];

    constructor(mainEventBus, localEventBus) {
        this.#mainEventBus = mainEventBus;
        this.#localEventBus = localEventBus;

        this.#mainEventBus.addEventListener("clickedRenderRawDataPage", this.render.bind(this));
        this.#localEventBus.addEventListener('receivedPlot', this.updatePlot.bind(this));
    }

    render() {
        if (document.getElementById("raw-data")) {
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

        const startDate = new NoneInnerTextComponent(
            "input",
            { type: "date", id: 'start-date-input' },
            ["variant__input"]
        );

        const endDate = new NoneInnerTextComponent(
            "input",
            { type: "date", id: 'end-date-input' },
            ["variant__input"]
        );

        const oneDayButton = new HasInnerTextComponent('input', {checked: true, name: 'days', value: 1, type: 'radio', id: 'one-day-radio'}, ['period-date__radio-button']);
        const sevenDayButton = new HasInnerTextComponent('input', {name: 'days', value: 7, type: 'radio', id: 'seven-day-radio'}, ['period-date__radio-button']);
        const fourteenDayButton = new HasInnerTextComponent('input', {name: 'days', value: 14, type: 'radio', id: 'fourteen-day-radio'}, ['period-date__radio-button']);
        const thirtyDayButton = new HasInnerTextComponent('input', {name: 'days', value: 30, type: 'radio', id: 'thirty-day-radio'}, ['period-date__radio-button']);
        const otherDayButton = new HasInnerTextComponent('input', {name: 'days', value: 'other-day', type: 'radio', id: 'other-day-radio'}, ['period-date__radio-button']);

        const linearPlotButton = new HasInnerTextComponent('input', {checked: true, name: 'type-of-plot', value: 'linear', type: 'radio', id: 'one-day-radio'}, ['plot-type__radio-button']);
        const candlesPlotButton = new HasInnerTextComponent('input', {name: 'type-of-plot', value: 'candles', type: 'radio', id: 'one-day-radio'}, ['plot-type__radio-button']);

        const dpDiv = document.createElement("div");
        dpDiv.setAttribute("id", "raw-data");
        dpDiv.classList.add("raw-data");
        (dpDiv.innerHTML = (new DivComponent({ id: "calculating" }, ["calculating"], "", [
                new DivComponent({}, ['left-side-radios'], '', [
                    new DivComponent({id: 'radio-zone'}, ['radio-zone'], '', [
                        new DivComponent({}, ['radio-layout'], '1 day', [
                            oneDayButton,
                        ]),
                        new DivComponent({}, ['radio-layout'], '7 day', [
                            sevenDayButton,
                        ]),
                        new DivComponent({}, ['radio-layout'], '14 day', [
                            fourteenDayButton,
                        ]),
                        new DivComponent({}, ['radio-layout'], '30 day', [
                            thirtyDayButton,
                        ]),
                        new DivComponent({}, ['radio-layout'], 'Другое', [
                            otherDayButton,
                        ])
                    ]),
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
                                        "Начальная дата",
                                        [
                                            startDate,
                                        ]
                                    ),
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
                    new DivComponent({}, ['radio-zone'], '', [
                        new DivComponent({}, ['radio-layout'], 'Линейный', [
                            linearPlotButton,
                        ]),
                        new DivComponent({}, ['radio-layout'], 'Свечи', [
                            candlesPlotButton,
                        ]),
                    ]),
                ]),
                new DivComponent(
                    { id: "calculate-div" },
                    ["calculate-div"],
                    "",
                    [
                        calcButton,
                    ]
                ),
            ])).render() + new DivComponent({}, ["dp-tags"], "", [
                new DivComponent(
                    { id: "tags-field" },
                    ["tags-field"],
                    "",
                    tools,
                ),
                resultTags,
            ]).render());

        document.body.appendChild(dpDiv);
        document.getElementById('seven-day-radio').checked = true;

        const startInput = document.getElementById(startDate.getAttr('id'));
        const endInput = document.getElementById(endDate.getAttr('id'));

        endInput.valueAsDate = new Date('2021-01-08');
        startInput.valueAsDate = new Date('2021-01-01');

        startInput.addEventListener('click', () => {
            document.getElementById(otherDayButton.getAttr('id')).setAttribute('checked', true);
        });

        endInput.addEventListener('click', () => {
            document.getElementById(otherDayButton.getAttr('id')).setAttribute('checked', true);
        });

        document.querySelectorAll('.period-date__radio-button').forEach((button) => {
            if (button.id !== 'other-day-radio') {
                button.addEventListener('click', () => {
                        const diff = +button.value;
                        const endDate = new Date(endInput.value);

                        endDate.setDate(endDate.getDate() - diff);
                        startInput.valueAsDate = endDate;
                    },
                );
            }
        });

        document.querySelectorAll('.plot-type__radio-button').forEach((button) => {
            button.addEventListener('click', () => {
                this.#typeOfPlot = button.value;

                if (document.getElementById('plot-div')) {
                    this.updatePlot(this.#plotData);
                }
            });
        });

        tools.forEach((tool) => {
            tool.addListeners([{
                event: 'click',
                func: () => {
                    const toolId = tool.getAttr('id');

                    if (!tool.hasClass('tag_chosen')) {
                        resultTags.addInnerComponent(new DivComponent({ id: `${toolId}-chosen` }, ['tag', "tag_chosen"], tool.getText()));
                        resultTags.update();
                        this.#traces.push(tool.getAttr('value'));
                    } else {
                        resultTags.removeInnerComponent('id', `${toolId}-chosen`);
                        this.#traces.splice(this.#traces.indexOf(tool.getAttr('value')), 1);
                        document.getElementById(`${toolId}-chosen`)?.remove();
                        if (this.#plotData) {
                            this.updatePlot(this.#plotData);
                        }
                    }

                    tool.toggleClass('tag_chosen');
                    tool.update();
                },
            }]);
        });

        calcButton.addListeners([{
            event: 'click',
            func: () => {
                this.#localEventBus.emit('needPlot', {startDate: startInput.value, endDate: endInput.value});
            },
        }])
    }

    updatePlot(plotData) {
        this.#plotData = plotData;

        switch (this.#typeOfPlot) {
            case 'linear':
                makeLinearPlot(this.#plotData, this.#traces);
                break;
            case 'candles':
                makeCandlePlot(this.#plotData, this.#traces);
                break;
        }
    }
}

export default RawDataView;
