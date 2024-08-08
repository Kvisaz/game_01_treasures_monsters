export interface PreloadTaskLoaderPlugin extends Phaser.Loader.LoaderPlugin {
  asyncTask(task: Promise<void>): any;
}

/**
 *  файл для исполнения async task в preload
 *  к примеру для обращений к Api
 */
export class PreloadTask extends Phaser.Loader.File {
  static FILE_TYPE = 'asyncTask';
  static taskCounter = 0;

  private readonly task: Promise<void>;

  constructor(loader: Phaser.Loader.LoaderPlugin, task: Promise<void>) {
    const fileConfig: Phaser.Types.Loader.FileConfig = {
      type: PreloadTask.FILE_TYPE,
      key: `await_${PreloadTask.taskCounter++}`,
    };
    super(loader, fileConfig);
    this.task = task;
  }

  /**
   * Called by the Loader, starts the actual file downloading.
   * During the load the methods onLoad, onError and onProgress are called, based on the XHR events.
   * You shouldn't normally call this method directly, it's meant to be invoked by the Loader.
   */
  async load() {
    try {
      await this.task;
      this.onLoad();
    } catch (e) {
      this.onError();
    }
  }

  onLoad(xhr?: XMLHttpRequest, event?: ProgressEvent) {
    this.loader?.nextFile(this, true);
  }

  onError(xhr?: XMLHttpRequest, event?: ProgressEvent) {
    this.loader?.nextFile(this, false);
  }

  /**
   * use in scene preload only
   * @param scene
   * @param task
   */
  static add(scene: Phaser.Scene, task: Promise<any>) {
    scene.load.addFile(new PreloadTask(scene.load, task));
  }

  static isRegistered = false;
  /**
   * Функция добавляет к стандартному Phaser.Loader метод svgInline
   * чтобы использовать
   * load.asyncTask(task: Promise<void>)
   */
  static registerInPhaserLoader() {
    if (PreloadTask.isRegistered) return;
    Phaser.Loader.FileTypesManager.register(
      PreloadTask.FILE_TYPE,
      function (this: Phaser.Loader.LoaderPlugin, task: Promise<void>) {
        this.addFile(new PreloadTask(this, task));
        return this;
      },
    );
    PreloadTask.isRegistered = true;
  }
}

export class PreloadTaskPlugin extends Phaser.Plugins.BasePlugin {
  static NAME = 'PreloadTaskPlugin';
  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);
    pluginManager.registerFileType(PreloadTask.FILE_TYPE, () => {});
  }
}
