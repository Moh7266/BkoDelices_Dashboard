import { Component, OnInit } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { UserInfo } from 'src/app/services/user';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { AuthentificationService } from 'src/app/services/authentification.service';

@Component({
  selector: 'app-ajout-plat',
  templateUrl: './ajout-plat.component.html',
  styleUrls: ['./ajout-plat.component.css']
})
export class AjoutPlatComponent implements OnInit {
  userInfo: UserInfo | undefined;
  selectedFile: File | null = null;
  Type!: any;
  data: any = {};
  loading = false;

  constructor(
    private firestore: Firestore,
    private router: Router,
    private auth: AngularFireAuth,
    private authentification:AuthentificationService,

    private currentUserService: CurrentUserService
  ) {
    this.getType();
  }

  ngOnInit(): void {
    this.getCurrentUser();
    console.log(this.userInfo);
  }

  async getCurrentUser(): Promise<void> {
    this.currentUserService.getUserInfo().then((result) => {
      this.userInfo = result as unknown as UserInfo;
      console.log(this.userInfo);
    });
  }

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
    try {
      this.loading = true;
      const data = admin.value;
      const platName = data.nom;

      // Verify if the plat already exists
      const platExists = await this.platExists(platName);

      if (platExists) {
        alert('Ce plat existe déjà.');
        this.loading = false;
        // Add logic for handling the case where the plat already exists
        return;
      }

      // Get the current user's ID
      const user = await this.auth.authState.pipe(first()).toPromise();
      const restaurant = user ? user : null; // Replace this line with your logic if user is null
      data.restaurantId = restaurant?.uid;

      // Add the plat data to Firestore without the image URL
      const collectionInstance = collection(this.firestore, 'plats');
      const docRef = await addDoc(collectionInstance, data);

      // Define the path for storing the image in Firebase Storage
      const path = `images/${docRef.id}`;
      const storageRef = ref(getStorage(), path);

      // Upload the image to Firebase Storage
      const newMetadata = {
        contentType: this.selectedFile?.type
      };

      if (this.selectedFile) {
        // Use the correct uploadBytes method
        const snapshot = await uploadBytes(storageRef, this.selectedFile as Blob, newMetadata);
      }

      // Get the download URL of the uploaded image
      const imageUrl = this.selectedFile ? await getDownloadURL(storageRef) : null;

      // Update the plat document in Firestore with the image URL
      if (imageUrl) {
        await setDoc(doc(collectionInstance, docRef.id), { imageUrl: imageUrl }, { merge: true });
      }

      console.log('Plat ajouté avec succès!');
      this.router.navigate(['/affichePlat']);
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  // recuperation des types de plats
  getType() {
    const collectionInstance = collection(this.firestore, 'type');
    collectionData(collectionInstance, { idField: 'id' })
      .subscribe(val => {
        val.forEach((element) => {
          const storage = getStorage();
          const starsRef = ref(storage, 'images/' + element.id);
          getDownloadURL(starsRef)
            .then((url) => {
              element['fileInput'] = url;
            });
        });
        console.log(val);
        this.Type = val;
      });
  }


  onLogout() {
    this.authentification.logout();
  }
}
