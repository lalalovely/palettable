import { Directive, EventEmitter, HostListener, Output } from "@angular/core";

@Directive({
  selector: "[appCanvasClick]",
})
export class CanvasClickDirective {
  @Output() clickEvent = new EventEmitter<any>();

  constructor() {}

  @HostListener("mousedown", ["$event"])
  onMouseDown(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();

    // const rect = canvas.getBoundingClientRect();
    // const x = e.clientX - rect.left;
    // const y = e.clientY - rect.top;

    // console.log("FILE OVER");
    this.clickEvent.emit(evt);
  }
}
