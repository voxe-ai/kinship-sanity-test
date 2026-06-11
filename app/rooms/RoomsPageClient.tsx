'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo, useCallback, useTransition, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Critical above-fold components
import { HeaderNav } from '@/components/layout/HeaderNav';
import { BreadcrumbSchema, BREADCRUMBS } from '@/components/BreadcrumbSchema';
import { ScrollEffectsWrapper } from '@/components/home/ScrollEffectsWrapper';
import { RoomCard } from '@/components/rooms/RoomCard';
import { roomsFaqs as defaultRoomsFaqs } from '@/components/rooms/faq-data';
import { buildFAQSchema } from '@/lib/utils/faq-schema';
import { RoomsPage } from '@/lib/sanity/queries';
import { roomTeasers as fallbackRoomTeasers } from '@/lib/data/rooms';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import type { PortableTextBlock } from '@portabletext/types';

// Room type definition
interface RoomTeaser {
  id: string;
  name: string;
  slug: string;
  category: 'suites' | 'junior' | 'family' | 'specialty';
  heroImage: string;
  galleryImages?: string[];
  features: string[];
  description: string | PortableTextBlock[];
}

interface RoomsPageClientProps {
  roomsPageData: RoomsPage | null;
}

// Dynamic imports for below-fold components with loading states
const RoomsFAQ = dynamic(() => import('@/components/rooms/RoomsFAQ').then(mod => ({ default: mod.RoomsFAQ })), {
  loading: () => <div className="h-96 bg-kinship-sage/30 animate-pulse" />
});
const MapBlock = dynamic(() => import('@/components/home/MapBlock').then(mod => ({ default: mod.MapBlock })), {
  loading: () => <div className="h-96 bg-kinship-sage/30 animate-pulse" />
});
const Newsletter = dynamic(() => import('@/components/sections/Newsletter').then(mod => ({ default: mod.Newsletter })), {
  loading: () => <div className="h-64 bg-kinship-sage/30 animate-pulse" />
});
const Footer = dynamic(() => import('@/components/Footer').then(mod => ({ default: mod.Footer })));
const ScrollTop = dynamic(() => import('@/components/ScrollTop').then(mod => ({ default: mod.ScrollTop })));
const CallToBook = dynamic(() => import('@/components/CallToBook').then(mod => ({ default: mod.CallToBook })));

type RoomFilter = 'all' | 'king' | 'queen' | 'family' | 'camp-deck';

// Static constants moved outside component for performance
const HERO_IMAGES_FALLBACK = [
  '/images/Gallery Page/Textiles-RichardSeldomridge-optimized.webp',
  '/images/Gallery Page/Family Suite, Ashlee Kay Photography (2)-optimized.webp',
  '/images/Gallery Page/PetFriendlyJrQueenSuite-ExploreWithMedia (2)-optimized.webp',
] as const;

// Filter options now built dynamically from Sanity data
const getFilterOptions = (data: RoomsPage | null) => [
  { id: 'all' as const, label: data?.filterAllLabel || 'All Rooms' },
  { id: 'king' as const, label: data?.filterKingLabel || 'King Rooms' },
  { id: 'queen' as const, label: data?.filterQueenLabel || 'Queen Rooms' },
  { id: 'family' as const, label: data?.filterFamilyLabel || 'Family Rooms' },
  { id: 'camp-deck' as const, label: data?.filterCampDeckLabel || 'Camp Deck' }
];

// Skeleton loader component for better perceived performance
const RoomCardSkeleton = memo(() => (
  <div className="grid md:grid-cols-2 gap-8 items-center border-2 p-6 md:p-8 bg-white animate-pulse"
    style={{ borderColor: '#667C58', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}>
    <div className="space-y-4">
      <div className="h-8 bg-kinship-sage/50 rounded w-1/3"></div>
      <div className="h-12 bg-kinship-sage/50 rounded w-3/4"></div>
      <div className="h-6 bg-kinship-sage/50 rounded w-full"></div>
      <div className="h-6 bg-kinship-sage/50 rounded w-5/6"></div>
    </div>
    <div className="h-[350px] bg-kinship-sage/50 rounded"></div>
  </div>
));
RoomCardSkeleton.displayName = 'RoomCardSkeleton';

export default function RoomsPageClient({ roomsPageData }: RoomsPageClientProps) {
  const [activeFilter, setActiveFilter] = useState<RoomFilter>('all');
  const [isPending, startTransition] = useTransition();
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string; images: string[]; index: number } | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Transform Sanity rooms to RoomTeaser format, or use fallback
  const roomTeasers: RoomTeaser[] = useMemo(() => {
    if (roomsPageData?.rooms && roomsPageData.rooms.length > 0) {
      return roomsPageData.rooms.map(room => ({
        id: room.id,
        name: room.name,
        slug: room.slug,
        category: room.category,
        heroImage: room.heroImageUrl || '/images/placeholder.webp',
        galleryImages: room.galleryImages || [],
        features: room.features || [],
        description: room.description,
      }));
    }
    return fallbackRoomTeasers;
  }, [roomsPageData?.rooms]);

  // Build filter options from Sanity data
  const FILTER_OPTIONS = useMemo(() => getFilterOptions(roomsPageData), [roomsPageData]);

  // Hero content from Sanity
  const heroTitle = roomsPageData?.heroTitle || 'Stay With Us';
  const heroSubtitle = roomsPageData?.heroSubtitle || 'Your Colorado Springs basecamp';

  // Hero images from Sanity with fallbacks (desktop)
  const HERO_IMAGES_DESKTOP = useMemo(() => {
    if (roomsPageData?.heroImages && roomsPageData.heroImages.length > 0) {
      return roomsPageData.heroImages.map(img => img.url);
    }
    return HERO_IMAGES_FALLBACK;
  }, [roomsPageData?.heroImages]);

  // Mobile hero images from Sanity with fallbacks
  const HERO_IMAGES_MOBILE = useMemo(() => {
    if (roomsPageData?.heroMobileImages && roomsPageData.heroMobileImages.length > 0) {
      return roomsPageData.heroMobileImages.map(img => img.url);
    }
    return HERO_IMAGES_FALLBACK;
  }, [roomsPageData?.heroMobileImages]);

  // Use mobile or desktop images based on screen size
  const HERO_IMAGES = isMobile ? HERO_IMAGES_MOBILE : HERO_IMAGES_DESKTOP;

  // Individual hero images for desktop layout
  const heroImageMain = roomsPageData?.heroImageUrl || HERO_IMAGES_FALLBACK[0];
  const heroImageFamily = (roomsPageData?.heroImages && roomsPageData.heroImages.length > 1)
    ? roomsPageData.heroImages[1].url
    : HERO_IMAGES_FALLBACK[1];
  const heroImagePetFriendly = (roomsPageData?.heroImages && roomsPageData.heroImages.length > 2)
    ? roomsPageData.heroImages[2].url
    : HERO_IMAGES_FALLBACK[2];

  // Room Blocks content from Sanity
  const roomBlocksTitle = roomsPageData?.roomBlocksTitle || 'Book a Bunch of Rooms';
  const roomBlocksTagline = roomsPageData?.roomBlocksTagline || 'Keep Your Crew Close';
  const roomBlocksDescription1 = roomsPageData?.roomBlocksDescription1;
  const roomBlocksDescription1Fallback = 'Keep your favorite people close. Whether it\'s a wedding weekend, a family reunion, or a team retreat, reserving a room block at Kinship makes it easy for everyone to stay together under one roof.';
  const roomBlocksDescription2 = roomsPageData?.roomBlocksDescription2;
  const roomBlocksDescription2Fallback = 'Your crew will love our unique rooms, downtown location, and the chance to gather around the fire pit, share a meal at Homa Café, or head out on an adventure right from our front door.';
  const roomBlocksDescription3 = roomsPageData?.roomBlocksDescription3;
  const roomBlocksDescription3Fallback = 'Ask us about setting up a block so your group can focus on making memories, not logistics.';
  const roomBlocksCtaText = roomsPageData?.roomBlocksCtaText || 'Book Your Gathering at Kinship Landing';
  const roomBlocksCtaUrl = roomsPageData?.roomBlocksCtaUrl || 'https://kinshiplanding.tripleseat.com/booking_request/42351';

  // Room Blocks images from Sanity with fallbacks
  const roomBlocksImage1 = roomsPageData?.roomBlocksImage1Url || '/images/Rooms Page:section/Book a bunch of rooms/MountainDoubleQueenSuite-AshleeKay-optimized.webp';
  const roomBlocksImage2 = roomsPageData?.roomBlocksImage2Url || '/images/Rooms Page:section/Book a bunch of rooms/BunkRoom5-SamStarr-optimized.webp';

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Preload critical images and preconnect to external services
  useEffect(() => {
    // Preload hero images for instant display
    const preloadLinks = [
      '/images/Gallery Page/Family Suite, Ashlee Kay Photography (2)-optimized.webp',
      '/images/Gallery Page/Textiles-RichardSeldomridge-optimized.webp'
    ].map(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = href;
      document.head.appendChild(link);
      return link;
    });

    // Preconnect to SiteMinder for faster booking navigation
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'https://direct-book.com';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);

    const dnsPrefetch = document.createElement('link');
    dnsPrefetch.rel = 'dns-prefetch';
    dnsPrefetch.href = 'https://direct-book.com';
    document.head.appendChild(dnsPrefetch);

    return () => {
      preloadLinks.forEach(l => document.head.removeChild(l));
      document.head.removeChild(link);
      document.head.removeChild(dnsPrefetch);
    };
  }, []);

  // Hero carousel effect - optimized with stable dependency
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []); // Empty deps - HERO_IMAGES is constant

  // Optimized filter handler with View Transitions API for native-like animations
  const handleFilterChange = useCallback((filter: RoomFilter) => {
    // Use View Transitions API if available (Chrome 111+, Safari 18+)
    if ('startViewTransition' in document && (document as any).startViewTransition) {
      (document as any).startViewTransition(() => {
        startTransition(() => {
          setActiveFilter(filter);
        });
      });
    } else {
      // Fallback for browsers without View Transitions API
      startTransition(() => {
        setActiveFilter(filter);
      });
    }
  }, []);

  // Memoized filtered rooms - recalculates when activeFilter or roomTeasers change
  const filteredRooms = useMemo(() => {
    switch (activeFilter) {
      case 'all':
        return roomTeasers;
      case 'king':
        return roomTeasers.filter(room =>
          room.name.toLowerCase().includes('king')
        );
      case 'queen':
        return roomTeasers.filter(room =>
          room.name.toLowerCase().includes('queen')
        );
      case 'family':
        return roomTeasers.filter(room =>
          room.category === 'family' || room.name.toLowerCase().includes('family')
        );
      case 'camp-deck':
        return roomTeasers.filter(room =>
          room.id === 'camp-deck' || room.name.toLowerCase().includes('camp')
        );
      default:
        return roomTeasers;
    }
  }, [activeFilter, roomTeasers]);

  return (
    <ScrollEffectsWrapper>
      <BreadcrumbSchema items={BREADCRUMBS.rooms} />
      <HeaderNav />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden bg-kinship-sage">
        {/* Mobile Carousel - Simple auto-cycling images */}
        <div className="absolute inset-0 md:hidden">
          <AnimatePresence initial={false}>
            <motion.div
              key={heroImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0"
            >
              <motion.div
                initial={{ scale: 1.05 }}
                animate={{ scale: 1.02 }}
                transition={{ duration: 5, ease: "linear" }}
                className="relative w-full h-full"
              >
                <Image
                  src={HERO_IMAGES[heroImageIndex] || HERO_IMAGES_FALLBACK[heroImageIndex]}
                  alt="Kinship Landing Rooms"
                  fill
                  className="object-cover"
                  priority={heroImageIndex === 0}
                  quality={75}
                  sizes="100vw"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Desktop - Minimalist Split Layout */}
        <div className="absolute inset-0 hidden md:grid md:grid-cols-2 gap-1">
          {/* Left Side - Main Hero Image */}
          <div className="relative overflow-hidden">
            <Image
              src={heroImageMain}
              alt="Kinship Landing Rooms"
              fill
              className="object-cover"
              priority
              quality={75}
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Right Side - Clean Dual Image Grid */}
          <div className="grid grid-rows-2 gap-1">
            {/* Family Suite - Top - Clickable on Desktop */}
            <a
              href="#family-suite"
              className="relative overflow-hidden group block cursor-pointer focus:outline-none focus:ring-2 focus:ring-kinship-green focus:ring-offset-2"
              aria-label="View Family Suite details"
              onClick={(e) => {
                e.preventDefault();
                handleFilterChange('family');
                setTimeout(() => {
                  document.getElementById('family-suite')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 250);
              }}
            >
              <Image
                src={heroImageFamily}
                alt="Family Suite"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ objectPosition: '50% 60%' }}
                quality={75}
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 pointer-events-none">
                <p
                  className="text-white text-lg font-light tracking-widest uppercase"
                  style={{ fontFamily: '"europa", "Hind", system-ui, sans-serif' }}
                >
                  Family Suite
                </p>
              </div>
            </a>

            {/* Pet Friendly Jr - Bottom */}
            <div className="relative overflow-hidden group">
              <Image
                src={heroImagePetFriendly}
                alt="Pet Friendly Jr Queen Suite"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                quality={75}
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p
                  className="text-white text-lg font-light tracking-widest uppercase"
                  style={{ fontFamily: '"europa", "Hind", system-ui, sans-serif' }}
                >
                  Pet Friendly
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content - Centered, Minimalist */}
        <div className="relative z-10 w-full pointer-events-none">
          <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-20 md:py-32">
            <div className="text-center md:text-left md:max-w-2xl pointer-events-auto">
              <h1
                className="text-white font-serif font-semibold leading-[1.05] pb-2 sm:pb-0"
                style={{
                  fontFamily: '"utopia-std-display", "Source Serif Pro", Georgia, serif',
                  textShadow: 'rgba(0, 0, 0, 0.4) 0px 4px 8px',
                  fontSize: 'clamp(32px, 5.5vw, 68px)',
                  marginBottom: '1rem'
                }}
              >
                {heroTitle}
              </h1>
              <p
                className="text-white font-normal"
                style={{
                  fontSize: 'clamp(18px, 2.5vw, 24px)',
                  lineHeight: '1.6',
                  textShadow: 'rgba(0, 0, 0, 0.4) 0px 2px 4px'
                }}
              >
                {heroSubtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      <main id="main-content">
        {/* Room Listings */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter Buttons */}
            <div className="mb-12">
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
                {FILTER_OPTIONS.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => handleFilterChange(filter.id as RoomFilter)}
                    disabled={isPending}
                    className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold text-xs sm:text-sm md:text-base uppercase tracking-wider transition-colors duration-150 disabled:opacity-50 ${
                      activeFilter === filter.id
                        ? 'text-white shadow-md'
                        : 'text-white/90 hover:text-white hover:shadow-sm'
                    }`}
                    style={{
                      backgroundColor: activeFilter === filter.id ? '#4a5e3e' : '#5f7b4d',
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                      transform: 'translateZ(0)',
                      WebkitFontSmoothing: 'antialiased'
                    }}
                    aria-pressed={activeFilter === filter.id}
                    aria-label={`Filter by ${filter.label}`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Count with smooth fade */}
            <div className="relative h-8 mb-8">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`count-${activeFilter}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="text-center text-base sm:text-lg absolute inset-0"
                  style={{ fontFamily: '"europa", "Hind", system-ui, sans-serif', color: '#667C58' }}
                >
                  {isPending ? 'Filtering...' : `${filteredRooms.length} room ${filteredRooms.length === 1 ? 'type' : 'types'}`}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Room Cards Container */}
            <div className="space-y-8 min-h-[500px]">
              <AnimatePresence mode="wait" initial={false}>
                  {isPending ? (
                    // Show skeletons during transition
                    <motion.div
                      key="skeleton"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-8"
                    >
                      {[1, 2, 3].map((i) => (
                        <RoomCardSkeleton key={i} />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key={activeFilter}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        duration: 0.2,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                      className="space-y-8"
                    >
                      {filteredRooms.map((room, index) => (
                        <RoomCard
                          key={room.id}
                          room={room}
                          index={index}
                          onImageClick={setSelectedImage}
                        />
                      ))}
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Room Blocks Section */}
        <section className="py-16 md:py-24" style={{ backgroundColor: '#F5F3ED' }}>
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Column - Images */}
              <div className="grid grid-cols-2 gap-4">
                {/* Large Left Image */}
                <div className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden shadow-lg">
                  <Image
                    src={roomBlocksImage1}
                    alt="Mountain Double Queen Suite for group stays"
                    fill
                    className="object-cover"
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 95%)'
                    }}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>

                {/* Right Stacked Images */}
                <div className="flex flex-col gap-4">
                  <div className="relative h-[145px] md:h-[195px] lg:h-[245px] overflow-hidden shadow-lg">
                    <Image
                      src={roomBlocksImage2}
                      alt="Bunk room for group accommodations"
                      fill
                      className="object-cover"
                      style={{
                        clipPath: 'polygon(5% 0, 100% 0, 100% 95%, 0 100%)'
                      }}
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div
                    className="relative h-[145px] md:h-[195px] lg:h-[245px] shadow-lg flex items-center justify-center p-6"
                    style={{
                      clipPath: 'polygon(0 5%, 100% 0, 100% 100%, 5% 100%)',
                      backgroundColor: '#667C58'
                    }}
                  >
                    <p
                      className="text-2xl md:text-3xl font-bold leading-tight text-center"
                      style={{
                        fontFamily: '"utopia-std-display", "Source Serif Pro", Georgia, serif',
                        color: '#F5F3ED'
                      }}
                    >
                      {roomBlocksTagline.split(' ').slice(0, 2).join(' ')}<br />{roomBlocksTagline.split(' ').slice(2).join(' ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Content */}
              <div className="text-center lg:text-left">
                <h2
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
                  style={{
                    fontFamily: '"utopia-std-display", "Source Serif Pro", Georgia, serif',
                    color: '#667C58'
                  }}
                >
                  {roomBlocksTitle}
                </h2>

                <div
                  className="text-base md:text-lg leading-relaxed mb-8 space-y-4"
                  style={{
                    fontFamily: '"europa", "Hind", system-ui, sans-serif',
                    color: '#667C58',
                    opacity: 0.95
                  }}
                >
                  <div>
                    {Array.isArray(roomBlocksDescription1) ? (
                      <RichTextRenderer value={roomBlocksDescription1} />
                    ) : (
                      <p>{roomBlocksDescription1 || roomBlocksDescription1Fallback}</p>
                    )}
                  </div>

                  <div>
                    {Array.isArray(roomBlocksDescription2) ? (
                      <RichTextRenderer value={roomBlocksDescription2} />
                    ) : (
                      <p>{roomBlocksDescription2 || roomBlocksDescription2Fallback}</p>
                    )}
                  </div>

                  <div>
                    {Array.isArray(roomBlocksDescription3) ? (
                      <RichTextRenderer value={roomBlocksDescription3} />
                    ) : (
                      <p>{roomBlocksDescription3 || roomBlocksDescription3Fallback}</p>
                    )}
                  </div>
                </div>

                <a
                  href={roomBlocksCtaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 text-base md:text-lg text-white font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: '#667C58',
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                    transform: 'translateZ(0)'
                  }}
                  aria-label="Book your gathering at Kinship Landing"
                >
                  {roomBlocksCtaText}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <RoomsFAQ
          sectionTitle={roomsPageData?.faqSectionTitle}
          sectionSubtitle={roomsPageData?.faqSectionSubtitle}
          faqItems={roomsPageData?.faqItems}
        />

        {/* Visual Break - King Suite (Clickable) */}
        <Link
          href="#king-suite"
          className="block relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden group cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('king-suite')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        >
          <Image
            src={roomsPageData?.visualBreakImageUrl || "/images/Rooms Page:section/King Suite/CityKingSuite-RichardSeldomridge (3)-optimized.webp"}
            alt="King Suite at Kinship Landing - Click to learn more"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            quality={75}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </Link>

        {/* Newsletter */}
        <Newsletter />

        {/* Map */}
        <MapBlock />
      </main>

      <Footer />

      {/* Sticky Buttons */}
      <ScrollTop />
      <CallToBook />

      {/* JSON-LD for SEO/AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFAQSchema(
            roomsPageData?.faqItems && roomsPageData.faqItems.length > 0
              ? roomsPageData.faqItems.map(item => ({
                  question: item.question,
                  answer_short: item.answerShort,
                  answer_long: item.answerLong,
                }))
              : defaultRoomsFaqs,
            'https://kinshiplanding.com/rooms',
            'Kinship Landing Rooms FAQs'
          ))
        }}
      />

      {/* Image Lightbox Modal with Swipe Navigation */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              className="absolute top-4 right-4 p-2 text-white hover:text-kinship-green transition-colors z-[101] cursor-pointer"
              aria-label="Close image viewer"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 z-[101] pointer-events-none">
              <div className="px-3 py-2 bg-white/95 backdrop-blur-sm rounded-md">
                <p className="text-sm font-semibold" style={{ color: '#667C58', fontFamily: '"europa", "Hind", system-ui, sans-serif' }}>
                  {selectedImage.index + 1} / {selectedImage.images.length}
                </p>
              </div>
            </div>

            {/* Previous button */}
            {selectedImage.index > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage({
                    ...selectedImage,
                    index: selectedImage.index - 1,
                    src: selectedImage.images[selectedImage.index - 1]
                  });
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white transition-all duration-200 z-[101] shadow-lg"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" style={{ color: '#667C58' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Next button */}
            {selectedImage.index < selectedImage.images.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage({
                    ...selectedImage,
                    index: selectedImage.index + 1,
                    src: selectedImage.images[selectedImage.index + 1]
                  });
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white transition-all duration-200 z-[101] shadow-lg"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
                aria-label="Next image"
              >
                <svg className="w-6 h-6" style={{ color: '#667C58' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Image container with swipe support */}
            <motion.div
              key={selectedImage.index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x;
                if (swipe > 10000) {
                  // Swiped left - next image
                  if (selectedImage.index < selectedImage.images.length - 1) {
                    setSelectedImage({
                      ...selectedImage,
                      index: selectedImage.index + 1,
                      src: selectedImage.images[selectedImage.index + 1]
                    });
                  }
                } else if (swipe < -10000) {
                  // Swiped right - previous image
                  if (selectedImage.index > 0) {
                    setSelectedImage({
                      ...selectedImage,
                      index: selectedImage.index - 1,
                      src: selectedImage.images[selectedImage.index - 1]
                    });
                  }
                }
              }}
              className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center cursor-grab active:cursor-grabbing px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full pointer-events-none">
                <Image
                  src={selectedImage.src}
                  alt={`${selectedImage.alt} - View ${selectedImage.index + 1}`}
                  fill
                  className="object-contain"
                  quality={75}
                  sizes="100vw"
                  priority
                />
              </div>
            </motion.div>

            {/* Kinship Branded Label */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 pointer-events-none">
              <div
                className="inline-flex flex-col gap-1 px-3 sm:px-4 py-2 sm:py-3 bg-white/95 backdrop-blur-sm shadow-xl"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
              >
                <p
                  className="text-xs uppercase tracking-wider font-semibold"
                  style={{ color: '#5f7b4d', fontFamily: '"europa", "Hind", system-ui, sans-serif' }}
                >
                  Kinship Landing
                </p>
                <p
                  className="text-xs sm:text-sm font-medium"
                  style={{ color: '#667C58', fontFamily: '"europa", "Hind", system-ui, sans-serif' }}
                >
                  {selectedImage.alt}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ScrollEffectsWrapper>
  );
}
