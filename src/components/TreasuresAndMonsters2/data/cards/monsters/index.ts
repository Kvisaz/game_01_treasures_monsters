import DECK1 from "./deck_monsters_1.json";
import DECK2 from "./deck_monsters_2.json";

// в json не записываются типы, в будущем возможно будем сразу записывать
const type = "monster" as const;

// определено как константа чтобы поля подставлялись
export const monsterCards = {
  monsters_1_fantasy_pack8: DECK1.cards.map((card) => ({ ...card, type })),
  monsters_2_fantasy_pack8: DECK2.cards.map((card) => ({ ...card, type })),
};
