import { CanActivate } from '@angular/router'
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Nav } from 'ionic-angular';

@Injectable()
export class AuthGuard implements CanActivate {
    private nav: Nav;
    constructor (private authService: AuthService){

    }

    canActivate(): Promise<boolean> {
        return new Promise(resolve => {
            this.authService.getAuth().onAuthStateChanged(user => {
                if (!user) this.nav.setRoot('HomePage');
                resolve(user ? true : false);
            })
        })
    }

    
}