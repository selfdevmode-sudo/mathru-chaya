import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const optionalTrimmed = z.string().trim().min(1).optional();

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().trim().min(1),
      photos: z.array(image()).min(1),
      type: z.enum(['temple', 'pond', 'gopura', 'renovation', 'other']).optional(),
      year: z.number().int().gte(1900).lte(2100).optional(),
      place: optionalTrimmed,
      builtFor: optionalTrimmed,
      description_en: optionalTrimmed,
      description_kn: optionalTrimmed,
      materials: z.array(z.string().trim().min(1)).optional(),
      facts: z
        .object({
          duration: optionalTrimmed,
          teamSize: optionalTrimmed,
          ledBy: optionalTrimmed,
          status: optionalTrimmed,
        })
        .optional(),
      mapLink: z.string().url().optional(),
      videoLink: z.string().url().optional(),
      beforeAfter: z.object({ before: image(), after: image() }).optional(),
      featured: z.boolean().default(false),
    }),
});

const awards = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/awards' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().trim().min(1),
      givenBy: optionalTrimmed,
      year: z.number().int().gte(1900).lte(2100).optional(),
      photo: image().optional(),
      note_en: optionalTrimmed,
      note_kn: optionalTrimmed,
    }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/testimonials' }),
  schema: z.object({
    name: z.string().trim().min(1),
    quote_en: z.string().trim().min(1),
    quote_kn: optionalTrimmed,
    place: optionalTrimmed,
    role: optionalTrimmed,
  }),
});

const about = defineCollection({
  loader: glob({ pattern: 'about.md', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      heroPhoto: image().optional(),
      yearsExperience: z.number().int().positive().optional(),
      body_kn: optionalTrimmed, // markdown body of the file is the English text
    }),
});

const services = defineCollection({
  loader: file('./src/content/pages/services.yml'),
  schema: z.object({
    id: z.string().trim().min(1),
    name_en: z.string().trim().min(1),
    name_kn: optionalTrimmed,
    blurb_en: optionalTrimmed,
    blurb_kn: optionalTrimmed,
  }),
});

export const collections = { projects, awards, testimonials, about, services };
