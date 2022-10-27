import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { CanvasComponent } from "./components/canvas/canvas.component";
import { FileUploaderComponent } from "./components/file-uploader/file-uploader.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DndDirective } from "./directives/dnd/dnd.directive";
import { ImageDisplayComponent } from "./components/image-display/image-display.component";
import { PaletteDisplayComponent } from "./components/palette-display/palette-display.component";
import { CanvasClickDirective } from "./directives/canvas-click.directive";
import { PaletteGeneratorService } from "./services/palette-generator/palette-generator.service";

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    FileUploaderComponent,
    DndDirective,
    ImageDisplayComponent,
    PaletteDisplayComponent,
    CanvasClickDirective,
  ],
  imports: [BrowserModule, BrowserAnimationsModule],
  providers: [PaletteGeneratorService],
  bootstrap: [AppComponent],
})
export class AppModule {}
