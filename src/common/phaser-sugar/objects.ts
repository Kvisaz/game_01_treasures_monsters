import { getCurrentScene, useScene, useTextStyle } from "./internals";
import { GameObject } from "./interfaces";
import { cssColorToInt } from "../color";
import { addNiceTextStyle, INiceTextStyle } from "./text";

function add<T extends GameObject>(obj: T): T {
  const scene = useScene();
  scene.add.existing(obj);
  return obj;
}

export function textObject(
  text: string,
  niceStyle?: INiceTextStyle
): Phaser.GameObjects.Text {
  const scene = useScene();
  const style = useTextStyle();
  const obj = new Phaser.GameObjects.Text(scene, 0, 0, text, style);
  if (niceStyle) {
    addNiceTextStyle(obj, niceStyle);
  }
  return add(obj);
}

export function image(
  textureKey: string,
  frameName?: string
): Phaser.GameObjects.Image {
  const scene = useScene();
  return add(new Phaser.GameObjects.Image(scene, 0, 0, textureKey, frameName));
}

export function sprite(
  textureKey: string,
  frameName?: string
): Phaser.GameObjects.Sprite {
  const scene = useScene();
  return add(new Phaser.GameObjects.Sprite(scene, 0, 0, textureKey, frameName));
}

export function tileSprite(
  width: number,
  height: number,
  textureKey: string,
  frameName?: string
): Phaser.GameObjects.TileSprite {
  const scene = useScene();
  return add(
    new Phaser.GameObjects.TileSprite(
      scene,
      0,
      0,
      width,
      height,
      textureKey,
      frameName
    )
  );
}

interface IRectProps {
  width: number;
  height: number;
  fillColor: string;
  fillAlpha: number;
  strokeColor?: string;
  strokeAlpha: number;
  strokeWidth: number;
}

export function rect(
  options: Partial<IRectProps> = {}
): Phaser.GameObjects.Rectangle {
  const scene = useScene();
  const props: IRectProps = {
    fillAlpha: 1,
    fillColor: "#5aa867",
    height: 128,
    width: 64,
    strokeAlpha: 1,
    strokeWidth: 2,
    ...options,
  };
  const rect = add(
    new Phaser.GameObjects.Rectangle(
      scene,
      0,
      0,
      props.width,
      props.height,
      cssColorToInt(props.fillColor),
      props.fillAlpha
    )
  );

  if (props.strokeColor) {
    rect.setStrokeStyle(
      props.strokeWidth,
      cssColorToInt(props.strokeColor),
      props.strokeAlpha
    );
  }

  return rect;
}

interface ICircleProps {
  radius: number;
  fillColor: string;
  fillAlpha: number;
  strokeColor?: string;
  strokeAlpha: number;
  strokeWidth: number;
}

export function circle(
  options: Partial<ICircleProps> = {}
): Phaser.GameObjects.Rectangle {
  const scene = useScene();
  const props: ICircleProps = {
    fillAlpha: 1,
    fillColor: "#5aa867",
    radius: 64,
    strokeAlpha: 1,
    strokeWidth: 2,
    ...options,
  };
  const rect = add(
    new Phaser.GameObjects.Ellipse(
      scene,
      0,
      0,
      props.radius * 2,
      props.radius * 2,
      cssColorToInt(props.fillColor),
      props.fillAlpha
    )
  );

  if (props.strokeColor) {
    rect.setStrokeStyle(
      props.strokeWidth,
      cssColorToInt(props.strokeColor),
      props.strokeAlpha
    );
  }

  return rect;
}

export function container(
  objects?: GameObject[]
): Phaser.GameObjects.Container {
  const scene = getCurrentScene();
  return new Phaser.GameObjects.Container(scene, 0, 0, objects);
}
