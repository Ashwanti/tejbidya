import { Arrow, Button, ButtonRow, Container, Eyebrow } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center bg-paper pt-[var(--header-h)]">
      <Container size="narrow" className="py-16 text-center">
        <Eyebrow className="text-brass-600" rule={false}>
          Error 404
        </Eyebrow>
        <h1 className="t-h1 mt-5">This page has steeped away.</h1>
        <p className="t-lead mx-auto mt-4 max-w-md text-ink-soft">
          The page you were after is not here. The tea, thankfully, still is.
        </p>
        <ButtonRow className="mt-8 sm:justify-center">
          <Button href="/teas" variant="primary">
            View the collection
            <Arrow />
          </Button>
          <Button href="/" variant="secondary">
            Back to home
          </Button>
        </ButtonRow>
      </Container>
    </section>
  );
}
