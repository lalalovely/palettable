import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { CanvasComponent } from "./components/canvas/canvas.component";
import { SafePipe } from "./pipes/safe.pipe";
import { FileUploaderComponent } from "./components/file-uploader/file-uploader.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DndDirective } from "./directives/dnd/dnd.directive";
import { ImageDisplayComponent } from "./components/image-display/image-display.component";
import { PaletteDisplayComponent } from "./components/palette-display/palette-display.component";

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    SafePipe,
    FileUploaderComponent,
    DndDirective,
    ImageDisplayComponent,
    PaletteDisplayComponent,
  ],
  imports: [BrowserModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
