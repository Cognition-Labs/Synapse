/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { $createLinkNode } from '@lexical/link'
import { $createListItemNode, $createListNode } from '@lexical/list'
import AutoFocusPlugin from '@lexical/react/LexicalAutoFocusPlugin'
import AutoScrollPlugin from '@lexical/react/LexicalAutoScrollPlugin'
import CharacterLimitPlugin from '@lexical/react/LexicalCharacterLimitPlugin'
import CheckListPlugin from '@lexical/react/LexicalCheckListPlugin'
import ClearEditorPlugin from '@lexical/react/LexicalClearEditorPlugin'
import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin'
import HashtagPlugin from '@lexical/react/LexicalHashtagPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import LinkPlugin from '@lexical/react/LexicalLinkPlugin'
import ListPlugin from '@lexical/react/LexicalListPlugin'
import PlainTextPlugin from '@lexical/react/LexicalPlainTextPlugin'
import RichTextPlugin from '@lexical/react/LexicalRichTextPlugin'
import TablePlugin from '@lexical/react/LexicalTablePlugin'
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import {
  $createParagraphNode,
  $createTextNode,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $setSelection,
  LexicalEditor,
  NodeKey,
  RangeSelection,
  TextNode,
} from 'lexical'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { createWebsocketProvider } from './collaboration'
import { useSettings } from './context/SettingsContext'
import { useSharedHistoryContext } from './context/SharedHistoryContext'
import ActionsPlugin from './plugins/ActionsPlugin'
import AutocompletePlugin from './plugins/AutocompletePlugin'
import AutoLinkPlugin from './plugins/AutoLinkPlugin'
import CharacterStylesPopupPlugin from './plugins/CharacterStylesPopupPlugin'
import ClickableLinkPlugin from './plugins/ClickableLinkPlugin'
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin'
import CommentPlugin from './plugins/CommentPlugin'
import EmojisPlugin from './plugins/EmojisPlugin'
import EquationsPlugin from './plugins/EquationsPlugin'
import ExcalidrawPlugin from './plugins/ExcalidrawPlugin'
import HorizontalRulePlugin from './plugins/HorizontalRulePlugin'
import ImagesPlugin from './plugins/ImagesPlugin'
import KeywordsPlugin from './plugins/KeywordsPlugin'
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin'
import MarkdownShortcutPlugin from './plugins/MarkdownShortcutPlugin'
// MentionsPlugin from './plugins/MentionsPlugin'
import PollPlugin from './plugins/PollPlugin'
import SpeechToTextPlugin from './plugins/SpeechToTextPlugin'
import TabFocusPlugin from './plugins/TabFocusPlugin'
import TableCellActionMenuPlugin from './plugins/TableActionMenuPlugin'
import TableCellResizer from './plugins/TableCellResizer'
import ToolbarPlugin from './plugins/ToolbarPlugin'
import TreeViewPlugin from './plugins/TreeViewPlugin'
import TwitterPlugin from './plugins/TwitterPlugin'
import YouTubePlugin from './plugins/YouTubePlugin'
import HighlightPlugin from './plugins/HighlightPlugin'
import ContentEditable from './ui/ContentEditable'
import Placeholder from './ui/Placeholder'
import { cloneThread, Comments, Thread } from './commenting'
import {
  $isMarkNode,
  $unwrapMarkNode,
  $wrapSelectionInMarkNode,
  MarkNode,
} from '@lexical/mark'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getNearestNodeOfType } from '@lexical/utils'
import { $selectAll } from '@lexical/selection'
import ReactGA from 'react-ga4'
import GlobalEventsPluginMemo from './plugins/GlobalEventsPlugin'
import { $createStickyNode } from './nodes/StickyNode'
import { ClearHighlightsPlugin } from './plugins/ClearHighlights'
import StickyPlugin from './plugins/StickyPlugin'

const skipCollaborationInit =
  // @ts-ignore
  window.parent != null && window.parent.frames.right === window

function prepopulatedRichText1() {
  const root = $getRoot()
  if (root.getFirstChild() === null) {
    const heading = $createHeadingNode('h1')
    heading.append(
      $createTextNode('Hello! Welcome to the Orwell Editor.').toggleFormat(
        'bold'
      )
    )
    root.append(heading)
    const quote = $createQuoteNode()
    quote.append(
      $createTextNode(
        `In case you were wondering what the black box at the bottom is – it's the debug view, showing the current state of editor. ` +
          `You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting.`
      )
    )
    root.append(quote)
    const paragraph = $createParagraphNode()
    paragraph.append(
      $createTextNode('The playground is a demo environment built with '),
      $createTextNode('@lexical/react').toggleFormat('code'),
      $createTextNode('.'),
      $createTextNode(' Try typing in '),
      $createTextNode('some text').toggleFormat('bold'),
      $createTextNode(' with '),
      $createTextNode('different').toggleFormat('italic'),
      $createTextNode(' formats.')
    )
    root.append(paragraph)
    const paragraph2 = $createParagraphNode()
    paragraph2.append(
      $createTextNode(
        'Make sure to check out the various plugins in the toolbar. You can also use #hashtags or @-mentions too!'
      )
    )
    root.append(paragraph2)
    const paragraph3 = $createParagraphNode()
    paragraph3.append(
      $createTextNode(`If you'd like to find out more about Lexical, you can:`)
    )
    root.append(paragraph3)
    const list = $createListNode('bullet')
    list.append(
      $createListItemNode().append(
        $createTextNode(`Visit the `),
        $createLinkNode('https://lexical.dev/').append(
          $createTextNode('Lexical website')
        ),
        $createTextNode(` for documentation and more information.`)
      ),
      $createListItemNode().append(
        $createTextNode(`Check out the code on our `),
        $createLinkNode('https://github.com/facebook/lexical').append(
          $createTextNode('GitHub repository')
        ),
        $createTextNode(`.`)
      ),
      $createListItemNode().append(
        $createTextNode(`Playground code can be found `),
        $createLinkNode(
          'https://github.com/facebook/lexical/tree/main/packages/lexical-playground'
        ).append($createTextNode('here')),
        $createTextNode(`.`)
      ),
      $createListItemNode().append(
        $createTextNode(`Join our `),
        $createLinkNode('https://discord.com/invite/KmG4wQnnD9').append(
          $createTextNode('Discord Server')
        ),
        $createTextNode(` and chat with the team.`)
      )
    )
    root.append(list)
    const paragraph4 = $createParagraphNode()
    paragraph4.append(
      $createTextNode(
        `Lastly, we're constantly adding cool new features to this playground. So make sure you check back here when you next get a chance :).`
      )
    )
    const stickyNode = $createStickyNode(1000, 0)
    root.append(paragraph4)
    root.append(stickyNode)
  }
}

function prepopulatedRichText() {
  const root = $getRoot()
  if (root.getFirstChild() === null) {
    const heading = $createHeadingNode('h1')
    heading.append(
      $createTextNode('Hello! Welcome to the Orwell Editor.').toggleFormat(
        'bold'
      )
    )
    root.append(heading)

    const intro = $createParagraphNode()
    intro.append(
      $createTextNode(
        'The Orwell Editor is a text editor that enables you to write with clarity. It guides you to be a better writer, not give you the illusion of being one. This introduction will showcase some of the mistakes that the Orwell Editor can detect and highlight, allowing you to see its capabilities in action.'
      )
    )
    root.append(intro)

    const examples = $createHeadingNode('h2')
    examples.append($createTextNode("Let's take a look at some examples:"))
    root.append(examples)

    const list = $createListNode('bullet')
    list.append(
      $createListItemNode().append(
        $createTextNode('Weasel words: The project is largely complete.')
      ),
      $createListItemNode().append(
        $createTextNode(
          'Lexical illusions: She went to the store and bought the the apples.'
        )
      ),
      $createListItemNode().append(
        $createTextNode('Passive voice: The book was read by the students.')
      ),
      $createListItemNode().append(
        $createTextNode(
          'Adverbs that weaken meaning: He quickly ran across the street.'
        )
      ),
      $createListItemNode().append(
        $createTextNode(
          'Wordy or unneeded phrases: In the final analysis, the results were conclusive.'
        )
      ),
      $createListItemNode().append(
        $createTextNode("Cliches: He's a chip off the old block.")
      )
    )
    root.append(list)

    const clickComment = $createParagraphNode()
    clickComment.append(
      $createTextNode(
        'Click on the comment list button in the top right to see what Orwell thinks about these mistakes.'
      )
    )
    root.append(clickComment)

    const featuresHeading = $createHeadingNode('h2')
    featuresHeading.append($createTextNode('Features and Syntax'))
    root.append(featuresHeading)

    const featuresList = $createListNode('bullet')
    featuresList.append(
      $createListItemNode().append(
        $createTextNode('Headings: Use # for h1, ## for h2, and so on.')
      ),
      $createListItemNode().append(
        $createTextNode(
          'Italics: Enclose text in underscores (_text_) to create italics.'
        )
      ),
      $createListItemNode().append(
        $createTextNode(
          'Bold: Enclose text in double asterisks (**text**) to create bold text.'
        )
      )
    )
    root.append(featuresList)
    root.append(
      $createQuoteNode().append(
        $createTextNode('Quotes: Use > to create block quotes')
      )
    )

    const nonLinearHeading = $createHeadingNode('h2')
    nonLinearHeading.append($createTextNode('Non-linear Note-taking'))
    root.append(nonLinearHeading)

    const nonLinearParagraph = $createParagraphNode()
    nonLinearParagraph.append(
      $createTextNode(
        'When you press Cmd or Ctrl + Enter, you can create a pop-up post-it note that you can move around and write in. I often have ideas pop up while I write, and I like having them in my '
      ),
      $createLinkNode(
        'https://notes.andymatuschak.org/Peripheral_vision'
      ).append($createTextNode('peripheral vision.'))
    )
    root.append(nonLinearParagraph)

    const writingEditingHeading = $createHeadingNode('h2')
    writingEditingHeading.append(
      $createTextNode('Delineation between Writing and Editing')
    )
    root.append(writingEditingHeading)
    const writingEditingParagraph = $createParagraphNode()
    writingEditingParagraph.append(
      $createTextNode(
        "On the top left, there are two buttons: 'Write' and 'Edit'. The 'Edit' mode displays highlights and the comment bar, while the 'Write' mode allows you to focus on your writing without any distractions."
      )
    )
    root.append(writingEditingParagraph)

    const finalParagraph = $createParagraphNode()
    finalParagraph.append(
      $createTextNode(
        'The Orwell Editor automatically detects and highlights these issues, making it easy for you to refine and polish your writing'
      )
    )
    const last = $createParagraphNode()
    last.append($createTextNode('Enjoy the Orwell Editor and happy writing!'))
    const stickyNode = $createStickyNode(800, -70)
    root.append(finalParagraph)
    root.append(last)
    root.append(stickyNode)
  }
}
export default function Editor({
  isEditMode,
}: {
  isEditMode: boolean
}): JSX.Element {
  const { historyState } = useSharedHistoryContext()
  const {
    settings: {
      isCollab,
      isAutocomplete,
      isCharLimit,
      isCharLimitUtf8,
      isRichText,
      showTreeView,
      emptyEditor,
    },
  } = useSettings()
  const text = isCollab
    ? 'Enter some collaborative rich text...'
    : isRichText
    ? // ? 'Enter some rich text...'
      'Start writing...'
    : 'Enter some plain text...'
  const placeholder = <Placeholder>{text}</Placeholder>
  const scrollRef = useRef(null)
  // I can add initial comments here if I want. I could add tutorial comments here.
  const initialComments: Comments = []
  const [comments, setComments] = useState<Comments>(initialComments || [])
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [editor] = useLexicalComposerContext()
  // Submits a comment or thread to the editor.
  const submitAddComment = useCallback(
    (
      commentOrThread: Comment | Thread,
      isInlineComment: boolean,
      thread?: Thread | undefined,
      currentSelection?: RangeSelection | undefined
    ) => {
      ReactGA.event({
        category: 'user action',
        action: 'add comment',
        // label: 'your label', // optional
        // nonInteraction: true, // optional, true/false
        // transport: 'xhr', // optional, beacon/xhr/image
      })
      setComments((_comments) => {
        // What are the comments that are currently in the editor?
        // What are the comments that are added in the editor?
        const nextComments = Array.from(_comments)
        if (thread !== undefined && commentOrThread.type === 'comment') {
          for (let i = 0; i < nextComments.length; i++) {
            const comment = nextComments[i]
            if (comment.type === 'thread' && comment.id === thread.id) {
              const newThread = cloneThread(comment)
              nextComments.splice(i, 1, newThread)
              newThread.comments.push(commentOrThread)
              break
            }
          }
        } else {
          nextComments.push(commentOrThread)
        }
        return nextComments
      })
      if (isInlineComment) {
        editor.update(() => {
          const selection =
            currentSelection == undefined ? $getSelection() : currentSelection

          if ($isRangeSelection(selection)) {
            const focus = selection.focus
            const anchor = selection.anchor
            const isBackward =
              currentSelection == undefined ? false : selection.isBackward()
            const id = commentOrThread.id

            // Wrap content in a MarkNode
            $wrapSelectionInMarkNode(selection, isBackward, id)

            // I removed this because I want the selection to go to the next element
            // Make selection collapsed at the end
            if (currentSelection == undefined) {
              if (isBackward) {
                focus.set(anchor.key, anchor.offset, anchor.type)
              } else {
                anchor.set(focus.key, focus.offset, focus.type)
              }
            }
            // RangeSelection
            // if (currentSelection !== undefined) {
            //   // console.log(' i set this selection', currentSelection)
            //   $setSelection(currentSelection)
            // } else {
            //   const root = $getRoot()
            //   // Go to the last child in the root
            //   const textNodes = root.getAllTextNodes()
            //   // Pick the last text node
            //   const lastTextNode = textNodes[textNodes.length - 1]
            //   // Select the last text node
            //   lastTextNode.select()
            //   // $setSelection(Gri)
            // }
          }
        })
        setShowCommentInput(false)
      }
    },
    [editor]
  )

  // Deletes a comment or thread from the editor.
  const markNodeMap = useMemo<Map<string, Set<NodeKey>>>(() => {
    return new Map()
  }, [])
  const deleteComment = useCallback(
    (comment: Comment, thread?: Thread) => {
      setComments((_comments) => {
        // What are the new comments?
        // console.log('_comments delete ', _comments)
        const nextComments = Array.from(_comments)

        if (thread !== undefined) {
          for (let i = 0; i < nextComments.length; i++) {
            const nextComment = nextComments[i]
            if (nextComment.type === 'thread' && nextComment.id === thread.id) {
              const newThread = cloneThread(nextComment)
              nextComments.splice(i, 1, newThread)
              const threadComments = newThread.comments
              const index = threadComments.indexOf(comment)
              threadComments.splice(index, 1)
              if (threadComments.length === 0) {
                const threadIndex = nextComments.indexOf(newThread)
                nextComments.splice(threadIndex, 1)
                // Remove ids from associated marks
                const id = thread !== undefined ? thread.id : comment.id
                const markNodeKeys = markNodeMap.get(id)
                console.log('is this markNodeMap on?', markNodeMap)
                if (markNodeKeys !== undefined) {
                  // Do async to avoid causing a React infinite loop
                  setTimeout(() => {
                    editor.update(() => {
                      for (const key of markNodeKeys) {
                        const node: null | MarkNode = $getNodeByKey(key)
                        if ($isMarkNode(node)) {
                          node.deleteID(id)
                          if (node.getIDs().length === 0) {
                            $unwrapMarkNode(node)
                          }
                        }
                      }
                    })
                  })
                }
              }
              break
            }
          }
        } else {
          const index = nextComments.indexOf(comment)
          nextComments.splice(index, 1)
        }
        return nextComments
      })
    },
    [editor, markNodeMap]
  )

  // Google analytics
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: '/home' })
  }, [])

  return (
    <>
      {/* TODO: Add Toolbar back in */}
      {/* {isRichText && <ToolbarPlugin />} */}
      <div
        className={`editor-container  ${showTreeView ? 'tree-view' : ''} ${
          !isRichText ? 'plain-text' : ''
        }`}
        ref={scrollRef}
      >
        <AutoFocusPlugin />
        <ClearEditorPlugin />
        {/* <MentionsPlugin /> */}
        {/* TODO: Screw this emoji plugin */}
        {/* <EmojisPlugin /> */}
        <HashtagPlugin />
        <KeywordsPlugin />
        {/* I'll need to make this conditional at some point to go between the two types of editors: write and edit */}
        {/* If it isEdit show the plugins*/}
        {isEditMode ? (
          <>
            <HighlightPlugin
              submitAddComment={submitAddComment}
              deleteComment={deleteComment}
              comments={comments}
              markNodeMap={markNodeMap}
            />
            <CommentPlugin
              comments={comments}
              setComments={setComments}
              showCommentInput={showCommentInput}
              setShowCommentInput={setShowCommentInput}
              submitAddComment={submitAddComment}
              deleteComment={deleteComment}
              markNodeMap={markNodeMap}
            />
          </>
        ) : (
          <ClearHighlightsPlugin
            deleteComment={deleteComment}
            markNodeMap={markNodeMap}
            comments={comments}
          />
        )}
        <GlobalEventsPluginMemo />
        <StickyPlugin />
        <SpeechToTextPlugin />
        <AutoLinkPlugin />
        <AutoScrollPlugin scrollRef={scrollRef} />

        {isRichText ? (
          <>
            {isCollab ? (
              <CollaborationPlugin
                id="main"
                providerFactory={createWebsocketProvider}
                shouldBootstrap={!skipCollaborationInit}
              />
            ) : (
              <HistoryPlugin externalHistoryState={historyState} />
            )}
            <RichTextPlugin
              contentEditable={<ContentEditable />}
              placeholder={placeholder}
              // initialEditorState={
              //   isCollab ? null : emptyEditor ? undefined : prepopulatedRichText
              // }
              initialEditorState={prepopulatedRichText}
            />
            <MarkdownShortcutPlugin />
            <CodeHighlightPlugin />
            <ListPlugin />
            <CheckListPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <TablePlugin />
            <TableCellActionMenuPlugin />
            <TableCellResizer />
            <ImagesPlugin />
            <LinkPlugin />
            <PollPlugin />
            <TwitterPlugin />
            <YouTubePlugin />
            <ClickableLinkPlugin />
            <HorizontalRulePlugin />
            <CharacterStylesPopupPlugin />
            <EquationsPlugin />
            <ExcalidrawPlugin />
            <TabFocusPlugin />
          </>
        ) : (
          <>
            <PlainTextPlugin
              contentEditable={<ContentEditable />}
              placeholder={placeholder}
            />
            <HistoryPlugin externalHistoryState={historyState} />
          </>
        )}
        {(isCharLimit || isCharLimitUtf8) && (
          <CharacterLimitPlugin charset={isCharLimit ? 'UTF-16' : 'UTF-8'} />
        )}
        {isAutocomplete && <AutocompletePlugin />}
        {/* TODO: Add back in */}
        {/* <ActionsPlugin isRichText={isRichText} /> */}
      </div>
      {/* TODO: Add treeview back */}
      {showTreeView && <TreeViewPlugin />}
    </>
  )
}
