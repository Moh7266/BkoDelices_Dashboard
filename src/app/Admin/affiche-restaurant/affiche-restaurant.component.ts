import { Component, OnInit } from '@angular/core';

import { Firestore,addDoc, collection, collectionData,deleteDoc, doc, setDoc, snapToData } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { deleteObject, getDownloadURL, getStorage, ref } from '@angular/fire/storage';
import { AdminInfo } from 'src/app/services/admin';
import { CurrentAdminService } from 'src/app/services/current-admin.service';


@Component({
  selector: 'app-affiche-restaurant',
  templateUrl: './affiche-restaurant.component.html',
  styleUrls: ['./affiche-restaurant.component.css']
})
export class AfficheRestaurantComponent implements OnInit{

  admniInfo: AdminInfo|undefined;


  Restau!:any
  Restaurant!: any;
  constructor(
    private firestore:Firestore,
    private FireStorage: AngularFireStorage,
    private fireauth:AngularFireAuth,
    private router: Router,
    private authService:AuthentificationService,
    private currentAdminService:CurrentAdminService){
    this.GetData();
  }
  ngOnInit(): void {
    this.getCurrentAdmin();
    console.log(this.admniInfo);
  }


  async getCurrentAdmin(): Promise<void> {
    this.currentAdminService.getAdminInfo().then((result)=>{
      this.admniInfo = result as unknown as AdminInfo;
      console.log(this.admniInfo);

    });

  }

  GetData(){
    const collectionInstance= collection(this.firestore, 'restaurants');
    collectionData(collectionInstance, {idField:'id'})
    .subscribe(val=>{
      val.forEach((element)=>{
    const storage = getStorage();
    const starsRef = ref(storage, 'images/'+element.id);
    getDownloadURL(starsRef)
    .then((url) => {
      element['fileInput']=url
    }) })
      console.log(val);
      this.Restau = val;
    });

    // =collectionData(collectionInstance, {idField:'id'});
  }
// LA DECONEXION
  onLogout() {
    this.authService.logout();
  }


  showRestauDetails(Restau: any) {
    this.Restaurant = Restau;
    console.log(this.Restaurant);

    // this.Restau = Restaurant; // Met à jour les détails de l'administrateur sélectionné
  }


  // methode supprimer
  async deleteRestaurant(id: string) {
    // Demande de confirmation avant la suppression
    const isConfirmed = window.confirm("Voulez-vous vraiment supprimer ce restaurant ?");

    // Si l'utilisateur a confirmé, procédez à la suppression
    if (isConfirmed) {
      const collectionInstance = collection(this.firestore, 'restaurants');
      const restaurantDoc = doc(collectionInstance, id);

      try {
        // Supprimer le document Firestore
        await deleteDoc(restaurantDoc);

        // Supprimer l'image dans Storage
        const storage = getStorage();
        const starsRef = ref(storage, 'images/' + id);

        await deleteObject(starsRef);

        console.log('Restaurant et ses données associées supprimés avec succès.');
        // Vous pouvez également mettre à jour localement votre liste de restaurants après la suppression.
      } catch (error) {
        console.error('Erreur lors de la suppression du restaurant :', error);
      }
    } else {
      // L'utilisateur a annulé la suppression
      console.log('Suppression annulée.');
    }
  }


}
