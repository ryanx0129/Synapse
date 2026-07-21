import { graphShapeSchema, knowledgeGraphSchema } from "./graphSchema";
import type { ConceptNode, KnowledgeGraph } from "./graphSchema";

const normalizedLabel = (value: string) =>
  value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const labelTokens = (value: string) => new Set(normalizedLabel(value).split(" ").filter(Boolean));

const similarity = (left: string, right: string) => {
  const leftTokens = labelTokens(left);
  const rightTokens = labelTokens(right);
  const intersection = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  const union = new Set([...leftTokens, ...rightTokens]).size;
  return union === 0 ? 0 : intersection / union;
};

const mergeNodes = (primary: ConceptNode, duplicate: ConceptNode): ConceptNode => ({
  ...primary,
  sourceSpans: [
    ...primary.sourceSpans,
    ...duplicate.sourceSpans.filter(
      (span) => !primary.sourceSpans.some((current) => current.sourceId === span.sourceId),
    ),
  ],
  tags: [...new Set([...primary.tags, ...duplicate.tags])],
  difficulty: Math.max(primary.difficulty, duplicate.difficulty),
  importance: Math.max(primary.importance, duplicate.importance),
});

export interface NormalizeGraphOptions {
  allowedSourceIds?: Set<string>;
}

export function normalizeGraph(input: unknown, options: NormalizeGraphOptions = {}): KnowledgeGraph {
  const parsed = graphShapeSchema.parse(input);
  const warnings = [...parsed.warnings];
  const clusterLookup = new Map<string, string>();
  for (const cluster of parsed.clusters) {
    clusterLookup.set(normalizedLabel(cluster.id), cluster.id);
    clusterLookup.set(normalizedLabel(cluster.label), cluster.id);
  }

  const deduplicated: ConceptNode[] = [];
  const idRedirect = new Map<string, string>();

  for (const rawNode of parsed.nodes) {
    const cluster = clusterLookup.get(normalizedLabel(rawNode.cluster)) ?? parsed.clusters[0]?.id;
    if (!cluster) throw new Error("A graph must define at least one cluster");
    const sourceSpans = options.allowedSourceIds
      ? rawNode.sourceSpans.filter((span) => options.allowedSourceIds?.has(span.sourceId))
      : rawNode.sourceSpans;
    if (sourceSpans.length === 0) {
      warnings.push(`Removed concept ${rawNode.label}: it did not cite a supplied source.`);
      continue;
    }

    const node = { ...rawNode, cluster, sourceSpans };
    const duplicate = deduplicated.find(
      (candidate) =>
        normalizedLabel(candidate.label) === normalizedLabel(node.label) ||
        (candidate.cluster === node.cluster && similarity(candidate.label, node.label) >= 0.9),
    );
    if (duplicate) {
      const index = deduplicated.indexOf(duplicate);
      deduplicated[index] = mergeNodes(duplicate, node);
      idRedirect.set(node.id, duplicate.id);
      warnings.push(`Merged duplicate concept “${node.label}” into “${duplicate.label}”.`);
    } else {
      deduplicated.push(node);
      idRedirect.set(node.id, node.id);
    }
  }

  const nodeIds = new Set(deduplicated.map((node) => node.id));
  const linkIds = new Set<string>();
  const links = parsed.links.flatMap((link) => {
    const source = idRedirect.get(link.source) ?? link.source;
    const target = idRedirect.get(link.target) ?? link.target;
    const sourceSpans = options.allowedSourceIds
      ? link.sourceSpans.filter((span) => options.allowedSourceIds?.has(span.sourceId))
      : link.sourceSpans;
    if (!nodeIds.has(source) || !nodeIds.has(target) || source === target || linkIds.has(link.id)) {
      warnings.push(`Removed invalid relationship “${link.label}”.`);
      return [];
    }
    linkIds.add(link.id);
    return [{ ...link, source, target, sourceSpans }];
  });

  return knowledgeGraphSchema.parse({ ...parsed, nodes: deduplicated, links, warnings });
}

export function validateGraph(input: unknown) {
  return knowledgeGraphSchema.safeParse(input);
}

