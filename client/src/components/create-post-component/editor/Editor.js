import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlight from "@tiptap/extension-text-align";
import "./Editor.css";
import TextStyle from "@tiptap/extension-text-style";
import FontColor from "./custom-font-color";
import Link from "@tiptap/extension-link";
import CustomMark from "./custom-mark";
import Image from "./custom-image";
import MenuBar from "./MenuBar";
import { useRef } from "react";
import { useDropArea } from "react-use";
export default function Editor(props) {
  
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: "my-editor",
      },
    },
    onUpdate({ editor }) {
      const contentJson = editor.getJSON();
      // const imageArray = contentJson.content
      //   .filter((item) => {
      //     if (item.type === "image") {
      //       return true;
      //     }
      //   })
      //   .map((item) => {
      //     return item.attrs.src;
      //   });
      // console.log(imageArray);
    },
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        blockquote: {
          HTMLAttributes: {
            class: "my-custom-blockquote",
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: "my-custom-horizontal-rule",
          },
        },
      }),
      TextAlight.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      FontColor,
      CustomMark,
      Image.configure({
        HTMLAttributes: {
          class: "my-image-class",
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    autofocus: true,
    editable: true,
    injectCSS: false,
    spellcheck: false,
  });
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const [bond, state] = useDropArea({
    onFiles: async (file) => {
      if (file[0].type.split("/")[0] === "image") {
        let imageSrc = URL.createObjectURL(file[0]);
        editor.chain().focus().setImage({ src: imageSrc }).run();
        try {
          // const imageBase64 = await getBase64(file[0]);
          // console.log(imageBase64);
        } catch (error) {
          console.log(error);
        }
      }
    },
  });
  return (
    <div className="sss">
      {/* BubbleMenu for image */}
      {editor && (
        <BubbleMenu
          editor={editor}
          pluginKey="menu"
          shouldShow={({ editor, view, state, oldState, from, to }) => {
            return editor.isActive("image");
          }}
        >
          <button
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().setImage({ size: "large" }).run();
            }}
            className={
              editor.isActive("image", { size: "large" })
                ? "is-editor-active"
                : ""
            }
          >
            large
          </button>
          <button
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().setImage({ size: "medium" }).run();
            }}
            className={
              editor.isActive("image", { size: "medium" })
                ? "is-editor-active"
                : ""
            }
          >
            medium
          </button>
          <button
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().setImage({ size: "small" }).run();
              console.log(editor.isActive("image", { size: "small" }));
            }}
            className={
              editor.isActive("image", { size: "small" })
                ? "is-editor-active"
                : ""
            }
          >
            small
          </button>
        </BubbleMenu>
      )}
      <MenuBar editor={editor} />
      <EditorContent editor={editor} {...bond} />
    </div>
  );
}
