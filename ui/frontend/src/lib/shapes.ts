import type { OrbShape } from "@/components/ParticleOrb";

/** Product id to the particle shape that stands for it, on the orb and in the hero chips. */
export const productShapes: Record<string, OrbShape> = {
  astra: "sphere",
  yantra: "torus",
  digitalTwin: "helix",
  dineastra: "spiral",
  dravya: "cube",
};
