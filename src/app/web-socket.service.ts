import {Injectable} from '@angular/core';
import 'rxjs/rx'
import {HttpClient} from "@angular/common/http";
import {Observer, Observable} from "rxjs";
import {WebSocketSubject} from "rxjs/internal-compatibility";

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {

    ws
    getData

    constructor(private _http: HttpClient) {
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
}
