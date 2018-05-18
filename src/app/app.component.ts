import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { sp } from "sp-pnp-js"
import { BsDatepickerConfig } from 'ngx-bootstrap';
import * as moment from "moment";
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { obj, event } from './obj';
import { ServiceComponent } from "./service/service.component"
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  searchdataresults: any; searchEvent: Date; data: any;
  collection = []; collectionLength: number; filter: any;
  searchdata: any = null; emptySearchResults: any = null;
  onloadData: any = null; today = new Date();
  startDate; endDate; announcementsFilter: string;
  danger: string = null; informarion: string = null; success: string = null;
  announcementsData: any; loadingGif: string = "show";
  calendarOptions: Options;
  ptocalendarOptions: Options;
  displayEvent: any; fullCalendarData: obj[] = []; calObj: any;
  cal: event[] = []; cal2: event[] = [];
  url: string; selectedEvent: any; selectedCurrentEvent: any;

  modalRef: BsModalRef; modalRef2: BsModalRef; modalRef3: BsModalRef;

  dateSubmittedConfig: Partial<BsDatepickerConfig>;

  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  constructor(private _service: ServiceComponent, private modalService: BsModalService) {
    this.dateSubmittedConfig = Object.assign({},
      {
        containerClass: 'theme-dark-blue'
      });
    for (let i = 1; i <= this.collectionLength; i++) {
      this.collection.push(`item ${i}`);
    }
  }

  onSearch(): void {
    this.startDate = moment(this.searchEvent[0]).format("YYYY-MM-DD") + 'T12:00:00Z';
    this.endDate = moment(this.searchEvent[1]).format("YYYY-MM-DD") + 'T12:00:00Z';
    this.filter = "(StartDate ge datetime'" + this.startDate + "')" + 'and' + "(StartDate le datetime'" + this.endDate + "')";
    sp.web.lists.getByTitle("IT RSVP").items.select("Title", "EndDate", "EventDate", "ID", "StartDate", "EndDate0").filter(this.filter).orderBy("StartDate").get().then(r => {
      this.onloadData = "Show Only Search Results";
      if (r.length > 0) {
        this.emptySearchResults = null;
        this.searchdata = "data";
        this.searchdataresults = r;
      } else {
        this.searchdata = null;
        this.emptySearchResults = "No Results"
      }
      console.log(r);
    });
  }

  ngOnInit() {
    this.startDate = moment(this.today).format("YYYY-MM-DD") + 'T00:00:00.000Z';
    this.filter = "StartDate ge datetime'" + this.startDate + "'";
    sp.web.lists.getByTitle("IT RSVP").items.select("Title", "EndDate", "Event_x0020_Type", "EventDate", "ID", "StartDate", "EndDate0").filter(this.filter).orderBy("StartDate").get().then(r => {
      this.data = r;
      this.collectionLength = this.data.length;
    });

    this.announcementsFilter = "Expires ge datetime'" + this.today.toISOString() + "'";
    sp.web.lists.getByTitle("IT Announcements").items.select("Title", "Body", "Announcements_x0020_Type", "ID", "Expires").filter(this.announcementsFilter).orderBy("Expires").get().then(r => {
      this.announcementsData = r;
      console.log(r);
      for (let i = 0; i < r.length; i++) {
        switch (r[i].Announcements_x0020_Type) {
          case "System outage"://red
            this.danger = "Down Time";
            this.informarion = null;
            this.success = null;
            break;
          case "Down of bug or error":
            this.danger = "Down Time";
            this.informarion = null;
            this.success = null;
            break;
          case "Informational":
            this.informarion = "Information";
            this.success = null;
            this.danger = null;
            break;
          case "Patching / Maintenance"://orange
            this.success = "Success";
            this.informarion = null;
            this.danger = null;
            break;
          case "Down for system maintenance":
            this.success = "Success";
            this.informarion = null;
            this.danger = null;
            break;
        }
      }
    });
  }

  showAllevents(): void {
    this.onloadData = null;
    this.emptySearchResults = null;
    this.searchdata = null;
  }

  showCalendar(template: TemplateRef<any>): void {
    debugger
    this.calendarOptions = null; this.calObj = null; this.fullCalendarData = [];
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
    this.url = "/_api/web/lists/getByTitle('IT RSVP')/items?$select=Title,EndDate,EventDate,Event_x0020_Type,StartDate,ID,EndDate0&$filter=StartDate ge datetime'" + this.today.toISOString() + "'";
    this._service.getlistItems(this.url).subscribe((data: any) => {
      this.cal = data.d.results;
      for (let i = 0; i < this.cal.length; i++) {
        switch (data.d.results[i].Event_x0020_Type) {
          case "PTO":
            this.calObj = {
              id: data.d.results[i].ID,
              title: data.d.results[i].Title,
              start: data.d.results[i].EventDate,//moment(data.d.results[i].EventDate).format("YYYY-MM-DD"),
              end: data.d.results[i].EndDate,//moment(data.d.results[i].EndDate).format("YYYY-MM-DD"),
              backgroundColor: "#fa8d29",
              borderColor: "#fa8d29",
              className: "eventClass"
            };
            break;
          case "Out of office":
            this.calObj = {
              id: data.d.results[i].ID,
              title: data.d.results[i].Title,
              start: data.d.results[i].EventDate,//moment(data.d.results[i].EventDate).format("YYYY-MM-DD"),
              end: data.d.results[i].EndDate,//moment(data.d.results[i].EndDate).format("YYYY-MM-DD"),
              backgroundColor: "#448aff",
              borderColor: "#448aff",
              className: "eventClass"
            };
            break;
          case "System maintenance":
            this.calObj = {
              id: data.d.results[i].ID,
              title: data.d.results[i].Title,
              start: data.d.results[i].EventDate,//moment(data.d.results[i].EventDate).format("YYYY-MM-DD"),
              end: data.d.results[i].EndDate,//moment(data.d.results[i].EndDate).format("YYYY-MM-DD"),
              backgroundColor: "#11c15b",
              borderColor: "#11c15b",
              className: "eventClass"
            };
            break;
          case "Server down":
            this.calObj = {
              id: data.d.results[i].ID,
              title: data.d.results[i].Title,
              start: data.d.results[i].EventDate,//moment(data.d.results[i].EventDate).format("YYYY-MM-DD"),
              end: data.d.results[i].EndDate,//moment(data.d.results[i].EndDate).format("YYYY-MM-DD"),
              backgroundColor: "#ff5252",
              borderColor: "#ff5252",
              className: "eventClass"
            };
        }
        this.fullCalendarData.push(this.calObj);
      }
      this.loadingGif = '';
      this.calendarOptions = {
        editable: true,
        eventLimit: true,
        contentHeight: 600,
        fixedWeekCount: false,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay,listMonth'
        },
        events: this.fullCalendarData
      };
    });
  }

  ptocalendar(): void {
    this.calendarOptions = null; this.calObj = null; this.fullCalendarData = [];
    this.loadingGif = 'show';
    this.url = "/_api/web/lists/getByTitle('IT RSVP')/items?$select=Title,EndDate,EventDate,Event_x0020_Type,StartDate,ID,EndDate0&$filter=StartDate ge datetime'" + this.today.toISOString() + "'";
    this._service.getlistItems(this.url).subscribe((data: any) => {
      this.cal = data.d.results;
      for (let i = 0; i < this.cal.length; i++) {
        if (data.d.results[i].Event_x0020_Type == "PTO") {
          this.calObj = {
            title: data.d.results[i].Title,
            start: data.d.results[i].EventDate,//moment(data.d.results[i].EventDate).format("YYYY-MM-DD"),
            end: data.d.results[i].EndDate,//moment(data.d.results[i].EndDate).format("YYYY-MM-DD"),
            backgroundColor: "#fa8d29",
            borderColor: "#fa8d29",
            className: "eventClass"
          };
          this.fullCalendarData.push(this.calObj);
        }
      }
      this.loadingGif = '';
      this.calendarOptions = {
        editable: true,
        eventLimit: true,
        contentHeight: 600,
        fixedWeekCount: false,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay,listMonth'
        },
        events: this.fullCalendarData
      };
    })
  }

  ofocalendar(): void {
    this.calendarOptions = null; this.calObj = null; this.fullCalendarData = [];
    this.loadingGif = 'show';
    this.url = "/_api/web/lists/getByTitle('IT RSVP')/items?$select=Title,EndDate,EventDate,Event_x0020_Type,StartDate,ID,EndDate0&$filter=StartDate ge datetime'" + this.today.toISOString() + "'";
    this._service.getlistItems(this.url).subscribe((data: any) => {
      this.cal = data.d.results;
      for (let i = 0; i < this.cal.length; i++) {
        if (data.d.results[i].Event_x0020_Type == "Out of office") {
          this.calObj = {
            title: data.d.results[i].Title,
            start: data.d.results[i].EventDate,//moment(data.d.results[i].EventDate).format("YYYY-MM-DD"),
            end: data.d.results[i].EndDate,//moment(data.d.results[i].EndDate).format("YYYY-MM-DD"),
            backgroundColor: "#448aff",
            borderColor: "#448aff",
            className: "eventClass"
          };
          this.fullCalendarData.push(this.calObj);
        }
      }
      this.loadingGif = '';
      this.calendarOptions = {
        editable: true,
        eventLimit: true,
        contentHeight: 600,
        fixedWeekCount: false,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay,listMonth'
        },
        events: this.fullCalendarData
      };
    })
  }

  sysMaincalendar(): void {
    this.calendarOptions = null; this.calObj = null; this.fullCalendarData = [];
    this.loadingGif = 'show';
    this.url = "/_api/web/lists/getByTitle('IT RSVP')/items?$select=Title,EndDate,EventDate,Event_x0020_Type,StartDate,ID,EndDate0&$filter=StartDate ge datetime'" + this.today.toISOString() + "'";
    this._service.getlistItems(this.url).subscribe((data: any) => {
      this.cal = data.d.results;
      for (let i = 0; i < this.cal.length; i++) {
        if (data.d.results[i].Event_x0020_Type == "System maintenance") {
          this.calObj = {
            title: data.d.results[i].Title,
            start: data.d.results[i].EventDate,//moment(data.d.results[i].EventDate).format("YYYY-MM-DD"),
            end: data.d.results[i].EndDate,//moment(data.d.results[i].EndDate).format("YYYY-MM-DD"),
            backgroundColor: "#11c15b",
            borderColor: "#11c15b",
            className: "eventClass"
          };
          this.fullCalendarData.push(this.calObj);
        }
      }
      this.loadingGif = '';
      this.calendarOptions = {
        editable: true,
        eventLimit: true,
        contentHeight: 600,
        fixedWeekCount: false,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay,listMonth'
        },
        events: this.fullCalendarData
      };
    })
  }

  sDowncalendar(): void {
    this.calendarOptions = null; this.calObj = null; this.fullCalendarData = [];
    this.loadingGif = 'show';
    this.url = "/_api/web/lists/getByTitle('IT RSVP')/items?$select=Title,EndDate,EventDate,Event_x0020_Type,StartDate,ID,EndDate0&$filter=StartDate ge datetime'" + this.today.toISOString() + "'";
    this._service.getlistItems(this.url).subscribe((data: any) => {
      this.cal = data.d.results;
      for (let i = 0; i < this.cal.length; i++) {
        if (data.d.results[i].Event_x0020_Type == "Server down") {
          this.calObj = {
            title: data.d.results[i].Title,
            start: data.d.results[i].EventDate,//moment(data.d.results[i].EventDate).format("YYYY-MM-DD"),
            end: data.d.results[i].EndDate,//moment(data.d.results[i].EndDate).format("YYYY-MM-DD"),
            backgroundColor: "#ff5252",
            borderColor: "#ff5252",
            className: "eventClass"
          };
          this.fullCalendarData.push(this.calObj);
        }
      }
      this.loadingGif = '';
      this.calendarOptions = {
        editable: true,
        eventLimit: true,
        fixedWeekCount: false,
        contentHeight: 600,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay,listMonth'
        },
        events: this.fullCalendarData
      };
    })
  }

  fullCalendar(): void {
    this.calendarOptions = null; this.calObj = null; this.fullCalendarData = [];
    this.loadingGif = 'show';
    this.url = "/_api/web/lists/getByTitle('IT RSVP')/items?$select=Title,EndDate,EventDate,Event_x0020_Type,StartDate,ID,EndDate0&$filter=StartDate ge datetime'" + this.today.toISOString() + "'";
    this._service.getlistItems(this.url).subscribe((data: any) => {
      this.cal = data.d.results;
      for (let i = 0; i < this.cal.length; i++) {
        switch (data.d.results[i].Event_x0020_Type) {
          case "PTO":
            this.calObj = {
              title: data.d.results[i].Title,
              start: data.d.results[i].EventDate,//moment(data.d.results[i].EventDate).format("YYYY-MM-DD"),
              end: data.d.results[i].EndDate,//moment(data.d.results[i].EndDate).format("YYYY-MM-DD"),
              backgroundColor: "#fa8d29",
              borderColor: "#fa8d29",
              className: "eventClass"
            };
            break;
          case "Out of office":
            this.calObj = {
              title: data.d.results[i].Title,
              start: data.d.results[i].EventDate,//moment(data.d.results[i].EventDate).format("YYYY-MM-DD"),
              end: data.d.results[i].EndDate,//moment(data.d.results[i].EndDate).format("YYYY-MM-DD"),
              backgroundColor: "#448aff",
              borderColor: "#448aff",
              className: "eventClass"
            };
            break;
          case "System maintenance":
            this.calObj = {
              title: data.d.results[i].Title,
              start: data.d.results[i].EventDate,//moment(data.d.results[i].EventDate).format("YYYY-MM-DD"),
              end: data.d.results[i].EndDate,//moment(data.d.results[i].EndDate).format("YYYY-MM-DD"),
              backgroundColor: "#11c15b",
              borderColor: "#11c15b",
              className: "eventClass"
            };
            break;
          case "Server down":
            this.calObj = {
              title: data.d.results[i].Title,
              start: data.d.results[i].EventDate,//moment(data.d.results[i].EventDate).format("YYYY-MM-DD"),
              end: data.d.results[i].EndDate,//moment(data.d.results[i].EndDate).format("YYYY-MM-DD"),
              backgroundColor: "#ff5252",
              borderColor: "#ff5252",
              className: "eventClass"
            };
        }
        this.fullCalendarData.push(this.calObj);
      }
      this.loadingGif = '';
      this.calendarOptions = {
        editable: true,
        eventLimit: true,
        fixedWeekCount: false,
        contentHeight: 600,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay,listMonth'
        },
        events: this.fullCalendarData
      };
    })
  }

  eventClick(model: any, template: TemplateRef<any>) {
    // this.modalRef2.hide();
    // this.modalRef2 = null;
    this.modalRef2 = this.modalService.show(
      template,
      { class: 'gray modal-md' }
    );
    model = {
      event: {
        id: model.event.id,
        start: model.event.start,
        end: model.event.end,
        title: model.event.title
      }
    }
    this.displayEvent = model;
    this.url = "/_api/web/lists/getByTitle('IT RSVP')/items?$select=Title,EndDate,EventDate,Location,Event_x0020_Type,StartDate,ID,EndDate0&$filter=ID eq " + this.displayEvent.event.id;
    this._service.getlistItems(this.url).subscribe((data: any) => {
      this.selectedEvent = data.d.results[0];
    });
    console.log(this.displayEvent);
  }

  currentItemInfo(info, template: TemplateRef<any>) {
    this.modalRef3 = this.modalService.show(
      template,
      { class: 'gray modal-md' }
    );

    this.url = "/_api/web/lists/getByTitle('IT RSVP')/items?$select=Title,EndDate,EventDate,Location,Event_x0020_Type,StartDate,ID,EndDate0&$filter=ID eq " + info.ID;
    this._service.getlistItems(this.url).subscribe((data: any) => {
      this.selectedCurrentEvent = data.d.results[0];
    });
  }

  childModel(): void {
    this.modalRef2.hide();
    this.modalRef2 = null;
  }

  mainModel(): void {
    this.modalRef.hide();
    this.modalRef = null;
  }

  calendartemplateModel():void{
    this.modalRef3.hide();
    this.modalRef3 = null;
  }
}

