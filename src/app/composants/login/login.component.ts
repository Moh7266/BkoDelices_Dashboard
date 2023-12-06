import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from 'src/app/services/authentification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email:string="";
  passe:string="";
  errorMessage: string = "";



  constructor(private authentification:AuthentificationService){}

  ngOnInit(): void {}

  async login() {
    try {
      if (this.email === "") {
        this.errorMessage = "Entrez votre email";
        alert(this.errorMessage);
        return;
      }
      if (this.passe === "") {
        this.errorMessage = "Entrez votre mot de passe";
        alert(this.errorMessage);

        return;
      }

      // Réinitialiser le message d'erreur à chaque tentative de connexion
      this.errorMessage = "";

      // Appeler la méthode de connexion du service
      await this.authentification.login(this.email, this.passe);

      // Réinitialiser les champs d'entrée
      this.email = "";
      this.passe = "";

    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      this.errorMessage ='Veuillez verifier les données saissi';
      alert(this.errorMessage);

    }
  }

}
