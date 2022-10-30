import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-file-uploader",
  templateUrl: "./file-uploader.component.html",
  styleUrls: ["./file-uploader.component.scss"],
})
export class FileUploaderComponent implements OnInit {
  @Output() imageSource = new EventEmitter<string>();

  private MAX_FILE_SIZE_BYTES = 5000000;
  private VALID_FILE_TYPES = ["image/jpg", "image/png", "image/jpeg"];

  hasError: boolean = false;
  error: string = "";

  constructor() {}

  ngOnInit(): void {}

  onFileDropped($event: Array<any>) {
    this.uploadFile($event[0]);
  }

  onFileChange($event: Event) {
    this.handleFileUpload($event);
  }

  uploadFile(file: File) {
    if (!this.VALID_FILE_TYPES.includes(file.type)) {
      this.hasError = true;
      this.error = "The file you uploaded is not an image!";
    } else if (file.size > this.MAX_FILE_SIZE_BYTES) {
      this.hasError = true;
      this.error = "The photo you uploaded is too large!";
    } else {
      const fileName = URL.createObjectURL(file);
      this.imageSource.emit(fileName);
    }
  }

  handleFileUpload(e: Event) {
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;
    const newFile = files[0];
    this.uploadFile(newFile);
  }

  tryAgain() {
    this.hasError = false;
    this.error = "";
  }
}
