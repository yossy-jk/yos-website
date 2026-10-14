// CMS records are runtime data even when the blog loader has a TypeScript type.
// Invalid or incomplete records must not break a public tenant guidance page.
export function tenantPublicPosts(value: unknown): { slug: string; title: string }[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const post = item as Record<string, unknown>;
    if (typeof post.slug !== "string" || typeof post.title !== "string") return [];
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug) || !post.title.trim()) return [];
    return [{ slug: post.slug, title: post.title.trim() }];
  });
}
