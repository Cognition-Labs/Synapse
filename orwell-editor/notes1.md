# Fake Hemingway

## Problems

- The complex and hard sentences don't show up in the output
- The counter and the readability aren't in the UI.

## Structure

- The App has an input and output field and a button. I want a counter and a readability score on the right side bar.
  - The output has

### Initial prompt for the project:

The following is a mockup of the Hemingway editor. I have an html file and a css file. Assume that the javascript file exists and works. I will give function headers for that file so that you know the functionality. I want to turn this into a React app with tailwind css. It should maintain a visual hierarchy and be responsive. It should not distract the user and hinder them from thinking about the writing. All of the functionality regarding the adverb, passive, complex, hardSentence, veryHardSentence should be maintained. There should be a right side bar which should have the readability of the writing and a counter for the functionality previously mentioned. The readability score is not implemented in the html, but the functionality is in the js file, so you should be able to implement it.

index.html

<link rel="stylesheet" href="index.css">
<title>The Orwell Editor</title>
<div>
  <h1>The Orwell Editor</h1>
  <div id="left">
    <textarea name="" id="text-area" rows="10"></textarea>
    <button onclick="format()">Test Me</button>
    <div id="output"></div>
  </div>
  <div id="right">
    <div id="adverb" class="adverb counter"></div>
    <div id="passive" class="passive counter"></div>
    <div id="complex" class="complex counter"></div>
    <div id="hardSentence" class="hardSentence counter"></div>
    <div id="veryHardSentence" class="veryHardSentence counter"></div>
  </div>

</div>
<script src="index.js"></script>

index.css
.adverb {
background: #c4e3f3;
}
.qualifier {
background: #c4e3f3;
}
.passive {
background: #c4ed9d;
}
.complex {
background: #e3b7e8;
}
.hardSentence {
background: #f7ecb5;
}
.veryHardSentence {
background: #e4b9b9;
}
#text-area,
#output {
width: 100%;
}
#left {
width: 75%;
position: absolute;
left: 2.5%;
}
#right {
width: 20%;
position: absolute;
right: 2.5%;
}
.counter {
position: relative;
padding: 5% 5%;
margin: 5% 0 0 5%;
border-radius: 8px;
}

index.js

```js


Implement the logic of the editor using the index.js file below. It should be modularized so that it works in the React code you have provided.

index.js
(function() {
  let inputArea = document.getElementById("text-area");
  let text = `The app highlights lengthy, complex sentences and common errors; if you see a yellow sentence, shorten or split it. If you see a red highlight, your sentence is so dense and complicated that your readers will get lost trying to follow its meandering, splitting logic - try editing this sentence to remove the red.
You can utilize a shorter word in place of a purple one. Mouse over them for hints.
Adverbs and weakening phrases are helpfully shown in blue. Get rid of them and pick words with force, perhaps.
Phrases in green have been marked to show passive voice.
You can format your text with the toolbar.
Paste in something you're working on and edit away. Or, click the Write button and compose something new.`;
  inputArea.value = text;

  let data = {
    paragraphs: 0,
    sentences: 0,
    words: 0,
    hardSentences: 0,
    veryHardSentences: 0,
    adverbs: 0,
    passiveVoice: 0,
    complex: 0
  };

  function format() {
    data = {
      paragraphs: 0,
      sentences: 0,
      words: 0,
      hardSentences: 0,
      veryHardSentences: 0,
      adverbs: 0,
      passiveVoice: 0,
      complex: 0
    };
    ("use strict");
    let inputArea = document.getElementById("text-area");
    let text = inputArea.value;
    let paragraphs = text.split("\n");
    let outputArea = document.getElementById("output");
    let hardSentences = paragraphs.map(p => getDifficultSentences(p));
    let inP = hardSentences.map(para => `<p>${para}</p>`);
    data.paragraphs = paragraphs.length;
    console.log(data);
    counters();
    outputArea.innerHTML = inP.join(" ");
  }
  window.format = format;
  format();

  function counters() {
    document.querySelector("#adverb").innerHTML = `You have used ${
      data.adverbs
    } adverb${data.adverbs > 1 ? "s" : ""}. Try to use ${Math.round(
      data.paragraphs / 3
    )} or less`;
    document.querySelector(
      "#passive"
    ).innerHTML = `You have used passive voice ${data.passiveVoice} time${
      data.passiveVoice > 1 ? "s" : ""
    }. Aim for ${Math.round(data.sentences / 5)} or less.`;
    document.querySelector("#complex").innerHTML = `${data.complex} phrase${
      data.complex > 1 ? "s" : ""
    } could be simplified.`;
    document.querySelector("#hardSentence").innerHTML = `${
      data.hardSentences
    } of ${data.sentences} sentence${
      data.sentences > 1 ? "s are" : " is"
    } hard to read`;
    document.querySelector("#veryHardSentence").innerHTML = `${
      data.veryHardSentences
    } of ${data.sentences} sentence${
      data.sentences > 1 ? "s are" : " is"
    } very hard to read`;
  }

  function getDifficultSentences(p) {
    let sentences = getSentenceFromParagraph(p + " ");
    data.sentences += sentences.length;
    let hardOrNot = sentences.map(sent => {
      let cleanSentence = sent.replace(/[^a-z0-9. ]/gi, "") + ".";
      let words = cleanSentence.split(" ").length;
      let letters = cleanSentence.split(" ").join("").length;
      data.words += words;
      sent = getAdverbs(sent);
      sent = getComplex(sent);
      sent = getPassive(sent);
      sent = getQualifier(sent);
      let level = calculateLevel(letters, words, 1);
      if (words < 14) {
        return sent;
      } else if (level >= 10 && level < 14) {
        data.hardSentences += 1;
        return `<span class="hardSentence">${sent}</span>`;
      } else if (level >= 14) {
        data.veryHardSentences += 1;
        return `<span class="veryHardSentence">${sent}</span>`;
      } else {
        return sent;
      }
    });

    return hardOrNot.join(" ");
  }

  function getPassive(sent) {
    let originalWords = sent.split(" ");
    let words = sent
      .replace(/[^a-z0-9. ]/gi, "")
      .toLowerCase()
      .split(" ");
    let ed = words.filter(word => word.match(/ed$/));
    if (ed.length > 0) {
      ed.forEach(match => {
        originalWords = checkPrewords(words, originalWords, match);
      });
    }
    return originalWords.join(" ");
  }

  function checkPrewords(words, originalWords, match) {
    let preWords = ["is", "are", "was", "were", "be", "been", "being"];
    let index = words.indexOf(match);
    if (preWords.indexOf(words[index - 1]) >= 0) {
      data.passiveVoice += 1;
      originalWords[index - 1] =
        '<span class="passive">' + originalWords[index - 1];
      originalWords[index] = originalWords[index] + "</span>";
      let next = checkPrewords(
        words.slice(index + 1),
        originalWords.slice(index + 1),
        match
      );
      return [...originalWords.slice(0, index + 1), ...next];
    } else {
      return originalWords;
    }
  }

  function getSentenceFromParagraph(p) {
    let sentences = p
      .split(". ")
      .filter(s => s.length > 0)
      .map(s => s + ".");
    return sentences;
  }

  function calculateLevel(letters, words, sentences) {
    if (words === 0 || sentences === 0) {
      return 0;
    }
    let level = Math.round(
      4.71 * (letters / words) + 0.5 * words / sentences - 21.43
    );
    return level <= 0 ? 0 : level;
  }

  function getAdverbs(sentence) {
    let lyWords = getLyWords();
    return sentence
      .split(" ")
      .map(word => {
        if (
          word.replace(/[^a-z0-9. ]/gi, "").match(/ly$/) &&
          lyWords[word.replace(/[^a-z0-9. ]/gi, "").toLowerCase()] === undefined
        ) {
          data.adverbs += 1;
          return `<span class="adverb">${word}</span>`;
        } else {
          return word;
        }
      })
      .join(" ");
  }

  function getComplex(sentence) {
    let words = getComplexWords();
    let wordList = Object.keys(words);
    wordList.forEach(key => {
      sentence = findAndSpan(sentence, key, "complex");
    });
    return sentence;
  }

  function findAndSpan(sentence, string, type) {
    let index = sentence.toLowerCase().indexOf(string);
    let a = { complex: "complex", qualifier: "adverbs" };
    if (index >= 0) {
      data[a[type]] += 1;
      sentence =
        sentence.slice(0, index) +
        `<span class="${type}">` +
        sentence.slice(index, index + string.length) +
        "</span>" +
        findAndSpan(sentence.slice(index + string.length), string, type);
    }
    return sentence;
  }

  function getQualifier(sentence) {
    let qualifiers = getQualifyingWords();
    let wordList = Object.keys(qualifiers);
    wordList.forEach(key => {
      sentence = findAndSpan(sentence, key, "qualifier");
    });
    return sentence;
  }

  function getQualifyingWords() {
    return {
      "i believe": 1,
      "i consider": 1,
    };
  }

  function getLyWords() {
    return {
      actually: 1,
      additionally: 1,
      allegedly: 1,
      ally: 1,
    };
  }

  function getComplexWords() {
    return {
      "a number of": ["many", "some"],
      abundance: ["enough", "plenty"],
      "accede to": ["allow", "agree to"],
    };
  }

  function getJustifierWords() {
    return {
      "i believe": 1,
      "i consider": 1,
    };
  }
})();
```

Please redo the UI to follow a visual hierarchy more closely. It is not a pleasant experience to use the current design. Also, create the sidebar with dummy data to demonstrate the UI. This requires care and careful thought because it is the most visually complex part of the app. Be sure to take advantage of the tailwind CSS that is included.

- bad prompt

### Adding functionality

Implement the logic of the editor using the index.js file below. It should be modularized so that it works in the React code you have provided.

index.js

```js

Implement the logic of the editor using the index.js file below. It should be modularized so that it works in the React code you have provided.

index.js
(function() {
  let inputArea = document.getElementById("text-area");
  let text = `The app highlights lengthy, complex sentences and common errors; if you see a yellow sentence, shorten or split it. If you see a red highlight, your sentence is so dense and complicated that your readers will get lost trying to follow its meandering, splitting logic - try editing this sentence to remove the red.
You can utilize a shorter word in place of a purple one. Mouse over them for hints.
Adverbs and weakening phrases are helpfully shown in blue. Get rid of them and pick words with force, perhaps.
Phrases in green have been marked to show passive voice.
You can format your text with the toolbar.
Paste in something you're working on and edit away. Or, click the Write button and compose something new.`;
  inputArea.value = text;

  let data = {
    paragraphs: 0,
    sentences: 0,
    words: 0,
    hardSentences: 0,
    veryHardSentences: 0,
    adverbs: 0,
    passiveVoice: 0,
    complex: 0
  };

  function format() {
    data = {
      paragraphs: 0,
      sentences: 0,
      words: 0,
      hardSentences: 0,
      veryHardSentences: 0,
      adverbs: 0,
      passiveVoice: 0,
      complex: 0
    };
    ("use strict");
    let inputArea = document.getElementById("text-area");
    let text = inputArea.value;
    let paragraphs = text.split("\n");
    let outputArea = document.getElementById("output");
    let hardSentences = paragraphs.map(p => getDifficultSentences(p));
    let inP = hardSentences.map(para => `<p>${para}</p>`);
    data.paragraphs = paragraphs.length;
    console.log(data);
    counters();
    outputArea.innerHTML = inP.join(" ");
  }
  window.format = format;
  format();

  function counters() {
    document.querySelector("#adverb").innerHTML = `You have used ${
      data.adverbs
    } adverb${data.adverbs > 1 ? "s" : ""}. Try to use ${Math.round(
      data.paragraphs / 3
    )} or less`;
    document.querySelector(
      "#passive"
    ).innerHTML = `You have used passive voice ${data.passiveVoice} time${
      data.passiveVoice > 1 ? "s" : ""
    }. Aim for ${Math.round(data.sentences / 5)} or less.`;
    document.querySelector("#complex").innerHTML = `${data.complex} phrase${
      data.complex > 1 ? "s" : ""
    } could be simplified.`;
    document.querySelector("#hardSentence").innerHTML = `${
      data.hardSentences
    } of ${data.sentences} sentence${
      data.sentences > 1 ? "s are" : " is"
    } hard to read`;
    document.querySelector("#veryHardSentence").innerHTML = `${
      data.veryHardSentences
    } of ${data.sentences} sentence${
      data.sentences > 1 ? "s are" : " is"
    } very hard to read`;
  }

  function getDifficultSentences(p) {
    let sentences = getSentenceFromParagraph(p + " ");
    data.sentences += sentences.length;
    let hardOrNot = sentences.map(sent => {
      let cleanSentence = sent.replace(/[^a-z0-9. ]/gi, "") + ".";
      let words = cleanSentence.split(" ").length;
      let letters = cleanSentence.split(" ").join("").length;
      data.words += words;
      sent = getAdverbs(sent);
      sent = getComplex(sent);
      sent = getPassive(sent);
      sent = getQualifier(sent);
      let level = calculateLevel(letters, words, 1);
      if (words < 14) {
        return sent;
      } else if (level >= 10 && level < 14) {
        data.hardSentences += 1;
        return `<span class="hardSentence">${sent}</span>`;
      } else if (level >= 14) {
        data.veryHardSentences += 1;
        return `<span class="veryHardSentence">${sent}</span>`;
      } else {
        return sent;
      }
    });

    return hardOrNot.join(" ");
  }

  function getPassive(sent) {
    let originalWords = sent.split(" ");
    let words = sent
      .replace(/[^a-z0-9. ]/gi, "")
      .toLowerCase()
      .split(" ");
    let ed = words.filter(word => word.match(/ed$/));
    if (ed.length > 0) {
      ed.forEach(match => {
        originalWords = checkPrewords(words, originalWords, match);
      });
    }
    return originalWords.join(" ");
  }

  function checkPrewords(words, originalWords, match) {
    let preWords = ["is", "are", "was", "were", "be", "been", "being"];
    let index = words.indexOf(match);
    if (preWords.indexOf(words[index - 1]) >= 0) {
      data.passiveVoice += 1;
      originalWords[index - 1] =
        '<span class="passive">' + originalWords[index - 1];
      originalWords[index] = originalWords[index] + "</span>";
      let next = checkPrewords(
        words.slice(index + 1),
        originalWords.slice(index + 1),
        match
      );
      return [...originalWords.slice(0, index + 1), ...next];
    } else {
      return originalWords;
    }
  }

  function getSentenceFromParagraph(p) {
    let sentences = p
      .split(". ")
      .filter(s => s.length > 0)
      .map(s => s + ".");
    return sentences;
  }

  function calculateLevel(letters, words, sentences) {
    if (words === 0 || sentences === 0) {
      return 0;
    }
    let level = Math.round(
      4.71 * (letters / words) + 0.5 * words / sentences - 21.43
    );
    return level <= 0 ? 0 : level;
  }

  function getAdverbs(sentence) {
    let lyWords = getLyWords();
    return sentence
      .split(" ")
      .map(word => {
        if (
          word.replace(/[^a-z0-9. ]/gi, "").match(/ly$/) &&
          lyWords[word.replace(/[^a-z0-9. ]/gi, "").toLowerCase()] === undefined
        ) {
          data.adverbs += 1;
          return `<span class="adverb">${word}</span>`;
        } else {
          return word;
        }
      })
      .join(" ");
  }

  function getComplex(sentence) {
    let words = getComplexWords();
    let wordList = Object.keys(words);
    wordList.forEach(key => {
      sentence = findAndSpan(sentence, key, "complex");
    });
    return sentence;
  }

  function findAndSpan(sentence, string, type) {
    let index = sentence.toLowerCase().indexOf(string);
    let a = { complex: "complex", qualifier: "adverbs" };
    if (index >= 0) {
      data[a[type]] += 1;
      sentence =
        sentence.slice(0, index) +
        `<span class="${type}">` +
        sentence.slice(index, index + string.length) +
        "</span>" +
        findAndSpan(sentence.slice(index + string.length), string, type);
    }
    return sentence;
  }

  function getQualifier(sentence) {
    let qualifiers = getQualifyingWords();
    let wordList = Object.keys(qualifiers);
    wordList.forEach(key => {
      sentence = findAndSpan(sentence, key, "qualifier");
    });
    return sentence;
  }

  function getQualifyingWords() {
    return {
      "i believe": 1,
      "i consider": 1,
    };
  }

  function getLyWords() {
    return {
      actually: 1,
      additionally: 1,
      allegedly: 1,
      ally: 1,
    };
  }

  function getComplexWords() {
    return {
      "a number of": ["many", "some"],
      abundance: ["enough", "plenty"],
      "accede to": ["allow", "agree to"],
    };
  }

  function getJustifierWords() {
    return {
      "i believe": 1,
      "i consider": 1,
    };
  }
})();
```

## Prompting to fill in the logic

For reference, I have pasted the original index.js file below. Please fill out the entirety of the logic in `useOrwellEditor.js` using the outline you just made. You need to fill in the logic for each function by referring to the provided index.js file. Make sure to replace all document.getElementById() and document.querySelector() with the appropriate state variables, and adjust the code as necessary to make it compatible with React.

- GPT-4 is being annoying so I had to get GPT-3 to do it.

### Running build and publishing on github pages

Replace favicon.ico with your own favicon.ico file.
npm run build

### Running the app in development mode

npm install gh-pages
npm start
Add the following to your package.json
"predeploy": "npm run build"
"deploy": "gh-pages -d build"

## BUGS

My whitespace disappears between words. Newlines are gone.
The functionality of hard sentences doesn't work if you put enough spaces before the sentence.

## Loom

The Orwell Editor makes your writing bold and clear. It is also a clone of https://hemingwayapp.com/.

The app highlights lengthy, complex sentences and common errors; if you see a yellow sentence, shorten or split it. If you see a red highlight, your sentence is so dense and complicated that your readers will get lost trying to follow its meandering, splitting logic — try editing this sentence to remove the red. You can utilize a shorter word in place of a purple one. Mouse over them for hints.
Adverbs and weakening phrases are helpfully shown in blue. Get rid of them and pick words with force, perhaps.
Phrases in green have been marked to show passive voice.
You can format your text with the toolbar.
Hemingway's main functionality is what first spoke to me, and it will be a necessary part of my application. v2 will have this and the other editor's functionality.

Okay let's map out the codebase so that I can have it loaded in my head.

- App has the editor and the text area.
  - There is an output variable that is used to fill the sidebar.
  - in the beginning and on change, it formats the text and then calls the editor.
  - the format function sets the output variable and fills the sidebar.
    - My first task to get the output errors to go away is to
- useOrwellEditor.js has the logic and helpers for the editor.

## Updating the output logic to fix the bugs

The following is my useOrwellEditor file. At a high level, it currently labels sentences and then _constructs_ a new output to set. This approach is riddled with errors, so I want to update it with a new approach that I want you to implement. Most of the logic will remain the same, the only thing I want to update is how the new output is set. This is the new approach that I want for the output text. I want you to search for the sentences that need to be changed in a copy of the _input_ and then change just that part. Do this for all the changes that need to be made in the output vs the input. This approach makes sure that we don't have to maintain extra information in order to reconstruct the original structure as we will just use the original structure.

```js
import { useState, useEffect } from "react";

export const useOrwellEditor = (initialText) => {
  const [data, setData] = useState({
    paragraphs: 0,
    sentences: 0,
    words: 0,
    hardSentences: 0,
    veryHardSentences: 0,
    adverbs: 0,
    passiveVoice: 0,
    complex: 0,
    readbility: 0,
  });

  const [output, setOutput] = useState("");

  const format = (text) => {
    let paragraphs = text.split("\n").filter((p) => p.trim() !== "");
    setData({
      paragraphs: paragraphs.length,
      sentences: 0,
      words: 0,
      hardSentences: 0,
      veryHardSentences: 0,
      adverbs: 0,
      passiveVoice: 0,
      complex: 0,
      readbility: 0,
    });

    let hardSentences = paragraphs.map((p) => getDifficultSentences(p));
    // Example content of hardSentences:
    // 0: 'The Orwell Editor makes your writing bold and clear. It is also a clone of https://hemingwayapp.com/.'
    // 1: '<span class="hardSentence">The app highlights lengthy, complex sentences and common errors; if you see a yellow sentence, shorten or split it.</span> <span class="veryHardSentence">If you see a red highlight, your sentence is so dense and complicated that your readers will get lost trying to follow its meandering, splitting logic — try editing this sentence to remove the red.</span> You can <span class="undefined">use</span> a shorter word in place of a purple one. Mouse over them for hints.'
    // 2: 'Adverbs and weakening phrases are <span class="adverb">helpfully</span> shown in blue. Get rid of them and pick words with force, <span class="qualifier">perhaps</span>.'
    // 3: 'Phrases in green have <span class="passive">been marked</span> to show passive voice.'
    // 4: 'You can format your text with the toolbar.'
    // 5: 'Hemingway's main functionality is what first spoke to me, and it will be a necessary part of my application. v2 will have this and the other editor's functionality.'
    let inP = hardSentences.map((para) => `<p>${para}</p>`);
    // Example content in inP:
    // 0: '<p>The Orwell Editor makes your writing bold and clear. It is also a clone of https://hemingwayapp.com/.</p>'
    // 1: '<p><span class="hardSentence">The app highlights lengthy, complex sentences and common errors; if you see a yellow sentence, shorten or split it.</span> <span class="veryHardSentence">If you see a red highlight, your sentence is so dense and complicated that your readers will get lost trying to follow its meandering, splitting logic — try editing this sentence to remove the red.</span> You can <span class="undefined">use</span> a shorter word in place of a purple one. Mouse over them for hints.</p>'
    // 2: '<p>Adverbs and weakening phrases are <span class="adverb">helpfully</span> shown in blue. Get rid of them and pick words with force, <span class="qualifier">perhaps</span>.</p>'
    // 3: '<p>Phrases in green have <span class="passive">been marked</span> to show passive voice.</p>'
    // 4: '<p>You can format your text with the toolbar.</p>'
    // 5: '<p>Hemingway's main functionality is what first spoke to me, and it will be a necessary part of my application. v2 will have this and the other editor's functionality.</p>'
    counters(text);
    setOutput(inP.join(" "));
  };

  const counters = (text) => {
    const letters = text.replace(/\s/g, "").length;
    // Get readability score as an integer
    const readability = Math.round(
      calculateLevel(letters, data.words, data.sentences)
    );

    let paragraphs = text.split("\n").filter((p) => p.trim() !== "");
    setData((prevData) => {
      return {
        ...prevData,
        readability: readability,
        paragraphs: paragraphs.length,
      };
    });

    document.querySelector("#adverb").innerHTML = `You have used ${
      data.adverbs
    } adverb${data.adverbs > 1 ? "s" : ""}. Try to use ${Math.round(
      paragraphs.length / 3
    )} or less`;
    document.querySelector(
      "#passive"
    ).innerHTML = `You have used passive voice ${data.passiveVoice} time${
      data.passiveVoice > 1 ? "s" : ""
    }. Aim for ${Math.round(data.sentences / 5)} or less.`;
    document.querySelector("#complex").innerHTML = `${data.complex} phrase${
      data.complex > 1 ? "s" : ""
    } could be simplified.`;
    document.querySelector("#hardSentence").innerHTML = `${
      data.hardSentences
    } of ${data.sentences} sentence${
      data.sentences > 1 ? "s are" : " is"
    } hard to read`;
    document.querySelector("#veryHardSentence").innerHTML = `${
      data.veryHardSentences
    } of ${data.sentences} sentence${
      data.sentences > 1 ? "s are" : " is"
    } very hard to read`;
  };

  const getDifficultSentences = (p) => {
    let sentences = getSentenceFromParagraph(p + " ");
    data.sentences += sentences.length;
    let hardOrNot = sentences.map((sent) => {
      let cleanSentence = sent.replace(/[^a-z0-9. ]/gi, "") + ".";
      let words = cleanSentence.split(" ").length;
      let letters = cleanSentence.split(" ").join("").length;
      data.words += words;
      sent = getAdverbs(sent);
      sent = getComplex(sent);
      sent = getPassive(sent);
      sent = getQualifier(sent, data);
      let level = calculateLevel(letters, words, 1);
      if (words < 14) {
        return sent;
      } else if (level >= 10 && level < 14) {
        data.hardSentences += 1;
        return `<span class="hardSentence">${sent}</span>`;
      } else if (level >= 14) {
        data.veryHardSentences += 1;
        return `<span class="veryHardSentence">${sent}</span>`;
      } else {
        return sent;
      }
    });

    return hardOrNot.join(" ");
  };
  const getSentenceFromParagraph = (p) => {
    // Split the paragraph into sentences using a regular expression
    let sentences = p.split(/(?<=[.!?])\s+(?=[^\s])/g) || [];

    return sentences;
  };
  const calculateLevel = (letters, words, sentences) => {
    if (words === 0 || sentences === 0) {
      return 0;
    }
    let level = Math.round(
      4.71 * (letters / words) + (0.5 * words) / sentences - 21.43
    );
    return level <= 0 ? 0 : level;
  };

  const getAdverbs = (sentence) => {
    const lyWords = getLyWords();
    const words = sentence.split(" ");
    let output = "";
    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      let cleanWord = word.replace(/[^a-z0-9. ]/gi, "");
      if (cleanWord.match(/ly$/) && !lyWords[cleanWord.toLowerCase()]) {
        data.adverbs += 1;
        word = `<span class="adverb">${word}</span>`;
      }
      output += word + " ";
    }
    return output.trim();
  };
  const getComplex = (sentence) => {
    const words = getComplexWords();
    const wordList = Object.keys(words);

    wordList.forEach((key) => {
      const regex = new RegExp("\\b" + key + "\\b", "gi");
      sentence = sentence.replace(regex, (match) => {
        data.complex += 1;
        const replacement = words[key];
        const isReplacementArray = Array.isArray(replacement);
        const chosenReplacement = isReplacementArray
          ? replacement[0]
          : replacement;
        const type = isReplacementArray ? `class="${words[key][1]}"` : "";
        return `<span ${type}>${chosenReplacement}</span>`;
      });
    });

    return sentence;
  };

  const findAndSpan = (sentence, string, type, data) => {
    const a = { complex: "complex", qualifier: "adverbs" };
    const index = sentence.toLowerCase().indexOf(string);
    if (index >= 0) {
      data[a[type]] += 1;
      sentence =
        sentence.slice(0, index) +
        `<span class="${type}">` +
        sentence.slice(index, index + string.length) +
        "</span>" +
        findAndSpan(sentence.slice(index + string.length), string, type, data); // pass the data object
    }
    return sentence;
  };

  const getQualifier = (sentence, data) => {
    let qualifiers = getQualifyingWords();
    let wordList = Object.keys(qualifiers);
    wordList.forEach((key) => {
      sentence = findAndSpan(sentence, key, "qualifier", data);
    });
    return sentence;
  };

  const getPassive = (sent) => {
    let originalWords = sent.split(" ");
    let words = sent
      .replace(/[^a-z0-9. ]/gi, "")
      .toLowerCase()
      .split(" ");
    let ed = words.filter((word) => word.match(/ed$/));
    if (ed.length > 0) {
      ed.forEach((match) => {
        originalWords = checkPrewords(words, originalWords, match);
      });
    }
    return originalWords.join(" ");
  };
  const checkPrewords = (words, originalWords, match) => {
    let preWords = ["is", "are", "was", "were", "be", "been", "being"];
    let index = words.indexOf(match);
    if (preWords.indexOf(words[index - 1]) >= 0) {
      data.passiveVoice += 1;
      originalWords[index - 1] =
        '<span class="passive">' + originalWords[index - 1];
      originalWords[index] = originalWords[index] + "</span>";
      if (index < words.length - 1) {
        let next = checkPrewords(
          words.slice(index + 1),
          originalWords.slice(index + 1),
          match
        );
        return [...originalWords.slice(0, index + 1), ...next];
      }
    }
    return originalWords;
  };

  function getQualifyingWords() {
    return {
      "i believe": 1,
      "i consider": 1,
      "i don't believe": 1,
    };
  }

  function getLyWords() {
    return {
      actually: 1,
      additionally: 1,
      allegedly: 1,
      ally: 1,
    };
  }

  function getComplexWords() {
    return {
      "a number of": ["many", "some"],
      abundance: ["enough", "plenty"],
      "accede to": ["allow", "agree to"],
    };
  }

  function getJustifierWords() {
    return {
      "i believe": 1,
      "i consider": 1,
      "i don't believe": 1,
    };
  }

  return { data, format, output };
};
```

The next part:
I have a javascript problem with my textarea element. I extract the text in the textarea using an onChange function. The value that I get from the textarea is formatted, has new lines, and extra spacing. It is as the user has inputted it. I want to display that text in a p tag in another part of the page, but whenever I take the formatted text in the textarea and use javascript to put it into the p tag, it loses all its format and is ugly.

The following is an example input and output:
Input string from textarea to p tag:

<p>
The Orwell Editor makes your writing bold and clear. It is also a clone of https://hemingwayapp.com/.

    The app highlights lengthy, complex sentences and common errors; if you see a yellow sentence, shorten or split it. If you see a red highlight, your sentence is so dense and complicated that your readers will get lost trying to follow its meandering, splitting logic — try editing this sentence to remove the red. You can utilize a shorter word in place of a purple one. Mouse over them for hints.
    Adverbs and weakening phrases are helpfully shown in blue. Get rid of them and pick words with force, perhaps.
    Phrases in green have been marked to show passive voice.
    You can format your text with the toolbar.
    Hemingway's main functionality is what first spoke to me, and it will be a necessary part of my application. v2 will have this and the other editor's functionality.

</p>

Output seen by user:
The Orwell Editor makes your writing bold and clear. It is also a clone of https://hemingwayapp.com/. The app highlights lengthy, complex sentences and common errors; if you see a yellow sentence, shorten or split it. If you see a red highlight, your sentence is so dense and complicated that your readers will get lost trying to follow its meandering, splitting logic — try editing this sentence to remove the red. You can utilize a shorter word in place of a purple one. Mouse over them for hints. Adverbs and weakening phrases are helpfully shown in blue. Get rid of them and pick words with force, perhaps. Phrases in green have been marked to show passive voice. You can format your text with the toolbar. Hemingway's main functionality is what first spoke to me, and it will be a necessary part of my application. v2 will have this and the other editor's functionality.

This is my textarea:

```jsx
<textarea
  className="w-full h-64 p-2 border border-gray-300 resize-none"
  value={text}
  onChange={(e) => {
    setText(e.target.value);
    format(e.target.value);
  }}
></textarea>
```

I want you to make a copy of the input text. Then I want you to take the logic in the modifiedParagraphs loop to find out what parts of the input text need to change (to add the spans for highlighting). Then I want you to search for that text and replace it with the same text but with the corresponding span.

```js
I want you to make a copy of the input text. Then I want you to take the logic in the modifiedParagraphs loop to find out what parts of the input text need to change (to add the spans for highlighting). Then I want you to search for that text and replace it with the same text but with the corresponding span.

  const format = (text) => {
    let paragraphs = text.split("\n").filter((p) => p.trim() !== "");
    setData({
      paragraphs: paragraphs.length,
      sentences: 0,
      words: 0,
      hardSentences: 0,
      veryHardSentences: 0,
      adverbs: 0,
      passiveVoice: 0,
      complex: 0,
      readbility: 0,
    });

    let modifiedParagraphs = [];

    paragraphs.forEach((p) => {
      let sentences = getSentenceFromParagraph(p + " ");
      data.sentences += sentences.length;
      let modifiedSentences = sentences.map((sent) => {
        let cleanSentence = sent.replace(/[^a-z0-9. ]/gi, "") + ".";
        let words = cleanSentence.split(" ").length;
        let letters = cleanSentence.split(" ").join("").length;
        data.words += words;
        sent = getAdverbs(sent);
        sent = getComplex(sent);
        sent = getPassive(sent);
        sent = getQualifier(sent, data);
        let level = calculateLevel(letters, words, 1);
        if (words < 14) {
          return sent;
        } else if (level >= 10 && level < 14) {
          data.hardSentences += 1;
          return `<span class="hardSentence">${sent}</span>`;
        } else if (level >= 14) {
          data.veryHardSentences += 1;
          return `<span class="veryHardSentence">${sent}</span>`;
        } else {
          return sent;
        }
      });
      modifiedParagraphs.push(modifiedSentences.join(" "));
    });

    let output = modifiedParagraphs.join("</p><p>");
    setOutput(`<p class=whitespace-pre-wrap>${output}</p>`);
    counters(text);
  };
```
