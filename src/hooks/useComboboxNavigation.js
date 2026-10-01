import { useEffect, useId, useMemo, useRef, useState } from 'react'

function hashOption(value) {
  const text = String(value ?? '')
  let hash = 2166136261
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(36)
}

/**
 * Headless ARIA combobox navigation. Focus stays on the input while the active
 * option is exposed through aria-activedescendant.
 */
export default function useComboboxNavigation({
  options = [],
  open,
  onOpenChange,
  onSelect,
  getOptionKey = (option, index) => option?.id ?? option?.value ?? option?.label ?? index,
  selectedKey,
  listboxId,
  defaultActiveIndex = 0,
} = {}) {
  const generatedId = useId()
  const resolvedListboxId = listboxId || `${generatedId}-listbox`
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex)
  const listRef = useRef(null)
  const inputRef = useRef(null)

  const optionIds = useMemo(() => {
    const seen = new Map()
    return options.map((option, index) => {
      const base = hashOption(getOptionKey(option, index))
      const occurrence = seen.get(base) || 0
      seen.set(base, occurrence + 1)
      return `${resolvedListboxId}-option-${base}${occurrence ? `-${occurrence}` : ''}`
    })
  }, [options, getOptionKey, resolvedListboxId])

  useEffect(() => {
    if (!options.length) {
      setActiveIndex(0)
      return
    }
    setActiveIndex((current) => Math.min(Math.max(0, current), options.length - 1))
  }, [options.length])

  useEffect(() => {
    if (!open) return
    const optionId = optionIds[activeIndex]
    if (!optionId) return
    document.getElementById(optionId)?.scrollIntoView?.({ block: 'nearest' })
  }, [activeIndex, open, optionIds])

  function selectIndex(index) {
    const option = options[index]
    if (option === undefined) return false
    onSelect?.(option, index)
    return true
  }

  function onKeyDown(event) {
    const count = options.length
    if (event.key === 'Escape') {
      if (open) {
        event.preventDefault()
        onOpenChange?.(false)
      }
      return
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) {
        const next = event.key === 'ArrowDown' ? 0 : Math.max(0, count - 1)
        setActiveIndex(next)
        onOpenChange?.(true)
        return
      }
      if (!count) return
      const delta = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((current) => (current + delta + count) % count)
      return
    }
    if (!open || !count) return
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      setActiveIndex(event.key === 'Home' ? 0 : count - 1)
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      selectIndex(activeIndex)
    }
  }

  const activeOptionId = open ? optionIds[activeIndex] : undefined
  return {
    activeIndex,
    activeOptionId,
    inputRef,
    listRef,
    listboxId: resolvedListboxId,
    setActiveIndex,
    selectIndex,
    inputProps: {
      ref: inputRef,
      role: 'combobox',
      'aria-expanded': Boolean(open),
      'aria-controls': resolvedListboxId,
      'aria-autocomplete': 'list',
      'aria-activedescendant': activeOptionId,
      onKeyDown,
    },
    listboxProps: {
      id: resolvedListboxId,
      ref: listRef,
      role: 'listbox',
    },
    getOptionProps(index) {
      const option = options[index]
      const key = getOptionKey(option, index)
      return {
        id: optionIds[index],
        role: 'option',
        'aria-selected': selectedKey !== undefined ? key === selectedKey : index === activeIndex,
        onMouseDown: (event) => event.preventDefault(),
        onMouseEnter: () => setActiveIndex(index),
        onClick: () => selectIndex(index),
      }
    },
  }
}

export { useComboboxNavigation }
