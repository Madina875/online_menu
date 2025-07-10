import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';

@Controller('proxy')
export class ImageProxyController {
  @Get('*path')
  async proxy(@Req() req: Request, @Res() res: Response) {
    const targetUrl = req.originalUrl.replace('/api/proxy/', '');

    if (!targetUrl.startsWith('http')) {
      return res.status(400).send('❌ Invalid image URL');
    }

    try {
      const response = await axios.get(targetUrl, { responseType: 'stream' });
      res.setHeader('Content-Type', response.headers['content-type']);
      response.data.pipe(res);
    } catch (err) {
      console.error('❌ Error proxying image:', err.message);
      res.status(500).send('❌ Failed to fetch image');
    }
  }
}
