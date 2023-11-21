import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './composants/login/login.component';
import { HeaderAdminComponent } from './composants/header-admin/header-admin.component';
import { AjoutAdminComponent } from './Admin/ajout-admin/ajout-admin.component';
import { AfficheAdminComponent } from './Admin/affiche-admin/affiche-admin.component';
import { AjoutRestaurantComponent } from './Admin/ajout-restaurant/ajout-restaurant.component';
import { AfficheRestaurantComponent } from './Admin/affiche-restaurant/affiche-restaurant.component';
import { AjoutTypeComponent } from './Restaurant/TypePlat/ajout-type/ajout-type.component';
import { AfficheTypeComponent } from './Restaurant/TypePlat/affiche-type/affiche-type.component';
import { AjoutPlatComponent } from './Restaurant/Plat/ajout-plat/ajout-plat.component';
import { AffichePlatComponent } from './Restaurant/Plat/affiche-plat/affiche-plat.component';
import { AjoutMenuComponent } from './Restaurant/Menu/ajout-menu/ajout-menu.component';
import { AfficheMenuComponent } from './Restaurant/Menu/affiche-menu/affiche-menu.component';

const routes: Routes = [
  {path:"",component:LoginComponent},


  {path:"headers", component:AfficheRestaurantComponent},
  {path:"ajoutRestaurant",component:AjoutRestaurantComponent},
  {path:"afficheRestaurant",component:AfficheRestaurantComponent},
  {path:"ajoutAdmin",component:AjoutAdminComponent},
  {path:"listeAdmin", component:AfficheAdminComponent},
  {path:"header",component:HeaderAdminComponent},


  {path:"ajoutType", component:AjoutTypeComponent},
  {path:"afficheType", component:AfficheTypeComponent},
  {path:"ajoutPlat", component:AjoutPlatComponent},
  {path:"affichePlat",component:AffichePlatComponent},
  {path:"ajoutMenu", component:AjoutMenuComponent},
  {path:"afficheMenu",component:AfficheMenuComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
