/**
 * 调整滚动条的封装方法
 */
export function onWindowResize(value: number) {
  // 35 header 26 tabs
  const parentHeight = window.innerHeight - 35 - 26;
  const contentrDoms = document.querySelectorAll('.layoutsContent') as any;
  if (undefined !== contentrDoms && contentrDoms.length > 0) {
    const layoutsContent = contentrDoms[0];
    const headerDoms = document.querySelectorAll('.layoutsHeader') as any;
    const headerHeight = headerDoms[0].offsetHeight;
    layoutsContent.style.height = `${parentHeight - headerHeight - 10}px`;
    const tableHeight = layoutsContent.offsetHeight - value;
    return tableHeight;
  }
}
