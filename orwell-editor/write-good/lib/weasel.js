var weasels = [
  'are a number',
  'clearly',
  'completely',
  'exceedingly',
  'excellent',
  'extremely',
  'fairly',
  'few',
  'huge',
  'interestingly',
  'is a number',
  'largely',
  'many',
  'mostly',
  'obviously',
  'quite',
  'relatively',
  'remarkably',
  'several',
  'significantly',
  'substantially',
  'surprisingly',
  'tiny',
  'various',
  'vast',
  'very',
]
// Allow "too many" and "too few"
var exceptions = ['many', 'few']

var re = new RegExp('\\b(' + weasels.join('|') + ')\\b', 'gi')

export default function weaselWords(text, opts) {
  var suggestions = []
  let match
  while ((match = re.exec(text))) {
    var weasel = match[1].toLowerCase() // Updated this line to use match[1] instead of match[0]
    if (
      exceptions.indexOf(weasel) === -1 ||
      text.substr(match.index - 4, 4) !== 'too '
    ) {
      suggestions.push({
        index: match.index + (match[0].length - match[1].length), // Updated this line to correctly set the index
        offset: weasel.length,
      })
    }
  }
  return suggestions
}
