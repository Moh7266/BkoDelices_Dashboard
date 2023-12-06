import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './composants/login/login.component';
import { HeaderAdminComponent } from './composants/header-admin/header-admin.component';
import { HeaderRestauComponent } from './composants/header-restau/header-restau.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {provideStorage,getStorage} from '@angular/fire/storage';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore'; // Assurez-vous que le chemin est correct

import { environnement } from './composants/evironnement';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AjoutAdminComponent } from './Admin/ajout-admin/ajout-admin.component';
import { AfficheAdminComponent } from './Admin/affiche-admin/affiche-admin.component';
import { AjoutRestaurantComponent } from './Admin/ajout-restaurant/ajout-restaurant.component';
import { AfficheRestaurantComponent } from './Admin/affiche-restaurant/affiche-restaurant.component';
import { AfficheTypeComponent } from './Restaurant/TypePlat/affiche-type/affiche-type.component';
import { AjoutTypeComponent } from './Restaurant/TypePlat/ajout-type/ajout-type.component';
import { AjoutPlatComponent } from './Restaurant/Plat/ajout-plat/ajout-plat.component';
import { AffichePlatComponent } from './Restaurant/Plat/affiche-plat/affiche-plat.component';
import { AjoutMenuComponent } from './Restaurant/Menu/ajout-menu/ajout-menu.component';
import { AfficheMenuComponent } from './Restaurant/Menu/affiche-menu/affiche-menu.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from "primeng/button";
import { PopupAdminComponent } from './composants/popup-admin/popup-admin.component';
import { AuthentificationService } from './services/authentification.service';
import { CommandeComponent } from './Restaurant/commande/commande.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderAdminComponent,
    HeaderRestauComponent,
    AjoutAdminComponent,
    AfficheAdminComponent,
    AjoutRestaurantComponent,
    AfficheRestaurantComponent,
    AfficheTypeComponent,
    AjoutTypeComponent,
    AjoutPlatComponent,
    AffichePlatComponent,
    AjoutMenuComponent,
    AfficheMenuComponent,
    PopupAdminComponent,
    CommandeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environnement.firebase),
    AngularFireAuthModule,
    provideStorage(()=>getStorage()),
    provideFirebaseApp(() => initializeApp(environnement.firebase)), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), BrowserAnimationsModule, // Inclusion du module AngularFireAuthModule
    DialogModule,
    ButtonModule
  ],
  providers: [AuthentificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
