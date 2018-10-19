import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

/**
 * 视频路径截取的管道，后台返回的是html
 */
@Pipe({
  name: 'videoSrc'
})
export class VideoSrcPipe implements PipeTransform {

  constructor(public  sanitizer: DomSanitizer){}

  transform(value: any, args?: any): any {
    let result=this.sanitizer.bypassSecurityTrustResourceUrl(value.split("'")[3]);
    return result;
  }

}
