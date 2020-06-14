import { Component, OnInit, OnChanges } from '@angular/core';
import { WebSocketService } from "./web-socket.service";
import { environment } from "../environments/environment";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit {
  title = 'x3-soft-admin';

  url;
  ws;
  getData;

  constructor(private websoketService$: WebSocketService) {
  }

  ngOnInit() {
    this.url = environment.websocket.address + environment.websocket.post
    this.connectedSocket(this.url).subscribe(data => {
      console.log(data)
    })
    this.getModules()
  }
  ngOnChanges() {
  }

  connectedSocket(url: string) {
    this.ws = new WebSocket(url);
    return new Observable(observer => {
      this.ws.onmessage = async (e) => {
        console.group('Получено от сервера: ')
        this.getData = e.data
        console.log(e.data)
        console.groupEnd()
      }
      this.ws.error = async (e) => {
        observer.error(e)
        console.log('Error websocket in connection: ', e)
      }
      this.ws.onclose = async (e) => {
        location.reload()
        observer.complete()
        console.log('Close on websocket: ', e)
      }
    })
  }

  sendMessage(object) {
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
      }, 50)

    }
  }

  getModules() {
    let obj = {
      "event": "user",
      "method": "get.system.modules"
    }
    this.sendMessage(obj)
    console.group('Сообщение отправлено на сервер:')
    console.log(obj)
    console.groupEnd();
  }



}
