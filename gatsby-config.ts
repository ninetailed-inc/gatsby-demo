import type { GatsbyConfig } from "gatsby";

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
      resolve: "@ninetailed/experience.js-gatsby",
      options: {
        clientId: process.env.NINETAILED_CLIENT_ID,
        environment: process.env.NINETAILED_CLIENT_ID || "main",
        ninetailedPlugins: [
          // If using the preview widget
          {
            resolve: `@ninetailed/experience.js-plugin-preview`,
            options: {
              clientId: process.env.NINETAILED_PREVIEW_CLIENT_ID,
              secret: process.env.NINETAILED_PREVIEW_SECRET,
              environment: process.env.NINETAILED_CLIENT_ID || "main",
            },
          },
        ],
      },
    },
    {
      resolve: "gatsby-source-contentful",
      options: {
        accessToken: "1fdsnwO6DpNmBasRh5pS5C0b2iJcnqrZaNPg-pyn8QE",
        spaceId: "kk1gqspcetbl",
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
