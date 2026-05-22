import { ThemePlan } from "@/lib/theme-plan/types";

export function previewPosts(plan: ThemePlan) {
  const noun = plan.meta.description.toLowerCase().includes("photo") ? "Frame" : "Essay";
  return [
    { title: `${noun} notes from a quiet morning`, meta: "Apr 12", excerpt: "A short editorial card showing how generated archive content will feel." },
    { title: "Inside the working archive", meta: "Apr 19", excerpt: "Readable hierarchy, strong whitespace, and post metadata from the same plan." },
    { title: "A field guide to the next story", meta: "May 03", excerpt: "Fake content only, rendered to communicate structure and visual direction." },
  ];
}
