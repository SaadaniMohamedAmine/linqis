import Stripe from "stripe";

// Next.js imports every route module during build-time page-data
// collection, even ones that never execute -- constructing the client
// eagerly here (as the Stripe/Next.js quickstart typically shows) means a
// missing STRIPE_SECRET_KEY fails the ENTIRE deploy, not just billing.
// Deferring construction to first real use keeps the build resilient to a
// not-yet-configured env var while every call site still just does
// `stripe.customers.create(...)` etc. unchanged.
let client: Stripe | null = null;

function getClient(): Stripe {
  if (!client) {
    client = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-07-29.dahlia", // matches the installed `stripe` package version
    });
  }
  return client;
}

export const stripe = new Proxy({} as Stripe, {
  // Default receiver (the real client, not this proxy) so any internal
  // `this` usage inside the SDK's resources resolves correctly.
  get(_target, prop) {
    return Reflect.get(getClient(), prop);
  },
});
