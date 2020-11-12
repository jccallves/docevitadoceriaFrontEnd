import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as firebase from 'firebase';
import { SplashScreen } from '@ionic-native/splash-screen';



/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClienteDTO;
  picture: string;
  cameraOn: boolean = false;
  selectedFile = null;
  private loading: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageService,
    public clienteService: ClienteService, public camera: Camera, private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public platform: Platform, public splashscreen: SplashScreen
  ) {
  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData() {
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.email) {
      this.clienteService.findByEmail(localUser.email)
        .subscribe(response => {
          this.cliente = response as ClienteDTO;
          this.getImageIfExists();
        },
          error => {
            if (error.status == 403) {
              this.navCtrl.setRoot('HomePage');
            }
          });
    }
    else {
      this.navCtrl.setRoot('HomePage');
    }
  }

  getImageIfExists() {
    this.getImageFromFirestore();
    this.clienteService.getImageFromBucket(this.cliente.id)
      .subscribe(response => {
        //this.cliente.imageUrl = `${API_CONFIG.bucketClientes}/cp${this.cliente.id}.jpg`;
      },
        error => { });
  }

  getImageFromFirestore() {
    var storageRef = firebase.storage().ref('clientes/cp' + this.cliente.id);
    //var pathReference = storage.ref('clientes/cp' + this.cliente.id);

    // Get the download URL
    storageRef.getDownloadURL().then(url => {
      this.cliente.imageUrl = url;
    }).catch(function (error) {

      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/object-not-found':
          break;

        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;

        case 'storage/canceled':
          // User canceled the upload
          break;

        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          break;
      }
    });
  }

  getCameraPicture() {

    this.cameraOn = true;
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }
    this.camera.getPicture(options).then((imageData) => {
      this.picture = 'data:image/png;base64,' + imageData;
      this.cameraOn = false;
    }, (err) => {
    });
  }



  async sendPicture() {

    //Armazena arquivo no Firebase Storage
    /* this.clienteService.uploadPictureToFirebaseStorage(this.picture, this.cliente);
    this.loadData(); */
    //Método que salvar o arquivo num caminho definido previamente.
    this.clienteService.uploadPicture(this.picture, this.cliente)
      .subscribe(response => {
        this.picture = null;
        this.presentLoading();
        setTimeout(() => {
          this.loadData();
          this.loading.dismiss();
          this.presentToast("Imagem atualizada !");
        }, 2000);
      },
        error => {
          this.loading.dismiss();
        });
  }

  cancel() {
    this.picture = null;
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
