"use client";

import { useMemo, useState } from "react";
import { marked } from "marked";
import { generateArticle } from "../lib/generator";

const tones = [
  "professional",
  "conversational",
  "authoritative",
  "friendly",
  "technical",
  "storytelling"
];

const lengths = [
  { id: "short", label: "~700 words" },
  { id: "medium", label: "~1200 words" },
  { id: "long", label: "~2000 words" }
];

export default function GeneratorForm() {
  const [topic, setTopic] = useState("");
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [secondaryKeywords, setSecondaryKeywords] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [tone, setTone] = useState(tones[0]);
  const [length, setLength] = useState(lengths[1].id);
  const [cta, setCta] = useState("Subscribe for more insights");
  const [markdown, setMarkdown] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const html = useMemo(() => marked.parse(markdown || ""), [markdown]);

  function parseSecondaryKeywords(value) {
    return value
      .split(/,|\n/g)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function handleCopy() {
    navigator.clipboard.writeText(markdown);
  }

  function download(filename, content, type) {
    const blob = new Blob([content], { type });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const md = generateArticle({
        topic,
        primaryKeyword,
        secondaryKeywords: parseSecondaryKeywords(secondaryKeywords),
        targetAudience,
        tone,
        articleLength: length,
        callToAction: cta
      });
      setMarkdown(md);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="grid grid-2" style={{ gap: 24 }}>
      <form className="card grid" onSubmit={onSubmit}>
        <div className="row">
          <label className="label">Topic</label>
          <input className="input" placeholder="e.g., AI content marketing strategies" value={topic} onChange={(e) => setTopic(e.target.value)} required />
          <div className="help">Describe the broad theme you want to cover.</div>
        </div>

        <div className="row">
          <label className="label">Primary keyword</label>
          <input className="input" placeholder="e.g., AI content marketing" value={primaryKeyword} onChange={(e) => setPrimaryKeyword(e.target.value)} required />
          <div className="help">Used in the H1 and throughout the article.</div>
        </div>

        <div className="row">
          <label className="label">Secondary keywords (comma or newline separated)</label>
          <textarea className="textarea" placeholder="e.g., content automation, SEO optimization, editorial calendar" value={secondaryKeywords} onChange={(e) => setSecondaryKeywords(e.target.value)} />
        </div>

        <div className="row">
          <label className="label">Target audience</label>
          <input className="input" placeholder="e.g., B2B marketers, startup founders" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} required />
        </div>

        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="row">
            <label className="label">Tone of voice</label>
            <select className="select" value={tone} onChange={(e) => setTone(e.target.value)}>
              {tones.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="row">
            <label className="label">Article length</label>
            <select className="select" value={length} onChange={(e) => setLength(e.target.value)}>
              {lengths.map((l) => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="row">
          <label className="label">Call to action</label>
          <input className="input" placeholder="e.g., Book a demo, Download the guide" value={cta} onChange={(e) => setCta(e.target.value)} />
        </div>

        <div className="actions">
          <button className="button" type="submit" disabled={isGenerating}>{isGenerating ? "Generating?" : "Generate article"}</button>
          {!!markdown && (
            <>
              <button className="button secondary" type="button" onClick={handleCopy}>Copy Markdown</button>
              <button className="button ghost" type="button" onClick={() => download("article.md", markdown, "text/markdown")}>Download .md</button>
              <button className="button ghost" type="button" onClick={() => download("article.html", html, "text/html")}>Download .html</button>
            </>
          )}
        </div>
      </form>

      <div className="preview">
        {markdown ? (
          <article dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <div className="help">Your fully formatted article preview will appear here after generation.</div>
        )}
      </div>
    </div>
  );
}
