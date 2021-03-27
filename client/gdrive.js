/// searces for files in gdrive, returns files array into the filesCallback
export function getDriveFilesStrict(name, filesCallback, errorCallback) {
  window.gapi.client.drive.files.list({
    spaces: 'appDataFolder',
    q: `name = '${name}' and trashed = false`,
  }).then(res => {
    res.result.files.forEach(file => {
      console.log('Found file: ', file);
    });
    if (filesCallback)filesCallback(res.result.files);
  }).catch(err => {
    console.error(err);
    if (errorCallback) errorCallback(err);
  });
}

export function getDriveFilesLike(name, filesCallback, errorCallback) {
  window.gapi.client.drive.files.list({
    spaces: 'appDataFolder',
    q: `name contains '${name}' and trashed = false`,
  }).then(res => {
    res.result.files.forEach(file => {
      console.log('Found file: ', file);
    });
    if (filesCallback)filesCallback(res.result.files);
  }).catch(err => {
    console.error(err);
    if (errorCallback) errorCallback(err);
  });
}

export function readDriveFile(id, readyCallback, errorCallback) {
  window.gapi.client.drive.files.get({ fileId: id, alt: 'media' }).then(res => {
    if (readyCallback && 'body' in res)readyCallback(res.body);
  }).catch(err => {
    console.error(err);
    if (errorCallback) errorCallback(err);
  });
}

export function createDriveFile(name, text, readyCallback, errorCallback) {
  window.gapi.client.drive.files.create({
    name,
    parents: ['appDataFolder'],
  }).then(res => {
    updateDriveFile(res.result.id, text, readyCallback, errorCallback);
  }).catch(err => {
    console.error(err);
    if (errorCallback) errorCallback(err);
  });
}

export function updateDriveFile(id, text, readyCallback, errorCallback) {
  window.gapi.client.request({
    path: `/upload/drive/v3/files/${id}`,
    method: 'PATCH',
    params: {
      uploadType: 'media',
    },
    body: text,
  }).then(res => {
    if (readyCallback)readyCallback(res.result);
  }).catch(err => {
    console.log(err);
    if (errorCallback) errorCallback(err);
  });
}

const gdriveCache = {};

export function updateDriveFileByName(name, text, readyCallback, errorCallback) {
  const id = gdriveCache[name];
  if (id) {
    updateDriveFile(id, text, readyCallback, err => {
      delete (gdriveCache[name]);
      if (errorCallback) errorCallback(err);
    });
  } else {
    getDriveFilesStrict(name, list => {
      if (list.length) {
        gdriveCache[name] = list[0].id;
        updateDriveFile(list[0].id, text, readyCallback, errorCallback);
      } else {
        createDriveFile(name, text, readyCallback, errorCallback);
      }
    }, errorCallback);
  }
}

export function removeDriveFile(id, readyCallback, errorCallback) {
  window.gapi.client.drive.files.delete({ fileId: id }).then(res => {
    if (readyCallback)readyCallback(res);
    else console.log('removeDriveFile =>', res);
  }).catch(err => {
    console.log(err);
    if (errorCallback) errorCallback(err);
  });
}

export function removeDriveFileByName(name, readyCallback, errorCallback) {
  getDriveFilesStrict(name, list => {
    list.forEach(el => removeDriveFile(el.id, readyCallback, errorCallback));
  }, errorCallback);
}
