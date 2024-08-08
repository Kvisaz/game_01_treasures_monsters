import { IPhaserLoaderConfig } from "./interfaces";
import { PreloadTask } from "../PreloadTask";
import { fontLoad } from "../fontLoad";

/**
 * Async версия для загрузки ассетов Phaser
 *
 * когда имеет смысл
 * - когда нужно подгрузить ресурсы и дождаться их окончания
 * вне preload метода Phaser сцены
 *
 * поддерживает
 *  - svg
 *  - images
 *  - fonts из Google и своих стилей (через webfontloader)
 *  - sounds
 *
 * @param config {IPhaserLoaderConfig}
 */
export function asyncPhaserLoad(config: IPhaserLoaderConfig): Promise<void> {
  return new Promise((resolve) => {
    const { onProgress, isLogging } = config;
    const { load } = config.scene;

    const progressCallback = (progress: number) => {
      if (onProgress) onProgress(progress);
      if (isLogging) {
        console.log('asyncPhaserLoad:: progressCallback', progress);
      }
      if (isLogging && progress === 1) {
        console.log('asyncPhaserLoad:: load resolve: queue', load.queue);
      }
    };

    if (onProgress) load.on(Phaser.Loader.Events.PROGRESS, progressCallback);

    load.once(Phaser.Loader.Events.COMPLETE, () => {
      if (onProgress) load.off(Phaser.Loader.Events.PROGRESS, progressCallback);
      resolve();
    });

    load.on(Phaser.Loader.Events.FILE_LOAD_ERROR, (file: Phaser.Loader.File) => {
      if (config.onError) {
        config.onError(file);
      } else {
        console.warn('PhaserLoader file load error: ', file);
      }
    });

    // загружаем ресурсы
    phaserLoad(config);

    load.start();
  });
}

/**
 * Просто загружает ресурсы, стартовать надо самому
 * удобно для встраивания в preload сцены
 * или другие  обычные загрузчики на базе Phaser
 * @param config
 */
export function phaserLoad(config: IPhaserLoaderConfig): void {
  const { scene, zoom, svg, images, fonts, sounds, sprites, promises, jsons } = config;
  const { load, textures, sound, cache } = scene;

  images
    ?.filter((url) => url != null && !textures.exists(url))
    .forEach((url) => load.image(url!, url!));

  svg
    ?.filter((url) => url != null && !textures.exists(url))
    .forEach((url) => load.svg(url!, url!, { scale: zoom }));

  sounds
    ?.filter((url) => url != null && !sound.get(url))
    .forEach((url) => load.audio(url!, `${url}?ext=.mp3`!));

  jsons
      ?.filter((url) => url != null && !cache.json.get(url))
      .forEach((url) => url && load.json(url, url));

  sprites
    ?.filter(({ url }) => url != null && !textures.exists(url))
    ?.forEach(({ url, frameConfig }) => load.spritesheet(url, url, frameConfig));

  if (fonts) {
    PreloadTask.add(scene, fontLoad(fonts));
  }

  if (promises) {
    PreloadTask.add(scene, Promise.all(promises));
  }
}
