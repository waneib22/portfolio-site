import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bank Marketing Conversion Prediction | Ibrahima Wane",
  description:
    "Case study: predicting term-deposit subscription from a Portuguese bank's telemarketing campaign, with a focus on severe class imbalance and SMOTE.",
};

const stack = [
  "Python",
  "pandas",
  "scikit-learn",
  "imbalanced-learn (SMOTE)",
  "seaborn",
  "Matplotlib",
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

export default function BankMarketing() {
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
          <p className="eyebrow">Data Science · Case study · 2024</p>
          <h1 className="section-title text-4xl md:text-5xl">
            Who subscribes to a term deposit?
          </h1>
          <p className="text-lg text-muted">
            A binary classification project on a Portuguese bank&apos;s
            telemarketing data. The real challenge isn&apos;t fitting a model —
            it&apos;s a severe class imbalance that makes accuracy lie. This
            write-up walks through the EDA, the preprocessing, the imbalance
            problem, and a head-to-head comparison of seven classifiers.
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
              href="https://github.com/waneib22/BankMarketingML"
              target="_blank"
              rel="noreferrer"
            >
              View code
            </a>
          </div>
        </header>

        <Section id="problem" eyebrow="01" title="The business problem">
          <p>
            A Portuguese retail bank runs telemarketing campaigns to sell term
            deposits. Calls cost money and annoy uninterested clients, so the
            bank wants to know in advance{" "}
            <strong className="text-foreground">who is likely to subscribe</strong>
            . That is the target variable <code>y</code> (yes / no) — a classic
            binary classification problem on the well-known UCI Bank Marketing
            dataset.
          </p>
          <p>
            The full dataset (<code>bank-full.csv</code>) holds 45,211 calls and
            16 features describing the client (age, job, marital status,
            education, balance…), the contact (channel, month, duration), and the
            history of previous campaigns (<code>campaign</code>,{" "}
            <code>pdays</code>, <code>previous</code>, <code>poutcome</code>).
          </p>
        </Section>

        <Section
          id="eda"
          eyebrow="02"
          title="Exploration: a heavily imbalanced target"
        >
          <p>
            The data is clean to start with — no missing values, no duplicate
            rows — so the analysis went straight to distributions. The single
            most important finding sits in the target itself:
          </p>
          <Figure
            src="/images/bank-marketing/class-imbalance.png"
            alt="Distribution of the target variable y"
            width={708}
            height={545}
            caption="The target is heavily imbalanced: roughly 88% “no” vs 12% “yes”. Most clients decline — which means a model can score 88% accuracy by always predicting “no”. This single fact dictates the rest of the project."
          />
          <p>
            Breaking each categorical feature down by the target reveals where
            the signal lives. Job is a good example:
          </p>
          <Figure
            src="/images/bank-marketing/job-vs-target.png"
            alt="Subscription counts by job category"
            width={2008}
            height={1580}
            caption="Subscription by job. Blue-collar clients skew strongly toward “no”; students and retirees show a relatively higher share of “yes”. Other strong signals: previous-campaign success (poutcome = success) is the best predictor of a new subscription, and contact month matters (March, October, December convert better than the busy summer months)."
          />
          <p>
            The numeric features split into seven continuous variables. Boxplots
            against the target and outlier inspection guided the cleaning step
            that followed.
          </p>
        </Section>

        <Section
          id="preprocessing"
          eyebrow="03"
          title="Preprocessing: cleaning, scaling, encoding"
        >
          <ul className="space-y-2">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">Outlier removal</strong> —
                numeric columns were standardized to a z-score and rows with any{" "}
                <code>|z| &gt; 3</code> were dropped, trimming extreme values that
                can distort sensitive models.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">Normalization</strong> —{" "}
                <code>StandardScaler</code> on the numeric features so that
                large-magnitude variables (like <code>balance</code>) don&apos;t
                dominate distance-based models.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">Encoding</strong> — label
                encoding for binary columns (yes/no → 1/0), one-hot encoding for
                categorical variables with more than two values.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">A second, binned dataset</strong>{" "}
                — for Naive Bayes and the Decision Trees, continuous variables
                were discretized into categories (age groups, balance quantiles,
                call-duration bands…), which suits those models better.
              </span>
            </li>
          </ul>
        </Section>

        <Section
          id="imbalance"
          eyebrow="04"
          title="The core challenge: imbalance and SMOTE"
        >
          <p>
            With 88% of clients saying “no”, plain accuracy is a trap. A KNN
            baseline reached 90% accuracy — but only{" "}
            <strong className="text-foreground">31% recall on the “yes” class</strong>
            : it missed two-thirds of the actual subscribers, which are exactly
            the clients the bank cares about. The right lens is the minority
            class&apos;s precision and recall, not the headline accuracy.
          </p>
          <p>
            The remedy applied was{" "}
            <strong className="text-foreground">SMOTE</strong> (Synthetic
            Minority Over-sampling Technique): instead of duplicating minority
            examples, it synthesizes new ones between existing neighbors.
            Crucially, SMOTE was fit on the{" "}
            <strong className="text-foreground">training set only</strong>, never
            the test set, to avoid leaking synthetic information into evaluation.
          </p>
          <p>
            SMOTE consistently shifted the trade-off the same way — more recall
            on subscribers, at the cost of some precision. On KNN, minority
            recall jumped from 0.31 to 0.58 while precision fell from 0.57 to
            0.42. On Random Forest it balanced out neatly to 0.55 precision / 0.55
            recall on the “yes” class. The lesson: SMOTE doesn&apos;t conjure
            free performance — it rebalances <em>which</em> errors the model
            makes.
          </p>
        </Section>

        <Section
          id="models"
          eyebrow="05"
          title="The models"
        >
          <p>
            Seven classifiers were trained and compared, each evaluated with and
            without SMOTE: <strong className="text-foreground">KNN</strong>,{" "}
            <strong className="text-foreground">Random Forest</strong>,{" "}
            <strong className="text-foreground">Logistic Regression</strong>,{" "}
            <strong className="text-foreground">MLP</strong> (neural network),{" "}
            <strong className="text-foreground">Naive Bayes</strong>,{" "}
            <strong className="text-foreground">Decision Tree</strong> (Gini and
            Entropy), and <strong className="text-foreground">SVM</strong>.
          </p>
          <p>
            A practical note on SVM: with an RBF kernel it took several minutes to
            train on the full 45k rows, so it was evaluated on the smaller{" "}
            <code>bank.csv</code> sample — a real-world reminder that some models
            don&apos;t scale cheaply.
          </p>
          <Figure
            src="/images/bank-marketing/knn-roc.png"
            alt="ROC curve for the KNN model"
            width={581}
            height={457}
            caption="ROC curve for KNN (AUC ≈ 0.82). ROC AUC is a far more honest summary than accuracy on imbalanced data, since it weighs performance across all decision thresholds."
          />
        </Section>

        <Section id="results" eyebrow="06" title="Results">
          <p>
            Ranking the models on accuracy, macro precision, and ROC AUC (with
            SMOTE applied) gives a clear winner:
          </p>
          <div className="card overflow-x-auto p-1">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.15em] text-muted">
                  <th className="p-3">Model</th>
                  <th className="p-3">Accuracy</th>
                  <th className="p-3">Precision</th>
                  <th className="p-3">ROC AUC</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Random Forest", "0.908", "0.751", "0.923", true],
                  ["Logistic Regression", "0.899", "0.727", "0.894", false],
                  ["KNN", "0.875", "0.684", "0.838", false],
                  ["Naive Bayes", "0.796", "0.620", "0.828", false],
                  ["Decision Tree (Gini)", "0.870", "0.654", "0.689", false],
                  ["Decision Tree (Entropy)", "0.870", "0.652", "0.682", false],
                ].map(([model, acc, prec, auc, best]) => (
                  <tr key={model as string} className="border-t border-stroke">
                    <td className="p-3 font-semibold text-foreground">
                      {model}
                      {best ? (
                        <span className="ml-2 text-xs font-normal text-muted">
                          (best)
                        </span>
                      ) : null}
                    </td>
                    <td className="p-3">{acc}</td>
                    <td className="p-3">{prec}</td>
                    <td
                      className={
                        best
                          ? "p-3 font-semibold text-[color:var(--accent-strong)]"
                          : "p-3"
                      }
                    >
                      {auc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            <strong className="text-foreground">Random Forest</strong> leads on
            every metric (ROC AUC 0.923), with{" "}
            <strong className="text-foreground">Logistic Regression</strong> a
            close and far simpler runner-up (0.894). KNN and Naive Bayes trail;
            the single Decision Trees have decent accuracy but weak AUC, a sign
            they discriminate the two classes less reliably across thresholds. SVM
            (on the reduced sample) landed around 0.90 accuracy but a low minority
            precision of 0.50.
          </p>
        </Section>

        <Section id="takeaways" eyebrow="07" title="Takeaways">
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
                  ["EDA on 45k rows, 16 features", "Reading distributions and target relationships"],
                  ["Outlier removal, scaling, encoding", "Preprocessing pipeline"],
                  ["Diagnosing class imbalance", "Knowing accuracy lies — reading precision/recall"],
                  ["SMOTE on train only", "Resampling without data leakage"],
                  ["Seven-model comparison", "Breadth across classifier families"],
                  ["ROC AUC as the yardstick", "Choosing the right metric for imbalance"],
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
            <strong className="text-foreground">What I take away:</strong> on
            imbalanced data, the model choice matters less than understanding the
            metric. Every classifier here predicted “no” well and struggled with
            “yes”; the work was in surfacing that honestly, fixing it with SMOTE
            where it helped, and picking ROC AUC over accuracy to rank them.
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
            href="https://github.com/waneib22/BankMarketingML"
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
