import DECK1 from "./deck_treasures_1.json";
import { ITreasureCard } from "../../../interfaces";

const type =  'treasure' as const;

export const treasureCards = {
  treasures_1_fantasy_pack16: DECK1.cards.map(card => ({...card, type})),
}


// проверка что все поля правильные
const typecheck: Record<string, ITreasureCard[]> = { ...treasureCards };
