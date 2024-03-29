import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Meeting} from "../../../models/meeting.model";
import {TimingService} from "../../../services/timing.service";
import {DatePrecision, DateUtils} from "../../../utils/date-utils";

@Component({
  selector: 'app-schedule-meetings',
  templateUrl: './schedule-meetings.component.html',
  styleUrls: ['./schedule-meetings.component.less']
})
export class ScheduleMeetingsComponent implements OnChanges, OnInit{
  @Input('meetings')meetings: Meeting[] = [];
  @Input('maxMeetings')maxVisibleMeetings = 4;

  private meetingsToday: Meeting[] = [];
  private meetingsTomorrow: Meeting[] = [];

  constructor(private timeService: TimingService){}

  ngOnChanges(changes: SimpleChanges): void {
    this.organizeMeetings();
  }

  ngOnInit(): void {
    this.timeService.tick.subscribe(this.organizeMeetings.bind(this));
  }

  private organizeMeetings() {
    if(!this.meetings)
      return;

    const today = new Date();
    const tomorrow = DateUtils.addDays(new Date(), 1);
    const newToday: Meeting[] = [];
    const newTomorrow: Meeting[] = [];

    let meetingIndex = 0;

    while(meetingIndex < this.meetings.length && newToday.length + newTomorrow.length < this.maxVisibleMeetings){
      if(DateUtils.equal(this.meetings[meetingIndex].startTime, today, DatePrecision.Day)){
        if(this.meetings[meetingIndex].startTime > today){
          newToday.push(this.meetings[meetingIndex]);
        }
      }else if(DateUtils.equal(this.meetings[meetingIndex].startTime, tomorrow, DatePrecision.Day)){
        newTomorrow.push(this.meetings[meetingIndex]);
      }
      meetingIndex++;
    }

    this.meetingsToday = newToday;
    this.meetingsTomorrow = newTomorrow;
  }

}
