import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia'
})

export async function createOrRetrieveCustomer(
  agencyId: string,
  email: string,
  name: string
) {
  // Cerca se esiste già un customer con questo agencyId nei metadata
  const existing = await stripe.customers.search({
    query: `metadata['agency_id']:'${agencyId}'`
  })

  if (existing.data.length > 0) return existing.data[0]

  // Altrimenti crea nuovo customer
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      agency_id: agencyId,
      project: 'leadhub'
    }
  })

  return customer
}

export async function createCheckoutSession(
  customerId: string,
  agencyId: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1
      }
    ],
    metadata: {
      agency_id: agencyId,
      project: 'leadhub',
      type: 'abbonamento_mensile'
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription-success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription-required`
  })

  return session
}
