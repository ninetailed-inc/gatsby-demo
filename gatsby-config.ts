import type { GatsbyConfig } from "gatsby";
import netlifyAdapter from "gatsby-adapter-netlify";
import { ExperienceConfiguration } from "@ninetailed/experience.js-gatsby";
import {
  ExperienceLike,
  ExperienceMapper,
} from "@ninetailed/experience.js-utils";

require("dotenv").config();

type GatsbyAudienceNode = {
  node: {
    id: string;
    name: string;
    description: {
      nt_description?: string;
    };
  };
};

export const audienceQuery = `
    query NinetailedAudienceQuery {
      allContentfulNinetailedAudience {
        edges {
          node {
            id: nt_audience_id
            name: nt_name
            description: nt_description {
              nt_description
            }
          }
        }
      }
    }
  `;

export const audienceMapper = (audienceData: any) => {
  return audienceData.allContentfulNinetailedAudience.edges.map(
    (audience: GatsbyAudienceNode) => {
      return {
        id: audience.node.id,
        name: audience.node.name,
        description: audience.node.description?.nt_description,
      };
    }
  );
};

export const experienceQuery = `
    query NinetailedPreviewExperiencesQuery {
      allContentfulNinetailedExperience {
        edges {
          node {
            id: contentful_id
            audience: nt_audience {
              id: contentful_id
              name: nt_name
            }
            config: nt_config {
              distribution
              traffic
              components {
                baseline {
                  id
                }
                variants {
                  hidden
                  id
                }
              }
            }
            name: nt_name
            type: nt_type
            variants: nt_variants {
              ... on ContentfulEntry {
                id: contentful_id
              }
            }
          }
        }
      }
    }
  `;

export const experienceMapper = (experienceData: any) => {
  return experienceData.allContentfulNinetailedExperience.edges
    .filter(({ node }: { node: any }) =>
      ExperienceMapper.isExperienceEntry(node)
    )
    .map(({ node }: { node: ExperienceLike }) =>
      ExperienceMapper.mapExperience(node)
    );
};

const config: GatsbyConfig = {
  adapter: netlifyAdapter(),
  siteMetadata: {
    title: `marketing-contentful-gatsby`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-netlify",
    {
      resolve: "gatsby-source-contentful",
      options: {
        accessToken: process.env.CONTENTFUL_PREVIEW
          ? process.env.CONTENTFUL_CPA_KEY
          : process.env.CONTENTFUL_CDA_KEY,
        spaceId: process.env.GATSBY_CONTENTFUL_SPACE,
        environment: process.env.GATSBY_CONTENTFUL_ENVIRONMENT,
        host: process.env.CONTENTFUL_PREVIEW
          ? "preview.contentful.com"
          : "cdn.contentful.com",
      },
    },
    {
      resolve: "@ninetailed/experience.js-gatsby",
      options: {
        clientId: process.env.NINETAILED_CLIENT_ID,
        environment: process.env.NINETAILED_ENV || "main",
        ninetailedPlugins: [
          {
            resolve: `@ninetailed/experience.js-plugin-preview`,
            name: "@ninetailed/experience.js-plugin-preview",
            options: {
              // Options specific to Gatsby - optional
              customOptions: {
                // Query all audiences
                audienceQuery,
                // Mapper function for audiences
                audienceMapper,
                // Query all experiences
                experienceQuery,
                // Mapper function for experiences
                experienceMapper,
              },

              // Callback to handle user forwarding to the experience entry
              // in your CMS  - optional
              onOpenExperienceEditor: (experience: ExperienceConfiguration) => {
                // TODO: For now, hard code your space ID and environment ID rather than trying to pull them from .env variables
                window.open(
                  `https://app.contentful.com/spaces/[YOUR_CONETNTFUL_SPACE_ID]/environments/[YOUR_CONTENTFUL_ENVIRONMENT_ID]/entries/${experience.id}`,
                  "_blank"
                );
              },
            },
          },
        ],
      },
    },
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
  ],
};

export default config;
