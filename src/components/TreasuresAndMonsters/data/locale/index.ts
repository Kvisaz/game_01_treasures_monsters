import { IBasicCard, ICardTexts } from "../../interfaces";
import { GameTextKey, GameTexts, LocaleLang } from "./types";

export class Locale {
  /** set it to change behavior**/
  static locale: LocaleLang = "en";

  static text(key: GameTextKey): string {
    return GameTexts[this.locale][key] ?? GameTexts.en[key];
  }

  static getCardTexts(card: IBasicCard): ICardTexts {
    /** to do - change text to locale text **/
    return {
      title: card.title,
      description: card.description,
      quote: card.quote
    };
  }
}
