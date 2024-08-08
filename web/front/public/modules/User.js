import { AuthService } from "./APIService";

class User {
    #email;
    #username;
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
            case 500:
            case 401:
                return false;
            case 200:
                this.#email = response.user_data.email;
                this.#username = response.user_data.username;
                this.#online = true;
                return true;
        }
    }

    setInfo({email, username}) {
        this.#email = email;
        this.#username = username;
        this.#online = true;
    }

    getUsername() {
        if (!this.#online) {
            return null;
        }

        return this.#username;
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
