import generateNavs, { addFullPath, addActives } from './generateNavs'
import yaml from 'js-yaml'

it('should add full path to obj', ()=>{
  const navs = yaml.safeLoad(`
- path: a
  children:
  - name: aB1
    path: ab1
  - name: aB2
    path: ab2
- path: b
  children:
  - name: bB1
    path: bb1
  - name: bB2
    path: bb2
`)
  const result = addFullPath(navs)

  expect(result).toEqual(
    yaml.safeLoad(`
- path: a
  fullpath: /a
  children:
  - name: aB1
    path: ab1
    fullpath: /a/ab1
  - name: aB2
    path: ab2
    fullpath: /a/ab2
- path: b
  fullpath: /b
  children:
  - name: bB1
    path: bb1
    fullpath: /b/bb1
  - name: bB2
    path: bb2
    fullpath: /b/bb2
  `)
  )
})

it('should add active to path', ()=>{
  const navs = yaml.safeLoad(`
- path: a
  fullpath: /a
  children:
  - name: aB1
    path: ab1
    fullpath: /a/ab1
  - name: aB2
    path: ab2
    fullpath: /a/ab2
`)
  const result = addActives(navs, '/a/ab1')

  expect(result).toEqual(
    yaml.safeLoad(`
- path: a
  fullpath: /a
  active: true
  children:
  - name: aB1
    path: ab1
    active: true
    fullpath: /a/ab1
  - name: aB2
    path: ab2
    fullpath: /a/ab2
  `)
  )

})

it('should add fullpath && active to path', () => {
  const navs = yaml.safeLoad(`
- path: a
  children:
  - name: aB1
    path: ab1
  - name: aB2
    path: ab2
- path: b
  children:
  - name: bB1
    path: bb1
  - name: bB2
    path: bb2
`)
  const result = generateNavs(navs, '/a/ab1')

  expect(result).toEqual(
    yaml.safeLoad(`
- path: a
  fullpath: /a
  active: true
  children:
  - name: aB1
    path: ab1
    fullpath: /a/ab1
    active: true
  - name: aB2
    path: ab2
    fullpath: /a/ab2
- path: b
  fullpath: /b
  children:
  - name: bB1
    path: bb1
    fullpath: /b/bb1
  - name: bB2
    path: bb2
    fullpath: /b/bb2
  `)
  )
})

it('should active default path', ()=>{
  const navs = yaml.safeLoad(`
- path: a
  children:
  - name: B
    path: ''
`)

  const result = generateNavs(navs, '/a')

  expect(result).toEqual(yaml.safeLoad(`
- path: a
  fullpath: /a
  active: true
  children:
  - name: B
    path: ''
    fullpath: /a
    active: true
  `))
})
