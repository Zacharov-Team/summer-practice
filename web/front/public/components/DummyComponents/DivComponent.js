import BaseComponent from "./BaseComponent";

class DivComponent extends BaseComponent {
  constructor(attrs, classes, innerText, innerComponents) {
    super(attrs, classes, innerText, innerComponents);
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
