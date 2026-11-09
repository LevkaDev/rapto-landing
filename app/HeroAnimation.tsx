"use client";

import { useEffect, useState } from "react";
import { ClayzoPlayer } from "@clayzo/webgl-player/react";
import { readClayzoBundle, type LoadedClayzo } from "@clayzo/animation/bundle";

export function HeroAnimation() {
  const [bundle, setBundle] = useState<LoadedClayzo | null>(null);

  useEffect(() => {
    fetch("/hero.clayzo")
      .then((response) => response.arrayBuffer())
      .then((bytes) => readClayzoBundle(new Uint8Array(bytes)))
      .then(setBundle);
  }, []);

  return (
    <ClayzoPlayer
      document={bundle?.document ?? null}
      options={{ loaders: bundle ?? undefined, loop: true }}
      poster="/hero.poster.webp"
      posterTick={1380}
      reducedMotion="ignore"
      label="Messy windows snapping into Rapto layouts"
      className="w-full"
    />
  );
}
