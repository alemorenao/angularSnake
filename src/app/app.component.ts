import { Conditional } from '@angular/compiler';
import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Snake } from './snake';
import { bindCallback } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent {
  title = 'angularSnake';
  board: number[][] = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 6, 5, 4, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ]
  gameInterval: any;
  speed: number = 120;
  snake: Snake[] = [];
  head!: Snake;
  moveX!: number;
  moveY!: number;
  go: string = "";
  treatsInBelly: number = 0;
  countDown: number = 0;
  isGrowing: boolean = false;
  totalTreats: number = 0;
  message = "Let's play";

  constructor() {
    
    this.findSnake()

    this.head = this.snake.find(part => part.value === 3)!;

    this.plantTreat();

    this.gameInterval = setInterval(() => {
      switch (this.go) {
        case 'ArrowRight':
          if (this.coditionToMove()) {
            this.printBody()
          }
          break;

        case 'ArrowLeft':
          if (this.coditionToMove()) {
            this.printBody()
          }
          break;

        case 'ArrowUp':
          if (this.coditionToMove()) {
            this.printBody()
          }
          break;

        case 'ArrowDown':
          if (this.coditionToMove()) {
            this.printBody()
          }

          break;
        default:
          break;
      }
    }, this.speed);

  }

  findSnake() {
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 16; j++) {
        if (this.board[i][j] > 2) {
          let piece: Snake = {
            value: this.board[i][j],
            posX: i,
            posY: j,
          }
          this.snake.push(piece);
        }
      }
    }
    console.log(this.snake);

    this.snake.sort((a, b) => a.value - b.value)

    console.log(this.snake);

  }

  plantTreat() {
    let x = Math.floor(Math.random() * 16);
    let y = Math.floor(Math.random() * 16);

    if (this.board[x][y] == 0) {
      this.board[x][y] = 2;
    } else
      this.plantTreat()
  }

  /********************************************************************************************************/
  /*****************************************KEY DETECTION**************************************************/
  /********************************************************************************************************/
  direction(event: KeyboardEvent) {
    if (this.message != 'GAME OVER') {
      //Don't repeat key
      if (event.key != this.go) {
        //Pressed key
        switch (event.key) {
          case 'ArrowRight':
            //Can't go right when going left
            if (this.go == 'ArrowLeft') {
              return;
            }
            this.go = "ArrowRight"
            this.moveX = 0
            this.moveY = 1
            break;
          case 'ArrowLeft':
            //Can't go left when goinG right
            if (this.go == 'ArrowRight' || this.go == '') {
              return;
            }
            this.go = "ArrowLeft"
            this.moveX = 0
            this.moveY = -1
            break;
          case 'ArrowUp':
            //Can't go up when going down
            if (this.go == 'ArrowDown') {
              return;
            }
            this.go = "ArrowUp"
            this.moveX = -1
            this.moveY = 0
            break;
          case 'ArrowDown':
            //Can't go down when going up
            if (this.go == 'ArrowUp') {
              return;
            }
            this.go = "ArrowDown"
            this.moveX = 1
            this.moveY = 0
            break;
          default:
            return;
        }
        //this.snakeMoves()
      }
    }
  }

  /********************************************************************************************************/
  /**************************************CONDITIONS TO MOVE************************************************/
  /********************************************************************************************************/
  coditionToMove(): boolean {
    if (this.board[this.head?.posX! + this.moveX][this.head?.posY! + this.moveY] == 1 || this.board[this.head?.posX! + this.moveX][this.head?.posY! + this.moveY] > 3) {
      this.message = "GAME OVER"
      return false
    } else
      //Is there a treat? 
      if (this.board[this.head?.posX! + this.moveX][this.head?.posY! + this.moveY] == 2) {
        this.isGrowing = true;
        this.treatsInBelly++;
        this.countDown = this.snake.length + 1;
        this.totalTreats++;
        this.plantTreat();
      }

    return true
  }
  /********************************************************************************************************/
  /*****************************************UPDATE SNAKE***************************************************/
  /********************************************************************************************************/
  printBody() {
    if (this.countDown > 0) {
      this.countDown--;
    }
    if (!this.isGrowing || this.countDown > 0) {
      this.board[this.snake[this.snake.length - 1].posX][this.snake[this.snake.length - 1].posY] = 0;
    } else {
      if (this.countDown == 0) {
        let newPiece: Snake = {
          value: this.snake.length + 3,
          posX: this.snake[this.snake.length - 1].posX,
          posY: this.snake[this.snake.length - 1].posY,
        }
        this.snake.push(newPiece);
        this.board[newPiece.posX][newPiece.posY] = newPiece.value;
        this.treatsInBelly--;
        if (!this.treatsInBelly) {
          this.isGrowing = false;
        }
      }
    }
    for (let index = this.snake.length - 1; index > 0; index--) {
      this.snake[index].posX = this.snake[index - 1].posX
      this.snake[index].posY = this.snake[index - 1].posY
    }
    this.head.posX += this.moveX;
    this.head.posY += this.moveY;

    for (let index = 0; index < this.snake.length; index++) {
      this.board[this.snake[index].posX][this.snake[index].posY] = index + 3;
    }
  }




  delay(milliseconds: number) {
    return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
    });
  }









  async snakeMoves() {
    /*this.gameInterval = setInterval(() => {
      switch (this.go) {
        case 'ArrowRight':
          if (this.coditionToMove()) {
            this.printBody()
          }  
          break;

        case 'ArrowLeft':
          if (this.coditionToMove()) {
            this.printBody()
          }  
          break;
        
        case 'ArrowUp':
          if (this.coditionToMove()) {
            this.printBody()
          }  
          break;

        case 'ArrowDown':
          if (this.coditionToMove()) {
            this.printBody()
          }
            
          break;
        default:
          break;
      }
    } ,this.speed);*/



    while (this.go == "ArrowRight" && this.coditionToMove()) {
      this.printBody();
      await this.delay(400);
    }

    while (this.go == "ArrowLeft" && this.coditionToMove()) {
      this.printBody();
      await this.delay(400);
    }

    while (this.go == "ArrowDown" && this.coditionToMove()) {
      this.printBody();
      await this.delay(400);
    }

    while (this.go == "ArrowUp" && this.coditionToMove()) {
      this.printBody();
      await this.delay(400);
    }
  }
  //As long as my snake's pos doesn't hit a wall it keeps moving

  newGame() {
    location.reload()
  }

}
