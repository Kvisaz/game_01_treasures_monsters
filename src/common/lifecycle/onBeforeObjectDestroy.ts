import { Callback, GameObject } from "./interfaces";

/**
 * do some BEFORE object instance will being destroyed.

 * Проверено, работает на игровых объектах фазер
 * при запуске их destroy
 */
export function onBeforeObjectDestroy(obj: GameObject, fn: Callback): void {
  const oldDestroy = obj.destroy.bind(obj);
  obj.destroy = () => {
    fn();
    oldDestroy();
  };
}

/**
 * @deprecated
 * !Вниамние эта функция работает плохо
 * проще ставить в destroy
 * do some when object instance is being destroyed.
 * https://newdocs.phaser.io/docs/3.55.2/Phaser.GameObjects.Events.DESTROY
 */
/*
function onObjectDestroy(obj: Phaser.GameObjects.GameObject, fn: Callback): void {
  obj.once('destroy', fn);
}*/
