import { useCallback, useEffect, useMemo } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $getRoot,
  COMMAND_PRIORITY_HIGH,
  KEY_ENTER_COMMAND,
  LexicalCommand,
  createCommand,
} from 'lexical'
import { $createStickyNode } from '../nodes/StickyNode'
import ReactGA from 'react-ga4'

export const STICKY_COMMAND: LexicalCommand<KeyboardEvent> = createCommand()

const GlobalEventsPlugin = () => {
  const [editor] = useLexicalComposerContext()

  editor.registerCommand(
    STICKY_COMMAND,
    (event) => {
      editor.update(() => {
        const root = $getRoot()
        const stickyNode = $createStickyNode(800, 0)
        root.append(stickyNode)
      })
      ReactGA.event({
        category: 'user action',
        action: 'create sticky',
        // label: 'your label', // optional
        // value: isEditMode ? 1 : 0, // optional, must be a number
        // nonInteraction: true, // optional, true/false
        // transport: 'xhr', // optional, beacon/xhr/image
      })
    },
    COMMAND_PRIORITY_HIGH
  )

  const onCtrlEnter = useCallback(
    (event) => {
      if (event.ctrlKey || event.metaKey) {
        editor.dispatchCommand(STICKY_COMMAND, event)
      }
      return true
    },
    [editor]
  )

  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      onCtrlEnter,
      COMMAND_PRIORITY_HIGH
    )
  }, [editor, onCtrlEnter])

  return null
}

const GlobalEventsPluginMemo = () => {
  const plugin = useMemo(() => <GlobalEventsPlugin />, [])
  return plugin
}

export default GlobalEventsPluginMemo
