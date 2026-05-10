"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const highlights = [
  {
    value: "500+",
    label: "branches and points of sale analyzed",
  },
  {
    value: "Top 3",
    label: "drivers explained per recommendation with SHAP",
  },
  {
    value: "2+ yrs",
    label: "applied analytics across banking and research",
  },
];

const focusAreas = [
  "Explainable machine learning",
  "Geo-marketing and location intelligence",
  "Decision analytics for banking",
  "Data pipelines for reporting",
];

const projectFilters = ["All", "Data Science", "Data Engineering", "Product"] as const;

type ProjectFilter = (typeof projectFilters)[number];

type Project = {
  title: string;
  period: string;
  category: ProjectFilter;
  summary: string;
  impact: string[];
  stack: string[];
};

const projects: Project[] = [
  {
    title: "Banking Recommendation Engine Rebuild",
    period: "2024 - Present",
    category: "Data Science",
    summary:
      "Reworked the recommendation logic with behavioral signals to improve relevance and trust for advisors.",
    impact: [
      "Unified business rules with new behavioral variables",
      "Delivered explanation cards showing the top drivers per client",
    ],
    stack: ["Python", "PySpark", "SQL", "SHAP", "Dataiku"],
  },
  {
    title: "Geo-Marketing Branch Strategy",
    period: "2024",
    category: "Data Science",
    summary:
      "Benchmarked 500+ retail points using traffic, density, and competition signals to guide expansion and closure.",
    impact: [
      "Mapped branch footprints against competitor coverage",
      "Recommended closures and new sites based on deficit scoring",
    ],
    stack: ["Python", "Geo analytics", "Tableau", "SQL"],
  },
  {
    title: "Research Data Reporting Automation",
    period: "2023",
    category: "Data Engineering",
    summary:
      "Built automated SQL extracts and reporting workflows to improve research support visibility.",
    impact: [
      "Automated recurring reports and extractions",
      "Improved internal documentation for adoption",
    ],
    stack: ["SQL", "Reporting", "Documentation"],
  },
  {
    title: "Bank Intranet Modernization",
    period: "2023",
    category: "Product",
    summary:
      "Redesigned the intranet experience with secure file access, advanced search, and streamlined navigation.",
    impact: [
      "Modernized UI and information architecture",
      "Added secure access control and document previews",
    ],
    stack: ["Spring Boot", "Angular", "MySQL"],
  },
];

const dashboardLabels = ["Conversion", "Coverage", "Advisor Trust"];

const dashboardSeries = {
  "Behavioral Signals": [72, 65, 58],
  "Optimized Rules": [84, 74, 69],
} as const;

type DashboardView = keyof typeof dashboardSeries;

const notebooks = [
  {
    title: "Recommendation Explainability Lab",
    summary:
      "Notebook walkthrough of SHAP-based explanations for banking recommendations.",
    href: "/notebooks/recommendation-explainability.html",
    stack: ["Python", "SHAP", "Pandas"],
  },
  {
    title: "Geo-Marketing Footfall Scoring",
    summary:
      "Location scoring model combining traffic, density, and competition signals.",
    href: "/notebooks/geomarketing-footfall.html",
    stack: ["Python", "Geo", "Scikit-learn"],
  },
  {
    title: "Branch Network Optimization",
    summary:
      "Scenario analysis notebook for opening, closing, or moving branches.",
    href: "/notebooks/branch-optimization.html",
    stack: ["Python", "Optimization", "Plotting"],
  },
];

const experience = [
  {
    company: "Societe Generale",
    role: "Data Scientist Apprentice",
    period: "Sep 2024 - Present",
    location: "La Defense, France",
    bullets: [
      "Redesigned a banking recommendation engine by optimizing business rules and integrating behavioral signals.",
      "Built an explainability dashboard with SHAP to surface the top 3 drivers per recommendation.",
      "Ran a geo-marketing study across 500+ points of sale to guide closure and expansion decisions.",
    ],
    stack: ["Python", "PySpark", "SQL", "Dataiku"],
  },
  {
    company: "BMCI",
    role: "Full Stack Developer Intern",
    period: "May 2023 - Sep 2023",
    location: "Nouakchott, Mauritania",
    bullets: [
      "Rebuilt the bank intranet with a modern architecture to improve the user experience.",
      "Implemented secure file storage and user access management.",
      "Delivered advanced search, filtering, and document viewing features.",
    ],
    stack: ["Spring Boot", "Angular", "MySQL"],
  },
  {
    company: "University Paris Dauphine",
    role: "Data Engineer Intern (Research Support)",
    period: "Jan 2023 - Mar 2023",
    location: "Paris, France",
    bullets: [
      "Automated SQL reports and data extractions for research teams.",
      "Improved processes to integrate internal tools.",
      "Updated user guides and provided support for adoption.",
    ],
    stack: ["SQL", "Documentation", "Support"],
  },
];

const education = [
  {
    program: "Master MIAGE - Business Intelligence",
    school: "University Paris Dauphine",
    period: "2023 - 2025",
    highlights: [
      "Advanced machine learning, optimization, data warehousing, and big data systems.",
      "Conference lead for Paris Dauphine Afrique.",
    ],
  },
];

const toolkit = [
  {
    title: "Languages",
    items: [
      { name: "Python", icon: "/icons/python.svg" },
      { name: "Java (OpenJDK)", icon: "/icons/openjdk.svg" },
      { name: "R", icon: "/icons/r.svg" },
      { name: "C++", icon: "/icons/cplusplus.svg" },
      { name: "PostgreSQL", icon: "/icons/postgresql.svg" },
      { name: "MySQL", icon: "/icons/mysql.svg" },
    ],
  },
  {
    title: "Data Science",
    items: [
      { name: "Pandas", icon: "/icons/pandas.svg" },
      { name: "Scikit-learn", icon: "/icons/scikitlearn.svg" },
      { name: "Matplotlib", icon: "/icons/matplotlib.svg" },
      { name: "Jupyter", icon: "/icons/jupyter.svg" },
    ],
  },
  {
    title: "Data Platforms",
    items: [
      { name: "Apache Spark", icon: "/icons/apachespark.svg" },
      { name: "Dataiku", icon: "/icons/dataiku.svg" },
      { name: "Tableau", icon: "/icons/tableau.svg" },
      { name: "Power BI", icon: "/icons/powerbi.svg" },
    ],
  },
  {
    title: "Engineering",
    items: [
      { name: "Docker", icon: "/icons/docker.svg" },
      { name: "Microsoft Azure", icon: "/icons/azure.svg" },
      { name: "Terraform", icon: "/icons/terraform.svg" },
      { name: "Jenkins", icon: "/icons/jenkins.svg" },
      { name: "Bash", icon: "/icons/gnubash.svg" },
    ],
  },
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("All");
  const [dashboardView, setDashboardView] = useState<DashboardView>(
    "Behavioral Signals",
  );
  const [showPhoto, setShowPhoto] = useState(true);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") {
      return projects;
    }
    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="relative overflow-hidden">
      <div className="orb teal" aria-hidden="true" />
      <div className="orb warm" aria-hidden="true" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-14 px-6 pb-24 pt-8">
        <header className="flex items-center justify-between text-sm text-muted">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--accent)] text-xs font-semibold text-white">
              IW
            </div>
            <span className="uppercase tracking-[0.2em]">Ibrahima Wane</span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#work">Projects</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <section className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <div className="relative h-20 w-20 overflow-hidden rounded-full border border-stroke bg-[color:var(--accent)] text-white">
            <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold" aria-hidden="true">
              IW
            </span>
            {showPhoto ? (
              <Image
                src="/profile.jpg"
                alt="Portrait of Ibrahima Wane"
                fill
                sizes="80px"
                className="object-cover"
                priority
                onError={() => setShowPhoto(false)}
              />
            ) : null}
          </div>
          <h1 className="section-title text-4xl md:text-5xl">Ibrahima Wane</h1>
          <div className="h-1 w-10 rounded-full bg-[color:var(--accent-warm)]" />
          <p className="text-base text-muted md:text-lg">
            Data scientist focused on explainable ML, geo-marketing, and decision
            intelligence systems for complex business challenges.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              className="rounded-full bg-[color:var(--accent)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_18px_40px_var(--shadow)] transition hover:-translate-y-0.5"
              href="#work"
            >
              View Work
            </a>
            <a
              className="rounded-full border border-stroke px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted transition hover:-translate-y-0.5"
              href="/cv-ibrahima-wane.pdf"
              download
            >
              Download CV
            </a>
          </div>
        </section>

        <section id="work" className="space-y-8">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 rounded-lg bg-[#f6c400] px-6 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-black shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
            <span className="hidden text-[0.65rem] text-black/70 sm:inline">
              Categories
            </span>
            <div className="flex flex-wrap items-center gap-4">
              {projectFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`transition ${
                    activeFilter === filter
                      ? "text-black underline decoration-black/60 decoration-2 underline-offset-[6px]"
                      : "text-black/70 hover:text-black"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="section-title text-3xl">Project explorer</h2>
            <p className="text-muted">
              Filter by discipline to see how I combine analytics and
              engineering.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {filteredProjects.map((project) => (
              <article key={project.title} className="card p-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="section-title text-2xl">{project.title}</h3>
                  <span className="pill">{project.period}</span>
                </div>
                <p className="mt-3 text-sm text-muted">{project.summary}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {project.impact.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[color:var(--accent)]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span key={item} className="tag">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="dashboard" className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <p className="eyebrow">Dynamic dashboard</p>
            <h2 className="section-title text-3xl">Recommendation quality view</h2>
            <p className="text-muted">
              A lightweight example of the interactive components I build for
              advisors and analysts.
            </p>
            <div className="flex flex-wrap gap-3">
              {(Object.keys(dashboardSeries) as DashboardView[]).map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setDashboardView(view)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                    dashboardView === view
                      ? "border-transparent bg-[color:var(--accent-warm)] text-white"
                      : "border-stroke text-muted hover:border-[color:var(--accent-warm)]"
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
            <div className="grid gap-3">
              {dashboardLabels.map((label, index) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-muted">{label}</span>
                  <span className="text-lg font-semibold text-[color:var(--accent-strong)]">
                    {dashboardSeries[dashboardView][index]}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card flex flex-col justify-between gap-6 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-muted">Signal uplift</p>
              <span className="pill">Q4 snapshot</span>
            </div>
            <div className="flex h-48 items-end justify-around gap-6">
              {dashboardSeries[dashboardView].map((value, index) => (
                <div key={dashboardLabels[index]} className="flex flex-col items-center gap-3">
                  <div className="relative flex h-40 w-10 items-end justify-center rounded-full bg-[color:rgba(11,107,95,0.12)]">
                    <div
                      className="w-10 rounded-full bg-[color:var(--accent)]"
                      style={{ height: `${value}%` }}
                    />
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-muted">
                    {dashboardLabels[index]}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted">
              This view demonstrates how performance changes between signal
              strategies in a clean, executive-friendly layout.
            </p>
          </div>
        </section>

        <section id="notebooks" className="space-y-8">
          <div>
            <p className="eyebrow">Notebooks and demos</p>
            <h2 className="section-title text-3xl">Fast notebook previews</h2>
            <p className="text-muted">
              Export notebooks with nbconvert and drop them into the /public
              folder for instant previews.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {notebooks.map((notebook) => (
              <article key={notebook.title} className="card flex h-full flex-col p-6">
                <h3 className="section-title text-xl">{notebook.title}</h3>
                <p className="mt-2 text-sm text-muted">{notebook.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {notebook.stack.map((item) => (
                    <span key={item} className="tag">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-auto pt-6">
                  <a
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--accent)]"
                    href={notebook.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View notebook
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="space-y-8">
          <div>
            <p className="eyebrow">Experience</p>
            <h2 className="section-title text-3xl">Industry impact</h2>
          </div>
          <div className="relative grid gap-6">
            <div className="absolute left-4 top-2 h-full w-px bg-[color:var(--stroke)]" aria-hidden="true" />
            {experience.map((role) => (
              <article key={role.company} className="relative pl-12">
                <div className="absolute left-2 top-3 h-4 w-4 rounded-full bg-[color:var(--accent)]" />
                <div className="card p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="section-title text-xl">{role.company}</h3>
                      <p className="text-sm text-muted">{role.role}</p>
                    </div>
                    <div className="text-sm text-muted">
                      <p>{role.period}</p>
                      <p>{role.location}</p>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm">
                    {role.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-[color:var(--accent-warm)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {role.stack.map((item) => (
                      <span key={item} className="tag">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="card space-y-4 p-6">
            <p className="eyebrow">Education</p>
            {education.map((item) => (
              <div key={item.program}>
                <h3 className="section-title text-xl">{item.program}</h3>
                <p className="text-sm text-muted">
                  {item.school} · {item.period}
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[color:var(--accent)]" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div id="skills" className="card space-y-6 p-6">
            <div>
              <p className="eyebrow">Skills</p>
              <h2 className="section-title text-2xl">Toolkit</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {toolkit.map((group) => (
                <div key={group.title}>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
                    {group.title}
                  </p>
                  <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
                    {group.items.map((item) => (
                      <div key={item.name} className="icon-tile">
                        <Image
                          src={item.icon}
                          alt={item.name}
                          width={32}
                          height={32}
                          className="h-8 w-8 object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="card grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="eyebrow">Let us connect</p>
            <h2 className="section-title text-3xl">Let us build something sharp</h2>
            <p className="text-muted">
              If you are hiring for data science or analytics roles, I would
              love to discuss how I can help your team deliver measurable
              impact.
            </p>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                Email
              </p>
              <a href="mailto:ibrahima.wane@outlook.fr" className="text-lg font-semibold">
                ibrahima.wane@outlook.fr
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                Phone
              </p>
              <p className="text-lg font-semibold">+33 6 13 95 89 03</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                Links
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.linkedin.com/in/ibrahima-wane"
                  className="text-sm font-semibold text-[color:var(--accent)]"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/waneib22"
                  className="text-sm font-semibold text-[color:var(--accent)]"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted">
          <p>Crafted with Next.js, TypeScript, and a focus on decision intelligence.</p>
          <p>Based in Paris, France.</p>
        </footer>
      </div>
    </div>
  );
}
