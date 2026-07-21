import { z } from "zod";

export const conceptStatusSchema = z.enum(["gap", "review", "mastered", "locked"]);
export const relationTypeSchema = z.enum([
  "prerequisite",
  "causes",
  "part_of",
  "contrasts_with",
  "applies_to",
  "derived_from",
  "example_of",
]);

export const sourceSpanSchema = z
  .object({
    sourceId: z.string().trim().min(1),
    page: z.number().int().positive(),
    section: z.string().trim().optional(),
    quote: z.string().trim().min(1),
    startOffset: z.number().int().nonnegative().optional(),
    endOffset: z.number().int().nonnegative().optional(),
  })
  .strict()
  .refine(
    ({ startOffset, endOffset }) =>
      startOffset === undefined || endOffset === undefined || endOffset >= startOffset,
    "Source end offset must not precede its start offset",
  );

export const answerRubricSchema = z
  .object({
    requiredConcepts: z.array(z.string().trim().min(1)).min(1),
    optionalConcepts: z.array(z.string().trim().min(1)),
    misconceptions: z.array(z.string().trim().min(1)),
    acceptedKeywords: z.array(z.string().trim().min(1)),
    referenceAnswer: z.string().trim().min(1),
  })
  .strict();

export const conceptNodeSchema = z
  .object({
    id: z.string().trim().min(1),
    label: z.string().trim().min(1).max(80),
    shortLabel: z.string().trim().max(40).optional(),
    cluster: z.string().trim().min(1),
    summary: z.string().trim().min(1),
    latex: z.string().trim().optional(),
    difficulty: z.number().min(0).max(1),
    importance: z.number().min(0).max(1),
    initialMastery: z.number().min(0).max(1),
    sourceSpans: z.array(sourceSpanSchema).min(1),
    question: z.string().trim().min(1),
    rubric: answerRubricSchema,
    tags: z.array(z.string().trim().min(1)),
  })
  .strict();

export const conceptLinkSchema = z
  .object({
    id: z.string().trim().min(1),
    source: z.string().trim().min(1),
    target: z.string().trim().min(1),
    type: relationTypeSchema,
    label: z.string().trim().min(1),
    explanation: z.string().trim().min(1),
    confidence: z.number().min(0).max(1),
    prerequisiteWeight: z.number().min(0).max(1),
    affectsMasteryPropagation: z.boolean(),
    sourceSpans: z.array(sourceSpanSchema),
  })
  .strict();

export const graphShapeSchema = z
  .object({
    schemaVersion: z.literal("1.0"),
    id: z.string().trim().min(1),
    title: z.string().trim().min(1),
    description: z.string(),
    domain: z.string().trim().min(1),
    createdAt: z.iso.datetime(),
    documentId: z.string().trim().optional(),
    clusters: z.array(
      z
        .object({
          id: z.string().trim().min(1),
          label: z.string().trim().min(1),
          description: z.string(),
        })
        .strict(),
    ),
    nodes: z.array(conceptNodeSchema).min(1),
    links: z.array(conceptLinkSchema),
    warnings: z.array(z.string()),
  })
  .strict();

export const knowledgeGraphSchema = graphShapeSchema.superRefine((graph, context) => {
  const nodeIds = new Set<string>();
  const linkIds = new Set<string>();
  const clusterIds = new Set(graph.clusters.map((cluster) => cluster.id));
  const clusterLabels = new Set(graph.clusters.map((cluster) => cluster.label));

  graph.nodes.forEach((node, index) => {
    if (nodeIds.has(node.id)) {
      context.addIssue({
        code: "custom",
        path: ["nodes", index, "id"],
        message: `Duplicate node id: ${node.id}`,
      });
    }
    nodeIds.add(node.id);
    if (!clusterIds.has(node.cluster) && !clusterLabels.has(node.cluster)) {
      context.addIssue({
        code: "custom",
        path: ["nodes", index, "cluster"],
        message: `Unknown cluster: ${node.cluster}`,
      });
    }
  });

  graph.links.forEach((link, index) => {
    if (linkIds.has(link.id)) {
      context.addIssue({
        code: "custom",
        path: ["links", index, "id"],
        message: `Duplicate link id: ${link.id}`,
      });
    }
    linkIds.add(link.id);
    if (!nodeIds.has(link.source) || !nodeIds.has(link.target)) {
      context.addIssue({
        code: "custom",
        path: ["links", index],
        message: `Dangling link: ${link.source} → ${link.target}`,
      });
    }
    if (link.source === link.target) {
      context.addIssue({
        code: "custom",
        path: ["links", index],
        message: `Self links are not accepted: ${link.id}`,
      });
    }
  });
});

export const learnerConceptStateSchema = z
  .object({
    conceptId: z.string().min(1),
    masteryProbability: z.number().min(0).max(1),
    status: conceptStatusSchema,
    attempts: z.number().int().nonnegative(),
    correctAttempts: z.number().int().nonnegative(),
    lastReviewedAt: z.string().optional(),
    nextReviewAt: z.string().optional(),
    stability: z.number().optional(),
    difficulty: z.number().optional(),
    updatedAt: z.string(),
  })
  .strict();

export const verificationResultSchema = z
  .object({
    mode: z.enum(["gpt", "local", "mock"]),
    score: z.number().min(0).max(1),
    verdict: z.enum(["correct", "partial", "incorrect"]),
    coveredConcepts: z.array(z.string()),
    missingConcepts: z.array(z.string()),
    misconceptions: z.array(z.string()),
    feedback: z.string().min(1),
    hint: z.string().optional(),
    confidence: z.number().min(0).max(1),
  })
  .strict();

export const attemptRecordSchema = z
  .object({
    id: z.string().min(1),
    graphId: z.string().min(1),
    conceptId: z.string().min(1),
    timestamp: z.string(),
    response: z.string(),
    score: z.number().min(0).max(1),
    verdict: z.enum(["correct", "partial", "incorrect"]),
    coveredConcepts: z.array(z.string()),
    missingConcepts: z.array(z.string()),
    misconceptions: z.array(z.string()),
    feedback: z.string(),
    hint: z.string().optional(),
    masteryBefore: z.number().min(0).max(1),
    masteryAfter: z.number().min(0).max(1),
    verifierMode: z.enum(["gpt", "local", "mock"]),
  })
  .strict();

export const sourceChunkSchema = z
  .object({
    id: z.string().min(1),
    documentId: z.string().min(1),
    page: z.number().int().positive(),
    section: z.string().optional(),
    text: z.string().min(1),
    charStart: z.number().int().nonnegative().optional(),
    charEnd: z.number().int().nonnegative().optional(),
  })
  .strict();

export const extractGraphRequestSchema = z
  .object({
    document: z
      .object({
        id: z.string().min(1),
        title: z.string().min(1),
        domainHint: z.string().optional(),
      })
      .strict(),
    chunks: z.array(sourceChunkSchema).min(1).max(120),
    options: z
      .object({
        targetConceptCount: z.number().int().min(3).max(35).optional(),
        includeFormulas: z.boolean().optional(),
        model: z.string().optional(),
      })
      .strict()
      .optional(),
  })
  .strict()
  .refine(
    (request) => request.chunks.reduce((sum, chunk) => sum + chunk.text.length, 0) <= 100_000,
    "Source payload exceeds 100,000 characters",
  );

export const verifyAnswerRequestSchema = z
  .object({
    graphId: z.string().min(1),
    concept: conceptNodeSchema.pick({
      id: true,
      label: true,
      summary: true,
      question: true,
      rubric: true,
      sourceSpans: true,
    }),
    learnerAnswer: z.string().trim().min(1).max(5_000),
  })
  .strict();

export type ConceptStatus = z.infer<typeof conceptStatusSchema>;
export type RelationType = z.infer<typeof relationTypeSchema>;
export type SourceSpan = z.infer<typeof sourceSpanSchema>;
export type AnswerRubric = z.infer<typeof answerRubricSchema>;
export type ConceptNode = z.infer<typeof conceptNodeSchema>;
export type ConceptLink = z.infer<typeof conceptLinkSchema>;
export type KnowledgeGraph = z.infer<typeof knowledgeGraphSchema>;
export type LearnerConceptState = z.infer<typeof learnerConceptStateSchema>;
export type VerificationResult = z.infer<typeof verificationResultSchema>;
export type AttemptRecord = z.infer<typeof attemptRecordSchema>;
export type SourceChunk = z.infer<typeof sourceChunkSchema>;
export type ExtractGraphRequest = z.infer<typeof extractGraphRequestSchema>;
export type VerifyAnswerRequest = z.infer<typeof verifyAnswerRequestSchema>;

