import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Snake } from './snake';
import { HeaderComponent } from "./header/header.component";
import { GameComponent } from "./components/game/game.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, GameComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent {
  title = 'angularSnake';
  message: string = "Let's play";
  totalTreats: number = 0;

  changeMessage(newMessage: string){
    this.message = newMessage;
  }

  updateTotalTreats(addTreats: number){
    this.totalTreats = addTreats;
  }
}
