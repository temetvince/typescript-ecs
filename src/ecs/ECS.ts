import { EntityComponentSystem } from './EntityComponentSystem/EntityComponentSystem';

let instance: EntityComponentSystem | null = null;

/**
 * Retrieves the singleton instance of the EntityComponentSystem.
 * If the instance does not already exist, it initializes a new one.
 *
 * @returns {EntityComponentSystem} The singleton instance of the EntityComponentSystem.
 */
export function getECS(): EntityComponentSystem {
  if (!instance) {
    instance = new EntityComponentSystem();
  }
  return instance;
}
