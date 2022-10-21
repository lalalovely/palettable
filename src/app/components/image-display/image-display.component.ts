import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from "@angular/core";

@Component({
  selector: "app-image-display",
  templateUrl: "./image-display.component.html",
  styleUrls: ["./image-display.component.scss"],
})
export class ImageDisplayComponent implements OnInit {
  fileName: string = "";
  headerLabel: string = "Upload an image";
  hasImage: boolean = false;
  image: any;
  canvas: any;
  imageContainer: any;

  constructor() {}

  ngOnInit(): void {
    this.image = new Image();
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.imageContainer = document.getElementsByClassName("image-container");
  }

  loadImage($event: string) {
    this.fileName = $event;
    this.headerLabel = "Image";
    this.hasImage = true;
    this.drawImage();
  }

  drawImage() {
    const image = this.image;
    const canvas = this.canvas;
    const container = this.imageContainer[0];
    image.onload = () => {
      if (canvas) {
        const scale = Math.min(
          container.clientWidth / image.width,
          container.clientHeight / image.height
        );
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
      }
    };
    image.src = this.fileName;
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.drawImage();
  }

  prepareDataset() {
    const ctx = this.canvas.getContext("2d");
    //ctx?.get
  }
}
