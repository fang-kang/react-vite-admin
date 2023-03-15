export function findItemByKey<T>(jsonObj: any, key: string, value: any): T | undefined {
  for (const v in jsonObj) {
    const element = jsonObj[v];
    // 1.判断是对象或者数组
    if (typeof element == 'object') {
      const result = findItemByKey(element, key, value);
      if (result) return result as T;
    } else {
      if (v == key) {
        if (element == value) return jsonObj;
      }
    }
  }
}
