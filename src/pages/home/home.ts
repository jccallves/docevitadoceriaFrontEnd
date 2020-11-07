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
    private toastCtrl: ToastController) {

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
      await this.auth.autenticarPeloFirebase(this.creds);
    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          error.message = 'E-mail não encontrado. Verifique se digitou o email correto.';
          break;
      }
      this.presentToast(error.message);
    } finally {
      this.loading.dismiss();
    }

    //this.auth.autenticarPeloFirebase(this.creds);
    /* this.auth.authenticate(this.creds)
      .subscribe(response => {
        this.auth.successfulLogin(response.headers.get('Authorization'));
        this.navCtrl.setRoot('CategoriasPage');
      },
      error => {});    */
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
