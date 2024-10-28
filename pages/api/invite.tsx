import type { NextApiRequest, NextApiResponse } from 'next'
import { InviteResponse } from '../../types/invite'
import { getInvite } from '../../src/utils/airtable'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InviteResponse | { error: string }>,
) {
  // if the request is not a GET, return an error
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  // if the code is missing we return a 400 error
  if (!req.query.code) {
    return res.status(400).json({ error: 'Missing invite code' })
  }

  // If there are multiple invite codes (?code=x&code=y)
  // we pick the first one and ignore the rest
  const code = Array.isArray(req.query.code)
    ? req.query.code[0]
    : req.query.code

  try {
    // we use our Airtable utility to get the invite data for a given code
    // and return the result to the user
    const invite = await getInvite(code)
    res.status(200).json({ invite })
  } catch (err) {
    // In case of error we return either a 401 or a 500 error:
    // - if the code was not found we return 401
    // - otherwise we return a generic 500 server error
    const e = err as Error
    res
      .status(e.message === 'Invite not found' ? 401 : 500)
      .json({ error: e.message })
  }
}