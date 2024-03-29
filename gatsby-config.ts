import type { GatsbyConfig } from "gatsby";
import netlifyAdapter from "gatsby-adapter-netlify";
import { ExperienceConfiguration } from "@ninetailed/experience.js-gatsby";
import type { NinetailedInstance } from "@ninetailed/experience.js";
import {
  audienceQuery,
  audienceMapper,
  experienceQuery,
  experienceMapper,
} from "./lib/preview";

require("dotenv").config();

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
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: process.env.GATSBY_GTM_ID,
        includeInDevelopment: true,
      },
    },
    {
      resolve: "@ninetailed/experience.js-gatsby",
      options: {
        clientId: process.env.NINETAILED_CLIENT_ID,
        environment: process.env.NINETAILED_ENV || "main",
        onInitProfileId: async (profileId?: string) => {
          if (profileId) {
            return profileId;
          }
          const cookieObject = document.cookie
            .split(";")
            .map((v) => v.split("="))
            .reduce<Record<string, string>>((acc, v) => {
              acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(
                v[1].trim()
              );
              return acc;
            }, {});
          return cookieObject["_ga"];
        },
        onRouteChange: (
          { isInitialRoute, url }: { isInitialRoute: boolean; url: string },
          ninetailed: NinetailedInstance
        ) => {
          if (isInitialRoute) {
            const params = new URL(url).searchParams;
            const experienceId = params.get("experienceId");
            const variantIndex = parseInt(params.get("variantIndex") || "", 10);

            if (experienceId && variantIndex) {
              ninetailed.batch([
                ninetailed.eventBuilder.component(
                  "componentId",
                  experienceId,
                  variantIndex
                ),
                ninetailed.eventBuilder.page(),
              ]);
            } else {
              ninetailed.page();
            }
          } else {
            ninetailed.page();
          }
        },
        ninetailedPlugins: [
          // {
          //   resolve: `@ninetailed/experience.js-plugin-preview`,
          //   name: "@ninetailed/experience.js-plugin-preview",
          //   options: {
          //     customOptions: {
          //       audienceQuery,
          //       experienceQuery,
          //       audienceMapper,
          //       experienceMapper,
          //     },

          //     // Callback to handle user forwarding to the experience entry
          //     // in your CMS  - optional
          //     onOpenExperienceEditor: (experience: ExperienceConfiguration) => {
          //       // TODO: For now, hard code your space ID and environment ID rather than trying to pull them from .env variables
          //       window.open(
          //         `https://app.contentful.com/spaces/[YOUR_CONETNTFUL_SPACE_ID]/environments/[YOUR_CONTENTFUL_ENVIRONMENT_ID]/entries/${experience.id}`,
          //         "_blank"
          //       );
          //     },
          //   },
          // },
          {
            resolve: `@ninetailed/experience.js-plugin-google-tagmanager`,
            name: "@ninetailed/experience.js-plugin-google-tagmanager",
            options: {
              template: {
                ninetailed_audience_name: "{{ audience.name }}",
              },
            },
          },
          {
            resolve: `@ninetailed/experience.js-plugin-insights`,
            options: {},
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
