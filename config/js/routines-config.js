(function () {
    loadOptions();
    submitHandler();
})();

function submitHandler() {
    var $submitButton = $('#submit_button');

    $submitButton.on('click', function () {
        console.log('Submit');

        var return_to = getQueryParam('return_to', 'pebblejs://close#');
        location.href = return_to + encodeURIComponent(JSON.stringify(getAndStoreConfigData()));
    });
}

function loadOptions() {
    var $tasks = $("#tasks");
    var $date = $('#date');
    var $time = $('#time');

    if (localStorage.taskNames) {
        let taskNames = JSON.parse(localStorage.taskNames);
        taskNames.forEach(function (task) {
            $tasks.append('<label class="item">' + task + '</label>')
        }, this);
    }

    if (localStorage.date) {
        $date.val(localStorage.date);
    }
    if (localStorage.time){
        $time.val(localStorage.time);
    }
    
    if (localStorage.selectedDays) {
        let selectedDays = JSON.parse(localStorage.selectedDays);
        selectedDays.forEach(function (day) {
            $('#' + day).prop("checked", true);
        }, this);
    }

}

function getAndStoreConfigData() {
    var $tasks = $("#tasks");
    var $date = $('#date');
    var $time = $('#time');
    var $days = $('#days');

    var taskNames = [];
    var selectedDays = [];

    $tasks.children('label').each(function () {
        taskNames.push($(this).text());
    });

    $days.children('label').each(function () {
        if ($(this)[0].control.checked)
            selectedDays.push($(this).text().trim().replace('/\\r\\n/g', ''));
    });

    var options = {
        taskNames: taskNames,
        date: $date.val(),
        time: $time.val(),
        selectedDays: selectedDays,
    };

    // store for next time
    localStorage.taskNames = JSON.stringify(options.taskNames);
    localStorage.selectedDays = JSON.stringify(options.selectedDays);
    localStorage.date = JSON.stringify(options.date);
    localStorage.time = JSON.stringify(options.time);

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