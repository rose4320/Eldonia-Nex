import Image from "next/image";
import { LpCard } from "@/components/ui/lp-card";
import { LpSectionTitle } from "@/components/ui/lp-section-title";
import { LP_ASSETS } from "@/lib/lp/assets";
import { LP_SERVICES } from "@/lib/lp/content";

export function LpServicesSection() {
  return (
    <section id="services" className="scroll-mt-24 px-3 py-6 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1240px]">
        <LpSectionTitle className="mb-3">Services</LpSectionTitle>
        <p className="mb-5 text-center text-xs leading-6 text-[#9e927d] sm:text-sm">
          {LP_SERVICES.subtitle}
        </p>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {LP_SERVICES.items.map((service) => (
            <LpCard key={service.key} hover className="lp-service-card flex items-start gap-3 p-3.5 sm:p-4">
              <div className="lp-service-card__icon relative h-12 w-12 shrink-0">
                <Image
                  src={LP_ASSETS.modules[service.key as keyof typeof LP_ASSETS.modules]}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-contain"
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-sm font-semibold tracking-wider text-[#f8f1df]">
                  {service.title}
                </h3>
                <p className="mt-1.5 text-[0.72rem] leading-5 text-[#9e927d] sm:text-xs">{service.body}</p>
              </div>
            </LpCard>
          ))}
        </div>
      </div>
    </section>
  );
}


