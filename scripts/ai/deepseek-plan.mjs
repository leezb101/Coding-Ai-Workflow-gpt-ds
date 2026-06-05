import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();

const WORKFLOW_DIR = path.join(ROOT, "docs", "ai-workflow");

const INPUT_FILES = {
  intake: path.join(WORKFLOW_DIR, "intake.md"),
  task: path.join(WORKFLOW_DIR, "task.md"),
  context: path.join(WORKFLOW_DIR, "context.md"),
  visionSpec: path.join(WORKFLOW_DIR, "vision-spec.md"),
};

const OUTPUT_FILE = path.join(WORKFLOW_DIR, "deepseek-plan.md");

const apiKey = process.env.DEEPSEEK_API_KEY;
const model = process.env.DEEPSEEK_MODEL || "deepseek-v4-pro";

if (!apiKey) {
  console.error("Missing DEEPSEEK_API_KEY.");
  console.error("Please run:");
  console.error('  export DEEPSEEK_API_KEY="your_api_key_here"');
  process.exit(1);
}

async function readOptionalFile(filePath) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return "";
    }
    throw error;
  }
}

function isTemplateOnly(content) {
  if (!content.trim()) return true;

  const todoCount = (content.match(/TODO/g) || []).length;
  const lineCount = content.split("\n").filter(Boolean).length;

  return todoCount >= 3 && lineCount <= 80;
}

function countTodos(content) {
  return (content.match(/TODO/g) || []).length;
}

function needsVisualAnalysis(intake) {
  const match = intake.match(/## Needs Visual Analysis\s*\n+([\s\S]*?)(?=\n## |\n# |$)/i);
  if (!match) return false;

  return /^\s*-\s*Yes\s*$/im.test(match[1]);
}

function warnIfTemplateLike(name, content) {
  if (isTemplateOnly(content)) {
    console.warn(`Warning: ${name} appears to contain only template content.`);
    return;
  }

  const todoCount = countTodos(content);
  if (todoCount >= 3) {
    console.warn(`Warning: ${name} still contains ${todoCount} TODO markers.`);
  }
}

function buildPrompt({ intake, task, context, visionSpec }) {
  return `
You are a senior software engineering planning assistant.

You are NOT editing the codebase directly.
Your job is to generate a practical implementation plan for Codex Desktop.

Codex Desktop will later read your plan, compare it against the real codebase, modify files, run verification commands, and produce an execution report.

Important rules:

1. Do not assume you can see images, screenshots, browser pages, or PDFs directly.
2. Only use the text provided in the workflow files.
3. If visual information is missing or unclear, explicitly say so.
4. Prefer minimal safe changes.
5. Do not recommend broad rewrites unless the task clearly requires them.
6. Do not introduce new dependencies unless clearly necessary.
7. Make the output directly useful for Codex Desktop.
8. If the context appears to be only a template with TODO placeholders, say that the input is insufficient and ask Codex Desktop to generate real context first.

Please produce a Markdown document with this exact structure:

# DeepSeek Plan

## Input Summary

Summarize the available task, context, and vision specification.

## Problem Analysis

Analyze the likely problem and relevant engineering considerations.

## Recommended Approach

Describe the recommended implementation approach.

## Files to Modify

List likely files to inspect or modify. If unknown, say what Codex should inspect first.

## Step-by-Step Plan

Provide small ordered steps for Codex Desktop.

## Key Code Suggestions

Provide pseudocode or focused snippets only when helpful. Avoid large blind patches.

## Verification Plan

List commands or manual checks Codex Desktop should run.

## Risks

List risks, assumptions, and uncertainty.

## Codex Desktop Execution Prompt

Write a final prompt that the user can paste into Codex Desktop to execute the plan.

---

# AI Workflow Intake

${intake}

---

# Task

${task}

---

# Project Context

${context}

---

# Vision / UI / PDF / Browser Specification

${visionSpec}
`;
}

async function main() {
  await fs.mkdir(WORKFLOW_DIR, { recursive: true });

  const intake = await readOptionalFile(INPUT_FILES.intake);
  const task = await readOptionalFile(INPUT_FILES.task);
  const context = await readOptionalFile(INPUT_FILES.context);
  const rawVisionSpec = await readOptionalFile(INPUT_FILES.visionSpec);
  const includeVisionSpec = needsVisualAnalysis(intake);
  const visionSpec = includeVisionSpec
    ? rawVisionSpec
    : "Vision spec is not applicable for this task.";

  const hasOnlyTemplates =
    isTemplateOnly(intake) &&
    isTemplateOnly(task) &&
    isTemplateOnly(context) &&
    (!includeVisionSpec || isTemplateOnly(rawVisionSpec));

  if (hasOnlyTemplates) {
    console.warn("Warning: workflow files appear to contain only templates.");
    console.warn("The generated DeepSeek plan may ask for real task/context first.");
  }

  warnIfTemplateLike("intake.md", intake);
  warnIfTemplateLike("task.md", task);
  warnIfTemplateLike("context.md", context);

  if (includeVisionSpec) {
    warnIfTemplateLike("vision-spec.md", rawVisionSpec);
  } else if (rawVisionSpec.trim() && !isTemplateOnly(rawVisionSpec)) {
    console.warn(
      "Warning: vision-spec.md exists but intake does not mark visual analysis as needed. It will not be included in the DeepSeek prompt.",
    );
  }

  const prompt = buildPrompt({
    intake,
    task,
    context,
    visionSpec,
  });

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a rigorous senior software engineer. You generate implementation plans for an AI coding agent. You do not edit code directly.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`DeepSeek API request failed: ${response.status} ${response.statusText}`);
    console.error(errorText);
    process.exit(1);
  }

  const data = await response.json();
  const output = data?.choices?.[0]?.message?.content;

  if (!output) {
    console.error("DeepSeek API returned no message content.");
    console.error(JSON.stringify(data, null, 2));
    process.exit(1);
  }

  await fs.writeFile(OUTPUT_FILE, output, "utf8");

  console.log(`Wrote ${path.relative(ROOT, OUTPUT_FILE)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
