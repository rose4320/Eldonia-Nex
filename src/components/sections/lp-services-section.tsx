import Image from "next/image";
import { LpCard } from "@/components/ui/lp-card";
import { LpSectionTitle } from "@/components/ui/lp-section-title";
import { LP_ASSETS } from "@/lib/lp/assets";
import { LP_SERVICES } from "@/lib/lp/content";

export function LpServicesSection() {
  return (
    <section id="services" className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <LpSectionTitle className="mb-4">Services</LpSectionTitle>
        <p className="mb-10 text-center text-sm leading-7 text-[#9e927d] sm:text-base">
          {LP_SERVICES.subtitle}
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LP_SERVICES.items.map((service) => (
            <LpCard key={service.key} hover className="flex items-start gap-4 p-4 sm:p-5">
              <div className="relative h-14 w-14 shrink-0">
                <Image
                  src={LP_ASSETS.modules[service.key as keyof typeof LP_ASSETS.modules]}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-contain"
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-base font-semibold tracking-wider text-[#f8f1df]">
                  {service.title}
                </h3>
                <p className="mt-2 text-xs leading-6 text-[#9e927d] sm:text-sm">{service.body}</p>
              </div>
            </LpCard>
          ))}
        </div>
      </div>
    </section>
  );
}
