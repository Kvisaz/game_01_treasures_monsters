const WebFont = require('webfontloader');
import { WebFontOptions } from "./interfaces";

/**
 *   Promise обертка над загрузчиком шрифтов от Google
 *   можно грузить из Google Fonts или локальные шрифты
 *
 *   пример
 *   await loadFont({
      google: { // грузим из Google
        families: ['Marmelad', 'Macondo'],
      },
      custom: { // грузим из локального style.css, шрифты должны быть описаны и лежать рядом
        families: ['St Transmission ExtraBold', 'Open Sans ExtraBold', 'Open Sans Regular', 'Lato'],
        urls: ['./style.css']
      }
    });
 *
 *  https://github.com/typekit/webfontloader
 *  "@types/webfontloader": "1.6.34"
 *  "webfontloader": "1.6.28",
 */
export function fontLoad(config: WebFontOptions): Promise<void> {
  return new Promise((resolve) => {
    WebFont.load({
      ...config,
      active: resolve,
    });
  });
}
