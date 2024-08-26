import DECK1 from "./deck_treasures_1.json";

const type =  'treasure' as const;

export const treasureCards = {
  treasures_1_fantasy_pack16: DECK1.cards.map(card => ({...card, type})),
}
