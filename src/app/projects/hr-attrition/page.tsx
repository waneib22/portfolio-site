import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "HR Analytics — Predicting Employee Attrition | Ibrahima Wane",
  description:
    "Case study: predicting attrition for 1,470 employees, and a measured argument — not a speculative one — against deploying the model as an individual score.",
};

const stack = [
  "Python",
  "pandas",
  "scikit-learn",
  "XGBoost",
  "SHAP",
  "imbalanced-learn",
  "Fairness audit",
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

export default function HrAttrition() {
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
            Predicting employee attrition
          </h1>
          <p className="text-lg text-muted">
            A retention model for 1,470 employees, and an honest account of what
            it can and cannot be used for. A penalised logistic regression
            separates leavers from stayers at a hold-out AUC-ROC of{" "}
            <strong className="text-foreground">0.808</strong> — but the most
            useful output of the project is the fairness audit, which measures
            why it should not be deployed as an individual scoring system.
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
              href="https://github.com/waneib22/hr-analytics-case-study"
              target="_blank"
              rel="noreferrer"
            >
              View code
            </a>
          </div>
        </header>

        <Section id="problem" eyebrow="01" title="The problem, restated">
          <p>
            The brief looks like a classification exercise: 1,470 employees, 237
            of whom left, predict the rest. Taken literally it produces
            something worthless. At a 16.1% base rate, a model that answers
            &ldquo;nobody ever leaves&rdquo; scores{" "}
            <strong className="text-foreground">83.9% accuracy</strong> while
            never once identifying the thing it was built to find.
          </p>
          <p>
            The useful brief is different. An HR team has finite capacity for
            retention conversations, so what it needs is a{" "}
            <strong className="text-foreground">ranked watch-list</strong> sized
            to that capacity, an explanation a manager can act on, and — because
            this is a model about people, run by their employer — an account of
            who it fails. This case study is organised around those three, in
            that order.
          </p>
        </Section>

        <Section id="data" eyebrow="02" title="A dataset that is clean in a suspicious way">
          <p>
            The audit found no missing cells in 51,450, no duplicates, no
            impossible values. That cleanliness is itself worth being wary of —
            it is a synthetic teaching set, and the artefacts show.
          </p>
          <div className="card overflow-x-auto p-1">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.15em] text-muted">
                  <th className="p-3">Check</th>
                  <th className="p-3">Result</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="align-top">
                <tr className="border-t border-stroke">
                  <td className="p-3 font-semibold text-foreground">
                    Missing / duplicate
                  </td>
                  <td className="p-3">0 of 51,450 cells, 0 duplicate rows</td>
                  <td className="p-3">none needed</td>
                </tr>
                <tr className="border-t border-stroke">
                  <td className="p-3 font-semibold text-foreground">
                    Zero-variance columns
                  </td>
                  <td className="p-3">
                    <code>EmployeeCount</code>, <code>StandardHours</code>,{" "}
                    <code>Over18</code>
                  </td>
                  <td className="p-3">dropped — no information</td>
                </tr>
                <tr className="border-t border-stroke">
                  <td className="p-3 font-semibold text-foreground">
                    Identifier
                  </td>
                  <td className="p-3">
                    <code>EmployeeNumber</code> unique per row
                  </td>
                  <td className="p-3">dropped — leakage risk</td>
                </tr>
                <tr className="border-t border-stroke">
                  <td className="p-3 font-semibold text-foreground">
                    Collinear pairs (|r| &gt; 0.7)
                  </td>
                  <td className="p-3">
                    <code>JobLevel</code>↔<code>MonthlyIncome</code> r=0.95; the
                    three <code>Years*</code> fields r≈0.71–0.77
                  </td>
                  <td className="p-3">kept — see below</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Four variables dropped, 30 predictors left. The collinear pairs were
            kept deliberately: a penalised model handles them without
            instability, and dropping one of <code>JobLevel</code> /{" "}
            <code>MonthlyIncome</code> would discard a real distinction — a
            level-2 employee paid badly for level 2 is not the same person as a
            well-paid one. The cost is that{" "}
            <strong className="text-foreground">
              SHAP splits credit between correlated partners
            </strong>
            , and section 07 pays that bill in full rather than hiding it.
          </p>
          <p>
            Two things no automated check catches.{" "}
            <code>PerformanceRating</code> takes only the values 3 and 4, with
            attrition at 16% in <em>both</em> bands — the variable is inert,
            which is itself the finding: whatever this company measures as
            performance has no relationship to who leaves. And{" "}
            <code>DailyRate</code>, <code>HourlyRate</code> and{" "}
            <code>MonthlyRate</code> correlate with nothing, including salary.
            They behave like noise fields. They were kept rather than dropped on
            a hunch, so the model could be asked what it made of them.
          </p>
        </Section>

        <Section id="eda" eyebrow="03" title="What the EDA gives you — and what it doesn't">
          <p>
            Overtime is the strongest single signal in the data: 30.5% of those
            who work it leave, against 10.4% who do not. But the headline hides
            the shape.
          </p>
          <Figure
            src="/images/hr-attrition/overtime-by-level.png"
            alt="Attrition rate by overtime status, split by job level"
            width={1263}
            height={675}
            caption="At job level 1 the overtime group loses more than half its people; by level 4 the same behaviour barely registers. Read naively, this says junior overtime is a crisis and senior overtime is harmless. Section 08 shows that reading is wrong."
          />
          <p>
            The rest of the exploration points the same way and never any
            further: the bottom two income deciles both lose 31% of their staff
            while the middle of the payroll sits between 9% and 18%; 35% of
            first-year employees leave and 21% in year two; every satisfaction
            item leans in the same direction and none is dramatic on its own.
          </p>
          <Figure
            src="/images/hr-attrition/correlation-drivers.png"
            alt="Correlation of each variable with attrition, ranked"
            width={1274}
            height={810}
            caption="No single variable exceeds |r| = 0.25. This is the finding that justifies the rest of the project: there is no one-variable HR rule waiting to be found, only a multivariate signal a model can combine and a human reading cross-tabs cannot."
          />
        </Section>

        <Section id="imbalance" eyebrow="04" title="Class imbalance, tested rather than assumed">
          <p>
            The reflex at a 16% base rate is to reach for class weights or
            SMOTE. Instead, three strategies (none, class weights, SMOTE) were
            crossed with three model families and scored with 5-fold CV repeated
            three times, on the training set only. SMOTE is fitted{" "}
            <em>inside</em> the cross-validation pipeline — fitting it
            beforehand would let synthetic points interpolated from
            validation-fold rows leak into training and inflate every score.
          </p>
          <Figure
            src="/images/hr-attrition/imbalance-strategies.png"
            alt="AUC by model family and imbalance strategy"
            width={1460}
            height={709}
            caption="Nine combinations, and no meaningful separation between them. Every difference sits inside the ±0.03 fold-to-fold standard deviation."
          />
          <div className="card overflow-x-auto p-1">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.15em] text-muted">
                  <th className="p-3">CV AUC</th>
                  <th className="p-3">no correction</th>
                  <th className="p-3">class weights</th>
                  <th className="p-3">SMOTE</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-stroke">
                  <td className="p-3 font-semibold text-foreground">logistic</td>
                  <td className="p-3 font-semibold text-foreground">0.829</td>
                  <td className="p-3">0.827</td>
                  <td className="p-3">0.828</td>
                </tr>
                <tr className="border-t border-stroke">
                  <td className="p-3 font-semibold text-foreground">xgboost</td>
                  <td className="p-3">0.810</td>
                  <td className="p-3">0.800</td>
                  <td className="p-3">0.813</td>
                </tr>
                <tr className="border-t border-stroke">
                  <td className="p-3 font-semibold text-foreground">forest</td>
                  <td className="p-3">0.806</td>
                  <td className="p-3">0.799</td>
                  <td className="p-3">0.810</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong className="text-foreground">
              Imbalance correction does essentially nothing to AUC.
            </strong>{" "}
            What it moves, enormously, is recall at the default 0.5 cut-off: for
            the logistic model, from 33% uncorrected to 74% with class weights.
            The two facts are the same fact. AUC judges the <em>ranking</em> of
            employees by risk, which re-weighting cannot change much; recall
            judges one arbitrary threshold, which re-weighting moves by design.
          </p>
          <p>
            So the decision follows from the evidence rather than the reflex:{" "}
            <strong className="text-foreground">
              train uncorrected, then set the threshold explicitly
            </strong>
            . Same recall, but as a visible dial HR can turn against its own
            capacity rather than a side effect buried in the training step.
            SMOTE was rejected on a second ground too — it interpolates between
            one-hot columns, producing synthetic employees who are 0.4 of a
            Sales Representative.
          </p>
        </Section>

        <Section id="model" eyebrow="05" title="Choosing a model, and leaving the hold-out standing">
          <p>
            Four families were trained — a stratified dummy as a floor, logistic
            regression, random forest, XGBoost — each given the{" "}
            <strong className="text-foreground">same 40-draw randomised
            search</strong>. Tuning only the CV leader would have let the winner
            be decided by which model happened to get a search budget.
          </p>
          <p>
            The selection rule was fixed <em>before</em> the hold-out was
            touched: highest CV AUC wins; if the top two are within one fold
            standard deviation they are treated as tied on ranking power and the
            tie goes to the better-calibrated model. On training folds the
            logistic regression led on all four columns — AUC 0.8366 ±0.030,
            PR-AUC 0.642, Brier 0.092, log-loss 0.326 — against 0.8285 for
            XGBoost and 0.8127 for the forest, with the dummy at 0.496.
          </p>
          <Figure
            src="/images/hr-attrition/roc-pr.png"
            alt="ROC and precision-recall curves on the hold-out set"
            width={1604}
            height={736}
            caption="Hold-out, scored exactly once, on 294 employees containing 47 leavers."
          />
          <div className="card overflow-x-auto p-1">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.15em] text-muted">
                  <th className="p-3">hold-out</th>
                  <th className="p-3">AUC-ROC</th>
                  <th className="p-3">PR-AUC</th>
                  <th className="p-3">Brier</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-stroke">
                  <td className="p-3 font-semibold text-foreground">
                    logistic (tuned) — champion
                  </td>
                  <td className="p-3">0.808</td>
                  <td className="p-3">0.574</td>
                  <td className="p-3">0.101</td>
                </tr>
                <tr className="border-t border-stroke">
                  <td className="p-3 font-semibold text-foreground">
                    xgboost (tuned)
                  </td>
                  <td className="p-3 font-semibold text-foreground">0.815</td>
                  <td className="p-3 font-semibold text-foreground">0.586</td>
                  <td className="p-3 font-semibold text-foreground">0.098</td>
                </tr>
                <tr className="border-t border-stroke">
                  <td className="p-3 font-semibold text-foreground">
                    forest (tuned)
                  </td>
                  <td className="p-3">0.800</td>
                  <td className="p-3">0.485</td>
                  <td className="p-3">0.111</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong className="text-foreground">
              The hold-out reverses the ranking, and it is left standing rather
              than tidied away.
            </strong>{" "}
            On 294 rows containing 47 leavers, a 0.006 AUC gap is noise. The
            honest conclusion is that the logistic regression and the
            gradient-boosted model are indistinguishable on this data, and the
            pre-committed rule picks the logistic. That the simpler, fully
            transparent model matches a boosted ensemble is the expected result
            on 1,470 rows with no strong interactions — and it is a real
            advantage for a model whose output has to be defended to a works
            council.
          </p>
        </Section>

        <Section id="capacity" eyebrow="06" title="From a score to a capacity plan">
          <p>
            A retention conversation costs manager time, so the operating point
            is a capacity, not a probability. The question is not &ldquo;who
            will leave&rdquo; but &ldquo;how many names can we act on this
            quarter, and what do those names buy us&rdquo;.
          </p>
          <Figure
            src="/images/hr-attrition/capacity-curve.png"
            alt="Recall and precision as a function of watch-list size"
            width={1190}
            height={750}
            caption="Past roughly 30% of the workforce the recall curve flattens while the cost keeps climbing. The useful operating range is the left third of this chart."
          />
          <div className="card overflow-x-auto p-1">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.15em] text-muted">
                  <th className="p-3">watch-list</th>
                  <th className="p-3">conversations</th>
                  <th className="p-3">leavers caught</th>
                  <th className="p-3">hit rate</th>
                  <th className="p-3">lift</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["top 5%", "15", "11 of 47 (23%)", "73%", "4.6×", false],
                  ["top 10%", "29", "18 of 47 (38%)", "62%", "3.9×", true],
                  ["top 20%", "59", "28 of 47 (60%)", "48%", "3.0×", false],
                  ["top 30%", "88", "33 of 47 (70%)", "38%", "2.4×", false],
                ].map(([size, conv, caught, hit, lift, strong]) => (
                  <tr key={size as string} className="border-t border-stroke">
                    <td
                      className={`p-3 font-semibold ${
                        strong ? "text-[color:var(--accent)]" : "text-foreground"
                      }`}
                    >
                      {size}
                    </td>
                    <td className="p-3">{conv}</td>
                    <td className="p-3">{caught}</td>
                    <td className="p-3">{hit}</td>
                    <td className="p-3">{lift}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            The recommended point is{" "}
            <strong className="text-foreground">top 10%</strong>: 29
            conversations surface 38% of the year&apos;s leavers at a 62% hit
            rate, roughly four times better than picking names at random. The
            F2-optimal threshold (0.098, weighting recall twice precision)
            catches 79% of leavers — but flags 38% of the workforce to do it,
            and{" "}
            <strong className="text-foreground">
              two thirds of those names are false alarms
            </strong>
            . That is not a rounding error in a metric, it is 75 people wrongly
            marked as flight risks in a system their manager can see, and it is
            why the F2 point was refused.
          </p>
          <p>
            The champion&apos;s Brier score of 0.101 matters here for a
            practical reason: the scores survive being read as probabilities,
            which is what makes them safe in front of a manager who will
            inevitably read &ldquo;62%&rdquo; literally.
          </p>
        </Section>

        <Section id="explainability" eyebrow="07" title="Explainability, with its own caveat">
          <p>
            SHAP values for the champion are{" "}
            <strong className="text-foreground">exact and deterministic</strong>:
            with <code>feature_perturbation=&quot;interventional&quot;</code>, a
            linear model&apos;s SHAP value reduces to{" "}
            <code>coef · (x − E[x])</code>, so there is no sampling and the
            figures reproduce bit-for-bit. The alternative{" "}
            <code>correlation_dependent</code> mode was tried first and its
            top-ten ranking visibly reshuffled between runs. Determinism was
            preferred — and the bill for that choice is paid two paragraphs
            below.
          </p>
          <Figure
            src="/images/hr-attrition/shap-summary.png"
            alt="SHAP summary plot for the champion model"
            width={1362}
            height={1039}
            caption="Overtime (mean |SHAP| 0.751) is worth more than the next two features combined. Total working years, environment satisfaction, years since promotion and number of previous employers follow."
          />
          <p>
            <strong className="text-foreground">
              Read the pay row with suspicion, not satisfaction.
            </strong>{" "}
            <code>MonthlyIncome</code> ranks 37th of 49 at 0.068 — which does
            not mean pay is irrelevant, since the EDA showed 31% attrition in
            the bottom two deciles. It means this SHAP variant assigns shared
            credit to one partner, and income correlates 0.95 with{" "}
            <code>JobLevel</code> and 0.77 with <code>TotalWorkingYears</code>.
            The compensation signal is spread across those columns. This is the
            concrete cost of the collinearity decision made in section 02, and
            it is why section 08 measures income directly instead of trusting
            this ranking.
          </p>
          <p>
            <strong className="text-foreground">The HR reading.</strong> Almost
            everything at the top of this chart is structural — total
            experience, time since promotion, number of previous employers,
            tenure with the current manager. A manager cannot change how many
            employers someone has had. What is left is short:{" "}
            <strong className="text-foreground">workload</strong> and the{" "}
            <strong className="text-foreground">three satisfaction items</strong>{" "}
            (0.436 + 0.378 + 0.318 = 1.13 jointly). A short actionable list is a
            more useful output than a long inert one.
          </p>
          <p>
            One oddity worth stating: of the three suspected noise fields,{" "}
            <code>HourlyRate</code> (0.006) and <code>MonthlyRate</code> (0.012)
            are indeed inert — but <code>DailyRate</code> picks up 0.160. There
            is no plausible mechanism for that. A model will happily assign
            weight to noise, which is a reason not to read the middle of any
            importance ranking as if every row meant something.
          </p>
          <Figure
            src="/images/hr-attrition/shap-waterfall.png"
            alt="SHAP waterfall plot for a single employee"
            width={1553}
            height={1070}
            caption="Employee #711: a level-1 Research Scientist, 29, first year, working overtime on 2,404 a month, no stock options, lowest possible job-satisfaction rating. The model puts them at 62% against a 16% company average. They did leave."
          />
          <p>
            The bars are a conversation agenda in priority order: workload
            (+1.30), then the job-satisfaction rating of 1 they have already
            reported (+0.53), then a first year with no vesting and no
            relationship with a manager yet (+0.51). All three are addressable,
            and none of them needed a model to be <em>discovered</em> — what the
            model adds is the aggregation, and the ranking of this person
            against 1,469 colleagues.
          </p>
          <p className="rounded-2xl border border-stroke bg-[rgba(216,107,63,0.09)] p-4 text-sm">
            <strong className="text-foreground">
              What the chart shows that cannot be acted on.
            </strong>{" "}
            Being 29 (+0.40), not being married (+0.36) and having had six
            previous employers (+0.61) together outweigh the job-satisfaction
            bar. A manager handed this without guidance may quietly conclude
            that young unmarried job-movers are a bad hire. That is a
            discrimination risk created by the <em>explanation</em>, not by the
            prediction — the score would be just as accurate without ever
            showing those three rows — and it is a direct argument for exposing
            only the actionable subset of bars.
          </p>
        </Section>

        <Section id="corrections" eyebrow="08" title="Where the model corrects the analyst">
          <p>
            Two findings in this project only exist because a model was fitted.
            Both contradict a reading that a competent analyst would have taken
            from the cross-tabs.
          </p>
          <Figure
            src="/images/hr-attrition/shap-income-dependence.png"
            alt="SHAP dependence on monthly income, champion versus XGBoost"
            width={1515}
            height={833}
            caption="Left: the champion, a straight line by construction — it charges the same risk reduction for every 1,000 of salary whether it lands on a 2,000 earner or a 15,000 one. Right: the gradient-boosted runner-up, free to disagree, places a cliff edge just under 2,500."
          />
          <p>
            Below that cliff, income contributes +0.27 log-odds of attrition
            risk. From there to about 12,000 the contribution drifts within a
            narrow −0.06 band with no real trend, falling away again only at the
            very top. The raw rates agree: 31% attrition in each of the bottom
            two deciles, 9–18% across the middle, 3% at the top.
          </p>
          <p className="rounded-2xl border border-stroke bg-[rgba(11,107,95,0.06)] p-4 text-sm">
            <strong className="text-foreground">
              The budget recommendation.
            </strong>{" "}
            Retention money buys far more as a{" "}
            <strong className="text-foreground">
              floor under the lowest-paid roles
            </strong>{" "}
            than as an across-the-board rise: between roughly 2,500 and 12,000 a
            month, pay is simply not what is driving people out. The secondary
            lesson is a caution about the champion itself — being linear, it
            will systematically understate the risk concentrated at the bottom
            of the payroll, and anyone using its scores should know that.
          </p>
          <Figure
            src="/images/hr-attrition/shap-overtime-interaction.png"
            alt="Overtime SHAP contribution by job level"
            width={1488}
            height={806}
            caption="Once the model controls for tenure, pay, stock options and satisfaction, the overtime penalty falls from +0.73 at level 1 to +0.61 above it — a real gradient, but a fraction of what the raw cross-tab in section 03 implied."
          />
          <p>
            Level-1 staff suffer more from overtime largely because they are{" "}
            <em>also</em> new, underpaid and unvested, and the cross-tab credits
            overtime with all of it. The practical consequence is direct:{" "}
            <strong className="text-foreground">
              capping hours helps every level roughly equally
            </strong>
            ; it is the other three levers that are genuinely concentrated at
            the bottom. An analyst reading the first chart alone would have
            mis-targeted the intervention.
          </p>
        </Section>

        <Section id="fairness" eyebrow="09" title="The audit that changes the recommendation">
          <p>
            A per-group audit was run on the hold-out. The most serious finding
            is not the one fairness reviews usually look for.
          </p>
          <div className="card overflow-x-auto p-1">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.15em] text-muted">
                  <th className="p-3">age band</th>
                  <th className="p-3">n</th>
                  <th className="p-3">flagged</th>
                  <th className="p-3">actual attrition</th>
                  <th className="p-3">recall</th>
                  <th className="p-3">AUC</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["18–30", "77", "53.2%", "23.4%", "88.9%", "0.843", false],
                  ["31–40", "126", "42.1%", "11.1%", "92.9%", "0.882", false],
                  ["41–50", "63", "23.8%", "14.3%", "77.8%", "0.854", false],
                  ["51–60", "28", "10.7%", "21.4%", "16.7%", "0.636", true],
                ].map(([band, n, flagged, actual, recall, auc, strong]) => (
                  <tr key={band as string} className="border-t border-stroke">
                    <td
                      className={`p-3 font-semibold ${
                        strong
                          ? "text-[color:var(--accent-warm)]"
                          : "text-foreground"
                      }`}
                    >
                      {band}
                    </td>
                    <td className="p-3">{n}</td>
                    <td className="p-3">{flagged}</td>
                    <td className="p-3">{actual}</td>
                    <td className="p-3">{recall}</td>
                    <td className="p-3">{auc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            <strong className="text-foreground">
              The model discriminates by age — against the people it fails to
              help.
            </strong>{" "}
            Employees aged 51–60 leave at 21.4%, nearly the rate of the
            under-30s, yet the model flags only 10.7% of them and catches 1 of
            their 6 leavers. Its AUC in that group collapses to 0.636 and the
            selection-rate ratio across bands is 0.20, far below the 0.8 rule of
            thumb. The harm here is not being wrongly flagged; it is being{" "}
            <strong className="text-foreground">invisible</strong> — older
            employees at genuine risk receive none of the retention attention
            the system directs. <em>(Caveat: 28 people, 6 leavers. The
            direction is clear, the magnitude is not — and this is precisely the
            group the data is too thin to serve, which is itself the finding.)</em>
          </p>
          <p>
            Gender looks acceptable on the number most audits report — a flag
            ratio of 0.96 — and that number is exactly the one that hides the
            problem. The model&apos;s AUC is{" "}
            <strong className="text-foreground">0.754 for women against
            0.835 for men</strong>: a measurably weaker instrument for 40% of
            the workforce. Marital status carries more attributed score (6.2%)
            than age and gender combined, with single employees flagged at 52.6%
            against 26.6% for divorced ones.
          </p>
          <p>
            <strong className="text-foreground">
              The obvious fix does not work.
            </strong>{" "}
            Retraining without <code>Age</code>, <code>Gender</code> and{" "}
            <code>MaritalStatus</code> costs only{" "}
            <strong className="text-foreground">0.003 AUC</strong> — the
            information survives in proxies (tenure, job level, income,
            commute), so the model reconstructs it while the audit trail
            disappears. Removing protected attributes would make this system
            less fair and harder to challenge, not more fair. The defensible
            choice is to keep them visible and audit by group. Marital status is
            the one I would nonetheless drop: small predictive contribution,
            hardest of the three to justify to an employee.
          </p>
          <p>
            A separate problem is consent. The satisfaction and work-life
            balance items are the model&apos;s strongest controllable
            predictors, and employees answered them believing the responses were
            confidential and aggregate. Feeding them into an individual
            flight-risk score is a change of purpose they never agreed to, it is
            exposed under GDPR Article 22, and it is self-defeating: once staff
            work out that survey answers feed a scoring system, the answers stop
            being truthful and the best features in the model decay.
          </p>
          <p className="rounded-2xl border border-stroke bg-[rgba(216,107,63,0.09)] p-4 text-sm">
            <strong className="text-foreground">
              What I would require before deployment.
            </strong>{" "}
            Aggregate reporting only in the first cycle — team- and role-level
            risk, no individual names. Individual scores released only with a
            works-council agreement, an appeal route, and an explicit ban on
            their use in promotion, assignment or termination decisions.
            Quarterly re-audit of the table above, with the 51–60 band as a{" "}
            <em>blocking</em> condition. And a prospective evaluation: score one
            quarter, act on nothing, measure. Everything here comes from a
            single 294-row hold-out.
          </p>
          <p>
            The failure mode this guards against is not a bad prediction. It is
            a manager quietly writing off a &ldquo;high-risk&rdquo; employee —
            excluding them from a long project, passing them over for
            development — until{" "}
            <strong className="text-foreground">
              the model becomes correct by causing what it predicted
            </strong>
            . Standard accuracy monitoring cannot detect that, because a
            self-fulfilling flag looks exactly like a good call.
          </p>
        </Section>

        <Section id="takeaways" eyebrow="10" title="Takeaways">
          <div className="card overflow-x-auto p-1">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.15em] text-muted">
                  <th className="p-3">Decision</th>
                  <th className="p-3">Skill demonstrated</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "Testing three imbalance strategies instead of reflexively applying SMOTE",
                    "Separating what a metric measures (ranking) from what a threshold measures",
                  ],
                  [
                    "Fixing the selection rule before touching the hold-out",
                    "Pre-registration discipline — and reporting the reversal rather than hiding it",
                  ],
                  [
                    "Reporting a capacity table, not a confusion matrix",
                    "Translating a probability into an operating decision a team can staff",
                  ],
                  [
                    "Choosing deterministic SHAP and stating what it costs",
                    "Knowing the assumptions inside the explainability tool, not just its API",
                  ],
                  [
                    "Auditing by group and finding the 51–60 blind spot",
                    "Fairness as measurement rather than as a paragraph of good intentions",
                  ],
                  [
                    "Recommending against individual deployment",
                    "Judging when a working model should not ship as built",
                  ],
                ].map(([decision, skill]) => (
                  <tr key={decision} className="border-t border-stroke">
                    <td className="p-3 font-semibold text-foreground">
                      {decision}
                    </td>
                    <td className="p-3">{skill}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="rounded-2xl border border-stroke bg-[rgba(11,107,95,0.06)] p-4 text-sm">
            <strong className="text-foreground">What I take away:</strong> the
            modelling was the short part. AUC 0.808 was reachable in an
            afternoon, and the gap between the three families was never
            resolvable at this sample size. The work that changed the
            recommendation was everything after — the capacity table, the
            collinearity bill, the group audit. The single finding I would
            defend without further evidence is narrow and useful:{" "}
            <strong className="text-foreground">
              overtime, satisfaction and pay at the bottom of the payroll are
              where to look
            </strong>
            .
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
            href="https://github.com/waneib22/hr-analytics-case-study"
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
