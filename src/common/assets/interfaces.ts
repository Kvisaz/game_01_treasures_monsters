/**
 * Если интерфейсы совпадают с другими компонентами
 * это не повод их сводить в один файл
 *
 * Это декларация текущего модуля
 * она может измениться
 */

export interface IAtlasSpriteSheet {
  url: string;
  key: string;
  frameConfig: { frameWidth: number; frameHeight: number; };
}

export interface IAssetsResources {
  images: string[];
  sprites: IAtlasSpriteSheet[];
  sounds: string[];
  jsons: string[];
}
