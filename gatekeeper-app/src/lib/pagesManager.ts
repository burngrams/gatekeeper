import { makeAutoObservable } from 'mobx'

export class PagesManager {
  pages = mockPagesStack

  get page() {
    return this.pages[this.pages.length - 1]
  }

  constructor() {
    makeAutoObservable(this)
  }

  push(page) {
    this.pages.push(page)
  }

  replace(page) {
    this.pages.pop()
    this.push(page)
  }

  isPreviousPage(page) {
    if (this.pages.length < 2) return false
    return this.pages[this.pages.length - 2] === page
  }

  pop() {
    this.pages.pop()
  }

  static pages = {
    intro: 'intro',
    camera: 'camera',
    gatekeeper: 'gatekeeper',
  }
}

const mockPagesStack = [PagesManager.pages.gatekeeper]
const defaultPagesStack = ['intro']

export const pagesManager = new PagesManager()
