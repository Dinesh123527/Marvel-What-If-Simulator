import HeroSection from './components/HeroSection';
import ScenarioCard from './components/ScenarioCard';
import { getScenarios } from './lib/data';

export default async function Home() {
  // Get featured scenarios (first 3)
  const allScenarios = await getScenarios();
  const featuredScenarios = allScenarios.slice(0, 3);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Scenarios Section */}
      <section className="py-24 relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-deep/50 to-cosmic-deep pointer-events-none" />

        <div className="container-cosmic relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-quantum-purple/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-quantum-purple" />
              <span className="text-sm text-quantum-purple font-medium">Featured Scenarios</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Choose Your <span className="gradient-text">Divergence Point</span>
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Select a pivotal moment in MCU history and explore what could have been.
              Each scenario opens a gateway to infinite possibilities.
            </p>
          </div>

          {/* Scenario Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredScenarios.map((scenario, index) => (
              <ScenarioCard key={scenario.id} scenario={scenario} index={index} />
            ))}
          </div>

          {/* View All Link */}
          <div className="text-center mt-12">
            <a
              href="/scenarios"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <span>View All Scenarios</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container-cosmic relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It <span className="gradient-text-gold">Works</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Three simple steps to explore the infinite multiverse
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-nexus-blue to-quantum-purple flex items-center justify-center relative">
                <span className="text-3xl font-bold text-white">1</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-nexus-blue to-quantum-purple blur-xl opacity-50" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Pick a Canon Event</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Choose a pivotal moment from MCU history — from the Battle of New York to the Infinity War.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-tva-gold to-tva-orange flex items-center justify-center relative">
                <span className="text-3xl font-bold text-cosmic-void">2</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-tva-gold to-tva-orange blur-xl opacity-50" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Choose a Divergence</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                What if Tony survived? What if Thor went for the head? Select your alternate decision.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-multiverse-pink to-quantum-purple flex items-center justify-center relative">
                <span className="text-3xl font-bold text-white">3</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-multiverse-pink to-quantum-purple blur-xl opacity-50" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Watch Reality Unfold</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                See immediate consequences, ripple effects, and the birth of an entirely new universe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-quantum-purple/10 via-transparent to-transparent" />

        <div className="container-cosmic relative z-10 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Shatter the <span className="gradient-text">Sacred Timeline</span>?
            </h2>
            <p className="text-text-secondary text-lg mb-10">
              The TVA can&apos;t stop you here. Explore every possible outcome and discover
              the infinite versions of your favorite Marvel stories.
            </p>
            <a href="/scenarios" className="btn-gold text-lg px-10 py-5">
              Begin Your Simulation
              <svg className="w-5 h-5 ml-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="container-cosmic">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-quantum-purple font-bold">WHAT IF?</span>
              <span className="text-text-muted text-sm">MCU Simulator</span>
            </div>
            <p className="text-text-muted text-sm text-center">
              A fan-made project. Not affiliated with Marvel Studios or Disney.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-text-muted">Built with 💜 for the Multiverse</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
