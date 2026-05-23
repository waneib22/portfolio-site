"use client";

import Image from "next/image";
import Link from "next/link";
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

const projectFilters = ["All", "Data Science", "Data Engineering"] as const;

type ProjectFilter = (typeof projectFilters)[number];

type Project = {
  title: string;
  period: string;
  category: Exclude<ProjectFilter, "All">;
  summary: string;
  impact: string[];
  stack: string[];
  repo: string;
  caseStudy?: string;
};

const projects: Project[] = [
  {
    title: "Credit Risk Scoring — Freddie Mac",
    period: "2026",
    category: "Data Science",
    summary:
      "End-to-end default risk model on Freddie Mac mortgage loans: reproducible Kedro pipeline, SHAP explainability, a Streamlit app, and a RAG documentation assistant.",
    impact: [
      "Chose logistic regression (AUC 0.74) over XGBoost for regulatory interpretability",
      "SHAP revealed the feature ranked #1 by importance actually hurt out-of-sample AUC",
    ],
    stack: ["Python", "scikit-learn", "XGBoost", "SHAP", "Kedro", "Streamlit"],
    repo: "https://github.com/waneib22/credit-risk-scoring",
    caseStudy: "/projects/credit-risk-scoring",
  },
  {
    title: "MLOps — Road Accident Severity",
    period: "2026",
    category: "Data Engineering",
    summary:
      "MLOps pipeline classifying French road-accident severity (BAAC 2021) behind a containerized FastAPI service with inference, retraining, and monitoring endpoints.",
    impact: [
      "Random Forest on ~54k accidents served via FastAPI + Docker Compose",
      "Endpoints for prediction, on-demand retraining, health and metrics, with CI",
    ],
    stack: ["Python", "Random Forest", "FastAPI", "Docker", "CI/CD"],
    repo: "https://github.com/waneib22/mlops-accidents/tree/ibrahima",
    caseStudy: "/projects/mlops-accidents",
  },
  {
    title: "Bank Marketing Conversion Prediction",
    period: "2024",
    category: "Data Science",
    summary:
      "Binary classification predicting term-deposit subscription from a bank marketing campaign, handling strong class imbalance end to end.",
    impact: [
      "Compared logistic regression, random forest, SVC and KNN on imbalanced data",
      "Applied SMOTE resampling after full EDA on categorical and numeric drivers",
    ],
    stack: ["Python", "scikit-learn", "SMOTE", "Pandas"],
    repo: "https://github.com/waneib22/BankMarketingML",
    caseStudy: "/projects/bank-marketing",
  },
  {
    title: "Bayesian Inverse Reinforcement Learning",
    period: "2024",
    category: "Data Science",
    summary:
      "Recovering reward functions from observed behavior in a gridworld MDP using Bayesian IRL with the PolicyWalk sampling algorithm.",
    impact: [
      "Built a gridworld MDP, policy iteration, and an imperfect-tutor simulator",
      "Inferred rewards via Bayesian PolicyWalk sampling over Q-values",
    ],
    stack: ["Python", "Reinforcement Learning", "Bayesian", "NumPy"],
    repo: "https://github.com/waneib22/bayesian_irl",
    caseStudy: "/projects/bayesian-irl",
  },
];

const experience = [
  {
    company: "Société Générale",
    role: "Data Scientist Apprentice",
    period: "Sep 2024 - Present",
    location: "La Défense, France",
    bullets: [
      "Rebuilt the pre-screening model for professional prospects: estimates the grantable credit amount before relationship onboarding, cutting case-processing time and smoothing the client journey.",
      "Brought explainability to the banking recommendation engine serving 7 million retail clients — SHAP analysis plus an automated dashboard advisors use to read each decision.",
      "Segmented retail clients to sharpen commercial targeting and tailor offers by risk and behavioral profile.",
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
    company: "Université Paris Dauphine",
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
    program: "Master MIAGE — Business Intelligence",
    school: "Université Paris Dauphine",
    period: "2023 - 2025",
    highlights: [
      "Coursework: advanced machine learning, optimization, data warehousing, big data systems.",
      {
        text: "Master's thesis: L'explicabilité dans les systèmes de recommandation",
        href: "/master-thesis.pdf",
      },
      "Conference lead for the Paris Dauphine Afrique student association.",
    ],
  },
  {
    program: "Bachelor's Year 3 — MIAGE",
    school: "Université Paris Dauphine",
    period: "2022 - 2023",
    highlights: [
      "Coursework: data analysis (regression, PCA, statistical tests), probability & statistics, linear programming (simplex, duality), relational databases & SQL.",
    ],
  },
  {
    program: "Bachelor's — Mathematics & Economics",
    school: "Université Claude Bernard Lyon 1",
    period: "2019 - 2022",
    highlights: [
      "Coursework: data analysis (PCA, clustering, supervised classification, neural networks), advanced probability & statistics, econometrics, operations research.",
    ],
  },
];

type PersonalPhoto = {
  src: string;
  caption: string;
  width: number;
  height: number;
};

const personalPhotos: PersonalPhoto[] = [
  {
    src: "/images/personal/dauphine-afrique.jpg",
    caption: "Moderating “Journalism in Africa” — Paris Dauphine Afrique",
    width: 828,
    height: 625,
  },
  {
    src: "/images/personal/graduation.jpg",
    caption: "Master 2 graduation — Université Paris Dauphine",
    width: 768,
    height: 1024,
  },
  {
    src: "/images/personal/renaissance-dakar.jpg",
    caption: "Dakar — Monument de la Renaissance Africaine",
    width: 1200,
    height: 1600,
  },
  {
    src: "/images/personal/goree.jpg",
    caption: "Île de Gorée, Senegal",
    width: 1200,
    height: 1600,
  },
  {
    src: "/images/personal/etretat.jpg",
    caption: "Étretat — Falaise d'Aval, Normandy",
    width: 1600,
    height: 1200,
  },
  {
    src: "/images/personal/barcelona.jpg",
    caption: "Barcelona — Park Güell",
    width: 960,
    height: 1280,
  },
  {
    src: "/images/personal/come.jpg",
    caption: "Como — Duomo",
    width: 1200,
    height: 1600,
  },
  {
    src: "/images/personal/amsterdam.jpg",
    caption: "Amsterdam — canals",
    width: 768,
    height: 1024,
  },
  {
    src: "/images/personal/lucerne.jpg",
    caption: "Lucerne — Jesuitenkirche",
    width: 768,
    height: 1024,
  },
];

type SkillItem = { name: string; icon?: string };
type SkillGroup = { title: string; items: SkillItem[] };

const toolkit: SkillGroup[] = [
  {
    title: "Languages & Databases",
    items: [
      { name: "Python", icon: "/icons/python.svg" },
      { name: "SQL" },
      { name: "Java", icon: "/icons/openjdk.svg" },
      { name: "R", icon: "/icons/r.svg" },
      { name: "C/C++", icon: "/icons/cplusplus.svg" },
      { name: "PostgreSQL", icon: "/icons/postgresql.svg" },
      { name: "MySQL", icon: "/icons/mysql.svg" },
      { name: "MongoDB" },
    ],
  },
  {
    title: "Machine Learning",
    items: [
      { name: "pandas", icon: "/icons/pandas.svg" },
      { name: "NumPy" },
      { name: "scikit-learn", icon: "/icons/scikitlearn.svg" },
      { name: "TensorFlow" },
      { name: "PyTorch" },
      { name: "XGBoost" },
      { name: "SHAP" },
      { name: "Matplotlib", icon: "/icons/matplotlib.svg" },
    ],
  },
  {
    title: "MLOps & Engineering",
    items: [
      { name: "FastAPI" },
      { name: "Streamlit" },
      { name: "Kedro" },
      { name: "Docker", icon: "/icons/docker.svg" },
      { name: "GitHub Actions" },
      { name: "Jenkins", icon: "/icons/jenkins.svg" },
      { name: "Terraform", icon: "/icons/terraform.svg" },
      { name: "Azure", icon: "/icons/azure.svg" },
      { name: "Bash", icon: "/icons/gnubash.svg" },
    ],
  },
  {
    title: "Data & BI",
    items: [
      { name: "Apache Spark", icon: "/icons/apachespark.svg" },
      { name: "Dataiku", icon: "/icons/dataiku.svg" },
      { name: "Tableau", icon: "/icons/tableau.svg" },
      { name: "Power BI", icon: "/icons/powerbi.svg" },
      { name: "Jupyter", icon: "/icons/jupyter.svg" },
    ],
  },
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("All");
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
                src="/profile.png"
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
            Data scientist with 2 years of hands-on banking experience, building
            ML systems end to end — from messy raw data to explainable models and
            deployed services. Currently at Société Générale; MIAGE master&apos;s
            graduate from Paris Dauphine.
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
              target="_blank"
              rel="noreferrer"
            >
              View CV
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
                <div className="mt-5 flex flex-wrap items-center gap-5">
                  {project.caseStudy ? (
                    <Link
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--accent)]"
                      href={project.caseStudy}
                    >
                      Read case study
                      <span aria-hidden="true">→</span>
                    </Link>
                  ) : null}
                  <a
                    className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-[color:var(--accent)]"
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View code
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
            {education.map((item, idx) => (
              <div
                key={item.program}
                className={
                  idx > 0 ? "border-t border-[color:var(--stroke)] pt-4" : ""
                }
              >
                <h3 className="section-title text-xl">{item.program}</h3>
                <p className="text-sm text-muted">
                  {item.school} · {item.period}
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  {item.highlights.map((highlight) => {
                    const isLink = typeof highlight !== "string";
                    const key = isLink ? highlight.text : highlight;
                    return (
                      <li key={key} className="flex items-start gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-[color:var(--accent)]" />
                        {isLink ? (
                          <a
                            href={highlight.href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[color:var(--accent)] hover:underline"
                          >
                            {highlight.text}
                            <span className="ml-1 text-muted">[PDF]</span>
                          </a>
                        ) : (
                          highlight
                        )}
                      </li>
                    );
                  })}
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
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {group.items.map((item) => (
                      <span key={item.name} className="skill-chip">
                        {item.icon ? (
                          <Image
                            src={item.icon}
                            alt=""
                            width={18}
                            height={18}
                            className="h-[18px] w-[18px] object-contain"
                          />
                        ) : null}
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="card grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="eyebrow">Get in touch</p>
            <h2 className="section-title text-3xl">Let&apos;s turn data into decisions</h2>
            <p className="text-muted">
              I&apos;m looking for a full-time role as a data scientist or data
              analyst. If you&apos;re hiring, I&apos;d love to talk about how I can
              help your team ship models that actually reach production.
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

        <section id="journey" className="card space-y-6 p-6 md:p-8">
          <div>
            <p className="eyebrow">Journey</p>
            <h2 className="section-title text-3xl">From Nouakchott to data science</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted">
            <span className="rounded-full border border-stroke bg-white/60 px-3 py-1">
              Nouakchott
            </span>
            <span aria-hidden="true">→</span>
            <span className="rounded-full border border-stroke bg-white/60 px-3 py-1">
              2019 · Lyon
            </span>
            <span aria-hidden="true">→</span>
            <span className="rounded-full border border-stroke bg-white/60 px-3 py-1">
              2023 · Paris
            </span>
          </div>
          <div className="space-y-4 text-[0.95rem] leading-relaxed text-muted">
            <p>
              I grew up in Nouakchott, Mauritania, where a fascination with
              mathematics took hold early. The numbers were the easy part; what
              stuck was how they could be used to describe and decide. That
              curiosity drifted toward statistics, then toward data — anywhere a
              problem could be framed clearly and answered with evidence.
            </p>
            <p>
              On August 22, 2019, at 18, I packed my bags and left for France.
              The first stop was Lyon, at Université Lyon 1 Claude Bernard, where
              I began a Bachelor&apos;s in Mathematics &amp; Economics. The mix
              of formal proof and real-world models was a good start, but it
              pushed me toward a more applied path.
            </p>
            <p>
              So I reoriented. I moved to Paris and joined the MIAGE program at
              Université Paris Dauphine — a curriculum built around the meeting
              point of computer science, decision-making, and data. It turned out
              to be the right fit. I earned my Master 2 there, and the projects
              on this site are the work that came out of that period: explainable
              models, MLOps services, real datasets, real trade-offs.
            </p>
            <p>
              Alongside my studies, I led the conference pole of Paris Dauphine
              Afrique, the university&apos;s African student association. We put
              together three conferences — on journalism in Africa, on African
              sovereignty, and on the war in the DRC — and a round table on
              African weddings between tradition and modernity. Bringing those
              conversations to a French university audience was its own kind of
              work, different from data but just as worth doing.
            </p>
            <p>
              Outside of school, I travel when I can — a few European trips
              (Lucerne, Milan, Barcelona, Amsterdam) and the cliffs of Étretat
              closer to home. Dakar stayed with me the longest: a way of staying
              close to West Africa, where my story started. Photography goes
              with all of this — paying attention to what&apos;s in front of me
              long enough to want to keep it. Most of the shots below are mine.
            </p>
          </div>
        </section>

        <section id="beyond" className="space-y-8">
          <div>
            <p className="eyebrow">Beyond the work</p>
            <h2 className="section-title text-3xl">Learn more about me</h2>
            <p className="mt-2 text-muted">
              A few snapshots — milestones, travels, and student-life work.
            </p>
          </div>
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {personalPhotos.map((photo) => (
              <figure
                key={photo.src}
                className="card mb-5 overflow-hidden break-inside-avoid"
              >
                <Image
                  src={photo.src}
                  alt={photo.caption}
                  width={photo.width}
                  height={photo.height}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="block h-auto w-full"
                />
                <figcaption className="px-4 py-3 text-xs text-muted">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
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
