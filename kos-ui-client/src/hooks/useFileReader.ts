import { useEffect, useState } from 'react';

export const useFileReader = <T>(fileList?: FileList | null) => {
  const [contents, setContents] = useState<Array<T>>([]);
  const [name, setFileName] = useState('');
  const csvFileToArray = (string: string) => {
    const csvHeader = string.slice(0, string.indexOf('\n')).split(',');
    const csvRows = string.slice(string.indexOf('\n') + 1).split('\n');
    csvRows.splice(csvRows.length - 1);
    const array = csvRows.map((i) => {
      const values = i.split(',');
      const obj = csvHeader.reduce((object, header, index) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        object[header] = values[index];
        return object;
      }, {});
      return obj as T;
    });
    setContents(array);
  };
  useEffect(() => {
    if (fileList?.item(0) !== undefined) {
      setFileName(fileList.item(0)?.name ?? '');
      fileList
        .item(0)
        ?.text()
        .then((x) => csvFileToArray(x));
    }
  }, [fileList]);
  return { contents, name };
};
