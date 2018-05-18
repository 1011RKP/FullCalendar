import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { FullCalendarModule } from 'ng-fullcalendar';
import { ServiceComponent } from './service/service.component';
import { HttpClientModule } from "@angular/common/http";
import { ModalModule } from 'ngx-bootstrap';


@NgModule({
  declarations: [
    AppComponent
    //,CalendarComponent
  ],
  imports: [
    BrowserModule, FormsModule,
    BsDatepickerModule.forRoot(),ModalModule.forRoot(),
    FullCalendarModule,
    NgxPaginationModule,
    HttpClientModule
  ],
  providers: [ServiceComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

//npm install ngx-pagination --save
//npm install moment --save
//npm install ngx-bootstrap --save
//npm install sp-pnp-js --save
//npm install --save classlist.js
//npm install --save web-animations-js
