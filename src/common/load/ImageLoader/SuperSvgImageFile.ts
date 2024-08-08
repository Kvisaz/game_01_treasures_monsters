import { SuperSvgXHRLoaderFabric } from "./SuperSvgXHRLoader";
import { ContentDetector } from "./ContentDetector";
import { delay } from "./delay";

/**
 * Svg file для загрузчика Phaser
 * который может обрабатывать и url растровых изображений
 *  how to use - instead load.svg -
 *  load.addFile(new SuperSvgImageFile(load, jpgUrl, jpgUrl, { scale: zoom }));
 *  load.addFile(new SuperSvgImageFile(load, svgUrl, svgUrl, { scale: zoom }));
 *  load.addFile(new SuperSvgImageFile(load, pngUrl, pngUrl, { scale: zoom }));
 */
export class SuperSvgImageFile extends Phaser.Loader.FileTypes.SVGFile {
  /**
   * Called by the Loader, starts the actual file downloading.
   * During the load the methods onLoad, onError and onProgress are called, based on the XHR events.
   * You shouldn't normally call this method directly, it's meant to be invoked by the Loader.
   *
   * @method Phaser.Loader.File#load
   * @since 3.0.0
   */
  load() {
    if (this.state === Phaser.Loader.FILE_POPULATED) {
      //  Can happen for example in a JSONFile if they've provided a JSON object instead of a URL
      this.loader.nextFile(this, true);
    } else {
      this.state = Phaser.Loader.FILE_LOADING;

      this.src = Phaser.Loader.GetURL(this, this.loader.baseURL);

      if (this.src.indexOf("data:") === 0) {
        console.warn("Local data URIs are not supported: " + this.key);
        return;
      }

      /**
       *   Сначала загружаем как text
       */
      this.xhrLoader = SuperSvgXHRLoaderFabric.buildXHR(
        this,
        this.loader.xhr,
        "text"
      );
      this.xhrLoader.send();

      /**
       *  2. if got bitmap type - reload as image/png
       */
      this.xhrLoader.onreadystatechange = () => {
        const { xhrLoader } = this;
        if (xhrLoader == null) {
          console.warn("xhrLoader==null");
          return;
        }
        const contentType = xhrLoader.getResponseHeader("content-type");
        if (contentType == null) return;
        if (!ContentDetector.isSvg(contentType)) {
          xhrLoader.abort();
          this.xhrLoader = SuperSvgXHRLoaderFabric.buildXHR(
            this,
            this.loader.xhr,
            "blob"
          );
          this.xhrLoader.send();
        }
      };
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
    const { xhrLoader } = this;
    if (xhrLoader == null) {
      console.warn("xhrLoader==null");
      return;
    }
    const contentType = xhrLoader.getResponseHeader("Content-Type");
    if (contentType == null) {
      this.onProcessComplete();
      return;
    }

    const response = xhrLoader.response;

    if (ContentDetector.isSvg(contentType)) {
      try {
        this.onSvgProcess(response);
      } catch (e) {
        console.warn(e);
        this.onProcessError();
      }
    } else {
      console.log("load non svg", this.src);
      this.onNonSvgProcess(response);
    }
  }

  onSvgProcess(svgSrc: string) {
    this.state = Phaser.Loader.FILE_PROCESSING;

    let svg = [svgSrc];
    let width = this.config.width;
    let height = this.config.height;
    let scale = this.config.scale;

    resize: if ((width && height) || scale) {
      let xml = null;
      let parser = new DOMParser();
      xml = parser.parseFromString(svgSrc, "text/xml");
      let svgXML = xml.getElementsByTagName("svg")[0];

      let viewBox = svgXML.getAttribute("viewBox");
      let hasViewBox = viewBox != null;
      let svgWidth = parseFloat(svgXML.getAttribute("width") ?? "100");
      let svgHeight = parseFloat(svgXML.getAttribute("height") ?? "100");

      if (!hasViewBox && svgWidth && svgHeight) {
        //  If there's no viewBox attribute, set one
        svgXML.setAttribute("viewBox", "0  0 " + svgWidth + " " + svgHeight);
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

      svgXML.setAttribute("width", width.toString() + "px");
      svgXML.setAttribute("height", height.toString() + "px");

      svg = [new XMLSerializer().serializeToString(svgXML)];
    }

    let blob: Blob;
    try {
      blob = new window.Blob(svg, { type: "image/svg+xml;charset=utf-8" });
    } catch (e) {
      this.onProcessError();
      return;
    }

    this.data = new Image();

    this.data.crossOrigin = this.crossOrigin;

    let _this = this;
    let retry = false;
    const isInlineBitmap = svgSrc.indexOf("data:image") > -1;

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
        const altUrl = "data:image/svg+xml," + encodeURIComponent(svg.join(""));
        const tmpImage = new Image();
        tmpImage.onload = () => {
          _this.data.src = altUrl;
        };
        tmpImage.src = altUrl;
      } else {
        _this.onProcessError();
      }
    };

    Phaser.Loader.File.createObjectURL(this.data, blob, "image/svg+xml");
  }

  onNonSvgProcess(blob: Blob) {
    this.state = Phaser.Loader.FILE_PROCESSING;

    this.data = new Image();

    this.data.crossOrigin = this.crossOrigin;

    this.data.onload = () => {
      Phaser.Loader.File.revokeObjectURL(this.data);
      this.onProcessComplete();
    };

    this.data.onerror = () => {
      Phaser.Loader.File.revokeObjectURL(this.data);

      this.onProcessError();
    };

    Phaser.Loader.File.createObjectURL(this.data, blob, "image/png");
  }
}
