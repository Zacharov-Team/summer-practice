import "./SignIn.scss";
import DivComponent from "../DummyComponents/DivComponent";
import HasInnerTextComponent from "../DummyComponents/HasInnerTextComponent";
import NoneInnerTextComponent from "../DummyComponents/NoneInnerTextComponent";
import {validateEmail} from '../../modules/validators';

class SignIn {
    #eventBus;

    constructor(eventBus) {
        this.#eventBus = eventBus;

        this.#eventBus.addEventListener("clickedRenderSignInPage", () => {
            this.render();
        });
    }

    render() {
        if (document.getElementById("sign-in-form")) {
            return;
        }

        while (document.body.childNodes.length > 1) {
            document.body.removeChild(document.body.lastChild);
        }

        const divRegister = new DivComponent(
            { id: "choose-register" },
            ["sign-in-choose-register"],
            "Зарегистрироваться"
        );

        const mailInput = new NoneInnerTextComponent(
            "input",
            {
                id: "mail-input",
                placeholder: "Почта",
                type: "email",
            },
            ["sign-in-form__input"]
        );

        const signInDiv = document.createElement("div");
        signInDiv.setAttribute("id", "sign-in-page");
        signInDiv.classList.add("sign-in-page");
        signInDiv.innerHTML =
            new DivComponent({ id: "sign-in-form" }, ["sign-in-form"], "", [
                mailInput,
                new NoneInnerTextComponent(
                    "input",
                    {
                        id: "password-input",
                        placeholder: "Пароль",
                        type: "password",
                    },
                    ["sign-in-form__input"]
                ),
                new HasInnerTextComponent(
                    "button",
                    { id: "sign-in-form-button" },
                    ["sign-in-form__button"],
                    "Войти"
                ),
            ]).render() +
            new DivComponent({}, ["sign-in-go-to-register"], "", [
                divRegister,
            ]).render();

        document.body.appendChild(signInDiv);

        divRegister.addListeners([
            {
                event: "click",
                func: () => {
                    this.#eventBus.emit("clickedRenderRegisterPage");
                },
            },
        ]);

        const emailInput = document.getElementById(mailInput.getAttr('id'));

        mailInput.addListeners([
            {
                event: 'focusout',
                func: () => {
                    if (!validateEmail(emailInput.value)) {
                        alert('mda');
                    }
                },
            }
        ]);
    }
}

export default SignIn;
