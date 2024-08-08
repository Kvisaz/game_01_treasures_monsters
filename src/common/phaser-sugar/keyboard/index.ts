import { IMoveKeys, KeyCodes } from "../interfaces";

export const defaultMoveKeys: IMoveKeys = {
  left: [KeyCodes.LEFT, KeyCodes.A],
  right: [KeyCodes.RIGHT, KeyCodes.D],
  up: [KeyCodes.UP, KeyCodes.W],
  down: [KeyCodes.DOWN, KeyCodes.S],
};

interface IProps {
  scene: Phaser.Scene;
  keys?: IMoveKeys;
  onLeft: () => void;
  onRight: () => void;
  onUp: () => void;
  onDown: () => void;
  onRelease: () => void;
}

type Direction = keyof IMoveKeys;
type Keys = Record<Direction, Phaser.Input.Keyboard.Key[]>;

export function addWasdKeys({
  keys = defaultMoveKeys,
  onLeft,
  onUp,
  onDown,
  onRight,
  onRelease,
  scene,
}: IProps) {
  const { keyboard } = scene.input;
  if (keyboard == null) {
    console.warn("input==null");
    return;
  }
  keyboard.addKeys(defaultMoveKeys);

  const keyObjects: Keys = {
    left: keys.left.map((key) => keyboard.addKey(key)),
    right: keys.right.map((key) => keyboard.addKey(key)),
    up: keys.up.map((key) => keyboard.addKey(key)),
    down: keys.down.map((key) => keyboard.addKey(key)),
  };

  keyObjects.left.forEach((key) => {
    key.on("up", onRelease);
    key.on("down", onLeft);
  });

  keyObjects.right.forEach((key) => {
    key.on("up", onRelease);
    key.on("down", onRight);
  });

  keyObjects.up.forEach((key) => {
    key.on("up", onRelease);
    key.on("down", onUp);
  });

  keyObjects.down.forEach((key) => {
    key.on("up", onRelease);
    key.on("down", onDown);
  });
}
