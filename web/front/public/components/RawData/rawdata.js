import ButtonComponent from "../DummyComponents/ButtonComponent";
import DivComponent from "../DummyComponents/DivComponent";
import "./rawdata.scss";

class RawData {
  #rawsCount;

  constructor(rawsCount) {
    this.#rawsCount = rawsCount;
  }

  render() {
    if (document.getElementById("rawData")) {
      return;
    }

    const rawsCount = [];

    for (let i = 0; i < this.#rawsCount; ++i) {
      rawsCount.push(new DivComponent({}, ["raw-item"], "", []));
    }

    document.body.innerHTML += new DivComponent(
      { id: "raw-data" },
      ["raw-data"],
      "",
      [new DivComponent({}, ["raw-column"], "", rawsCount)],
    ).render();
  }
}

export default RawData;
