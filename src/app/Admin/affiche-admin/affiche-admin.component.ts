import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Firestore, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import { collection } from '@angular/fire/firestore';
import { deleteObject, getDownloadURL, getStorage, ref } from '@angular/fire/storage';
import { AdminInfo } from 'src/app/services/admin';
import { CurrentAdminService } from 'src/app/services/current-admin.service';
import { AuthentificationService } from 'src/app/services/authentification.service';


@Component({
  selector: 'app-affiche-admin',
  templateUrl: './affiche-admin.component.html',
  styleUrls: ['./affiche-admin.component.css']
})
export class AfficheAdminComponent implements OnInit {


  adminInfo:AdminInfo|undefined;

  SupAdmin!:any;
  Administrateur!:any;

  constructor(
    private firestore:Firestore,
    private route:Router,
    private currentAdminService:CurrentAdminService,
    private authService: AuthentificationService){
    this.GetAdmin();
  }
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



  async deleteAdmin(id: string) {
    // Demander confirmation avant de supprimer
    const confirmation = window.confirm("Voulez-vous vraiment supprimer cet administrateur ?");

    if (!confirmation) {
      // Annuler la suppression si l'utilisateur clique sur "Annuler"
      return;
    }

    const collectionInstance = collection(this.firestore, 'superadmins');
    const adminDoc = doc(collectionInstance, id);

    try {
      // Supprimer le document Firestore
      await deleteDoc(adminDoc);

      // Supprimer l'image dans Storage
      const storage = getStorage();
      const imageRef = ref(storage, `images/${id}`);

      await deleteObject(imageRef);

      console.log('Administrateur et ses données associées supprimés avec succès.');

      // Rafraîchir la page en naviguant vers la même route
      this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.route.navigate(['/listeAdmin']);
      });

      // Vous pouvez également mettre à jour localement votre liste d'administrateurs après la suppression.
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'administrateur :', error);
    }
  }
  onLogout() {
    this.authService.logout();
  }



  showDetails(Admin: any) {
    this.Administrateur = Admin;
    console.log(this.Administrateur);

    // this.Restau = Restaurant; // Met à jour les détails de l'administrateur sélectionné
  }
}
