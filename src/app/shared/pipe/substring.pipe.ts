import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'substring'
})
//截取字符串
export class SubstringPipe implements PipeTransform {
    transform(value: string, length: Array<number>): any {
        return value.toString().substr(length[0], length[1]);
    }
}
