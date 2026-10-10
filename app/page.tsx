import { profile, stats, skills, experience, projects, education, training } from "./data";
import Nav from "../components/Nav";
import Reveal from "../components/Reveal";
import HeroScene from "../components/HeroScene";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="hero" id="top">
          <HeroScene />
          <div className="container">
            <h1>
              {profile.name.split(" ").slice(0, 2).join(" ")}
              <br />
              <span className="accent">{profile.name.split(" ").slice(2).join(" ")}</span>
            </h1>
            
            <p className="role mono">{profile.title}</p>
            <p className="lead">{profile.summary}</p>
            <div className="actions">
              <a className="btn primary" href="#projects">View my work</a>
              <a className="btn" href={`mailto:${profile.email}`}>Get in touch</a>
              <a className="btn ghost" href={profile.resumeUrl} download>Download resume</a>
            </div>
            <ul className="stats">
              {stats.map((s) => (
                <li key={s.label}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="section">
          <div className="container">
            <SectionTitle index="01" title="Skills" />
            <div className="skills">
              {skills.map((g) => (
                <Reveal key={g.group} className="skill-group">
                  <h3 className="mono">{g.group}</h3>
                  <ul className="chips">
                    {g.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="section">
          <div className="container">
            <SectionTitle index="02" title="Experience" />
            <ol className="timeline">
              {experience.map((job) => (
                <Reveal as="li" key={job.company} className="job">
                  <div className="job-head">
                    <h3>
                      {job.role} <span className="at">@ {job.company}</span>
                    </h3>
                    <span className="period mono">{job.period}</span>
                  </div>
                  <ul>
                    {job.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="section">
          <div className="container">
            <SectionTitle index="03" title="Projects" />
            <div className="projects">
              {projects.map((p, i) => (
                <Reveal key={p.name} className={`card${i < 2 ? " featured" : ""}`}>
                  <p className="kind mono">{p.kind}</p>
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <ul className="tags mono">
                    {p.stack.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  {p.links && (
                    <div className="store-links">
                      {p.links.map((l) => (
                        <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                          {l.label} ↗
                        </a>
                      ))}
                    </div>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Education */}
        <section id="education" className="section">
          <div className="container">
            <SectionTitle index="04" title="Education & Training" />
            <div className="edu">
              {education.map((e) => (
                <Reveal key={e.degree} className="edu-item">
                  <span className="period mono">{e.period}</span>
                  <h3>{e.degree}</h3>
                  <p>{e.school}</p>
                </Reveal>
              ))}
            </div>
            <h3 className="sub-title mono">Courses & training</h3>
            <ul className="training">
              {training.map((t) => (
                <Reveal as="li" key={t.course}>
                  <strong>{t.course}</strong>
                  <span>{t.provider}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="section contact">
          <div className="container">
            <SectionTitle index="05" title="Contact" />
            <h2 className="cta">
              Have a project in mind?
              <br />
              <a href={`mailto:${profile.email}`} className="accent">Let&apos;s build it.</a>
            </h2>
            <ul className="contact-links mono">
              <li><a href={`mailto:${profile.email}`}>{profile.email}</a></li>
              <li><a href={`tel:${profile.phone.replace(/\s/g, "")}`}>{profile.phone}</a></li>
              <li><a href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></li>
              <li><a href={profile.links.github} target="_blank" rel="noreferrer">GitHub ↗</a></li>
              <li><a href={profile.links.medium} target="_blank" rel="noreferrer">Medium ↗</a></li>
            </ul>
          </div>
        </section>
      </main>
      <footer className="footer mono">
        <div className="container">
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </div>
      </footer>
    </>
  );
}

function SectionTitle({ index, title }: { index: string; title: string }) {
  return (
    <div className="section-title">
      <span className="mono">{index}</span>
      <h2>{title}</h2>
      <span className="rule" />
    </div>
  );
}
