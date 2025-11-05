import { Position } from './Components/Position';
import { Velocity } from './Components/Velocity';
import { Boid } from './Components/Boid';
import { EntityComponentSystem } from './EntityComponentSystem/EntityComponentSystem';
import { Display } from './Systems/Display';
import { Movement } from './Systems/Movement';
import { BoidBehavior } from './Systems/BoidBehavior';
import { BoundaryCollision } from './Systems/BoundaryCollision';
import { GroupManager } from './Systems/GroupManager';
import { ColorManager } from './Systems/ColorManager';
import { Wobble } from './Components/Wobble';
import { Wobbler } from './Systems/Wobbler';
import { getECS } from './ECS';

const NUMBER_OF_BOIDS = 150;
const WOBBLE_AMPLITUDE = 0.5;

/**
 * Initializes the Entity Component System (ECS) and sets up the game entities and systems.
 *
 * @returns The initialized entity component system.
 */
export const GameSetup = (): EntityComponentSystem => {
  const ecs = getECS();

  // Initialize entities with Position, Velocity, Boid, and Wobble components
  initializeEntities(ecs, NUMBER_OF_BOIDS);

  // Add systems to the ECS in the correct order
  ecs.addSystem(new GroupManager());
  ecs.addSystem(new ColorManager());
  ecs.addSystem(new Wobbler());
  ecs.addSystem(new BoidBehavior());
  ecs.addSystem(new BoundaryCollision());
  ecs.addSystem(new Movement());
  ecs.addSystem(new Display());

  return ecs;
};

/**
 * Initializes a specified number of entities with random Position, Velocity, Boid, and Wobble components.
 *
 * @param ecs - The Entity Component System to which the entities are added.
 * @param count - The number of entities to initialize.
 */
const initializeEntities = (
  ecs: EntityComponentSystem,
  count: number,
): void => {
  for (let i = 0; i < count; i++) {
    const position = getRandomPosition();
    const velocity = getRandomVelocity();
    const wobble = getRandomWobble();

    const entity = ecs.addEntity();
    ecs.addComponent(entity, position);
    ecs.addComponent(entity, velocity);
    ecs.addComponent(entity, new Boid());
    ecs.addComponent(entity, wobble);
  }
};

/**
 * Generates a random position within the window boundaries.
 *
 * @returns A new Position component with random coordinates.
 */
const getRandomPosition = (): Position => {
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;
  return new Position(x, y);
};

/**
 * Generates a random velocity.
 *
 * @returns A new Velocity component with random velocity values.
 */
const getRandomVelocity = (): Velocity => {
  const vx = Math.random() * 2 - 1;
  const vy = Math.random() * 2 - 1;
  return new Velocity(vx, vy);
};

/**
 * Generates a random wobble component.
 *
 * @returns A new Wobble component with random frequency and phase values.
 */
const getRandomWobble = (): Wobble => {
  const frequency = Math.random() * 0.5 + 0.5; // Random frequency for different wobble speeds
  const phaseX = Math.random() * Math.PI * 2;
  const phaseY = Math.random() * Math.PI * 2;
  return new Wobble(frequency, WOBBLE_AMPLITUDE, phaseX, phaseY);
};
