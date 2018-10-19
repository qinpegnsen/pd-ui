import { Pipe, PipeTransform } from '@angular/core';
import * as momentDate from 'moment';
@Pipe({
  name: 'moment'   //angular date 短管道在ie 和 edge 有兼容性问题（因为ie对字符串课格式要求严格，没有chrome灵活）
})
export class MomentPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return  momentDate(value).format(args);
  }

}
