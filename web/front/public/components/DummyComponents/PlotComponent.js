import BaseComponent from "./BaseComponent";

class PlotComponent extends BaseComponent {
    constructor(width, height) {
        super();
    }

    render() {
        return `<img src="dist/static/plot_example.webp" class="plot-example__image"/>`;
    }
}

export default PlotComponent;
