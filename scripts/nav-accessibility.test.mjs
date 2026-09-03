import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const source = await readFile(new URL('../src/components/Nav.tsx', import.meta.url), 'utf8')

test('navigation disclosure buttons expose state and controlled menu IDs', () => {
  assert.match(source, /aria-expanded=\{servicesOpen\}/)
  assert.match(source, /aria-controls="desktop-services-menu"/)
  assert.match(source, /id="desktop-services-menu"/)
  assert.match(source, /aria-expanded=\{resourcesOpen\}/)
  assert.match(source, /aria-controls="desktop-resources-menu"/)
  assert.match(source, /id="desktop-resources-menu"/)
  assert.match(source, /aria-expanded=\{open\}/)
  assert.match(source, /aria-controls="mobile-navigation-menu"/)
  assert.match(source, /id="mobile-navigation-menu"/)
})

test('closed mobile navigation is removed from the tab and accessibility trees', () => {
  assert.match(source, /id="mobile-navigation-menu" hidden=\{!open\} aria-hidden=\{!open\}/)
})

test('Escape closes open navigation and restores focus to its disclosure button', () => {
  assert.match(source, /e\.key !== 'Escape'/)
  assert.match(source, /mobileMenuButtonRef\.current\?\.focus\(\)/)
  assert.match(source, /servicesButtonRef\.current\?\.focus\(\)/)
  assert.match(source, /resourcesButtonRef\.current\?\.focus\(\)/)
})

test('navigation buttons do not suppress the global focus-visible outline', () => {
  assert.doesNotMatch(source, /focus:outline-none/)
})
