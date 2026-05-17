import Card from "../components/Card";
import { useResumeData } from "../context/ResumeDataContext";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { FileText } from "lucide-react";

function Section({ title, children, accent = "#D8C9AE" }) {
  return (
    <Card className="mb-6">
      <h3 className="text-lg font-semibold mb-4" style={{ color: accent }}>{title}</h3>
      {children}
    </Card>
  );
}

function EmptyState({ label }) {
  return <p className="text-[#8B7355] text-sm italic">No {label} added yet. Go to Overview to fill this in.</p>;
}

export default function SavedResume() {
  const { user } = useAuth();
  const { itData, nonItData, compData } = useResumeData();
  const location = useLocation();

  // Determine which dashboard type based on URL
  const pathParts = location.pathname.split("/");
  const type = pathParts[2]; // "it", "non-it", or "competitive"

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <FileText className="w-6 h-6 text-[#D8C9AE]" />
        <h2 className="text-2xl font-light text-white">My Resume Data</h2>
      </div>

      {/* ════ IT Resume ════ */}
      {type === "it" && (
        <>
          <Section title="Technical Skills">
            {itData.skills.languages ? (
              <div className="space-y-3">
                <div><span className="text-[#C4A882] text-xs font-medium uppercase tracking-wider">Languages & Frameworks</span><p className="text-[#F5F0E8] mt-1">{itData.skills.languages}</p></div>
                {itData.skills.tools && <div><span className="text-[#C4A882] text-xs font-medium uppercase tracking-wider">Tools & Platforms</span><p className="text-[#F5F0E8] mt-1">{itData.skills.tools}</p></div>}
                {itData.skills.databases && <div><span className="text-[#C4A882] text-xs font-medium uppercase tracking-wider">Databases</span><p className="text-[#F5F0E8] mt-1">{itData.skills.databases}</p></div>}
              </div>
            ) : <EmptyState label="skills" />}
          </Section>

          <Section title="Projects">
            {itData.projects.length > 0 ? (
              <div className="space-y-4">
                {itData.projects.map((p, i) => (
                  <div key={i} className="p-4 rounded-lg glass-panel-light">
                    <h4 className="text-[#F5F0E8] font-medium text-base">{p.name}</h4>
                    {p.description && <p className="text-[#B0ACA5] text-sm mt-2">{p.description}</p>}
                    {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="text-[#D8C9AE] text-xs mt-2 inline-block hover:underline">{p.link}</a>}
                  </div>
                ))}
              </div>
            ) : <EmptyState label="projects" />}
          </Section>

          <Section title="Work Experience">
            {itData.experience.length > 0 ? (
              <div className="space-y-4">
                {itData.experience.map((e, i) => (
                  <div key={i} className="p-4 rounded-lg glass-panel-light">
                    <h4 className="text-[#F5F0E8] font-medium">{e.role}</h4>
                    <p className="text-[#C4A882] text-sm">{e.company}</p>
                    <p className="text-[#8B7355] text-xs mt-1">{e.start} — {e.end || "Present"}</p>
                  </div>
                ))}
              </div>
            ) : <EmptyState label="experience" />}
          </Section>
        </>
      )}

      {/* ════ Non-IT Resume ════ */}
      {type === "non-it" && (
        <>
          <Section title="Professional Skills" accent="#B08D8D">
            {nonItData.skills.core ? (
              <div className="space-y-3">
                <div><span className="text-[#C4A882] text-xs font-medium uppercase tracking-wider">Core Skills</span><p className="text-[#F5F0E8] mt-1">{nonItData.skills.core}</p></div>
                {nonItData.skills.tools && <div><span className="text-[#C4A882] text-xs font-medium uppercase tracking-wider">Tools & Software</span><p className="text-[#F5F0E8] mt-1">{nonItData.skills.tools}</p></div>}
              </div>
            ) : <EmptyState label="skills" />}
          </Section>

          <Section title="Experience" accent="#B08D8D">
            {nonItData.experience.length > 0 ? (
              <div className="space-y-4">
                {nonItData.experience.map((e, i) => (
                  <div key={i} className="p-4 rounded-lg glass-panel-light">
                    <h4 className="text-[#F5F0E8] font-medium">{e.role}</h4>
                    <p className="text-[#B08D8D] text-sm">{e.company}</p>
                    {e.responsibilities && <p className="text-[#B0ACA5] text-xs mt-2">{e.responsibilities}</p>}
                  </div>
                ))}
              </div>
            ) : <EmptyState label="experience" />}
          </Section>

          <Section title="Certifications" accent="#B08D8D">
            {nonItData.certifications.length > 0 ? (
              <div className="space-y-3">
                {nonItData.certifications.map((c, i) => (
                  <div key={i} className="p-3 rounded-lg glass-panel-light flex justify-between items-center">
                    <div><p className="text-[#F5F0E8] font-medium">{c.name}</p><p className="text-[#B0ACA5] text-xs">{c.org}</p></div>
                    <span className="text-[#8B7355] text-sm">{c.year}</span>
                  </div>
                ))}
              </div>
            ) : <EmptyState label="certifications" />}
          </Section>

          <Section title="Achievements" accent="#B08D8D">
            {nonItData.achievements.length > 0 ? (
              <div className="space-y-3">
                {nonItData.achievements.map((a, i) => (
                  <div key={i} className="p-3 rounded-lg glass-panel-light">
                    <p className="text-[#F5F0E8] font-medium">{a.title}</p>
                    {a.description && <p className="text-[#B0ACA5] text-xs mt-1">{a.description}</p>}
                  </div>
                ))}
              </div>
            ) : <EmptyState label="achievements" />}
          </Section>
        </>
      )}

      {/* ════ Competitive Resume ════ */}
      {type === "competitive" && (
        <>
          <Section title="Target Exam" accent="#C4A882">
            {compData.target.exam ? (
              <div className="space-y-3">
                <div><span className="text-[#C4A882] text-xs font-medium uppercase tracking-wider">Exam</span><p className="text-[#F5F0E8] mt-1">{compData.target.exam}</p></div>
                {compData.target.service && <div><span className="text-[#C4A882] text-xs font-medium uppercase tracking-wider">Preferred Service</span><p className="text-[#F5F0E8] mt-1">{compData.target.service}</p></div>}
                {compData.target.year && <div><span className="text-[#C4A882] text-xs font-medium uppercase tracking-wider">Year</span><p className="text-[#F5F0E8] mt-1">{compData.target.year}</p></div>}
              </div>
            ) : <EmptyState label="target exam info" />}
          </Section>

          <Section title="Education" accent="#C4A882">
            {compData.education.length > 0 ? (
              <div className="space-y-3">
                {compData.education.map((e, i) => (
                  <div key={i} className="p-4 rounded-lg glass-panel-light">
                    <h4 className="text-[#F5F0E8] font-medium">{e.degree}</h4>
                    <p className="text-[#C4A882] text-sm">{e.university}</p>
                    <p className="text-[#8B7355] text-xs mt-1">{e.year} · {e.grade}</p>
                  </div>
                ))}
              </div>
            ) : <EmptyState label="education" />}
          </Section>

          <Section title="Optional Subjects" accent="#C4A882">
            {compData.subjects.optional ? (
              <div className="space-y-2">
                <p className="text-[#F5F0E8]">{compData.subjects.optional}</p>
                {compData.subjects.medium && <p className="text-[#8B7355] text-sm">Medium: {compData.subjects.medium}</p>}
              </div>
            ) : <EmptyState label="subjects" />}
          </Section>

          <Section title="Attempt History" accent="#C4A882">
            {compData.scores.length > 0 ? (
              <div className="space-y-3">
                {compData.scores.map((s, i) => (
                  <div key={i} className="p-3 rounded-lg glass-panel-light flex justify-between items-center">
                    <div><p className="text-[#F5F0E8] font-medium">{s.year} — {s.stage}</p></div>
                    {s.score && <span className="text-[#C4A882] text-sm font-mono">{s.score}</span>}
                  </div>
                ))}
              </div>
            ) : <EmptyState label="attempt scores" />}
          </Section>
        </>
      )}
    </div>
  );
}
