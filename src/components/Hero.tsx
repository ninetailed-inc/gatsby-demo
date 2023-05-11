import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import * as React from "react";

export default function Hero(props: any) {
  return (
    <section>
      <h1>Title: {props.internalName}</h1>
      {props.image?.gatsbyImageData && (
        <GatsbyImage
          alt={props.image?.description}
          // @ts-ignore
          image={getImage(props.image.gatsbyImageData)}
        />
      )}
    </section>
  );
}

export const query = graphql`
  fragment ContentfulHeroContent on ContentfulHero {
    sys {
      contentType {
        sys {
          id
        }
      }
    }
    id: contentful_id
    image {
      gatsbyImageData(width: 800)
      description
    }
    internalName
  }

  fragment ExperienceContent on ContentfulNinetailedExperience {
    id: contentful_id
    name: nt_name
    type: nt_type
    audience: nt_audience {
      id: contentful_id
    }
    config: nt_config {
      components {
        baseline {
          id
          title
        }
        variants {
          id
          hidden
        }
      }
      traffic
      distribution
    }
    variants: nt_variants {
      ... on ContentfulHero {
        ...ContentfulHeroContent
      }
    }
  }
`;
