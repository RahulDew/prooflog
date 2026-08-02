import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CTA_FOOTER_CONTENT } from "../../constants/home.constants";
import { Button } from "../ui/Button";

export function HeroCtaBanner() {
  return (
    <section className="py-24 text-center gsap-reveal">
      <div className="card-surface p-12 relative overflow-hidden">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          {CTA_FOOTER_CONTENT.title}
        </h2>
        <p className="text-base max-w-xl mx-auto mb-8 text-muted-adaptive">
          {CTA_FOOTER_CONTENT.description}
        </p>
        <div className="flex justify-center">
          <Button
            as={Link}
            to={CTA_FOOTER_CONTENT.primaryCtaLink}
            variant="primary"
            rightIcon={<ArrowRight size={16} strokeWidth={2} />}
          >
            {CTA_FOOTER_CONTENT.primaryCtaText}
          </Button>
        </div>
      </div>
    </section>
  );
}
