import LexicalComposer from '@lexical/react/LexicalComposer'
import { useEffect, useState } from 'react'

import { isDevPlayground } from './appSettings'
import { SettingsContext, useSettings } from './context/SettingsContext'
import { SharedHistoryContext } from './context/SharedHistoryContext'
import Editor from './Editor'
import logo from './images/logo.svg'
import PlaygroundNodes from './nodes/PlaygroundNodes'
// import TestRecorderPlugin from './plugins/TestRecorderPlugin'
import TypingPerfPlugin from './plugins/TypingPerfPlugin'
import Settings from './Settings'
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme'
import { Navigation } from '@components/Navigation'
import ReactGA from 'react-ga4'

function App(): JSX.Element {
  const { settings } = useSettings()
  const { measureTypingPerf } = settings

  const TRACKING_ID = 'G-RDG8VBYEMF'
  ReactGA.initialize(TRACKING_ID)

  const [isEditMode, setIsEditMode] = useState(true)

  // useEffect isEditMode using google analytics
  useEffect(() => {
    ReactGA.event({
      category: 'user action',
      action: 'isEditMode',
      // label: 'your label', // optional
      value: isEditMode ? 1 : 0, // optional, must be a number
      // nonInteraction: true, // optional, true/false
      // transport: 'xhr', // optional, beacon/xhr/image
    })
  }, [isEditMode])

  const initialConfig = {
    namespace: 'PlaygroundEditor',
    nodes: [...PlaygroundNodes],
    onError: (error) => {
      throw error
    },
    theme: PlaygroundEditorTheme,
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <SharedHistoryContext>
        <nav>
          <ul className="flex items-center justify-start p-0 space-x-4 list-none">
            <li
              className={`px-4 py-2 no-underline bg-transparent rounded-full focus:outline-none transition-colors duration-200 ${
                !isEditMode
                  ? ' text-black font-medium'
                  : 'text-gray-500 hover:text-black focus:text-black'
              }`}
              onClick={() => setIsEditMode(false)}
            >
              Write
            </li>
            <li
              className={`px-4 py-2 no-underline bg-transparent rounded-full focus:outline-none transition-colors duration-200 ${
                isEditMode
                  ? ' text-black font-medium'
                  : 'text-gray-500 hover:text-black focus:text-black'
              }`}
              onClick={() => setIsEditMode(true)}
            >
              Edit
            </li>
          </ul>
        </nav>
        <div className="h-full editor-shell">
          <Editor isEditMode={isEditMode} />
        </div>
        {/* TODO: Add back in. I commented out the settings because I don't need it yet */}
        {/* <Settings /> */}
        {/* {isDevPlayground && <TestRecorderPlugin />} */}
        {/* {measureTypingPerf && <TypingPerfPlugin />} */}
      </SharedHistoryContext>
    </LexicalComposer>
  )
}

export function PlaygroundApp(): JSX.Element {
  return (
    <SettingsContext>
      <App />
    </SettingsContext>
  )
}
