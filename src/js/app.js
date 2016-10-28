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

var getTasks = function () {
  var menuTasks = [];
  var tasks = [];
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

var scheduleWakeUp = function (day, time) {
  var nextTime = Clock.weekday(day, 22, 03);
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
    console.log('closed configurable');
    console.log(e.options);

    if (e.options.tasks) {
      tasks = e.options.tasks;
    }
    
    if (e.options.selectedDays && e.options.time) {
      e.options.selectedDays.forEach(function (day) {
        scheduleWakeUp(day, e.options.time);
      });
    }
    //TODO: repeating
// Next Tuesday at 6:00 a.m.
    

  }
);

// ---------------
// --- Peristence Layer ---
// ---------------


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



