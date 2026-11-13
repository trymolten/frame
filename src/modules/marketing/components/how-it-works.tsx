const STEPS = [
  {
    title: "Describe it",
    body: "Say what you want in plain words. Add as much or as little detail as you like.",
  },
  {
    title: "Molten builds it",
    body: "An agent writes the code in an isolated cloud sandbox, installs what it needs and starts the app.",
  },
  {
    title: "Shape it",
    body: "Use the live preview, read every file, and keep asking for changes. Every reply saves a version.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="scroll-mt-20 border-t py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <h2
          id="how-it-works-heading"
          className="max-w-2xl text-[34px] leading-[1.1] font-semibold tracking-[-0.03em] text-balance sm:text-[48px]"
        >
          Three steps. No setup.
        </h2>
        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, index) => (
            <li key={step.title} className="border-t pt-6">
              <span className="text-[13px] font-semibold text-brand tabular-nums">
                {index + 1}
              </span>
              <h3 className="mt-3 text-[21px] font-semibold tracking-[-0.02em]">
                {step.title}
              </h3>
              <p className="mt-2 max-w-sm text-[17px] leading-[1.5] text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
