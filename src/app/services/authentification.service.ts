import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Firestore, collection, query, where, getDocs, getDoc, doc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  currentUser$: Observable<any>;
  constructor(private fireAuth:AngularFireAuth,private router:Router,private firestore: Firestore) {
    this.currentUser$= this.fireAuth.authState;
  }






  //methode connexion
  async login(email: string, password: string) {
    try {
      const userCredential = await this.fireAuth.signInWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;

      // Récupérer les informations du compte
      const userDoc1 = await getDoc(doc(this.firestore, `superadmins/${user?.uid}`));
      const userDoc2 = await getDoc(doc(this.firestore, `restaurants/${user?.uid}`));

      if (userDoc1.exists()) {
        this.router.navigate(['/afficheRestaurant']);
      } else if (userDoc2.exists()) {
        this.router.navigate(['/ajoutMenu']);
      }
      else{
        console.log('Utilisateur non trouvé dans la base de données.');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.log('Erreur d\'authentification');
      // Ajoutez une logique pour afficher un message d'erreur à l'utilisateur
      this.router.navigate(['/login']);
    }
  }










  //methode deconnexion
  logout(){
    this.fireAuth.signOut().then(()=>{
      localStorage.removeItem("token");
      this.router.navigate(["/login"]);
    },err=>{
      alert(err.message);
    })
  }

  register(email:string,passe:string){

    // email="mledgk@gmail.com";
    // passe="fdgazeetyty"
    console.log(email,passe);
    this.fireAuth.createUserWithEmailAndPassword(email,passe).then(()=>{
      this.router.navigate(["/login"]);
    },err=>{
      alert(err.message);
      this.router.navigate(["/ajouterRestaurent"]);
    })
  }




}
