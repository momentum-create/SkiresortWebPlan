"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { HeroData, ResortMeta } from "@/types/resort";

interface HeroSectionProps {
  meta: ResortMeta;
  hero: HeroData;
}

export function HeroSection({ meta, hero }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative h-[65dvh] min-h-[420px] overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={prefersReducedMotion ? { scale: 1 } : { scale: 1.04 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 12, ease: [0.22, 1, 0.36, 1] }
        }
      >
        <Image
          src={hero.imageUrl}
          alt={hero.imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      <div className="hero-gradient absolute inset-0" aria-hidden />

      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-10 md:pb-14">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
          }
        >
          <p className="mb-3 text-sm font-medium tracking-[0.22em] text-white/80 uppercase">
            {meta.tagline}
          </p>
          <h1 className="font-display hero-editorial max-w-[14em] text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            {hero.overlayLines.map((line) => (
              <span key={line} className="hero-line block">
                {line}
              </span>
            ))}
          </h1>
          <p className="hero-editorial mt-4 max-w-[22em] text-base text-white/85 md:text-lg">
            {hero.descriptionLines.map((line) => (
              <span key={line} className="hero-line block">
                {line}
              </span>
            ))}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
