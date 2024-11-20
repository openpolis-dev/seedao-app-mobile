import { NotionRenderer } from 'react-notion-x';
import { Code } from 'react-notion-x/build/third-party/code';
import { Collection } from 'react-notion-x/build/third-party/collection';
import { Equation } from 'react-notion-x/build/third-party/equation';
import { Modal } from 'react-notion-x/build/third-party/modal';
import { Pdf } from 'react-notion-x/build/third-party/pdf';
import './styles.css';

export default function Notion({ recordMap }) {


  const baseUrl = `${window.location.origin}/notion/`;
  const getUrl = (url) => {
    return `${baseUrl}${url}`;
  };

  if (!recordMap) {
    return null;
  }
  return (
    <div>
      <NotionRenderer
        recordMap={recordMap}
        fullPage={true}
        mapPageUrl={(url) => getUrl(url)}
        components={{
          Code,
          Collection,
          Equation,
          Modal,
          Pdf,
        }}
      />
    </div>
  );
}
