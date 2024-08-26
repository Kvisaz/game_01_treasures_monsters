// определено как константа чтобы поля подставлялись
import DUNGEONS1 from "./dungeons_cards_01.json";

// в json не записываются типы, в будущем возможно будем сразу записывать
const type = "dungeon" as const;

export const dungeonsCards = {
  dungeons_1_fantasy_1: DUNGEONS1.map((card) => ({ ...card, type })),
};
