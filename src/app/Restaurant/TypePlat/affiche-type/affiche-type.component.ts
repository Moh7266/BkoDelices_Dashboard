import { Component } from '@angular/core';

import { Firestore,addDoc, collection, collectionData,deleteDoc, doc, setDoc, snapToData } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { getDownloadURL, getStorage, ref } from '@angular/fire/storage';


@Component({
  selector: 'app-affiche-type',
  templateUrl: './affiche-type.component.html',
  styleUrls: ['./affiche-type.component.css']
})
export class AfficheTypeComponent {



  Type!:any
  constructor(
    private firestore:Firestore,
    private FireStorage: AngularFireStorage,
    private fireauth:AngularFireAuth,
    private router: Router,
    private authentification:AuthentificationService){
    this.GetData();
  }

  GetData(){
    const collectionInstance= collection(this.firestore, 'type');
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
      this.Type = val;
    });

    // =collectionData(collectionInstance, {idField:'id'});
  }

  showRestauDetails(Type: any) {
    this.Type = Type; // Met à jour les détails de l'administrateur sélectionné
  }



}
