import { useScene } from "./internals";
import { center, layout } from "./layout";
import { GameObject } from "./interfaces";

export function layoutInSceneCenter(scene: Phaser.Scene, obj: GameObject) {
  layout(() => {
    useScene(scene);
    center(obj);
  });
}

export function addToSceneCenter(scene: Phaser.Scene, obj: GameObject) {
    layout(() => {
        useScene(scene);
        center(obj);
    });
    scene.add.existing(obj);
}
