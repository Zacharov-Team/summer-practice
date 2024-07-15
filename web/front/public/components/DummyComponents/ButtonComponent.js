import BaseComponent from "./BaseComponent";

class ButtonComponent extends BaseComponent {
  constructor(attrs, classes, innerText) {
    super(attrs, classes, innerText);
  }

  render() {
    let buttonHTMLText = `<button`;

    for (let [key, value] of Object.entries(this.attrs)) {
      buttonHTMLText += ` ${key}="${value}"`;
    }

    return (
      buttonHTMLText +
      ` class="${this.classes.join(" ")}">${this.innerText}</button>`
    );
  }
}

export default ButtonComponent;
