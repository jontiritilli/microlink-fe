// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type Data = {
  shortUrl: Record<string, string>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    const response = await axios.post(`https://microlink-n6adm7jnaq-uc.a.run.app/url/shorten`, {
      longUrl: req.body.longUrl,
    });
    res.status(200).json({ shortUrl: response.data.shortUrl || `` });
  } catch (error: any) {
    res.status(error.status || 500).end(error);
  }
}
