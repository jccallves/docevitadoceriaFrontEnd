import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file/ngx'

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
  ],
  providers: [
    Camera,
    File
  ]
})
export class ProfilePageModule {}
