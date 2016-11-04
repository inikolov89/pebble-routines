/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Settings = require('settings');
var Clock = require('clock');
var Wakeup = require('wakeup');

var tasks = [];


// ---------------
// --- HELPERS ---
// ---------------

// TODO: provide tasks as parameter
var getTasks = function () {
  var menuTasks = [];
  var tasks = [];
  // Extract check
  if ( Settings.option('taskNames') !== undefined) {
    tasks = Settings.option('taskNames');
  }
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

// TODO: add tasks data as parameter
var scheduleWakeUp = function (day, time) {
  var parsedTime = time.split(':');
  var nextTime = Clock.weekday(day, parsedTime[0], parsedTime[1]);
  // Schedule a wakeup event.
  Wakeup.schedule(
    { time: nextTime },
    function(e) {
      if (e.failed) {
        console.log('Wakeup set failed: ' + e.error);
      } else {
        console.log('Wakeup set! Event ID: ' + e.id);
      }
    }
  );
};



// ---------------
// --- READ CONFIG DATA ---
// ---------------
Settings.config(
  { url: 'http://inikolov.info/pebble-routines/config/' },
  function (e) {
    // TODO: add debug flag 
    console.log('closed configurable');
    console.log(e.options);

    if (e.options.tasks) {
      tasks = e.options.tasks;
    }
    
    if (e.options.selectedDays && e.options.time) {
      e.options.selectedDays.forEach(function (day) {
        // TODO: add tasks as parameter
        scheduleWakeUp(day, e.options.time);
      });
    }
  }
);

// ---------------
// --- Peristence Layer ---
// ---------------
// TODO

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


// ---------------
// --- CONTROLLER ---
// ---------------
Wakeup.on('wakeup', function(e) {
  console.log('Wakeup event! ' + JSON.stringify(e));
  // show our list
  // TODO: get tasks data from the wakeup event
  // TODO: add the next wakeup schedule with the same data
  // TODO: generate menu data here
  menu.show();
});


menu.on('select', function (event) {
  var currentItem =  menu.item(event.sectionIndex, event.itemIndex);
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



