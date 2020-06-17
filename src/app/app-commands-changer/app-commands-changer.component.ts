import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-app-commands-changer',
  templateUrl: './app-commands-changer.component.html',
  styleUrls: ['./app-commands-changer.component.scss']
})
export class AppCommandsChangerComponent implements OnInit {

  url;
  ws;
  getData;
  transition;
  token: number = 1;
  checkedModule
  modules
  moduleInfo
  moduleInfoParams
  ParamsType
  command
  objectKeys = Object.keys;

  ngValue:string = 'default'
  ngValueType:string = 'default'
  ngValueCommand:string = 'default'
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
      this.ws.onmessage = async (e) => {

        console.group('Получено от сервера: ')
        this.transition = JSON.parse(e.data)
        if(this.transition.method == 'get.system.modules') {
          this.transition = this.transition.result.data

          this.modules = this.transition.filter((e) => {
            if(e.active == 1) {
              return e
            } else {}
          })
          console.log(this.modules)
        } else {
          this.getData = JSON.parse(e.data)
          console.log(this.getData)
        }
        if(this.transition.method == 'get.system.moduleinfo') {
          this.moduleInfo = this.transition.result
          this.moduleInfoParams = this.transition.result.params
          console.log(this.moduleInfoParams)
        }
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

 getAllCommands(module: string) {
    if(module == 'Module') {

    } else {
      if(this.checkedModule != module) {
        this.moduleInfo = undefined
        this.ParamsType = undefined
        this.command = undefined
      }
      this.checkedModule = module
      let obj = {
        "JSON-RPC": "2.0",
        "method": "get.system.moduleinfo",
        "params": {
          "module": module
        },
        "id": "9"
      }
      this.sendMessage(obj)
      console.group('Сообщение отправлено на сервер:')
      console.log(obj)
      console.groupEnd();
    }
  }

  getType(type) {
    this.ParamsType = this.moduleInfo[type]
    console.log(this.ParamsType)
  }

  getCommand(commands) {
    this.command = this.ParamsType[commands]
    console.log(this.ParamsType)

  }

  getModules() {
    let obj = {
      "JSON-RPC": "2.0",
      "method": "get.system.modules",
      "params": {},
      "id": "1"
    }
    this.sendMessage(obj)
    console.group('Сообщение отправлено на сервер:')
    console.log(obj)
    console.groupEnd();
  }

  onSubmit(f: NgForm) {
    let params = f.value

    let obj = {
      "JSON-RPC": "2.0",
      "method": `${f.value.typeUniq}.${f.value.moduleUniq}.${f.value.commandUniq}`,
      "params": params,
      "id": this.token++
    }
    delete params['moduleUniq']
    delete params['typeUniq']
    delete params['commandUniq']

    if(params.id) {
      params.id = Number(params.id)
    }
    if(params.uuid) {
      params.uuid = Number(params.uuid)
    }
    if(params.id_target) {
      params.id_target = Number(params.id_target)
    }
    if(params.mid) {
      params.mid = Number(params.mid)
    }
    if(params.delay) {
      params.delay = Number(params.delay)
    }
    if(params.start) {
      params.start = Number(params.start)
    }
    if(params.len) {
      params.len = Number(params.len)
    }

    this.sendMessage(obj)
    console.group('Сообщение отправлено на сервер:')
    console.log(obj)
    console.groupEnd();
  }


}
