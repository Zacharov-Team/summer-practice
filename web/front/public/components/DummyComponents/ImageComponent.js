import BaseComponent from "./BaseComponent";

class ImageComponent extends BaseComponent {
  constructor(attrs, classes) {
    super(attrs, classes);
  }

  render() {
    let imageHTMLText = `<img`;

    for (let [key, value] of Object.entries(this.attrs)) {
      imageHTMLText += ` ${key}="${value}"`;
    }

    return imageHTMLText + ` class="${this.classes.join(" ")}"/>`;
  }
}

export default ImageComponent;
