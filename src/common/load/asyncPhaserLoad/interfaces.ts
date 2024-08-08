import { WebFontOptions } from "../fontLoad";

export interface IPhaserLoaderConfig {
  scene: Phaser.Scene;
  zoom: number;
  onError?: IPhaserLoaderErrorCallback;
  onProgress?: IPhaserLoaderProgressCallback;
  svg?: AnyString[];
  images?: AnyString[];
  sprites?: ISpriteSheet[];
  sounds?: AnyString[];
  jsons?: AnyString[];
  fonts?: WebFontOptions;
  promises?: Promise<any>[];
  isLogging?: boolean;
}

export interface ISpriteSheet {
  url: string;
  frameConfig: { frameWidth: number; frameHeight: number; };
}

export interface IPhaserLoaderProgressCallback {
  (progress: number): void;
}

export interface IPhaserLoaderErrorCallback {
  (file: Phaser.Loader.File): void;
}

type AnyString = string | undefined | null;
