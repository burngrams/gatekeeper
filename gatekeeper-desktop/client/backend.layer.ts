import { strToQRstr, encodeSVGAsDataURI } from './presentation.layer'

export const createQRHandler =
  (id: string): React.FormEventHandler<HTMLFormElement> =>
  async (e) => {
    e.preventDefault()

    // get all fields from form in event
    const form = e.currentTarget
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())
    throw 'TBD'
    const result = await invoke<string>(id, data)
    debugger
    const qrcode = strToQRstr(result)
    const imgEle = document.querySelector<HTMLImageElement>(`#${id} img`)!
    imgEle.src = encodeSVGAsDataURI(qrcode)
  }
