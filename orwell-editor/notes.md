# Orwell

Okay let's think about what I need to make this highlight plugin.

- I know that it has to call the command comment.
- I need to think like Lexical thinks
  - You can't think in terms of the file. You need to think in terms of nodes and the tree.
    - So how does this look like as a tree problem?
    - Inside of each paragraph node there are text nodes. Since we got rid of the sentence idea, there shouldn't be any problems with overlapping items. That should fix the whole load of issues I had meaning I can just use the previous code.
    - From looking at the tree after making a highlight, it looks like the highlight is a type of mark node.
- First idea:
  - There are two operations that I need to do here:
    - highlightTransform
      - I just want it to work with the example for now.
      - How do I even make a comment from inside the code?
        - Look at how the toolbar calls it.
          - It doesn't
        - Look at how that little popup thing calls it.
          - character-style-popup
    - unhighlightTransform

I have a problem

- setComments is localized to the component. I need to be able to call it from a seperate plugin. I think the only way to do that is passing the state of the comments up to the parent editor.
- What if I passed

This is the plan to add the comments and setComments to the editor.

- move the comments and setComments to the editor
- I need to make a selection then I can add a comment.
  - I remember seeing that on stack overflow.

BUGS:

- When I have my highlighting, I can't comment things like a normal person.
- WriteGood has bugs in it so I'm taking it out and making my own.
  - Edit your package.json file to remove the dependency you want to edit.
  - Go into your project's /node_modules and move the folder somewhere else in your repository that can be committed. /write-good
    cd into the dependency directory and type npm link
    cd into the root of your project directory and type npm link dependency It is important that you do this outside of /node_modules and /dependency
    If everything worked, you should now have a symlink that was created in /node_modules/dependency. Now you can run your project to see if it works.
- there's a connection between mark nodes and deleting comments which should work

This is what I want to do to get around all this finicky state based problems

- Save all the matches from write-good in a state.
- Save the selection in a state.
- Every second, apply the matches to the editor.
  - Go through recursively and apply the matches to the editor.
- Go back to the selection.

# Updating the comments so that they get deleted when the text is deleted

- There are mark nodes that are created when you highlight text.
- They have unique ids.
- If the mark nodes is deleted, then you should go in the comments and delete the comment with the same id.

  - I want to pass up the delete function to the editor and pass it down to the highlight plugin.
  - Theres this bug when if the bad word is last and you delete the comment it does weird things
    - Hopefully it goes away when I add my change to the comments.

- I'll assume all the comments are centralized in a paragraph node and not going over multiple paragraph nodes.
  - I could just rerender the entire thing.
  - Or do something fancy when the paragraph rerenders
    Later
- why is it kinda random
- The the doesn’t work like I’d like.
  - it should take in context
- Why does “ stop it?!?!

# Simplification

- I'm going to add a button which applies the parser to the entire document.
  - I should have done this from the beginning. The effort vs reward calculation for my previous idea was definitely not optimal. My ego was too involved rather than getting an MVP out that other people can use.
- How is the information going to be passed down?

  - I'd like it to be part of the highlight plugin.
    - The comment plugin adds that button and I want to do the same thing.
      - How does the comment plugin inject that button into the DOM?
        - try it out with CommentPlugin_ShowCommentsButton2

- Next: add prose lint

# Implementation of simplification

- bug: only highlights first match
  - What is the order of the parsing?
  - How can I make it change without affecting?
    - I can do multiple passes to get all the matches until I can no longer highlight.
