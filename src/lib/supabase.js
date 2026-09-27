const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '')
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey)

function requireConfig() {
  if (!supabaseConfigured) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local.')
  }
}

async function request(path, options = {}) {
  requireConfig()

  const response = await fetch(`${supabaseUrl}${path}`, {
    ...options,
    headers: {
      apikey: supabaseKey,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    let message = 'Supabase request failed.'
    try {
      const body = await response.json()
      message = body.msg || body.message || body.error_description || body.error || message
    } catch {
      // Keep the generic message when the response is not JSON.
    }
    throw new Error(message)
  }

  if (response.status === 204) return null
  return response.json()
}

export function sendEmailOtp(email) {
  return request('/auth/v1/otp', {
    method: 'POST',
    body: JSON.stringify({
      email,
      create_user: true,
    }),
  })
}

export function verifyEmailOtp(email, token) {
  return request('/auth/v1/verify', {
    method: 'POST',
    body: JSON.stringify({
      email,
      token,
      type: 'email',
    }),
  })
}

export function createBooking({ accessToken, name, email, slotDate, slotTime }) {
  return request('/rest/v1/bookings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      name,
      email,
      slot_date: slotDate,
      slot_time: slotTime,
      status: 'confirmed',
    }),
  })
}
