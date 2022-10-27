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

  getImage($event: ImageData) {
    this.image = $event;
    console.log("HERE", this.image);
  }
}
