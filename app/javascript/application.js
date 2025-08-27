import { Application } from "@hotwired/stimulus";

const application = Application.start();
window.Stimulus = application;

import TotpController from "./controllers/totp_controller.js";
application.register("totp", TotpController);
import ThemeController from "./controllers/theme_controller.js"
Stimulus.register("theme", ThemeController);
