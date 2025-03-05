import { createReadStream, readFileSync, statSync } from 'fs';
import * as mime from 'mime-types';
import * as path from 'path';

export default function createMulterFile(filePath: string): Express.Multer.File {
  const fileBuffer = readFileSync(filePath);
  const stats = statSync(filePath);

  return {
    fieldname: 'file',
    originalname: path.basename(filePath),
    encoding: '7bit',
    mimetype: mime.lookup(filePath) || 'text/csv',
    size: stats.size,
    destination: path.dirname(filePath),
    filename: path.basename(filePath),
    path: filePath,
    buffer: fileBuffer,
    stream: createReadStream(filePath),
  };
}
