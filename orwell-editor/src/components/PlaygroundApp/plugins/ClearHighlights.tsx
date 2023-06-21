import { useEffect } from 'react'
import { $getNodeByKey, $isMarkNode, NodeKey } from 'lexical'
import { Comment, Comments, Thread } from '../commenting'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $unwrapMarkNode } from '@lexical/mark'

function deleteCommentAndRemoveMarkNode(
  comment: Comment,
  markNodeMap: Map<string, Set<NodeKey>>,
  deleteComment: (commentOrThread: Comment, thread?: Thread) => void
): void {
  const commentId = comment.id
  const markNodeKey = markNodeMap.get(commentId)
  if (!markNodeKey) return
  const markNode = $getNodeByKey(markNodeKey.values().next().value)
  console.log('markNode', markNode)
  if (!markNode) return
  const ids = markNode.getIDs()
  // console.log('ids', ids)
  ids.forEach((id) => {
    markNode.deleteID(id)
    // console.log('markNode', markNode)
    if (markNode.getIDs().length === 0) {
      $unwrapMarkNode(markNode)
    }
  })
  markNodeMap.delete(commentId)
  deleteComment(comment)
}

function ClearHighlightsPlugin({
  deleteComment,
  markNodeMap,
  comments,
}: {
  deleteComment: (commentOrThread: Comment, thread?: Thread) => void
  markNodeMap: Map<string, Set<NodeKey>>
  comments: Comments
}): null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (editor) {
      editor.update(() => {
        markNodeMap.forEach((_, commentId) => {
          const comment = comments.find((comment) => comment.id === commentId)
          if (comment) {
            deleteCommentAndRemoveMarkNode(comment, markNodeMap, deleteComment)
          }
        })
      })
    }
  }, [editor, deleteComment, markNodeMap])

  return null
}

export { ClearHighlightsPlugin }
