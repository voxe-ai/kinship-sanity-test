'use client';

import { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { HeaderNav } from '@/components/layout/HeaderNav';
import { BreadcrumbSchema, BREADCRUMBS } from '@/components/BreadcrumbSchema';
import { ScrollEffectsWrapper } from '@/components/home/ScrollEffectsWrapper';
import { KINSHIP_COLORS, KINSHIP_FONTS } from '@/lib/config/brand';
import type { ExplorePage as ExplorePageData, ExploreSectionsDoc } from '@/lib/sanity/queries';

const ExploreFAQ = dynamic(() => import('@/components/explore/ExploreFAQ').then((m) => ({ default: m.ExploreFAQ })));
const Newsletter = dynamic(() => import('@/components/sections/Newsletter').then((m) => ({ default: m.Newsletter })));
const MapBlock = dynamic(() => import('@/components/home/MapBlock').then((m) => ({ default: m.MapBlock })));
const Footer = dynamic(() => import('@/components/Footer').then((m) => ({ default: m.Footer })));
const CallToBook = dynamic(() => import('@/components/CallToBook').then((m) => ({ default: m.CallToBook })));

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

interface ExploreGenericProps {
  exploreData: ExplorePageData | null;
  sectionsDoc: ExploreSectionsDoc;
}

export function ExploreGeneric({ exploreData, sectionsDoc }: ExploreGenericProps) {
  const sections = (sectionsDoc.sections || []).filter((s) => s && s.title);
  const [active, setActive] = useState<string>('');

  const heroTitle = exploreData?.heroTitle || 'Explore Colorado Springs';
  const heroSubtitle = exploreData?.heroSubtitle || 'Eat, drink, and discover downtown — right from our front door.';
  const intro = sectionsDoc.intro || exploreData?.introText;

  const jump = (id: string) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <ScrollEffectsWrapper>
      <BreadcrumbSchema items={BREADCRUMBS.explore} />
      <HeaderNav />

      {/* HERO */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {exploreData?.heroImageUrl && (
            <Image src={exploreData.heroImageUrl} alt="Explore Colorado Springs" fill className="object-cover" priority quality={75} sizes="100vw" />
          )}
          <div className="absolute inset-0 bg-black/25" />
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white" style={{ fontFamily: KINSHIP_FONTS.heading, textShadow: 'rgba(0, 0, 0, 0.4) 0px 4px 8px' }}>
            {heroTitle}
          </h1>
          <p className="text-white font-light text-lg sm:text-xl md:text-2xl leading-relaxed" style={{ fontFamily: KINSHIP_FONTS.body, textShadow: 'rgba(0, 0, 0, 0.3) 0px 2px 4px' }}>
            {heroSubtitle}
          </p>
        </div>
      </section>

      <main id="main-content">
        {/* INTRO */}
        {intro && (
          <section className="py-16 md:py-20 bg-white">
            <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-lg md:text-xl leading-relaxed" style={{ fontFamily: KINSHIP_FONTS.body, color: KINSHIP_COLORS.greenDark, lineHeight: '1.8' }}>
                {intro}
              </p>
            </div>
          </section>
        )}

        {/* STICKY NAV (built from the section titles) */}
        {sections.length > 0 && (
          <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {sections.map((s) => {
                  const id = slugify(s.title);
                  return (
                    <button
                      key={id}
                      onClick={() => jump(id)}
                      className="inline-flex items-center px-3 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-semibold transition-all duration-200 border-2 hover:shadow-md active:scale-95"
                      style={{
                        fontFamily: KINSHIP_FONTS.body,
                        backgroundColor: active === id ? KINSHIP_COLORS.green : 'white',
                        color: active === id ? 'white' : KINSHIP_COLORS.greenDark,
                        borderColor: active === id ? KINSHIP_COLORS.green : KINSHIP_COLORS.greenDark,
                      }}
                    >
                      {s.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SECTIONS */}
        {sections.map((s, i) => {
          const id = slugify(s.title);
          const bg = i % 2 === 0 ? KINSHIP_COLORS.white : KINSHIP_COLORS.latte;
          const items = (s.items || []).filter((it) => it && it.name);
          return (
            <div key={id}>
              {s.breakImageUrl && (
                <section className="relative h-[280px] md:h-[420px] overflow-hidden">
                  <Image src={s.breakImageUrl} alt={s.title} fill className="object-cover" sizes="100vw" quality={75} />
                  <div className="absolute inset-0 bg-black/10" />
                </section>
              )}
              <section id={id} className="py-16 md:py-24" style={{ backgroundColor: bg }}>
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: KINSHIP_FONTS.heading, color: KINSHIP_COLORS.greenDark, lineHeight: '1.2' }}>
                      {s.title}
                    </h2>
                    {s.intro && (
                      <p className="max-w-[800px] mx-auto text-lg md:text-xl leading-relaxed" style={{ fontFamily: KINSHIP_FONTS.body, color: KINSHIP_COLORS.greenDark, lineHeight: '1.8' }}>
                        {s.intro}
                      </p>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {items.map((item, idx) => (
                      <div key={item.name + idx} className="border-2 bg-white flex flex-col overflow-hidden" style={{ borderColor: KINSHIP_COLORS.greenDark }}>
                        {item.imageUrl && (
                          <div className="relative h-48 w-full">
                            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" quality={70} />
                          </div>
                        )}
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ fontFamily: KINSHIP_FONTS.heading, color: KINSHIP_COLORS.green, lineHeight: '1.3' }}>
                            {item.name}
                          </h3>
                          {item.detail && (
                            <p className="text-sm font-semibold mb-2" style={{ fontFamily: KINSHIP_FONTS.body, color: KINSHIP_COLORS.greenDark, opacity: 0.85 }}>
                              {item.detail}
                            </p>
                          )}
                          {item.description && (
                            <p className="text-base mb-4 leading-relaxed flex-grow" style={{ fontFamily: KINSHIP_FONTS.body, color: KINSHIP_COLORS.greenDark, lineHeight: '1.7' }}>
                              {item.description}
                            </p>
                          )}
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-base font-semibold transition-transform duration-300 hover:translate-x-1 mt-auto"
                              style={{ color: KINSHIP_COLORS.green }}
                            >
                              <span>{item.linkText || 'Learn more'}</span>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          );
        })}

        <ExploreFAQ
          sectionTitle={exploreData?.faqSectionTitle}
          sectionSubtitle={exploreData?.faqSectionSubtitle}
          faqItems={exploreData?.faqItems}
        />
        <Newsletter />
        <MapBlock />
      </main>

      <Footer />
      <CallToBook />
    </ScrollEffectsWrapper>
  );
}
