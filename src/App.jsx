import './App.css'
import { useEffect, useRef, useState } from 'react'
import { base } from 'thirdweb/chains'
import { useActiveAccount, useConnectModal } from 'thirdweb/react'
import { createWallet } from 'thirdweb/wallets'
import { client } from './thirdwebClient'
import ThreeEnergyBackground from './ThreeEnergyBackground'

const walletOnlyOptions = [
  createWallet('io.metamask', { preferDeepLink: true }),
  createWallet('com.coinbase.wallet', { preferDeepLink: true }),
  createWallet('me.rainbow', { preferDeepLink: true }),
  createWallet('com.trustwallet.app', { preferDeepLink: true }),
  createWallet('io.zerion.wallet', { preferDeepLink: true }),
]

function App() {
  const [registrationState, setRegistrationState] = useState('idle')
  const timeoutRef = useRef(null)
  const pageRef = useRef(null)
  const account = useActiveAccount()
  const { connect, isConnecting } = useConnectModal()

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const pageEl = pageRef.current
    if (!pageEl) return undefined

    let ticking = false
    let lastY = window.scrollY
    let flash = 0
    let decayId = 0

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

    const applyVars = () => {
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1)
      const progress = clamp(window.scrollY / maxScroll, 0, 1)
      pageEl.style.setProperty('--scroll-progress', progress.toFixed(4))
      pageEl.style.setProperty('--scroll-flash', flash.toFixed(3))
    }

    const decayFlash = () => {
      flash = Math.max(0, flash - 0.035)
      applyVars()
      if (flash > 0) {
        decayId = window.requestAnimationFrame(decayFlash)
      }
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        const y = window.scrollY
        const speed = Math.abs(y - lastY)
        lastY = y
        flash = clamp(flash + speed / 120, 0, 1)
        applyVars()
        if (!decayId) {
          decayId = window.requestAnimationFrame(decayFlash)
        }
        ticking = false
      })
    }

    applyVars()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', applyVars)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', applyVars)
      if (decayId) {
        window.cancelAnimationFrame(decayId)
      }
    }
  }, [])

  const startRegistration = () => {
    setRegistrationState('pending')
    timeoutRef.current = setTimeout(() => {
      setRegistrationState('registered')
    }, 2500)
  }

  const connectToBaseWallet = async () => {
    await connect({
      client,
      chain: base,
      chains: [base],
      wallets: walletOnlyOptions,
      theme: 'dark',
    })
  }

  const handleHeaderConnect = async () => {
    if (account) {
      return
    }
    try {
      await connectToBaseWallet()
    } catch {
      // user closed modal or wallet rejected
    }
  }

  const handleRegister = () => {
    startRegistration()
  }

  return (
    <div className="page" ref={pageRef}>
      <ThreeEnergyBackground />
      <div className="ambient ambient-1" aria-hidden="true" />
      <div className="ambient ambient-2" aria-hidden="true" />
      <div className="plasma-haze haze-1" aria-hidden="true" />
      <div className="plasma-haze haze-2" aria-hidden="true" />
      <div className="plasma-haze haze-3" aria-hidden="true" />
      <div className="energy-line" aria-hidden="true" />
      <div className="top-lightning top-lightning-left" aria-hidden="true" />
      <div className="top-lightning top-lightning-right" aria-hidden="true" />
      <div className="energy-core" aria-hidden="true" />
      <div className="electric electric-left" aria-hidden="true" />
      <div className="electric electric-right" aria-hidden="true" />
      <div className="lightning-layer" aria-hidden="true">
        <span className="bolt bolt-top-l" />
        <span className="bolt bolt-top-r" />
        <span className="bolt bolt-l1" />
        <span className="bolt bolt-l2" />
        <span className="bolt bolt-l3" />
        <span className="bolt bolt-r1" />
        <span className="bolt bolt-r2" />
        <span className="bolt bolt-r3" />
        <span className="bolt bolt-b1" />
        <span className="bolt bolt-b2" />
        <span className="bolt bolt-b3" />
      </div>
      <header className="topbar">
        <div className="brand">
          <span className="brand-dot" />
          <span>NetWeave</span>
        </div>
        <button
          className="wallet-connect-btn"
          type="button"
          onClick={handleHeaderConnect}
          disabled={isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </header>

      <main className="content">
        <section className="hero glass-panel">
          <h1>About NetWeave</h1>
          <p>
            NetWeave is an AI and blockchain technology company focused on building the
            infrastructure for the next generation of AI-powered digital economies.
          </p>
          <p>
            Our vision is to create a blockchain ecosystem where AI agents and humans can
            interact safely, transparently, and efficiently.
          </p>
          <p>
            By combining education, real-world applications, and decentralized technology,
            NetWeave aims to make blockchain and AI more accessible to millions of people
            worldwide.
          </p>
        </section>

        <section className="register-section">
          {registrationState !== 'registered' ? (
            <div className="register-panel">
              <h2>Registration</h2>
              <p>Please deposite $50 to register and access the platform.</p>
              <p>
                Start your onboarding to the Neural Pod ecosystem with secure and
                transparent participation.
              </p>
              <button
                className="cta-btn cta-primary"
                type="button"
                onClick={handleRegister}
                disabled={registrationState === 'pending'}
              >
                {registrationState === 'pending'
                  ? 'Registering...'
                  : 'Register'}
              </button>
              <div className="fee-pill">$50</div>
            </div>
          ) : (
            <div className="register-card">
              <h2>Buy Pods</h2>
              <div className="buy-info-grid">
                <div className="buy-info-box">
                  <span>Block</span>
                  <strong>1</strong>
                </div>
                <div className="buy-info-box">
                  <span>Epoch</span>
                  <strong>1</strong>
                </div>
                <div className="buy-info-box">
                  <span>Total Neural Pods</span>
                  <strong>1000</strong>
                </div>
                <div className="buy-info-box">
                  <span>Available Neural Pods</span>
                  <strong>1000</strong>
                </div>
              </div>
              <p className="success-note">
                Registration is complete. Full platform features are being enabled and
                will be available to you in the coming days.
              </p>
              <button className="cta-btn cta-secondary" type="button" disabled>
                Buy
              </button>
            </div>
          )}
        </section>

        <section className="epoch-ui" aria-label="Neural Pod Epoch">
          <div className="epoch-top-arcs" aria-hidden="true">
            <span className="epoch-arc epoch-arc-left" />
            <span className="epoch-arc epoch-arc-right" />
          </div>
          <h2>Neural Pod Epoch</h2>

          <div className="epoch-day-row">
            <span>Day 1</span>
            <span>Day 6</span>
          </div>

          <div className="epoch-main-row">
            <div className="epoch-pods epoch-pods-left" aria-hidden="true">
              {Array.from({ length: 10 }).map((_, index) => (
                <span className="epoch-pod" key={`left-pod-${index}`} />
              ))}
            </div>

            <div className="epoch-arrow-wrap">
              <p className="epoch-growth">+30%</p>
              <div className="epoch-arrow" aria-hidden="true">
                <span className="epoch-arrow-line" />
                <span className="epoch-arrow-head" />
              </div>
              <p className="epoch-after">After 6 Days</p>
            </div>

            <div className="epoch-pods epoch-pods-right" aria-hidden="true">
              {Array.from({ length: 13 }).map((_, index) => (
                <span className="epoch-pod" key={`right-pod-${index}`} />
              ))}
            </div>
          </div>

          <div className="epoch-card-row">
            <article className="epoch-card">
              <p className="epoch-card-day">Day 1</p>
              <p className="epoch-card-pods">50 Neural Pods</p>
            </article>
            <article className="epoch-card">
              <p className="epoch-card-day">Day 6</p>
              <p className="epoch-card-pods">65 Neural Pods</p>
            </article>
          </div>

          <div className="epoch-foot">
            <p>
              Neural Pods expand <strong>30%</strong> every Epoch.
            </p>
            <p>Each Epoch lasts 6 days.</p>
          </div>
        </section>

        <section className="expansion-ui" aria-label="Neural Pod Expansion Blocks">
          <div className="expansion-top-arcs" aria-hidden="true">
            <span className="expansion-arc expansion-arc-left" />
            <span className="expansion-arc expansion-arc-right" />
          </div>
          <h2>Neural Pod Expansion Blocks</h2>

          <div className="expansion-row">
            <article className="expansion-block">
              <p className="expansion-block-title">Block 1</p>
              <p className="expansion-block-sub">Network Bootstrap</p>
              <div className="expansion-pods" aria-hidden="true">
                {Array.from({ length: 6 }).map((_, index) => (
                  <span className="expansion-pod" key={`exp-b1-${index}`} />
                ))}
              </div>
              <div className="expansion-bottom">
                <p className="expansion-bottom-line">Epoch every</p>
                <p className="expansion-bottom-days">6 days</p>
              </div>
            </article>

            <span className="expansion-link-arrow" aria-hidden="true" />

            <article className="expansion-block">
              <p className="expansion-block-title">Block 2</p>
              <p className="expansion-block-sub">Expansion Phase</p>
              <div className="expansion-pods" aria-hidden="true">
                {Array.from({ length: 7 }).map((_, index) => (
                  <span className="expansion-pod" key={`exp-b2-${index}`} />
                ))}
              </div>
              <div className="expansion-bottom">
                <p className="expansion-bottom-line">Epoch every</p>
                <p className="expansion-bottom-days">8 days</p>
              </div>
              <p className="expansion-plus-note">(+2 days)</p>
            </article>

            <span className="expansion-link-arrow" aria-hidden="true" />

            <article className="expansion-block">
              <p className="expansion-block-title">Block 3</p>
              <p className="expansion-block-sub">Scaling Phase</p>
              <div className="expansion-pods" aria-hidden="true">
                {Array.from({ length: 8 }).map((_, index) => (
                  <span className="expansion-pod" key={`exp-b3-${index}`} />
                ))}
              </div>
              <div className="expansion-bottom">
                <p className="expansion-bottom-line">Epoch every</p>
                <p className="expansion-bottom-days">10 days</p>
              </div>
              <p className="expansion-plus-note">(+2 days)</p>
            </article>

            <span className="expansion-link-arrow" aria-hidden="true" />

            <article className="expansion-block">
              <p className="expansion-block-title">Block 4</p>
              <p className="expansion-block-sub">Stability Phase</p>
              <div className="expansion-pods" aria-hidden="true">
                {Array.from({ length: 8 }).map((_, index) => (
                  <span className="expansion-pod" key={`exp-b4-${index}`} />
                ))}
              </div>
              <div className="expansion-bottom">
                <p className="expansion-bottom-line">Epoch every</p>
                <p className="expansion-bottom-days">12 days</p>
              </div>
              <p className="expansion-plus-note">(+2 days)</p>
            </article>

            <span className="expansion-link-arrow" aria-hidden="true" />

            <div className="expansion-tail">
              <p className="expansion-tail-plus">+2 +2 +2</p>
              <div className="expansion-tail-pods" aria-hidden="true">
                {Array.from({ length: 11 }).map((_, index) => (
                  <span className="expansion-pod expansion-pod-small" key={`exp-tail-${index}`} />
                ))}
              </div>
              <p className="expansion-tail-text">And so on...</p>
            </div>
          </div>

          <p className="expansion-foot">
            Expansion timing increases gradually to maintain a stable AI ecosystem.
          </p>
        </section>

        <section className="glass-panel section-block">
          <h2>Building the Future of AI Agents</h2>
          <p>
            Artificial intelligence is evolving rapidly, and autonomous AI agents are
            expected to play an increasingly important role in digital systems. However,
            one major challenge remains:
          </p>
          <p>How can AI agents interact with financial systems safely while maintaining human control?</p>
          <p>
            NetWeave is developing infrastructure designed to support AI agents that can
            interact with blockchain networks, perform tasks, and execute transactions
            while maintaining strong user control mechanisms.
          </p>
          <p>For example:</p>
          <ul>
            <li>Users may deploy AI agents to perform automated tasks</li>
            <li>Agents may interact with services or execute payments</li>
            <li>
              Users remain in control through approval mechanisms or predefined spending
              limits
            </li>
          </ul>
          <p>
            This approach allows automation while maintaining security, transparency, and
            user authority.
          </p>
        </section>

        <section className="split">
          <article className="glass-panel section-block">
            <h2>Why User Participation Matters</h2>
            <p>
              Artificial intelligence systems improve through data, interaction, and
              real-world usage.
            </p>
            <p>
              To build intelligent blockchain-based systems, AI must understand the
              following:
            </p>
            <ul>
              <li>how users interact with decentralized applications</li>
              <li>how transactions flow across blockchain networks</li>
              <li>how real digital economies function</li>
            </ul>
            <p>
              Active users help generate the activity needed to train, refine, and improve
              AI systems designed for blockchain environments.
            </p>
            <p>
              This is why NetWeave focuses on building an ecosystem where users are active
              participants, not just passive observers.
            </p>
          </article>

          <article className="glass-panel section-block">
            <h2>Making Blockchain Accessible Through Education</h2>
            <p>
              One of the biggest barriers to blockchain adoption is lack of financial and
              technical education.
            </p>
            <p>
              Many people are curious about digital assets, decentralized finance, and AI-but
              they often lack the resources or guidance to understand them confidently.
            </p>
            <p>NetWeave aims to help address this gap through educational initiatives designed to introduce users to:</p>
            <ul>
              <li>blockchain fundamentals</li>
              <li>digital financial literacy</li>
              <li>AI and decentralized technologies</li>
              <li>safe and responsible participation in Web3 ecosystems</li>
            </ul>
            <p>
              Our goal is to create an environment where users can learn, explore, and
              participate responsibly.
            </p>
          </article>
        </section>

        <section className="glass-panel section-block">
          <h2>Real-World Utility: The NetWeave Travel Portal</h2>
          <p>
            To encourage meaningful blockchain activity, NetWeave is also developing practical
            applications that connect decentralized technology with real-world use cases.
          </p>
          <p>One example is the NetWeave Travel Portal.</p>
          <p>
            The travel platform is designed to allow users to interact with blockchain-enabled
            systems in a familiar environment while accessing travel-related services.
          </p>
          <p>Through practical tools like this, NetWeave aims to:</p>
          <ul>
            <li>introduce blockchain to everyday users</li>
            <li>create real transaction activity within the ecosystem</li>
            <li>explore how AI agents can assist with digital services</li>
          </ul>
          <p>
            Real-world use cases help demonstrate how blockchain technology can integrate
            into everyday digital experiences.
          </p>
        </section>

        <section className="split">
          <article className="glass-panel section-block">
            <h2>Introducing Neural Pods</h2>
            <p>Growing a blockchain network requires an active community.</p>
            <p>
              Historically, many blockchain projects have relied heavily on large
              marketing budgets and financial incentives to attract users.
            </p>
            <p>
              NetWeave takes a different approach through Neural Pods, a participation
              model designed to support ecosystem growth.
            </p>
            <p>
              The Neural Pods system is inspired by early blockchain incentive models
              where network participants are rewarded for contributing to ecosystem
              activity.
            </p>
            <p>The structure is designed to:</p>
            <ul>
              <li>encourage participation</li>
              <li>support network activity</li>
              <li>align user engagement with ecosystem growth</li>
            </ul>
            <p>
              The reward structure is also designed to gradually adjust over time to
              support long-term sustainability of the system.
            </p>
          </article>

          <article className="glass-panel section-block">
            <h2>A Community-Driven Ecosystem</h2>
            <p>
              NetWeave is built around the idea that the future of AI and blockchain will
              not be created by technology alone.
            </p>
            <p>
              It will be shaped by communities of users, developers, and participants who
              explore, interact, and help build the ecosystem together.
            </p>
            <p>
              Through education, real-world applications, and AI-driven infrastructure,
              NetWeave aims to contribute to the development of a more accessible and
              intelligent decentralized future.
            </p>
          </article>
        </section>

        <section className="glass-panel notice section-block">
          <h2>Important Notice</h2>
          <p>
            NetWeave focuses on technology development, education, and ecosystem
            participation.
          </p>
          <p>
            Any participation within the ecosystem should be approached responsibly and
            with an understanding of blockchain technologies.
          </p>
          <p>
            Nothing on this platform should be interpreted as financial advice or
            guaranteed outcomes.
          </p>
        </section>
      </main>
    </div>
  )
}

export default App
