export interface ICollideRectangle {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface IRectangleCollideTest {
  obj1: ICollideRectangle;
  obj2: ICollideRectangle;
  expected: boolean;
}
