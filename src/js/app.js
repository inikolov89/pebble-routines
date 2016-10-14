/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Settings = require('settings');
var tasks = [];

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



