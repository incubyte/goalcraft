import { Tooltip } from '@mui/material';
import { CloudDownload } from 'lucide-react';

function DownloadAllOkrsButton() {
  return (
    <div className="flex items-center">
      <div className="flex justify-center items-center min-w-[40px] h-[40px] rounded-full bg-transparent hover:bg-black/10">
        <a href={`${import.meta.env.VITE_LOCAL_URL}/files/download`}>
          <Tooltip title="Download Okrs" arrow>
            <CloudDownload className="text-primary" />
          </Tooltip>
        </a>
      </div>
    </div>
  );
}

export default DownloadAllOkrsButton;
