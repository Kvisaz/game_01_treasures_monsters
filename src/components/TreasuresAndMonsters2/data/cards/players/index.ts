import playerCards01 from "./players_cards_01.json";

const type =  'player' as const;

export const playerCards = {
  players_1_fantasy_pack5: playerCards01.map(card => ({...card, type }))
}
