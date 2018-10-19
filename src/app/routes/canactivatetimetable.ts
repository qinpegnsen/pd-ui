import {Injectable} from "@angular/core";
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";

export const Menu = [
    {
        text: 'Home',
        link: 'home',
        icon: 'icon-home'
    },
    {
        text: 'Timetable',
        link: 'timetable',
        icon: 'icon-home',
    }
];
export class Permissions {
    canActivate(menu:Array<any>, route): boolean {
        return true;
        // let  rel:boolean = false;
        // menu.forEach((item) =>{
        //     if ( route.path.indexOf(item.link)  ==  0)rel = true;
        // });
        // return rel;
    }
}

@Injectable()
export class CanActivateTeam implements CanActivate {
    constructor(public permissions: Permissions) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {

        return this.permissions.canActivate(Menu, state);
    }
}
