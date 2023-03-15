import dayjs, { Dayjs } from 'dayjs';

export class OADate {
  static typeIdx = {
    Y: 1,
    M: 2,
    D: 3,
    H: 4,
    m: 5,
    s: 6,
  };

  static decode(
    date: string | number,
    /**
     * 格式化到那个部位
     */
    type: 'Y' | 'M' | 'D' | 'H' | 'm' | 's' = 's'
  ): string {
    if (!date) {
      return '';
    }
    const idx = OADate.typeIdx[type] || 6;
    return `${date}`.replace(
      /(\d{4})(\d{2})(\d{2})?(\d{2})?(\d{2})?(\d{2})?/,
      '$1-$2-$3 $4:$5:$6'.replace(RegExp(`${idx}.*$`), `${idx}`)
    );
  }

  static encode(
    date: string | number | Dayjs,
    /**
     * 格式化到那个部位
     */
    type: 'Y' | 'M' | 'D' | 'H' | 'm' | 's' = 's'
  ): string | null {
    if (!date) {
      return null;
    }
    const format = 'YYYYMMDDHHmmss'.replace(RegExp(`^(.*${type}{2,4}).*$`), (m, $1) => $1);
    if (typeof date === 'string' || typeof date === 'number') {
      return dayjs(date).format(format);
    }
    return date.format(format);
  }

  static duration(date1: string | number, date2 = new Date()) {
    if (!date1) {
      return '0';
    }
    const diff = new Date(date2).getTime() - new Date(OADate.decode(date1)).getTime();
    return parseInt(String(diff / (24 * 60 * 60 * 1000)), 10);
  }
}
