import {Route, CanLoad, Router} from "@angular/router";
import {Injectable} from "@angular/core";

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
    canLoadChildren(menu:Array<any>, route): boolean {
        let  rel:boolean = false;
        menu.forEach((item) =>{
            if ( route.path.indexOf(item.link)  ==  0)rel = true;
        });
        return rel;
    }
}

@Injectable()
export class CanLoadPokemon implements CanLoad {

    constructor(public permissions: Permissions, public router: Router) {}

    canLoad(route:Route): boolean {
        if(!this.permissions.canLoadChildren(Menu,route) ){
            this.router.navigate(['/home']);
        }
        return this.permissions.canLoadChildren(Menu,route);
    }

}