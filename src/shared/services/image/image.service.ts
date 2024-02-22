import { AxiosError } from 'axios';
import { Buffer } from 'buffer';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError } from 'rxjs';

@Injectable()
export class ImageService {
    constructor(private httpService: HttpService) { }

    uploadPicture(image: any) {
        const formData = new FormData();
        const image64 = Buffer.from(image?.buffer, 'binary').toString(
            'base64');
        formData.append('image', `${image64}`);
        return this.httpService.post('https://api.imgbb.com/1/upload?key=7ef53bd714600d800c0dcb2262db5da2', formData).pipe(
            catchError((error: AxiosError) => {
                console.error(error.response.data);
                throw 'An error happened!';
            }),
        );
    }
}
