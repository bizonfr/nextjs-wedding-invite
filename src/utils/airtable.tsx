import Airtable from 'airtable'
import { Invite } from '../../types/invite'

// Verify environment variables
if (!process.env.NEXT_PUBLIC_AIRTABLE_API_KEY || !process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID) {
  console.log(process.env)
  throw new Error('Environment variables AIRTABLE_ACCESS_TOKEN or AIRTABLE_BASE_ID are not set')
}

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY
});

var base = Airtable.base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID);

// Define a function to get an invite by code
export async function getInvite(inviteCode: string): Promise<Invite> {
  try {
    // Run a query on the `invites` table with filterByFormula
    const records = await base('invites')
      .select({
        filterByFormula: `{invite} = "${inviteCode}"`,
        maxRecords: 1,
      })
      .firstPage()

    // Error if no records were found
    if (!records || records.length === 0) {
      throw new Error('Invite not found')
    }

    // Map the result to an Invite object
    const record = records[0]
    return {
      code: String(record.fields.invite),
      name: String(record.fields.name),
      coming:
        typeof record.fields.coming === 'undefined'
          ? undefined
          : record.fields.coming === 'yes',
    }
  } catch (error) {
    console.error('Error fetching invite:', error)
    throw error
  }
}