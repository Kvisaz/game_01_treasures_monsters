import EN_GAME_TEXTS from "./en/en-game-texts.json";

export type LocaleLang = "en";
export type LocaleGameTexts = typeof EN_GAME_TEXTS;
export type GameTextKey = keyof LocaleGameTexts;

export const GameTexts: Record<LocaleLang, LocaleGameTexts> = {
  en: EN_GAME_TEXTS
};
