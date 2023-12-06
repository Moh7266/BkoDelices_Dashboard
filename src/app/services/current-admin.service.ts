import { Injectable } from '@angular/core';
import { AdminInfo } from './admin';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, doc } from '@angular/fire/firestore';
import { getDoc } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class CurrentAdminService {

  currentAdmin!:AdminInfo;

  constructor(private fireauth:AngularFireAuth,private firestore:Firestore ) { }

  async getAdminInfo(){

    try {
      const user = await this.fireauth.currentUser;

      if (user) {
        // L'ID du restaurant associé à l'utilisateur actuellement connecté
        const adminId = user.uid;

        const document = doc(this.firestore,"superadmins",adminId)
        const docSnap = await getDoc(document)
        let adminInfo!: AdminInfo;
        let id = docSnap.id;
        let data = docSnap.data();
        adminInfo = {id,...data} as AdminInfo;
        this.currentAdmin = {id,...data} as AdminInfo;

          // console.log(data.data())
          return adminInfo;

      } else {
        // Aucun utilisateur connecté
        console.log("Aucun admin connecté");

        return undefined;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations de l\'admin :', error);
      return undefined;
    }
}
}
