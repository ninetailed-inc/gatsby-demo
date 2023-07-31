import {
  ExperienceLike,
  ExperienceMapper,
} from "@ninetailed/experience.js-utils";

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
