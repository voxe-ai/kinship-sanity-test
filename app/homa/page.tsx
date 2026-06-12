import { Metadata } from 'next';
import { getHomaPage, getHomaMenu } from '@/lib/sanity/queries';
import { optimizeSanityData } from '@/lib/sanity/imageTransform';
import { HomaPageClient } from './HomaPageClient';

export const metadata: Metadata = {
  title: 'Homa Café + Bar',
  description: 'Great coffee. Solid cocktails. Real food. Open to neighbors and travelers alike in downtown Colorado Springs.',
};

export default async function HomaPage() {
  const [homaData, menuData] = await Promise.all([
    getHomaPage().then(optimizeSanityData),
    getHomaMenu(),
  ]);

  return <HomaPageClient homaData={homaData} menuData={menuData} />;
}
