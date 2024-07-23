import "./Register.scss";
import DivComponent from "../DummyComponents/DivComponent";
import NoneInnerTextComponent from "../DummyComponents/NoneInnerTextComponent";
import HasInnerTextComponent from "../DummyComponents/HasInnerTextComponent";

class Register {
    #eventBus;

    constructor(eventBus) {
        this.#eventBus = eventBus;

        this.#eventBus.addEventListener("clickedRenderRegisterPage", () => {
            this.render();
        });
    }

    render() {
        if (document.getElementById("register-form")) {
            return;
        }

        while (document.body.childNodes.length > 1) {
            document.body.removeChild(document.body.lastChild);
        }

        const divEnter = new DivComponent(
            { id: "choose-register" },
            ["register-choose-register"],
            "Войти"
        );

        const registerDiv = document.createElement("div");
        registerDiv.setAttribute("id", "register-page");
        registerDiv.classList.add("register-page");
        registerDiv.innerHTML =
            new DivComponent({ id: "register-form" }, ["register-form"], "", [
                new NoneInnerTextComponent(
                    "input",
                    {
                        id: "name-input",
                        placeholder: "ФИО",
                        type: "text",
                    },
                    ["register-form__input"]
                ),
                new NoneInnerTextComponent(
                    "input",
                    {
                        id: "mail-input",
                        placeholder: "Почта",
                        type: "email",
                    },
                    ["register-form__input"]
                ),
                new NoneInnerTextComponent(
                    "input",
                    {
                        id: "password-input",
                        placeholder: "Пароль",
                        type: "password",
                    },
                    ["register-form__input"]
                ),
                new NoneInnerTextComponent(
                    "input",
                    {
                        id: "repeat-password-input",
                        placeholder: "Повторите пароль",
                        type: "password",
                    },
                    ["register-form__input"]
                ),
                new HasInnerTextComponent(
                    "button",
                    { id: "register-form-button" },
                    ["register-form__button"],
                    "Создать"
                ),
            ]).render() +
            new DivComponent({}, ["register-go-to-register"], "", [
                divEnter,
            ]).render();

        document.body.appendChild(registerDiv);

        divEnter.addListeners([
            {
                event: "click",
                func: () => {
                    this.#eventBus.emit("clickedRenderSignInPage");
                },
            },
        ]);
    }
}

export default Register;
