'use client';

import { motion } from 'framer-motion';
import { BackgroundMedia } from './BackgroundMedia';
import { BookingWidget } from './BookingWidget';
import { InlineTestimonials } from './InlineTestimonials';
import { KINSHIP_COLORS, KINSHIP_FONTS } from '@/lib/config/brand';
import { transformSanityUrl } from '@/lib/sanity/imageTransform';
import { content } from '@/content/copy';
import type { PortableTextBlock } from '@portabletext/types';

// Review structure matching Sanity featuredReviews
interface Review {
  quote: string;
  author?: string;
  source?: string;
  rating: number;
}

interface HeroSectionProps {
  headline?: string;
  subheadline?: string | PortableTextBlock[];  // Rich text support
  reviews?: Review[];  // From Sanity featuredReviews
  heroVideoUrl?: string;  // From Sanity heroVideo
  heroImageUrl?: string;  // From Sanity heroImage (fallback while video loads)
}

// Fallback headline (matches current hardcoded value)
const fallbackHeadline = 'Experience Colorado Springs like a local';

/**
 * Enhanced HeroSection Component
 * Purpose: Create a welcoming first impression that makes guests feel understood
 * Mobile-first: Stacked layout on mobile, side-by-side on desktop
 * Structure: Background layer -> Content layer (text + booking) + minimal review strip
 */
// Fallback media (current hardcoded values)
const fallbackVideoUrl = 'https://storage.googleapis.com/msgsndr/ZSnKlb7yt1OZGmrCwL7T/media/68defb5cd6c63ec71789ef67.mp4';
const fallbackImageUrl = '/images/HomePage/hero-poster-kinship-landing.webp';

export function HeroSection({ headline, subheadline, reviews, heroVideoUrl, heroImageUrl }: HeroSectionProps) {
  // Format headline: insert line break after "Colorado" for display
  const displayHeadline = (headline || fallbackHeadline).replace('Colorado Springs', 'Colorado\nSprings');
  // Hero video with fallback image - use Sanity values or fallbacks
  const heroVideo = heroVideoUrl || fallbackVideoUrl;
  const heroImageFallback = heroImageUrl 
    ? transformSanityUrl(heroImageUrl, { width: 1200, quality: 85, autoFormat: true })
    : fallbackImageUrl;

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* 1. BACKGROUND LAYER with video */}
      <BackgroundMedia
        type="video"
        source={heroVideo}
        fallback={heroImageFallback}
        overlayOpacity={0.25}
      />

      {/* 2. CONTENT LAYER - Mobile-first responsive layout */}
      <div className="relative min-h-screen flex flex-col justify-end sm:justify-center">
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-12 pt-10 sm:py-24 lg:py-0">
          <div className="w-full lg:pl-8 lg:pr-8">

            {/* Flex container - Stack on mobile, side-by-side on desktop */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-20">

              {/* Left Side: Welcome Content (expanded for proper text flow) */}
              <motion.div
                className="flex-1 lg:flex-[0.6] text-center lg:text-left"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.34, 1.56, 0.64, 1], // Spring easing for welcoming feel
                }}
              >
                {/* Main Headline - Let text flow horizontally with breathing room */}
                <h1
                  className="text-white font-serif font-semibold leading-[1.05] flex items-end sm:items-center pb-2 sm:pb-0"
                  style={{
                    fontFamily: KINSHIP_FONTS.heading,
                    textShadow: 'rgba(0, 0, 0, 0.4) 0px 4px 8px',
                    fontSize: 'clamp(32px, 5.5vw, 68px)',
                    minHeight: 'auto',
                    marginBottom: '1rem',
                  }}
                >
                  <span style={{ whiteSpace: 'pre-line' }}>
                    {displayHeadline}
                  </span>
                </h1>

                {/* Rotating Testimonials - Replace tagline with authentic guest voices */}
                <InlineTestimonials tagline={subheadline} reviews={reviews} />

              </motion.div>

              {/* Right Side: Booking Widget - positioned right with breathing room */}
              <div className="flex-1 lg:flex-none flex justify-center lg:justify-end">
                <div className="w-full max-w-md lg:max-w-none">
                  {/* Mobile/tablet: simple, GA4-friendly Book Now button above the fold.
                      Desktop shows the full booking widget below instead. */}
                  <a
                    href="https://direct-book.com/properties/kinshiplanding"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Book your stay at Kinship Landing"
                    onClick={() => {
                      if (typeof window !== 'undefined' && (window as any).gtag) {
                        (window as any).gtag('event', 'mobile_book_click', { location: 'hero' });
                      }
                    }}
                    className="lg:hidden block w-full text-center px-6 py-4 text-base font-bold uppercase tracking-wider text-white transition-transform duration-200 active:scale-[0.98]"
                    style={{
                      backgroundColor: KINSHIP_COLORS.green,
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.18)',
                      fontFamily: KINSHIP_FONTS.body,
                    }}
                  >
                    Book Now
                  </a>
                  {/* Desktop Booking Widget - pulled further from right */}
                  <div className="hidden lg:block lg:mr-40">
                    <BookingWidget
                      onBookingInitiated={(data) => {
                        if (typeof window !== 'undefined' && (window as any).gtag) {
                          (window as any).gtag('event', 'booking_started', {
                            checkin: data.checkIn,
                            checkout: data.checkOut,
                            guests: data.guests,
                            source: 'hero_widget'
                          });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}