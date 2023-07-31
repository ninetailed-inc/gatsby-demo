import * as React from "react";
import { graphql } from "gatsby";
import { ExperienceMapper } from "@ninetailed/experience.js-utils";
import { Experience } from "@ninetailed/experience.js-gatsby";
import Hero from "../components/Hero";

export default function Page(props: any) {
  const { contentfulPage } = props.data;

  function mapExperiences(experiences: any) {
    return (experiences || [])
      .filter(ExperienceMapper.isExperienceEntry)
      .map(ExperienceMapper.mapExperience);
  }

  return (
    <div>
      <div style={{ fontSize: "1.5em" }}>
        <pre>You've visited the {contentfulPage.slug} page!</pre>
        <pre>
          There are {contentfulPage.sections.length} sections on this entry,{" "}
          {contentfulPage.sections.filter(
            (section: any) => section.sys?.contentType.sys.id === "hero"
          ).length || "none"}{" "}
          of which is a Hero section.
        </pre>
      </div>
      {contentfulPage.sections.map((section: any) => {
        if (section.sys?.contentType.sys.id === "hero") {
          const mappedExperiences = mapExperiences(section.nt_experiences);
          return (
            <Experience
              {...section}
              key={section.id}
              experiences={mappedExperiences}
              component={Hero}
            />
          );
        }
      })}
    </div>
  );
}

export const query = graphql`
  query PageContent($slug: String!) {
    contentfulPage(slug: { eq: $slug }) {
      name
      slug
      sections {
        ... on ContentfulHero {
          ...ContentfulHeroContent
          nt_experiences {
            ...ExperienceContent
          }
        }
      }
    }
  }
`;
