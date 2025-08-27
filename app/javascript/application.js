import { Application } from "@hotwired/stimulus";

window.Stimulus = Application.start();

import MessageController from "./controllers/message_controller.js";
Stimulus.register("message", MessageController);
