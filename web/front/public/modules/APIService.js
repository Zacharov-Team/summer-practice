import { API_URL } from "./consts";

export class AuthService {
    baseUrl = `${API_URL}`;

    async enterIntoAccount(username, password) {
        const response = await fetch(this.baseUrl + "login/", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        return data;
    }

    async isAuthenticated() {
        const response = await fetch(this.baseUrl + "login/", {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json();

        return data;
    }

    async exitFromAccount() {
        const response = await fetch(this.baseUrl + "logout/", {
            method: "POST",
            credentials: "include",
        });

        const data = await response.json();

        return data;
    }
}

export class RawDataService {
    baseUrl = `${API_URL}`;

    async getRawData(startTime, endTime) {
        const response = await fetch(
            this.baseUrl +
                `get_initial/?start_date=${startTime}&end_date=${endTime}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        const data = await response.json();

        return data;
    }
}

export class DPService {
    baseUrl = `${API_URL}`;

    async getDataProcessing(startTime, endTime) {
        const response = await fetch(
            this.baseUrl +
                `get_aggregate/?start_date=${startTime}&end_date=${endTime}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        const data = await response.json();

        return data;
    }
}

export class NNPService {
    baseUrl = `${API_URL}`;

    async getHeatMap(startTime, endTime) {
        const response = await fetch(
            this.baseUrl +
                `get_modified/?start_date=${startTime}&end_date=${endTime}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        const data = await response.json();

        return data;
    }

    async calculatePicture(picture) {
        const formData = new FormData();

        formData.append('img', picture);

        const response = await fetch(
            this.baseUrl + 'upload',
            {
                method: "POST",
                credentials: "include",
                body: formData,
            }
        );

        const data = await response.json();

        return data;
    }

    async getInitialPlot(startTime, endTime) {
        const response = await fetch(
            this.baseUrl +
                `get_initial/?start_date=${startTime}&end_date=${endTime}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        const data = await response.json();

        return data;
    }
}