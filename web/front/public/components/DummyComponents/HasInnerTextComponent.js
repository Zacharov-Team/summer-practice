import BaseComponent from "./BaseComponent";

class HasInnerTextComponent extends BaseComponent {
    typeComponent;

    constructor(typeComponent, attrs, classes, innerText) {
        super(attrs, classes, innerText);

        this.typeComponent = typeComponent;
    }

    render() {
        let componentHTMLText = `<${this.typeComponent}`;

        for (let [key, value] of Object.entries(this.attrs)) {
            componentHTMLText += ` ${key}="${value}"`;
        }

        return (
            componentHTMLText +
            ` class="${this.classes.join(" ")}">${this.innerText}</${this.typeComponent}>`
        );
    }
}

export default HasInnerTextComponent;
