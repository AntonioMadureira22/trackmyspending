let db;

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