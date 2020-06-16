import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from "@angular/router";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-app-commands-changer',
  templateUrl: './app-commands-changer.component.html',
  styleUrls: ['./app-commands-changer.component.scss']
})
export class AppCommandsChangerComponent implements OnInit {

  url;
  ws;
  getData;
  token: number = 1;
  modules

  Change

  constructor(private route$: ActivatedRoute) {

  }

  ngOnInit() {
    this.url = environment.websocket.address + environment.websocket.port
    this.connectedSocket(this.url).subscribe(data => {
      console.log(data)
    })
    this.getModules()
  }

  connectedSocket(url: string) {
    this.ws = new WebSocket(url);
    return new Observable(observer => {
      this.ws.onopen = (e) => {
        console.log("Поключились от команд",e)
      }
      this.ws.onmessage = async (e) => {
        console.group('Получено от сервера: ')
        if(e.data.method == 'get.system.modules') {
          this.modules = JSON.parse(e.data)
        } else {
          this.getData = JSON.parse(e.data)
        }
        console.log(e.data)
        console.groupEnd()
      }
      this.ws.error = async (e) => {
        observer.error(e)
        console.log('Error websocket in connection: ', e)
      }
      this.ws.onclose = async (e) => {
        // location.reload()
        observer.complete()
        console.log('Close on websocket: ', e)
      }
    })
  }
  sendMessage(object) {
    console.log(this.ws)
    let ws = this.ws
    if (this.ws.readyState == 1) {
      setTimeout(function () {
        let obj = JSON.stringify(object);
        ws.send(obj)
      }, 200)
    } else {
      let interval = setInterval(function () {
        if (ws.readyState == 1) {
          let obj = JSON.stringify(object);
          ws.send(obj)
          clearInterval(interval)
        } else {
          console.log('not ready state')
        }
      }, 500)

    }
  }

 getAllCommands() {

    let obj = {
      "JSON-RPC": "2.0",
      "method": "get.system.moduleinfo",
      "params": {
        "module": ''
      },
      "id": "1"
    }
    // this.sendMessage(obj)
    console.group('Сообщение отправлено на сервер:')
    console.log(obj)
    console.groupEnd();
  }

  getModules() {
    let obj = {
      "JSON-RPC": "2.0",
      "method": "get.system.modules",
      params: {},
      "id": "2"
    }
    this.sendMessage(obj)
    console.group('Сообщение отправлено на сервер:')
    console.log(obj)
    console.groupEnd();
  }

}
