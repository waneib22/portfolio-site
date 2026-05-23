import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MLOps — Road Accident Severity | Ibrahima Wane",
  description:
    "Case study: an end-to-end MLOps pipeline classifying French road-accident severity, served through a containerized FastAPI with retraining, monitoring, and CI.",
};

const stack = [
  "Python",
  "scikit-learn",
  "FastAPI",
  "Pydantic",
  "Docker",
  "docker-compose",
  "GitHub Actions",
  "pytest",
];

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="card overflow-x-auto p-5 text-[0.8rem] leading-relaxed text-foreground">
      <code>{children}</code>
    </pre>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="space-y-5 scroll-mt-24">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-title text-2xl md:text-3xl">{title}</h2>
      </div>
      <div className="space-y-4 text-[0.95rem] leading-relaxed text-muted">
        {children}
      </div>
    </section>
  );
}

export default function MlopsAccidents() {
  return (
    <div className="relative overflow-hidden">
      <div className="orb teal" aria-hidden="true" />
      <div className="orb warm" aria-hidden="true" />

      <article className="relative mx-auto flex max-w-3xl flex-col gap-12 px-6 pb-24 pt-8">
        <Link
          href="/#work"
          className="text-sm font-semibold text-[color:var(--accent)]"
        >
          ← Back to projects
        </Link>

        {/* Hero */}
        <header className="space-y-5">
          <p className="eyebrow">Data Engineering · Case study · 2026</p>
          <h1 className="section-title text-4xl md:text-5xl">
            Serving a model, not just training one
          </h1>
          <p className="text-lg text-muted">
            An MLOps project that classifies the severity of French road
            accidents. The point isn&apos;t the model — it&apos;s everything
            around it: a reproducible data pipeline, a clean FastAPI service with
            prediction, retraining and monitoring endpoints, Docker packaging,
            and a CI gate. This write-up walks through that engineering.
          </p>
          <div className="flex flex-wrap gap-2">
            {stack.map((item) => (
              <span key={item} className="tag">
                {item}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              className="rounded-full bg-[color:var(--accent)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_18px_40px_var(--shadow)] transition hover:-translate-y-0.5"
              href="https://github.com/waneib22/mlops-accidents/tree/ibrahima"
              target="_blank"
              rel="noreferrer"
            >
              View code
            </a>
          </div>
        </header>

        <Section id="problem" eyebrow="01" title="The problem">
          <p>
            Emergency services need to triage. Given the circumstances of a road
            accident, how severe is it likely to be? This project frames that as
            a binary classification on the French{" "}
            <strong className="text-foreground">BAAC 2021</strong> dataset (the
            official annual injury-accident database, published on data.gouv.fr):
          </p>
          <div className="card overflow-x-auto p-1">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.15em] text-muted">
                  <th className="p-3">Class</th>
                  <th className="p-3">Label</th>
                  <th className="p-3">Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-stroke">
                  <td className="p-3 font-semibold text-foreground">1</td>
                  <td className="p-3 font-semibold text-foreground">
                    prioritaire
                  </td>
                  <td className="p-3">Victim hospitalized or deceased</td>
                </tr>
                <tr className="border-t border-stroke">
                  <td className="p-3 font-semibold text-foreground">0</td>
                  <td className="p-3 font-semibold text-foreground">
                    non-prioritaire
                  </td>
                  <td className="p-3">Victim unharmed or lightly injured</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            I&apos;ll be upfront: this is{" "}
            <strong className="text-foreground">Phase 1 (Foundations)</strong> of
            a larger MLOps pipeline. The model is intentionally a strong baseline
            — the value on display is the engineering scaffold that lets that
            model be trained, served, monitored, and retrained reliably.
          </p>
        </Section>

        <Section
          id="pipeline"
          eyebrow="02"
          title="The data pipeline"
        >
          <p>
            BAAC ships as four separate tables — <code>usagers</code> (people),{" "}
            <code>caractéristiques</code> (circumstances), <code>lieux</code>{" "}
            (locations), and <code>véhicules</code> (vehicles). The pipeline pulls
            them from an S3 bucket, joins them on the accident id{" "}
            <code>Num_Acc</code>, and turns the mess of raw codes into a clean
            modeling table:
          </p>
          <ul className="space-y-2">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                Recode the target <code>grav</code> into the binary
                priority/non-priority label.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                Engineer features: extract the <code>hour</code> from the{" "}
                <code>hrmn</code> time field, compute the victim&apos;s age from
                birth year, and count victims and vehicles per accident.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                Fix real-world data quirks: Corsica&apos;s department codes
                (<code>2A</code> → <code>201</code>, <code>2B</code> →{" "}
                <code>202</code>), comma-decimal latitude/longitude, and{" "}
                <code>-1</code> sentinels converted to <code>NaN</code>.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                Impute selected columns by their mode, then split 70/30 into{" "}
                <code>X_train / X_test / y_train / y_test</code> — 28 features in
                all.
              </span>
            </li>
          </ul>
          <p>
            Two scripts make this reproducible end to end:{" "}
            <code>import_raw_data.py</code> downloads the four CSVs, and{" "}
            <code>make_dataset.py</code> produces the processed splits.
          </p>
        </Section>

        <Section id="model" eyebrow="03" title="The model">
          <p>
            The classifier is a{" "}
            <strong className="text-foreground">RandomForestClassifier</strong>{" "}
            (<code>n_jobs=-1</code>, <code>random_state=42</code>) trained on
            ~54,000 accidents, reaching roughly{" "}
            <strong className="text-foreground">77% accuracy</strong> on the test
            set. The training script loads the processed splits, fits the model,
            logs the score, and serializes the result with joblib so the API can
            load it at startup:
          </p>
          <CodeBlock>{`model = ensemble.RandomForestClassifier(n_jobs=-1, random_state=42)
model.fit(X_train, y_train)
score = model.score(X_test, y_test)   # ~0.77
joblib.dump(model, MODEL_PATH)`}</CodeBlock>
          <p>
            Deliberately simple, deliberately reproducible. In an MLOps Phase 1,
            a dependable baseline you can serve and retrain beats a fancier model
            you can&apos;t operate.
          </p>
        </Section>

        <Section id="api" eyebrow="04" title="The API">
          <p>
            The service is a <strong className="text-foreground">FastAPI</strong>{" "}
            app with a deliberately small, layered structure. The model is loaded
            once at startup via a <code>lifespan</code> hook; two routers split
            operational endpoints from inference; a tiny shared-state module lets
            them talk without dependency-injection ceremony:
          </p>
          <CodeBlock>{`src/api/
├── main.py           ← FastAPI app + lifespan (loads model once)
├── schemas.py        ← Pydantic request/response contracts
├── metrics.py        ← in-memory shared state (model, stats, lock)
└── routers/
    ├── monitoring.py ← /health  /stats  /model/info  /retrain
    └── inference.py  ← /predict`}</CodeBlock>
          <div className="card overflow-x-auto p-1">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.15em] text-muted">
                  <th className="p-3">Method</th>
                  <th className="p-3">Endpoint</th>
                  <th className="p-3">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["GET", "/health", "API and model status"],
                  ["GET", "/stats", "Prediction counters"],
                  ["GET", "/model/info", "Loaded model hyperparameters"],
                  ["POST", "/predict", "Severity prediction"],
                  ["POST", "/retrain", "Trigger a background retrain"],
                ].map(([method, endpoint, purpose]) => (
                  <tr key={endpoint} className="border-t border-stroke">
                    <td className="p-3 font-mono text-xs font-semibold text-[color:var(--accent-strong)]">
                      {method}
                    </td>
                    <td className="p-3 font-mono text-xs text-foreground">
                      {endpoint}
                    </td>
                    <td className="p-3">{purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            <code>/predict</code> validates the 28-feature payload through a
            Pydantic schema, runs the forest, and returns not just a class but a
            calibrated-confidence tier — <code>high</code> / <code>medium</code> /{" "}
            <code>low</code> derived from the predicted probability:
          </p>
          <CodeBlock>{`POST /predict
{ "place": 10, "catu": 3, "victim_age": 60, "vma": 50, ... }

→ {
    "prediction": 1,
    "label": "prioritaire",
    "probability": 0.8423,
    "confidence": "high"
  }`}</CodeBlock>
          <p>
            The <code>/retrain</code> endpoint is the most interesting piece. It
            returns <code>202 Accepted</code> immediately and kicks off training
            in a FastAPI background task: a subprocess re-runs the training script
            and, on success, <strong className="text-foreground">hot-swaps the
            in-memory model</strong> — no restart, no downtime. Combined with the
            Docker volume that persists the model file, a retrain survives across
            container restarts.
          </p>
        </Section>

        <Section
          id="engineering"
          eyebrow="05"
          title="Engineering & MLOps practices"
        >
          <p>
            What turns a script into an operable service is everything around the
            code:
          </p>
          <ul className="space-y-2">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">Containerized</strong> — a
                slim Python image and a <code>docker-compose</code> stack with
                persistent volumes for data and the model, a <code>/health</code>{" "}
                healthcheck, and a restart policy.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">Single source of truth</strong>{" "}
                — one <code>config.py</code> holds paths, the S3 URL, the feature
                list, and the split parameters. Change it once, it propagates
                everywhere (pipeline, training, API).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">CI gate</strong> — GitHub
                Actions runs flake8 (blocking on real errors) then pytest, and
                fails the build below 60% coverage.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">Tested</strong> — 11 tests on
                the data transformations and config, 13 on the API endpoints
                (mocked), so behavior is pinned before any change ships.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">One-command workflows</strong>{" "}
                — a <code>Makefile</code> wraps install, lint, test, train, serve,
                predict, retrain, and the Docker lifecycle.
              </span>
            </li>
          </ul>
        </Section>

        <Section id="takeaways" eyebrow="06" title="Takeaways">
          <div className="card overflow-x-auto p-1">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.15em] text-muted">
                  <th className="p-3">Component</th>
                  <th className="p-3">Skill demonstrated</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["4-table join + cleaning pipeline", "Reproducible data engineering"],
                  ["RandomForest baseline", "Pragmatic modeling for an MLOps phase"],
                  ["FastAPI + Pydantic + routers", "Clean, layered service design"],
                  ["/retrain with hot model swap", "Zero-downtime operational thinking"],
                  ["Docker + compose + healthcheck", "Containerization & deployment"],
                  ["GitHub Actions, coverage gate", "CI/CD discipline"],
                  ["24 unit tests, Makefile", "Testing and developer ergonomics"],
                ].map(([component, skill]) => (
                  <tr key={component} className="border-t border-stroke">
                    <td className="p-3 font-semibold text-foreground">
                      {component}
                    </td>
                    <td className="p-3">{skill}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="rounded-2xl border border-stroke bg-[rgba(11,107,95,0.06)] p-4 text-sm">
            <strong className="text-foreground">What I take away:</strong> a model
            in a notebook isn&apos;t a product. This project was about the gap
            between the two — turning a trained classifier into a service you can
            deploy, monitor, retrain without downtime, and trust because CI and
            tests guard it.
          </p>
        </Section>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-stroke pt-6 text-sm">
          <Link
            href="/#work"
            className="font-semibold text-[color:var(--accent)]"
          >
            ← Back to projects
          </Link>
          <a
            href="https://github.com/waneib22/mlops-accidents/tree/ibrahima"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[color:var(--accent)]"
          >
            View code on GitHub →
          </a>
        </footer>
      </article>
    </div>
  );
}
