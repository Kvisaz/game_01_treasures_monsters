import { delay } from "./delay";

export interface InlineSvgProps {
  key: string;
  src: string;
  scale?: number;
  width?: number;
  height?: number;
}

export interface InlineSvgLoaderPlugin extends Phaser.Loader.LoaderPlugin {
  svgInline(props: InlineSvgProps): any;
}

/**
 * inline Svg file для загрузчика Phaser
 * после загрузки нет разницы межды inline и обычным svg
 */
export class InlineSvgImageFile extends Phaser.Loader.File {
  src: string;
  cache: Phaser.Textures.TextureManager;
  private readonly props: InlineSvgProps;

  private static isRegistered = false;

  constructor(loader: Phaser.Loader.LoaderPlugin, props: InlineSvgProps) {
    const fileConfig = {
      type: 'image',
      cache: loader.textureManager,
      ...props,
    };
    super(loader, fileConfig);
    this.src = fileConfig.src.trim();
    this.props = props;
    this.cache = loader.textureManager;
  }

  /**
   * Функция добавляет к стандартному Phaser.Loader метод svgInline
   * чтобы использовать
   * load.svgInline(props)
   */

  static registerInPhaserLoader() {
    if (InlineSvgImageFile.isRegistered) return;
    Phaser.Loader.FileTypesManager.register(
      'svgInline',
      function (this: Phaser.Loader.LoaderPlugin, props: InlineSvgProps) {
        this.addFile(new InlineSvgImageFile(this, props));
        return this;
      },
    );
    InlineSvgImageFile.isRegistered = true;
  }

  /**
   * Called by the Loader, starts the actual file downloading.
   * During the load the methods onLoad, onError and onProgress are called, based on the XHR events.
   */
  load() {
    if (this.state === Phaser.Loader.FILE_POPULATED) {
      //  Can happen for example in a JSONFile if they've provided a JSON object instead of a URL
      this.loader.nextFile(this, true);
    } else {
      this.state = Phaser.Loader.FILE_LOADING;
      this.loader.nextFile(this, true);
    }
  }

  onLoad() {
    this.loader?.nextFile(this, true);
  }

  /**
   * Called automatically by Loader.nextFile.
   * This method controls what extra work this File does with its loaded data.
   *
   * @method Phaser.Loader.FileTypes.SVGFile#onProcess
   * @since 3.7.0
   */
  async onProcess() {
    this.state = Phaser.Loader.FILE_PROCESSING;
    try {
      this.onSvgProcess(this.src);
    } catch (e) {
      this.onProcessError();
    }
  }

  onSvgProcess(svgSrc: string) {
    this.state = Phaser.Loader.FILE_PROCESSING;

    let svg = [svgSrc];
    let { width, height, scale } = this.props;

    resize: if ((width && height) || scale) {
      let xml = null;
      let parser = new DOMParser();
      xml = parser.parseFromString(svgSrc, 'text/xml');
      let svgXML = xml.getElementsByTagName('svg')[0];

      let viewBox = svgXML.getAttribute('viewBox');
      let hasViewBox = viewBox != null;
      let svgWidth = parseFloat(svgXML.getAttribute('width') ?? '100');
      let svgHeight = parseFloat(svgXML.getAttribute('height') ?? '100');

      if (!hasViewBox && svgWidth && svgHeight) {
        //  If there's no viewBox attribute, set one
        svgXML.setAttribute('viewBox', '0  0 ' + svgWidth + ' ' + svgHeight);
      } else if (hasViewBox && !svgWidth && !svgHeight) {
        //  Get the w/h from the viewbox
        let viewBoxParts = viewBox!.split(/\s+|,/);

        svgWidth = +viewBoxParts[2];
        svgHeight = +viewBoxParts[3];
      }

      if (scale) {
        if (svgWidth && svgHeight) {
          width = svgWidth * scale;
          height = svgHeight * scale;
        } else {
          break resize;
        }
      }

      if (width && height) {
        svgXML.setAttribute('width', width.toString() + 'px');
        svgXML.setAttribute('height', height.toString() + 'px');
      }

      svg = [new XMLSerializer().serializeToString(svgXML)];
    }

    let blob: Blob;
    try {
      blob = new window.Blob(svg, { type: 'image/svg+xml;charset=utf-8' });
    } catch (e) {
      this.onProcessError();
      return;
    }

    this.data = new Image();

    this.data.crossOrigin = this.crossOrigin;

    let _this = this;
    let retry = false;

    const isInlineBitmap = svgSrc.indexOf('data:image') > -1;
    this.data.onload = async () => {
      const INLINE_BITMAP_DELAY = 300;
      if (isInlineBitmap) {
        // иначе iOS не успеет обработать data:image/png;base64
        await delay(INLINE_BITMAP_DELAY);
      }
      if (!retry) {
        Phaser.Loader.File.revokeObjectURL(this.data);
      }
      this.onProcessComplete();
    };

    this.data.onerror = function () {
      //  Safari 8+ re-try
      if (!retry) {
        retry = true;

        Phaser.Loader.File.revokeObjectURL(_this.data);

        /**
         *  Повторная загрузка в тот же Image (this.data)
         *  не срабатывает - вложенные битмапы не показываются при первой загрузке
         **/
        const altUrl = 'data:image/svg+xml,' + encodeURIComponent(svg.join(''));
        const tmpImage = new Image();
        tmpImage.onload = () => {
          _this.data.src = altUrl;
        };
        tmpImage.src = altUrl;
      } else {
        _this.onProcessError();
      }
    };

    Phaser.Loader.File.createObjectURL(this.data, blob, 'image/svg+xml');
  }

  /**
   * Adds this file to its target cache upon successful loading and processing.
   *
   * @method Phaser.Loader.FileTypes.SVGFile#addToCache
   * @since 3.7.0
   */
  addToCache() {
    this.cache.addImage(this.key, this.data);
    this.pendingDestroy();
  }
}
