import {Injectable} from '@angular/core';
declare var $: any;

@Injectable()
export class MaskService {
  static template: string = `
    <div id="Loading" style="position: fixed;z-index:999;top: 0;left:0;height:100%;width:100%;background-color:rgba(0,0,0,0.6);text-align:center;">
      <div style="display:inline-block;vertical-align: middle;height: 100%;width: 0;border: none;padding: 0;margin: 0;"></div>
      <div class="ball-scale-ripple-multiple" style="margin:0 auto;width:100px;display:inline-block; vertical-align: middle;">
        <img class="loading" width="50px" src="/assets/images/loading.png" style="animation: loading 0.8s linear 0s infinite normal;">
      </div>
    </div>`;

  constructor() {
  }

  static showMask(){
    if($("#Loading").length == 0){
      $(document).find("body").append(this.template);
    }else{
      $("#Loading").show();
    }
  }

  static hideMask(){
    $("#Loading").hide();
  }
}
