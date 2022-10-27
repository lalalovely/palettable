import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-file-uploader",
  templateUrl: "./file-uploader.component.html",
  styleUrls: ["./file-uploader.component.scss"],
})
export class FileUploaderComponent implements OnInit {
  @Output() imageSource = new EventEmitter<string>();

  private MAX_FILE_SIZE_BYTES = 5000000;

  hasError: boolean = false;
  error: string = "";

  constructor() {}

  ngOnInit(): void {}

  onFileDropped($event: Array<any>) {
    const fileName = URL.createObjectURL($event[0]);
    this.imageSource.emit(fileName);
  }

  onFileChange($event: Event) {
    this.handleFileUpload($event);
  }

  handleFileUpload(e: Event) {
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;

    const newFile = files[0];

    if (newFile.size > this.MAX_FILE_SIZE_BYTES) {
      this.hasError = true;
      this.error = "The photo you uploaded is too large!";
    } else {
      const fileName = URL.createObjectURL(files[0]);
      this.imageSource.emit(fileName);
    }
  }

  tryAgain() {
    this.hasError = false;
    this.error = "";
  }
}
