import { cssColorToInt } from "../color";

/** @type : Phaser.Types.GameObjects.Graphics.Options **/
export const defaultPhaserDrawStyle = {
  lineStyle: { width: 2, color: cssColorToInt("#00ff00"), alpha: 1 },
  fillStyle: { color: cssColorToInt("#00ff00"), alpha: 1 },
};
