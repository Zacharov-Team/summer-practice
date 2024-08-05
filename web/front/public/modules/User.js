import { AuthService } from "./APIService";

class User {
    #email;
    #fio;
    #online;

    constructor() {
        this.#online = false;
        this.authService = new AuthService();
    }

    async update(email, password) {
        const response = await this.authService.enterIntoAccount(
            email,
            password
        );

        switch (response.status) {
            case 401:
                return false;
            case 200:
                this.#email = response.user_data,email;
                this.#fio = `${response.user_data.name} ${response.user_data.last_name}`;
                this.#online = true;
                return true;
        }
    }

    setInfo({email, name, last_name}) {
        this.#email = email;
        this.#fio = `${name} ${last_name}`;
        this.#online = true;
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
        this.authService.exitFromAccount();

        return true;
    }
}

export default new User();
