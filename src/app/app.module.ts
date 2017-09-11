import { ChatService } from './chats/chat-list/chat/chat.service';
import { AuthService } from './auth/auth.service';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { MessageListComponent } from './chats/message-list/message-list.component';
import { MessageComponent } from './chats/message-list/message/message.component';
import { ChatListComponent } from './chats/chat-list/chat-list.component';
import { ChatComponent } from './chats/chat-list/chat/chat.component';
import { ChatsComponent } from './chats/chats.component';
import { NewChatComponent } from './chats/chat-list/chat/new-chat/new-chat.component';
import { MessageInputComponent } from './chats/message-list/message/message-input/message-input.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    LogoutComponent,
    MessageListComponent,
    MessageComponent,
    ChatListComponent,
    ChatComponent,
    ChatsComponent,
    NewChatComponent,
    MessageInputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpModule,
    NgbModule.forRoot()
  ],
  providers: [AuthService, ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
