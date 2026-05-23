import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Credit Risk Scoring — Freddie Mac | Ibrahima Wane",
  description:
    "End-to-end case study: predicting mortgage default on Freddie Mac data, from raw files to a deployed application.",
};

const stack = [
  "Python",
  "pandas",
  "scikit-learn",
  "XGBoost",
  "SHAP",
  "Kedro",
  "FAISS",
  "Anthropic Claude",
  "Streamlit",
];

type FigureProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
};

function Figure({ src, alt, width, height, caption }: FigureProps) {
  return (
    <figure className="card overflow-hidden p-4">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-auto w-full rounded-xl bg-white"
      />
      <figcaption className="mt-3 px-1 text-xs text-muted">{caption}</figcaption>
    </figure>
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

export default function CreditRiskScoring() {
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
          <p className="eyebrow">Data Science · Case study · 2026</p>
          <h1 className="section-title text-4xl md:text-5xl">
            Predicting mortgage default
          </h1>
          <p className="text-lg text-muted">
            An end-to-end case study. From raw Freddie Mac data to a deployed
            application, through modeling, explainability, and
            industrialization. This write-up tells the story of the project —
            the decisions, the pitfalls, and the results.
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
              href="https://github.com/waneib22/credit-risk-scoring"
              target="_blank"
              rel="noreferrer"
            >
              View code
            </a>
          </div>
        </header>

        <Section id="problem" eyebrow="01" title="The business problem">
          <p>
            When a bank grants a mortgage, it makes a bet: will the borrower
            repay? Credit risk is the probability that they default. Getting it
            wrong is costly both ways — too cautious, and you turn away good
            clients and lose revenue; too lax, and you pile up arrears and
            capital losses.
          </p>
          <p>
            The goal of this project: build a model that estimates the
            probability of default from{" "}
            <strong className="text-foreground">
              only the information available at origination
            </strong>{" "}
            — credit score, debt-to-income ratio, down payment, property type,
            and so on. No future information, because in the real world you
            decide before you know how the loan will behave.
          </p>
          <p>
            A structuring constraint in banking: the model must be{" "}
            <strong className="text-foreground">explainable</strong>. EU
            regulation (GDPR, the right to explanation) and EBA guidelines
            require being able to justify a credit refusal. A high-performing
            but unexplainable “black box” is unusable in a regulated production
            setting. This requirement shaped several decisions in the project.
          </p>
        </Section>

        <Section
          id="data"
          eyebrow="02"
          title="The data: Freddie Mac Single-Family Loan-Level Dataset"
        >
          <p>
            Freddie Mac (a U.S. government-sponsored mortgage refinancing
            enterprise) publishes the performance history of millions of
            mortgages since 1999 as open data. It is an academic and industry
            reference for credit risk.
          </p>
          <p>The dataset is structured as two files per vintage:</p>
          <ul className="space-y-2">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">Origination</strong>: one
                row per loan, the characteristics known at origination (FICO,
                amount, rate, state, etc.).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">Performance</strong>: one
                row per loan per month, the repayment history (delinquencies,
                balance, status).
              </span>
            </li>
          </ul>
          <p>
            For this project I used the 2017 and 2018 samples (50,000 loans
            each, 100,000 total), with performance tracked through September
            2025. The vintage choice is deliberate: these loans have enough
            hindsight for defaults to be observed (7-8 years), and they span the
            2020-2021 COVID shock, which enriches the signal.
          </p>

          <h3 className="section-title pt-2 text-lg text-foreground">
            Building the target
          </h3>
          <p>
            The variable to predict, <code>default</code>, does not exist as
            such. I built it from the performance file:{" "}
            <code>default = 1</code> if the loan reached 90+ days delinquency
            (delinquency ≥ 3) OR ended in foreclosure / repossession
            (zero-balance codes 03 or 09). Otherwise <code>default = 0</code>.
          </p>
          <p>
            Observed default rate:{" "}
            <strong className="text-foreground">5.57%</strong>. This imbalance
            (the “default” class is rare) is typical of credit and has
            consequences for modeling and evaluation.
          </p>

          <h3 className="section-title pt-2 text-lg text-foreground">
            First pitfall: the samples didn&apos;t match
          </h3>
          <p>
            A concrete first obstacle. The Freddie Mac site offers generic
            “sample files” — but those example origination and performance
            files share no common loan identifier. They can&apos;t be joined. I
            had to realize I needed to download the real annual files of the
            Standard Dataset (<code>sample_orig_2017.txt</code>,{" "}
            <code>sample_svcg_2017.txt</code>), where the loans do correspond.
          </p>

          <h3 className="section-title pt-2 text-lg text-foreground">
            Second pitfall: a silent column shift
          </h3>
          <p>
            Subtler, and instructive. Reading the files (separator{" "}
            <code>|</code>, no header), I first handed pandas a list of 27 column
            names — while the current format has 32. Pandas&apos; behavior here
            is silent and misleading: it aligns the names to the last columns,
            shifting everything else. As a result, the column I called{" "}
            <code>dti</code> actually held something else, and 100% of the
            “numeric” values became missing.
          </p>
          <p>
            The symptom (100% missing values on columns meant to be full, and
            only 29 unique identifiers out of 100,000 rows) put me on the trail.
            The lesson: always validate the number of columns read, never trust
            silent parsing. I added <code>assert</code> statements on the column
            count so any future inconsistency fails loudly instead of quietly
            corrupting the data.
          </p>
        </Section>

        <Section
          id="exploration"
          eyebrow="03"
          title="Exploration: what the data says"
        >
          <p>
            Exploratory data analysis (EDA) confirmed the business intuitions
            and revealed the structure of the signal. The key numeric variables
            have clear relationships with default:
          </p>
          <Figure
            src="/images/credit-risk/default-numeric.png"
            alt="Default rate by numeric variable"
            width={1484}
            height={984}
            caption="Default rate by numeric variable. FICO: clear monotone decline (13.5% → 1.7%). DTI rising. LTV flat up to 95%, then a sharp jump."
          />
          <ul className="space-y-2">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">FICO score</strong>: clean,
                monotonically decreasing relationship. FICO 426-681 → 13.5%
                default; above 801 → 1.7%. By far the best single predictor.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">DTI</strong>{" "}
                (debt-to-income): rising. Below 22% → 2.3%; 44-47% → 8.3%.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">LTV</strong>{" "}
                (loan-to-value): flat up to 95%, then a sharp jump to ~10%. That
                threshold is where mortgage insurance becomes mandatory.
              </span>
            </li>
          </ul>
          <p>The categorical variables carry signal too:</p>
          <Figure
            src="/images/credit-risk/default-categorical.png"
            alt="Default rate by categorical variable"
            width={1584}
            height={984}
            caption="First-time homebuyers: 7.5% vs 5%. Second homes: 3.2%. Counterintuitively, two borrowers are less risky than one — a co-borrower acts as a financial safety net."
          />
          <p>Geography matters a lot:</p>
          <Figure
            src="/images/credit-risk/default-states.png"
            alt="Top 15 states by default rate"
            width={1384}
            height={484}
            caption="New York, Hawaii, Louisiana, Florida, Connecticut: 8 to 10% default, i.e. +50 to +80% above the national average (5.57%). Overpriced coastal real estate and disaster-exposed areas."
          />
          <p>
            One redundancy to fix: <code>oltv</code> and <code>ocltv</code> are
            correlated at 0.99 — they say almost the same thing. I kept{" "}
            <code>ocltv</code> (more complete) and dropped <code>oltv</code>, so
            as not to muddy the model&apos;s interpretation.
          </p>
          <Figure
            src="/images/credit-risk/correlation.png"
            alt="Pearson correlation matrix"
            width={760}
            height={684}
            caption="Correlation matrix (Pearson). oltv and ocltv correlated at 0.99 — redundancy removed."
          />
        </Section>

        <Section
          id="features"
          eyebrow="04"
          title="Feature engineering: injecting domain knowledge"
        >
          <p>
            Models learn better when the signal is presented in a usable form. I
            created 11 derived variables encoding credit-domain knowledge:
          </p>
          <div className="card overflow-x-auto p-1">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.15em] text-muted">
                  <th className="p-3">Family</th>
                  <th className="p-3">Variables</th>
                  <th className="p-3">Idea</th>
                </tr>
              </thead>
              <tbody className="align-top">
                <tr className="border-t border-stroke">
                  <td className="p-3 font-semibold text-foreground">
                    Risk flags
                  </td>
                  <td className="p-3">
                    <code>is_subprime</code>, <code>is_high_ltv</code>,{" "}
                    <code>is_high_dti</code>
                  </td>
                  <td className="p-3">
                    Recognized regulatory thresholds (CFPB Qualified Mortgage)
                  </td>
                </tr>
                <tr className="border-t border-stroke">
                  <td className="p-3 font-semibold text-foreground">
                    Cumulative score
                  </td>
                  <td className="p-3">
                    <code>risk_count</code> (0 to 3)
                  </td>
                  <td className="p-3">How many risk criteria stack up</td>
                </tr>
                <tr className="border-t border-stroke">
                  <td className="p-3 font-semibold text-foreground">
                    Interactions
                  </td>
                  <td className="p-3">
                    <code>fico_dti_interaction</code>,{" "}
                    <code>fico_ltv_interaction</code>,{" "}
                    <code>dti_ltv_interaction</code>
                  </td>
                  <td className="p-3">
                    Capture profiles combining several weaknesses
                  </td>
                </tr>
                <tr className="border-t border-stroke">
                  <td className="p-3 font-semibold text-foreground">
                    Financial effort
                  </td>
                  <td className="p-3">
                    <code>monthly_payment</code>,{" "}
                    <code>payment_to_upb_ratio</code>
                  </td>
                  <td className="p-3">
                    Real monthly payment via the amortization formula
                  </td>
                </tr>
                <tr className="border-t border-stroke">
                  <td className="p-3 font-semibold text-foreground">Pricing</td>
                  <td className="p-3">
                    <code>rate_spread</code>
                  </td>
                  <td className="p-3">
                    Gap to the vintage&apos;s average rate — a proxy for the
                    lender&apos;s internal scoring
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The <code>risk_count</code> variable illustrates the value of this
            approach well: the default rate goes from 4% (no criterion) to 20%
            (all three combined). A powerful and perfectly readable signal.
          </p>
          <p>
            The crucial methodological point here: the order of operations. The
            train/test split is done{" "}
            <strong className="text-foreground">before</strong> encoding the
            geographic variables. Why? Because those variables are encoded with
            target encoding — each state is replaced by its mean default rate. If
            you computed that rate over the full data, test-set information would
            “leak” into training (data leakage). The rate is therefore computed
            on the training set only, with smoothing that pulls
            under-represented areas toward the global mean.
          </p>
        </Section>

        <Section
          id="modeling"
          eyebrow="05"
          title="Modeling: simple sometimes beats sophisticated"
        >
          <p>I trained and compared two models:</p>
          <ul className="space-y-2">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">Logistic regression</strong>{" "}
                — the historical credit-scoring standard: linear, interpretable,
                validated by regulators.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">XGBoost</strong> — the state
                of the art on tabular data: gradient boosting, able to capture
                complex interactions.
              </span>
            </li>
          </ul>
          <div className="card overflow-x-auto p-1">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.15em] text-muted">
                  <th className="p-3">Model</th>
                  <th className="p-3">ROC AUC</th>
                  <th className="p-3">Average Precision</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-stroke">
                  <td className="p-3 font-semibold text-foreground">
                    Logistic regression{" "}
                    <span className="text-xs font-normal text-muted">
                      (chosen for production)
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-[color:var(--accent-strong)]">
                    0.740
                  </td>
                  <td className="p-3">0.147</td>
                </tr>
                <tr className="border-t border-stroke">
                  <td className="p-3 font-semibold text-foreground">
                    XGBoost{" "}
                    <span className="text-xs font-normal text-muted">
                      (challenger + SHAP)
                    </span>
                  </td>
                  <td className="p-3">0.735</td>
                  <td className="p-3">0.142</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Figure
            src="/images/credit-risk/roc-pr.png"
            alt="ROC and Precision-Recall curves for both models"
            width={1384}
            height={484}
            caption="ROC and Precision-Recall curves. The two models nearly overlap — logistic regression matches XGBoost."
          />
          <p>
            Logistic regression matches (even slightly beats) XGBoost.
            Counterintuitive when you expect the “more powerful” model to always
            win. XGBoost&apos;s learning curve showed it was overfitting:
            excellent on train, no gain on validation. Three reasons explain
            this ceiling:
          </p>
          <ol className="space-y-2">
            <li className="flex gap-3">
              <span className="font-semibold text-[color:var(--accent)]">1.</span>
              <span>
                <strong className="text-foreground">
                  The relationships are near-linear.
                </strong>{" "}
                FICO ↘ default, DTI ↗ default, LTV ↗ default. Logistic
                regression models that perfectly.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-[color:var(--accent)]">2.</span>
              <span>
                <strong className="text-foreground">
                  Feature engineering already digested the signal.
                </strong>{" "}
                The interactions XGBoost might have found, I gave it explicitly.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-[color:var(--accent)]">3.</span>
              <span>
                <strong className="text-foreground">
                  The residual signal is macroeconomic noise.
                </strong>{" "}
                Job loss, COVID, rate hikes — unknown at origination, therefore
                unpredictable.
              </span>
            </li>
          </ol>
          <p>
            An AUC of 0.74 sits squarely in the professional credit-scoring range
            (0.70-0.85). The verdict: keep logistic regression in production —
            equivalent performance, but interpretable and compliant. XGBoost
            stays useful for fine-grained analysis via SHAP.
          </p>
          <p className="rounded-2xl border border-stroke bg-[rgba(11,107,95,0.06)] p-4 text-sm">
            <strong className="text-foreground">Portfolio lesson:</strong>{" "}
            knowing how to recognize that a simple model is enough, and
            justifying it, beats piling on gratuitous complexity.
          </p>
        </Section>

        <Section
          id="importance"
          eyebrow="06"
          title="The most instructive moment: importance ≠ usefulness"
        >
          <p>
            This is the episode I&apos;m most proud of methodologically. In an
            earlier version, the <code>postal_code</code> variable came out as
            driver #1 according to the SHAP analysis — well ahead of FICO.
            Tempting to keep, then.
          </p>
          <p>
            But on reflection: postal code has enormous cardinality (thousands of
            zones, many with fewer than 10 loans). Target encoding at that
            granularity memorizes the training set without generalizing — a
            disguised geographic overfit.
          </p>
          <p>
            <strong className="text-foreground">The decisive test:</strong> I
            removed <code>postal_code</code> and the AUC{" "}
            <strong className="text-foreground">increased</strong> (from 0.72 to
            0.735 on XGBoost). The variable wasn&apos;t merely useless: it was
            actively degrading generalization.
          </p>
          <p className="rounded-2xl border border-stroke bg-[rgba(11,107,95,0.06)] p-4 text-sm">
            <strong className="text-foreground">Lesson:</strong> a variable&apos;s
            importance measures what the model exploits, not its real predictive
            value. Only validation on unseen data settles it. I kept{" "}
            <code>msa</code> and <code>property_state</code>, coarser and
            therefore more stable.
          </p>
        </Section>

        <Section
          id="explainability"
          eyebrow="07"
          title="Explainability: opening the black box with SHAP"
        >
          <p>
            For a credit model, explaining <em>why</em> matters as much as
            predicting <em>how much</em>. SHAP (SHapley Additive exPlanations)
            decomposes each prediction additively:{" "}
            <code>prediction = base value + each variable&apos;s contribution</code>
            .
          </p>
          <Figure
            src="/images/credit-risk/shap-beeswarm.png"
            alt="SHAP beeswarm plot of global drivers"
            width={787}
            height={940}
            caption="Global risk drivers. 5 of the top 8 are engineered features — the model reasons over business concepts, not opaque codes."
          />
          <p>
            The main drivers: <code>fico_dti_interaction</code>, <code>msa</code>
            , <code>number_of_borrowers</code>,{" "}
            <code>fico_ltv_interaction</code>, <code>credit_score</code>. At the
            individual level, the “waterfall” plot decomposes a specific loan:
          </p>
          <Figure
            src="/images/credit-risk/shap-waterfall.png"
            alt="SHAP waterfall decomposition of a loan at 62% risk"
            width={801}
            height={890}
            caption="Decomposition of a loan rated at 62% risk: metro area (+1.29), FICO×LTV (+0.54), FICO×DTI (+0.49), above-market rate (+0.33), single borrower (+0.25). You can literally explain the refusal to the client — exactly what GDPR and the EBA require."
          />
        </Section>

        <Section id="rag" eyebrow="08" title="A documentation assistant (RAG)">
          <p>
            To make the project usable by a non-specialist, I added a RAG
            (Retrieval-Augmented Generation) chatbot that answers questions about
            the model, the variables, and the methodology. The architecture,
            built by hand to fully master the mechanics:
          </p>
          <ul className="space-y-2">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">Indexing</strong> — the
                documentation (data dictionary, model card, methodology) is split
                into sections, each encoded as a vector by sentence-transformers.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">Retrieval</strong> — the
                vectors are stored in a FAISS index; for each question, the
                closest passages are retrieved (cosine similarity).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">Generation</strong> — those
                passages serve as context for Claude (Anthropic), which writes an
                answer grounded only in the documentation.
              </span>
            </li>
          </ul>
          <p>
            Two notable technical points: <strong className="text-foreground">grounding</strong>{" "}
            (the model is instructed to answer only from the context and to say
            “I don&apos;t know” otherwise — an anti-hallucination guardrail), and{" "}
            <strong className="text-foreground">prompt caching</strong> on the
            system instructions, which cuts the cost and latency of repeated
            calls.
          </p>
        </Section>

        <Section
          id="industrialization"
          eyebrow="09"
          title="Industrialization: from notebook to Kedro pipeline"
        >
          <p>
            Notebooks tell the exploration story, but they are neither
            reproducible nor deployable as-is. I industrialized the data → model
            path with Kedro (created by QuantumBlack / McKinsey). Two pipelines
            orchestrated as a dependency graph:
          </p>
          <ul className="space-y-2">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <code>data_processing</code>: loading → target construction →
                join → feature engineering → split + encoding (5 nodes).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <code>data_science</code>: train logistic regression + XGBoost →
                evaluation (3 nodes).
              </span>
            </li>
          </ul>
          <p>
            Configuration (paths, target thresholds, hyperparameters) is
            externalized in YAML. A single command, <code>kedro run</code>,
            replays the whole pipeline. The most satisfying validation: the
            pipeline reproduces the notebook metrics exactly (LogReg AUC 0.7402
            vs 0.7400; XGBoost 0.7352 vs 0.7351). The code shared between
            notebooks and application was factored into a <code>credit_risk</code>{" "}
            package — a single source of truth.
          </p>
        </Section>

        <Section
          id="deployment"
          eyebrow="10"
          title="Deployment: an interactive application"
        >
          <p>The final deliverable is a two-tab Streamlit application:</p>
          <ul className="space-y-2">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">Scoring</strong> — you enter
                a borrower profile, you get the default probability and the SHAP
                explanation in real time. A risky profile (FICO 620, DTI 50, LTV
                97, NY, first-time buyer) comes out at ~32%; a safe profile (FICO
                800, DTI 20, LTV 60, CA, two borrowers) at ~0.6%.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">Assistant</strong> — the RAG
                chatbot, accessible in natural language.
              </span>
            </li>
          </ul>
          <p>
            The technical challenge: reconstructing the 39-variable vector the
            model expects from a raw profile. This requires replaying the
            preprocessing pipeline exactly at inference time — hence saving a
            “preprocessor” (encoding mappings, imputation medians, column order).
            A good MLOps practice: persist the entire transformation chain, not
            just the model.
          </p>
        </Section>

        <Section id="takeaways" eyebrow="11" title="Takeaways">
          <p>
            This project covers the full chain of a data science use case in
            banking:
          </p>
          <div className="card overflow-x-auto p-1">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.15em] text-muted">
                  <th className="p-3">Step</th>
                  <th className="p-3">Skill demonstrated</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Loading, parsing, joining real data", "Data engineering, robustness to format"],
                  ["EDA, detecting redundancy and leakage", "Analytical rigor"],
                  ["Domain feature engineering", "Credit-domain knowledge"],
                  ["Model comparison, overfit diagnosis", "Critical thinking, no gratuitous complexity"],
                  ["The postal_code decision", "Deep understanding of validation"],
                  ["SHAP", "Explainability, regulatory compliance"],
                  ["Kedro pipeline", "MLOps, reproducibility"],
                  ["RAG + Claude", "Applied LLM, modern architecture"],
                  ["Streamlit app", "Deployment, presentation"],
                ].map(([step, skill]) => (
                  <tr key={step} className="border-t border-stroke">
                    <td className="p-3 font-semibold text-foreground">{step}</td>
                    <td className="p-3">{skill}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="rounded-2xl border border-stroke bg-[rgba(11,107,95,0.06)] p-4 text-sm">
            <strong className="text-foreground">What I take away:</strong> a good
            data science project isn&apos;t the one that piles on the most complex
            models, but the one that frames the right problem, treats the data
            with rigor, justifies its choices through validation, and stays
            explainable and reproducible end to end.
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
            href="https://github.com/waneib22/credit-risk-scoring"
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
