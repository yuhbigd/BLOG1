import { Extension } from "@tiptap/core";
import "@tiptap/extension-text-style";
const CustomMark = Extension.create({
  name: "mark",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          backgroundColor: {
            default: null,
            parseHTML: (element) =>
              element.style.backgroundColor.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.backgroundColor) {
                return {};
              }

              return {
                style: `background-color: ${attributes.backgroundColor}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setNote:
        (backgroundColor) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { backgroundColor }).run();
        },
      unsetNote:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { backgroundColor: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});
export default CustomMark;
