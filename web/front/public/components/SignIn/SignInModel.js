import { AuthService } from "../../modules/APIService";
import User from "../../modules/User";

class SignInModel {
    #mainEventBus;
    #localEventBus;

    constructor(mainEventBus, localEventBus) {
        this.#mainEventBus = mainEventBus;
        this.#localEventBus = localEventBus;
        this.authService = new AuthService();

        this.#localEventBus.addEventListener(
            "tryToSignIn",
            this.enterIntoAccount.bind(this)
        );
        this.#mainEventBus.addEventListener(
            "checkIsAuthenticated",
            this.checkIsAuthenticated.bind(this)
        );
    }

    async checkIsAuthenticated() {
        const response = await this.authService.isAuthenticated();

        switch (response.status) {
            case 200:
                User.setInfo(response.user_data);
                return true;
        }

        return false;
    }

    async enterIntoAccount({ username, password }) {
        const response = await User.update(username, password);

        if (response) {
            this.#mainEventBus.emit("enteredIntoAccount");
            this.#mainEventBus.emit("clickedRenderRawDataPage");
        } else {
        }
    }
}

export default SignInModel;
