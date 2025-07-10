import { Module } from '@nestjs/common';
import { ImageProxyService } from './image-proxy.service';
import { ImageProxyController } from './image-proxy.controller';

@Module({
  controllers: [ImageProxyController],
  providers: [ImageProxyService],
})
export class ImageProxyModule {}
