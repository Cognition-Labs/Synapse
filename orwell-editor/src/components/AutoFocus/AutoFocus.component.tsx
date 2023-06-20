import LexicalAutoFocusPlugin from '@lexical/react/LexicalAutoFocusPlugin'
import LexicalComposer from '@lexical/react/LexicalComposer'
import styles from './AutoFocus.module.scss'

function onError(error: Error) {
  throw error
}
const autoFocusConfig = {
  onError,
}

export function AutoFocus() {
  return (
    <div className={styles.AutoFocus}>
      <h1>Auto Focus Plugin</h1>
      <LexicalComposer initialConfig={autoFocusConfig}>
        <LexicalAutoFocusPlugin />
      </LexicalComposer>
    </div>
  )
}
