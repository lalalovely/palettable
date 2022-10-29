import { IPalette } from "src/app/interfaces/palette";
import { IPixel } from "src/app/interfaces/pixel";

export class PaletteGeneratorService {
  private K = 6; // Number of clusters
  rawPalette: IPixel[] = [];
  palette: IPalette[] = [];

  constructor() {}

  public generatePalette(imageData: ImageData) {
    let rgbColors = [];
    if (imageData) {
      let dataset = this.prepareDataset(imageData);
      const kMeansCentroids = this.kmeans(dataset, this.K);
      const finalColors = [];
      for (let i = 0; i < kMeansCentroids.length; i++) {
        const centroid = kMeansCentroids[i];
        let color = [];
        color.push(Math.round(centroid[0]));
        color.push(Math.round(centroid[1]));
        color.push(Math.round(centroid[2]));
        finalColors.push(color);
      }
      rgbColors = this.sortRgbArray(finalColors);
    }
    return rgbColors;
  }

  private prepareDataset(imageData: ImageData) {
    let dataset: number[][] = [];
    const rawImageData = imageData.data;
    for (let i = 0; i < rawImageData.length; i += 4) {
      let rgb: number[] = [];
      rgb.push(rawImageData[i]);
      rgb.push(rawImageData[i + 1]);
      rgb.push(rawImageData[i + 2]);
      dataset.push(rgb);
    }

    return dataset;
  }

  private kmeans(dataset: number[][], k: number) {
    if (k === undefined) {
      k = Math.min(3, dataset.length);
    }

    let rngSeed = 0;
    const random = function () {
      rngSeed = (rngSeed * 9301 + 49297) % 233280;
      return rngSeed / 233280;
    };

    // Initial centroids
    let centroids: number[][] = [];
    for (let i = 0; i < k; ++i) {
      const index = Math.floor(random() * dataset.length);
      centroids.push(dataset[index]);
    }

    while (true) {
      let clusters: any = [];

      for (let i = 0; i < k; ++i) {
        const initialValue: number[][] = [];
        clusters.push(initialValue);
      }

      for (let i = 0; i < dataset.length; ++i) {
        const point = dataset[i];
        const nearestCentroid = this.findNearestNeighbor(point, centroids);
        clusters[nearestCentroid].push(point);
      }

      let converged = true;

      for (let i = 0; i < k; ++i) {
        let cluster = clusters[i];
        let newCentroid: number[] = [];
        if (cluster.length > 0) {
          newCentroid = this.getCentroid(cluster);
        } else {
          // For an empty cluster, set a random point as the centroid.
          const idx = Math.floor(random() * dataset.length);
          newCentroid = dataset[idx];
        }

        converged = converged && this.isArraysEqual(newCentroid, centroids[i]);
        centroids[i] = newCentroid;
      }
      if (converged) break;
    }

    return centroids;
  }

  private initializeClusters(
    dataset: number[][],
    k: number,
    centroids: number[][]
  ) {
    console.log("CENTROIDSSSS: ", centroids);
  }

  private findNearestNeighbor(point: number[], neighbors: number[][]) {
    let bestDistance = Infinity; // Squared distance
    let bestIndex = -1;
    for (let i = 0; i < neighbors.length; ++i) {
      const neighbor = neighbors[i];
      let dist = 0;
      for (var j = 0; j < point.length; ++j) {
        dist += Math.pow(point[j] - neighbor[j], 2);
      }
      if (dist < bestDistance) {
        bestDistance = dist;
        bestIndex = i;
      }
    }
    return bestIndex;
  }

  private getCentroid(dataset: number[][]) {
    if (dataset.length === 0) return [];

    // Calculate running means.
    let runningCentroid = [];
    for (let i = 0; i < dataset.length; ++i) {
      runningCentroid.push(0);
    }

    for (let i = 0; i < dataset.length; ++i) {
      const point = dataset[i];
      for (let j = 0; j < point.length; ++j) {
        runningCentroid[j] += (point[j] - runningCentroid[j]) / (i + 1);
      }
    }
    return runningCentroid;
  }

  private isArraysEqual(a: number[], b: number[]) {
    return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index])
    );
  }

  public rgbToHex(r: number, g: number, b: number) {
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

  private rgbToHsl(c: any) {
    const r = c[0] / 255,
      g = c[1] / 255,
      b = c[2] / 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s,
      l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }
    return new Array(h * 360, s * 100, l * 100);
  }

  private sortRgbArray(rgbArray: any) {
    return rgbArray
      .map((c: any, i: number) => {
        return { color: this.rgbToHsl(c), index: i };
      })
      .sort((color1: any, color2: any) => {
        return color1.color[0] - color2.color[0];
      })
      .map((data: any) => {
        return rgbArray[data.index];
      });
  }
}
