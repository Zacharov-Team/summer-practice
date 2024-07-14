import "./header.scss";
import DivComponent from "../DummyComponents/DivComponent";
import ButtonComponent from "../DummyComponents/ButtonComponent";

class Header {
  render() {
    if (document.getElementById("header")) {
      return;
    }

    document.body.innerHTML = new DivComponent(
      { id: "header" },
      ["header"],
      "",
      [
        new DivComponent({}, ["process-types"], "", [
          new ButtonComponent(
            { type: "button" },
            ["process-types__button", "process-types__button_activated"],
            "Raw Data (RD)",
          ),
          new ButtonComponent(
            { type: "button" },
            ["process-types__button"],
            "Data Preprocessing (DP)",
          ),
          new ButtonComponent(
            { type: "button" },
            ["process-types__button"],
            "Neural Network Processing (NNP)",
          ),
        ]),
        new DivComponent({}, ["authorize-types"], "", [
          new ButtonComponent(
            { type: "button" },
            ["authorize-types__button-sign-in"],
            "Sign in",
          ),
          new ButtonComponent(
            { type: "button" },
            ["authorize-types__button-register"],
            "Register",
          ),
        ]),
      ],
    ).render();
  }
}

export default Header;
