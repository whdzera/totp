import { Application } from "@hotwired/stimulus";

window.Stimulus = Application.start();

import TotpController from "./controllers/totp_controller.js";
Stimulus.register("totp", TotpController);

import ThemeController from "./controllers/theme_controller.js";
Stimulus.register("theme", ThemeController);
