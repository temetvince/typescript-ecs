import { Component } from '../EntityComponentSystem/Component';

/**
 * The Boid component is a marker component used to identify entities
 * as boids within the Entity Component System (ECS).
 *
 * Marker components are used to tag entities without adding additional data.
 * This helps systems easily identify and process entities that have specific roles.
 *
 * In this case, the Boid component is used to tag entities that represent boids,
 * which are the individual agents in a boid simulation.
 */
export class Boid extends Component {}
