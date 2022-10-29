import { Component } from "@angular/core";
import { IPalette } from "./interfaces/palette";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "palettable";
  image: ImageData | null = null;
  toReset: boolean = false;

  getImage($event: ImageData) {
    this.image = $event;
    this.toReset = false;
  }

  reset() {
    this.image = null;
    this.toReset = true;
  }
}
