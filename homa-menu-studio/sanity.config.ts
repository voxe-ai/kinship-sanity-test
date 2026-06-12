import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes/homaMenu'

export default defineConfig({
  name: 'default',
  title: 'Kinship — Homa Menu',
  projectId: 'u2qzrboc',
  dataset: 'production',
  plugins: [
    structureTool({
      // Single, focused entry: the Homa Menu document.
      structure: (S) =>
        S.list()
          .title('Homa Café + Bar')
          .items([
            S.listItem()
              .title('Homa Menu')
              .id('homaMenu')
              .child(
                S.document().schemaType('homaMenu').documentId('homaMenu').title('Homa Menu')
              ),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
})
