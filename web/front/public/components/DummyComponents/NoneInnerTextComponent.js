import BaseComponent from "./BaseComponent";

class NoneInnerTextComponent extends BaseComponent {
    typeComponent;

    constructor(typeComponent, attrs, classes) {
        super(attrs, classes);

        this.typeComponent = typeComponent;
    }

    render() {
        let componentHTMLText = `<${this.typeComponent}`;

        for (let [key, value] of Object.entries(this.attrs)) {
            componentHTMLText += ` ${key}="${value}"`;
        }

        return componentHTMLText + ` class="${this.classes.join(" ")}"/>`;
    }
}

export default NoneInnerTextComponent;
