/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Settings = require('settings');
var Wakeup = require('wakeup');

var tasks = [];
var days = [];

// ---------------
// --- READ CONFIG DATA ---
// ---------------
Settings.config(
  { url: 'http://inikolov.info/pebble-routines/config/' },
  function (e) {
    var dict = {};

    console.log('closed configurable');

    if (e.options.tasks) {
      tasks = e.options.tasks;
    }
    if (e.options.selectedDays) {
      days = e.options.selectedDays;
    }

  }
);

// ---------------
// --- Persistence Layer ---
// ---------------



// ---------------
// --- HELPERS ---
// ---------------

var getTasks = function () {
  var menuTasks = [];
  var tasks = Settings.option('taskNames');
  tasks.forEach(function (taskName) {
    menuTasks.push({
      title: taskName,
      is_done: 0,
      icon: 'images/task.png'
    });
  });
  console.log(menuTasks);
  return menuTasks;
};

// Wakeup.schedule(
//   {
//     // Set the wakeup event for one minute from now
//     time: Date.now() / 1000 + 60,
//     // Pass data for the app on launch
//     data: { hello: 'world' }
//   },
//   function (e) {
//     if (e.failed) {
//       // Log the error reason
//       console.log('Wakeup set failed: ' + e.error);
//     } else {
//       console.log('Wakeup set! Event ID: ' + e.id);
//     }
//   }
// );

// ---------------
// --- UI ---
// ---------------
var menu = new UI.Menu({
  backgroundColor: 'white',
  textColor: 'black',
  highlightBackgroundColor: '#9afdfa',
  highlightTextColor: 'black',
  sections: [{
    title: 'First section',
    items: getTasks()
  }]
});

// show our list
menu.show();


// ---------------
// --- CONTROLLER ---
// ---------------
menu.on('select', function (event) {
  var currentItem = menu.item(event.sectionIndex, event.itemIndex);
  var doneStatus = 1;
  var image = "images/done.png";

  if (currentItem.is_done == 1) {
    doneStatus = 0;
    image = 'images/task.png';
  }
  menu.item(event.sectionIndex, event.itemIndex,
    {
      title: event.item.title,
      icon: image,
      is_done: doneStatus,
      data: event.item.data,
      position: event.item.position
    });
  console.log("check if done");
  var tasksDone = 0;
  var tasksList = menu.items(event.sectionIndex);
  tasksList.forEach(function (task) {
    tasksDone += task.is_done;
  });
  if (tasksDone == tasksList.length) {
    var appDetails = new UI.Card({
      title: "well done!",
    });
    appDetails.show();
  }
});



