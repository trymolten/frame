import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "What can Molten build?",
    answer:
      "Web apps and websites: dashboards, landing pages, internal tools and prototypes. Each project is a Next.js app written in TypeScript with Tailwind CSS and shadcn/ui.",
  },
  {
    question: "Do I own the code?",
    answer:
      "Yes. You can read every file Molten writes. Pushing a project to your own GitHub repository is coming soon.",
  },
  {
    question: "Where does my app run?",
    answer:
      "In an isolated sandbox created for your project, so nothing runs on your machine and projects can't see each other.",
  },
  {
    question: "How do credits work?",
    answer:
      "Each message that builds or changes your app uses one credit. The Free plan includes a monthly allowance and Pro includes far more. Credits reset 30 days after you first use them.",
  },
  {
    question: "Can my team use Molten together?",
    answer:
      "Organizations are coming soon: shared projects, admin, member and viewer roles, and credits that belong to the team rather than one person.",
  },
  {
    question: "What happens if a build fails?",
    answer:
      "Molten stops, explains in the chat and marks the project as failed, so you can rephrase and try again.",
  },
];

export function FaqSection() {
  return (
    <section aria-labelledby="faq-heading" className="border-t py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:px-8 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <h2
          id="faq-heading"
          className="text-[34px] leading-[1.1] font-semibold tracking-[-0.03em] sm:text-[48px]"
        >
          Questions, answered.
        </h2>
        <Accordion type="single" collapsible className="border-t">
          {FAQS.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="py-5 text-[17px] font-semibold tracking-[-0.01em] hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-[15px] leading-[1.6] text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
