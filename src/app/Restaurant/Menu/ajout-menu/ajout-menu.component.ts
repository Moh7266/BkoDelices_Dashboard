import { Component, OnInit } from '@angular/core';

import { Firestore, addDoc, collection, collectionData, doc, getDocs, query, setDoc, updateDoc, where } from '@angular/fire/firestore';

import { NgForm } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { UserInfo } from 'src/app/services/user';
import { AuthentificationService } from 'src/app/services/authentification.service';





@Component({
  selector: 'app-ajout-menu',
  templateUrl: './ajout-menu.component.html',
  styleUrls: ['./ajout-menu.component.css']
})
export class AjoutMenuComponent implements OnInit{



  selectedFile: File | null = null;
  Plat!:any
  data: any = { plats: []};
  userInfo: UserInfo | undefined;



  constructor(
    private firestore:Firestore,
    private fireauth:AngularFireAuth,
    private router:Router,
    private authentification:AuthentificationService,

    private currentUserService: CurrentUserService
    ){this.GetPlat()}

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
      try {
        const data = admin.value;
        const menuName = data.nom;

        // Remplacez 'ID_DU_RESTAURANT' par l'ID réel de votre restaurant
        const restaurantId = await this.getRestaurantId();
        if (!restaurantId) {
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

        // Utilisez la méthode add pour générer automatiquement l'ID
        const menuDocRef = await addDoc(restaurantCollection, data);

        // Vérifier si une image est sélectionnée
        if (this.selectedFile) {
          const storage = getStorage();
          const path = `images/${menuDocRef.id}`;
          const newMetadata = {
            contentType: this.selectedFile.type
          };
          const storageRef = ref(storage, path);

          // Télécharger l'image associée et obtenir son URL
          const snapshot = await uploadBytes(storageRef, this.selectedFile, newMetadata);
          const imageUrl = await getDownloadURL(snapshot.ref);

          // Ajouter l'URL de l'image aux données du menu
          await updateDoc(menuDocRef, { imageUrl: imageUrl });

          console.log('Menu ajouté avec succès!');
          this.router.navigate(['/afficheMenu']);
        } else {
          // Si aucune image n'est sélectionnée, simplement rediriger
          this.router.navigate(['/afficheMenu']);
        }
      } catch (err) {
        console.log(err);
      }
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

  onLogout() {
    this.authentification.logout();
  }



}
