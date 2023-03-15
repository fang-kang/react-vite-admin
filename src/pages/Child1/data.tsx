export async function getData() {
  const arr = [];
  for (let index = 0; index < 400; index++) {
    arr.push({
      key: index,
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    });
  }
  return {
    dataSource: arr,
    total: arr.length,
  };
}
