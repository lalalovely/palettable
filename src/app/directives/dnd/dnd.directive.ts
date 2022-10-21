import {
  Directive,
  Output,
  Input,
  EventEmitter,
  HostBinding,
  HostListener,
} from "@angular/core";

@Directive({
  selector: "[appDnd]",
})
export class DndDirective {
  @HostBinding("class.fileover") fileOver: boolean = false;
  @Output() fileDropped = new EventEmitter<any>();

  // Dragover listener
  @HostListener("dragover", ["$event"])
  onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
    console.log("FILE OVER");
  }

  // Dragleave listener
  @HostListener("dragleave", ["$event"])
  public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    console.log("FILE LEAVE");
  }

  // Drop listener
  @HostListener("drop", ["$event"])
  public ondrop(evt: DragEvent) {
    console.log("FILE DROP");
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;

    let files = evt.dataTransfer?.files;
    if (files) {
      if (files.length > 0) {
        this.fileDropped.emit(files);
      }
    }
  }
}
