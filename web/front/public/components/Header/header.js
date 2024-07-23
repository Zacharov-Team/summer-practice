import "./header.scss";
import DivComponent from "../DummyComponents/DivComponent";
import HasInnerTextComponent from "../DummyComponents/HasInnerTextComponent";
import User from "../../modules/User";

class Header {
    #eventBus;

    constructor(eventBus) {
        this.#eventBus = eventBus;
    }

    render() {
        if (document.getElementById("header")) {
            return;
        }

        const rawDataButton = new HasInnerTextComponent(
            "button",
            { type: "button", id: "raw-data-button" },
            ["process-types__button", "process-types__button_activated"],
            "Raw Data (RD)"
        );

        const dpButton = new HasInnerTextComponent(
            "button",
            { type: "button", id: "dp-button" },
            ["process-types__button"],
            "Data Preprocessing (DP)"
        );

        const nnpButton = new HasInnerTextComponent(
            "button",
            { type: "button", id: "nnp-button" },
            ["process-types__button"],
            "Neural Network Processing (NNP)"
        );

        const signInButton = new HasInnerTextComponent(
            "button",
            { type: "button", id: "sign-in-header-button" },
            ["authorize-types__button-sign-in"],
            "Sign in"
        );

        const registerButton = new HasInnerTextComponent(
            "button",
            { type: "button", id: "register-header-button" },
            ["authorize-types__button-register"],
            "Register"
        );

        document.body.innerHTML = new DivComponent(
            { id: "header" },
            ["header"],
            "",
            [
                new DivComponent({}, ["process-types"], "", [
                    rawDataButton,
                    dpButton,
                    nnpButton,
                ]),
                new DivComponent({id: 'authorize-types'}, ["authorize-types"], "", [
                    signInButton,
                    registerButton,
                ]),
            ]
        ).render();

        rawDataButton.addListeners([
            {
                event: "click",
                func: () => {
                    this.#eventBus.emit("clickedRenderRawDataPage");
                    dpButton.toggleClass("process-types__button_activated", -1);
                    nnpButton.toggleClass(
                        "process-types__button_activated",
                        -1
                    );
                    rawDataButton.toggleClass(
                        "process-types__button_activated",
                        1
                    );
                    dpButton.update();
                    nnpButton.update();
                    rawDataButton.update();
                },
            },
        ]);

        dpButton.addListeners([
            {
                event: "click",
                func: () => {
                    this.#eventBus.emit("clickedRenderDataProcessingPage");
                    dpButton.toggleClass("process-types__button_activated", 1);
                    nnpButton.toggleClass(
                        "process-types__button_activated",
                        -1
                    );
                    rawDataButton.toggleClass(
                        "process-types__button_activated",
                        -1
                    );
                    dpButton.update();
                    nnpButton.update();
                    rawDataButton.update();
                },
            },
        ]);

        nnpButton.addListeners([
            {
                event: "click",
                func: () => {
                    this.#eventBus.emit("clickedRenderNNPPage");
                    dpButton.toggleClass("process-types__button_activated", -1);
                    nnpButton.toggleClass("process-types__button_activated", 1);
                    rawDataButton.toggleClass(
                        "process-types__button_activated",
                        -1
                    );
                    dpButton.update();
                    nnpButton.update();
                    rawDataButton.update();
                },
            },
        ]);

        signInButton.addListeners([
            {
                event: "click",
                func: () => {
                    this.#eventBus.emit("clickedRenderSignInPage");
                    dpButton.toggleClass("process-types__button_activated", -1);
                    nnpButton.toggleClass(
                        "process-types__button_activated",
                        -1
                    );
                    rawDataButton.toggleClass(
                        "process-types__button_activated",
                        -1
                    );
                    dpButton.update();
                    nnpButton.update();
                    rawDataButton.update();
                },
            },
        ]);

        registerButton.addListeners([
            {
                event: "click",
                func: () => {
                    this.#eventBus.emit("clickedRenderRegisterPage");
                    dpButton.toggleClass("process-types__button_activated", -1);
                    nnpButton.toggleClass(
                        "process-types__button_activated",
                        -1
                    );
                    rawDataButton.toggleClass(
                        "process-types__button_activated",
                        -1
                    );
                    dpButton.update();
                    nnpButton.update();
                    rawDataButton.update();
                },
            },
        ]);
    }

    enteredIntoAccount() {
        const fio = User.getFio();

        if (!fio) {
            return;
        }

        if (document.getElementById('user-profile')) {
            return;
        }

        document.getElementById('authorize-types')?.remove();

        const header = document.getElementById('header');
        const profileDiv = document.createElement('div');
        const exitButton = new HasInnerTextComponent(
            'button',
            {id: 'exit-button'},
            ['user-profile__exit-button'],
            'Выйти',
        );

        profileDiv.setAttribute('id', 'user-profile');
        profileDiv.classList.add('user-profile');
        profileDiv.innerHTML = new DivComponent(
            {id: 'user-fio'}, 
            ['user-fio'],
            fio,
        ).render() + exitButton.render();

        header.appendChild(profileDiv);

        exitButton.addListeners([{
            event: 'click',
            func: () => {
                User.exitFromAccount();
                this.exitedFromAccount();
                this.#eventBus.emit('clickedRenderSignInPage');
            },
        }]);
    }

    exitedFromAccount() {
        if (User.fio()) {
            return;
        }

        if (document.getElementById('authorize-types')) {
            return;
        }

        document.getElementById('user-profile')?.remove();

        const signInButton = new HasInnerTextComponent(
            "button",
            { type: "button", id: "sign-in-header-button" },
            ["authorize-types__button-sign-in"],
            "Sign in"
        );

        const registerButton = new HasInnerTextComponent(
            "button",
            { type: "button", id: "register-header-button" },
            ["authorize-types__button-register"],
            "Register"
        );

        const authorizeTypes = document.createElement('div');
        authorizeTypes.setAttribute('id', 'authorize-types');
        authorizeTypes.classList.add('authorize-types');
        authorizeTypes.innerHTML = signInButton.render() + registerButton.render();

        const header = document.getElementById('header');
        header.appendChild(authorizeTypes);

        signInButton.addListeners([
            {
                event: "click",
                func: () => {
                    this.#eventBus.emit("clickedRenderSignInPage");

                    document.querySelectorAll('.process-types__button').forEach((button) => {
                        button.classList.remove("process-types__button_activated");
                    });
                },
            },
        ]);

        registerButton.addListeners([
            {
                event: "click",
                func: () => {
                    this.#eventBus.emit("clickedRenderRegisterPage");
                    
                    document.querySelectorAll('.process-types__button').forEach((button) => {
                        button.classList.remove("process-types__button_activated");
                    });
                },
            },
        ]);
    }
}

export default Header;
