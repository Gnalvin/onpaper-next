export function formatRedText(searchText: string, fullText: string) {
  const re = new RegExp(`^${searchText}.*?`, 'g')
  const strList = fullText.split(re)
  return strList.join('<span style="color:red;">' + searchText + '</span>')
}
