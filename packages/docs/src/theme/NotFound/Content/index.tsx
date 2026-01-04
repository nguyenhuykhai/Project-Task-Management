import React, { type ReactNode } from "react";
import clsx from "clsx";
import Translate from "@docusaurus/Translate";
import Link from "@docusaurus/Link";
import type { Props } from "@theme/NotFound/Content";
import Heading from "@theme/Heading";

export default function NotFoundContent({ className }: Props): ReactNode {
  return (
    <main className={clsx("container margin-vert--xl", className)}>
      <div className="row">
        <div className="col col--6 col--offset-3">
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <Heading
              as="h1"
              className="hero__title"
              style={{
                fontSize: "6rem",
                marginBottom: "1rem",
                fontWeight: "bold",
              }}
            >
              404
            </Heading>
            <Heading
              as="h2"
              className="hero__subtitle"
              style={{
                fontSize: "1.75rem",
                marginBottom: "1.5rem",
                fontWeight: "500",
              }}
            >
              <Translate
                id="theme.NotFound.title"
                description="The title of the 404 page"
              >
                Page Not Found
              </Translate>
            </Heading>
            <p
              style={{
                marginBottom: "2.5rem",
                fontSize: "1.1rem",
                color: "var(--ifm-color-emphasis-700)",
              }}
            >
              <Translate
                id="theme.NotFound.p1"
                description="The first paragraph of the 404 page"
              >
                We could not find what you were looking for. The page might have
                been moved or deleted.
              </Translate>
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link className="button button--primary button--lg" to="/intro">
                <Translate
                  id="theme.NotFound.goToIntro"
                  description="Button text to go to intro page"
                >
                  Go to Home
                </Translate>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
