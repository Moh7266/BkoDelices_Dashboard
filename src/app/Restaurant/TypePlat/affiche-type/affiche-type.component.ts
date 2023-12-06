import { Component, OnInit } from '@angular/core';

import { Firestore,addDoc, collection, collectionData,deleteDoc, doc, setDoc, snapToData } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { getDownloadURL, getStorage, ref } from '@angular/fire/storage';
import { UserInfo } from 'src/app/services/user';
import { CurrentUserService } from 'src/app/services/current-user.service';


@Component({
  selector: 'app-affiche-type',
  templateUrl: './affiche-type.component.html',
  styleUrls: ['./affiche-type.component.css']
})
export class AfficheTypeComponent implements OnInit {
  userInfo: UserInfo | undefined;



  Type!:any
  constructor(
    private firestore:Firestore,
    private FireStorage: AngularFireStorage,
    private fireauth:AngularFireAuth,
    private router: Router,
    private currentUserService: CurrentUserService,
    private authentification:AuthentificationService){
    this.GetData();
  }
  ngOnInit(): void {
    this.getCurrentUser();
    console.log(this.userInfo);
  }

  async getCurrentUser(): Promise<void> {
    this.currentUserService.getUserInfo().then((result)=>{
      this.userInfo = result as unknown as UserInfo;
      console.log(this.userInfo);
    });

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


  onLogout() {
    this.authentification.logout();
  }



}
