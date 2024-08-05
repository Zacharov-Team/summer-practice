import "./SignIn.scss";
import DivComponent from "../DummyComponents/DivComponent";
import HasInnerTextComponent from "../DummyComponents/HasInnerTextComponent";
import NoneInnerTextComponent from "../DummyComponents/NoneInnerTextComponent";

class SignInView {
    #mainEventBus;
    #localEventBus;

    constructor(mainEventBus, localEventBus) {
        this.#mainEventBus = mainEventBus;
        this.#localEventBus = localEventBus;

        this.#mainEventBus.addEventListener(
            "clickedRenderSignInPage",
            this.render.bind(this)
        );
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
                placeholder: "Имя",
                type: "text",
            },
            ["sign-in-form__input"]
        );

        const passInput = new NoneInnerTextComponent(
            "input",
            {
                id: "password-input",
                placeholder: "Пароль",
                type: "password",
            },
            ["sign-in-form__input"]
        );

        const signInButton = new HasInnerTextComponent(
            "button",
            { id: "sign-in-form-button" },
            ["sign-in-form__button"],
            "Войти"
        );

        const signInDiv = document.createElement("div");
        signInDiv.setAttribute("id", "sign-in-page");
        signInDiv.classList.add("sign-in-page");
        signInDiv.innerHTML =
            new DivComponent({ id: "sign-in-form" }, ["sign-in-form"], "", [
                mailInput,
                passInput,
                signInButton,
            ]).render() +
            new DivComponent({}, ["sign-in-go-to-register"], "", [
                divRegister,
            ]).render();

        document.body.appendChild(signInDiv);

        const usernameInput = document.getElementById(mailInput.getAttr("id"));
        const passwordInput = document.getElementById(passInput.getAttr("id"));

        signInButton.addListeners([
            {
                event: "click",
                func: () => {
                    this.#localEventBus.emit("tryToSignIn", {
                        username: usernameInput.value,
                        password: passwordInput.value,
                    });
                },
            },
        ]);
    }
}

export default SignInView;
