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
  

  constructor(private authentification:AuthentificationService){}

  ngOnInit(): void {}

  login(){
    if(this.email===""){
      alert("Entrez votre email");
      return;
    }
    if(this.passe===""){
      alert("Entrez votre mot de passe");
      return;
    }

    this.authentification.login(this.email,this.passe);

    this.email="";
    this.passe="";
  }

}
