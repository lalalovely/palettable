import { Component } from "@angular/core";
import { IPalette } from "./interfaces/palette";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "palettable";

  palette: IPalette[] = [];

  loadPalette($event: IPalette[]) {
    this.palette = $event;
    console.log("palette event: ", this.palette);
  }
}
