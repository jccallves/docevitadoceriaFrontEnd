import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { API_CONFIG } from "../configs/api.config";
import { LocalUser } from "../models/localUser";
import { StorageService } from "./storage.service";
import { JwtHelper } from 'angular2-jwt';
import { HttpClient } from "@angular/common/http";
import { CartService } from "./domain/cart.service";
import { AngularFireAuth } from '@angular/fire/auth'


@Injectable()
export class AuthService {

    jwtHelper: JwtHelper = new JwtHelper();

    constructor(
        public http: HttpClient, 
        public storage: StorageService,
        public cartService: CartService,
        private authFire: AngularFireAuth) {
    }

    authenticate(creds : CredenciaisDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/login`, 
            creds,
            {
                observe: 'response',
                responseType: 'text'
            });
    }

    refreshToken() {
        return this.http.post(
            `${API_CONFIG.baseUrl}/auth/refresh_token`, 
            {},
            {
                observe: 'response',
                responseType: 'text'
            });
    }

    successfulLogin(authorizationValue : string) {
        let tok = authorizationValue.substring(7);
        let user : LocalUser = {
            token: tok,
            email: this.jwtHelper.decodeToken(tok).sub
        };
        this.storage.setLocalUser(user);
        this.cartService.createOrClearCart();
    }

    logout() {
        this.storage.setLocalUser(null);
    }

    autenticarPeloFirebase (creds : CredenciaisDTO){
        return this.authFire.auth.signInWithEmailAndPassword(creds.email, creds.senha);
    }

    logOut(){

    }

    register(email, senha){
        return this.authFire.auth.createUserWithEmailAndPassword(email, senha);
    }

    getAuth(){
        return this.authFire.auth;
    }
}