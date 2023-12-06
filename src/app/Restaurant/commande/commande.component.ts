import { Component, OnInit } from '@angular/core';
import { Firestore,addDoc, collection, collectionData,deleteDoc, doc, setDoc, snapToData } from '@angular/fire/firestore';
import { UserInfo } from 'src/app/services/user';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { getDownloadURL, getStorage, ref } from '@angular/fire/storage';

import { AuthentificationService } from 'src/app/services/authentification.service';

@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css']
})
export class CommandeComponent implements OnInit {

  userInfo: UserInfo | undefined;

  Commandes!:any;

  constructor(
    private currentUserService: CurrentUserService,
    private firestore:Firestore,
    private authService :AuthentificationService,

  ){this.GetCommandes();}

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
  GetCommandes() {
    // Initialise une instance de collection Firestore nommée 'commandes'.
    const collectionInstance = collection(this.firestore, 'commandes');

    // Récupère les données de la collection avec un champ d'ID personnalisé.
    collectionData(collectionInstance, { idField: 'id' })
        .subscribe(val => {
            // Itère sur chaque élément de la collection.
            val.forEach((element) => {
                // Initialise une instance de stockage Firebase.
                const storage = getStorage();

                // Crée une référence à l'emplacement de stockage d'une image basée sur l'ID de l'élément actuel.
                const starsRef = ref(storage, 'images/' + element.id);

                // Récupère l'URL de téléchargement de l'image depuis le stockage Firebase.
                getDownloadURL(starsRef)
                    .then((url) => {
                        // Définit l'URL de l'image comme propriété 'fileInput' dans l'élément actuel.
                        element['fileInput'] = url;
                    });
            });

            // Affiche les données récupérées dans la console.
            console.log(val);

            // Assigner les données récupérées à une propriété nommée 'Commandes'.
            this.Commandes = val;
        });
}





  onLogout() {
    this.authService.logout();
  }

}
