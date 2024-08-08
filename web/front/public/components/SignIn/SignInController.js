import EventBus from "../../modules/EventBus.js";
import SignInView from "./SignInView.js";
import SignInModel from "./SignInModel.js";

const incomingEvents = ["tryToSignIn", 'incorrectInfo'];

class SignInController {
    constructor(mainEventBus) {
        this.localEventBus = new EventBus(incomingEvents);
        this.signInModel = new SignInModel(mainEventBus, this.localEventBus);
        this.signInView = new SignInView(mainEventBus, this.localEventBus);
    }

    checkIsAuthenticated() {
        return this.signInModel.checkIsAuthenticated();
    }
}

export default SignInController;
