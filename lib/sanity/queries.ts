import { client } from './client'
import type { PortableTextBlock } from '@portabletext/types'

// Types matching the Sanity schema
export interface SanityRoom {
  _id: string
  name: string
  slug: { current: string }
  category: 'suites' | 'junior' | 'family' | 'specialty'
  categoryDisplay: string
  description: string
  shortDescription?: string
  features: string[]
  bedConfiguration?: string
  isPetFriendly?: boolean
  hasBalcony?: boolean
  hasMountainView?: boolean
  hasFireplace?: boolean
  displayOrder?: number
  isActive?: boolean
  heroImage?: {
    asset: {
      _ref: string
      url: string
    }
  }
  gallery?: Array<{
    asset: {
      _ref: string
      url: string
    }
  }>
}

// Transform Sanity room to match existing RoomTeaser interface
export interface RoomTeaser {
  id: string
  name: string
  slug: string
  category: 'suites' | 'junior' | 'family' | 'specialty'
  heroImage: string
  galleryImages?: string[]
  features: string[]
  description: string
}

// GROQ query to fetch all active rooms
export const roomsQuery = `*[_type == "room" && isActive == true] | order(displayOrder asc) {
  _id,
  name,
  "slug": slug.current,
  category,
  categoryDisplay,
  description,
  shortDescription,
  features,
  bedConfiguration,
  isPetFriendly,
  hasBalcony,
  hasMountainView,
  hasFireplace,
  displayOrder,
  isActive,
  homepageGroup,
  maxOccupancy,
  "heroImage": heroImage.asset->url,
  "gallery": gallery[].asset->url
}`

// Homepage room interface (simplified for homepage display)
export interface HomepageRoom {
  _id: string
  name: string
  slug: string
  shortDescription?: string
  description: string
  heroImage: string
  gallery?: string[]
  features?: string[]
  maxOccupancy?: number
  homepageGroup?: 'king' | 'queen' | 'family' | 'campDeck'
}

// Fetch rooms for homepage display
export async function getHomepageRooms(): Promise<HomepageRoom[]> {
  const query = `*[_type == "room" && isActive == true] | order(displayOrder asc) {
    _id,
    name,
    "slug": slug.current,
    shortDescription,
    description,
    "heroImage": heroImage.asset->url,
    "gallery": gallery[].asset->url,
    features,
    maxOccupancy,
    homepageGroup
  }`
  return client.fetch(query)
}

// Fetch all rooms from Sanity
export async function getRooms(): Promise<RoomTeaser[]> {
  const sanityRooms = await client.fetch<SanityRoom[]>(roomsQuery)

  // Transform to match existing RoomTeaser interface
  return sanityRooms.map(room => ({
    id: room.slug,
    name: room.name,
    slug: room.slug,
    category: room.category,
    heroImage: room.heroImage?.asset?.url || '/images/placeholder.webp',
    galleryImages: room.gallery?.map(img => img.asset?.url).filter(Boolean) || [],
    features: room.features || [],
    description: room.description
  }))
}

// Fetch a single room by slug
export async function getRoomBySlug(slug: string): Promise<RoomTeaser | null> {
  const query = `*[_type == "room" && slug.current == $slug && isActive == true][0] {
    _id,
    name,
    "slug": slug.current,
    category,
    description,
    features,
    "heroImage": heroImage.asset->url,
    "gallery": gallery[].asset->url
  }`

  const room = await client.fetch<SanityRoom | null>(query, { slug })

  if (!room) return null

  return {
    id: room.slug,
    name: room.name,
    slug: room.slug,
    category: room.category,
    heroImage: room.heroImage?.asset?.url || '/images/placeholder.webp',
    galleryImages: room.gallery?.map(img => img.asset?.url).filter(Boolean) || [],
    features: room.features || [],
    description: room.description
  }
}

// ============================================
// SITE SETTINGS
// ============================================
export interface SiteSettings {
  siteName: string
  tagline: string
  phone: string
  email: string
  address: {
    street: string
    city: string
    state: string
    zip: string
  }
  googleMapsUrl?: string
  bookingUrl?: string
  socialLinks?: Array<{ platform: string; url: string }>
  footerText?: string
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const query = `*[_type == "siteSettings"][0] {
    siteName,
    tagline,
    phone,
    email,
    address,
    googleMapsUrl,
    bookingUrl,
    socialLinks,
    footerText
  }`
  return client.fetch(query)
}

// ============================================
// HOMEPAGE
// ============================================
export interface Homepage {
  // Hero
  heroTitle?: string
  heroSubtitle?: string | PortableTextBlock[]  // Rich text (Portable Text array)
  heroImageUrl?: string
  heroVideo?: string
  heroCtaText?: string
  heroCtaUrl?: string

  // Guide Section (Kinship is Your Guide)
  guideBackgroundImageUrl?: string
  guideStampImageUrl?: string
  guideTitle?: string
  guideParagraph1?: string | PortableTextBlock[]  // Rich text (Portable Text array)
  guideParagraph2?: string | PortableTextBlock[]  // Rich text (Portable Text array)
  guideParagraph3?: string | PortableTextBlock[]  // Rich text (Portable Text array)
  guideCta1Text?: string
  guideCta1Url?: string
  guideCta2Text?: string
  guideCta2Url?: string
  guideCta3Text?: string
  guideCta3Url?: string

  // Rooms Section
  roomsSectionTitle?: string
  roomsCtaText?: string
  roomsCtaUrl?: string
  kingRoomsLabel?: string
  kingRooms?: Array<{ _key: string; name: string; slug: string; shortDescription: string; imageUrl?: string }>
  queenRoomsLabel?: string
  queenRooms?: Array<{ _key: string; name: string; slug: string; shortDescription: string; imageUrl?: string }>
  familyRoomLabel?: string
  familyRoomName?: string
  familyRoomSlug?: string
  familyRoomDescription?: string
  familyRoomImageUrl?: string
  campDeckLabel?: string
  campDeckName?: string
  campDeckSlug?: string
  campDeckDescription?: string
  campDeckImageUrl?: string

  // Events Section
  eventsSectionImageUrl?: string
  eventsSectionTitle?: string
  eventsSectionSubtitle?: string
  eventsCtaText?: string
  eventsCtaUrl?: string
  greenhausName?: string
  greenhausCapacity?: string
  greenhausCarouselImages?: string[]
  yardName?: string
  yardCapacity?: string
  yardCarouselImages?: string[]

  // FAQ Section
  faqSectionTitle?: string
  faqItems?: {
    id: string
    question: string
    answerShort: string
    answerLong: string
  }[]

  // HOMA Café Section
  homaBackgroundImageUrl?: string
  homaLogoImageUrl?: string
  homaParagraph1?: string | PortableTextBlock[]  // Rich text (Portable Text array)
  homaParagraph2?: string | PortableTextBlock[]  // Rich text (Portable Text array)
  homaPromoTitle?: string
  homaPromoDescription?: string | PortableTextBlock[]  // Rich text (Portable Text array)
  homaPromoUrl?: string
  homaCtaText?: string
  homaCtaUrl?: string

  // Press & Reviews
  pressBackgroundMuralUrl?: string
  pressLogos?: Array<{ _key: string; name: string; logoUrl?: string; url?: string }>
  pressSectionTitle?: string
  reviewsSectionTitle?: string
  googleRating?: string
  googleReviewCount?: string

  // Newsletter
  newsletterTitle?: string
  newsletterDescription?: string | PortableTextBlock[]  // Rich text (Portable Text array)
  newsletterButtonText?: string
  newsletterDisclaimer?: string

  // Map Section (uses embedded Google Maps iframe, not an image)
  woodwallBreakImageUrl?: string
  mapSectionTitle?: string
  mapSubtitle?: string
  nearbyAttractions?: Array<{ _key: string; name: string; time: string; link?: string }>
  mapCtaText?: string
  mapCtaUrl?: string

  // SEO
  // FAQ
  faqSectionTitle?: string
  faqSectionSubtitle?: string
  faqItems?: Array<{
    _key: string
    question: string
    answerShort: string
    answerLong: string
  }>

  seoTitle?: string
  seoDescription?: string | PortableTextBlock[]  // Rich text (Portable Text array)
}

export async function getHomepage(): Promise<Homepage | null> {
  const query = `*[_type == "homepage"][0] {
    // Hero
    heroTitle,
    heroSubtitle,
    "heroImageUrl": heroImage.asset->url,
    heroVideo,
    heroCtaText,
    heroCtaUrl,

    // Guide Section
    "guideBackgroundImageUrl": guideBackgroundImage.asset->url,
    "guideStampImageUrl": guideStampImage.asset->url,
    guideTitle,
    guideParagraph1,
    guideParagraph2,
    guideParagraph3,
    guideCta1Text,
    guideCta1Url,
    guideCta2Text,
    guideCta2Url,
    guideCta3Text,
    guideCta3Url,

    // Rooms Section
    roomsSectionTitle,
    roomsCtaText,
    roomsCtaUrl,
    kingRoomsLabel,
    "kingRooms": kingRooms[]{ _key, name, slug, shortDescription, "imageUrl": image.asset->url },
    queenRoomsLabel,
    "queenRooms": queenRooms[]{ _key, name, slug, shortDescription, "imageUrl": image.asset->url },
    familyRoomLabel,
    familyRoomName,
    familyRoomSlug,
    familyRoomDescription,
    "familyRoomImageUrl": familyRoomImage.asset->url,
    campDeckLabel,
    campDeckName,
    campDeckSlug,
    campDeckDescription,
    "campDeckImageUrl": campDeckImage.asset->url,

    // Events Section
    "eventsSectionImageUrl": eventsSectionImage.asset->url,
    eventsSectionTitle,
    eventsSectionSubtitle,
    eventsCtaText,
    eventsCtaUrl,
    greenhausName,
    greenhausCapacity,
    "greenhausCarouselImages": greenhausCarouselImages[].asset->url,
    yardName,
    yardCapacity,
    "yardCarouselImages": yardCarouselImages[].asset->url,

    // FAQ Section
    faqSectionTitle,
    faqItems[] {
      id,
      question,
      answerShort,
      answerLong
    },

    // HOMA Section
    "homaBackgroundImageUrl": homaBackgroundImage.asset->url,
    "homaLogoImageUrl": homaLogoImage.asset->url,
    homaParagraph1,
    homaParagraph2,
    homaPromoTitle,
    homaPromoDescription,
    homaPromoUrl,
    homaCtaText,
    homaCtaUrl,

    // Press & Reviews
    "pressBackgroundMuralUrl": pressBackgroundMural.asset->url,
    "pressLogos": pressLogos[]{ _key, name, "logoUrl": logo.asset->url, url },
    pressSectionTitle,
    reviewsSectionTitle,
    googleRating,
    googleReviewCount,

    // Newsletter
    newsletterTitle,
    newsletterDescription,
    newsletterButtonText,
    newsletterDisclaimer,

    // Map Section (uses embedded Google Maps iframe, not an image)
    "woodwallBreakImageUrl": woodwallBreakImage.asset->url,
    mapSectionTitle,
    mapSubtitle,
    nearbyAttractions,
    mapCtaText,
    mapCtaUrl,

    // SEO
    seoTitle,
    seoDescription
  }`
  return client.fetch(query)
}

// ============================================
// EVENTS PAGE (Complete - all content editable)
// ============================================
export interface EventsTestimonial {
  _key: string
  quote: string
  name: string
}

export interface EventsFAQ {
  _key: string
  question: string
  answerShort: string
  answerLong: string
}

export interface EventsPage {
  // Hero
  heroTitle: string
  heroSubtitle?: string
  heroImage?: string

  // Gatherings
  gatheringsTitle?: string
  gatheringsDescription?: string
  gatheringsCtaText?: string
  gatheringsCtaUrl?: string
  gatheringsGallery?: string[]

  // Weddings
  weddingsTitle?: string
  weddingsDescription?: string
  weddingsDescription2?: string
  weddingsCtaText?: string
  weddingsCtaUrl?: string
  weddingsInfoDeckText?: string
  weddingsInfoDeckUrl?: string
  weddingsGallery?: string[]

  // Meetings & Retreats
  meetingsTitle?: string
  meetingsDescription?: string
  meetingsDescription2?: string
  meetingsDescription3?: string
  meetingsNote?: string
  meetingsCtaText?: string
  meetingsCtaUrl?: string
  meetingsGallery?: string[]

  // Room Blocks
  roomBlocksTitle?: string
  roomBlocksDescription?: string
  roomBlocksDescription2?: string
  roomBlocksDescription3?: string
  roomBlocksCtaText?: string
  roomBlocksCtaUrl?: string
  roomBlocksGallery?: string[]

  // Takeover
  takeoverTitle?: string
  takeoverSubtitle?: string
  takeoverDescription?: string
  takeoverDescription2?: string
  takeoverFeatures?: string[]
  takeoverCtaText?: string
  takeoverCtaUrl?: string
  takeoverGallery?: string[]

  // GreenHaus Venue
  greenhausTitle?: string
  greenhausDescription?: string
  greenhausCapacity?: string
  greenhausFeatures?: string[]
  greenhausGallery?: string[]

  // Yard Venue
  yardTitle?: string
  yardDescription?: string
  yardCapacity?: string
  yardFeatures?: string[]
  yardGallery?: string[]

  // Conference Room Venue
  conferenceRoomTitle?: string
  conferenceRoomDescription?: string
  conferenceRoomCapacity?: string
  conferenceRoomFeatures?: string[]
  conferenceRoomGallery?: string[]

  // Fireplace Venue
  fireplaceTitle?: string
  fireplaceDescription?: string
  fireplaceCapacity?: string
  fireplaceFeatures?: string[]
  fireplaceGallery?: string[]

  // Camp Deck Venue
  campDeckTitle?: string
  campDeckDescription?: string
  campDeckCapacity?: string
  campDeckFeatures?: string[]
  campDeckGallery?: string[]

  // Contact
  inquiryEmail?: string
  inquiryPhone?: string
  bookingUrl?: string

  // Testimonials
  testimonials?: EventsTestimonial[]

  // Visual Break
  visualBreakImageUrl?: string

  // FAQs
  faqSectionTitle?: string
  faqSectionSubtitle?: string
  faqItems?: EventsFAQ[]
}

export async function getEventsPage(): Promise<EventsPage | null> {
  const query = `*[_type == "eventsPage"][0] {
    // Hero
    heroTitle,
    heroSubtitle,
    "heroImage": heroImage.asset->url,

    // Gatherings
    gatheringsTitle,
    gatheringsDescription,
    gatheringsCtaText,
    gatheringsCtaUrl,
    "gatheringsGallery": gatheringsGallery[].asset->url,

    // Weddings
    weddingsTitle,
    weddingsDescription,
    weddingsDescription2,
    weddingsCtaText,
    weddingsCtaUrl,
    weddingsInfoDeckText,
    weddingsInfoDeckUrl,
    "weddingsGallery": weddingsGallery[].asset->url,

    // Meetings
    meetingsTitle,
    meetingsDescription,
    meetingsDescription2,
    meetingsDescription3,
    meetingsNote,
    meetingsCtaText,
    meetingsCtaUrl,
    "meetingsGallery": meetingsGallery[].asset->url,

    // Room Blocks
    roomBlocksTitle,
    roomBlocksDescription,
    roomBlocksDescription2,
    roomBlocksDescription3,
    roomBlocksCtaText,
    roomBlocksCtaUrl,
    "roomBlocksGallery": roomBlocksGallery[].asset->url,

    // Takeover
    takeoverTitle,
    takeoverSubtitle,
    takeoverDescription,
    takeoverDescription2,
    takeoverFeatures,
    takeoverCtaText,
    takeoverCtaUrl,
    "takeoverGallery": takeoverGallery[].asset->url,

    // GreenHaus
    greenhausTitle,
    greenhausDescription,
    greenhausCapacity,
    greenhausFeatures,
    "greenhausGallery": greenhausGallery[].asset->url,

    // Yard
    yardTitle,
    yardDescription,
    yardCapacity,
    yardFeatures,
    "yardGallery": yardGallery[].asset->url,

    // Conference Room
    conferenceRoomTitle,
    conferenceRoomDescription,
    conferenceRoomCapacity,
    conferenceRoomFeatures,
    "conferenceRoomGallery": conferenceRoomGallery[].asset->url,

    // Fireplace
    fireplaceTitle,
    fireplaceDescription,
    fireplaceCapacity,
    fireplaceFeatures,
    "fireplaceGallery": fireplaceGallery[].asset->url,

    // Camp Deck
    campDeckTitle,
    campDeckDescription,
    campDeckCapacity,
    campDeckFeatures,
    "campDeckGallery": campDeckGallery[].asset->url,

    // Contact
    inquiryEmail,
    inquiryPhone,
    bookingUrl,

    // Testimonials
    "testimonials": testimonials[]{
      _key,
      quote,
      name
    },

    // Visual Break
    "visualBreakImageUrl": visualBreakImage.asset->url,

    // FAQs
    faqSectionTitle,
    faqSectionSubtitle,
    "faqItems": faqItems[]{
      _key,
      question,
      answerShort,
      answerLong
    }
  }`
  return client.fetch(query)
}

// ============================================
// ROOMS PAGE
// ============================================
export interface RoomsPageRoom {
  _key: string
  id: string
  name: string
  slug: string
  category: 'suites' | 'junior' | 'family' | 'specialty'
  description: string | PortableTextBlock[]  // Rich text (Portable Text array)
  features?: string[]
  heroImageUrl?: string
  galleryImages?: string[]
  displayOrder?: number
  isActive?: boolean
}

export interface RoomsPageFAQ {
  _key: string
  id?: string
  question: string
  answerShort: string | PortableTextBlock[]  // Rich text (Portable Text array)
  answerLong: string | PortableTextBlock[]  // Rich text (Portable Text array)
}

export interface RoomsPage {
  // Hero
  heroTitle?: string
  heroSubtitle?: string
  heroImageUrl?: string
  heroImages?: Array<{ url: string; alt?: string }>
  heroMobileImages?: Array<{ url: string; alt?: string }>
  // Filters
  filterAllLabel?: string
  filterKingLabel?: string
  filterQueenLabel?: string
  filterFamilyLabel?: string
  filterCampDeckLabel?: string
  // Rooms
  rooms?: RoomsPageRoom[]
  // Room Blocks
  roomBlocksTitle?: string
  roomBlocksTagline?: string
  roomBlocksDescription1?: string | PortableTextBlock[]  // Rich text (Portable Text array)
  roomBlocksDescription2?: string | PortableTextBlock[]  // Rich text (Portable Text array)
  roomBlocksDescription3?: string | PortableTextBlock[]  // Rich text (Portable Text array)
  roomBlocksCtaText?: string
  roomBlocksCtaUrl?: string
  roomBlocksImage1Url?: string
  roomBlocksImage2Url?: string
  // Visual Break
  visualBreakImageUrl?: string
  // FAQ
  faqSectionTitle?: string
  faqSectionSubtitle?: string
  faqItems?: RoomsPageFAQ[]
  // SEO
  // FAQ
  faqSectionTitle?: string
  faqSectionSubtitle?: string
  faqItems?: Array<{
    _key: string
    question: string
    answerShort: string
    answerLong: string
  }>

  seoTitle?: string
  seoDescription?: string
}

export async function getRoomsPage(): Promise<RoomsPage | null> {
  const query = `*[_type == "roomsPage"][0] {
    // Hero
    heroTitle,
    heroSubtitle,
    "heroImageUrl": heroImage.asset->url,
    "heroImages": heroImages[]{ "url": asset->url, alt },
    "heroMobileImages": heroMobileImages[]{ "url": asset->url, alt },
    // Filters
    filterAllLabel,
    filterKingLabel,
    filterQueenLabel,
    filterFamilyLabel,
    filterCampDeckLabel,
    // Rooms
    "rooms": rooms[isActive == true] | order(displayOrder asc) {
      _key,
      id,
      name,
      slug,
      category,
      description,
      features,
      "heroImageUrl": heroImage.asset->url,
      "galleryImages": gallery[].asset->url,
      displayOrder,
      isActive
    },
    // Room Blocks
    roomBlocksTitle,
    roomBlocksTagline,
    roomBlocksDescription1,
    roomBlocksDescription2,
    roomBlocksDescription3,
    roomBlocksCtaText,
    roomBlocksCtaUrl,
    "roomBlocksImage1Url": roomBlocksImage1.asset->url,
    "roomBlocksImage2Url": roomBlocksImage2.asset->url,
    // Visual Break
    "visualBreakImageUrl": visualBreakImage.asset->url,
    // FAQ
    faqSectionTitle,
    faqSectionSubtitle,
    "faqItems": faqItems[]{
      _key,
      id,
      question,
      answerShort,
      answerLong
    },
    // SEO
    seoTitle,
    seoDescription
  }`
  return client.fetch(query)
}

// ============================================
// HOMA PAGE & MENU
// ============================================
export interface HomaPage {
  // Hero
  heroTitle?: string
  heroCtaMenuText?: string
  heroCtaMenuUrl?: string
  heroCtaPromosText?: string
  heroCtaPromosUrl?: string
  heroTriptychImage1Url?: string
  heroTriptychImage2Url?: string
  heroTriptychImage3Url?: string
  // Mobile Hero Images (Portrait-Friendly)
  heroMobileImage1Url?: string
  heroMobileImage2Url?: string
  heroMobileImage3Url?: string
  heroMobileImage4Url?: string
  // About
  aboutParagraph1?: string
  aboutParagraph2?: string
  aboutParagraph3?: string
  // Specials
  specialsSectionTitle?: string
  happyHourTitle?: string
  happyHourBadge?: string
  happyHourTime?: string
  happyHourSpecials?: Array<{ price: string; item: string }>
  happyHourCtaText?: string
  happyHourImageUrl?: string
  brunchTitle?: string
  brunchBadge?: string
  brunchTime?: string
  brunchDescription?: string
  brunchCtaText?: string
  brunchMenuPdfUrl?: string
  brunchImageUrl?: string
  eventsTitle?: string
  eventsBadge?: string
  eventsDescription?: string
  eventsCtaText?: string
  eventsCtaUrl?: string
  eventsImageUrl?: string
  // Promos
  promoBannerImageUrl?: string
  loyaltyCardImageUrl?: string
  promos?: Array<{
    title: string
    description: string
    badge?: string
    ctaText?: string
    ctaUrl?: string
    imageUrl?: string
  }>
  // Hours
  hoursSectionTitle?: string
  hoursSubtitle?: string
  address?: string
  phone?: string
  hours?: Array<{ label: string; days: string; hours: string }>
  reservationUrl?: string
  menuPdfUrl?: string
  // Seating
  seatingSectionTitle?: string
  seatingDescription?: string
  seatingImages?: string[]
  cateringMenuPdfUrl?: string
  // FAQ
  faqSectionTitle?: string
  faqSectionSubtitle?: string
  faqItems?: Array<{
    question: string
    answerShort: string
    answerLong: string
  }>
  // Loyalty
  loyaltyTitle?: string
  loyaltyDescription?: string
  loyaltyCtaText?: string
  loyaltyCtaUrl?: string
  loyaltyFineprint?: string
  loyaltyImageUrl?: string
  // SEO
  // FAQ
  faqSectionTitle?: string
  faqSectionSubtitle?: string
  faqItems?: Array<{
    _key: string
    question: string
    answerShort: string
    answerLong: string
  }>

  seoTitle?: string
  seoDescription?: string
}

export interface MenuItem {
  _id: string
  name: string
  description?: string
  price?: number
  category: string
  isAvailable: boolean
  isPopular?: boolean
}

export async function getHomaPage(): Promise<HomaPage | null> {
  const query = `*[_type == "homaPage"][0] {
    heroTitle,
    heroCtaMenuText,
    heroCtaMenuUrl,
    heroCtaPromosText,
    heroCtaPromosUrl,
    "heroTriptychImage1Url": heroTriptychImage1.asset->url,
    "heroTriptychImage2Url": heroTriptychImage2.asset->url,
    "heroTriptychImage3Url": heroTriptychImage3.asset->url,
    // Mobile Hero Images
    "heroMobileImage1Url": heroMobileImage1.asset->url,
    "heroMobileImage2Url": heroMobileImage2.asset->url,
    "heroMobileImage3Url": heroMobileImage3.asset->url,
    "heroMobileImage4Url": heroMobileImage4.asset->url,
    aboutParagraph1,
    aboutParagraph2,
    aboutParagraph3,
    specialsSectionTitle,
    happyHourTitle,
    happyHourBadge,
    happyHourTime,
    happyHourSpecials,
    happyHourCtaText,
    "happyHourImageUrl": happyHourImage.asset->url,
    brunchTitle,
    brunchBadge,
    brunchTime,
    brunchDescription,
    brunchCtaText,
    "brunchMenuPdfUrl": brunchMenuPdf.asset->url,
    "brunchImageUrl": brunchImage.asset->url,
    eventsTitle,
    eventsBadge,
    eventsDescription,
    eventsCtaText,
    eventsCtaUrl,
    "eventsImageUrl": eventsImage.asset->url,
    "promoBannerImageUrl": promoBannerImage.asset->url,
    "loyaltyCardImageUrl": loyaltyCardImage.asset->url,
    "promos": promos[]{ title, description, badge, ctaText, ctaUrl, "imageUrl": image.asset->url },
    hoursSectionTitle,
    hoursSubtitle,
    address,
    phone,
    hours,
    reservationUrl,
    menuPdfUrl,
    seatingSectionTitle,
    seatingDescription,
    "seatingImages": seatingImages[].asset->url,
    "cateringMenuPdfUrl": cateringMenuPdf.asset->url,
    faqSectionTitle,
    faqSectionSubtitle,
    faqItems,
    loyaltyTitle,
    loyaltyDescription,
    loyaltyCtaText,
    loyaltyCtaUrl,
    loyaltyFineprint,
    "loyaltyImageUrl": loyaltyImage.asset->url,
    seoTitle,
    seoDescription
  }`
  return client.fetch(query)
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const query = `*[_type == "menuItem" && isAvailable == true] | order(category asc, name asc) {
    _id,
    name,
    description,
    price,
    category,
    isAvailable,
    isPopular
  }`
  return client.fetch(query)
}

// ============================================
// HOMA MENU (editable via the dedicated Homa Menu studio)
// ============================================
export interface HomaMenuItem {
  name: string
  description?: string
  price: string
  addOns?: string
}
export interface HomaMenuCategory {
  id: string
  title: string
  subtitle?: string
  addOns?: string
  items: HomaMenuItem[]
}
export async function getHomaMenu(): Promise<HomaMenuCategory[]> {
  const query = `*[_id == "homaMenu"][0].categories[]{
    "id": categoryId,
    title,
    subtitle,
    addOns,
    "items": items[]{ name, description, "price": coalesce(price, ""), addOns }
  }`
  return (await client.fetch<HomaMenuCategory[] | null>(query)) || []
}

// ============================================
// ABOUT PAGE (Complete - all content editable)
// ============================================
export interface AboutPage {
  // Hero
  heroTitle?: string
  heroSubtitle?: string
  heroImageUrl?: string
  // Video
  videoUrl?: string
  videoTitle?: string
  // Story
  storyTitle?: string
  storyParagraph1?: string
  storyParagraph2?: string
  storyParagraph3?: string
  storyParagraph4?: string
  storyParagraph5?: string
  missionImageUrl?: string
  missionTitle?: string
  missionStatement?: string
  missionPillars?: Array<{ title: string; description: string }>
  // Values
  valuesTitle?: string
  valuesIntro?: string
  values?: Array<{ _key: string; number: number; title: string; description: string }>
  valuesImageUrl?: string
  // Milestones
  milestonesTitle?: string
  milestones?: Array<{ _key: string; year: string; title: string; description: string }>
  // Contact
  contactTitle?: string
  contactPhone?: string
  contactEmail?: string
  contactAddress?: string
  googleMapsUrl?: string
  // SEO
  // FAQ
  faqSectionTitle?: string
  faqSectionSubtitle?: string
  faqItems?: Array<{
    _key: string
    question: string
    answerShort: string
    answerLong: string
  }>

  seoTitle?: string
  seoDescription?: string
}

export async function getAboutPage(): Promise<AboutPage | null> {
  const query = `*[_type == "aboutPage"][0] {
    heroTitle,
    heroSubtitle,
    "heroImageUrl": heroImage.asset->url,
    videoUrl,
    videoTitle,
    storyTitle,
    storyParagraph1,
    storyParagraph2,
    storyParagraph3,
    storyParagraph4,
    storyParagraph5,
    "missionImageUrl": missionImage.asset->url,
    missionTitle,
    missionStatement,
    missionPillars,
    valuesTitle,
    valuesIntro,
    values,
    "valuesImageUrl": valuesImage.asset->url,
    milestonesTitle,
    milestones,
    contactTitle,
    contactPhone,
    contactEmail,
    contactAddress,
    googleMapsUrl,
    seoTitle,
    seoDescription
  }`
  return client.fetch(query)
}

// ============================================
// EXPLORE PAGE (Complete - all content editable)
// ============================================
export interface ExplorePage {
  // Hero
  heroTitle?: string
  heroSubtitle?: string
  heroImageUrl?: string
  introText?: string

  // Section Break Images
  speakeasiesBreakImageUrl?: string
  entertainmentBreakImageUrl?: string
  eatsBreakImageUrl?: string
  wellnessBreakImageUrl?: string
  coffeeBreakImageUrl?: string
  dessertsBreakImageUrl?: string

  // Speakeasies
  speakeasiesTitle?: string
  speakeasiesIntro?: string
  speakeasies?: Array<{
    _key: string
    name: string
    description: string
    address?: string
    howToFind?: string
    suggestedDrink?: string
    link?: string
    imageUrl?: string
  }>

  // Entertainment
  entertainmentTitle?: string
  liveMusic?: Array<{ _key: string; name: string; description: string; link?: string }>
  performingArts?: Array<{ _key: string; name: string; description: string; link?: string }>
  comedy?: Array<{ _key: string; name: string; description: string; link?: string }>
  artClasses?: Array<{ _key: string; name: string; description: string; link?: string }>
  cooking?: Array<{ _key: string; name: string; description: string; link?: string }>

  // Eats Nearby
  eatsTitle?: string
  eatsNearby?: Array<{
    _key: string
    name: string
    distance?: string
    description: string
    link?: string
    linkText?: string
    imageUrl?: string
  }>

  // Coffee Shops
  coffeeTitle?: string
  coffeeShops?: Array<{
    _key: string
    name: string
    distance?: string
    whatToGet?: string
    link?: string
    imageUrl?: string
  }>

  // Desserts
  dessertsTitle?: string
  desserts?: Array<{
    _key: string
    name: string
    description: string
    distance?: string
    suggested?: string
    link?: string
    imageUrl?: string
  }>

  // Wellness
  wellnessTitle?: string
  wellness?: Array<{
    _key: string
    name: string
    description: string
    link?: string
    imageUrl?: string
  }>

  // SEO
  // FAQ
  faqSectionTitle?: string
  faqSectionSubtitle?: string
  faqItems?: Array<{
    _key: string
    question: string
    answerShort: string
    answerLong: string
  }>

  seoTitle?: string
  seoDescription?: string
}

export async function getExplorePage(): Promise<ExplorePage | null> {
  const query = `*[_type == "explorePage"][0] {
    heroTitle,
    heroSubtitle,
    "heroImageUrl": heroImage.asset->url,
    introText,
    "speakeasiesBreakImageUrl": speakeasiesBreakImage.asset->url,
    "entertainmentBreakImageUrl": entertainmentBreakImage.asset->url,
    "eatsBreakImageUrl": eatsBreakImage.asset->url,
    "wellnessBreakImageUrl": wellnessBreakImage.asset->url,
    "coffeeBreakImageUrl": coffeeBreakImage.asset->url,
    "dessertsBreakImageUrl": dessertsBreakImage.asset->url,
    speakeasiesTitle,
    speakeasiesIntro,
    "speakeasies": speakeasies[]{ _key, name, description, address, howToFind, suggestedDrink, link, "imageUrl": image.asset->url },
    entertainmentTitle,
    liveMusic,
    performingArts,
    comedy,
    artClasses,
    cooking,
    eatsTitle,
    "eatsNearby": eatsNearby[]{ _key, name, distance, description, link, linkText, "imageUrl": image.asset->url },
    coffeeTitle,
    "coffeeShops": coffeeShops[]{ _key, name, distance, whatToGet, link, "imageUrl": image.asset->url },
    dessertsTitle,
    "desserts": desserts[]{ _key, name, description, distance, suggested, link, "imageUrl": image.asset->url },
    wellnessTitle,
    "wellness": wellness[]{ _key, name, description, link, "imageUrl": image.asset->url },
    faqSectionTitle,
    faqSectionSubtitle,
    "faqItems": faqItems[]{ _key, question, answerShort, answerLong },
    seoTitle,
    seoDescription
  }`
  return client.fetch(query)
}

// ============================================
// GALLERY PAGE (Complete - all content editable)
// ============================================
export interface GalleryPageImage {
  _key: string
  imageUrl: string
  alt?: string
  category?: string
}

export interface GalleryPageFAQ {
  _key: string
  question: string
  answerShort: string
  answerLong: string
}

export interface GalleryPage {
  // Hero
  heroTitle?: string
  heroSubtitle?: string
  heroImageUrl?: string
  // Intro
  introBadge?: string
  introTitle?: string
  introText?: string
  // Filters
  filterAllLabel?: string
  filterRoomsLabel?: string
  filterVenuesLabel?: string
  filterHomaLabel?: string
  filterOutdoorsLabel?: string
  filterWeddingsLabel?: string
  // Gallery Images
  galleryImages?: GalleryPageImage[]
  // FAQ
  faqSectionTitle?: string
  faqSectionSubtitle?: string
  faqItems?: GalleryPageFAQ[]
  // SEO
  // FAQ
  faqSectionTitle?: string
  faqSectionSubtitle?: string
  faqItems?: Array<{
    _key: string
    question: string
    answerShort: string
    answerLong: string
  }>

  seoTitle?: string
  seoDescription?: string
}

export interface GalleryImage {
  _id: string
  title?: string
  category?: string
  imageUrl: string
  alt?: string
}

export async function getGalleryPage(): Promise<GalleryPage | null> {
  const query = `*[_type == "galleryPage"][0] {
    // Hero
    heroTitle,
    heroSubtitle,
    "heroImageUrl": heroImage.asset->url,
    // Intro
    introBadge,
    introTitle,
    introText,
    // Filters
    filterAllLabel,
    filterRoomsLabel,
    filterVenuesLabel,
    filterHomaLabel,
    filterOutdoorsLabel,
    filterWeddingsLabel,
    // Gallery Images
    "galleryImages": galleryImages[] {
      _key,
      "imageUrl": image.asset->url,
      alt,
      category
    },
    // FAQ
    faqSectionTitle,
    faqSectionSubtitle,
    faqItems[] {
      _key,
      question,
      answerShort,
      answerLong
    },
    // SEO
    seoTitle,
    seoDescription
  }`
  return client.fetch(query)
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const query = `*[_type == "galleryImage" && isActive == true] | order(displayOrder asc) {
    _id,
    title,
    category,
    "imageUrl": image.asset->url,
    "alt": image.alt
  }`
  return client.fetch(query)
}

// ============================================
// CAREERS PAGE (Complete - all content editable)
// ============================================
export interface WhyJoinReason {
  _key: string
  title: string
  description: string
}

export interface CareersPage {
  // Hero
  heroTitle?: string
  heroSubtitle?: string
  heroImageUrl?: string
  // Introduction
  introTitle?: string
  introText?: string
  // Why Join
  whyJoinTitle?: string
  whyJoinReasons?: WhyJoinReason[]
  // Benefits
  benefitsTitle?: string
  benefitsList?: string[]
  // CTA
  ctaTitle?: string
  ctaText?: string
  ctaButtonText?: string
  ctaButtonUrl?: string
  // SEO
  // FAQ
  faqSectionTitle?: string
  faqSectionSubtitle?: string
  faqItems?: Array<{
    _key: string
    question: string
    answerShort: string
    answerLong: string
  }>

  seoTitle?: string
  seoDescription?: string
}

export interface JobPosting {
  _id: string
  title: string
  department?: string
  type?: string
  description: string
  requirements?: string[]
  isActive: boolean
}

export async function getCareersPage(): Promise<CareersPage | null> {
  const query = `*[_type == "careersPage"][0] {
    heroTitle,
    heroSubtitle,
    "heroImageUrl": heroImage.asset->url,
    introTitle,
    introText,
    whyJoinTitle,
    whyJoinReasons,
    benefitsTitle,
    benefitsList,
    ctaTitle,
    ctaText,
    ctaButtonText,
    ctaButtonUrl,
    seoTitle,
    seoDescription
  }`
  return client.fetch(query)
}

export async function getJobPostings(): Promise<JobPosting[]> {
  const query = `*[_type == "jobPosting" && isActive == true] | order(title asc) {
    _id,
    title,
    department,
    type,
    description,
    requirements,
    isActive
  }`
  return client.fetch(query)
}

// ============================================
// OFFERS PAGE (Complete - all content editable including images)
// ============================================

// Portable Text block type (for rich text fields)
export interface PortableTextBlock {
  _type: string
  _key?: string
  children?: Array<{
    _type: string
    _key?: string
    text?: string
    marks?: string[]
  }>
  style?: string
  listItem?: string
  markDefs?: Array<{
    _type: string
    _key: string
    href?: string
    openInNewTab?: boolean
  }>
}

export interface OffersPageOffer {
  _key: string
  title: string
  imageUrl?: string
  alt?: string
  description?: PortableTextBlock[]  // Rich text (Portable Text array)
  bookingUrl?: string
  isActive?: boolean
}

export interface OffersPage {
  // Hero
  heroTitle?: string
  heroSubtitle?: string
  heroImageUrl?: string
  // Introduction
  introBadge?: string
  introTitle?: string
  introText?: PortableTextBlock[]  // Rich text (Portable Text array)
  // Offers array with images
  offers?: OffersPageOffer[]
  // SEO
  // FAQ
  faqSectionTitle?: string
  faqSectionSubtitle?: string
  faqItems?: Array<{
    _key: string
    question: string
    answerShort: string
    answerLong: string
  }>

  seoTitle?: string
  seoDescription?: string
}

export async function getOffersPage(): Promise<OffersPage | null> {
  const query = `*[_type == "offersPage"][0] {
    // Hero
    heroTitle,
    heroSubtitle,
    "heroImageUrl": heroImage.asset->url,
    // Introduction
    introBadge,
    introTitle,
    introText,
    // Offers array with image projections
    "offers": offers[isActive == true]{
      _key,
      title,
      "imageUrl": image.asset->url,
      alt,
      description,
      bookingUrl,
      isActive
    },
    // SEO
    seoTitle,
    seoDescription
  }`
  return client.fetch(query)
}

// ============================================
// COMMUNITY PAGE (Complete - all content editable)
// ============================================
export interface CommunityEvent {
  _key: string
  title: string
  description?: string
  imageUrl?: string
  alt?: string
  eventUrl?: string
  buttonText?: string
  isActive?: boolean
}

export interface CommunityPage {
  // Hero
  heroTitle?: string
  heroSubtitle?: string
  heroImageUrl?: string
  // Intro
  introBadge?: string
  introTitle?: string
  introText?: string
  description?: string
  // Events
  events?: CommunityEvent[]
  // No Events Message (shown when events array is empty)
  noEventsTitle?: string
  noEventsMessage?: string
  // SEO
  // FAQ
  faqSectionTitle?: string
  faqSectionSubtitle?: string
  faqItems?: Array<{
    _key: string
    question: string
    answerShort: string
    answerLong: string
  }>

  seoTitle?: string
  seoDescription?: string
}

export async function getCommunityPage(): Promise<CommunityPage | null> {
  const query = `*[_type == "communityPage"][0] {
    heroTitle,
    heroSubtitle,
    "heroImageUrl": heroImage.asset->url,
    introBadge,
    introTitle,
    introText,
    description,
    "events": events[] {
      _key,
      title,
      description,
      "imageUrl": image.asset->url,
      alt,
      eventUrl,
      buttonText,
      isActive
    },
    noEventsTitle,
    noEventsMessage,
    seoTitle,
    seoDescription
  }`
  return client.fetch(query)
}

// ============================================
// POLICIES PAGE (Complete - all content editable)
// ============================================
export interface PolicySection {
  _key: string
  title: string
  content: string
  bulletPoints?: string[]
  isHighlighted?: boolean
}

export interface PoliciesPage {
  // Hero
  heroTitle?: string
  heroSubtitle?: string
  // Policies array
  policies?: PolicySection[]
  // Contact
  contactTitle?: string
  contactText?: string
  contactEmail?: string
  contactPhone?: string
  // SEO
  // FAQ
  faqSectionTitle?: string
  faqSectionSubtitle?: string
  faqItems?: Array<{
    _key: string
    question: string
    answerShort: string
    answerLong: string
  }>

  seoTitle?: string
  seoDescription?: string
}

export async function getPoliciesPage(): Promise<PoliciesPage | null> {
  const query = `*[_type == "policiesPage"][0] {
    heroTitle,
    heroSubtitle,
    policies[] {
      _key,
      title,
      content,
      bulletPoints,
      isHighlighted
    },
    contactTitle,
    contactText,
    contactEmail,
    contactPhone,
    seoTitle,
    seoDescription
  }`
  return client.fetch(query)
}

// ============================================
// PRIVACY PAGE (Complete - all content editable)
// ============================================
export interface PrivacyPage {
  // Hero
  heroTitle?: string
  heroSubtitle?: string
  // Content
  paragraph1?: string
  paragraph2?: string
  lastUpdated?: string
  // Contact
  contactTitle?: string
  contactText?: string
  contactEmail?: string
  contactPhone?: string
  contactAddress?: string
  // SEO
  // FAQ
  faqSectionTitle?: string
  faqSectionSubtitle?: string
  faqItems?: Array<{
    _key: string
    question: string
    answerShort: string
    answerLong: string
  }>

  seoTitle?: string
  seoDescription?: string
}

export async function getPrivacyPage(): Promise<PrivacyPage | null> {
  const query = `*[_type == "privacyPage"][0] {
    heroTitle,
    heroSubtitle,
    paragraph1,
    paragraph2,
    lastUpdated,
    contactTitle,
    contactText,
    contactEmail,
    contactPhone,
    contactAddress,
    seoTitle,
    seoDescription
  }`
  return client.fetch(query)
}

// ============================================
// ACCESSIBILITY PAGE (Complete - all content editable)
// ============================================
export interface AccessibilityPage {
  // Hero
  heroTitle?: string
  heroSubtitle?: string
  // Website Accessibility
  websiteTitle?: string
  websiteParagraph1?: string
  websiteParagraph2?: string
  issueTitle?: string
  issueText?: string
  // ADA
  adaTitle?: string
  adaIntro?: string
  amenitiesTitle?: string
  amenities?: string[]
  // Contact
  contactTitle?: string
  contactText?: string
  contactEmail?: string
  contactPhone?: string
  // SEO
  // FAQ
  faqSectionTitle?: string
  faqSectionSubtitle?: string
  faqItems?: Array<{
    _key: string
    question: string
    answerShort: string
    answerLong: string
  }>

  seoTitle?: string
  seoDescription?: string
}

export async function getAccessibilityPage(): Promise<AccessibilityPage | null> {
  const query = `*[_type == "accessibilityPage"][0] {
    heroTitle,
    heroSubtitle,
    websiteTitle,
    websiteParagraph1,
    websiteParagraph2,
    issueTitle,
    issueText,
    adaTitle,
    adaIntro,
    amenitiesTitle,
    amenities,
    contactTitle,
    contactText,
    contactEmail,
    contactPhone,
    seoTitle,
    seoDescription
  }`
  return client.fetch(query)
}

// Press mentions are now part of Homepage.pressLogos - no separate document type
