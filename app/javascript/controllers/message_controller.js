import { Controller } from "@hotwired/stimulus";

export default class MessageController extends Controller {
  hide() {
    this.element.remove();
  }
}
