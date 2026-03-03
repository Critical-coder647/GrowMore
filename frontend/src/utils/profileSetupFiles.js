const filesStore = {
  logo: null,
  pitchDeck: null
};

export function setProfileSetupFile(key, file) {
  if (!Object.prototype.hasOwnProperty.call(filesStore, key)) return;
  filesStore[key] = file || null;
}

export function getProfileSetupFile(key) {
  if (!Object.prototype.hasOwnProperty.call(filesStore, key)) return null;
  return filesStore[key] || null;
}

export function clearProfileSetupFiles() {
  filesStore.logo = null;
  filesStore.pitchDeck = null;
}
