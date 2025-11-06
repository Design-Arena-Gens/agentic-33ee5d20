import GeneratorForm from "../components/GeneratorForm";

export default function Page() {
  return (
    <div className="grid" style={{ gap: 24 }}>
      <header className="header">
        <div>
          <div className="title">Elite Content Generator</div>
          <div className="subtitle">Research, outline, and craft publication-ready articles</div>
        </div>
      </header>
      <GeneratorForm />
      <div className="footer">Built for fast publishing and SEO. Deploy-ready on Vercel.</div>
    </div>
  );
}
