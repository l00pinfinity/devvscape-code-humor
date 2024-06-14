import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAgo',
})
export class DateAgoPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value && value.seconds) {
      const seconds = Math.floor(+new Date() / 1000 - value.seconds);
      if (seconds < 30) {
        return 'Just now';
      }
      const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1,
      };
      let counter: string | number;
      for (const i of Object.keys(intervals)) {
        const key = i as keyof typeof intervals;
        counter = Math.floor(seconds / intervals[key]);
        if (counter > 0) {
          if (counter === 1) {
            return counter + ' ' + key + ' ago'; // singular (1 day ago)
          } else {
            return counter + ' ' + key + 's ago'; // plural (2 days ago)
          }
        }
      }
    }
    return value;
  }
}
