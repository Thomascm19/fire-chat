import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat-service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: [
  ]
})
export class ChatComponent implements OnInit {
  message: string = "";
  element: any;
  constructor(public chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.loadMessages()
    .subscribe(() => {
      setTimeout(() => {
        this.element.scrollTop =this.element.scrollHeight;
      }, 20)
    })

    this.element = document.getElementById('app-mensajes');
  }

  sendMessage() {
    if(this.message.length > 0) {
      this.chatService.sendMessage(this.message)
      .then(() => this.message = '' )
        .catch(
          (err) => console.error('Error al enviar el mensaje', err));
    }
  }
}
