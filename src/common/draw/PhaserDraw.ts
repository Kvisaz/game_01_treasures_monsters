import { ILineStyle, IPoint, IPointStyle } from "./interfaces";
import { defaultPhaserDrawStyle } from "./constants";

export class PhaserDraw {
  private graphics: Phaser.GameObjects.Graphics;

  constructor(private readonly scene: Phaser.Scene) {
    this.scene = scene;
    this.graphics = this.scene.add.graphics({ ...defaultPhaserDrawStyle });
  }

  resetFillStyle() {
    this.graphics.fillStyle(
      defaultPhaserDrawStyle.fillStyle.color,
      defaultPhaserDrawStyle.fillStyle.alpha
    );
  }

  resetLineStyle() {
    this.graphics.lineStyle(
      defaultPhaserDrawStyle.lineStyle.width,
      defaultPhaserDrawStyle.lineStyle.color
    );
  }

  destroy() {
    this.graphics.destroy(true);
  }

  clear() {
    this.graphics.clear(); // Очистка предыдущих рисунков
  }

  line(points: IPoint[], style?: ILineStyle): void {
    if (points.length < 2) {
      console.warn("PhaserDraw : need 2 points for line");
      return;
    }

    const { graphics } = this;
    if (style) graphics.lineStyle(style.width, style.color, style.alpha);
    else this.resetLineStyle();

    graphics.beginPath(); // Начало нового пути

    // Перемещаем "перо" в начальную точку
    graphics.moveTo(points[0].x, points[0].y);

    // Рисуем линии к каждой следующей точке
    for (let i = 1; i < points.length; i++) {
      graphics.lineTo(points[i].x, points[i].y);
    }

    graphics.strokePath(); // Применяем стиль и рисуем линию
  }

  points(points: IPoint[], style?: IPointStyle): void {
    if (style) {
      this.graphics.fillStyle(style.color, style.alpha);
    } else {
      this.resetFillStyle();
    }
    const radius = style?.radius ?? 5;
    points.forEach((point) => {
      this.graphics.fillCircle(point.x, point.y, radius); // Рисуем круглые точки радиусом 5 пикселей
    });
  }
}
