// via http://matt.might.net/articles/shell-scripts-for-passive-voice-weasel-words-duplicates/

// Example:
// Many readers are not aware that the
// the brain will automatically ignore
// a second instance of the word "the"
// when it starts a new line.
const re = new RegExp('(\\s*)([^\\s]+)', 'gi')
const word = /\w+/

export default function lexicalIllusions(text) {
  const suggestions = []
  let lastMatch = ''
  let lastIndex = 0
  let match

  // eslint-disable-next-line no-cond-assign
  while ((match = re.exec(text))) {
    if (word.test(match[2]) && match[2].toLowerCase() === lastMatch) {
      suggestions.push({
        index: lastIndex,
        offset: match.index + match[1].length + match[2].length - lastIndex,
      })
    }
    lastMatch = match[2].toLowerCase()
    lastIndex = match.index + match[1].length
  }

  return suggestions
}
