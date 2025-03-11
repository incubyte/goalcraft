import { Tooltip } from '@mui/material';
import { CloudUpload, FilePlus2, FileUp, X } from 'lucide-react';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { useContext, useState } from 'react';
import { OkrContext } from '../context/OkrProvider';
import { getOkrsFromDB, saveCsvDataToDB } from '../database/okr.store';
import { ObjectiveType, ParsedFile } from '../types/OKRTypes';

const CsvUploader = () => {
  const [visible, setVisible] = useState(false);
  const { setObjectives } = useContext(OkrContext);

  return (
    <div className="flex items-center">
      <button
        onClick={() => setVisible(true)}
        className="flex justify-center items-center min-w-[40px] h-[40px] rounded-full bg-transparent hover:bg-black/10"
      >
        <Tooltip title="Upload CSV" arrow>
          <CloudUpload className="text-primary" />
        </Tooltip>
      </button>

      <Dialog
        header="Upload your CSV with OKRs"
        headerClassName="text-lg font-semibold bg-gray-200 text-gray-600 p-4 rounded-t-lg"
        visible={visible}
        onHide={() => setVisible(false)}
        className="max-w-lg w-full rounded-xl shadow-xl border border-gray-200 bg-white"
        style={{ width: '40vw' }}
        closeOnEscape={true}
        closeIcon={<X className=" hover:text-gray-700" />}
        modal
        maskClassName="bg-black bg-opacity-60 backdrop-blur-sm"
      >
        <div className="p-6 max-w-lg w-full rounded-b-xl">
          <FileUpload
            name="files"
            url={`${import.meta.env.VITE_LOCAL_URL}/files/parse`}
            multiple
            accept="text/csv"
            maxFileSize={1000000}
            className="w-full"
            emptyTemplate={
              <div className="mt-3 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500 bg-gray-50">
                Drag & drop files here.
              </div>
            }
            chooseOptions={{
              className:
                'mr-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition',
              label: 'Choose Files',
              icon: <FilePlus2 className="mr-1 h-5 w-5" />,
            }}
            uploadOptions={{
              className:
                'mr-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition',
              label: 'Upload',
              icon: <FileUp className="mr-1 h-5 w-5" />,
            }}
            cancelOptions={{
              className:
                'mr-3 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition',
              label: 'Cancel',
              icon: <X className="mr-1 h-5 w-5" />,
            }}
            onUpload={async event => {
              try {
                const response: ParsedFile[] = await JSON.parse(event.xhr.response);
                if (response) {
                  response.map(async parsedFile => {
                    const okrs: ObjectiveType[] = parsedFile.parsedContent;
                    await saveCsvDataToDB(okrs).then(async () =>
                      setObjectives(await getOkrsFromDB())
                    );
                  });
                  alert('Data uploaded successfully');
                  setVisible(false);
                }
              } catch (error) {
                alert('CSV Upload Error: ' + error);
              }
            }}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default CsvUploader;
