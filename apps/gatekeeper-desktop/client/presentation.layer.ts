export function strToQRstr(invokeResult: string) {
  const decoded = atob(invokeResult)
  return decoded.replace('<?xml version="1.0" standalone="yes"?>', '')
}
export function encodeSVGAsDataURI(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
