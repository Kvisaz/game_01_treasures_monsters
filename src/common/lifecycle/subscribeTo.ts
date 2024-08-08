import { Callback, GameObject } from "./interfaces";
import { onBeforeObjectDestroy } from "./onBeforeObjectDestroy";

/**
 * @deprecated - не тестировано!
 *
 * Подписать объект на массив отписок
 * в массиве можно вызывать функции подписок, которые возвращают отписчики
 *
 * То есть предполагается что это удобная подписка чего-либо на Phaser
 * с автоматической отпиской если объект разрушается
 */
export function subscribeTo(obj: GameObject, unSubscriptions: Callback[]){
  onBeforeObjectDestroy(obj, ()=>{
    unSubscriptions.forEach(unSub => unSub());
  })
}
