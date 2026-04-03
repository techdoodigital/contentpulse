import Stripe from "stripe";

// Lazy-initialize to avoid crashing at build time when key is not set
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        "STRIPE_SECRET_KEY is not set. Configure it in .env to use billing features."
      );
    }
    _stripe = new Stripe(key, { typescript: true });
  }
  return _stripe;
}

// Keep backward-compatible export (throws at call time, not import time)
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
