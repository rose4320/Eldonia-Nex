import Image from "next/image";
import Link from "next/link";
import { LpCard } from "@/components/ui/lp-card";
import { LpSectionTitle } from "@/components/ui/lp-section-title";
import { getLpContent } from "@/lib/i18n/content/lp-messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { LP_ASSETS, LP_IMAGE_SIZE } from "@/lib/lp/assets";

function moduleIconSize(key: string) {
  return key === "lab" ? LP_IMAGE_SIZE.labIcon : LP_IMAGE_SIZE.moduleIcon;
}

export async function LpServicesSection() {
  const locale = await getUiLocale();
  const { LP_SERVICES } = getLpContent(locale);

  return (
    <section id="services" className="scroll-mt-24 px-3 py-6 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1240px]">
        <LpSectionTitle className="mb-3">{LP_SERVICES.title}</LpSectionTitle>
        <p className="mb-6 text-center text-xs leading-6 text-[#9e927d] sm:text-sm">
          {LP_SERVICES.subtitle}
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LP_SERVICES.items.map((service) => {
            const iconSize = moduleIconSize(service.key);
            return (
              <LpCard
                key={service.key}
                hover
                className="lp-service-card flex flex-col overflow-hidden"
              >
                <div className="relative h-36 w-full sm:h-40">
                  <Image
                    src={LP_ASSETS.serviceBg[service.key as keyof typeof LP_ASSETS.serviceBg]}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    className="object-cover object-center"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-b from-[#050e1e]/10 via-transparent to-[#050e1e]"
                    aria-hidden
                  />
                </div>

                <div className="relative -mt-9 flex flex-1 flex-col items-center px-5 pb-5 text-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center">
                    <Image
                      src={LP_ASSETS.modules[service.key as keyof typeof LP_ASSETS.modules]}
                      alt=""
                      width={iconSize.width}
                      height={iconSize.height}
                      className="h-auto w-auto max-h-14 max-w-14 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                    />
                  </div>
                  <h3 className="mt-2 font-display text-xl font-semibold tracking-wider text-[#f8f1df]">
                    {service.title}
                  </h3>
                  <p className="mt-1.5 text-xs font-medium text-[#e5cf9a] sm:text-sm">
                    {service.tagline}
                  </p>
                  <span className="my-3 h-px w-10 bg-[rgba(214,168,79,0.45)]" aria-hidden />
                  <p className="text-[0.72rem] leading-5 text-[#a99d86] sm:text-xs">
                    {service.body}
                  </p>
                  <Link
                    href={service.href}
                    className="mt-4 inline-flex items-center gap-1 text-[0.72rem] font-medium tracking-wide text-[#d6a84f] transition-colors hover:text-[#f0c978] sm:text-xs"
                  >
                    {LP_SERVICES.more} <span aria-hidden>→</span>
                  </Link>
                </div>
              </LpCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
