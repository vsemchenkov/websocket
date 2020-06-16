import {Component, OnInit, AfterContentInit, Input, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {WebSocketService} from "../web-socket.service";
import {environment} from "../../environments/environment";
import {forkJoin, Observable, of} from "rxjs";
import Global = WebAssembly.Global;
import {MatTree, MatTreeNestedDataSource} from "@angular/material/tree";
import {NestedTreeControl} from "@angular/cdk/tree";

interface scenarioStack {
    name: string,
    device?: string,
    time?: string,
    type?: string,
    children?: scenarioStack[]
}

const TREE_DATA: scenarioStack[] = [
    {
        name: 'ok',
        children: [
            {
                name: 'default 1',
                device: "KMX",
                time: "10",
                type: "normal"
            },
            {
                name: "default 2",
                device: "KMX",
                time: "10",
                type: "normal"
            }
        ]
    },
    {
        name: 'scenarion 2',
        children: [
            {
                name: 'default 1'
            }
        ]
    }
]

@Component({
    selector: 'app-app-module',
    templateUrl: './app-module.component.html',
    styleUrls: ['./app-module.component.scss']
})
export class AppModuleComponent implements OnInit {
    @ViewChild('treeDom') tree: MatTree<any>;
    @Input()selectedIndex: number | null
    ws
    moduleName;
    getData;
    treeControl = new NestedTreeControl<scenarioStack>(node => node.children)
    dataSource = new MatTreeNestedDataSource<scenarioStack>()

    constructor(private route$: ActivatedRoute, private wsService$: WebSocketService) {
        this.dataSource.data = TREE_DATA;
    }

    hasChild = (_: number, node: scenarioStack) => !!node.children && node.children.length > 0;

    url: string = environment.websocket.address + environment.websocket.port

    ngOnInit() {
        this.connectedSocket(this.url).subscribe(data => {
            console.log('Подкиска на подключения', data)
        })
        console.log(
            this.route$.snapshot.paramMap.get('module')
        )

    }

    connectedSocket(url: string) {
        this.ws = new WebSocket(url);
        return new Observable(observer => {
            this.ws.onopen = (e) => {
                console.log('Connection Open')
            }
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
                let ws = this.ws;
                let f = this.connectedSocket(url)
                let interval = setInterval(function () {
                    if (ws.readyState == 3) {
                        location.reload()
                    } else {
                        clearInterval(interval)
                    }
                }, 1000)
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

    private refreshTree(nd): void {
        this.treeControl.collapse(nd);
        this.treeControl.expand(nd);
    }

    addScenario(name: string) {
        this.dataSource.data.push({"name": name, children: []})
        let _data = this.dataSource.data;
        this.dataSource.data = null;
        this.dataSource.data = _data;
    }

    addScenarioDevice(name: string, device: string, time: string, type: string, scenarioName: string) {
        console.group('Scenario event')
        console.log('scenarion Name: ', scenarioName)
        console.log('scenarion Device: ', device)
        console.log('scenarion Time: ', time)
        console.log('scenarion Type: ', type)
        console.groupEnd()
        this.dataSource.data = this.dataSource.data.map(function (current) {
            if(current.name == scenarioName) {
                current.children.push({
                    name: name,
                    device: device,
                    time: time,
                    type: type
                })
            }
            if(current) {
                return current
            }

        })
        let _data = this.dataSource.data;
        this.dataSource.data = null;
        this.dataSource.data = _data;
        console.log(this.dataSource.data)
        console.group('Scenario event')
        // this.dataSource.data.map(current => {
        //     current.children.map( current => {
        //         if(current.name == '123') {
        //             console.log('add obj: ', current)
        //         }
        //     })
        //     return current
        // })
        console.groupEnd()
    }
}
