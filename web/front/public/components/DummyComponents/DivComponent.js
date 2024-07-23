import BaseComponent from "./BaseComponent";

class DivComponent extends BaseComponent {
    constructor(attrs, classes, innerText, innerComponents) {
        super(attrs, classes, innerText, innerComponents);
    }

    update() {
        const divComponent = document.getElementById(this.attrs.id);

        if (!divComponent) {
            return;
        }

        super.update();

        divComponent.innerHTML = '';

        this.innerComponents.forEach((innerComponent) => {
            divComponent.innerHTML += innerComponent.render();
        });

        divComponent.innerHTML += this.innerText;
    }

    render() {
        let divHTMLText = `<div`;

        for (let [key, value] of Object.entries(this.attrs)) {
            divHTMLText += ` ${key}="${value}"`;
        }

        divHTMLText += ` class="${this.classes.join(" ")}">`;

        this.innerComponents.forEach((innerComponent) => {
            divHTMLText += innerComponent.render();
        });

        return divHTMLText + `${this.innerText}</div>`;
    }
}

export default DivComponent;
