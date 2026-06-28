import Image from "next/image";
import { LpCard } from "@/components/ui/lp-card";
import { LpSectionTitle } from "@/components/ui/lp-section-title";
import { LP_ASSETS } from "@/lib/lp/assets";
import { LP_SERVICES } from "@/lib/lp/content";

export function LpServicesSection() {
  return (
    <section id="services" className="scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <LpSectionTitle className="mb-10">Services</LpSectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LP_SERVICES.map((service) => (
            <LpCard key={service.key} className="flex flex-col items-center p-5 text-center sm:flex-row sm:items-start sm:text-left">
              <div className="relative mb-4 h-28 w-28 shrink-0 sm:mb-0 sm:mr-4">
                <Image
                  src={LP_ASSETS.modules[service.key as keyof typeof LP_ASSETS.modules]}
                  alt=""
                  fill
                  sizes="112px"
                  className="object-contain"
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-base font-semibold tracking-wider text-[#e8d5a3]">
                  {service.title}
                </h3>
                <p className="mt-2 text-xs leading-6 text-[#9a8b6a] sm:text-sm">{service.body}</p>
              </div>
            </LpCard>
          ))}
        </div>
      </div>
    </section>
  );
}
