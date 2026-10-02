// @vitest-environment node
import React from 'react'
import { renderToString } from 'react-dom/server'
import { expect, test, vi } from 'vitest'
import RucField from '../src/components/RucField.jsx'
import CityAutocomplete from '../src/components/CityAutocomplete.jsx'

test.each([
  ['RucField', <RucField value="80012345-6" consultar={() => Promise.resolve(null)} />],
  ['CityAutocomplete', <CityAutocomplete value="Luque" buscar={() => Promise.resolve([])} />],
])('%s renders on the server without layout-effect warnings or provider work', (name, node) => {
  expect(typeof window).toBe('undefined')
  const warnings = vi.spyOn(console, 'error').mockImplementation(() => {})
  const provider = vi.fn(node.props.consultar || node.props.buscar)
  try {
    const html = renderToString(React.cloneElement(node, name === 'RucField' ? { consultar: provider } : { buscar: provider }))
    expect(html).toContain('<input')
    expect(provider).not.toHaveBeenCalled()
    expect(warnings).not.toHaveBeenCalled()
  } finally { warnings.mockRestore() }
})
