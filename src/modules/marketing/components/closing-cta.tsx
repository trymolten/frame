import { AuthCta } from "@/modules/marketing/components/auth-cta";
import { BrandMark } from "@/modules/marketing/components/brand-mark";

export function ClosingCta() {
  return (
    <section aria-labelledby="cta-heading" className="border-t py-24 md:py-32">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 text-center md:px-8">
        <BrandMark size={56} />
        <h2
          id="cta-heading"
          className="mt-8 text-[34px] leading-[1.1] font-semibold tracking-[-0.03em] text-balance sm:text-[56px]"
        >
          Your next app is one sentence away.
        </h2>
        <div className="mt-9">
          <AuthCta />
        </div>
      </div>
    </section>
  );
}
