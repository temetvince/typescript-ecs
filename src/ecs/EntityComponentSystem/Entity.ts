import { uuid } from './Utils';

export class Entity {
  private constructor(private readonly id: string) {}

  public static create(): Entity {
    return new Entity(uuid());
  }

  public getId(): string {
    return this.id;
  }

  public toString(): string {
    return this.id;
  }

  public valueOf(): string {
    return this.id;
  }
}

export default Entity;
