import { GameObject } from "../../../../common";


interface IProps {
  scene: Phaser.Scene;
  container: Phaser.GameObjects.Container;
  clickables?: GameObject[];
}

/**
 *  Сделать драггинг камеры по границам контейнера с объектами
 *  по объектам можно кликать
 **/
export function setupCameraDrag({ scene, container, clickables }: IProps): () => void {
  const camera = scene.cameras.main;
  const prevX = camera.scrollX;
  const prevY = camera.scrollX;
  const resetCamera = () => {
    camera.scrollX = prevX;
    camera.scrollY = prevY;
  };
  let isDragging: boolean = false;
  let startX: number, startY: number;
  const containerBounds = container.getBounds();

  scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
    isDragging = true;
    startX = pointer.x + camera.scrollX;
    startY = pointer.y + camera.scrollY;
    console.log("pointerdown");
  });

  scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
    console.log("pointermove");
    if (isDragging) {
      const deltaX: number = startX - pointer.x;
      const deltaY: number = startY - pointer.y;

      // Ограничиваем движение камеры размерами контейнера
      camera.scrollX = Phaser.Math.Clamp(
        deltaX,
        0,
        Math.max(0, containerBounds.width - camera.width)
      );
      camera.scrollY = Phaser.Math.Clamp(
        deltaY,
        0,
        Math.max(0, containerBounds.height - camera.height)
      );
    }
  });

  scene.input.on("pointerup", () => {
    console.log("pointerup");
    isDragging = false;
  });

  // Добавляем обработку кликов по ячейкам
  clickables?.forEach((child: GameObject) => {
    child.setInteractive();
    child.on("pointerdown", (pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData) => {
      if (!isDragging) {
        // Обработка клика по ячейке
        console.log("Клик по ячейке:", child);
        // Здесь можно добавить вашу логику обработки клика
      }
      // event.stopPropagation(); // Предотвращаем распространение события
    });
  });

  return resetCamera;
}
