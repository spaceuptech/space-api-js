const fetchAsync = require("../utils").fetchAsync;
var FormData = require("form-data");

class FileStore {
  /**
   * Create an instance of the FileStore Interface.
   * @param {string} appId
   * @param {string} url
   * @param {Object} options
   */

  constructor(appId, url, options) {
    this.appId = appId;
    this.url = url;
    this.options = options;
    delete this.options.headers["Content-Type"];
  }

  /**
   * Uploads the given file at given path.
   * @param {string} path
   * @param {file} file
   * @param {string} name
   * @returns {Promise} Returns a promise containing response from server.
   * @example
   * const fileInput = document.querySelector('#your-file-input');
   * api.FileStore().uploadFile("/some-path", fileInput.files[0]).then(res => {
   *   if (res.status === 200) {
   *     console.log("File uploaded successfully");
   *   }
   * })
   */
  uploadFile(path, file, name) {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", "file");
    formData.append("path", path);
    formData.append("makeAll", "true");
    if (name) {
      formData.append("fileName", name);
    }
    const url = `${this.url}v1/api/${this.appId}/files`;
    return fetchAsync(
      url,
      Object.assign({}, this.options, { method: "POST", body: formData })
    );
  }

  /**
   * Creates a folder with given name at given path.
   * @param {string} path
   * @param {string} name
   * @returns {Promise} Returns a promise containing response from server.
   * @example
   * api.FileStore().createFolder("/some-path", "my-folder").then(res => {
   *   if (res.status === 200) {
   *     console.log("Folder created successfully");
   *   }
   * })
   */
  createFolder(path, name) {
    let formData = new FormData();
    formData.append("fileType", "folder");
    formData.append("path", path);
    formData.append("name", name);
    formData.append("makeAll", "true");
    const url = `${this.url}v1/api/${this.appId}/files`;
    return fetchAsync(
      url,
      Object.assign({}, this.options, { method: "POST", body: formData })
    );
  }

  /**
   * Returns list of files within a directory.
   * @param {string} path
   * @returns {Promise} Returns a promise containing response from server.
   * @example
   * api.FileStore().listFiles("/some-path").then(res => ...)
   */
  listFiles(path) {
    const url = `${this.url}v1/api/${
      this.appId
      }/files/${path}?op=list&mode=all`;
    return fetchAsync(url, Object.assign({}, this.options, { method: "GET" }));
  }

  /**
   * Deletes a file / folder at given path.
   * @param {string} path
   * @returns {Promise} Returns a promise containing response from server.
   * @example
   * api.FileStore().delete("/some-path").then(res => {
   *   if (res.status === 200) {
   *     console.log("Deleted successfully");
   *   }
   * })
   */
  delete(path) {
    const url = `${this.url}v1/api/${this.appId}/files/${path}?fileType=file`;
    return fetchAsync(
      url,
      Object.assign({}, this.options, { method: "DELETE" })
    );
  }

  deleteFolder(path) {
    const url = `${this.url}v1/api/${this.appId}/files/${path}?fileType=dir`;
    return fetchAsync(
      url,
      Object.assign({}, this.options, { method: "DELETE" })
    );
  }
}

module.exports = FileStore;
