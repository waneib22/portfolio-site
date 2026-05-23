import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bayesian Inverse Reinforcement Learning | Ibrahima Wane",
  description:
    "Academic case study: recovering an agent's reward function from observed behavior in a gridworld MDP, with a from-scratch Bayesian IRL and PolicyWalk implementation.",
};

const stack = [
  "Python",
  "NumPy",
  "Markov Decision Processes",
  "MCMC",
  "Bayesian inference",
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

export default function BayesianIRL() {
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
            Learning rewards from behavior
          </h1>
          <p className="text-lg text-muted">
            An academic project, implemented from scratch. Instead of learning
            how to act given a reward, Inverse Reinforcement Learning asks the
            opposite question: given how an agent <em>does</em> act, what reward
            was it pursuing? This write-up rebuilds the full Bayesian IRL
            pipeline — environment, forward solver, demonstrations, and the
            PolicyWalk sampler — and reports honestly what the experiments show.
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
              href="https://github.com/waneib22/bayesian_irl"
              target="_blank"
              rel="noreferrer"
            >
              View code
            </a>
          </div>
        </header>

        <Section id="problem" eyebrow="01" title="The problem: inverting RL">
          <p>
            Classic reinforcement learning takes a reward function and searches
            for a policy that maximizes it. <strong className="text-foreground">Inverse</strong>{" "}
            reinforcement learning (IRL) flips the arrow: we observe an agent
            behaving — a sequence of states and the actions it chose — and we try
            to recover the reward function that best explains that behavior.
          </p>
          <p>
            This matters whenever the reward is the hard part. Hand-specifying
            what we want an agent to value is notoriously brittle; it is often
            easier to <em>demonstrate</em> good behavior than to write down its
            objective. IRL is the formal route from demonstrations back to
            objectives.
          </p>
          <p>
            The Bayesian framing, following Ramachandran &amp; Amir (2007),
            treats the reward function as a random variable: we place a{" "}
            <strong className="text-foreground">prior</strong> over reward
            functions, define a <strong className="text-foreground">likelihood</strong>{" "}
            of the observed actions given a reward, and sample from the resulting{" "}
            <strong className="text-foreground">posterior</strong>. The goal of
            this project was to build that entire chain by hand, in a controlled
            gridworld, to understand each moving part.
          </p>
        </Section>

        <Section
          id="environment"
          eyebrow="02"
          title="The environment: a gridworld MDP"
        >
          <p>
            Everything happens on an N×N grid modeled as a Markov Decision
            Process. Each cell is a state; the actions are the four moves{" "}
            <code>L</code>, <code>R</code>, <code>U</code>, <code>D</code>. The
            world is stochastic: with probability 0.8 a move goes where intended,
            and with a <strong className="text-foreground">slip probability</strong>{" "}
            of 0.2 the agent veers to a perpendicular cell instead. The discount
            factor is γ = 0.9. Moves that would leave the grid keep the agent in
            place.
          </p>
          <Figure
            src="/images/bayesian-irl/gridworld.png"
            alt="Structured gridworld MDP with hand-set rewards"
            width={659}
            height={682}
            caption="The structured PartialMDP. Each cell carries a reward — a goal at H1 (+2.0), penalties at B4 and C7 (-1.0), and mild positive/negative zones. This is the ground-truth reward the agent will be assumed to follow."
          />
          <p>
            To stress-test the method beyond one hand-crafted map, a second class{" "}
            <code>RandomPartialMDP</code> populates the grid with random
            semantic features — <code>Treasure</code>, <code>Bomb</code>,{" "}
            <code>Mud</code>, <code>Water</code>, <code>Mountain</code> — each
            mapped to a reward value. This gives an endless supply of fresh
            worlds to evaluate the algorithm on.
          </p>
          <Figure
            src="/images/bayesian-irl/random-mdp.png"
            alt="Randomly generated gridworld MDP"
            width={659}
            height={682}
            caption="A randomly generated MDP. Feature counts (6 treasures, 12 bombs, 10 mud…) are scattered across the grid and converted to rewards, producing a varied reward landscape for testing."
          />
        </Section>

        <Section
          id="forward"
          eyebrow="03"
          title="Solving the forward problem: Policy Iteration"
        >
          <p>
            Before we can invert anything, we need to be able to solve the
            forward problem — given a reward, find the optimal policy. I
            implemented <strong className="text-foreground">Policy Iteration</strong>{" "}
            with the three classic steps:
          </p>
          <ul className="space-y-2">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">Evaluation</strong> —
                iteratively compute the value of every state under the current
                policy until it converges.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">Improvement</strong> — at
                each state, switch to the action with the best expected value.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span>
                <strong className="text-foreground">Iteration</strong> — repeat
                evaluation and improvement until the policy stops changing.
              </span>
            </li>
          </ul>
          <p>
            This solver is the workhorse reused throughout the rest of the
            project: every candidate reward proposed by the Bayesian search is
            turned into a policy through Policy Iteration.
          </p>
        </Section>

        <Section
          id="tutor"
          eyebrow="04"
          title="Generating demonstrations: an imperfect tutor"
        >
          <p>
            IRL needs observed behavior to learn from. Rather than assume a
            perfect demonstrator, I built an{" "}
            <strong className="text-foreground">imperfect tutor</strong>: it
            mostly follows the optimal policy, but with a 5% chance picks a random
            action (<code>optimal_action_prob = 0.95</code>). Starting from an
            initial state, it rolls out a trajectory and records the resulting
            sequence of (state, action) pairs.
          </p>
          <p>
            This noise is deliberate and realistic — real demonstrators make
            mistakes — and it is exactly what the Bayesian likelihood is designed
            to tolerate, rather than requiring the observations to be perfectly
            consistent with a single reward.
          </p>
        </Section>

        <Section
          id="bayesian"
          eyebrow="05"
          title="The Bayesian framework"
        >
          <p>
            With an environment, a solver, and demonstrations in hand, the
            inference machinery has three pieces.
          </p>
          <h3 className="section-title pt-2 text-lg text-foreground">
            Priors over rewards
          </h3>
          <p>
            I implemented three candidate priors — <code>UniformPrior</code> (any
            reward within a bound is equally likely), <code>GaussianPrior</code>{" "}
            (rewards near zero are favored, penalizing extreme values), and{" "}
            <code>BetaPrior</code>. The Gaussian prior is the one carried through
            the experiments.
          </p>
          <h3 className="section-title pt-2 text-lg text-foreground">
            Likelihood: a Boltzmann policy
          </h3>
          <p>
            The likelihood links a reward to the observed actions. For a given
            reward we compute the Q-values (via a value-iteration-style sweep),
            then assume the tutor picks actions with a{" "}
            <strong className="text-foreground">softmax / Boltzmann</strong>{" "}
            distribution over those Q-values:{" "}
            <code>P(a | s) = exp(α·Q(s,a)) / Σ exp(α·Q(s,·))</code>. The
            parameter α encodes how rational (deterministic) the agent is assumed
            to be. The likelihood of a set of observations is the product over all
            observed (state, action) pairs.
          </p>
          <h3 className="section-title pt-2 text-lg text-foreground">
            Posterior and acceptance ratio
          </h3>
          <p>
            The posterior is simply prior × likelihood. Because we will compare
            candidate rewards rather than normalize, the key quantity is the{" "}
            <strong className="text-foreground">ratio</strong> of posteriors{" "}
            <code>P(R₁ | O) / P(R₂ | O)</code> — exactly what a
            Metropolis-Hastings sampler needs to decide whether to accept a new
            proposal.
          </p>
        </Section>

        <Section
          id="policywalk"
          eyebrow="06"
          title="PolicyWalk: sampling the reward space"
        >
          <p>
            <strong className="text-foreground">PolicyWalk</strong> is the MCMC
            algorithm at the heart of Bayesian IRL. The reward space is too large
            to explore exhaustively, so we random-walk through it: start from a
            random reward, repeatedly propose a small perturbation to a
            neighboring reward, recompute the induced policy, and accept the
            proposal with probability <code>min(1, posterior(R&apos;)/posterior(R))</code>
            . Over many steps this traces out the posterior — concentrating on
            rewards that explain the demonstrations well.
          </p>
          <p>
            The recovered reward vectors are directly interpretable: a positive
            value marks a state the agent is inferred to find desirable, a
            negative one a state it avoids. Reading them back against the grid is
            the qualitative sanity check that the inference is doing something
            sensible.
          </p>
          <h3 className="section-title pt-2 text-lg text-foreground">
            A simulated-annealing variant
          </h3>
          <p>
            I also implemented <strong className="text-foreground">CoolingPolicyWalk</strong>
            , which adds simulated annealing: a temperature T that decays each
            iteration and reshapes the acceptance probability via{" "}
            <code>exp(Δlog-posterior / T)</code>. Early on, high temperature
            permits exploratory, occasionally-worse moves; as T cools, the walk
            settles toward high-posterior regions. The aim is to escape poor
            local optima that a plain walk can get stuck in.
          </p>
        </Section>

        <Section
          id="evaluation"
          eyebrow="07"
          title="Evaluation: 0-1 policy loss"
        >
          <p>
            How do we score a recovered reward? Not by comparing reward numbers
            directly — many different rewards induce the same optimal behavior —
            but by behavior. The{" "}
            <strong className="text-foreground">0-1 policy loss</strong> is the
            fraction of observed (state, action) pairs where the policy implied
            by the recovered reward disagrees with what the tutor actually did. I
            compared plain PolicyWalk against the cooling variant across grid
            sizes 5, 8, and 10.
          </p>
          <Figure
            src="/images/bayesian-irl/loss-grid5.png"
            alt="Policy loss vs iterations, grid size 5"
            width={1018}
            height={547}
            caption="Grid 5×5. PolicyWalk fluctuates around the demonstrations (dipping but also spiking to 0.6); the cooling variant stays flat at 0.5 — stable, but not improving."
          />
          <Figure
            src="/images/bayesian-irl/loss-grid8.png"
            alt="Policy loss vs iterations, grid size 8"
            width={1018}
            height={547}
            caption="Grid 8×8. PolicyWalk briefly reaches zero loss — recovering a reward fully consistent with the demonstrations — before drifting back up. The cooling walk holds steady near zero."
          />
          <Figure
            src="/images/bayesian-irl/loss-grid10.png"
            alt="Policy loss vs iterations, grid size 10"
            width={1010}
            height={547}
            caption="Grid 10×10. Both methods plateau at a high loss (~0.9) with little movement — on the largest grid, with these demonstrations, neither recovers behavior well."
          />
          <p>
            The honest reading: the results are{" "}
            <strong className="text-foreground">mixed and noisy</strong>, and
            that is itself informative. PolicyWalk is high-variance — it can find
            a zero-loss reward (grid 8) but does not reliably stay there. The
            cooling variant trades that volatility for stability, but on these
            runs stability sometimes means being stuck. On the 10×10 grid both
            struggle, illustrating how the reward posterior gets harder to
            explore as the state space grows and the demonstrations stay short.
          </p>
        </Section>

        <Section id="takeaways" eyebrow="08" title="Takeaways">
          <p>
            This was a from-scratch build rather than a polished product, and the
            value is in what it forced me to understand end to end:
          </p>
          <div className="card overflow-x-auto p-1">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.15em] text-muted">
                  <th className="p-3">Component</th>
                  <th className="p-3">What it demonstrates</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["MDP + stochastic transitions", "Modeling sequential decisions under uncertainty"],
                  ["Policy Iteration", "Dynamic programming, the RL forward problem"],
                  ["Imperfect tutor", "Realistic, noisy demonstrations"],
                  ["Priors, Boltzmann likelihood, posterior", "Bayesian modeling from first principles"],
                  ["PolicyWalk (MCMC)", "Metropolis-Hastings sampling over a structured space"],
                  ["Simulated annealing variant", "Exploration vs exploitation in samplers"],
                  ["0-1 policy loss across grid sizes", "Behavior-based evaluation, honest reporting"],
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
            <strong className="text-foreground">What I take away:</strong>{" "}
            implementing a method from the paper up — environment, solver,
            likelihood, sampler, evaluation — teaches far more than calling a
            library. The noisy results aren&apos;t a failure to hide; they show
            the real difficulty of reward inference, and reading them honestly is
            part of the work.
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
            href="https://github.com/waneib22/bayesian_irl"
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
