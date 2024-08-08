import { cssColorToInt } from "../../color";
import { Align } from "../../layout";

interface ITextRectangleComponentProps {
  scene: Phaser.Scene;
  text: string;
  fontSize?: number;
  width?: number;
  height?: number;
  textPaddingX?: number;
  textPaddingY?: number;
}

const defaultSettings = {
  textPaddingX: 48,
  textPaddingY: 48,
  fontSize: 42,
};

export class TextRectangleComponent extends Phaser.GameObjects.Container {
  protected bg: Phaser.GameObjects.Rectangle;
  protected textNode: Phaser.GameObjects.Text;

  constructor(private props: ITextRectangleComponentProps) {
    super(props.scene, 0, 0);

    const { scene, text, fontSize = defaultSettings.fontSize } = props;

    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: "Open Sans",
      fontSize: `${fontSize}px`,
      color: "#ffffff",
    };
    const textNode = new Phaser.GameObjects.Text(scene, 0, 0, text, style);

    const {
      textPaddingX = defaultSettings.textPaddingX,
      textPaddingY = defaultSettings.textPaddingY,
    } = props;
    const textBounds = textNode.getBounds();

    const {
      width = textBounds.width + textPaddingX * 2,
      height = textBounds.height + textPaddingY * 2,
    } = props;

    const rectFillColor = cssColorToInt("#000000");
    const rectStrokeColor = cssColorToInt("#c0bebe");
    const rectangle = new Phaser.GameObjects.Rectangle(
      scene,
      0,
      0,
      width,
      height
    );
    rectangle.setFillStyle(rectFillColor, 0.75);
    rectangle.setStrokeStyle(2, rectStrokeColor);

    new Align(rectangle).center(textNode);
    this.add(rectangle);
    this.add(textNode);

    this.bg = rectangle;
    this.textNode = textNode;
  }

  setText(text: string) {
    this.textNode.setText(text);
    new Align(this.bg).center(this.textNode);
  }

  get inputZone() {
    return this.bg;
  }
}
