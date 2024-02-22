import { HttpModule } from '@nestjs/axios';
import { ImageService } from './services/image/image.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [HttpModule],
    providers: [ImageService],
    exports: [ImageService]
})
export class SharedModule { }
