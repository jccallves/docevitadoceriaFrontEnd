import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CategoriaService } from '../services/domain/categoria.service';
import { ErrorInterceptorProvider } from '../interceptors/error-interceptor';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { ClienteService } from '../services/domain/cliente.service';
import { AuthInterceptorProvider } from '../interceptors/auth-interceptor';
import { CidadeService } from '../services/domain/cidade.service';
import { EstadoService } from '../services/domain/estado.service';
import { ProdutoService } from '../services/domain/produto.service';
import { CartService } from '../services/domain/cart.service';
import { ImageUtilService } from '../services/image-util.service';
import { AngularFireModule  } from '@angular/fire'
import { API_CONFIG } from '../configs/api.config';
import { AngularFireAuthModule } from '@angular/fire/auth'
import { AuthGuard } from '../guards/auth.guard';
import { AngularFireStorageModule } from '@angular/fire/storage'
import { Camera } from '@ionic-native/camera'
import { File } from '@ionic-native/file/ngx'


@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(API_CONFIG.firebase),
    AngularFireAuthModule,
    AngularFireStorageModule
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CategoriaService,
    AuthInterceptorProvider,
    AuthService,
    StorageService,
    ClienteService,
    ErrorInterceptorProvider,
    CidadeService,
    EstadoService,
    ProdutoService,
    CartService,
    ImageUtilService,
    AuthGuard,
    Camera,
    File
  ]
})
export class AppModule {}
