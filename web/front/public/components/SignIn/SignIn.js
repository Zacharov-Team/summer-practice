import "./SignIn.scss";
import ButtonComponent from "../DummyComponents/ButtonComponent";
import DivComponent from "../DummyComponents/DivComponent";
import InputComponent from "../DummyComponents/InputComponent";

class SignIn {
  render() {
    if (document.getElementById("sign-in-form")) {
      return;
    }

    document.body.innerHTML = new DivComponent(
      { id: "sign-in-page" },
      ["sign-in-page"],
      "",
      [
        new DivComponent({ id: "sign-in-form" }, ["sign-in-form"], "", [
          new InputComponent(
            { id: "mail-input", placeholder: "Почта", type: "email" },
            ["sign-in-form__input"],
          ),
          new InputComponent(
            { id: "password-input", placeholder: "Пароль", type: "password" },
            ["sign-in-form__input"],
          ),
          new ButtonComponent(
            { id: "sign-in-form-button" },
            ["sign-in-form__button"],
            "Войти",
          ),
        ]),
        new DivComponent({}, ["sign-in-go-to-register"], "", [
          new DivComponent(
            { id: "choose-register" },
            ["sign-in-choose-register"],
            "Зарегистрироваться",
          ),
        ]),
      ],
    ).render();
  }
}

export default SignIn;
