import { StringMap } from 'quill';

export const quillModules = () => {
  return {
    clipboard: {
      matchVisual: false,
    },
    markdownOptions: {},
    mention: {},
    'emoji-textarea': true,
  };
};
