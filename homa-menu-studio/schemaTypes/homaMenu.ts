import { defineType, defineField, defineArrayMember } from 'sanity'

// A single menu item (name, description, price). Matches the live menu exactly.
const menuItem = defineType({
  name: 'menuItem',
  title: 'Menu Item',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Ingredients / details (optional)',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'e.g. $15  (for two sizes use "Reg / Lg" style, e.g. "$5 / $7")',
    }),
    defineField({
      name: 'addOns',
      title: 'Add-ons (optional)',
      type: 'string',
      description: 'Item-specific add-ons, e.g. "+ pork green chili - $16"',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'price' },
  },
})

// A menu category (e.g. Breakfast) holding a list of items.
const menuCategory = defineType({
  name: 'menuCategory',
  title: 'Menu Category',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Category Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'categoryId',
      title: 'ID (slug)',
      type: 'string',
      description: 'Lowercase id used in the page anchor, e.g. "breakfast". Leave as-is unless adding a new category.',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle (optional)',
      type: 'text',
      rows: 2,
      description: 'Shown under the category title, e.g. "Served until 3pm"',
    }),
    defineField({
      name: 'addOns',
      title: 'Category Add-ons (optional)',
      type: 'text',
      rows: 2,
      description: 'Add-ons that apply to the whole category, e.g. "add: chicken +7 | steak +9.5"',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [defineArrayMember({ type: 'menuItem' })],
    }),
  ],
  preview: {
    select: { title: 'title', items: 'items' },
    prepare({ title, items }) {
      const count = Array.isArray(items) ? items.length : 0
      return { title, subtitle: `${count} item${count === 1 ? '' : 's'}` }
    },
  },
})

// The single Homa menu document (one per site).
const homaMenu = defineType({
  name: 'homaMenu',
  title: 'Homa Menu',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      readOnly: true,
      initialValue: 'Homa Café + Bar Menu',
    }),
    defineField({
      name: 'categories',
      title: 'Menu Categories',
      type: 'array',
      of: [defineArrayMember({ type: 'menuCategory' })],
      description: 'Drag to reorder. Each category holds its items.',
    }),
  ],
  preview: {
    select: { title: 'title', categories: 'categories' },
    prepare({ title, categories }) {
      const count = Array.isArray(categories) ? categories.length : 0
      return { title: title || 'Homa Menu', subtitle: `${count} categories` }
    },
  },
})

export const schemaTypes = [homaMenu, menuCategory, menuItem]
