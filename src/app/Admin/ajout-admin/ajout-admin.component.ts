import { Component, OnInit } from '@angular/core';
import { Firestore, collection, addDoc, getDoc, doc, deleteDoc, setDoc } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { AdminInfo } from 'src/app/services/admin';
import { CurrentAdminService } from 'src/app/services/current-admin.service';

@Component({
  selector: 'app-ajout-admin',
  templateUrl: './ajout-admin.component.html',
  styleUrls: ['./ajout-admin.component.css']
})
export class AjoutAdminComponent implements OnInit {

  adminInfo:AdminInfo|undefined;


  selectedFile: File | null = null;
  email!: string;
  password!: string;
  loading: boolean = false;


  constructor(
    private firestore: Firestore,
    private fireauth: AngularFireAuth,
    private router: Router,
    private authService:AuthentificationService,
    private currentAdminService:CurrentAdminService

  ) {}
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

  onChange(event: any) {
    this.selectedFile = event.target.files[0];
  }
  async addAdmin(admin: NgForm) {
    try {
      this.loading = true;
      const data = admin.value;

      // Créer l'utilisateur dans Firebase Auth
      const userCredential = await this.fireauth.createUserWithEmailAndPassword(this.email, this.password);
      const userId = userCredential.user?.uid;

      if (!userId) {
        console.log("L'ID de l'utilisateur est indisponible.");
        return;
      }

      const collectionInstance = collection(this.firestore, 'superadmins');

      // Vérifier si l'administrateur existe déjà
      const adminExists = await this.adminExists(userId);

      if (adminExists) {
        alert('Cet administrateur existe déjà.');
        // Ajouter ici la logique pour gérer le cas où l'administrateur existe déjà
        return;
      }

      if (this.selectedFile) {
        const storage = getStorage();
        const newMetadata = {
          contentType: this.selectedFile.type
        };
        const path = `images/${userId}`;
        const storageRef = ref(storage, path);

        // Télécharger l'image associée après avoir ajouté l'administrateur
        await uploadBytes(storageRef, this.selectedFile, newMetadata);
        const imageUrl = await getDownloadURL(storageRef);

        // Ajouter l'URL de l'image aux données de l'administrateur
        data['imageUrl'] = imageUrl;
      }

      // Ajouter l'administrateur à Firestore avec l'ID de l'utilisateur Firebase Auth
      await setDoc(doc(collectionInstance, userId), data);

      console.log('Administrateur ajouté avec succès!');
      this.router.navigate(['/afficheAdmin']);
      this.loading = false;
    } catch (err) {
      console.log(err);
      this.loading = false;

    }
  }

  async adminExists(userId: string): Promise<boolean> {
    const collectionInstance = collection(this.firestore, 'superadmins');
    const adminDoc = doc(collectionInstance, userId);

    const docSnapshot = await getDoc(adminDoc);
    return docSnapshot.exists();
  }

  // LA DECONEXION
  onLogout() {
    this.authService.logout();
  }


}
