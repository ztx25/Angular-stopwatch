import { Component, OnInit } from '@angular/core';
import { timer, fromEvent, Subscription } from 'rxjs';
import { timeInterval } from 'rxjs/operators';

export interface Timer {
  time: number
  hours: number
  minutes: number
  seconds: number
}

export let initialTimeState: Timer = {
  time: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
}

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss']
})
export class StopwatchComponent implements OnInit {
  timeState = { ...initialTimeState }
  isRunning: boolean = false;
  betweenСlicksInterval: number = 300;
  buttonClick: Subscription;

  toggle(): void {
    this.isRunning = !this.isRunning;
  }

  wait(event: MouseEvent): void {
    this.buttonClick = fromEvent(event.target, 'click')
      .pipe(timeInterval())
        .subscribe(click => {
          if (click.interval < this.betweenСlicksInterval) {
            this.isRunning = false;
          }
          this.buttonClick.unsubscribe()
        })
  }

  reset(): void {
    this.isRunning = false;
    this.timeState = { ...initialTimeState };
  }

  ngOnInit(): void {
    timer(1000, 1000).subscribe(() => {
      if(this.isRunning) {
        this.timeState.time++;
        this.timeState.seconds = Math.floor(this.timeState.time % 3600 % 60);
        this.timeState.minutes = Math.floor(this.timeState.time % 3600 / 60);
        this.timeState.hours = Math.floor(this.timeState.time / 3600);
      }
    });
  }
}