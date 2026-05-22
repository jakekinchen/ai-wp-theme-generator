import { previewPosts } from "@/lib/preview/preview-model";
import { ThemePlan } from "@/lib/theme-plan/types";

export function ThemePreview({ plan }: { plan: ThemePlan }) {
  const posts = previewPosts(plan);
  const hero = plan.homepage.find((section) => section.kind === "hero");
  const split = plan.homepage.find((section) => section.kind === "split-intro");
  const query = plan.homepage.find((section) => section.kind === "query-grid");
  const cta = plan.homepage.find((section) => section.kind === "cta-band");
  const style = {
    background: plan.design.palette.background,
    color: plan.design.palette.foreground,
    fontFamily: plan.design.typography.bodyFont === "serif" ? "Georgia, serif" : "Inter, system-ui, sans-serif",
  };

  return (
    <section className="overflow-hidden rounded border border-slate-200" style={style}>
      <div className="flex items-center justify-between border-b border-current/20 px-5 py-4 text-sm">
        <strong>{plan.meta.name}</strong>
        <span style={{ color: plan.design.palette.accent }}>{plan.design.direction}</span>
      </div>
      <div className="grid gap-8 px-5 py-8">
        {hero?.kind === "hero" && (
          <div className="mx-auto grid max-w-3xl gap-4 text-center">
            <span className="text-xs uppercase tracking-widest" style={{ color: plan.design.palette.primary }}>{hero.eyebrow}</span>
            <h2 className="text-4xl font-semibold" style={{ fontFamily: plan.design.typography.headingFont === "serif" ? "Georgia, serif" : "Inter, system-ui, sans-serif" }}>{hero.heading}</h2>
            <p className="text-base opacity-80">{hero.subheading}</p>
          </div>
        )}
        {split?.kind === "split-intro" && (
          <div className="grid gap-4 border-y border-current/20 py-6 md:grid-cols-2">
            <h3 className="text-2xl font-semibold">{split.heading}</h3>
            <p className="opacity-80">{split.body}</p>
          </div>
        )}
        {query?.kind === "query-grid" && (
          <div className="grid gap-4">
            <h3 className="text-2xl font-semibold">{query.heading}</h3>
            <div className="grid gap-3 md:grid-cols-3">
              {posts.map((post, index) => (
                <article key={post.title} className="grid gap-3 border border-current/20 p-3">
                  <div className="aspect-[4/3]" style={{ background: index % 2 ? plan.design.palette.secondary : plan.design.palette.primary }} />
                  <strong>{post.title}</strong>
                  <small style={{ color: plan.design.palette.muted }}>{post.meta}</small>
                  <p className="text-sm opacity-75">{post.excerpt}</p>
                </article>
              ))}
            </div>
          </div>
        )}
        {cta?.kind === "cta-band" && (
          <div className="grid justify-items-center gap-3 p-6 text-center" style={{ background: plan.design.palette.secondary }}>
            <h3 className="text-2xl font-semibold">{cta.heading}</h3>
            <p className="max-w-xl opacity-80">{cta.body}</p>
            <span className="rounded px-4 py-2 text-sm font-semibold" style={{ background: plan.design.palette.primary, color: plan.design.palette.background }}>{cta.buttonLabel}</span>
          </div>
        )}
        <p className="text-xs opacity-70">Structural preview rendered from the generated ThemePlan.</p>
      </div>
    </section>
  );
}
