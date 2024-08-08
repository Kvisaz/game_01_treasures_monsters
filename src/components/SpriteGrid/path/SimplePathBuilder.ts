import { IPathBuilder, IPoint } from "../interfaces";
import { cssColorToInt, GameObject } from "../../../common";
import { Point } from "../interfaces";

interface IProps {
  scene: Phaser.Scene;
  cellSize: number;
  pathColor?: string;
}

export class SimplePathBuilder implements IPathBuilder {
  private elements: GameObject[] = [];
  private points: Point[] = [];

  constructor(private props: IProps) {}

  draw(points: IPoint[]): GameObject[] {
    const elements = points.map((current, index) => {
      const prev = points[index - 1];
      const next = points[index + 1];
      return this.drawElement(current, prev, next);
    });
    return elements;
  }

  clear() {
    this.elements.forEach((el) => el.destroy());
    this.elements = [];
  }

  drawElement(current: IPoint, prev: IPoint | undefined, next: IPoint | undefined): GameObject {
    const { scene, cellSize, pathColor = "#007028" } = this.props;
    const radius = 0.25 * cellSize;
    const circle = new Phaser.GameObjects.Ellipse(
      scene,
      current.x,
      current.y,
      radius,
      radius,
      cssColorToInt(pathColor)
    );
    scene.add.existing(circle);
    this.elements.push(circle);
    return circle;
  }

  get pathPoints() {
    return this.points;
  }

  get startPoint():IPoint|undefined {
    return this.points[0];
  }

  get targetPoint():IPoint|undefined {
    return this.points[this.points.length - 1];
  }

  get hasPath() {
    return this.elements.length > 0;
  }
}
