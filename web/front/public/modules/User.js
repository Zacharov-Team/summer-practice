import { AuthService } from "./APIService";

class User {
    #email;
    #fio;
    #online;

    constructor() {
        this.#online = false;
    }

    update(email, password) {
        const response = (new AuthService).enterIntoAccount(email, password);

        if (!response) {
            return false;
        }

        this.#email = response.email;
        this.#fio = response.fio;
        this.#online = true;

        return true;
    }

    getFio() {
        if (!this.#online) {
            return null;
        }

        return this.#fio;
    }

    exitFromAccount() {
        if (!this.#online) {
            return false;
        }

        this.#online = false;

        return true;
    }

}

export default new User();