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
    this.clickEvent.emit(evt);
  }
}
