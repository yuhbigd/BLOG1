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
  FaFont,
  FaPlus,
} from "react-icons/fa";
import { GoCode, GoDash } from "react-icons/go";
import classes from "./MenuBar_mb.module.css";
function MenuBar_mb(props) {
  const [showLink, setShowLink] = useState(false);
  const [imageZone, setImageZone] = useState(false);
  const [showFontStyle, setShowFontStyle] = useState("");
  const [showListStyle, setShowListStyle] = useState("");
  const [showAlignStyle, setShowAlignStyle] = useState("");
  const [showBlockStyle, setShowBlockStyle] = useState("");

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
  // handle when user click list font style item
  function setActiveFontStyle(style) {
    if (style === "i") {
      editor.chain().focus().toggleItalic().run();
    } else if (style === "b") {
      editor.chain().focus().toggleBold().run();
    } else if (style === "u") {
      editor.chain().focus().toggleUnderline().run();
    } else if (style === "s") {
      editor.chain().focus().toggleStrike().run();
    }
    setShowFontStyle("");
  }
  function hasFontStyle() {
    if (
      editor.isActive("underline") ||
      editor.isActive("bold") ||
      editor.isActive("italic") ||
      editor.isActive("strike")
    ) {
      return true;
    }
    return false;
  }

  //handle when user click "list" item
  function setActiveListStyle(style) {
    //unordered list
    if (style === "u") {
      editor.chain().focus().toggleBulletList().run();
    }
    // ordered list
    else if (style === "o") {
      editor.chain().focus().toggleOrderedList().run();
    }
    setShowListStyle("");
  }
  // get list style in selected text
  function getListStyle() {
    if (editor.isActive("bulletList")) {
      return { style: "u", icon: <FaListUl /> };
    } else if (editor.isActive("orderedList")) {
      return { style: "o", icon: <FaListOl /> };
    }
    return { style: "n", icon: <FaListUl /> };
  }

  //handle when user click align item
  function setActiveAlignStyle(style) {
    if (style === "l") {
      editor.chain().focus().setTextAlign("left").run();
    } else if (style === "r") {
      editor.chain().focus().setTextAlign("right").run();
    } else if (style === "c") {
      editor.chain().focus().setTextAlign("center").run();
    }
    setShowAlignStyle("");
  }
  // get align style in selected text
  function getAlignStyle() {
    if (editor.isActive({ textAlign: "center" })) {
      return { style: "c", icon: <FaAlignCenter /> };
    } else if (editor.isActive({ textAlign: "left" })) {
      return { style: "l", icon: <FaAlignLeft /> };
    } else if (editor.isActive({ textAlign: "right" })) {
      return { style: "r", icon: <FaAlignRight /> };
    }
    return { style: "n", icon: <FaAlignLeft /> };
  }

  //handle when user click block item
  function setActiveBlockStyle(style) {
    //codeBlock
    if (style === "c") {
      if (!editor.isActive("codeBlock")) {
        editor.chain().focus().setParagraph().run();
      }
      if (editor.isActive("blockquote")) {
        editor.chain().focus().toggleBlockquote().run();
      }

      editor.chain().focus().toggleCodeBlock().run();
    }
    // dash(HorizontalRule)
    else if (style === "d") {
      editor.chain().focus().setHorizontalRule().run();
    }
    //quote
    else if (style === "q") {
      if (!editor.isActive("blockquote")) {
        editor.chain().focus().setParagraph().run();
      }
      editor.chain().focus().toggleBlockquote().run();
    }
    setShowBlockStyle("");
  }
  // get block style in selected text
  function getBlockStyle() {
    if (editor.isActive("codeBlock")) {
      return { style: "c", icon: <GoCode /> };
    } else if (editor.isActive("blockquote")) {
      return { style: "q", icon: <FaQuoteLeft /> };
    }
    // else if (editor.isActive("horizontalRule")) {
    //   return { style: "d", icon: <GoDash></GoDash> };
    // }
    return { style: "n", icon: <FaPlus /> };
  }
  return (
    <div className={classes["menu-container"]}>
      <select
        title={"Paragraph format"}
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
      <span className={classes["select-menu"]}>
        <p
          title={"Font style"}
          className={hasFontStyle() ? classes["is-editor-active"] : ""}
          onClick={() => {
            if (!showFontStyle) {
              setShowFontStyle(classes["show"]);
            } else {
              setShowFontStyle("");
            }
          }}
        >
          <FaFont />
        </p>
        <ul className={showFontStyle}>
          <li
            className={
              editor.isActive("bold") ? classes["is-editor-active"] : ""
            }
            onClick={() => {
              setActiveFontStyle("b");
            }}
          >
            <FaBold />
          </li>
          <li
            className={
              editor.isActive("italic") ? classes["is-editor-active"] : ""
            }
            onClick={() => {
              setActiveFontStyle("i");
            }}
          >
            <FaItalic></FaItalic>
          </li>
          <li
            className={
              editor.isActive("underline") ? classes["is-editor-active"] : ""
            }
            onClick={() => {
              setActiveFontStyle("u");
            }}
          >
            <FaUnderline></FaUnderline>
          </li>
          <li
            className={
              editor.isActive("strike") ? classes["is-editor-active"] : ""
            }
            onClick={() => {
              setActiveFontStyle("s");
            }}
          >
            <FaStrikethrough></FaStrikethrough>
          </li>
        </ul>
      </span>
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
        title={"Font size"}
      >
        {fontSizeOption()}
      </select>
      <button
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        title={"Clear style"}
      >
        <FaRemoveFormat></FaRemoveFormat>
      </button>
      <span className={classes["select-menu"]} title={"List"}>
        <p
          onClick={() => {
            if (!showListStyle) {
              setShowListStyle(classes["show"]);
            } else {
              setShowListStyle("");
            }
          }}
          className={
            getListStyle().style !== "n" ? classes["is-editor-active"] : ""
          }
        >
          {getListStyle().icon}
        </p>
        <ul className={showListStyle}>
          <li
            className={
              editor.isActive("bulletList") ? classes["is-editor-active"] : ""
            }
            onClick={() => {
              setActiveListStyle("u");
            }}
          >
            <FaListUl></FaListUl>
          </li>
          <li
            className={
              editor.isActive("orderedList") ? classes["is-editor-active"] : ""
            }
            onClick={() => {
              setActiveListStyle("o");
            }}
          >
            <FaListOl></FaListOl>
          </li>
        </ul>
      </span>
      <span className={classes["select-menu"]} title={"Align format"}>
        <p
          onClick={() => {
            if (!showAlignStyle) {
              setShowAlignStyle(classes["show"]);
            } else {
              setShowAlignStyle("");
            }
          }}
          className={classes["is-editor-active"]}
        >
          {getAlignStyle().icon}
        </p>
        <ul className={showAlignStyle}>
          <li
            className={
              editor.isActive({ textAlign: "left" })
                ? classes["is-editor-active"]
                : ""
            }
            onClick={() => {
              setActiveAlignStyle("l");
            }}
          >
            <FaAlignLeft></FaAlignLeft>
          </li>
          <li
            className={
              editor.isActive({ textAlign: "center" })
                ? classes["is-editor-active"]
                : ""
            }
            onClick={() => {
              setActiveAlignStyle("c");
            }}
          >
            <FaAlignCenter></FaAlignCenter>
          </li>
          <li
            className={
              editor.isActive({ textAlign: "right" })
                ? classes["is-editor-active"]
                : ""
            }
            onClick={() => {
              setActiveAlignStyle("r");
            }}
          >
            <FaAlignRight />
          </li>
        </ul>
      </span>

      <span className={classes["select-menu"]} title={"Block style"}>
        <p
          onClick={() => {
            if (!showBlockStyle) {
              setShowBlockStyle(classes["show"]);
            } else {
              setShowBlockStyle("");
            }
          }}
          className={
            getBlockStyle().style !== "n" ? classes["is-editor-active"] : ""
          }
        >
          {getBlockStyle().icon}
        </p>
        <ul className={showBlockStyle}>
          <li
            className={
              editor.isActive("codeBlock") ? classes["is-editor-active"] : ""
            }
            onClick={() => {
              setActiveBlockStyle("c");
            }}
          >
            <GoCode></GoCode>
          </li>
          <li
            className={
              editor.isActive("blockquote") ? classes["is-editor-active"] : ""
            }
            onClick={() => {
              setActiveBlockStyle("q");
            }}
          >
            <FaQuoteLeft />
          </li>
          <li
            onClick={() => {
              setActiveBlockStyle("d");
            }}
          >
            <GoDash />
          </li>
        </ul>
      </span>
      <button
        title={"highlight"}
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
        title={"Text color"}
        type="color"
        name="color"
        id="color"
        onChange={(event) => {
          editor.chain().focus().setColor(event.target.value.toString()).run();
        }}
        style={{ width: "20px", height: "20px" }}
        value={editor.getAttributes("textStyle").color || "#000000"}
      />

      <span>
        <button
          onClick={(event) => {
            setImageZone(!imageZone);
          }}
          title={"Insert image"}
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
      </span>

      <button
        title={"Insert link"}
        onClick={() => {
          setShowLink(!showLink);
        }}
      >
        <FaLink />
        {showLink && (
          <span
            style={{
              position: "absolute",
              bottom: "0",
              transform: "translate(-50%,100%)",
            }}
          >
            <label htmlFor="href">Link: </label>
            <input
              type="text"
              name="href"
              id="href"
              onClick={(event) => {
                event.stopPropagation();
              }}
            />
            <button
              onClick={() => {
                const previousUrl = editor.getAttributes("link").href;
                const url = document.querySelector("#href").value;
                if (url === previousUrl) {
                } else if (!url) {
                  editor
                    .chain()
                    .focus()
                    .extendMarkRange("link")
                    .unsetLink()
                    .run();
                } else if (url) {
                  editor
                    .chain()
                    .focus()
                    .extendMarkRange("link")
                    .setLink({ href: url })
                    .run();
                }
                setShowLink(false);
              }}
            >
              OK
            </button>
          </span>
        )}
      </button>

      <button
        onClick={() => editor.chain().focus().clearNodes().run()}
        title={"Clear block format style"}
      >
        Clear
      </button>
    </div>
  );
}

export default MenuBar_mb;
