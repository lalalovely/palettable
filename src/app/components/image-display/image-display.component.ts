import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

import { PaletteGeneratorService } from "src/app/services/palette-generator/palette-generator.service";

@Component({
  selector: "app-image-display",
  templateUrl: "./image-display.component.html",
  styleUrls: ["./image-display.component.scss"],
})
export class ImageDisplayComponent implements OnInit {
  @Output() imageData = new EventEmitter<ImageData>();
  @Input() toReset: boolean = false;

  private MAX_SIZE = 50000;

  fileName: string = "";
  headerLabel: string = "";
  hasImage: boolean = false;
  image: any;
  canvas: any;
  imageContainer: any;
  context: any;
  pickedColor: string = "";
  hasError: boolean = false;
  error: string = "";

  constructor(
    private paletteGenerator: PaletteGeneratorService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.image = new Image();
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d");
    this.imageContainer = document.getElementsByClassName("image-container");
  }

  ngOnChanges() {
    if (this.toReset) {
      this.reset();
    }
  }

  reset() {
    this.hasImage = false;
    this.headerLabel = "Upload an image";
    this.context?.reset();
  }

  pickColor(event: any) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (this.canvas) {
      const pixel = this.context.getImageData(x, y, 1, 1);
      const data = pixel.data;

      const hex = this.paletteGenerator.rgbToHex(data[0], data[1], data[2]);
      this.pickedColor = hex;
      console.log("COLOR IS: ", hex);
    }
  }

  loadFile($event: string) {
    this.fileName = $event;
    this.loadImage();
  }

  loadImage() {
    this.headerLabel = "Click on the image to select a specific color";
    this.hasImage = true;
    this.drawImage();
    this.getPalette();
  }

  getPalette() {
    let cWidth = this.canvas.width;
    let cHeight = this.canvas.height;
    const size = cWidth * cHeight;

    // Resize image if size is beyond max size
    if (this.MAX_SIZE > 0 && size > this.MAX_SIZE) {
      const ratio = this.canvas.width / this.canvas.height;
      const scaleFactor = Math.sqrt(this.MAX_SIZE / ratio);
      const rescaledW = Math.floor(ratio * scaleFactor);
      const rescaledH = Math.floor(scaleFactor);
      cWidth = rescaledW;
      cHeight = rescaledH;
    }

    // Load image to a temporary canvas
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = cWidth;
    tempCanvas.height = cHeight;

    let imageData: any;
    const image = new Image();
    image.src = this.fileName;
    image.onload = () => {
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx?.drawImage(image, 0, 0, cWidth, cHeight);

      imageData = tempCtx?.getImageData(0, 0, cWidth, cHeight);
      this.imageData.emit(imageData);
    };
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.drawImage();
  }

  // Draws image to the canvas element
  drawImage() {
    const canvas = this.canvas;
    const container = this.imageContainer[0];
    this.image.src = this.fileName;
    this.image.onload = () => {
      if (canvas) {
        // Scale image to fit in its container while keeping its aspect ratio
        const scale = Math.min(
          container.clientWidth / this.image.width,
          container.clientHeight / this.image.height
        );

        canvas.width = this.image.width * scale;
        canvas.height = this.image.height * scale;

        //this.context = canvas.getContext("2d");
        this.context?.clearRect(0, 0, canvas.width, canvas.height);
        this.context?.drawImage(this.image, 0, 0, canvas.width, canvas.height);
      }
    };
  }

  showSnackbar() {
    let config = new MatSnackBarConfig();
    config.duration = 1000;
    this.snackBar.open("Copied!", "", config);
  }
}
