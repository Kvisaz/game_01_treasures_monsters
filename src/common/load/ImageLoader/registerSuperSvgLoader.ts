import { SuperSvgImageFile } from "./SuperSvgImageFile";

/**
 * Вызвать эту функцию до создания игры
 * и стандартный load.svg сможет загружать картинки растровые (если те туда случайно попадут)
 *
 * при этом будет создаваться дополнительный сетевой запрос на проверку
 * так что в смысле красивой работы - лучше растровые все же грузить отдельно
 */
export function registerSuperSvgLoader() {
  Phaser.Loader.FileTypesManager.register(
    'svg',
    function (
      this: Phaser.Loader.LoaderPlugin,
      key:
        | string
        | Phaser.Types.Loader.FileTypes.SVGFileConfig
        | Phaser.Types.Loader.FileTypes.SVGFileConfig[],
      url?: string,
      svgConfig?: Phaser.Types.Loader.FileTypes.SVGSizeConfig,
      xhrSettings?: Phaser.Types.Loader.XHRSettingsObject,
    ) {
      if (Array.isArray(key)) {
        for (let i = 0; i < key.length; i++) {
          //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
          this.addFile(new SuperSvgImageFile(this, key[i]));
        }
      } else {
        this.addFile(new SuperSvgImageFile(this, key, url, svgConfig, xhrSettings));
      }

      return this;
    },
  );
}
