import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppModuleComponent } from "./app-module/app-module.component";


const routes: Routes = [
  { path: 'module/:module', component: AppModuleComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
