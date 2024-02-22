import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import {AnimeGame} from "../interfaces/AnimeRespose";
import {Observable, Subject} from "rxjs";

@Injectable()
export class SignalrService {
  connection: any;
  gameData: AnimeGame[] = [];
  nextSubject = new Subject<any>();
  dataSubject = new Subject<any>();
  endGameResult = new Subject();
  constructor() { }
  initConnectionAndListeners(dataMapper: (data: any) => any){
    const protocol = new signalR.JsonHubProtocol();
    const transport = signalR.HttpTransportType.WebSockets;
    const options = {
      transport,
      logMessageContent: true,
      skipNegotiation: true
    };
    // create the connection instance
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7020/gameHub', options)
      .configureLogging(signalR.LogLevel.Information)
      .withHubProtocol(protocol)
      .withAutomaticReconnect([0, 3000, 5000, 10000, 15000, 30000])
      .build();

    this.connection.on('opponentNotFound', (data:any)=>{
    });

    this.connection.on('opponentDisconnected', (data:any)=>{
        this.nextSubject.next('opd');
    });

    this.connection.onreconnecting((error: any) => {
      console.log(`Connection lost due to error "${error}". Reconnecting.`);
      // Here, you can update the UI to inform the user that the connection is being re-established.
    });

// Handle the reconnected event
    this.connection.onreconnected((connectionId: any) => {
      console.log(`Connection reestablished. Connected with connectionId "${connectionId}".`);
      // Here, you can update the UI to inform the user that the connection has been re-established.
    });

    this.connection.on('disconnected', (data:any)=>{
      setTimeout(()=>{
        this.connection.start();
      },2000)
    });

    this.connection.on('gameResult', (data:any)=>{
      this.endGameResult.next(data);
    });

    this.connection.on('registerError', (data:any)=>{
      this.endGameResult.next(data);
    });

    this.connection.on('opponentFound', (data:any)=>{
      this.dataSubject.next(dataMapper(data));
    });

    this.connection.on('nextQuestion', (data:any)=>{
      this.nextSubject.next(null);
    });

  }

  async startConnection(){
    await  this.connection.start()
      .then(() => console.info('SignalR Connected'))
      .catch((err: any) => console.error('SignalR Connection Error: ', err));
  }
  async disconnect(){
    await this.connection.stop()
      .then(() => console.info('SignalR Disconnected'))
      .catch((err: any) => console.error('SignalR Connection Error: ', err));
  }

  async registerPlayer(){
    await this.connection.invoke("RegisterPlayer", localStorage.getItem('jwt'))
      .catch((err: any) => console.error(err));
  }
 async  findOpponent(){
    await this.connection.invoke("FindOpponent")
      .catch((err: any) => console.error(err));
  }

  async  loadState(){
    await this.connection.invoke("LoadState")
      .catch((err: any) => console.error(err));
  }
  async  next(){
    await this.connection.invoke("Next")
      .catch((err: any) => console.error(err));
  }

  async  endGame(result: number){
    await this.connection.invoke("GameEnd", result)
      .catch((err: any) => console.error(err));
  }

}
