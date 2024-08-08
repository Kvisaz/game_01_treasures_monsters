import { soundSafePlay } from "../soundSafePlay";

interface IGameObject extends Phaser.GameObjects.GameObject {
  getBounds(): Phaser.Geom.Rectangle;
}

interface IArgs {
  obj: IGameObject;
  soundClick?: string;
  soundOver?: string;
}

export function addClickOverSound({ obj, soundOver, soundClick }: IArgs) {
  obj.setInteractive({
    useHandCursor: true,
  });

  if (soundClick) {
    obj.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
      soundSafePlay(obj.scene, soundClick);
    });
  }

  if (soundOver) {
    obj.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
      soundSafePlay(obj.scene, soundOver);
    });
  }
}


