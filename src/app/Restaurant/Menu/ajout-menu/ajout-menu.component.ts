import { Component } from '@angular/core';

import { Firestore, collection, collectionData, doc, getDocs, query, setDoc, where } from '@angular/fire/firestore';

import { NgForm } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';
import { Router } from '@angular/router';



@Component({
  selector: 'app-ajout-menu',
  templateUrl: './ajout-menu.component.html',
  styleUrls: ['./ajout-menu.component.css']
})
export class AjoutMenuComponent {



  selectedFile: File | null = null;
  Plat!:any
  data: any = { plats: []};


  constructor(
    private firestore:Firestore,
    private fireauth:AngularFireAuth,
    private router:Router,
    ){this.GetPlat()}

    onChange(event:any){

      this.selectedFile=event.target.files[0];

    }

    async menuExists(menuName: string): Promise<boolean> {
      const typeCollection = collection(this.firestore, 'Menus');
      const q = query(typeCollection, where('nom', '==', menuName));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    }
//===================Obtenir l'id du restaurants==============
    async getRestaurantId(): Promise<string | null> {
      try {
        const user = await this.fireauth.currentUser;

        if (user) {
          // L'ID du restaurant associé à l'utilisateur actuellement connecté
          const restaurantId = user.uid;
          return restaurantId;
        } else {
          // Aucun utilisateur connecté
          return null;
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID du restaurant :', error);
        return null;
      }
    }



    async addMenu(admin: NgForm) {
      const data = admin.value;
      console.log(data)
      const menuName = data.nom;

      // Remplacez 'ID_DU_RESTAURANT' par l'ID réel de votre restaurant
      const restaurantId = await this.getRestaurantId();
      if (restaurantId) {
        // Continuer avec l'ID du restaurant
        console.log('ID du restaurant :', restaurantId);

        // ... le reste du code ...
      } else {
        // Gérer le cas où aucun utilisateur n'est connecté
        console.log("Aucun utilisateur connecté");
        return;
      }

      // Vérifier si le menu existe déjà
      const menuExists = await this.menuExists(menuName);

      if (menuExists) {
        alert('Ce menu existe déjà.');
        // Ajouter ici la logique pour gérer le cas où le menu existe déjà
        return;
      }

      // Ajoutez le menu à la sous-collection 'Menus' de la collection 'restaurant'
      const restaurantCollection = collection(this.firestore, 'restaurants', restaurantId, 'Menus');
      const menuDocRef = doc(restaurantCollection, menuName);

      setDoc(menuDocRef, data, { merge: true }).then(() => {
        const path = `images/${menuName}`;

        if (this.selectedFile) {
          const storage = getStorage();
          const newMetadata = {
            contentType: this.selectedFile.type
          };
          const storageRef = ref(storage, path);

          // Télécharger l'image associée après avoir ajouté le menu
          uploadBytes(storageRef, this.selectedFile, newMetadata).then((snapshot) => {
            console.log(snapshot.ref.fullPath);
            console.log('Menu ajouté avec succès!');

            this.router.navigate(['/afficheMenu']);
          }).catch((err) => {
            console.log(err);
          });
        } else {
          // Si aucun fichier n'est sélectionné, simplement rediriger
          this.router.navigate(['/afficheMenu']);
        }
      }).catch((err) => {
        console.log(err);
      });
    }


    GetPlat(){
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
        this.Plat = val;
      });

  }



}
