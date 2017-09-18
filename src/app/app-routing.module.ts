import { UserResolver } from './user/user.resolver';
import { UserComponent } from './user/user.component';
import { ChatResolver } from './chats/chat-list/chat/chat.resolver';
import { ChatComponent } from './chats/chat-list/chat/chat.component';
import { NewChatComponent } from './chats/chat-list/chat/new-chat/new-chat.component';
import { ChatsComponent } from './chats/chats.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'user', component: UserComponent, resolve: {user: UserResolver}},
  { path: 'chats', component: ChatsComponent, resolve: {chat: ChatResolver}, children: [
      { path: 'new', component: NewChatComponent, resolve: {user: UserResolver} },
      { path: ':id', component: ChatComponent}
  ] }
  /* { path: 'recipes', component: RecipesComponent, children: [
    { path: '', component: RecipeStartComponent },
    { path: 'new', component: RecipeEditComponent },
    { path: ':id', component: RecipeDetailComponent },
    { path: ':id/edit', component: RecipeEditComponent },
  ] },
  { path: 'shopping-list', component: ShoppingListComponent }, */
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
