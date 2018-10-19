import { Pipe, PipeTransform } from '@angular/core';
import {isNullOrUndefined} from "util";

@Pipe({
  name: 'questionSplit'
})
export class QuestionSplitPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    value=value?value:'';
    let arr=value.split('#||#'),result:string='';
    if(!args){
      for(let i=0;i<arr.length;i++){
        if(i==0){
          result+='<p style="font-weight: bold">'+arr[i]+'</p>'
        }else {
          result+='<p>'+arr[i]+'</p>';
        }
      }
      return result;
    }else{            //如果是打星的话只要第一个
      for(let i=0;i<arr.length;i++){
        if(i==0){
          result+='<p style="font-weight: bold">'+arr[i]+'</p>'
        }
      }
      return result;
    }

  }

}
