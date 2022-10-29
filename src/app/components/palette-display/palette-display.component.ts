import { Component, Input, OnInit } from "@angular/core";
import { IPalette } from "src/app/interfaces/palette";
import { PaletteGeneratorService } from "src/app/services/palette-generator/palette-generator.service";

@Component({
  selector: "app-palette-display",
  templateUrl: "./palette-display.component.html",
  styleUrls: ["./palette-display.component.scss"],
})
export class PaletteDisplayComponent implements OnInit {
  @Input() imageData: ImageData | null = null;
  palette: IPalette[] = [];
  showCopyIcon: boolean = false;
  copyHovered: boolean = false;

  constructor(private paletteGenerator: PaletteGeneratorService) {}

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
          hex: this.paletteGenerator.rgbToHex(r, g, b),
          rgb: `${r}, ${g}, ${b}`,
        });
      }
    }
  }

  copyToClipboard(text: string) {
    console.log(text);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        () => {
          alert("Copied to clipboard");
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      alert("Browser do not support Clipboard API");
    }
  }
}
