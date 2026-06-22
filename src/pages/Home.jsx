// import { Link } from "react-router-dom";
// import Navbar from "../components/Navbar";

// function Home() {
//   return (
//     <div className="home-page">
//       <Navbar />

//       <section className="hero-section">
//         <div className="hero-left">
//           <span className="hero-badge">Developer Collaboration Platform</span>

//           <h1>
//             Build your <span>developer identity</span> in one powerful hub
//           </h1>

//           <p>
//             DevHub helps developers create profiles, store private work, and
//             share public code, notes, and resources with the community.
//           </p>

//           <div className="hero-buttons">
//             <Link to="/signup" className="hero-primary-btn">
//               Start Building
//             </Link>

//             <Link to="/login" className="hero-secondary-btn">
//               Login
//             </Link>
//           </div>
//         </div>

//         <div className="hero-right">
//           <div className="preview-card">
//             <div className="preview-top">
//               <span className="dot dot-one"></span>
//               <span className="dot dot-two"></span>
//               <span className="dot dot-three"></span>
//             </div>

//             <div className="preview-content">
//               <h3>@dev_Laraib</h3>
//               <p>Frontend Developer • React Enthusiast</p>

//               <div className="preview-tags">
//                 <span>Public Snippets</span>
//                 <span>Private Notes</span>
//                 <span>Resources</span>
//               </div>

//               <div className="preview-box">
//                 <p>Snippet: React Form Validation</p>
//               </div>

//               <div className="preview-box">
//                 <p>Resource: React Router Docs</p>
//               </div>

//               <div className="preview-box">
//                 <p>Note: Difference between props and state</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="features-section">
//         <div className="feature-card">
//           <h3>Public Profiles</h3>
//           <p>
//             Show your public coding work so other developers can explore your
//             profile and learn from your contributions.
//           </p>
//         </div>

//         <div className="feature-card">
//           <h3>Private Workspace</h3>
//           <p>
//             Keep your personal notes, resources, and private code secure for
//             your own learning and productivity.
//           </p>
//         </div>

//         <div className="feature-card">
//           <h3>Smart Organization</h3>
//           <p>
//             Store snippets, resources, and technical notes in one clean place
//             with better focus and visibility.
//           </p>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default Home;

import { Link } from "react-router-dom";
import './Home.css';

export default function Home() {
  return (
    <>
      <div className="bg-canvas"></div>
      <div className="particle-field"></div>
<div className="home-page">
      <nav>
        <a href="#" className="nav-logo">
          <div className="logo-mark">DH</div>
          DevHub
        </a>
        <ul className="nav-links">
          <li><a href="#" className="active">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#get-started">Get Started</a></li>
        </ul>
        <div className="nav-right">
         <Link to="/login" className="btn-ghost">
            Log in
          </Link>
          
           <Link to="/signup" className="btn-primary">
              Get started
           </Link>
        </div>
      </nav>
</div>
      <div className="wrapper">

        <section className="hero">
          <div className="hero-eyebrow">Developer Identity &amp; Resource Platform</div>

          <h1 className="hero-title">
            Own your <span className="accent">code identity.</span><br />
            Command your knowledge.
          </h1>

          <p className="hero-sub">
            The unified workspace where developers organize private code intelligence and broadcast a public technical identity all in one hub.
          </p>


          <div className="hero-cta">
           <Link to="/signup" className="btn-cta-primary">
             Get started free
            </Link>
             <Link to="/explore" className="btn-cta-ghost">
            Explore Community
           </Link>

          </div>

          <div className="dashboard-preview">
            <div className="dash-topbar">
              <div className="dash-dots">
                <span></span><span></span><span></span>
              </div>
              <div className="dash-url">app.devhub.io/dashboard</div>
            </div>

            <div className="dash-body">

              <div className="dash-sidebar">
                <div className="dash-brand">
                  <div className="dash-brand-dot">DH</div>
                  DevHub
                </div>
                <div className="dash-search">
                  <span>⌘</span> Search snippets…
                </div>
                <div className="dash-nav-item active">
                  <div className="dash-nav-icon" style={{ borderRadius: '50%' }}></div>
                  Dashboard
                </div>
                <div className="dash-nav-item">
                  <div className="dash-nav-icon"></div>
                  Snippets
                </div>
                <div className="dash-nav-item">
                  <div className="dash-nav-icon" style={{ borderRadius: '50%' }}></div>
                  Notes
                </div>
                <div className="dash-nav-item">
                  <div className="dash-nav-icon"></div>
                  Resources
                </div>
                <div className="dash-nav-item">
                  <div className="dash-nav-icon" style={{ borderRadius: '50%' }}></div>
                  Peers
                </div>
                <div className="dash-nav-item">
                  <div className="dash-nav-icon"></div>
                  Public feed
                </div>
              </div>

              <div className="dash-main">
                <div className="dash-header">
                  <div className="dash-greeting">Hello, Dev 👋</div>
                  <div className="dash-date">📅 01 June – 30 June, 2026</div>
                </div>

                <div className="dash-grid">

                  <div className="dash-card">
                    <div className="dash-card-title">Recent snippets</div>
                    <div className="snippet-row">
                      <div className="snippet-tag">TS</div>
                      <div className="snippet-name">useDebounce hook</div>
                      <div className="snippet-vis">● public</div>
                    </div>
                    <div className="snippet-row">
                      <div className="snippet-tag">PY</div>
                      <div className="snippet-name">JWT auth middleware</div>
                      <div className="snippet-vis priv">● private</div>
                    </div>
                    <div className="snippet-row">
                      <div className="snippet-tag">SQL</div>
                      <div className="snippet-name">Pagination query</div>
                      <div className="snippet-vis">● public</div>
                    </div>
                    <div className="snippet-row">
                      <div className="snippet-tag">GO</div>
                      <div className="snippet-name">Rate limiter impl</div>
                      <div className="snippet-vis priv">● private</div>
                    </div>
                  </div>

                  <div className="dash-card">
                    <div className="dash-card-title">This week's output</div>
                    <div className="activity-ring">
                      <div className="ring-visual">
                        <svg viewBox="0 0 64 64" fill="none">
                          <circle cx="32" cy="32" r="26" stroke="rgba(37,99,235,0.15)" strokeWidth="6"/>
                          <circle cx="32" cy="32" r="26" stroke="#3b82f6" strokeWidth="6"
                            strokeDasharray="113 50" strokeDashoffset="20"
                            strokeLinecap="round" transform="rotate(-90 32 32)"/>
                          <circle cx="32" cy="32" r="18" stroke="rgba(74,222,128,0.15)" strokeWidth="4"/>
                          <circle cx="32" cy="32" r="18" stroke="#4ade80" strokeWidth="4"
                            strokeDasharray="60 53" strokeDashoffset="10"
                            strokeLinecap="round" transform="rotate(-90 32 32)"/>
                        </svg>
                      </div>
                      <div className="ring-info">
                        <div className="ring-stat">74%</div>
                        <div className="ring-label">Knowledge shared</div>
                        <div className="ring-legend">
                          <div className="legend-item">
                            <div className="legend-dot" style={{ background: '#3b82f6' }}></div>
                            Snippets published
                          </div>
                          <div className="legend-item">
                            <div className="legend-dot" style={{ background: '#4ade80' }}></div>
                            Notes made public
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="dash-card">
                    <div className="dash-card-title">Filter by tag</div>
                    <div className="tags-cloud">
                      <div className="tag-pill active">TypeScript</div>
                      <div className="tag-pill">Python</div>
                      <div className="tag-pill">React</div>
                      <div className="tag-pill active">API</div>
                      <div className="tag-pill">Docker</div>
                      <div className="tag-pill">SQL</div>
                      <div className="tag-pill">Auth</div>
                      <div className="tag-pill">Go</div>
                    </div>
                  </div>

                  <div className="dash-card">
                    <div className="dash-card-title">Peer discoveries</div>
                    <div className="peer-row">
                      <div className="peer-avatar" style={{ background: 'rgba(37,99,235,0.2)', color: 'var(--blue-accent)' }}>AS</div>
                      <div className="peer-name">alex_systems</div>
                      <div className="peer-tag">12 snippets</div>
                    </div>
                    <div className="peer-row">
                      <div className="peer-avatar" style={{ background: 'rgba(74,222,128,0.15)', color: 'var(--green-neon)' }}>MR</div>
                      <div className="peer-name">maria_rust</div>
                      <div className="peer-tag">8 notes</div>
                    </div>
                    <div className="peer-row">
                      <div className="peer-avatar" style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc' }}>jk</div>
                      <div className="peer-name">jk_infra</div>
                      <div className="peer-tag">5 resources</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about">
          <div className="section-inner">
            <div className="about-grid">
              <div>
                <div className="section-eyebrow">About DevHub</div>
                <h2 className="section-title">
                  A <span className="accent">developer-first</span> platform that fixes the knowledge chaos
                </h2>
                <p className="section-desc">
                  DevHub is a centralized workspace built for engineers who are tired of hunting across twelve browser tabs for that one snippet they wrote three sprints ago.
                </p>
                <p className="section-desc" style={{ marginTop: '-1.5rem' }}>
                  It gives you a private knowledge vault and a public developer identity finally, in one place.
                </p>
              </div>

              <div>
                <ul className="problem-list">
                  <li className="problem-item">
                    <div className="problem-num">01</div>
                    <div className="problem-text">
                      <strong>The chaos of scattered tools</strong>
                      <p>Gists, bookmarks, Notion pages, Slack messages your knowledge is everywhere except where you need it.</p>
                    </div>
                  </li>
                  <li className="problem-item">
                    <div className="problem-num">02</div>
                    <div className="problem-text">
                      <strong>Search friction kills sprints</strong>
                      <p>Hunting for a specific API pattern you wrote 6 weeks ago derails focus and bleeds hours from your week.</p>
                    </div>
                  </li>
                  <li className="problem-item">
                    <div className="problem-num">03</div>
                    <div className="problem-text">
                      <strong>No unified coding identity</strong>
                      <p>Your best solutions stay locked in private repos. The community never sees your expertise and you can't build on theirs.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="principles-section">
          <div className="section-inner">
            <div className="section-eyebrow">Design principles</div>
            <p className="principles-text">
              Based on how <span className="hl">real developers actually work</span>, three principles shape every decision in DevHub. Together they ensure every interaction stays out of your way.
            </p>

            <div className="principles-cards">
              <div className="principle-card">
                <div className="principle-icon">⚡</div>
                <div className="principle-num">01</div>
                <div className="principle-name">Speed</div>
                <div className="principle-desc">
                  Every action is optimized for keyboard-first, friction free input. Save a snippet in under 5 seconds. Find it in under 2.
                </div>
              </div>
              <div className="principle-card">
                <div className="principle-icon">🔒</div>
                <div className="principle-num">02</div>
                <div className="principle-name">Control</div>
                <div className="principle-desc">
                  You decide what's private and what's public, per asset, with one toggle. No complex permission systems, no guessing.
                </div>
              </div>
              <div className="principle-card">
                <div className="principle-icon">🌐</div>
                <div className="principle-num">03</div>
                <div className="principle-name">Discovery</div>
                <div className="principle-desc">
                  A living community feed of curated developer knowledge. Find solutions peers already built, before you reinvent the wheel.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features">
          <div className="section-inner">
            <div className="section-eyebrow">Key features</div>
            <h2 className="section-title">
              Everything a developer's brain <span className="accent">actually needs</span>
            </h2>
            <p className="section-desc">
              Built by developers who got fed up with the same friction every team faces. No fluff only the tools that matter during a real sprint.
            </p>

            <div className="features-grid">
              <div className="feature-block">
                <div className="feature-icon-box">🔀</div>
                <div className="feature-title">Dual mode workspace</div>
                <div className="feature-desc">
                  Private and public exist side by side. Internal credentials and rough drafts stay locked. Polished tutorials and API references get published to your profile one toggle, zero friction.
                </div>
                <div className="feature-badge">Private / Public toggle</div>
              </div>

              <div className="feature-block">
                <div className="feature-icon-box">👥</div>
                <div className="feature-title">Peer discovery</div>
                <div className="feature-desc">
                  Browse the public repositories, notes, and curated snippets of other DevHub members. If someone already solved the architecture problem you're facing, find it in seconds.
                </div>
                <div className="feature-badge">Community feed</div>
              </div>

              <div className="feature-block">
                <div className="feature-icon-box">⚡</div>
                <div className="feature-title">Instant snippet &amp; resource search</div>
                <div className="feature-desc">
                  Tag by language, framework, or custom labels. Full text search across all your code blocks, bookmarks, and technical notes returns results before you finish typing.
                </div>
                <div className="feature-badge">Sub second search</div>
              </div>

              <div className="feature-block">
                <div className="feature-icon-box">🪪</div>
                <div className="feature-title">Public developer profile</div>
                <div className="feature-desc">
                  Your DevHub profile becomes your living technical portfolio a curated view of your published knowledge, organized by topic, shareable with any recruiter or collaborator.
                </div>
                <div className="feature-badge">Shareable identity</div>
              </div>
            </div>
          </div>
        </section>

        <div className="stats-bar">
          <div className="stats-inner">
            <div className="stat-block">
              <div className="stat-num">12<span>x</span></div>
              <div className="stat-label">Faster snippet retrieval vs. bookmarks</div>
            </div>
            <div className="stat-block">
              <div className="stat-num">3<span>h</span></div>
              <div className="stat-label">Average time saved per developer weekly</div>
            </div>
            <div className="stat-block">
              <div className="stat-num">1<span>tap</span></div>
              <div className="stat-label">To publish any asset to your public feed</div>
            </div>
            <div className="stat-block">
              <div className="stat-num">∞</div>
              <div className="stat-label">Private snippets, notes &amp; resources stored</div>
            </div>
          </div>
        </div>

        <section>
          <div className="section-inner quote-section">
            <blockquote>
              "Good tooling doesn't just look right <br />
              it makes the <span className="hl">right things effortless.</span>"
            </blockquote>
            <div className="quote-meta">
              <div className="quote-avatar">L</div>
              <div>
                <div className="quote-name">Laraib</div>
                <div className="quote-role">DevHub Developer</div>
              </div>
            </div>
          </div>
        </section>

        <section id="get-started" className="cta-section">
          <div className="section-inner">
            <div className="section-eyebrow">Get started today</div>
            <h2>
              Your code knowledge,<br /><span className="accent">finally under control.</span>
            </h2>
            <p>Free to start. No credit card. Your first 500 snippets are on us.</p>
          
            <div className="cta-btns">
           <Link to="/signup" className="btn-cta-primary">
           Create your DevHub
           </Link>
           <a href="#about" className="btn-cta-ghost">
            Learn More
           </a>

          </div>
          </div>
        </section>

      </div>

      <footer>
        <div className="footer-brand">
          <div className="logo-mark" style={{ width: '20px', height: '20px', fontSize: '9px', borderRadius: '4px' }}>DH</div>
          DevHub © 2026
        </div>
        <ul className="footer-links">
          <li><a href="#">Docs</a></li>
          <li><a href="#">API</a></li>
          <li><a href="#">Changelog</a></li>
          <li><a href="#">Community</a></li>
          <li><a href="#">Privacy</a></li>
        </ul>
        <div className="footer-copy">Designed &amp; Developed by Laraib.</div>
      </footer>
    </>
  );
}