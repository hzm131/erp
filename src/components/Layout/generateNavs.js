import _cloneDeep from 'lodash/cloneDeep'

const _addFullPath = rootPath => v => {
  if(v.path){
    v.fullpath = rootPath + '/' + v.path
  } else {
    v.fullpath = rootPath
  }

  if (v.children) {
    v.children.forEach(_addFullPath(v.fullpath))
  }

  return v
}

export function addFullPath(navs) {
  navs.forEach(_addFullPath(''))

  return navs
}

const _addActives = pathname => v => {
  const isMatched = pathname.startsWith(v.fullpath)
  //console.log(pathname, v.fullpath, isMatched)

  if (isMatched) {
    v.active = true

    if (v.children) {
      v.children.forEach(_addActives(pathname))
    }
  }
}

export function addActives(navs, pathname) {
  navs.forEach(_addActives(pathname))

  return navs
}

/**
 * 通过pathname 高亮topbar 和 sidebar
 */
export default function generateNavs(navObj, pathname) {
  const navs = _cloneDeep(navObj)

  addFullPath(navs)
  addActives(navs, pathname)

  return navs
}
