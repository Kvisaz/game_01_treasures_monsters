import { IGameState, IMonsterCard, IMonsterState, ITreasureCard, ITreasureState } from "../../../interfaces";

export const getTreasuresWithoutMonsters = (state: IGameState): ITreasureState[] => Object.values(state.treasures);
export const getMonsters = (state: IGameState): IMonsterState[] => Object.values(state.monsters);
export const getCollectedMonsters = (state: IGameState): number => state.player.inventory.length;


/** Экран результата показывает 3 звездочки
 - одна за то что прошел в портал (то есть собрал portalTreasurePrice )
 - две за то что собрал
 portalTreasurePrice + (treasuresTotal-portalTreasurePrice)/2 сокровищ
 - три за то что собрал treasuresTotal сокровищ
 - заодно и за то что убил всех чудовищ
 **/
export const getRewardStarAmount = (state: IGameState): number => {
  const collectedTreasures = getCollectedMonsters(state);
  const totalTreasures = getTreasuresWithoutMonsters(state).length;
  const portalPrice = state.finishMapPortal.price;
  if (collectedTreasures === totalTreasures) return 3;
  if (collectedTreasures >= portalPrice + (totalTreasures - portalPrice) / 2) return 2;
  if (collectedTreasures === portalPrice) return 1;
  return 0;
};


export const isEndMapPortalCanBeOpened = (state: IGameState): boolean => {
  const collectedTreasures = getCollectedMonsters(state);
  const portalPrice = state.finishMapPortal.price;
  return collectedTreasures >= portalPrice;
};


/** при сборе любого сокровища, мутирует стейт **/
export const collectTreasure = (treasureCard: ITreasureCard, state: IGameState) => {
  const treasureState = state.treasures[treasureCard.id];
  if (treasureState == null) {
    console.warn("no state for card", treasureCard);
    return;
  }
  const playerState = state.player;

  treasureState.isCollected = true;

  playerState.inventory.push(treasureCard);
  playerState.statistics.treasures.grabbed.push(treasureCard);
};

/** атака игрока вычисляется как сумма атак артефактов **/
export const getPlayerAttack = (state: IGameState): number => {
  return state.player.inventory
    .reduce((acc, card) => card.bonuses.attack != null ? acc + card.bonuses.attack : 0, 0);
};

export const getPlayerHealth = (state: IGameState): number => {
  return state.player.inventory
    .reduce((acc, card) => card.bonuses.health != null ? acc + card.bonuses.health : 0, 0);
};

/** проверка боя, у кого атака сильнее тот и выигрывает **/
export const isPlayerWin = (monsterCard: IMonsterCard, state: IGameState): boolean => {
  const monsterState = state.monsters[monsterCard.id];
  if (monsterState == null) {
    console.warn("no state for card", monsterCard);
    return false;
  }

  return getPlayerAttack(state) > monsterState.card.attack;
};

/** при победе над монстром, мутирует стейт **/
export const killMonster = (monsterCard: IMonsterCard, state: IGameState) => {
  const monsterState = state.monsters[monsterCard.id];
  if (monsterState == null) {
    console.warn("no state for card", monsterCard);
    return;
  }
  const playerState = state.player;

  monsterState.isAlive = false;

  playerState.statistics.monsters.killed.push(monsterCard);

  monsterState.treasures.forEach(treasureCard => collectTreasure(treasureCard, state));
};

/** при проигрыше над монстром, мутирует стейт **/
export const loseToMonster = (monsterCard: IMonsterCard, state: IGameState) => {
  const monsterState = state.monsters[monsterCard.id];
  if (monsterState == null) {
    console.warn("no state for card", monsterCard);
    return;
  }

  state.player.health--;
};

/** проверка геймувера смерти **/
export const isPlayerDead = (state: IGameState): boolean => {
  return state.player.health <= 0;
};
