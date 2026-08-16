type PortableTextBlock = {
  _type: string;
  children?: { text?: string }[];
};

export function getPlainTextExcerpt(
  blocks: PortableTextBlock[] | null | undefined,
  maxLength = 200,
): string {
  if (!Array.isArray(blocks) || blocks.length === 0) return "";
  const text = blocks
    .filter((b) => b._type === "block")
    .map((b) => (b.children ?? []).map((c) => c.text ?? "").join(""))
    .join(" ")
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}
