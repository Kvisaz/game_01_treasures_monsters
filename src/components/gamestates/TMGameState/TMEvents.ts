import { StateEvent } from "../../../common";

type Id = number;

const TMEvents = {
  battleStart: new StateEvent<{
    monsterCardId: Id
  }>(),
  battleEnd: new StateEvent<{
    monsterCardId: Id;
    isPlayerWin: boolean;
    title: string;
    description: string;
  }>(),
  gameOver: new StateEvent<{
    isPlayerWin: boolean;
    title: string;
    description: string;
  }>()
} as const;

function unSubscribeAll<T extends Record<string, StateEvent<unknown>>>(events: T) {
  Object.values(events).forEach(e => e.unSubScribeAll());
}

export const useTMEvents = () => {
  const events = TMEvents;
  return {
    events,
    unsubscribeAll: () => {
      console.log('eventsUnsubscribeAll......');
      unSubscribeAll(events as Record<string, StateEvent<unknown>>)
    }
  };
};
