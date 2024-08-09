import "./NeuralNetworkProcessing.scss";
import DivComponent from "../DummyComponents/DivComponent";
import NoneInnerTextComponent from "../DummyComponents/NoneInnerTextComponent";
import HasInnerTextComponent from "../DummyComponents/HasInnerTextComponent";
import { MARKERS_OC, TOOLS_COUNT, VALID_PICTURE_EXTENSIONS } from "../../modules/consts";
import { makeCandlePlot, makeHeatPlot, makeLinearPlot } from "../../modules/plots";

class NeuralNetworkProcessingView {
    #mainEventBus;
    #localEventBus;
    #daysDuration = 7;
    #typeOfPlot = 'linear';
    #heatmapPlotData = null;
    #initialPlotData = null;
    #traces = [];

    constructor(mainEventBus, localEventBus) {
        this.#mainEventBus = mainEventBus;
        this.#localEventBus = localEventBus;

        for (let i = 0; i < TOOLS_COUNT; i++) {
            this.#traces.push(i);
        }

        this.#mainEventBus.addEventListener("clickedRenderNNPPage", this.render.bind(this));
        this.#localEventBus.addEventListener('receivedHeatMap', this.updateGlobalHeatMap.bind(this));
        this.#localEventBus.addEventListener('receivedInitialPlot', this.updateInitialPlot.bind(this));
        this.#localEventBus.addEventListener('receivedPictureHeatmapPlot', this.updatePictureHeatMap.bind(this));
    }

    render() {
        if (document.getElementById('nnp')) {
            return;
        }

        while (document.body.childNodes.length > 1) {
            document.body.removeChild(document.body.lastChild);
        }

        const calcButton = new HasInnerTextComponent(
            "button",
            { id: "calculate-button" },
            ["calculate-button"],
            "Вычислить"
        );

        /*const startDate = new NoneInnerTextComponent(
            "input",
            { type: "date", id: 'start-date-input' },
            ["variant__input"]
        );*/

        const endDate = new NoneInnerTextComponent(
            "input",
            { type: "date", id: 'end-date-input' },
            ["variant__input"]
        );

        const oneDayButton = new HasInnerTextComponent('input', {name: 'days', value: 1, type: 'radio', id: 'one-day-radio'}, ['period-date__radio-button']);
        const sevenDayButton = new HasInnerTextComponent('input', {checked: true, name: 'days', value: 7, type: 'radio', id: 'seven-day-radio'}, ['period-date__radio-button']);
        const fourteenDayButton = new HasInnerTextComponent('input', {name: 'days', value: 14, type: 'radio', id: 'fourteen-day-radio'}, ['period-date__radio-button']);
        const thirtyDayButton = new HasInnerTextComponent('input', {name: 'days', value: 30, type: 'radio', id: 'thirty-day-radio'}, ['period-date__radio-button']);
        //const otherDayButton = new HasInnerTextComponent('input', {name: 'days', value: 'other-day', type: 'radio', id: 'other-day-radio'}, ['period-date__radio-button']);

        const linearPlotButton = new HasInnerTextComponent('input', {checked: true, name: 'type-of-plot', value: 'linear', type: 'radio', id: 'one-day-radio'}, ['plot-type__radio-button']);
        const candlesPlotButton = new HasInnerTextComponent('input', {name: 'type-of-plot', value: 'candles', type: 'radio', id: 'one-day-radio'}, ['plot-type__radio-button']);

        const dpDiv = document.createElement("div");
        dpDiv.setAttribute("id", "nnp");
        dpDiv.classList.add("nnp");
        (dpDiv.innerHTML = (new DivComponent({}, ['nnp-picture'], '', [
            new DivComponent({}, ['nnp-picture-buttons'], '', [
                new HasInnerTextComponent('button', {id: 'add-picture-nnp'}, ['add-picture-nnp__button'], 'Добавить картинку'),
                new NoneInnerTextComponent('input', {id: 'add-picture-nnp__input', type: 'file'}, ['add-picture-nnp__input']),
                new HasInnerTextComponent('button', {id: 'calc-picture-nnp'}, ['calc-picture-nnp__button'], 'Вычислить'),
            ]),
            new DivComponent({id: 'heatmap-1-plot-div'}, ['heatmap-plot-div']),
        ])).render() + (new DivComponent({ id: "calculating" }, ["calculating"], "", [
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
                        /*new DivComponent({}, ['radio-layout'], 'Другое', [
                            otherDayButton,
                        ])*/
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
                                    /*new DivComponent(
                                        { id: "date-variant" },
                                        ["variant-div"],
                                        "Начальная дата",
                                        [
                                            startDate,
                                        ]
                                    ),*/
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
                ),
            ]).render());

        document.body.appendChild(dpDiv);

        const addPictureInput = document.getElementById('add-picture-nnp__input');

        document.getElementById('add-picture-nnp').addEventListener('click', () => {
            addPictureInput.click();
        });

        document.getElementById('calc-picture-nnp').addEventListener('click', () => {

            if (!addPictureInput.files.length) {
                return;
            }

            const picture = addPictureInput.files[0];

            if (!VALID_PICTURE_EXTENSIONS.includes(picture.name.split('.').at(-1))) {
                return;
            }

            this.#localEventBus.emit('needPictureNNPPlot', picture);
        });

        //const startInput = document.getElementById(startDate.getAttr('id'));
        const endInput = document.getElementById(endDate.getAttr('id'));

        endInput.valueAsDate = new Date('2021-01-08');
        //startInput.valueAsDate = new Date('2021-01-01');

        /*startInput.addEventListener('click', () => {
            document.getElementById(otherDayButton.getAttr('id')).setAttribute('checked', true);
        });*/

        /*endInput.addEventListener('click', () => {
            document.getElementById(otherDayButton.getAttr('id')).setAttribute('checked', true);
        });*/

        document.querySelectorAll('.period-date__radio-button').forEach((button) => {
            /*if (button.id !== 'other-day-radio') {
                button.addEventListener('click', () => {
                        const diff = +button.value;
                        const endDate = new Date(endInput.value);

                        endDate.setDate(endDate.getDate() - diff);
                        startInput.valueAsDate = endDate;
                    },
                );
            }*/
            button.addEventListener('click', () => {
                this.#daysDuration = button.value;
            });
        });

        document.querySelectorAll('.plot-type__radio-button').forEach((button) => {
            button.addEventListener('click', () => {
                this.#typeOfPlot = button.value;

                if (document.getElementById('initial-plot-div')) {
                    this.updateInitialPlot(this.#initialPlotData);
                }
            });
        });

        calcButton.addListeners([{
            event: 'click',
            func: () => {
                const startInputValue = new Date(endInput.value);
                startInputValue.setDate(startInputValue.getDate() - this.#daysDuration);

                const startDate = `${startInputValue.getFullYear()}-${startInputValue.getMonth() + 1}-${startInputValue.getDate()}`;

                this.#localEventBus.emit('needHeatMap', {startDate, endDate: endInput.value});
                this.#localEventBus.emit('needInitialPlot', {startDate, endDate: endInput.value});
            },
        }])

    }

    updatePictureHeatMap(plotData) {
        makeHeatPlot(plotData, 2, MARKERS_OC, 'data', 'heatmap-1-plot-div', 600, 'NNP');
    }

    updateGlobalHeatMap(plotData) {
        this.#heatmapPlotData = plotData;
        makeHeatPlot(this.#heatmapPlotData, 2, MARKERS_OC, 'data', 'heatmap-2-plot-div');
    }

    updateInitialPlot(plotData) {
        this.#initialPlotData = plotData;

        switch (this.#typeOfPlot) {
            case 'linear':
                makeLinearPlot(this.#initialPlotData, this.#traces);
                break;
            case 'candles':
                makeCandlePlot(this.#initialPlotData, this.#traces);
                break;
        }
    }
}

export default NeuralNetworkProcessingView;
