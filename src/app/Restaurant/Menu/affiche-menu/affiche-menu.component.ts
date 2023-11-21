import { Component } from '@angular/core';

import { Firestore,addDoc, collection, collectionData,deleteDoc, doc, setDoc, snapToData } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { getDownloadURL, getStorage, ref } from '@angular/fire/storage';


@Component({
  selector: 'app-affiche-menu',
  templateUrl: './affiche-menu.component.html',
  styleUrls: ['./affiche-menu.component.css']
})
export class AfficheMenuComponent {


  Restau!:any
  constructor(
    private firestore:Firestore,
    private FireStorage: AngularFireStorage,
    private fireauth:AngularFireAuth,
    private router: Router,
    private authentification:AuthentificationService){
    this.GetMenu();
  }

  GetMenu(){
    const collectionInstance= collection(this.firestore, 'restaurants');
    collectionData(collectionInstance, {idField:'id'})
    .subscribe(val=>{
      val.forEach((element)=>{
    const storage = getStorage();
    const starsRef =    ref(storage, 'images/'+element.id);
    getDownloadURL(starsRef)
    .then((url) => {
      element['fileInput']=url
    }) })
      console.log(val);
      this.Restau = val;
    });

    // =collectionData(collectionInstance, {idField:'id'});
  }

  showRestauDetails(Restau: any) {
    this.Restau = Restau; // Met à jour les détails de l'administrateur sélectionné
  }

}
