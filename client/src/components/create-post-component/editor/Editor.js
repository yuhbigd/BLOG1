import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlight from "@tiptap/extension-text-align";
import "./Editor.css";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import FontColor from "./custom-font-color";
import Link from "@tiptap/extension-link";
import CustomMark from "./custom-mark";
import Image from "./custom-image";
import Menu from "./Menu";
import React from "react";
import { useEffect, useRef, useState, useImperativeHandle } from "react";
import { useDropArea, useBeforeUnload } from "react-use";
import useHttp from "../../../custom-hooks/use-http";
import { removeImagesRedundancy, sendImage } from "../../../api/editorApi";
import Spinner from "../../sub-components/Spinner";
import Modal from "../../sub-components/Modal";
import ErrorComponent from "../../sub-components/ErrorComponent";
import { useHistory, Prompt } from "react-router-dom";
import FontSize from "./custom-font-size";
import { FaUnlink } from "react-icons/fa";
import ThumbnailImageDropzone from "./ThumbnailImageDropzone";
const serverDomain = process.env.REACT_APP_BASE_URL;
//get base64 from image
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const Editor = React.forwardRef((props, ref) => {
  const history = useHistory();
  const navRef = useRef(true);
  const thumbnailRef = useRef("");
  const [showPrompt, setShowPrompt] = useState(false);
  //function to send the image and get the image link back
  const {
    sendRequest: sendImageToServer,
    status: sendImageStatus,
    data: imageData,
    error: sendImageError,
  } = useHttp(sendImage);
  const {
    sendRequest: deleteRedundantImage,
    status: deleteRedundantImageStatus,
    data: deleteRedundantImageData,
    error: deleteRedundantImageError,
  } = useHttp(removeImagesRedundancy);
  //state contain all image links gotten from the server
  const allImageRef = useRef(new Set());
  const saveImagesRefs = useRef(new Set());
  //error state
  const [errorState, setErrorState] = useState(null);
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: "my-editor",
      },
    },
    onUpdate({ editor }) {
      if (!showPrompt) {
        setShowPrompt(true);
      }
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
      Underline,
      CustomMark,
      Image.configure({
        HTMLAttributes: {
          class: "my-image-class",
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      FontSize,
    ],
    autofocus: true,
    editable: true,
    injectCSS: false,
    spellcheck: false,
  });

  // beforeunload confirm
  async function removeUnsavedImages() {
    const saveImagesArray = Array.from(saveImagesRefs.current);
    const redundantImages = Array.from(allImageRef.current).filter((image) => {
      return !saveImagesArray.includes(image);
    });
    if (redundantImages.length > 0) {
      await deleteRedundantImage({ images: redundantImages });
    }
  }
  useEffect(() => {
    const unListen = history.listen(() => {
      if (navRef.current === true) {
        if (history.location.pathname !== "/create") {
          removeUnsavedImages();
          navRef.current = false;
        }
      }
    });
    // This function will be invoked on component unmount and will clean up
    // the event listener.
    return unListen;
  }, []);
  useEffect(() => {
    if (showPrompt) {
      window.onbeforeunload = () => {
        console.log("ASd");
        return "Unsaved change will be removed, are you sure?";
      };
      window.onunload = async function () {
        await removeUnsavedImages();
      };
    } else {
      window.onunload = () => {};
      window.onbeforeunload = () => {};
    }
    return () => {
      console.log("Asds");
      window.onunload = () => {};
      window.onbeforeunload = () => {};
    };
  }, [showPrompt]);
  //handle image drop into editor
  const [bond, state] = useDropArea({
    onFiles: async (file) => {
      if (file[0].type.split("/")[0] === "image") {
        try {
          const imageBase64 = await getBase64(file[0]);
          sendImageToServer(imageBase64);
        } catch (error) {
          console.log(error);
        }
      }
    },
  });
  useEffect(() => {
    if (sendImageError != null) {
      setErrorState(
        <Modal
          clickHandle={() => {
            setErrorState(null);
          }}
        >
          <ErrorComponent
            clickHandle={() => {
              setErrorState(null);
            }}
            message={`${sendImageError.message} - ${sendImageError.statusCode}`}
          ></ErrorComponent>
        </Modal>,
      );
    }
    if (imageData != null && sendImageStatus == "completed") {
      editor
        .chain()
        .focus()
        .setImage({ src: serverDomain + imageData.link })
        .run();
      allImageRef.current.add(imageData.link);
    }
  }, [sendImageStatus, imageData, sendImageError]);
  // check image in editor with all image then remove all redundant images and create saveImages / save
  const savePost = async (event) => {
    // array of images gotten from server in editor
    let imageArray = editor
      .getJSON()
      .content.filter((item) => {
        if (item.type === "image") {
          return true;
        }
      })
      .map((item) => {
        return item.attrs.src;
      })
      .filter((item) => {
        return item.includes(process.env.REACT_APP_BASE_URL, 0);
      });
    if (thumbnailRef.current !== "") {
      if (thumbnailRef.current.includes(process.env.REACT_APP_BASE_URL, 0)) {
        imageArray.push(thumbnailRef.current);
      }
    }
    imageArray = imageArray.map((item) => {
      return item.split(process.env.REACT_APP_BASE_URL)[1];
    });
    const redundantImages = Array.from(allImageRef.current).filter((image) => {
      return !imageArray.includes(image);
    });
    setShowPrompt(false);
    allImageRef.current = new Set(imageArray);
    saveImagesRefs.current = new Set(imageArray);
    if (redundantImages.length > 0) {
      await deleteRedundantImage({ images: redundantImages });
    }
  };

  // check image in saveImages with all image and remove all redundant images / out

  //forward Ref
  useImperativeHandle(ref, () => ({
    getHTMLContent: () => editor.getHTML(),
    getJSONContent: () => editor.getJSON(),
    deleteRedundantImagesOnSave: savePost,
    thumbnailImage: () => thumbnailRef.current,
  }));
  return (
    <div>
      <ThumbnailImageDropzone
        allImageRef={allImageRef}
        thumbnailRef={thumbnailRef}
        setShowPrompt={() => {
          setShowPrompt(true);
        }}
      ></ThumbnailImageDropzone>
      {/* BubbleMenu for image */}
      {editor && (
        <>
          <BubbleMenu
            editor={editor}
            pluginKey="menu"
            shouldShow={({ editor, view, state, oldState, from, to }) => {
              return editor.isActive("image");
            }}
            className={"bubble-menu"}
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
          <BubbleMenu
            className={"bubble-menu"}
            editor={editor}
            pluginKey="link"
            shouldShow={({ editor, view, state, oldState, from, to }) => {
              return editor.isActive("link");
            }}
          >
            <button
              onClick={() => {
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .unsetLink()
                  .run();
              }}
            >
              <FaUnlink />
            </button>
          </BubbleMenu>
        </>
      )}
      <div className="editor-container">
        <Menu editor={editor} sendImageRequest={sendImageToServer} />
        <div className="editor-container--subcontainer">
          <EditorContent editor={editor} {...bond} />
        </div>
      </div>
      {sendImageStatus === "pending" && <Spinner></Spinner>}
      {errorState}
      <button onClick={savePost}>Save to draft</button>
      <Prompt
        when={showPrompt}
        message={(location, action) => {
          if (location.pathname.startsWith("/create")) {
            return false;
          }
          return `Everything unsaved will be removed, Are you sure to navigate away?`;
        }}
      ></Prompt>
    </div>
  );
});
export default Editor;
