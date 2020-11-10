import { Component } from '@angular/core';
import { NavController, IonicPage, LoadingController, ToastController } from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  creds: CredenciaisDTO = {
    email: "",
    senha: ""
  };
  private loading: any;

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public auth: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
   
    ) {

  }

  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }

  ionViewDidEnter() {
    this.auth.refreshToken()
      .subscribe(response => {
        this.auth.successfulLogin(response.headers.get('Authorization'));
        this.navCtrl.setRoot('CategoriasPage');
      },
        error => { });
  }

  async login() {
    this.presentLoading();
    try {

      //Autentica pelo firebase
      
      await this.auth.autenticarPeloFirebase(this.creds);

     //Autentica pela api rest 
      this.auth.authenticate(this.creds)
      .subscribe(response => {
        this.auth.successfulLogin(response.headers.get('Authorization'));
        this.navCtrl.setRoot('CategoriasPage');
      },
      error => {});  

    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          error.message = 'E-mail não encontrado.';
          break;

          case 'auth/user-disabled':
          error.message = 'Este usuário foi desabilitado. Entre em contato com o suporte.';
          break;
      }
      this.presentToast(error.message);
    } finally {
      this.loading.dismiss();
    }
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: "Aguarde...",
    });
    this.loading.present();
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
}
