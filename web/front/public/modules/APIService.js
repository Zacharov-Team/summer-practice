export class AuthService {
    baseUrl = '/auth/';

    async enterIntoAccount(email, password) {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({email, password}),
        });

        const data = await response.json();

        console.log(data.entered);

        return true;
    }

    async createAnAccount(name, email, password) {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({email, password, name}),
        });

        const data = await response.json();

        console.log(data.created);

        return true;
    }

    async exitFromAccount() {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            credentials: 'include',
        });

        console.log(response);

        return true;
    }
}

export class RawDataService {

}

export class DPService {
    baseUrl = '/auth/';

    async getDataProcessing(startTime, endTime) {
        /*const response = await fetch(this.baseUrl + `?startTime=${startTime}&endTime=${endTime}`, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();

        console.log(data.got);*/

        const tagNames = [];
        
        for (let i = 0; i < 100; ++i ) {
            tagNames.push(i);
        }

        return tagNames;
    }

}