import { Application } from "@hotwired/stimulus";

window.Stimulus = Application.start();

const controllers = import.meta.glob("./controllers/*_controller.js", {
  eager: true,
});

for (const path in controllers) {
  const controller = controllers[path].default;
  const name = path
    .split("/")
    .pop()
    .replace("_controller.js", "")
    .replace(/_/g, "-");

  Stimulus.register(name, controller);
}
