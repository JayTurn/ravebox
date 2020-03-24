/**
 * fileManagement.model.ts
 * FileManagement Class containing static helper methods.
 */
'use strict';
import * as Fs from 'fs';
import * as Path from 'path';

/**
 * Defines a FileManagement Base class for use with the Application.
 */
export default class FileManagement {
  /**
   * Static method to retrieve or create a new directory.
   * @method retrieveDirectory
   *
   * @param  { string } directoryPath - the path to the directory.
   *
   * @return string
   */
  static retrieveDirectory(directoryPath: string): string {
    const sep: string = Path.sep,
          baseDir: string = process.env.BASE_PATH;

    directoryPath.split(sep).reduce((parentDir: string, childDir: string) => {
      const curDir: string = Path.resolve(baseDir, parentDir, childDir);

      try {
          Fs.mkdirSync(curDir);
          //Logs.message('info', `Directory created: ${directoryPath} | fileManagement.model`);
      }
      catch (err) {
        if (err.code !== 'EEXIST') {
          //Logs.message('info', `Error creating directory: ${directoryPath} | fileManagement.model`, err);
          throw err;
        }
      }

      return curDir;
    });

    return baseDir + directoryPath;
  }
}
