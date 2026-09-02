import Image from "next/image";
import Reveal from "./Reveal";
import { Container, Eyebrow } from "./ui";
import { BLUR, type Img } from "@/lib/images";

/**
 * INTERIOR PAGE HERO
 * ----------------------------------------------------------------------------
 * Deliberately short — around 42vh rather than the 62vh the previous build used.
 * An interior page's job is to get the reader to the content, and a half-screen
 * of photograph before the first sentence is a tax on every visit after the
 * first. The homepage hero is the only tall one on the site.
 */
export default function PageHero({
  eyebrow,
  title,
  lead,
  image,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  image: Img;
}) {
  return (
    <section className="relative flex min-h-[42vh] items-end overflow-hidden bg-leaf-900 pt-[var(--header-h)] sm:min-h-[46vh]">
      <div className="absolute inset-0">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR}
          className="object-cover"
        />
        {/* Two scrims: a vertical one for the copy, a short top wash so the
            fixed header stays legible over a bright frame. */}
        <div className="absolute inset-0 bg-gradient-to-t from-leaf-900/88 via-leaf-900/45 to-leaf-900/25" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-leaf-900/55 to-transparent" />
      </div>

      <Container className="relative z-10 pb-12 pt-16 sm:pb-14">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow className="text-brass-300">{eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="t-h1 mt-4 text-paper">{title}</h1>
          </Reveal>
          {lead && (
            <Reveal delay={180}>
              <p className="t-lead mt-4 max-w-xl text-paper/70">{lead}</p>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}
