import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-file-uploader",
  templateUrl: "./file-uploader.component.html",
  styleUrls: ["./file-uploader.component.scss"],
})
export class FileUploaderComponent implements OnInit {
  fileName: string = "";
  @Output() imageSource = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  onFileDropped($event: Array<any>) {
    this.fileName = URL.createObjectURL($event[0]);
    this.imageSource.emit(this.fileName);
  }

  onFileChange($event: Event) {
    this.handleFileUpload($event);
    this.imageSource.emit(this.fileName);
  }

  handleFileUpload(e: Event) {
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;
    this.fileName = URL.createObjectURL(files[0]);
  }
}
