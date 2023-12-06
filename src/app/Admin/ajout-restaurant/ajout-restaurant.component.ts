import { Component, OnInit } from '@angular/core';

import { Firestore, collection, doc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { AdminInfo } from 'src/app/services/admin';
import { CurrentAdminService } from 'src/app/services/current-admin.service';


@Component({
  selector: 'app-ajout-restaurant',
  templateUrl: './ajout-restaurant.component.html',
  styleUrls: ['./ajout-restaurant.component.css']
})
export class AjoutRestaurantComponent implements OnInit {

  adminInfo:AdminInfo|undefined;

  selectedFile: File | null = null;
  email!: string;
  password!: string;
  loading: boolean = false;


  constructor(
    private firestore:Firestore,
    private fireauth:AngularFireAuth,
    private router:Router,
    private authService:AuthentificationService,
    private currentAdminService:CurrentAdminService
    ){}
  ngOnInit(): void {
    this.getCurrentAdmin();
    console.log(this.adminInfo);
  }

  async getCurrentAdmin(): Promise<void> {
    this.currentAdminService.getAdminInfo().then((result)=>{
      this.adminInfo = result as unknown as AdminInfo;
      console.log(this.adminInfo);
    });

  }


    onChange(event:any){

      this.selectedFile=event.target.files[0];
      if(this.selectedFile){
        const path='${selectedFile.name}';
      }
    }
    async addAdmin(admin: NgForm) {
      const data = admin.value;


      try {
        this.loading = true;
        // Étape 1: Création de l'utilisateur dans Firebase Authentication
        const userCredential = await this.fireauth.createUserWithEmailAndPassword(this.email, this.password);
        const user = userCredential.user;
        const uid = user?.uid;

        // Étape 2: Vérifier si un administrateur avec le même e-mail existe déjà
        const adminExistsByEmail = await this.adminExistsByEmail(data.email);
          console.log('adminExistsByEmail:', adminExistsByEmail);

          if (adminExistsByEmail) {
            console.log('Un restaurant avec le même e-mail existe déjà.');
            alert('Un restaurant avec le même e-mail existe déjà.');
            return;
          }
        // Étape 3: Enregistrement de l'image dans Firebase Storage
        if (this.selectedFile) {
          const storage = getStorage();
          const path = `images/${uid}/${this.selectedFile.name}`;
          const storageRef = ref(storage, path);

          const snapshot = await uploadBytes(storageRef, this.selectedFile);

          // Récupérez le lien de téléchargement de l'image
          const downloadURL = await getDownloadURL(snapshot.ref);

          // Ajoutez le lien de téléchargement à vos données
          data.imageUrl = downloadURL;
        } else {
          console.error('Aucun fichier sélectionné.');
          return;
        }

        // Étape 4: Stockage des informations dans Firestore
        const collectionInstance = collection(this.firestore, 'restaurants');
        const cityRef = doc(collectionInstance, uid);

        await setDoc(cityRef, {
          id: uid,
          imageUrl: data.imageUrl,
          nom: data.nom,
          adresse: data.adresse,
          email: data.email,
          password: data.password,
          fileInput: data.fileInput,
          telephone: data.telephone
        }, { merge: true });

        console.log('Opérations réussies : utilisateur créé, image téléchargée, données stockées dans Firestore.');

        // Vous pouvez ajouter une redirection ici si nécessaire
        this.router.navigate(['/afficheRestaurant']);
        this.loading = false;

      } catch (error) {
        console.error('Erreur lors de l\'opération :', error);
        this.loading = false;
      }
    }

    async adminExistsByEmail(email: string): Promise<boolean> {
      const collectionInstance = collection(this.firestore, 'restaurants');
      const querySnapshot = await getDocs(query(collectionInstance, where('email', '==', email)));
      return !querySnapshot.empty;
    }


    // LA DECONEXION
  onLogout() {
    this.authService.logout();
  }
}
