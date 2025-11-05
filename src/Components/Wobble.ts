import { Component } from '../EntityComponentSystem/Component';

/**
 * The Wobble component stores the properties for the wobble effect,
 * including frequency, amplitude, and phase for both x and y directions.
 */
export class Wobble extends Component {
  private frequencyX: number;
  private frequencyY: number;
  private amplitude: number;
  private phaseX: number;
  private phaseY: number;

  /**
   * Constructs a new Wobble component.
   *
   * @param frequencyX - The frequency of the wobble in the x-direction.
   * @param amplitude - The amplitude of the wobble.
   * @param phaseX - The phase of the wobble in the x-direction.
   * @param phaseY - The phase of the wobble in the y-direction.
   */
  constructor(
    frequencyX: number = 1,
    amplitude: number = 1,
    phaseX: number = 0,
    phaseY: number = 0,
  ) {
    super();
    this.frequencyX = frequencyX;
    this.frequencyY = frequencyX; // Assuming frequencyY is the same as frequencyX for simplicity
    this.amplitude = amplitude;
    this.phaseX = phaseX;
    this.phaseY = phaseY;
  }

  /**
   * Gets the frequency of the wobble in the x-direction.
   * @returns The frequency of the wobble in the x-direction.
   */
  getFrequencyX(): number {
    return this.frequencyX;
  }

  /**
   * Gets the frequency of the wobble in the y-direction.
   * @returns The frequency of the wobble in the y-direction.
   */
  getFrequencyY(): number {
    return this.frequencyY;
  }

  /**
   * Gets the amplitude of the wobble.
   * @returns The amplitude of the wobble.
   */
  getAmplitude(): number {
    return this.amplitude;
  }

  /**
   * Gets the phase of the wobble in the x-direction.
   * @returns The phase of the wobble in the x-direction.
   */
  getPhaseX(): number {
    return this.phaseX;
  }

  /**
   * Gets the phase of the wobble in the y-direction.
   * @returns The phase of the wobble in the y-direction.
   */
  getPhaseY(): number {
    return this.phaseY;
  }
}
