import { Component } from '@angular/core';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getStorage, ref, uploadBytes } from '@angular/fire/storage';
import { Router } from '@angular/router';


@Component({
  selector: 'app-ajout-admin',
  templateUrl: './ajout-admin.component.html',
  styleUrls: ['./ajout-admin.component.css']
})
export class AjoutAdminComponent {

  selectedFile: File | null = null;
  email!: string;
  password!: string;


  constructor(
    private firestore:Firestore,
    private fireauth:AngularFireAuth,
    private router:Router,
    ){}

    onChange(event:any){

      this.selectedFile=event.target.files[0];
      if(this.selectedFile){
        debugger;
        const path='${selectedFile.name}';
      }
    }

    addAdmin(admin:NgForm){
      const data = admin.value;
      const collectionInstance= collection(this.firestore,'superadmins');


      this.fireauth.createUserWithEmailAndPassword(this.email,this.password).then((donnee)=>{
        const cityRef=doc(collectionInstance,donnee.user?.uid);
        setDoc(cityRef, data,{merge:true}).then(()=>{
          const path= `images/${donnee.user?.uid}`;
          if(this.selectedFile){
            const storage=getStorage();
            const newMetadata={
              contentType: this.selectedFile.type
            };
            const storageRef = ref(storage,path);
            uploadBytes(storageRef,this.selectedFile,newMetadata).then((snapshot)=>{
              console.log(snapshot.ref.fullPath);

            });
          }
          this.router.navigate(["/login"]);
        }).catch((err)=>{
          console.log(err);
        });
      })
    }

}
