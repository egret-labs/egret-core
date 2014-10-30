/**
 * File system throttling
 *
 * So when you open alot of files the filesystem will just say 'screw you' and stop working.
 * With this (100% fs compatible) module, you will have auto throttling, so we'll have 20 file handles max.
 */
var fs = require("fs");

// number of active handles, plus a queue
var active = 0, processed = 0, scheduled = 0, queue = [];
var threshold = 20;

/**
 * This is the function intercepter.
 * It gets 'fs' functions, wraps them into throttle code and either executes or queues them
 */
function wrapper (target, funcName, args) {
    var callback = args.length && args[args.length - 1];
    var self = this;

    if (callback && typeof callback === "function") {
        scheduled++;

        // finished handler
        args[args.length - 1] = function () {
            processed++;
            active--;
            callback.apply(this, arguments);
        };

        // kickoff code
        var kickoff = function () {
            active++;
            target[funcName].apply(self, args);
        };

        // depending on the number of active items, we either execute it or schedule
        queue.push(kickoff);
        onItemAdded();
    }
    // cant find a callback function? then just execute
    else {
        return target[funcName].apply(this, args);
    }
}

// ===============================
// extra methods outside fs
/**
 * Throttled file copy
 */
var augment = {
    copyFile: function (src, target, callback) {
        var srcFile = fs.createReadStream(src);
        var targetFile = fs.createWriteStream(target);

        targetFile.on("close", function () {
            callback(null, src);
        });

        srcFile.pipe(targetFile);
    }
};

// copy all the fs methods
Object.keys(fs).filter(function (m) { return typeof fs[m] === "function"; }).forEach(function (func) {
    module.exports[func] = function () {
        return wrapper(fs, func, arguments);
    };
});

Object.keys(augment).forEach(function (func) {
    module.exports[func] = function () {
        return wrapper(augment, func, arguments);
    };
});

var monitor = 0;

/**
 * When an item is added to the queue we'll create a monitoring service
 */
var onItemAdded = function () {
    if (!monitor) {
        monitor = setInterval(intervalFn, 20);
    }
};

/**
 * Function that we'll run every X ms.
 */
var intervalFn = function () {
    var toProcess = threshold - active;
    var ix = 0, item = null;

    if (processed === scheduled) {
        clearInterval(monitor);
        monitor = 0;
    }
    else {
        // can use this for debugging purposes
        // console.log("queue length", queue.length, "empty counter", queueEmptyCounter, "processed", processed, "scheduled", scheduled);
    }

    while (++ix <= toProcess && (item = queue.shift())) {
        item();
    }
};

// some test code
//module.exports.readFile("./folder.js", "utf8", function (err, data) {
//    console.log(err, !!data);
//});
//module.exports.readFile("./example.js", "utf8", function (err, data) {
//    console.log(err, !!data);
//});