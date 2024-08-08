import { Callback } from "./interfaces";

type UpdateFunc = (time: number, dT: number) => void;

export function onUpdate(scene: Phaser.Scene, fn: UpdateFunc) {
  scene.events.on(Phaser.Scenes.Events.UPDATE, fn);
  return () => scene.events.off(Phaser.Scenes.Events.UPDATE, fn);
}

export function onBlur(scene: Phaser.Scene, fn: Callback) {
  scene.game.events.on(Phaser.Core.Events.BLUR, fn);
}

export function onFocus(scene: Phaser.Scene, fn: Callback) {
  scene.game.events.on(Phaser.Core.Events.FOCUS, fn);
}

export function onPause(scene: Phaser.Scene, fn: Callback) {
  scene.game.events.on(Phaser.Core.Events.PAUSE, fn);
}

export function onResume(scene: Phaser.Scene, fn: Callback) {
  scene.game.events.on(Phaser.Core.Events.RESUME, fn);
}
