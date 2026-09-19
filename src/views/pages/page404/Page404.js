import React from "react";
import { Ghost, Home, ArrowRight } from "lucide-react";
import "./page404.css"; // Import custom CSS file

const Page404 = ({
  title = 'Page Not Found',
  statusCode = '404',
  message = "Oops! It seems like you've ventured into uncharted territory. The page you're looking for might have moved or doesn't exist.",
}) => {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ marginTop: '65px' }}>
      <div className="text-center">
        {/* Ghost Animation */}
        <div className="position-relative mb-4">
          <Ghost className="ghost-icon text-primary" />
          <div className="shadow-circle"></div>
        </div>

        {/* Error Message */}
        <h1 className="display-4 fw-bold text-primary mb-2">{title}</h1>
        {statusCode && <h2 className="fs-4 fw-semibold text-dark mb-3">Error ({statusCode})</h2>}
        <p className="text-muted mb-4" style={{ maxWidth: '500px', margin: '0 auto' }}>
          {message}
        </p>

        {/* Action Buttons */}
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <a href="/" className="btn btn-primary d-flex align-items-center justify-content-center">
            <Home className="me-2" size={18} />
            Back to Home
          </a>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
          >
            Retry / Refresh
            <ArrowRight className="ms-2" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page404;
