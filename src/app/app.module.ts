import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { AppModuleComponent } from './app-module/app-module.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTabsModule} from "@angular/material/tabs";
import {MatListModule} from "@angular/material/list";
import {MatTreeModule, MatTreeNode} from "@angular/material/tree";
import {MatIconModule} from "@angular/material/icon";
import { AppCommandsLineComponent } from './app-commands-line/app-commands-line.component';
import { AppMainMenuComponent } from './app-main-menu/app-main-menu.component';
import { AppCommandsChangerComponent } from './app-commands-changer/app-commands-changer.component';



@NgModule({
  declarations: [
    AppComponent,
    AppModuleComponent,
    AppCommandsLineComponent,
    AppMainMenuComponent,
    AppCommandsChangerComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        BrowserAnimationsModule,
        MatTabsModule,
        MatListModule,
        MatTreeModule,
        MatIconModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
