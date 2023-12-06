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
  selector: 'app-affiche-plat',
  templateUrl: './affiche-plat.component.html',
  styleUrls: ['./affiche-plat.component.css']
})
export class AffichePlatComponent implements OnInit{

  userInfo: UserInfo | undefined;


  Restau!:any
  Plat!:any
  constructor(
    private firestore:Firestore,
    private FireStorage: AngularFireStorage,
    private fireauth:AngularFireAuth,
    private router: Router,
    private authentification:AuthentificationService,
    private currentUserService: CurrentUserService
    ){
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
    const collectionInstance= collection(this.firestore, 'plats');
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
    this.Plat = Restau; // Met à jour les détails de l'administrateur sélectionné
  }


  onLogout() {
    this.authentification.logout();
  }



}
