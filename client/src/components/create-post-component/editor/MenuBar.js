import React, { useState } from "react";
import ImageZone from "./ImageZone";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaRemoveFormat,
  FaListOl,
  FaListUl,
  FaQuoteLeft,
  FaAlignLeft,
  FaAlignRight,
  FaAlignCenter,
  FaHighlighter,
  FaImage,
  FaLink,
  FaUnlink,
} from "react-icons/fa";
import { GoCode, GoDash } from "react-icons/go";
import classes from "./MenuBar.module.css";
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

  function fontSizeOption(params) {
    let options = [];
    for (let i = 1; i <= 8; i++) {
      options.push(<option key={i}>{12 + i * 2}</option>);
    }
    return options;
  }
  return (
    <div className={classes["menu-container"]}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? classes["is-editor-active"] : ""}
      >
        <FaBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? classes["is-editor-active"] : ""}
      >
        <FaItalic></FaItalic>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? classes["is-editor-active"] : ""}
      >
        <FaStrikethrough></FaStrikethrough>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={
          editor.isActive("underline") ? classes["is-editor-active"] : ""
        }
      >
        <FaUnderline></FaUnderline>
      </button>
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        <FaRemoveFormat></FaRemoveFormat>
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
        clear nodes
      </button>
      {/* { co le dung select paragraph,heading,...} */}
      <select
        value={(() => {
          if (editor.isActive("heading", { level: 1 })) {
            return "1";
          }
          if (editor.isActive("heading", { level: 2 })) {
            return "2";
          }
          if (editor.isActive("heading", { level: 3 })) {
            return "3";
          }
          return "paragraph";
        })()}
        onChange={(event) => {
          if (event.target.value.length > 2) {
            editor.chain().focus().setParagraph().run();
          } else {
            switch (event.target.value) {
              case "1":
                editor.chain().focus().setHeading({ level: 1 }).run();
                break;
              case "2":
                editor.chain().focus().setHeading({ level: 2 }).run();
                break;
              case "3":
                editor.chain().focus().setHeading({ level: 3 }).run();
                break;
            }
          }
        }}
      >
        <option value="paragraph">Paragraph</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
      </select>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor.isActive("bulletList") ? classes["is-editor-active"] : ""
        }
      >
        <FaListUl></FaListUl>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          editor.isActive("orderedList") ? classes["is-editor-active"] : ""
        }
      >
        <FaListOl></FaListOl>
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
        className={
          editor.isActive("codeBlock") ? classes["is-editor-active"] : ""
        }
      >
        <GoCode></GoCode>
      </button>
      <button
        onClick={() => {
          if (!editor.isActive("blockquote")) {
            editor.chain().focus().setParagraph().run();
          }
          editor.chain().focus().toggleBlockquote().run();
        }}
        className={
          editor.isActive("blockquote") ? classes["is-editor-active"] : ""
        }
      >
        <FaQuoteLeft />
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <GoDash></GoDash>
      </button>
      <button onClick={() => editor.chain().focus().setHardBreak().run()}>
        hard break
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={
          editor.isActive({ textAlign: "left" })
            ? classes["is-editor-active"]
            : ""
        }
      >
        <FaAlignLeft />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={
          editor.isActive({ textAlign: "right" })
            ? classes["is-editor-active"]
            : ""
        }
      >
        <FaAlignRight />
      </button>
      <button
        onClick={() => {
          editor.chain().focus().setTextAlign("center").run();
        }}
        className={
          editor.isActive({ textAlign: "center" })
            ? classes["is-editor-active"]
            : ""
        }
      >
        <FaAlignCenter />
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
            ? classes["is-editor-active"]
            : ""
        }
      >
        <FaHighlighter />
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
        <FaImage />
      </button>
      {imageZone && (
        <ImageZone
          onClick={hideImageZone}
          editor={editor}
          sendImageRequest={props.sendImageRequest}
        ></ImageZone>
      )}
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
        <FaLink />
      </button>
      <button
        onClick={() => {
          editor.chain().focus().extendMarkRange("link").unsetLink().run();
        }}
      >
        <FaUnlink />
      </button>
      <select
        value={
          editor.getAttributes("textStyle").fontSize
            ? editor.getAttributes("textStyle").fontSize.split("px")[0]
            : "16"
        }
        name="fontSize"
        id="fontSize"
        onChange={(event) => {
          editor
            .chain()
            .focus()
            .setFontSize(event.target.value + "px")
            .run();
        }}
      >
        {fontSizeOption()}
      </select>
    </div>
  );
}

export default MenuBar;
