import QRCode from 'qrcode'

export function getFormData(id: string) {
  const formEle = document.querySelector<HTMLFormElement>(`#${id} form`)!
  const formData = new FormData(formEle)
  const data = Object.fromEntries(formData.entries())
  return data
}

export const formIdToQRImage = async (id: string) => {
  const data = getFormData(id)
  await setImg(id, data)
}

export const setImg = async (id: string, data: any) => {
  const json = JSON.stringify(data)
  const qrcode = await QRCode.toDataURL(json)

  const imgEle = document.querySelector<HTMLImageElement>(`#${id} img`)!
  imgEle.src = qrcode
}
