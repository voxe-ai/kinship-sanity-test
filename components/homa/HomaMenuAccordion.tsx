'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KINSHIP_COLORS, KINSHIP_FONTS } from '@/lib/config/brand';
import { homaMenuData, type MenuCategory } from './homa-menu-data';

interface HomaMenuAccordionProps {
  brunchMenuPdfUrl?: string;
  cateringMenuPdfUrl?: string;
  menuData?: MenuCategory[];
}

export function HomaMenuAccordion({ brunchMenuPdfUrl, cateringMenuPdfUrl, menuData }: HomaMenuAccordionProps) {
  // Sanity-driven menu (editable in the Homa Menu studio), with the bundled menu as a safe fallback.
  const categories = menuData && menuData.length > 0 ? menuData : homaMenuData;
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    const newOpenCategories = new Set(openCategories);
    if (newOpenCategories.has(categoryId)) {
      newOpenCategories.delete(categoryId);
    } else {
      newOpenCategories.add(categoryId);
    }
    setOpenCategories(newOpenCategories);
  };

  return (
    <section
      id="menu"
      className="py-16 md:py-24"
      style={{ backgroundColor: KINSHIP_COLORS.sage }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8"
          style={{
            fontFamily: KINSHIP_FONTS.heading,
            color: KINSHIP_COLORS.greenDark
          }}
        >
          Menu
        </h2>

        {/* Dual CTA Menu Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 max-w-4xl mx-auto">
          {brunchMenuPdfUrl && (
          <a
            href={brunchMenuPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <motion.button
              className="w-full sm:w-auto px-8 py-4 font-semibold text-white transition-all duration-300 text-center"
              style={{
                backgroundColor: KINSHIP_COLORS.greenDark,
                fontFamily: KINSHIP_FONTS.body,
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 4px 12px rgba(102, 124, 88, 0.3)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              BRUNCH MENU
            </motion.button>
          </a>
          )}

          {cateringMenuPdfUrl && (
          <a
            href={cateringMenuPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <motion.button
              className="w-full sm:w-auto px-8 py-4 font-semibold text-white transition-all duration-300 text-center"
              style={{
                backgroundColor: KINSHIP_COLORS.greenDark,
                fontFamily: KINSHIP_FONTS.body,
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 4px 12px rgba(102, 124, 88, 0.3)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              CATERING MENU
            </motion.button>
          </a>
          )}
        </div>

        {/* Menu Categories Accordion */}
        <div className="space-y-3 max-w-4xl mx-auto">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="border-2 bg-white"
              style={{
                borderColor: KINSHIP_COLORS.greenDark,
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              }}
            >
              {/* Category Header - Clickable */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-kinship-sage/10 transition-colors duration-200"
                aria-expanded={openCategories.has(category.id)}
                aria-controls={`menu-category-${category.id}`}
                style={{
                  borderBottom: openCategories.has(category.id) ? `2px solid ${KINSHIP_COLORS.greenDark}` : 'none',
                }}
              >
                <div className="flex-grow">
                  <h3
                    className="font-bold text-xl md:text-2xl"
                    style={{
                      fontFamily: KINSHIP_FONTS.heading,
                      color: KINSHIP_COLORS.greenDark,
                    }}
                  >
                    {category.title}
                  </h3>
                  {category.subtitle && (
                    <p
                      className="text-sm mt-1"
                      style={{
                        fontFamily: KINSHIP_FONTS.body,
                        color: KINSHIP_COLORS.greenDark,
                        opacity: 0.7
                      }}
                    >
                      {category.subtitle}
                    </p>
                  )}
                </div>

                {/* Plus/Minus Icon */}
                <motion.div
                  animate={{ rotate: openCategories.has(category.id) ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center ml-4"
                  style={{
                    backgroundColor: openCategories.has(category.id) ? KINSHIP_COLORS.greenDark : KINSHIP_COLORS.green,
                    color: 'white',
                  }}
                  aria-hidden="true"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </motion.div>
              </button>

              {/* Category Content - Expandable */}
              <AnimatePresence initial={false}>
                {openCategories.has(category.id) && (
                  <motion.div
                    id={`menu-category-${category.id}`}
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <motion.div
                      className="px-6 py-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Category Add-Ons */}
                      {category.addOns && (
                        <div
                          className="mb-6 p-4 bg-kinship-sage/20 border-l-4"
                          style={{ borderColor: KINSHIP_COLORS.green }}
                        >
                          <p
                            className="text-sm font-semibold"
                            style={{
                              fontFamily: KINSHIP_FONTS.body,
                              color: KINSHIP_COLORS.greenDark,
                            }}
                          >
                            {category.addOns}
                          </p>
                        </div>
                      )}

                      {/* Menu Items */}
                      <div className="space-y-6">
                        {category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="border-b border-kinship-sage/30 pb-4 last:border-b-0 last:pb-0">
                            {/* Item Name & Price */}
                            <div className="flex justify-between items-start gap-4 mb-2">
                              <h4
                                className="font-bold text-base md:text-lg flex-grow"
                                style={{
                                  fontFamily: KINSHIP_FONTS.heading,
                                  color: KINSHIP_COLORS.greenDark,
                                }}
                              >
                                {item.name}
                              </h4>
                              <span
                                className="font-semibold text-base md:text-lg flex-shrink-0"
                                style={{
                                  fontFamily: KINSHIP_FONTS.body,
                                  color: KINSHIP_COLORS.green,
                                }}
                              >
                                {typeof item.price === 'string' ? item.price : `${item.price.size1} / ${item.price.size2 || ''}`}
                              </span>
                            </div>

                            {/* Item Description */}
                            {item.description && (
                              <p
                                className="text-sm md:text-base leading-relaxed mb-2"
                                style={{
                                  fontFamily: KINSHIP_FONTS.body,
                                  color: KINSHIP_COLORS.greenDark,
                                  opacity: 0.85,
                                }}
                              >
                                {item.description}
                              </p>
                            )}

                            {/* Item-Specific Add-Ons */}
                            {item.addOns && (
                              <p
                                className="text-xs md:text-sm italic mt-2"
                                style={{
                                  fontFamily: KINSHIP_FONTS.body,
                                  color: KINSHIP_COLORS.green,
                                }}
                              >
                                {item.addOns}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Dual CTA Menu Buttons - Bottom */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12 max-w-4xl mx-auto">
          {brunchMenuPdfUrl && (
          <a
            href={brunchMenuPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <motion.button
              className="w-full sm:w-auto px-8 py-4 font-semibold text-white transition-all duration-300 text-center"
              style={{
                backgroundColor: KINSHIP_COLORS.greenDark,
                fontFamily: KINSHIP_FONTS.body,
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 4px 12px rgba(102, 124, 88, 0.3)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              BRUNCH MENU
            </motion.button>
          </a>
          )}

          {cateringMenuPdfUrl && (
          <a
            href={cateringMenuPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <motion.button
              className="w-full sm:w-auto px-8 py-4 font-semibold text-white transition-all duration-300 text-center"
              style={{
                backgroundColor: KINSHIP_COLORS.greenDark,
                fontFamily: KINSHIP_FONTS.body,
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 4px 12px rgba(102, 124, 88, 0.3)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              CATERING MENU
            </motion.button>
          </a>
          )}
        </div>
      </div>
    </section>
  );
}
