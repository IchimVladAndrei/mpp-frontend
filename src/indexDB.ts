const indexedDB = window.indexedDB;
if (!indexedDB) console.log('IndexDb is not found on this browser');
const requestIndexDb = indexedDB.open('MPPDatabase', 1);
requestIndexDb.onerror = (event) => {
    console.log('An error occured with IndexDb');
    console.log(event);
};
requestIndexDb.onupgradeneeded = function () {
    const db = requestIndexDb.result;
    db.createObjectStore('dealerships', {
        keyPath: 'did',
        autoIncrement: true,
    });
};

requestIndexDb.onsuccess = function () {
    console.log('db opened ok');

    const db = requestIndexDb.result;
    const transaction = db.transaction('dealerships', 'readwrite');
    const store = transaction.objectStore('dealerships');

    const putRequest = store.add({
        name: 'Example Name',
        location: 'Example Location',
        review: 5.0,
    });

    putRequest.onerror = () => {
        console.log('Error adding data to IndexedDB');
    };

    putRequest.onsuccess = () => {
        console.log('Data added to IndexedDB successfully');
    };

    transaction.oncomplete = () => {
        db.close();
    };
};
export default requestIndexDb;
