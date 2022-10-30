import { Component, Input, OnInit } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { IColor } from "src/app/interfaces/color";
import { PaletteGeneratorService } from "src/app/services/palette-generator/palette-generator.service";

@Component({
  selector: "app-palette-display",
  templateUrl: "./palette-display.component.html",
  styleUrls: ["./palette-display.component.scss"],
})
export class PaletteDisplayComponent implements OnInit {
  @Input() imageData: ImageData | null = null;
  palette: IColor[] = [];
  showCopyIcon: boolean = false;
  hoveredColor: IColor | null = null;
  copyHover: boolean = false;

  constructor(
    private paletteGenerator: PaletteGeneratorService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.imageData) {
      const rgbColors = this.paletteGenerator.generatePalette(this.imageData);

      for (let i = 0; i < rgbColors.length; i++) {
        const rgb = rgbColors[i];
        const r = rgb[0];
        const g = rgb[1];
        const b = rgb[2];

        this.palette.push({
          id: `palette#${i + 1}`,
          hex: this.paletteGenerator.rgbToHex(r, g, b),
          rgb: `${r}, ${g}, ${b}`,
          luminance: 0.2126 * r + 0.7152 * g + 0.0722 * b,
        });
      }
    }
  }

  setHoveredColor(color: IColor | null) {
    this.hoveredColor = color;
  }

  showSnackbar() {
    let config = new MatSnackBarConfig();
    config.duration = 1000;
    this.snackBar.open("Copied!", "", config);
  }

  getColor(luminance: number, hover: boolean) {
    if (hover) {
      return luminance < 128 ? "#ffffff" : "#222222";
    }
    return luminance < 128 ? "#dfdfdf" : "#7d7c83";
  }
}
