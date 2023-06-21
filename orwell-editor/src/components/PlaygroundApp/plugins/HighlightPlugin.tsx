import { useCallback, useEffect } from 'react'
import './CommentPlugin.css'
import writeGood from 'write-good'
import {
  $createRangeSelection,
  $getNodeByKey,
  $getRoot,
  $nodesOfType,
  LexicalEditor,
  NodeKey,
  RangeSelection,
  TextNode,
} from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $getMarkIDs,
  $isMarkNode,
  $unwrapMarkNode,
  MarkNode,
} from '@lexical/mark'
import { Comments, Thread, createThread } from '../commenting'
import { createPortal } from 'react-dom'
import Button from '../ui/Button'

// useEffect for deleting unused comments
function removeHighlights({
  editor,
  deleteComment,
  comments,
  markNodeMap,
}: {
  editor: LexicalEditor
  deleteComment: (commentOrThread: Comment, thread?: Thread) => void
  comments: Comments
  markNodeMap: Map<string, Set<NodeKey>>
}): void {
  useEffect(() => {
    const removeMutationListener = editor.registerMutationListener(
      MarkNode,
      (mutatedNodes) => {
        // mutatedNodes is a Map where each key is the NodeKey, and the value is the state of mutation.
        for (const [nodeKey, mutation] of mutatedNodes) {
          if (mutation === 'destroyed') {
            // The keys of markNodeMap are the comment IDs and the values are the NodeKeys of the MarkNodes
            // I want to find the comment ID that corresponds to the NodeKey that was destroyed
            // Then I want to delete the comment
            const id = Array.from(markNodeMap.entries()).find(([_, nodeKeys]) =>
              nodeKeys.has(nodeKey)
            )
            // if ($isMarkNode(node)) {
            //   const ids = node.getIDs()
            //   console.log('ids', ids)
            //   ids.forEach((id) => {
            //     const comment = comments.find((comment) => comment.id === id)
            //     if (comment) {
            //       deleteComment(comment, undefined) // Call deleteComment with skipMarkNodeDeletion set to true
            //     }
            //   })
            // }
          }
        }
      }
    )

    return () => {
      removeMutationListener()
    }
  }, [editor, comments, deleteComment, $getNodeByKey, $isMarkNode])
}
function reparseAndHighlight({
  editor,
  submitAddComment,
  markNodeMap,
}: {
  editor: LexicalEditor
  submitAddComment: (
    commentOrThread: Comment | Thread,
    isInlineComment: boolean,
    thread?: Thread,
    currentSelection?: RangeSelection
  ) => void
  markNodeMap: Map<string, Set<NodeKey>>
}) {
  editor.update(() => {
    const textNodes: TextNode[] = $getRoot().getAllTextNodes()
    // Array changes which will have a tuple of [Thread, Selection]
    const changes: [Thread, RangeSelection][] = []
    textNodes.forEach((node) => {
      // Remove all existing highlights
      const markNodes = $nodesOfType(MarkNode)
      markNodes.forEach((markNode) => {
        markNodeMap.delete(markNode.getKey())
        $unwrapMarkNode(markNode)
      })
      const textContent = node.getTextContent()
      const matches = writeGood(textContent)

      if (matches && matches.length > 0) {
        matches.forEach((match) => {
          const reason = match.reason
          const offset = match.offset
          const index = match.index
          const quote = textContent.slice(index, index + offset)
          const selection = $createRangeSelection()
          selection.anchor.set(node.getKey(), index, 'text')
          selection.focus.set(node.getKey(), index + offset, 'text')
          // Check if the matched text is already highlighted
          let isAlreadyHighlighted = false
          for (const nodeKeys of markNodeMap.values()) {
            if (nodeKeys.has(node.getKey())) {
              isAlreadyHighlighted = true
              break
            }
          }
          if (!isAlreadyHighlighted) {
            changes.push([createThread(quote, reason), selection])
            // submitAddComment(
            //   createThread(quote, reason),
            //   true,
            //   undefined,
            //   selection
            // )
          }
        })
      }
      // Apply the changes
      changes.forEach(([thread, selection]) => {
        submitAddComment(thread, true, undefined, selection)
      })
    })
  })
}

export default function HighlightPlugin({
  submitAddComment,
  deleteComment,
  comments,
  markNodeMap,
}: {
  submitAddComment: (
    commentOrThread: Comment | Thread,
    isInlineComment: boolean,
    thread?: Thread,
    currentSelection?: RangeSelection
  ) => void
  deleteComment: (commentOrThread: Comment, thread?: Thread) => void
  comments: Comments
  markNodeMap: Map<string, Set<NodeKey>>
}): JSX.Element {
  const [editor] = useLexicalComposerContext()

  const handleButtonClick = useCallback(() => {
    reparseAndHighlight({ editor, submitAddComment, markNodeMap })
  }, [editor, submitAddComment])

  removeHighlights({ editor, deleteComment, comments, markNodeMap })
  return (
    <>
      {createPortal(
        <Button
          className={`CommentPlugin_ShowCommentsButton top-14`}
          onClick={handleButtonClick}
        >
          <i className="edit" />
        </Button>,
        document.body
      )}
    </>
  )
}

// const dfs = $dfs($getRoot(), listItem),
// listDepth = $getListDepth(parentList),
// dfsFiltered = dfs.filter((el) => {
//   if ($isCustomListItemNode(el.node) && !isNestedList(el.node)) {
//     const node = $getNodeByKey(el.node.__key);
//     return $getListDepth(node.getParent()) === listDepth;
//   }
//   return false;
// });
// const lastItem = dfsFiltered.slice(-1)[0].node;
// listItem.setValue(lastItem.getValue() + 1);
// let currVal = lastItem.getValue();
// for (const sibling of listItem.getNextSiblings()) {
// if ($isCustomListItemNode(sibling)) {
//   sibling.setValue(currVal + 1);
//   currVal++;
// }
// }
