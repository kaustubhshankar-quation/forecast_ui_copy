import { DATABASE_NAME , STORE_NAME }  from '../services/constants'

const openDatabase = (dbName, version = 1, upgradeCallback) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, version);
  
      request.onupgradeneeded = (event) => {
        if (upgradeCallback) {
          upgradeCallback(event.target.result);
        }
      };
  
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
  
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  };


  
  const performTransaction = (db, storeName, mode, operation) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
  
      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) => reject(event.target.error);
  
      operation(store, resolve, reject);
    });
  };
  
  // Function to add or update a record
   const upsertRecord = async (dbName, storeName, data, version = 1) => {
    const db = await openDatabase(dbName, version);
    return performTransaction(db, storeName, "readwrite", (store, resolve) => {
      const request = store.put(data); // Upserts based on primary key
      request.onsuccess = () => resolve();
    });
  };
  
  // Function to fetch all records
   const fetchAllRecords = async (dbName, storeName, version = 1) => {
    const db = await openDatabase(dbName, version);
    return performTransaction(db, storeName, "readonly", (store, resolve) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
    });
  };
  
// Function to fetch a record by key with status handling
  const fetchRecordByKey = async (dbName, storeName, key, version = 1) => {
  try {
    const db = await openDatabase(dbName, version);
    const record = await performTransaction(db, storeName, "readonly", (store, resolve) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
    });

    if (record) {
      //console.log("Record found:", record);
      return { success: true, record }; // Return status and record
    } else {
      console.log("No record found for the given key.");
      return { success: false, message: "No record found" }; // Return status with a message
    }
  } catch (error) {
    console.error("Error fetching record:", error);
    return { success: false, message: "An error occurred", error }; // Return error status
  }
};
  
  // Function to delete a record by key
   const deleteRecord = async (dbName, storeName, key, version = 1) => {
    const db = await openDatabase(dbName, version);
    return performTransaction(db, storeName, "readwrite", (store, resolve) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
    });
  };
  
  // Function to clear all records
   const clearAllRecords = async (dbName, storeName, version = 1) => {
    const db = await openDatabase(dbName, version);
    return performTransaction(db, storeName, "readwrite", (store, resolve) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
    });
  };

  const upgradeDatabaseInstance = (db) => {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "id" }); // Define primary key
    }
  };


  export { openDatabase,upsertRecord,fetchAllRecords ,fetchRecordByKey,deleteRecord,clearAllRecords,upgradeDatabaseInstance }
  