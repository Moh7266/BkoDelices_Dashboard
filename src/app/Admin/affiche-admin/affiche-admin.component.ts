import { Component } from '@angular/core';

import { Firestore, collectionData } from '@angular/fire/firestore';
import { collection } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref } from '@angular/fire/storage';


@Component({
  selector: 'app-affiche-admin',
  templateUrl: './affiche-admin.component.html',
  styleUrls: ['./affiche-admin.component.css']
})
export class AfficheAdminComponent {

  SupAdmin!:any;

  constructor(private firestore:Firestore,){
    this.GetAdmin();
  }


  GetAdmin(){
    const collectionInstance=collection(this.firestore, 'superadmins');
    collectionData(collectionInstance, {idField: 'id'})
    .subscribe(val=>{
      val.forEach((element)=>{
        const storage= getStorage();
        const starsRef= ref(storage,'images/'+element.id);
        getDownloadURL(starsRef)
        .then((url)=>{
          element['fileInput']=url
        })
      })
      console.log(val);
      this.SupAdmin=val;
    })
  }
}
