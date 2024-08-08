/**
 * если contentType!=responseType - установить наиболее подходящий
 * responseType
 */
export class SuperSvgXHRLoaderFabric {
  static buildXHR(
    file: Phaser.Loader.File,
    globalXHRSettings: Phaser.Types.Loader.XHRSettingsObject,
    responseType: XMLHttpRequestResponseType,
  ) {
    const config = MergeXHRSettings(globalXHRSettings, file.xhrSettings);
    config.async = config.async ?? true;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', file.src, config.async ?? true, config.user, config.password);

    xhr.responseType = responseType;
    xhr.timeout = config.timeout ?? 100000;

    if (config.headers) {
      for (const key in config.headers) {
        xhr.setRequestHeader(key, config.headers[key]);
      }
    }

    if (config.header && config.headerValue) {
      xhr.setRequestHeader(config.header, config.headerValue);
    }

    if (config.requestedWith) {
      xhr.setRequestHeader('X-Requested-With', config.requestedWith);
    }

    if (config.overrideMimeType) {
      xhr.overrideMimeType(config.overrideMimeType);
    }

    if (config.withCredentials) {
      xhr.withCredentials = true;
    }

    // After a successful request, the xhr.response property will contain the requested data as a DOMString, ArrayBuffer, Blob, or Document (depending on what was set for responseType.)

    xhr.onload = file.onLoad.bind(file, xhr);
    xhr.onerror = file.onError.bind(file, xhr);
    xhr.onprogress = file.onProgress.bind(file);

    return xhr;
  }
}

function MergeXHRSettings(global: XHRSettings, local: XHRSettings): XHRSettings {
  const output: XHRSettings = global === undefined ? Phaser.Loader.XHRSettings() : { ...global };
  if (local) {
    for (let setting in local) {
      if (local.hasOwnProperty(setting)) {
        output[setting] = local[setting];
      }
    }
  }
  return output;
}

interface XHRSettings extends Phaser.Types.Loader.XHRSettingsObject {
  headers?: {
    [key: string]: any;
  };

  [key: string]: any;
}
