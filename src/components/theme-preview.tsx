import { previewPosts } from "@/lib/preview/preview-model";
import { ThemePlan } from "@/lib/theme-plan/types";

export function ThemePreview({ plan }: { plan: ThemePlan }) {
  const posts = previewPosts(plan);
  const hero = plan.homepage.find((section) => section.kind === "hero");
  const split = plan.homepage.find((section) => section.kind === "split-intro");
  const query = plan.homepage.find((section) => section.kind === "query-grid");
  const cta = plan.homepage.find((section) => section.kind === "cta-band");

  const bodyFamily = fontFor(plan.design.typography.bodyFont);
  const headingFamily = fontFor(plan.design.typography.headingFont);

  const plateStyle = {
    background: plan.design.palette.background,
    color: plan.design.palette.foreground,
    fontFamily: bodyFamily,
  };

  return (
    <div className="preview">
      <div className="preview__crop">
        <span>† crop marks</span>
        <span>
          {plan.design.layout.contentWidth}px · {plan.design.layout.spacing} ·{" "}
          {plan.design.typography.scale} · {plan.design.intent.contentDensity}
        </span>
      </div>

      <div className="preview__plate" style={plateStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "1rem",
            borderBottom: `1px solid ${withAlpha(plan.design.palette.foreground, 0.15)}`,
            fontFamily: headingFamily,
          }}
        >
          <strong style={{ fontSize: "0.95rem" }}>{plan.meta.name}</strong>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: plan.design.palette.primary,
            }}
          >
            {plan.design.direction}
          </span>
        </div>

        {hero?.kind === "hero" && (
          <div
            style={{
              marginTop: "clamp(1.5rem, 4vw, 3rem)",
              textAlign: hero.visualStyle === "centered" || hero.visualStyle === "cover" ? "center" : "left",
              display: "grid",
              gap: "1rem",
              maxWidth: hero.visualStyle === "centered" || hero.visualStyle === "cover" ? "44ch" : "none",
              marginLeft: hero.visualStyle === "centered" || hero.visualStyle === "cover" ? "auto" : 0,
              marginRight: hero.visualStyle === "centered" || hero.visualStyle === "cover" ? "auto" : 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: plan.design.palette.primary,
              }}
            >
              {hero.eyebrow}
            </span>
            <h3
              style={{
                fontFamily: headingFamily,
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                margin: 0,
                fontWeight: 500,
              }}
            >
              {hero.heading}
            </h3>
            <p style={{ opacity: 0.78, fontSize: "1rem", lineHeight: 1.5, margin: 0 }}>{hero.subheading}</p>
            {hero.primaryButtonLabel && (
              <span
                style={{
                  display: "inline-block",
                  padding: "0.65rem 1rem",
                  background: plan.design.palette.primary,
                  color: plan.design.palette.background,
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginInline: hero.visualStyle === "centered" || hero.visualStyle === "cover" ? "auto" : 0,
                }}
              >
                {hero.primaryButtonLabel}
              </span>
            )}
          </div>
        )}

        {split?.kind === "split-intro" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr)",
              gap: "1.5rem",
              marginTop: "clamp(2rem, 4vw, 3rem)",
              paddingTop: "1.5rem",
              borderTop: `1px solid ${withAlpha(plan.design.palette.foreground, 0.15)}`,
            }}
            className="preview-split"
          >
            <h4
              style={{
                fontFamily: headingFamily,
                fontSize: "1.4rem",
                lineHeight: 1.2,
                margin: 0,
                fontWeight: 500,
              }}
            >
              {split.heading}
            </h4>
            <p style={{ opacity: 0.78, fontSize: "0.95rem", lineHeight: 1.55, margin: 0 }}>{split.body}</p>
          </div>
        )}

        {query?.kind === "query-grid" && (
          <div style={{ marginTop: "clamp(2rem, 4vw, 3rem)", display: "grid", gap: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h4 style={{ fontFamily: headingFamily, fontSize: "1.3rem", margin: 0, fontWeight: 500 }}>
                {query.heading}
              </h4>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: withAlpha(plan.design.palette.foreground, 0.6),
                }}
              >
                {query.cardStyle} · {query.columns}-up
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(auto-fit, minmax(${query.cardStyle === "minimal" ? "200px" : "160px"}, 1fr))`,
                gap: "1rem",
              }}
            >
              {posts.map((post, index) => (
                <article
                  key={post.title}
                  style={{
                    display: "grid",
                    gap: "0.5rem",
                    padding: query.cardStyle === "bordered" ? "0.85rem" : "0",
                    border:
                      query.cardStyle === "bordered"
                        ? `1px solid ${withAlpha(plan.design.palette.foreground, 0.18)}`
                        : "none",
                    borderTop:
                      query.cardStyle === "magazine"
                        ? `1px solid ${withAlpha(plan.design.palette.foreground, 0.2)}`
                        : undefined,
                    paddingTop: query.cardStyle === "magazine" ? "0.65rem" : undefined,
                  }}
                >
                  {query.cardStyle !== "minimal" && (
                    <div
                      style={{
                        aspectRatio: query.cardStyle === "image-led" ? "16/9" : "4/3",
                        background:
                          index % 2
                            ? plan.design.palette.secondary
                            : `linear-gradient(135deg, ${plan.design.palette.primary} 0%, ${plan.design.palette.accent} 100%)`,
                      }}
                    />
                  )}
                  <strong style={{ fontFamily: headingFamily, fontSize: "0.95rem", fontWeight: 500 }}>
                    {post.title}
                  </strong>
                  <small
                    style={{
                      color: plan.design.palette.muted,
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.62rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                    }}
                  >
                    {post.meta}
                  </small>
                  {query.showExcerpt && (
                    <p style={{ fontSize: "0.8rem", opacity: 0.78, lineHeight: 1.45, margin: 0 }}>{post.excerpt}</p>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}

        {cta?.kind === "cta-band" && (
          <div
            style={{
              marginTop: "clamp(2rem, 4vw, 3rem)",
              padding: "1.5rem",
              background: plan.design.palette.secondary,
              display: "grid",
              gap: "0.75rem",
              justifyItems: "center",
              textAlign: "center",
              borderRadius:
                plan.design.layout.radius === "none"
                  ? 0
                  : plan.design.layout.radius === "pill"
                    ? "999px"
                    : plan.design.layout.radius === "rounded"
                      ? "16px"
                      : "6px",
            }}
          >
            <h4 style={{ fontFamily: headingFamily, fontSize: "1.3rem", margin: 0, fontWeight: 500 }}>
              {cta.heading}
            </h4>
            <p style={{ fontSize: "0.95rem", opacity: 0.8, margin: 0, maxWidth: "44ch" }}>{cta.body}</p>
            <span
              style={{
                padding: "0.6rem 1rem",
                background: plan.design.palette.primary,
                color: plan.design.palette.background,
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              {cta.buttonLabel}
            </span>
          </div>
        )}

        <p
          style={{
            marginTop: "1.5rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            opacity: 0.55,
            textAlign: "right",
          }}
        >
          Structural preview · {plan.design.intent.signatureMove}
        </p>
      </div>

      <PaletteRow plan={plan} />
    </div>
  );
}

function PaletteRow({ plan }: { plan: ThemePlan }) {
  const entries = Object.entries(plan.design.palette) as Array<[string, string]>;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${entries.length}, minmax(0, 1fr))`,
        border: "1px solid var(--ink)",
        overflow: "hidden",
      }}
    >
      {entries.map(([slug, color]) => (
        <div key={slug} style={{ background: color, padding: "0.85rem 0.6rem" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: readableOn(color),
            }}
          >
            {slug}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              marginTop: "0.4rem",
              color: readableOn(color),
              opacity: 0.7,
            }}
          >
            {color}
          </div>
        </div>
      ))}
    </div>
  );
}

function fontFor(token: ThemePlan["design"]["typography"]["headingFont"]): string {
  if (token === "serif") return "Georgia, 'Times New Roman', serif";
  if (token === "mono") return "ui-monospace, 'JetBrains Mono', SFMono-Regular, monospace";
  return "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
}

function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace("#", "");
  if (value.length !== 6) return hex;
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function readableOn(hex: string): string {
  const value = hex.replace("#", "");
  if (value.length !== 6) return "#000";
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#161311" : "#f1e9d8";
}
