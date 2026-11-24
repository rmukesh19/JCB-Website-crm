import helmet from 'helmet';

/**
 * Enterprise Strict Security Middleware using Helmet
 * 
 * Enforces production-grade Content Security Policy (CSP),
 * HTTP Strict Transport Security (HSTS), Clickjacking prevention,
 * MIME-type sniffing prevention, and cross-origin resource isolation.
 */
export const configureEnterpriseSecurity = () => {
  return helmet({
    // Content Security Policy: Whitelist only sanctioned origins for scripts, styles, fonts, connections & images
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'", // required for single-page app inline boots & theme switches
          "'unsafe-eval'",   // required for dynamic charting engines
          "https://cdn.jsdelivr.net"
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'", // Tailwind utility and theme variable injection
          "https://fonts.googleapis.com"
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "data:"
        ],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https://*.whatsapp.net",
          "https://*.fbcdn.net",
          "https://images.unsplash.com",
          "https://*.googleusercontent.com"
        ],
        connectSrc: [
          "'self'",
          "https://*.jcb360.in",
          "https://*.mmenterprises.in",
          "https://graph.facebook.com",
          "ws:",
          "wss:"
        ],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"]
      }
    },

    // HTTP Strict Transport Security: Force HTTPS for 1 year with subdomains and HSTS preload list eligibility
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },

    // X-Frame-Options: Prevent Clickjacking attacks
    frameguard: {
      action: 'deny'
    },

    // X-Content-Type-Options: Prevent MIME sniffing exploits
    noSniff: true,

    // Referrer-Policy: Protect sensitive token/route information in outbound HTTP referrers
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin'
    },

    // Cross-Origin Resource Policy: Allow safe asset sharing across API and client
    crossOriginResourcePolicy: {
      policy: 'cross-origin'
    },

    // Cross-Origin Opener Policy: Isolate browsing contexts while allowing OAuth / WhatsApp popups
    crossOriginOpenerPolicy: {
      policy: 'same-origin-allow-popups'
    },

    // Cross-Origin Embedder Policy: Disabled to allow loading external images/avatars without COEP failures
    crossOriginEmbedderPolicy: false,

    // DNS Prefetch Control: Prevent malicious DNS resolution spoofing
    dnsPrefetchControl: {
      allow: false
    },

    // Hide X-Powered-By Express signature to prevent targeted framework exploits
    hidePoweredBy: true,

    // X-Permitted-Cross-Domain-Policies: Disallow Adobe Flash/Acrobat cross-domain leaks
    permittedCrossDomainPolicies: {
      permittedPolicies: 'none'
    }
  });
};

export default configureEnterpriseSecurity;
