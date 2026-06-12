'use client';

import dynamic from 'next/dynamic';
import Script from 'next/script';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { KINSHIP_COLORS, KINSHIP_FONTS } from '@/lib/config/brand';
import { HomaPage as HomaPageData, type HomaMenuCategory } from '@/lib/sanity/queries';

// Critical above-fold components
import { HeaderNav } from '@/components/layout/HeaderNav';
import { BreadcrumbSchema, BREADCRUMBS } from '@/components/BreadcrumbSchema';
import { ScrollEffectsWrapper } from '@/components/home/ScrollEffectsWrapper';
import { HomaTestimonials } from '@/components/homa/HomaTestimonials';

// Dynamic imports for below-fold components
const HomaMenuAccordion = dynamic(() => import('@/components/homa/HomaMenuAccordion').then(mod => ({ default: mod.HomaMenuAccordion })));
const HomaReviews = dynamic(() => import('@/components/homa/HomaReviews').then(mod => ({ default: mod.HomaReviews })));
const HomaLoyalty = dynamic(() => import('@/components/homa/HomaLoyalty').then(mod => ({ default: mod.HomaLoyalty })));
const HomaFAQ = dynamic(() => import('@/components/homa/HomaFAQ'));
const Footer = dynamic(() => import('@/components/Footer').then(mod => ({ default: mod.Footer })));
const ScrollTop = dynamic(() => import('@/components/ScrollTop').then(mod => ({ default: mod.ScrollTop })));
const CallToBook = dynamic(() => import('@/components/CallToBook').then(mod => ({ default: mod.CallToBook })));

// Fallback hero carousel images - Desktop: BRILLIANT 3-panel triptych layouts
const HERO_IMAGES_DESKTOP_FALLBACK = [
  '/images/HOMA Page/hero-triptych-1.webp',
  '/images/HOMA Page/hero-triptych-3.webp',
] as const;

// Fallback hero carousel images - Mobile: portrait friendly
const HERO_IMAGES_MOBILE_FALLBACK = [
  '/images/HOMA Page/Fresh and local.webp',
  '/images/HOMA Page/samantha-baldwin-14.webp',
  '/images/HOMA Page/Homa Espresso Web Size_-4 (1).webp',
  '/images/HOMA Page/CafeSeating-ChrystalHolmes (1)-optimized.webp',
] as const;

// Fallback fireplace carousel images
const FIREPLACE_IMAGES_FALLBACK = [
  '/images/HOMA Page/homa seating-optimized.webp',
  '/images/HOMA Page/homa seating 2-optimized.webp',
  '/images/HOMA Page/Seating Homa -optimized.webp',
  '/images/HOMA Page/CafeSeating-GregCeo-optimized.webp',
  '/images/HOMA Page/CafeSeating-ChrystalHolmes (1)-optimized.webp',
] as const;

interface HomaPageClientProps {
  homaData: HomaPageData | null;
  menuData?: HomaMenuCategory[];
}

const defaultHappyHourSpecials = [
  { price: "$4", item: "Draft Beer" },
  { price: "$5", item: "House Glass of Wine" },
  { price: "$9", item: "Signature Cocktail or Mocktail" },
  { price: "Half Price", item: "Cauli Pop or Fries" }
];

export function HomaPageClient({ homaData, menuData }: HomaPageClientProps) {
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [fireplaceImageIndex, setFireplaceImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Build hero images arrays with Sanity images and fallbacks
  const HERO_IMAGES_DESKTOP = [
    homaData?.heroTriptychImage1Url || HERO_IMAGES_DESKTOP_FALLBACK[0],
    homaData?.heroTriptychImage2Url || HERO_IMAGES_DESKTOP_FALLBACK[1],
  ];

  const HERO_IMAGES_MOBILE = [
    homaData?.heroMobileImage1Url || HERO_IMAGES_MOBILE_FALLBACK[0],
    homaData?.heroMobileImage2Url || HERO_IMAGES_MOBILE_FALLBACK[1],
    homaData?.heroMobileImage3Url || HERO_IMAGES_MOBILE_FALLBACK[2],
    homaData?.heroMobileImage4Url || HERO_IMAGES_MOBILE_FALLBACK[3],
  ];

  // Build fireplace images array with Sanity images and fallbacks
  const FIREPLACE_IMAGES = homaData?.seatingImages && homaData.seatingImages.length > 0
    ? homaData.seatingImages
    : FIREPLACE_IMAGES_FALLBACK;

  // Get the correct hero images array based on screen size
  const HERO_IMAGES = isMobile ? HERO_IMAGES_MOBILE : HERO_IMAGES_DESKTOP;

  // Hero carousel auto-advance
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [HERO_IMAGES.length]);

  // Fireplace carousel auto-advance
  useEffect(() => {
    const interval = setInterval(() => {
      setFireplaceImageIndex((prev) => (prev + 1) % FIREPLACE_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollEffectsWrapper>
      <BreadcrumbSchema items={BREADCRUMBS.homa} />
      <HeaderNav />

      {/* FAQ Schema Markup - 4 FAQs matching visible section */}
      <Script
        id="homa-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What makes Homa Café + Bar unique?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Homa Café + Bar blends modern, minimalist design with a greenhouse-style space full of natural light and plants. Guests love the cozy, relaxed vibe for working, meeting friends, and enjoying creative, globally inspired food and drinks."
                }
              },
              {
                "@type": "Question",
                "name": "What are the must-try menu items at Homa Café + Bar?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Popular picks include the fried cauliflower bowl, hand pies, pancakes and eggs at breakfast, Mediterranean-inspired salads, grain bowls, the Club Scout sandwich, and rotating seasonal specials."
                }
              },
              {
                "@type": "Question",
                "name": "Does Homa Café + Bar offer vegetarian, vegan, or gluten-free options?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. The menu features vegetarian-friendly bowls and salads, and staff can advise on vegan and gluten-free choices. Ask at the counter for the latest accommodations."
                }
              },
              {
                "@type": "Question",
                "name": "Can I work or study at Homa Café + Bar?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Free Wi-Fi, plenty of natural light, and a variety of seating make Homa a popular spot for remote work and study sessions."
                }
              }
            ]
          })
        }}
      />

      {/* 1. HERO SECTION - Carousel */}
      <section className="relative min-h-[90vh] lg:min-h-[80vh] overflow-hidden">
        {/* Hero Image Carousel */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence initial={false}>
            {HERO_IMAGES[heroImageIndex] && (
              <motion.div
                key={heroImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={HERO_IMAGES[heroImageIndex]}
                  alt="HOMA Café + Bar"
                  fill
                  className="object-cover"
                  priority={heroImageIndex === 0}
                  quality={75}
                  sizes="100vw"
                />
              </motion.div>
            )}
          </AnimatePresence>
          {/* Subtle overlay for text visibility - lighter for vibrant images */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Text Content - Centered Bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-12 sm:pb-16 lg:pb-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <h1
                className="text-white font-serif font-semibold leading-[1.05]"
                style={{
                  fontFamily: KINSHIP_FONTS.heading,
                  textShadow: 'rgba(0, 0, 0, 0.4) 0px 4px 8px',
                  fontSize: 'clamp(32px, 5.5vw, 68px)',
                }}
              >
                {homaData?.heroTitle || "Food made for friends"}
              </h1>

              {/* Rotating Testimonials with SEO Subtext */}
              <HomaTestimonials />

              {/* CTA Buttons - Responsive sizing */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2">
                <a
                  href={homaData?.heroCtaMenuUrl || "#menu"}
                  className="inline-flex items-center justify-center px-6 py-2.5 sm:px-8 sm:py-3 text-base sm:text-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl"
                  style={{
                    backgroundColor: KINSHIP_COLORS.greenDark,
                    color: KINSHIP_COLORS.white
                  }}
                >
                  {homaData?.heroCtaMenuText || "View Menu"}
                </a>
                <a
                  href={homaData?.heroCtaPromosUrl || "#promos"}
                  className="inline-flex items-center justify-center px-6 py-2.5 sm:px-8 sm:py-3 text-base sm:text-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95 border-2 shadow-xl hover:shadow-2xl"
                  style={{
                    backgroundColor: KINSHIP_COLORS.white,
                    color: KINSHIP_COLORS.greenDark,
                    borderColor: KINSHIP_COLORS.white
                  }}
                >
                  {homaData?.heroCtaPromosText || "View Promos"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main id="main-content">
        {/* 2. TEXT SECTION - About */}
        <section className="py-16 md:py-24" style={{ backgroundColor: KINSHIP_COLORS.latte }}>
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p
                className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-6"
                style={{
                  fontFamily: KINSHIP_FONTS.body,
                  color: KINSHIP_COLORS.greenDark,
                  opacity: 0.9
                }}
              >
                {homaData?.aboutParagraph1 || "HOMA, food for the people! Serving hearty, healthy, and delicious dishes inspired by foods we have loved from traveling around the world. Brought together with a little fresh Colorado style, each dish is crafted with the hungry and the healthy in mind."}
              </p>
              <p
                className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-6"
                style={{
                  fontFamily: KINSHIP_FONTS.body,
                  color: KINSHIP_COLORS.greenDark,
                  opacity: 0.9
                }}
              >
                {homaData?.aboutParagraph2 || "Our house made, freshly prepared, and locally sourced ingredients showcase local faves and new dishes sure to delight. Featuring nutrient rich grain bowls or salads, stacked sandwiches with housemade bread, the perfect breakfast, small bites, and signature hand pies, you'll love every yummy bite."}
              </p>
              <p
                className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
                style={{
                  fontFamily: KINSHIP_FONTS.body,
                  color: KINSHIP_COLORS.greenDark,
                  opacity: 0.9
                }}
              >
                {homaData?.aboutParagraph3 || "Paired with our full Bar, coffee offerings, and good vibes, you can't go wrong!"}
              </p>
            </div>
          </div>
        </section>

        {/* 3. SPECIALS & EVENTS SECTION - 3 Cards */}
        <section className="py-16 md:py-24" style={{ backgroundColor: KINSHIP_COLORS.white }}>
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Title */}
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12"
              style={{
                fontFamily: KINSHIP_FONTS.heading,
                color: KINSHIP_COLORS.greenDark
              }}
            >
              {homaData?.specialsSectionTitle || "Specials & Events"}
            </h2>

            {/* Three Column Grid */}
            <div className="grid md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">

              {/* The Happiest Hour */}
              <div
                className="bg-white border-2 overflow-hidden transition-shadow duration-300 hover:shadow-lg flex flex-col"
                style={{
                  borderColor: KINSHIP_COLORS.greenDark,
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                }}
              >
                {/* Image */}
                <div className="relative h-[200px] w-full overflow-hidden flex-shrink-0">
                  <Image
                    src={homaData?.happyHourImageUrl || '/images/HOMA Page/homa-happy-hour-34.webp'}
                    alt="The Happiest Hour at HOMA"
                    fill
                    className="object-cover"
                    quality={75}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* Content - Flex grow to push CTA to bottom */}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <div className="flex-grow space-y-4">
                    {/* Badge */}
                    <span
                      className="inline-block px-3 py-1 text-white text-xs uppercase tracking-wider font-semibold"
                      style={{
                        backgroundColor: KINSHIP_COLORS.green,
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                      }}
                    >
                      {homaData?.happyHourBadge || "Happy Hour"}
                    </span>

                    {/* Title */}
                    <h3
                      className="text-2xl md:text-3xl font-bold"
                      style={{
                        fontFamily: KINSHIP_FONTS.heading,
                        color: KINSHIP_COLORS.greenDark
                      }}
                    >
                      {homaData?.happyHourTitle || "The Happiest Hour"}
                    </h3>

                    {/* Time */}
                    <p
                      className="text-base font-semibold"
                      style={{
                        fontFamily: KINSHIP_FONTS.body,
                        color: KINSHIP_COLORS.green
                      }}
                    >
                      {homaData?.happyHourTime || "3 - 6pm, Monday - Friday"}
                    </p>

                    {/* Specials List */}
                    <div className="space-y-2 pt-2">
                      {(homaData?.happyHourSpecials || defaultHappyHourSpecials).map((special, index) => (
                        <p
                          key={index}
                          className="text-base"
                          style={{
                            fontFamily: KINSHIP_FONTS.body,
                            color: KINSHIP_COLORS.greenDark,
                            opacity: 0.9
                          }}
                        >
                          <strong>{special.price}</strong> {special.item}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button - Anchored to bottom */}
                  <a
                    href="#hours"
                    className="inline-flex items-center justify-center min-h-[48px] w-full px-6 py-3 text-base font-semibold transition-all duration-300 hover:scale-105 active:scale-95 mt-6"
                    style={{
                      backgroundColor: KINSHIP_COLORS.greenDark,
                      color: KINSHIP_COLORS.white,
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                    }}
                  >
                    {homaData?.happyHourCtaText || "View Hours"}
                  </a>
                </div>
              </div>

              {/* Sunday Brunch */}
              <div
                className="bg-white border-2 overflow-hidden transition-shadow duration-300 hover:shadow-lg flex flex-col"
                style={{
                  borderColor: KINSHIP_COLORS.greenDark,
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                }}
              >
                {/* Image */}
                <div className="relative h-[200px] w-full overflow-hidden flex-shrink-0">
                  <Image
                    src={homaData?.brunchImageUrl || '/images/HOMA Page/Brunch.webp'}
                    alt="Sunday Brunch at HOMA"
                    fill
                    className="object-cover"
                    quality={75}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* Content - Flex grow to push CTA to bottom */}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <div className="flex-grow space-y-4">
                    {/* Badge */}
                    <span
                      className="inline-block px-3 py-1 text-white text-xs uppercase tracking-wider font-semibold"
                      style={{
                        backgroundColor: KINSHIP_COLORS.green,
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                      }}
                    >
                      {homaData?.brunchBadge || "Sundays"}
                    </span>

                    {/* Title */}
                    <h3
                      className="text-2xl md:text-3xl font-bold"
                      style={{
                        fontFamily: KINSHIP_FONTS.heading,
                        color: KINSHIP_COLORS.greenDark
                      }}
                    >
                      {homaData?.brunchTitle || "Brunch. Every Sunday."}
                    </h3>

                    {/* Time */}
                    <p
                      className="text-base font-semibold"
                      style={{
                        fontFamily: KINSHIP_FONTS.body,
                        color: KINSHIP_COLORS.green
                      }}
                    >
                      {homaData?.brunchTime || "8:00am - 2:00pm"}
                    </p>

                    {/* Description */}
                    <p
                      className="text-base leading-relaxed pt-2"
                      style={{
                        fontFamily: KINSHIP_FONTS.body,
                        color: KINSHIP_COLORS.greenDark,
                        opacity: 0.9
                      }}
                    >
                      {homaData?.brunchDescription || "Created by our chefs featuring the best ingredients the season has to offer!"}
                    </p>
                  </div>

                  {/* CTA Button - Anchored to bottom */}
                  <a
                    href={homaData?.brunchMenuPdfUrl || "#menu"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center min-h-[48px] w-full px-6 py-3 text-base font-semibold transition-all duration-300 hover:scale-105 active:scale-95 mt-6"
                    style={{
                      backgroundColor: KINSHIP_COLORS.greenDark,
                      color: KINSHIP_COLORS.white,
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                    }}
                  >
                    {homaData?.brunchCtaText || "View Brunch Menu"}
                  </a>
                </div>
              </div>

              {/* Upcoming Events */}
              <div
                className="bg-white border-2 overflow-hidden transition-shadow duration-300 hover:shadow-lg flex flex-col"
                style={{
                  borderColor: KINSHIP_COLORS.greenDark,
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                }}
              >
                {/* Image */}
                <div className="relative h-[200px] w-full overflow-hidden flex-shrink-0">
                  <Image
                    src={homaData?.eventsImageUrl || '/images/HOMA Page/CafeSeating2, SamStarr.webp'}
                    alt="Upcoming Events at Kinship Landing"
                    fill
                    className="object-cover"
                    quality={75}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* Content - Flex grow to push CTA to bottom */}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <div className="flex-grow space-y-4">
                    {/* Badge */}
                    <span
                      className="inline-block px-3 py-1 text-white text-xs uppercase tracking-wider font-semibold"
                      style={{
                        backgroundColor: KINSHIP_COLORS.green,
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                      }}
                    >
                      {homaData?.eventsBadge || "Community"}
                    </span>

                    {/* Title */}
                    <h3
                      className="text-2xl md:text-3xl font-bold"
                      style={{
                        fontFamily: KINSHIP_FONTS.heading,
                        color: KINSHIP_COLORS.greenDark
                      }}
                    >
                      {homaData?.eventsTitle || "Upcoming Events"}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-base leading-relaxed pt-2"
                      style={{
                        fontFamily: KINSHIP_FONTS.body,
                        color: KINSHIP_COLORS.greenDark,
                        opacity: 0.9
                      }}
                    >
                      {homaData?.eventsDescription || "Find cool stuff to do in Colorado Springs. Meet like-minded folks. Learn from experts."}
                    </p>
                  </div>

                  {/* CTA Button - Anchored to bottom */}
                  <a
                    href={homaData?.eventsCtaUrl || "/community"}
                    className="inline-flex items-center justify-center min-h-[48px] w-full px-6 py-3 text-base font-semibold transition-all duration-300 hover:scale-105 active:scale-95 mt-6"
                    style={{
                      backgroundColor: KINSHIP_COLORS.greenDark,
                      color: KINSHIP_COLORS.white,
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                    }}
                  >
                    {(homaData?.eventsCtaText && homaData.eventsCtaText !== 'Learn More') ? homaData.eventsCtaText : "View Events at Kinship"}
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. PROMO BANNER SECTION - Full Width Matching Cards */}
        <section id="promos" className="py-16 md:py-24" style={{ backgroundColor: KINSHIP_COLORS.latte }}>
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Render promos from Sanity, or fallback to default promo */}
            {(homaData?.promos && homaData.promos.length > 0 ? homaData.promos : [{
              title: 'Everything but the Turkey',
              description: 'Skip the stress this holiday season and let us handle your side dishes! Introducing "Everything but the Turkey"—a curated selection of delicious, ready-to-serve sides that will make your Thanksgiving meal unforgettable. From creamy mashed potatoes to savory sage stuffing, and of course, classic pies, we\'ve got you covered. Just cook the turkey, and we\'ll take care of the rest!',
              badge: 'Thanksgiving Special',
              ctaText: 'Reserve a Spot',
              ctaUrl: 'https://www.eventbrite.com/e/everything-but-the-turkey-from-homa-cafe-bar-registration-1908375365089?aff=oddtdtcreator',
              imageUrl: homaData?.promoBannerImageUrl || '/images/HOMA Page/everything-turkey-promo-optimized.webp'
            }]).map((promo, index) => (
              <div
                key={index}
                className="bg-white border-2 overflow-hidden transition-shadow duration-300 hover:shadow-lg p-8 md:p-12"
                style={{
                  borderColor: KINSHIP_COLORS.greenDark,
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                }}
              >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Left: Image */}
                  <div className="relative h-[250px] md:h-[300px] overflow-hidden">
                    <Image
                      src={promo.imageUrl || '/images/HOMA Page/everything-turkey-promo-optimized.webp'}
                      alt={promo.title}
                      fill
                      className="object-cover"
                      quality={75}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                      }}
                    />
                  </div>

                  {/* Right: Content */}
                  <div className="space-y-6">
                    {/* Badge */}
                    {promo.badge && (
                      <span
                        className="inline-block px-4 py-2 text-white text-sm uppercase tracking-wider font-bold"
                        style={{
                          backgroundColor: KINSHIP_COLORS.green,
                          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                        }}
                      >
                        {promo.badge}
                      </span>
                    )}

                    {/* Title */}
                    <h3
                      className="text-3xl md:text-4xl font-bold"
                      style={{
                        fontFamily: KINSHIP_FONTS.heading,
                        color: KINSHIP_COLORS.greenDark
                      }}
                    >
                      {promo.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-base md:text-lg leading-relaxed"
                      style={{
                        fontFamily: KINSHIP_FONTS.body,
                        color: KINSHIP_COLORS.greenDark,
                        opacity: 0.9
                      }}
                    >
                      {promo.description}
                    </p>

                    {/* CTA Button */}
                    {promo.ctaUrl && promo.ctaText && (
                      <a
                        href={promo.ctaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 text-base font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                        style={{
                          backgroundColor: KINSHIP_COLORS.greenDark,
                          color: KINSHIP_COLORS.white,
                          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                        }}
                      >
                        {promo.ctaText}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. MENU SECTION - Accordion */}
        <HomaMenuAccordion
          brunchMenuPdfUrl={homaData?.brunchMenuPdfUrl}
          cateringMenuPdfUrl={homaData?.cateringMenuPdfUrl}
          menuData={menuData}
        />

        {/* 6. FIREPLACE SECTION - Carousel */}
        <section className="py-12 md:py-16" style={{ backgroundColor: KINSHIP_COLORS.latte }}>
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">

              {/* Left: Image Carousel */}
              <div
                className="relative h-[300px] md:h-[400px] overflow-hidden shadow-xl"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    key={fireplaceImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={FIREPLACE_IMAGES[fireplaceImageIndex]}
                      alt="Café Fireplace - Intimate gathering space at HOMA"
                      fill
                      className="object-cover"
                      quality={75}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right: Content */}
              <div className="space-y-6">
                <div>
                  <span
                    className="inline-block px-4 py-1 mb-4 text-white text-xs uppercase tracking-wider font-semibold"
                    style={{
                      backgroundColor: KINSHIP_COLORS.greenDark,
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                    }}
                  >
                    Gathering Space
                  </span>
                  <h2
                    className="text-3xl md:text-4xl font-bold mb-4"
                    style={{
                      fontFamily: KINSHIP_FONTS.heading,
                      color: KINSHIP_COLORS.greenDark
                    }}
                  >
                    {homaData?.seatingSectionTitle || "Café Fireplace"}
                  </h2>
                </div>

                <p
                  className="text-base md:text-lg leading-relaxed"
                  style={{
                    fontFamily: KINSHIP_FONTS.body,
                    color: KINSHIP_COLORS.greenDark,
                    opacity: 0.9
                  }}
                >
                  {homaData?.seatingDescription || "A cozy, semi-private space with mixed seating for up to 20 guests. Perfect for intimate gatherings, small meetings, or casual celebrations. Order from Homa Café or book full catering to make your event complete."}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: KINSHIP_COLORS.green }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span
                      className="text-sm md:text-base"
                      style={{
                        fontFamily: KINSHIP_FONTS.body,
                        color: KINSHIP_COLORS.greenDark
                      }}
                    >
                      Capacity: Up to 20 guests
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: KINSHIP_COLORS.green }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    >
                      <rect x="6" y="18" width="12" height="4" rx="0.5"/>
                      <path d="M6 18 L6 10 L9 6 L12 10 L15 6 L18 10 L18 18"/>
                      <path d="M12 13 C12 11, 10 9, 10 7 C10 9, 8 11, 8 13"/>
                      <path d="M16 13 C16 11, 14 9, 14 7 C14 9, 12 11, 12 13"/>
                      <line x1="4" y1="22" x2="20" y2="22"/>
                      <line x1="5" y1="18" x2="19" y2="18"/>
                    </svg>
                    <span
                      className="text-sm md:text-base"
                      style={{
                        fontFamily: KINSHIP_FONTS.body,
                        color: KINSHIP_COLORS.greenDark
                      }}
                    >
                      Semi-private space
                    </span>
                  </div>
                </div>

                {/* CTA Buttons - MOBILE PERFECT (48×48px) */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <a
                    href="https://portal.tripleseat.com/direct_bookings/mfdrdz7es8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 text-base font-semibold transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg"
                    style={{
                      backgroundColor: KINSHIP_COLORS.green,
                      color: KINSHIP_COLORS.white,
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                    }}
                  >
                    Book the Fireplace
                  </a>
                  <a
                    href={homaData?.cateringMenuPdfUrl || "#menu"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 text-base font-semibold transition-all duration-300 hover:scale-105 active:scale-95 border-2"
                    style={{
                      backgroundColor: KINSHIP_COLORS.white,
                      color: KINSHIP_COLORS.greenDark,
                      borderColor: KINSHIP_COLORS.greenDark,
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                    }}
                  >
                    View Catering Menu
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guest Reviews */}
        <HomaReviews />

        {/* HOMA Loyalty & Rewards */}
        <HomaLoyalty
          title={homaData?.loyaltyTitle}
          description={homaData?.loyaltyDescription}
          ctaText={homaData?.loyaltyCtaText}
          ctaUrl={homaData?.loyaltyCtaUrl}
          fineprint={homaData?.loyaltyFineprint}
          imageUrl={homaData?.loyaltyImageUrl}
        />

        {/* FAQ */}
        <HomaFAQ
          sectionTitle={homaData?.faqSectionTitle}
          sectionSubtitle={homaData?.faqSectionSubtitle}
          faqItems={homaData?.faqItems}
        />
      </main>

      <Footer variant="homa" />

      {/* Sticky Buttons */}
      <ScrollTop />
      <CallToBook />
    </ScrollEffectsWrapper>
  );
}
