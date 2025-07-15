/* eslint-disable prettier/prettier */
import React from 'react';

function HelpAndSupport() {
  const keyframes = `
    @keyframes bgMove {
      0% { background-position: 0% 50%; }
      100% { background-position: 100% 50%; }
    }

    @keyframes slideFadeIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `

  return (
    <>
      <style>{keyframes}</style>

      <div className="d-flex justify-content-center align-items-center" style={{ height: '600px' }}>
        <div
          className="card text-center p-4"
          style={{
            maxWidth: '500px',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            opacity: 0,
            transform: 'translateY(30px)',
            animation: 'slideFadeIn 1.2s ease-out forwards',
            backgroundColor: '#fff',
          }}
        >
          <i
            className="bi bi-tools text-primary"
            style={{
              fontSize: '3rem',
              animation: 'bounce 2s infinite',
            }}
          ></i>
          <h1 className="mt-3 mb-2 fw-bold text-dark">Coming Soon</h1>
          <h5 className="text-muted mb-3">Ticket Raised</h5>
          <p className="text-secondary">
            This feature is <strong>coming soon</strong>.<br />
            We're working hard to improve your support experience.
          </p>
          <button className="btn btn-primary mt-3" disabled>
            Launching Soon
          </button>
        </div>
      </div>
    </>
  )
}

export default HelpAndSupport;
