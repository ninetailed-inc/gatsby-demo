import { ExperienceConfiguration } from "@ninetailed/experience.js-gatsby";
import type { GatsbyConfig } from "gatsby";
import {
  audienceQuery,
  audienceMapper,
  experienceQuery,
  experienceMapper,
} from "./lib/preview";

require("dotenv").config();

const config: GatsbyConfig = {
  siteMetadata: {
    title: `marketing-contentful-gatsby`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
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
                if (process.env.GATSBY_CONTENTFUL_SPACE) {
                  window.open(
                    `https://app.contentful.com/spaces/${
                      process.env.GATSBY_CONTENTFUL_SPACE
                    }/environments/${
                      process.env.GATSBY_CONTENTFUL_ENVIRONMENT || "master"
                    }/entries/${experience.id}`,
                    "_blank"
                  );
                }
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
