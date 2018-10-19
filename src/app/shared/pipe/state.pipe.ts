import {Pipe, PipeTransform} from '@angular/core';
import {RzhtoolsService} from "../../core/services/rzhtools.service";

@Pipe({
  name: 'state'
})
export class StatePipe implements PipeTransform {

  constructor(public tools: RzhtoolsService) {
  }

  transform(value: any, num: number): any {
    let _this = this;
    return _this.tools.getEnumDataValByKey(num, value);

  }

}
