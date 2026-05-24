import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accessibility Atlas — Île-de-France | Ibrahima Wane",
  description:
    "Case study: mapping public-transit inequalities across the 1,297 communes of Île-de-France, identifying 17 priority transit deserts from open GTFS and INSEE data.",
};

const stack = [
  "Python",
  "GeoPandas",
  "Shapely",
  "SciPy (cKDTree)",
  "Folium",
  "GTFS",
  "GBFS",
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

export default function AccessibilityAtlas() {
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
            Mapping transit deserts in Île-de-France
          </h1>
          <p className="text-lg text-muted">
            Île-de-France has 1,297 communes served by 75 transit operators —
            yet behind that density, some towns are still out of comfortable
            reach of public transport. This case study quantifies that gap:
            building a composite mobility score from open GTFS and INSEE data,
            then isolating the towns where the policy question is sharpest.
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
              href="https://github.com/waneib22/accessibility-atlas-idf"
              target="_blank"
              rel="noreferrer"
            >
              View code
            </a>
          </div>
        </header>

        <Section id="problem" eyebrow="01" title="The problem">
          <p>
            Île-de-France is an extraordinarily dense transport region — 1,297
            communes, 75 operators, hundreds of train, metro, tram and bus
            lines. But aggregate density hides local reality. In some communes,
            the nearest stop is a long walk, frequency is thin, and a car is
            still the daily default. These are the{" "}
            <strong className="text-foreground">transit deserts</strong>: not
            zero coverage, but coverage too weak to be a real alternative.
          </p>
          <p>
            The policy question is harder than it looks. Public transit
            investment is finite, so the relevant target isn&apos;t every
            under-served pixel — it&apos;s communes where{" "}
            <strong className="text-foreground">enough people</strong> live with{" "}
            <strong className="text-foreground">too little service</strong>. This
            project frames that question quantitatively and produces a short,
            actionable list.
          </p>
        </Section>

        <Section id="data" eyebrow="02" title="The data">
          <p>Four open data sources, all stitched at the commune level:</p>
          <div className="card overflow-x-auto p-1">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.15em] text-muted">
                  <th className="p-3">Dataset</th>
                  <th className="p-3">Source</th>
                  <th className="p-3">Format</th>
                </tr>
              </thead>
              <tbody className="align-top">
                <tr className="border-t border-stroke">
                  <td className="p-3 font-semibold text-foreground">
                    Transit timetables and stops
                  </td>
                  <td className="p-3">
                    Île-de-France Mobilités via transport.data.gouv.fr
                  </td>
                  <td className="p-3">GTFS</td>
                </tr>
                <tr className="border-t border-stroke">
                  <td className="p-3 font-semibold text-foreground">
                    Population by commune
                  </td>
                  <td className="p-3">INSEE via geo.api.gouv.fr</td>
                  <td className="p-3">JSON</td>
                </tr>
                <tr className="border-t border-stroke">
                  <td className="p-3 font-semibold text-foreground">
                    Commune boundaries
                  </td>
                  <td className="p-3">france-geojson</td>
                  <td className="p-3">GeoJSON</td>
                </tr>
                <tr className="border-t border-stroke">
                  <td className="p-3 font-semibold text-foreground">
                    Bike-share docks
                  </td>
                  <td className="p-3">Vélib&apos; Métropole (Smovengo)</td>
                  <td className="p-3">GBFS</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            A small but instructive data pitfall: INSEE&apos;s default API
            returns Paris as one single commune (75056), while{" "}
            <code>france-geojson</code> splits Paris into its 20 arrondissements
            (75101-75120). Joining naively would silently drop Paris from the
            map. Fix: hit INSEE&apos;s arrondissement endpoint as a second pass
            and concatenate.
          </p>
        </Section>

        <Section
          id="grid"
          eyebrow="03"
          title="From timetables to a usable grid"
        >
          <p>
            GTFS data ships as raw schedules: thousands of stops, hundreds of
            routes, millions of timetabled departures. To turn that into
            per-commune accessibility, the pipeline lays a regular{" "}
            <strong className="text-foreground">500-meter grid</strong> over the
            region and, for each grid cell, computes the distance to the nearest
            transit stop.
          </p>
          <p>
            Naive distance-to-each-stop would be O(cells × stops) — too slow at
            this scale. The solution is a{" "}
            <strong className="text-foreground">SciPy cKDTree</strong> built on
            stop coordinates: O(cells × log(stops)) lookups, sub-second on the
            full region. Cell-level distances are then aggregated up to commune
            level (mean distance to nearest stop), along with daily passages
            (summed) and the count of distinct transport modes served.
          </p>
        </Section>

        <Section
          id="score"
          eyebrow="04"
          title="A composite mobility score"
        >
          <p>
            Three signals matter for whether transit is a real option:{" "}
            <strong className="text-foreground">how close</strong> a stop is,{" "}
            <strong className="text-foreground">how often</strong> something
            passes, and <strong className="text-foreground">how many modes</strong>{" "}
            are available. They are blended into a single 0-100 score:
          </p>
          <pre className="card overflow-x-auto p-5 text-[0.8rem] leading-relaxed text-foreground">
{`mobility_score = 0.40 × (1 − normalized_distance_to_stop)
               + 0.40 × log(normalized_daily_passages)
               + 0.20 × normalized_modal_diversity`}
          </pre>
          <p>
            Each component is min-max normalized to [0, 1] before weighting, and
            the final result is scaled to [0, 100]. Two design choices stand out:
          </p>
          <ul className="space-y-2">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">Log-transform on frequency.</strong>{" "}
                Without it, hubs like Châtelet (≈10,000 passages/day) would
                flatten every other commune to near zero. The log makes the
                score sensitive at the low end, where the policy question lives.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">40/40/20 weights.</strong>{" "}
                Distance and frequency get equal weight (both equally veto a
                line as a real option); modal diversity matters but is the
                weakest single signal — a single high-frequency train station
                often beats five poorly-served bus stops.
              </span>
            </li>
          </ul>
        </Section>

        <Section
          id="distribution"
          eyebrow="05"
          title="Distribution across the region"
        >
          <p>
            Applied to all 1,297 communes, the score gives a clear regional
            picture: a strong central mass around 45-55, a long right tail of
            well-served urban communes, and a thin left tail of severely
            under-served towns.
          </p>
          <Figure
            src="/images/accessibility-atlas/distribution-score.png"
            alt="Distribution of mobility scores across 1,297 IDF communes"
            width={1367}
            height={898}
            caption="Score distribution across Île-de-France. Median = 53.9. The bulk sits between 40 and 60; the highest scores (80+) are central Paris and inner-ring hubs, the lowest (<40) are rural outer communes."
          />
          <p>
            The regional median (53.9) becomes the natural cut-off for what
            counts as &ldquo;below average&rdquo;.
          </p>
        </Section>

        <Section
          id="deserts"
          eyebrow="06"
          title="Identifying priority transit deserts"
        >
          <p>
            A low score alone doesn&apos;t make a public policy priority — a
            village of 200 with no train is a different problem from a town of
            10,000 with no train. The definition combines{" "}
            <strong className="text-foreground">scale</strong> and{" "}
            <strong className="text-foreground">deficit</strong>:
          </p>
          <p className="rounded-2xl border border-stroke bg-[rgba(11,107,95,0.06)] p-4 text-sm">
            <strong className="text-foreground">Priority transit desert</strong> ={" "}
            commune with <strong className="text-foreground">≥ 3,000 inhabitants</strong>{" "}
            <em>AND</em> <strong className="text-foreground">mobility score ≤ regional median (53.9)</strong>.
          </p>
          <p>
            Plotting population (log scale) against score makes the filter visual
            — only the bottom-right quadrant qualifies:
          </p>
          <Figure
            src="/images/accessibility-atlas/scatter-deserts.png"
            alt="Population vs mobility score scatter, with priority deserts highlighted"
            width={1367}
            height={908}
            caption="17 communes qualify as priority transit deserts. They cluster tightly: enough people to matter, but a mobility score stuck around the regional median or below."
          />
        </Section>

        <Section
          id="findings"
          eyebrow="07"
          title="Where they are"
        >
          <p>
            The 17 priority deserts aren&apos;t scattered randomly. They
            concentrate in three departments that share one structural feature:
            no direct heavy-rail backbone.
          </p>
          <Figure
            src="/images/accessibility-atlas/geographic-distribution.png"
            alt="Priority deserts by department"
            width={1532}
            height={936}
            caption="10 of the 17 priority deserts are in Seine-et-Marne (77). Yvelines (78), well covered by Transilien lines N and U, has zero. The map reads like a transit-investment heatmap."
          />
          <Figure
            src="/images/accessibility-atlas/top10-deserts.png"
            alt="Top 10 priority deserts by population"
            width={1509}
            height={1023}
            caption="The largest under-served town is L'Isle-Adam (12,493 inhabitants, score 51.0). Several Seine-et-Marne towns follow (Fontenay-Trésigny, La Ferté-Gaucher, Jouarre, Châtelet-en-Brie). Milly-la-Forêt has the lowest score (43.1) of the group."
          />
        </Section>

        <Section
          id="pipeline"
          eyebrow="08"
          title="The pipeline and the interactive map"
        >
          <p>
            The end-to-end pipeline is four numbered scripts, runnable in order
            from a clean checkout — no proprietary GIS software (no ArcGIS, no
            QGIS):
          </p>
          <pre className="card overflow-x-auto p-5 text-[0.8rem] leading-relaxed text-foreground">
{`src/
├── 01_transit_network.py    GTFS ingestion + stop mapping by mode
├── 02_accessibility_grid.py 500m grid, nearest-stop via cKDTree, commune aggregation
├── 03_mobility_score.py     Composite score + priority deserts
└── 04_dashboard.py          Interactive Folium dashboard`}
          </pre>
          <p>
            The output is a Folium-based interactive map: choropleth of the
            mobility score over commune boundaries, transit stops overlaid by
            mode, and the priority deserts called out by name. The dashboard is
            published via GitHub Pages — open the live link to pan around the
            region and click any commune for its raw score components.
          </p>
        </Section>

        <Section id="takeaways" eyebrow="09" title="Takeaways">
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
                  ["Ingesting GTFS + INSEE + GeoJSON + GBFS", "Real-world open-data plumbing, with the Paris arrondissement gotcha caught"],
                  ["500m grid + cKDTree nearest-stop", "Spatial scaling beyond a naive O(n²)"],
                  ["Composite score with log-transform", "Score design with explicit policy intent"],
                  ["Threshold rule (population × median)", "Translating an analytical question into a decision rule"],
                  ["Folium interactive map + GitHub Pages", "Shipping the work to a non-technical reader"],
                  ["100% open-source stack", "Reproducibility — anyone with Python can run the whole pipeline"],
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
            <strong className="text-foreground">What I take away:</strong> the
            hardest part of this kind of work isn&apos;t the geospatial code —
            it&apos;s deciding what counts as &ldquo;a problem worth flagging&rdquo;.
            The 40/40/20 weights and the (population × median) cut-off are
            opinions, not facts. Stating them clearly is what turns an analysis
            into a decision tool.
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
            href="https://github.com/waneib22/accessibility-atlas-idf"
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
