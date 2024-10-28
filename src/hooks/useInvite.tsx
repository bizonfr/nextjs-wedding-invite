import { useState, useEffect } from 'react'
import { InviteResponse } from '../../types/invite'

// Helper function to fetch invite data
async function fetchInvite(code: string): Promise<InviteResponse> {
  const requestUrl = `/api/invite?code=${encodeURIComponent(code)}`
  const response = await fetch(requestUrl)

  if (!response.ok) {
    throw new Error('Invalid code')
  }

  return response.json()
}

// Custom hook
export default function useInvite(): [InviteResponse | null, string | null] {
  const [inviteResponse, setInviteResponse] = useState(null) // Type inferred as InviteResponse | null
  const [error, setError] = useState(null) // Type inferred as string | null

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      const code = url.searchParams.get('code')

      console.log(code);
      if (!code) {
        setError('No code provided')
      } else {
        fetchInvite(code)
          .then(setInviteResponse)
          .catch((err) => setError(err.message))
      }
    }
  }, [])

  return [inviteResponse, error]
}