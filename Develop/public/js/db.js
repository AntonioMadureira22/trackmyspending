let db;

//adding the action to create the connection to database
const action = indexedDB.open("budget_tracker", 1);

action.onupgradeneeded = function(event) {
    const db = event.target.results;
    db.createObjectStore("budget", {autoIncrement: true});
};

request.onsuccess = function(event) {
    db = event.target.results;
    if (navigator.onLine){
        uploadBudget();
    }
};

request.onerror = function(event){
    console.log(event.target.errorCode);
};

function saveRecord() {
    const transaction = db.transaction(["budget"], "readwrite");
    const budgetObjectStore = transaction.objectStore("budget");
    budgetObjectStore.add(record);
};

function uploadBudget() {
    const transaction = db.transaction(['budget'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('budget');

    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
              method: 'POST',
              body: JSON.stringify(getAll.result),
              headers: {
                  Accept: 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'
              } 
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                const transaction = db.transaction(['budget'], 'readwrite');
                const budgetObjectStore = transaction.objectStore('budget');
                budgetObjectStore.clear();
            })
        }
    }
}
