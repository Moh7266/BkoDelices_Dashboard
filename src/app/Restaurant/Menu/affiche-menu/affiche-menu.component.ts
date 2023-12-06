import { Component, OnInit } from '@angular/core';

import { Firestore,addDoc, collection, collectionData,deleteDoc, doc, setDoc, snapToData } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { deleteObject, getDownloadURL, getStorage, ref } from '@angular/fire/storage';
import { UserInfo } from 'src/app/services/user';
import { CurrentUserService } from 'src/app/services/current-user.service';


@Component({
  selector: 'app-affiche-menu',
  templateUrl: './affiche-menu.component.html',
  styleUrls: ['./affiche-menu.component.css']
})
export class AfficheMenuComponent implements OnInit {

  userInfo: UserInfo | undefined;


  Restau!:any
  Menu!:any;
  constructor(
    private firestore:Firestore,
    private FireStorage: AngularFireStorage,
    private fireauth:AngularFireAuth,
    private router: Router,
    private authentification:AuthentificationService,
    private currentUserService: CurrentUserService

    ){
  }
  ngOnInit(): void {
    this.getCurrentUser();
    console.log(this.userInfo);
  }
  async getCurrentUser(): Promise<void> {
    this.currentUserService.getUserInfo().then((result)=>{
      this.userInfo = result as unknown as UserInfo;
      console.log(this.userInfo);
      this.GetMenu();
    });

  }



 GetMenu() {
  // Obtenez l'ID de l'utilisateur actuellement connecté
  const userId = this.userInfo?.id;
  console.log('userId',userId);




  if (userId) {
    // Utilisez l'ID de l'utilisateur pour obtenir les menus associés à cet utilisateur
    const collectionInstance = collection(this.firestore, 'restaurants', userId, 'Menus');

    collectionData(collectionInstance, { idField: 'id' }).subscribe(val => {
      val.forEach((element) => {
        const storage = getStorage();
        const starsRef = ref(storage, 'images/' + element.id);

        getDownloadURL(starsRef).then((url) => {
          element['fileInput'] = url;
        });
      });

      console.log('iufhuihEDFUUf',val);
      this.Restau = val;
    });
  } else {
    console.log("Aucun utilisateur connecté don pas de menu");
    // Gérer le cas où aucun utilisateur n'est connecté
  }
}




showRestauDetails(Restau: any) {
  this.Menu = Restau;
  console.log(this.Menu);


  // this.Restau = Restaurant; // Met à jour les détails de l'administrateur sélectionné
}


async deleteMenu(id: string) {
  const collectionInstance = collection(this.firestore, 'restaurants');
  const restaurantDoc = doc(collectionInstance, id);

  try {
    // Supprimer le document Firestore
    await deleteDoc(restaurantDoc);

    // Supprimer l'image dans Storage
    const storage = getStorage();
    const starsRef = ref(storage, 'images/' + id);

    await deleteObject(starsRef);

    console.log('Menu et ses données associées supprimés avec succès.');
    // Vous pouvez également mettre à jour localement votre liste de restaurants après la suppression.
  } catch (error) {
    console.error('Erreur lors de la suppression du menu :', error);
  }
}

onLogout() {
  this.authentification.logout();
}

}
