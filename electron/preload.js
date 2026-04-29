const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getActivities: () => ipcRenderer.invoke('get-activities'),
    addActivity: (type, duration, impact) => ipcRenderer.invoke('add-activity', type, duration, impact)
});
