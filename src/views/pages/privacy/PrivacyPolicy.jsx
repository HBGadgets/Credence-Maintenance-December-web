import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../../assets/brand/fmslogo.svg'
import './PrivacyPolicy.css'

const sections = [
  { id: 'scope', label: '1. Scope and Application' },
  { id: 'data-collected', label: '2. Information We Collect' },
  { id: 'operational-use', label: '3. How Data Is Used' },
  { id: 'retention-ledger', label: '4. Retention Ledger' },
  { id: 'security', label: '5. Security and Access Control' },
  { id: 'third-parties', label: '6. Third-Party Integrations' },
  { id: 'user-rights', label: '7. Your Rights and Choices' },
  { id: 'contact', label: '8. Contact and Grievance' },
]

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('scope')

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200
      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="privacy-page">
      <header className="privacy-nav">
        <div className="privacy-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/login" className="privacy-brand-link">
            <img src={logo} alt="FMS Driver" className="privacy-brand-logo" />
            <span className="privacy-brand-title">FMS Driver</span>
          </Link>
          <div className="privacy-nav-actions">
            <button type="button" onClick={handlePrint} className="privacy-button">
              Print policy
            </button>
            <Link to="/login" className="privacy-button privacy-button-primary">
              Return to login
            </Link>
          </div>
        </div>
      </header>

      <section className="privacy-hero">
        <div className="privacy-container">
          <h1 className="privacy-hero-headline">Privacy Policy</h1>
          <p className="privacy-hero-sentence">
            How FMS Driver collects, protects, and handles operational records.
          </p>
          <div className="privacy-hero-meta">
            <div className="privacy-meta-badge privacy-meta-badge-green">
              <span>Active policy</span>
            </div>
            <div className="privacy-meta-badge">
              <span>Effective:</span>
              <span className="privacy-mono-text">2026-10-31</span>
            </div>
            <div className="privacy-meta-badge">
              <span>Version:</span>
              <span className="privacy-mono-text">v2.4.0</span>
            </div>
            <div className="privacy-meta-badge">
              <span>System:</span>
              <span>Fleet Operations</span>
            </div>
          </div>
        </div>
      </section>

      <main className="privacy-container">
        <div className="privacy-main-grid">
          <aside className="privacy-sidebar" aria-label="Policy Table of Contents">
            <div className="privacy-sidebar-heading">Navigation index</div>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`privacy-nav-link ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </a>
            ))}
          </aside>

          <div className="privacy-content-column">
            <section id="scope" className="privacy-section">
              <h2 className="privacy-section-title">1. Scope and Application</h2>
              <p className="privacy-paragraph">
                This Privacy Policy describes the policies and practices of FMS Driver (“Credence FMS”, “we”, “us”, or “our”) regarding the collection, processing, storage, and transfer of personal, vehicular, and operational data through our web platform and related backend endpoints.
              </p>
              <p className="privacy-paragraph">
                This policy applies to all registered enterprise clients, logistics coordinators, supervisors, drivers, transport operators, warehouse personnel, and visitors who access or interact with any section of the platform.
              </p>
            </section>

            <section id="data-collected" className="privacy-section">
              <h2 className="privacy-section-title">2. Information We Collect</h2>
              <p className="privacy-paragraph">
                FMS Driver collects only data strictly required to deliver vehicle dispatching, maintenance scheduling, logistics tracking, and regulatory audit compliance.
              </p>
              <div className="privacy-ledger-card">
                <h3 className="privacy-subheading">Primary information streams</h3>
                <ul className="privacy-list">
                  <li>
                    <strong>Account and credential details:</strong> Full name, corporate username, encrypted authentication hashes, contact email, phone number, and worker role permissions.
                  </li>
                  <li>
                    <strong>Vehicle asset telematics:</strong> Vehicle registration number, Vehicle Identification Number (VIN), engine runtime hours, odometer readings, fuel consumption levels, and tyre wear metrics.
                  </li>
                  <li>
                    <strong>Trip and geolocation telemetry:</strong> Live GPS coordinates recorded exclusively during active trip assignments, route departure and arrival timestamps, rail/road goods receipts, and intermediate checkpost validations.
                  </li>
                  <li>
                    <strong>Maintenance and inspection documentation:</strong> Pre-trip vehicle inspection forms, service invoices, roadside assistance call logs, and incident reports.
                  </li>
                  <li>
                    <strong>System security metadata:</strong> Browser type, operating system version, session tokens (<span className="privacy-mono-text">crdnsMaintToken</span>), IP address, and authenticated API transaction logs.
                  </li>
                </ul>
              </div>
            </section>

            <section id="operational-use" className="privacy-section">
              <h2 className="privacy-section-title">3. How Data Is Used</h2>
              <p className="privacy-paragraph">
                All data recorded in FMS Driver is processed under legitimate commercial and regulatory interests. We do not engage in consumer data profiling or targeted behavioral advertising.
              </p>
              <ul className="privacy-list">
                <li>Dispatch coordination, trip routing, and logistical scheduling across regional hubs.</li>
                <li>Preventative maintenance monitoring to detect vehicular component failure before roadside breakdown.</li>
                <li>Driver duty-of-care verification and adherence to statutory driving-hour regulations.</li>
                <li>Accurate verification of fuel allocations, tyre inventory, and maintenance expense claims.</li>
                <li>Enforcement of role-based authorization ensuring sensitive records are accessible solely to permitted supervisors and administrators.</li>
              </ul>
            </section>

            <section id="retention-ledger" className="privacy-section">
              <h2 className="privacy-section-title">4. Retention Ledger</h2>
              <p className="privacy-paragraph">
                In compliance with commercial transport laws and standard audit guidelines, records are retained according to the following retention schedule:
              </p>
              <div className="privacy-table-wrapper">
                <table className="privacy-table">
                  <thead>
                    <tr>
                      <th>Data Category</th>
                      <th>Primary Records</th>
                      <th>Retention Period</th>
                      <th>Scheduled Disposal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Active Telematics</strong></td>
                      <td>GPS coordinates, speed, route points</td>
                      <td className="privacy-mono-text">12 months</td>
                      <td>Aggregated or purged annually</td>
                    </tr>
                    <tr>
                      <td><strong>Trip &amp; Consignment</strong></td>
                      <td>Daily trip sheets, goods receipts (GR)</td>
                      <td className="privacy-mono-text">3 years</td>
                      <td>Permanent cryptographic archival</td>
                    </tr>
                    <tr>
                      <td><strong>Maintenance History</strong></td>
                      <td>Part replacements, tyre logs, inspections</td>
                      <td className="privacy-mono-text">Asset lifecycle</td>
                      <td>Retained until vehicle decommission</td>
                    </tr>
                    <tr>
                      <td><strong>Financial &amp; Expense</strong></td>
                      <td>Fuel bills, driver expense slips, LR notes</td>
                      <td className="privacy-mono-text">7 years</td>
                      <td>Statutory tax and audit expiration</td>
                    </tr>
                    <tr>
                      <td><strong>User Accounts</strong></td>
                      <td>Worker profiles, contact data, auth logs</td>
                      <td className="privacy-mono-text">Duration of employment</td>
                      <td>De-identified 90 days after departure</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="security" className="privacy-section">
              <h2 className="privacy-section-title">5. Security and Access Control</h2>
              <p className="privacy-paragraph">
                FMS Driver implements defense-in-depth security architectures to ensure enterprise fleet records remain intact, confidential, and resilient against unauthorized interference.
              </p>
              <div className="privacy-ledger-card">
                <ul className="privacy-list">
                  <li>
                    <strong>Encryption standards:</strong> All network communication is mandated through TLS 1.3 encryption. Data stored at rest is secured using AES-256 standards.
                  </li>
                  <li>
                    <strong>Granular role-based access:</strong> Access permissions are segmented between Superadmin, Supervisor, and Worker roles, strictly restricting visibility to authorized entities.
                  </li>
                  <li>
                    <strong>Token management:</strong> Session keys are distributed using authenticated tokens and secured cookie attributes, eliminating plaintext password persistence.
                  </li>
                  <li>
                    <strong>Tamper-evident audit logging:</strong> All modifications to vehicle documents, driver permissions, and financial approvals record timestamps and originating operator IDs.
                  </li>
                </ul>
              </div>
            </section>

            <section id="third-parties" className="privacy-section">
              <h2 className="privacy-section-title">6. Third-Party Integrations</h2>
              <p className="privacy-paragraph">
                We partner with dedicated third-party infrastructure providers to enable core application services. Each service provider is bound by strict confidentiality and data protection agreements:
              </p>
              <ul className="privacy-list">
                <li>
                  <strong>Geospatial services:</strong> Mapping and tile rendering (Google Maps API, Leaflet OpenStreetMap) to display visual routes and vehicle locations.
                </li>
                <li>
                  <strong>Real-time communication:</strong> WebSocket protocols for live dashboard notifications, alert broadcasts, and active fleet status changes.
                </li>
                <li>
                  <strong>Document generation utilities:</strong> Client-side PDF and Excel export libraries executing securely in the user browser without transmitting export content to third-party endpoints.
                </li>
              </ul>
              <p className="privacy-paragraph">
                FMS Driver never sells, monetizes, or leases client fleet records or driver telemetry to third-party advertisers or data brokers.
              </p>
            </section>

            <section id="user-rights" className="privacy-section">
              <h2 className="privacy-section-title">7. Your Rights and Choices</h2>
              <p className="privacy-paragraph">
                Depending on your jurisdiction and operational status, you possess defined rights regarding your stored personal and professional data:
              </p>
              <ul className="privacy-list">
                <li>
                  <strong>Right of access:</strong> You may request an export of your personal profile, logged trips, and vehicle assignments.
                </li>
                <li>
                  <strong>Right of rectification:</strong> You may request immediate correction of inaccurate contact information, license records, or identity documents.
                </li>
                <li>
                  <strong>Right to restriction:</strong> In cases of disputed records, you may request processing restrictions pending administrative review.
                </li>
                <li>
                  <strong>Right of erasure:</strong> You may request deactivation and deletion of personal profile data, subject to mandatory transport retention laws.
                </li>
              </ul>
            </section>

            <section id="contact" className="privacy-section">
              <h2 className="privacy-section-title">8. Contact and Grievance</h2>
              <p className="privacy-paragraph">
                If you have questions, regulatory inquiries, or wish to exercise data subject rights concerning this Privacy Policy, contact our designated privacy compliance team:
              </p>
              <div className="privacy-contact-box">
                <div>
                  <strong>Data Privacy Officer:</strong> Credence Fleet Management Compliance Desk
                </div>
                <div>
                  <strong>Inquiry email:</strong>{' '}
                  <a href="mailto:privacy@credencefms.com" className="privacy-footer-link">
                    privacy@credencefms.com
                  </a>
                </div>
                <div>
                  <strong>Technical support:</strong>{' '}
                  <a href="mailto:support@credencetracker.com" className="privacy-footer-link">
                    support@credencetracker.com
                  </a>
                </div>
                <div>
                  <strong>Resolution commitment:</strong> Formal acknowledgment within 24 hours, resolution within 14 business days.
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="privacy-footer">
        <div className="privacy-container privacy-footer-inner">
          <div>
            <span>&copy; {new Date().getFullYear()} Credence FMS · Fleet Operations</span>
          </div>
          <div className="privacy-footer-links">
            <Link to="/privacy-policy" className="privacy-footer-link">
              Privacy Policy
            </Link>
            <Link to="/login" className="privacy-footer-link">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PrivacyPolicy
