import { GameTextKey, GameTexts, LocaleLang } from "./types";

export class Locale {
  /** set it to change behavior**/
  static locale: LocaleLang = "en";

  static text(key: GameTextKey): string {
    return GameTexts[this.locale][key] ?? GameTexts.en[key];
  }

  /** to do - брать карты по их id?
   * Хранить локали рядом с картами? Да!
   * в конфиг сразу попадают локализованные карты?
   * было бы круто, чтобы конфиг сразу был локализованным
   **/
  // static getCardTexts(card: IBasicCard): ICardTexts {
  //   /** to do - change text to locale text **/
  //   return {
  //     title: card.title,
  //     description: card.description,
  //     quote: card.quote
  //   };
  // }
}
