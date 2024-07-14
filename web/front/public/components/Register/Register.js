import "./Register.scss";
import ButtonComponent from "../DummyComponents/ButtonComponent";
import DivComponent from "../DummyComponents/DivComponent";
import InputComponent from "../DummyComponents/InputComponent";

class Register {
  render() {
    if (document.getElementById("register-form")) {
      return;
    }

    document.body.innerHTML = new DivComponent(
      { id: "register-page" },
      ["register-page"],
      "",
      [
        new DivComponent({ id: "register-form" }, ["register-form"], "", [
          new InputComponent(
            { id: "name-input", placeholder: "ФИО", type: "text" },
            ["register-form__input"],
          ),
          new InputComponent(
            { id: "mail-input", placeholder: "Почта", type: "email" },
            ["register-form__input"],
          ),
          new InputComponent(
            { id: "password-input", placeholder: "Пароль", type: "password" },
            ["register-form__input"],
          ),
          new InputComponent(
            {
              id: "repeat-password-input",
              placeholder: "Повторите пароль",
              type: "password",
            },
            ["register-form__input"],
          ),
          new ButtonComponent(
            { id: "register-form-button" },
            ["register-form__button"],
            "Создать",
          ),
        ]),
        new DivComponent({}, ["register-go-to-register"], "", [
          new DivComponent(
            { id: "choose-register" },
            ["register-choose-register"],
            "Войти",
          ),
        ]),
      ],
    ).render();
  }
}

export default Register;
