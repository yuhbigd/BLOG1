import Image from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/core";

export default Image.extend({
  name: "image",

  addAttributes() {
    return {
      ...Image.config.addAttributes(),
      size: {
        default: "small",
        rendered: false,
      },
    };
  },

  addCommands() {
    return {
      setImage:
        (options) =>
        ({ tr, commands }) => {
          if (tr.selection?.node?.type?.name == "image") {
            return commands.updateAttributes("image", options);
          } else {
            return commands.insertContent({
              type: this.name,
              attrs: options,
            });
          }
        },
    };
  },
  renderHTML({ node, HTMLAttributes }) {
    HTMLAttributes.class = "image-" + node.attrs.size;
    if (!HTMLAttributes.alt) {
      HTMLAttributes.alt = "image";
    }
    HTMLAttributes.title = HTMLAttributes.alt;
    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },
});
