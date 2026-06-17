import { Metadata } from 'next';
import { getExplorePage, getExploreSections } from '@/lib/sanity/queries';
import { optimizeSanityData } from '@/lib/sanity/imageTransform';
import { ExplorePageClient } from './ExplorePageClient';
import { ExploreGeneric } from './ExploreGeneric';

export const metadata: Metadata = {
  title: 'Explore Colorado Springs',
  description: 'Discover hidden gems, speakeasies, local restaurants, coffee shops, entertainment venues, and wellness experiences near Kinship Landing in downtown Colorado Springs.',
};

export default async function ExplorePage() {
  const [exploreRaw, sectionsRaw] = await Promise.all([getExplorePage(), getExploreSections()]);
  const exploreData = optimizeSanityData(exploreRaw);
  const sectionsDoc = optimizeSanityData(sectionsRaw);

  // Prefer the generic, client-editable Explore sections when they exist.
  // Falls back to the original bespoke page if the sections doc is empty/unavailable.
  if (sectionsDoc && Array.isArray(sectionsDoc.sections) && sectionsDoc.sections.length > 0) {
    return <ExploreGeneric exploreData={exploreData} sectionsDoc={sectionsDoc} />;
  }
  return <ExplorePageClient exploreData={exploreData} />;
}
