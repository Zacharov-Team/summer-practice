import BaseComponent from "./BaseComponent";

class InputComponent extends BaseComponent {
  constructor(attrs, classes) {
    super(attrs, classes);
  }

  render() {
    let inputHTMLText = `<input`;

    for (let [key, value] of Object.entries(this.attrs)) {
      inputHTMLText += ` ${key}="${value}"`;
    }

    return inputHTMLText + ` class="${this.classes.join(" ")}"/>`;
  }
}

export default InputComponent;
