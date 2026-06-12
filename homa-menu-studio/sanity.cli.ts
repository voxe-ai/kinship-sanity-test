import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'u2qzrboc',
    dataset: 'production',
  },
  // Studio deploys to https://kinship-homa-menu.sanity.studio
  studioHost: 'kinship-homa-menu',
})
