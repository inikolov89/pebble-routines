(function () {
    loadOptions();
    submitHandler();
})();

function submitHandler() {
    var $submitButton = $('#submit_button');

    $submitButton.on('click', function () {
        console.log('Submit');

        var return_to = getQueryParam('return_to', 'pebblejs://close#');
        document.location = return_to + encodeURIComponent(JSON.stringify(getAndStoreConfigData()));

    });
}

function loadOptions() {
    var $tasks = $("#tasks");
    
    if (localStorage.taskNames) {
        let taskNames = JSON.parse(localStorage.taskNames);
        taskNames.forEach(function (task) {
            $tasks.append('<label class="item">' + task + '</label>')
        }, this);
    }

}

function getAndStoreConfigData() {
    var $tasks = $("#tasks");
    var $date = $('#date');
    var $time = $('#time');

    var taskNames = [];
    $tasks.children('label').each(function () {
        taskNames.push($(this).text());
    });

    var options = {
        taskNames: taskNames,
        date: $date.val(),
        time: $time.val(),
    };

    // store for next time
    localStorage.taskNames = JSON.stringify(options.taskNames);

    console.log('Got options: ' + JSON.stringify(options));
    return options;
}

function getQueryParam(variable, defaultValue) {
    var query = location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return defaultValue || false;
}