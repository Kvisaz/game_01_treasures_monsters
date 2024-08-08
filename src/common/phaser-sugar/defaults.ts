import { IMoveKeys, IPhaserConfig, KeyCodes, TextStyle } from "./interfaces";

const defaultPhaserScaleConfig: Phaser.Types.Core.ScaleConfig = {
  mode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  parent: "game",
  width: 960,
  height: 640,
};

export const defaultPhaserConfig: IPhaserConfig = {
  type: Phaser.AUTO,
  backgroundColor: 0x222222,
  transparent: true,
  scale: defaultPhaserScaleConfig,
  scene: [],
};

export const defaulTextStyle: TextStyle = {
  fontSize: "24px",
  color: "#dedede",
};

export const defaultMoveKeys: IMoveKeys = {
  left: [KeyCodes.LEFT, KeyCodes.A],
  right: [KeyCodes.RIGHT, KeyCodes.D],
  up: [KeyCodes.UP, KeyCodes.W],
  down: [KeyCodes.DOWN, KeyCodes.S],
};
