import { Component } from '@angular/core';

import { Firestore, collection, collectionData, doc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';
import { Router } from '@angular/router';



@Component({
  selector: 'app-ajout-plat',
  templateUrl: './ajout-plat.component.html',
  styleUrls: ['./ajout-plat.component.css']
})
export class AjoutPlatComponent {


  selectedFile: File | null = null;

  Type!:any
  data: any = {};

  constructor(
    private firestore: Firestore,
    private router: Router,
  ) { this.GetType()}

  onChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async platExists(platName: string): Promise<boolean> {
    const typeCollection = collection(this.firestore, 'plats');
    const q = query(typeCollection, where('nom', '==', platName));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  async addPlat(admin: NgForm) {
    const data = admin.value;
    console.log(data)
    const platName = data.nom;


    // Vérifier si le type existe déjà
    const typeExists = await this.platExists(platName);

    if (typeExists) {
      alert('Ce plat existe déjà.');
      // Ajouter ici la logique pour gérer le cas où le type existe déjà
      return;
    }

    // Si le type n'existe pas, ajoutez-le à Firestore
    const collectionInstance = collection(this.firestore, 'plats');
    const typeDocRef = doc(collectionInstance, platName);

    setDoc(typeDocRef, data, { merge: true }).then(() => {
      const path = `images/${platName}`;

      if (this.selectedFile) {
        const storage = getStorage();
        const newMetadata = {
          contentType: this.selectedFile.type
        };
        const storageRef = ref(storage, path);

        // Télécharger l'image associée après avoir ajouté le type
        uploadBytes(storageRef, this.selectedFile, newMetadata).then((snapshot) => {
          console.log(snapshot.ref.fullPath);
          console.log('plat ajouter!!!!!!!!!!!!!!!!!!');

          this.router.navigate(['/affichePlat']);
        }).catch((err) => {
          console.log(err);
        });
      } else {
        // Si aucun fichier n'est sélectionné, simplement rediriger
        this.router.navigate(['/affichePlat']);
      }
    }).catch((err) => {
      console.log(err);
    });
  }



  // recuperation des type de plats
  GetType(){
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

}
}
