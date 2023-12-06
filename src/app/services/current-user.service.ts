// current-user.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, map } from 'rxjs';
import { UserInfo } from './user';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore, doc, docSnapshots } from '@angular/fire/firestore';
import { getDoc } from 'firebase/firestore';
@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  currentUser! : UserInfo;

  constructor(private fireauth: AngularFireAuth, private firestore: Firestore) { }

  async getUserInfo() {
    try {
      const user = await this.fireauth.currentUser;

      if (user) {
        // L'ID du restaurant associé à l'utilisateur actuellement connecté
        const restaurantId = user.uid;

        const document = doc(this.firestore,"restaurants",restaurantId)
        const docSnap = await getDoc(document)
        let userInfo!: UserInfo;
        let id = docSnap.id;
        let data = docSnap.data();
        userInfo = {id,...data} as UserInfo;
        this.currentUser = {id,...data} as UserInfo;

          // console.log(data.data())
          return userInfo;

      } else {
        // Aucun utilisateur connecté
        console.log("Aucun utilisateur connecté");

        return undefined;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations de l\'utilisateur :', error);
      return undefined;
    }
  }
}


