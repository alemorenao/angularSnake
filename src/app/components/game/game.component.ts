import { Component, EventEmitter, Output, inject } from '@angular/core';
import { Snake } from '../../snake';
import { boards } from '../../services/boards';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
  boardService = inject(boards)
  level : number = +sessionStorage.getItem('level')!
  board: number[][] = this.boardService.getBoard(this.level)
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
  movementsArray: string[] = []
  @Output() messages = new EventEmitter<string>();
  @Output() addTreats = new EventEmitter<number>();

  constructor() {

    if(sessionStorage.getItem('level') == null){
      sessionStorage.setItem('level', '0')
    }
    
    this.findSnake()

    this.plantTreat();

  }
  /********************************************************************************************************/
  /******************************************FIND SNAKE****************************************************/
  /********************************************************************************************************/
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

    this.snake.sort((a, b) => a.value - b.value)

    this.head = this.snake.find(part => part.value === 3)!;


  }
  /********************************************************************************************************/
  /*****************************************RANDOM TREAT***************************************************/
  /********************************************************************************************************/
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
  onKeyDown(event: KeyboardEvent) {
    if(!event.repeat){
      this.movementsArray.push(event.key);
    }


    
    if (this.message != 'GAME OVER' && this.movementsArray[0] != this.go && !event.repeat) {
      console.log(this.movementsArray);
      if (!this.gameInterval) {
        this.gameInterval = setInterval(() => {

          //Pressed key
          switch (this.movementsArray[0]) {
            case 'ArrowRight':
              //Can't go right when going left
              if (this.go == 'ArrowLeft') {
                break;
              }
              this.go = "ArrowRight"
              this.moveX = 0
              this.moveY = 1
              break;
            case 'ArrowLeft':
              //Can't go left when going right
              if (this.go == '') {
                this.movementsArray.shift()
                return;
              }else
              if (this.go == 'ArrowRight') {
                break;
              }
              this.go = "ArrowLeft"
              this.moveX = 0
              this.moveY = -1
              break;
            case 'ArrowUp':
              //Can't go up when going down
              if (this.go == 'ArrowDown') {
                break;
              }
              this.go = "ArrowUp"
              this.moveX = -1
              this.moveY = 0
              break;
            case 'ArrowDown':
              //Can't go down when going up
              if (this.go == 'ArrowUp') {
                break;
              }
              this.go = "ArrowDown"
              this.moveX = 1
              this.moveY = 0
              break;
            default:
              this.movementsArray.shift()
              return;
          }
          if (this.movementsArray.length > 1) {
            this.movementsArray.shift()
          }


          if (this.coditionToMove()) {
            this.printBody()
          }




        }, this.speed)
      }
    }
  }
  /********************************************************************************************************/
  /**************************************CONDITIONS TO MOVE************************************************/
  /********************************************************************************************************/
  coditionToMove(): boolean {
    //If there are no walls

    //If right-end of board and going right
    if(this.head?.posY! == 15 && this.moveY == 1){
      this.moveY = -15
    }

    //If left-end of board and going left
    if(this.head?.posY! == 0 && this.moveY == -1){
      this.moveY = 15
    }
    

    //If lower-end of board and going down
    if(this.head?.posX! == 15 && this.moveX == 1){
      this.moveX = -15
    }

    //If upper-end of board and going up
    if(this.head?.posX! == 0 && this.moveX == -1){
      this.moveX = 15
    }
    
    
    if (this.board[this.head?.posX! + this.moveX][this.head?.posY! + this.moveY] == 1 || this.board[this.head?.posX! + this.moveX][this.head?.posY! + this.moveY] > 3) {
      this.message = "GAME OVER"
      this.messages.emit(this.message)
      clearInterval(this.gameInterval)
      return false
    } else
      //Is there a treat? 
      if (this.board[this.head?.posX! + this.moveX][this.head?.posY! + this.moveY] == 2) {
        this.isGrowing = true;
        this.treatsInBelly++;
        this.countDown = this.snake.length + 1;
        this.totalTreats++;
        if (this.totalTreats == 5) {
          this.message = "NEW LEVEL"
          this.level++;
          sessionStorage.setItem('level',this.level.toString())
          this.newGame()
        }
        this.addTreats.emit(this.totalTreats)
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
  /********************************************************************************************************/
  /*******************************************NEW GAME*****************************************************/
  /********************************************************************************************************/
  newGame() {
    location.reload()
  }
  /********************************************************************************************************/
  /*******************************************NEW LEVEL****************************************************/
  /********************************************************************************************************/
  nextLevel() {
    this.board = this.boardService.getBoard(this.level)
  }
}
