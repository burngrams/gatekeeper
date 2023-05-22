import { trpcReact } from '.'
import { strToQRstr, encodeSVGAsDataURI } from './presentation.layer'
import QRCode from 'qrcode'

export const formIdToQRImage = async (id: string) => {
  const formEle = document.querySelector<HTMLFormElement>(`#${id} form`)!
  const qrcode = await formToQR(formEle)
  const imgEle = document.querySelector<HTMLImageElement>(`#${id} img`)!
  imgEle.src = qrcode
}

export const formToQR = async (formEle: HTMLFormElement) => {
  const formData = new FormData(formEle)
  const data = Object.fromEntries(formData.entries())
  const json = JSON.stringify(data)
  const qrcode = await QRCode.toDataURL(json)

  return qrcode
}
