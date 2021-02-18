import { HEIGHT, WIDTH } from '../../config';

export { HEIGHT, WIDTH } from '../../config';
export const STEP = 20;
export const GRID_X = WIDTH / STEP - 1;
export const GRID_Y = HEIGHT / STEP - 1;

export enum Direction {
  LEFT,
  RIGHT,
  UP,
  DOWN,
}
