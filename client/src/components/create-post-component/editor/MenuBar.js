import React, { useState } from "react";
import ImageZone from "./ImageZone";
function MenuBar(props) {
  const [imageZone, setImageZone] = useState(false);
  function showImageZone() {
    setImageZone(true);
  }
  function hideImageZone() {
    setImageZone(false);
  }
  const editor = props.editor;
  if (!editor) {
    return null;
  }
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 3 }}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-editor-active" : ""}
      >
        bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-editor-active" : ""}
      >
        italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-editor-active" : ""}
      >
        strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive("code") ? "is-editor-active" : ""}
      >
        code
      </button>
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
        clear nodes
      </button>
      <button onClick={() => editor.chain().focus().setParagraph().run()}>
        paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive("heading", { level: 1 }) ? "is-editor-active" : ""
        }
      >
        h1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive("heading", { level: 2 }) ? "is-editor-active" : ""
        }
      >
        h2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={
          editor.isActive("heading", { level: 3 }) ? "is-editor-active" : ""
        }
      >
        h3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={
          editor.isActive("heading", { level: 4 }) ? "is-editor-active" : ""
        }
      >
        h4
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={
          editor.isActive("heading", { level: 5 }) ? "is-editor-active" : ""
        }
      >
        h5
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={
          editor.isActive("heading", { level: 6 }) ? "is-editor-active" : ""
        }
      >
        h6
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-editor-active" : ""}
      >
        bullet list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-editor-active" : ""}
      >
        ordered list
      </button>
      <button
        onClick={() => {
          if (!editor.isActive("codeBlock")) {
            editor.chain().focus().setParagraph().run();
          }
          if (editor.isActive("blockquote")) {
            editor.chain().focus().toggleBlockquote().run();
          }

          editor.chain().focus().toggleCodeBlock().run();
        }}
        className={editor.isActive("codeBlock") ? "is-editor-active" : ""}
      >
        code block
      </button>
      <button
        onClick={() => {
          if (!editor.isActive("blockquote")) {
            editor.chain().focus().setParagraph().run();
          }
          editor.chain().focus().toggleBlockquote().run();
        }}
        className={editor.isActive("blockquote") ? "is-editor-active" : ""}
      >
        blockquote
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </button>
      <button onClick={() => editor.chain().focus().setHardBreak().run()}>
        hard break
      </button>
      <button onClick={() => editor.chain().focus().undo().run()}>undo</button>
      <button onClick={() => editor.chain().focus().redo().run()}>redo</button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={
          editor.isActive({ textAlign: "left" }) ? "is-editor-active" : ""
        }
      >
        left-alight
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={
          editor.isActive({ textAlign: "right" }) ? "is-editor-active" : ""
        }
      >
        right-alight
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={
          editor.isActive({ textAlign: "center" }) ? "is-editor-active" : ""
        }
      >
        center-alight
      </button>
      <button onClick={() => editor.chain().focus().unsetTextAlign().run()}>
        unset-alight
      </button>
      <button
        onClick={() => {
          if (
            !editor.isActive("textStyle", {
              backgroundColor: "#ffdf0a",
            })
          ) {
            editor.chain().focus().setNote("#ffdf0a").run();
          } else {
            editor.chain().focus().unsetNote().run();
          }
        }}
        className={
          editor.isActive("textStyle", {
            backgroundColor: "#ffdf0a",
          })
            ? "is-editor-active"
            : ""
        }
      >
        Note
      </button>
      <input
        type="color"
        name="color"
        id="color"
        onChange={(event) => {
          editor.chain().focus().setColor(event.target.value.toString()).run();
        }}
        style={{ width: "20px", height: "20px" }}
        value={editor.getAttributes("textStyle").color || "#000000"}
      />
      <button
        onClick={() => {
          editor.chain().focus().unsetColor().run();
        }}
      >
        unset Color
      </button>
      <button
        onClick={(event) => {
          showImageZone();
          const url = null;
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
      >
        Add image
      </button>
      {imageZone && (
        <ImageZone onClick={hideImageZone} editor={editor}></ImageZone>
      )}
      <div>
        <input type="text" name="href" id="href" />
        <button
          onClick={() => {
            const previousUrl = editor.getAttributes("link").href;
            const url = document.querySelector("#href").value;
            if (url === previousUrl) {
              return;
            } else if (!url) {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              return;
            } else if (url) {
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
              return;
            }
          }}
        >
          save
        </button>
        <button
          onClick={() => {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
          }}
        >
          unset
        </button>
        <button
          onClick={() => {
            editor.chain().focus().clearNodes().unsetAllMarks().run();
          }}
        >
          Reset All
        </button>
      </div>
    </div>
  );
}

export default MenuBar;
