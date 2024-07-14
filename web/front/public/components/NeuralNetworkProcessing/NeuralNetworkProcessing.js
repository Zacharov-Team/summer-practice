import "./NeuralNetworkProcessing.scss";
import DivComponent from "../DummyComponents/DivComponent";
import ImageComponent from "../DummyComponents/ImageComponent";

class NeuralNetworkProcessing {
  #nnpCount;

  constructor(nnpCount) {
    this.#nnpCount = nnpCount;
  }

  render() {
    if (document.getElementById("nnp")) {
      return;
    }

    document.getElementById("raw-data")?.remove();

    const nnpCount = [];

    for (let i = 0; i < this.#nnpCount; ++i) {
      nnpCount.push(new DivComponent({}, ["nnp-item"], "", []));
    }

    document.body.innerHTML += new DivComponent({ id: "nnp" }, ["nnp"], "", [
      new DivComponent(
        { id: "nnp-first-column" },
        ["nnp-left-column"],
        "",
        nnpCount,
      ),
      new DivComponent({}, ["nnp-right-column"], "", [
        new ImageComponent({ src: "dist/static/nnp_ad.webp" }, [
          "nnp__ad-image",
        ]),
      ]),
    ]).render();
  }
}

export default NeuralNetworkProcessing;
