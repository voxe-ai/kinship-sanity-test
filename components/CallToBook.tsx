'use client';

import { useEffect, useState } from 'react';

export function CallToBook() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Mobile-only sticky booking button
  return (
    <div
      aria-hidden={!isClient}
      className="sm:hidden fixed inset-x-0 bottom-0 z-50 pointer-events-none"
    >
      <div className="pointer-events-auto px-3 pb-3 safe-area-bottom">
          <div className="mx-auto max-w-[640px]">
            <a
              href="https://direct-book.com/properties/kinshiplanding"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Book your stay at Kinship Landing"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'mobile_book_click', { location: 'sticky' });
                }
              }}
              className="block w-full text-center px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                backgroundColor: '#667C58',
                color: '#ffffff',
                border: '1px solid #667C58',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)'
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.backgroundColor = '#556649';
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.backgroundColor = '#667C58';
              }}
            >
              Book Now
            </a>
          </div>
        </div>
    </div>
  );
}
