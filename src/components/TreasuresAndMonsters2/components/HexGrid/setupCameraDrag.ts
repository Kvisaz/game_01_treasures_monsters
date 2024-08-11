import { GameObject } from "../../../../common";

interface IProps {
  scene: Phaser.Scene;
  gameObject: GameObject;
  // Порог начала драггинга в пикселях
  dragThreshold?: number;
  // Порог начала драггинга в ms
  dragTimeThreshold?: number;
}

/**
 *  Сделать драггинг камеры по границам объекта
 **/
export function setupCameraDrag({ scene, gameObject, dragThreshold = 15, dragTimeThreshold = 500 }: IProps) {
  const camera = scene.cameras.main;
  const prevX = camera.scrollX;
  const prevY = camera.scrollX;
  const resetCamera = () => {
    camera.scrollX = prevX;
    camera.scrollY = prevY;
  };
  let isPointerDown = false;
  let isDragging = false;
  let startX: number, startY: number;
  let pointerStartX: number, pointerStartY: number;
  let pointerDownTime: number;

  const containerBounds = gameObject.getBounds();

  const isInputAllowed = () => !isDragging;

  scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
    isPointerDown = true;
    startX = camera.scrollX;
    startY = camera.scrollY;
    pointerStartX = pointer.x;
    pointerStartY = pointer.y;
    pointerDownTime = Date.now();
  });

  /** Обработчик мышки следит за относительным сдвигом сам
   *  но начинает это делать только после нажатия
   *  и после того как срабатывает dragTimeThreshold или dragThreshold
   **/
  scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
    if (!isPointerDown) return;

    if (!isDragging) {
      const distanceMoved = Phaser.Math.Distance.Between(
        pointerStartX, pointerStartY, pointer.x, pointer.y
      );
      const isDistanceThreshold = distanceMoved >= dragThreshold;
      const dragTime = Date.now() - pointerDownTime;
      const isTimeThreshold = dragTime >= dragTimeThreshold;

      if (isDistanceThreshold && isTimeThreshold) {
        isDragging = true;
      }
    }


    if (isDragging) {
      const deltaX: number = pointerStartX - pointer.x + startX;
      const deltaY: number = pointerStartY - pointer.y + startY;

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
    isDragging = false;
    isPointerDown = false;
  });

  return { resetCamera, isInputAllowed };
}
