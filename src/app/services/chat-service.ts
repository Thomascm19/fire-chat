import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Message } from '../interface/message.interface';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private itemCollections!: AngularFirestoreCollection<Message>;
  public chats: Message[] = [];
  public user: any = {};

  constructor(
    private angularFirestore: AngularFirestore,
    public angularFireAuth: AngularFireAuth) {
      this.angularFireAuth.authState.subscribe(user => {
        if (user){
          this.user.uid = user.uid
          this.user.nombre = user.displayName
        }
      })
     }

  public login(loginMethod: string) {
    if(loginMethod === 'google'){
      this.angularFireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } else if(loginMethod === 'twitter'){
    this.angularFireAuth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
    }
  }

  public logout() {
    this.user = {};
    this.angularFireAuth.signOut();
  }

  public loadMessages(){
    this.itemCollections = this.angularFirestore
      .collection<Message>('chats', ref => ref.orderBy('fecha', 'desc').limit(5));

    return this.getOrderChats()
  }

  public sendMessage(text: string){
    let message: Message = {
      nombre: this.user.nombre,
      mensaje: text,
      fecha: new Date().getTime(),
      uid: this.user.uid
    }
    return this.itemCollections.add(message)
  }

  private getOrderChats() {
    return this.itemCollections.valueChanges().pipe(map((messages: Message[]) => {
      this.chats = [];
      for (let message of messages) {
        this.chats.unshift(message);
      }
      return this.chats;
    }));
  }
}
