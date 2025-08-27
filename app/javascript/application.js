import { Application } from "@hotwired/stimulus";

window.Stimulus = Application.start();

import TotpController from "./controllers/totp_controller.js";
application.register("totp", TotpController);
