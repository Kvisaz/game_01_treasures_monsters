import { IAssetsResources, IAtlasSpriteSheet } from "./interfaces";

/**
 * AssetManager for preloading registering
 * Use assetManager.addSome to collect info in component
 * Use getAssets to boot
 */
export class AssetManager {
  private resources: IAssetsResources = {
    images: [], sounds: [], sprites: [], jsons: []
  };

  addImage(url: string | string[]) {
    getUrlArray(url).forEach(url => this.resources.images.push(url));
  }


  addSound(url: string | string[]) {
    getUrlArray(url).forEach(url => this.resources.sounds.push(url));
  }


  addSpriteSheet(sheet: IAtlasSpriteSheet | IAtlasSpriteSheet[]) {
    getUrlArray(sheet).forEach(sheet => this.resources.sprites.push(sheet));
  }

  getResources(): IAssetsResources {
    return this.resources;
  }
}


function getUrlArray<T>(url: T | T[]): T[] {
  return Array.isArray(url) ? url : [url];
}

export const assetManager = new AssetManager();
