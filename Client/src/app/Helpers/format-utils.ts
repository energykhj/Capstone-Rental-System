import { customCurrencyMaskConfig } from 'src/environments/environment';

export class FormatUtils {
  static formatDate(date) {
    var retDate = new Date(date);
    return retDate.toLocaleDateString('en-US');
  }

  static formatCurrency(value) {
    if (value) {
      return customCurrencyMaskConfig.prefix + value.toFixed(customCurrencyMaskConfig.precision);
    } else {
      return null;
    }
  }

  // a and b are javascript Date objects
  static dateDiffInDays(a, b) {
    var date1 = new Date(a);
    var date2 = new Date(b);

    // Discard the time and time-zone information.
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

    return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
  }

  // a and b are javascript Date objects
  static dateDiffInHours(a, b) {
    var date1 = new Date(a);
    var date2 = new Date(b);

    // Discard the time and time-zone information.
    const utc1 = Date.UTC(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate(),
      date1.getHours(),
      date1.getMinutes(),
      date1.getSeconds()
    );
    const utc2 = Date.UTC(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate(),
      date2.getHours(),
      date2.getMinutes(),
      date2.getSeconds()
    );

    return Math.floor((utc2 - utc1) / (1000 * 60 * 60));
  }

  // a and b are javascript Date objects
  static dateDiffInMins(a, b) {
    var date1 = new Date(a);
    var date2 = new Date(b);

    // Discard the time and time-zone information.
    const utc1 = Date.UTC(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate(),
      date1.getHours(),
      date1.getMinutes(),
      date1.getSeconds()
    );
    const utc2 = Date.UTC(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate(),
      date2.getHours(),
      date2.getMinutes(),
      date2.getSeconds()
    );

    return Math.floor((utc2 - utc1) / (1000 * 60));
  }
}
