'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookingWidgetProps } from './types';
import { KINSHIP_COLORS, KINSHIP_FONTS } from '@/lib/config/brand';
import { BrandedCalendar } from './BrandedCalendar';

/**
 * Enhanced BookingWidget Component
 * Purpose: Make booking feel effortless and welcoming, not transactional
 * Mobile-first: Full-width on mobile, glassmorphic card on desktop
 * 40% larger than current implementation for better usability
 */
export function BookingWidget({ className = '', onBookingInitiated }: BookingWidgetProps) {
  // Calendar visibility states
  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
  const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false);

  // Get today and tomorrow dates
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return { day: '--', month: '---' };
    const date = new Date(dateString + 'T00:00:00');
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return { day, month };
  };

  const [checkIn, setCheckIn] = useState(formatDate(today));
  const [checkOut, setCheckOut] = useState(formatDate(tomorrow));
  const [guests, setGuests] = useState('2');
  const [rooms, setRooms] = useState('1');
  const [showPromo, setShowPromo] = useState(false);
  const [promo, setPromo] = useState('');

  // Min date for validation
  const todayString = formatDate(today);

  // Update check-out date if check-in changes to be after it
  useEffect(() => {
    if (checkIn && checkOut && new Date(checkIn) >= new Date(checkOut)) {
      const nextDay = new Date(checkIn);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOut(formatDate(nextDay));
    }
  }, [checkIn]);

  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile so the booking link opens in-place on phones (new tab on desktop),
  // matching the previous UX while still using a standard, trackable link.
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Build the SiteMinder booking URL reactively from the current selection.
  // Rendering this as a real <a href> (below) lets GA4 + Google Ads cross-domain
  // auto-linking append _gl / gclid to the outbound URL. A JavaScript form submit
  // (the previous approach) bypassed that, breaking session + conversion tracking.
  const bookingUrl = useMemo(() => {
    const baseUrl = 'https://direct-book.com/properties/kinshiplanding';
    const params = new URLSearchParams();

    params.append('locale', 'en');
    params.append('currency', 'USD');
    if (checkIn) params.append('checkInDate', checkIn);
    if (checkOut) params.append('checkOutDate', checkOut);
    // Each room is a separate items[] entry with its own guest counts
    const roomCount = parseInt(rooms) || 1;
    for (let i = 0; i < roomCount; i++) {
      params.append(`items[${i}][adults]`, guests);
      params.append(`items[${i}][children]`, '0');
      params.append(`items[${i}][infants]`, '0');
    }
    params.append('trackPage', 'yes');
    if (promo) params.append('promotion_code', promo);

    return `${baseUrl}?${params.toString()}`;
  }, [checkIn, checkOut, guests, rooms, promo]);

  const handleBookingClick = () => {
    // Track booking initiation. Intentionally does NOT preventDefault — the browser
    // performs the standard navigation so GA4 / Google Ads can decorate the link.
    if (onBookingInitiated) {
      onBookingInitiated({ checkIn, checkOut, guests, rooms, promo });
    }
  };

  return (
    <motion.div
      className={`
        w-full lg:w-[300px]
        bg-white/95 lg:bg-white/90
        backdrop-blur-sm
        shadow-md
        p-4 lg:p-5
        ${className}
      `}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.2,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      whileHover={{ scale: 1.01 }}
      style={{
        minHeight: '240px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Minimal Header */}
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-800 uppercase tracking-wider">
          Book Direct
        </h3>
      </div>

      <div className="space-y-4">
        {/* Date inputs - side by side on all devices */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="checkin"
              className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2"
              style={{ fontFamily: KINSHIP_FONTS.body }}
            >
              Check In
            </label>
            <div className="relative">
              <div
                onClick={() => setShowCheckInCalendar(!showCheckInCalendar)}
                className={`w-full px-3 py-2 border border-gray-200 bg-gray-50 hover:bg-white hover:border-[#849e74] transition-all cursor-pointer flex flex-col items-center justify-center ${
                  showCheckInCalendar ? 'border-[#849e74] ring-2 ring-[#849e74]/20' : ''
                }`}
                style={{ fontFamily: KINSHIP_FONTS.body, minHeight: '56px' }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowCheckInCalendar(!showCheckInCalendar);
                  }
                }}
              >
                <div className="text-2xl font-bold" style={{ color: KINSHIP_COLORS.greenDark }}>
                  {formatDisplayDate(checkIn).day}
                </div>
                <div className="text-xs uppercase tracking-wider" style={{ color: KINSHIP_COLORS.greenDark, opacity: 0.8 }}>
                  {formatDisplayDate(checkIn).month}
                </div>
              </div>
              <BrandedCalendar
                value={checkIn}
                onChange={(date) => {
                  setCheckIn(date);
                  setShowCheckInCalendar(false);
                }}
                minDate={todayString}
                isOpen={showCheckInCalendar}
                onClose={() => setShowCheckInCalendar(false)}
                position="left"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="checkout"
              className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2"
              style={{ fontFamily: KINSHIP_FONTS.body }}
            >
              Check Out
            </label>
            <div className="relative">
              <div
                onClick={() => setShowCheckOutCalendar(!showCheckOutCalendar)}
                className={`w-full px-3 py-2 border border-gray-200 bg-gray-50 hover:bg-white hover:border-[#849e74] transition-all cursor-pointer flex flex-col items-center justify-center ${
                  showCheckOutCalendar ? 'border-[#849e74] ring-2 ring-[#849e74]/20' : ''
                }`}
                style={{ fontFamily: KINSHIP_FONTS.body, minHeight: '56px' }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowCheckOutCalendar(!showCheckOutCalendar);
                  }
                }}
              >
                <div className="text-2xl font-bold" style={{ color: KINSHIP_COLORS.greenDark }}>
                  {formatDisplayDate(checkOut).day}
                </div>
                <div className="text-xs uppercase tracking-wider" style={{ color: KINSHIP_COLORS.greenDark, opacity: 0.8 }}>
                  {formatDisplayDate(checkOut).month}
                </div>
              </div>
              <BrandedCalendar
                value={checkOut}
                onChange={(date) => {
                  setCheckOut(date);
                  setShowCheckOutCalendar(false);
                }}
                minDate={checkIn || todayString}
                isOpen={showCheckOutCalendar}
                onClose={() => setShowCheckOutCalendar(false)}
                position="right"
              />
            </div>
          </div>
        </div>

        {/* Guests and Rooms - responsive layout */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="guests"
              className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2"
            >
              Guests
            </label>
            <select
              id="guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full px-3 py-3 text-sm border border-gray-200                 focus:border-[#849e74] focus:outline-none focus:ring-2 focus:ring-[#849e74]/20
                transition-all bg-gray-50 hover:bg-white cursor-pointer"
              aria-label="Select number of guests"
            >
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4 Guests</option>
              <option value="5">5+ Guests</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="rooms"
              className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2"
            >
              Rooms
            </label>
            <select
              id="rooms"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              className="w-full px-3 py-3 text-sm border border-gray-200                 focus:border-[#849e74] focus:outline-none focus:ring-2 focus:ring-[#849e74]/20
                transition-all bg-gray-50 hover:bg-white cursor-pointer"
              aria-label="Select number of rooms"
            >
              <option value="1">1 Room</option>
              <option value="2">2 Rooms</option>
              <option value="3">3 Rooms</option>
              <option value="4">4+ Rooms</option>
            </select>
          </div>
        </div>

        {/* Promo Code - Optional field */}
        {showPromo ? (
          <div>
            <label
              htmlFor="promo"
              className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2"
            >
              Promo Code
            </label>
            <input
              id="promo"
              type="text"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="Enter your code"
              className="w-full px-3 py-3 text-sm border border-gray-200                 focus:border-[#849e74] focus:outline-none focus:ring-2 focus:ring-[#849e74]/20
                transition-all bg-gray-50 hover:bg-white"
              aria-label="Enter promo code"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowPromo(true)}
            className="text-sm text-[#849e74] hover:text-[#667C58] underline transition-colors"
          >
            Have a promo code?
          </button>
        )}

        {/* Submit Button - Clean minimal CTA */}
        <motion.a
          href={bookingUrl}
          target={isMobile ? '_self' : '_blank'}
          rel="noopener noreferrer"
          onClick={handleBookingClick}
          className="block w-full px-6 py-3 bg-[#849e74] text-white font-semibold text-center
            text-sm uppercase tracking-wider transition-all duration-300"
          whileHover={{
            backgroundColor: KINSHIP_COLORS.greenDark,
            y: -1,
            boxShadow: '0 4px 16px rgba(132, 158, 116, 0.25)',
          }}
          whileTap={{ scale: 0.98 }}
        >
          Check Availability
        </motion.a>
      </div>
    </motion.div>
  );
}