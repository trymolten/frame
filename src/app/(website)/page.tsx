import { Hero } from "@/modules/marketing/components/hero";
import { FaqSection } from "@/modules/marketing/components/faq-section";
import { ClosingCta } from "@/modules/marketing/components/closing-cta";
import { HowItWorks } from "@/modules/marketing/components/how-it-works";
import { TeamsSection } from "@/modules/marketing/components/teams-section";
import { DevelopersSection } from "@/modules/marketing/components/developers-section";
import { CapabilitiesSection } from "@/modules/marketing/components/capabilities-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <DevelopersSection />
      <TeamsSection />
      <CapabilitiesSection />
      <FaqSection />
      <ClosingCta />
    </>
  );
}
