import { Injectable } from "@angular/core";
import { isEqual } from "lodash";
import { IPalette } from "src/app/interfaces/palette";
import { IPixel } from "src/app/interfaces/pixel";

@Injectable({
  providedIn: "root",
})
export class PaletteGeneratorService {
  private K = 8; // Number of clusters

  constructor() {}

  public generatePalette(imageData: ImageData) {
    let palette: IPalette[] = [];
    if (imageData) {
      const pixels = this.buildPixelArray(imageData);
      const colors = this.quantizeByKMeans(pixels, this.K);
      colors.map((pixel) => {
        const r = Math.floor(pixel.red);
        const g = Math.floor(pixel.green);
        const b = Math.floor(pixel.blue);
        palette.push({
          hex: this.rgbToHex(r, g, b),
          rgb: `rgb(${r}, ${g}, ${b})`,
        });
      });
    }
    return palette;
  }

  // Color quantization is done using k-means algorithm
  private quantizeByKMeans(dataset: IPixel[], k: number) {
    if (k === undefined) k = Math.min(3, dataset.length);
    // Use a seeded random number generator instead of Math.random(),
    // so that k-means always produces the same centroids for the same
    // input.
    let rngSeed = 0;
    const random = function () {
      rngSeed = (rngSeed * 9301 + 49297) % 233280;
      return rngSeed / 233280;
    };

    // Choose initial centroids randomly.
    let centroids: IPixel[] = [];
    for (let i = 0; i < k; ++i) {
      const idx = Math.floor(random() * dataset.length);
      centroids.push(dataset[idx]);
    }
    while (true) {
      console.log("processing...");
      // 'clusters' is an array of arrays. each sub-array corresponds to
      // a cluster, and has the points in that cluster.
      let clusters = [];
      for (let i = 0; i < k; ++i) {
        clusters.push([] as IPixel[]);
      }

      for (let i = 0; i < dataset.length; ++i) {
        const point = dataset[i];
        const nearestCentroid = this.nearestNeighbor(point, centroids);
        clusters[nearestCentroid].push(point);
      }

      let converged = true;
      for (let i = 0; i < k; ++i) {
        let cluster = clusters[i];
        let centroidI: IPixel;
        if (cluster.length > 0) {
          const centroid = this.centroid(cluster);
          centroidI = {
            red: centroid[0],
            green: centroid[1],
            blue: centroid[2],
            alpha: centroid[3],
          };
        } else {
          // For an empty cluster, set a random point as the centroid.
          const idx = Math.floor(random() * dataset.length);
          centroidI = dataset[idx];
        }
        converged = converged && isEqual(centroidI, centroids[i]);
        centroids[i] = centroidI;
      }
      if (converged) break;
    }
    return centroids;
  }

  private nearestNeighbor(point: IPixel, neighbors: IPixel[]) {
    let bestDistance = Infinity; // Squared distance
    let bestIndex = -1;
    for (let i = 0; i < neighbors.length; ++i) {
      const neighbor = neighbors[i];
      const flatNeighbor = Object.values(neighbor);
      let dist = 0;

      const flatPoint = Object.values(point);
      for (var j = 0; j < flatPoint.length; ++j) {
        dist += Math.pow(flatPoint[j] - flatNeighbor[j], 2);
      }
      if (dist < bestDistance) {
        bestDistance = dist;
        bestIndex = i;
      }
    }
    return bestIndex;
  }

  // Returns the centroid of a dataset.
  private centroid(dataset: IPixel[]) {
    if (dataset.length === 0) return [];

    // Calculate running means.
    let runningCentroid = [];

    const flatDataset = Object.values(dataset[0]);
    for (let i = 0; i < flatDataset.length; ++i) {
      runningCentroid.push(0);
    }

    for (let i = 0; i < dataset.length; ++i) {
      const point = Object.values(dataset[i]);

      for (let j = 0; j < point.length; ++j) {
        runningCentroid[j] += (point[j] - runningCentroid[j]) / (i + 1);
      }
    }
    return runningCentroid;
  }

  private buildPixelArray(imageData: ImageData) {
    const data = imageData.data;

    console.log(data);
    let pixels: IPixel[] = [];

    for (let i = 0; i < data.length; i += 4) {
      const rgb = {
        red: data[i],
        green: data[i + 1],
        blue: data[i + 2],
        alpha: data[i + 3],
      };

      pixels.push(rgb);
    }

    return pixels;
  }

  private rgbToHex(r: number, g: number, b: number) {
    return (
      "#" +
      this.componentToHex(r) +
      this.componentToHex(g) +
      this.componentToHex(b)
    );
  }

  private componentToHex(c: number) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
}
