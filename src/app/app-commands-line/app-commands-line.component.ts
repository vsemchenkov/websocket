import { Component, OnInit } from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Component({
  selector: 'app-app-commands',
  templateUrl: './app-commands-line.component.html',
  styleUrls: ['./app-commands-line.component.scss']
})
export class AppCommandsLineComponent implements OnInit {

  url;
  ws;
  getData;
  token: number = 1;

  constructor() { }

  ngOnInit(): void {
    this.url = environment.websocket.address + environment.websocket.port
    this.connectedSocket(this.url).subscribe(data => {
      console.log(data)
    })
  }

  connectedSocket(url: string) {
    this.ws = new WebSocket(url);
    return new Observable(observer => {
      this.ws.onmessage = async (e) => {
        console.group('Получено от сервера: ')
        this.getData = JSON.parse(e.data)
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

  setCommand(method: string, params: string) {

    // if(!params) {
    //   alert("Empty params")
    // } else {
    let paramsRefactor = '{' + params + '}'
    paramsRefactor = JSON.parse(paramsRefactor)

    let obj = {
      "JSON-RPC": "2.0",
      "method": method,
      "params": paramsRefactor,
      "id": this.token++
    }
    this.sendMessage(obj)
    // }
  }

}
