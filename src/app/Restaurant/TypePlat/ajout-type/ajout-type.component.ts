import { Component, OnInit } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDocs, query, where } from '@angular/fire/firestore';
import { getStorage, ref, uploadBytes } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserInfo } from 'src/app/services/user';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { AuthentificationService } from 'src/app/services/authentification.service';

@Component({
  selector: 'app-ajout-type',
  templateUrl: './ajout-type.component.html',
  styleUrls: ['./ajout-type.component.css']
})
export class AjoutTypeComponent implements OnInit {

  userInfo: UserInfo | undefined;
  selectedFile: File | null = null;

  constructor(
    private firestore: Firestore,
    private router: Router,
    private authentification:AuthentificationService,

    private currentUserService: CurrentUserService,

  ) {}
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

  onChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async typeExists(typeName: string): Promise<boolean> {
    const typeCollection = collection(this.firestore, 'type');
    const q = query(typeCollection, where('nom', '==', typeName));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  async addType(admin: NgForm) {
    const data = admin.value;
    const typeName = data.nom;

    // Vérifier si le type existe déjà
    const typeExists = await this.typeExists(typeName);

    if (typeExists) {
      alert('Le type existe déjà.');
      // Ajouter ici la logique pour gérer le cas où le type existe déjà
      return;
    }

    // Si le type n'existe pas, ajoutez-le à Firestore
    const collectionInstance = collection(this.firestore, 'type');
    const typeDocRef = doc(collectionInstance, typeName);

    setDoc(typeDocRef, data, { merge: true }).then(() => {
      const path = `images/${typeName}`;

      if (this.selectedFile) {
        const storage = getStorage();
        const newMetadata = {
          contentType: this.selectedFile.type
        };
        const storageRef = ref(storage, path);

        // Télécharger l'image associée après avoir ajouté le type
        uploadBytes(storageRef, this.selectedFile, newMetadata).then((snapshot) => {
          console.log(snapshot.ref.fullPath);
          console.log('type ajouter!!!!!!!!!!!!!!!!!!');

          this.router.navigate(['/afficheType']);
        }).catch((err) => {
          console.log(err);
        });
      } else {
        // Si aucun fichier n'est sélectionné, simplement rediriger
        this.router.navigate(['/afficheType']);
      }
    }).catch((err) => {
      console.log(err);
    });
  }


  onLogout() {
    this.authentification.logout();
  }
}
