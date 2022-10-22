import { Component, Input, OnInit } from "@angular/core";
import { IPalette } from "src/app/interfaces/palette";

@Component({
  selector: "app-palette-display",
  templateUrl: "./palette-display.component.html",
  styleUrls: ["./palette-display.component.scss"],
})
export class PaletteDisplayComponent implements OnInit {
  @Input() palette: IPalette[] = [];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {
    console.log("Palette", this.palette);
  }
}
