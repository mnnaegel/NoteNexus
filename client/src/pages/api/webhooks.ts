import type { IncomingHttpHeaders } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { WebhookRequiredHeaders } from 'svix';
import type { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from 'svix';
 
const webhookSecret: string = "whsec_bjiuoAeaD906dzq7XAAWb2UTOGFg/msL"
 
export default async function handler(
  req: NextApiRequestWithSvixRequiredHeaders,
  res: NextApiResponse
) {
  console.log('hit webhook');
  const payload = JSON.stringify(req.body);
  const headers = req.headers;
  // Create a new Webhook instance with your webhook secret
  const wh = new Webhook(webhookSecret);
 
  let evt: WebhookEvent;
  try {
    // Verify the webhook payload and headers
    evt = wh.verify(payload, headers) as WebhookEvent;
  } catch (_) {
    // If the verification fails, return a 400 error
    return res.status(400).json({});
  }
  const { id } = evt.data;
 
  const eventType = evt.type;
  if (eventType === 'user.created') {
    console.log(`User ${id} was ${eventType}`);

     // Make the HTTP POST request to insert a user
     const response = await fetch('http://localhost:8080/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Id: id,
        Name: "tmp",
        Email: evt.data.primary_email_address_id
      })
    });

    if (!response.ok) {
      console.error(`Error creating user: ${response.statusText}`);
      return res.status(500).json({ error: 'Failed to create user' });
    }

    console.log(response)
    return res.status(201).json({});
    res.status(201).json({});
  } else {
    console.log(`${eventType} is not supported`);
    res.status(200).json({});
  }
}
 
type NextApiRequestWithSvixRequiredHeaders = NextApiRequest & {
  headers: IncomingHttpHeaders & WebhookRequiredHeaders;
};