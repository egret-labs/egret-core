"use strict";
/* @internal */
var ts;
(function (ts) {
    function createMapData() {
        var sentinel = {};
        sentinel.prev = sentinel;
        return { head: sentinel, tail: sentinel, size: 0 };
    }
    function createMapEntry(key, value) {
        return { key: key, value: value, next: undefined, prev: undefined };
    }
    function sameValueZero(x, y) {
        // Treats -0 === 0 and NaN === NaN
        return x === y || x !== x && y !== y;
    }
    function getPrev(entry) {
        var prev = entry.prev;
        // Entries without a 'prev' have been removed from the map.
        // An entry whose 'prev' points to itself is the head of the list and is invalid here.
        if (!prev || prev === entry)
            throw new Error("Illegal state");
        return prev;
    }
    function getNext(entry) {
        while (entry) {
            // Entries without a 'prev' have been removed from the map. Their 'next'
            // pointer should point to the previous entry prior to deletion and
            // that entry should be skipped to resume iteration.
            var skipNext = !entry.prev;
            entry = entry.next;
            if (skipNext) {
                continue;
            }
            return entry;
        }
    }
    function getEntry(data, key) {
        // We walk backwards from 'tail' to prioritize recently added entries.
        // We skip 'head' because it is an empty entry used to track iteration start.
        for (var entry = data.tail; entry !== data.head; entry = getPrev(entry)) {
            if (sameValueZero(entry.key, key)) {
                return entry;
            }
        }
    }
    function addOrUpdateEntry(data, key, value) {
        var existing = getEntry(data, key);
        if (existing) {
            existing.value = value;
            return;
        }
        var entry = createMapEntry(key, value);
        entry.prev = data.tail;
        data.tail.next = entry;
        data.tail = entry;
        data.size++;
        return entry;
    }
    function deleteEntry(data, key) {
        // We walk backwards from 'tail' to prioritize recently added entries.
        // We skip 'head' because it is an empty entry used to track iteration start.
        for (var entry = data.tail; entry !== data.head; entry = getPrev(entry)) {
            // all entries in the map should have a 'prev' pointer.
            if (entry.prev === undefined)
                throw new Error("Illegal state");
            if (sameValueZero(entry.key, key)) {
                if (entry.next) {
                    entry.next.prev = entry.prev;
                }
                else {
                    // an entry in the map without a 'next' pointer must be the 'tail'.
                    if (data.tail !== entry)
                        throw new Error("Illegal state");
                    data.tail = entry.prev;
                }
                entry.prev.next = entry.next;
                entry.next = entry.prev;
                entry.prev = undefined;
                data.size--;
                return entry;
            }
        }
    }
    function clearEntries(data) {
        var node = data.tail;
        while (node !== data.head) {
            var prev = getPrev(node);
            node.next = data.head;
            node.prev = undefined;
            node = prev;
        }
        data.head.next = undefined;
        data.tail = data.head;
        data.size = 0;
    }
    function forEachEntry(data, action) {
        var entry = data.head;
        while (entry) {
            entry = getNext(entry);
            if (entry) {
                action(entry.value, entry.key);
            }
        }
    }
    function forEachIteration(iterator, action) {
        if (iterator) {
            for (var step = iterator.next(); !step.done; step = iterator.next()) {
                action(step.value);
            }
        }
    }
    function createIteratorData(data, selector) {
        return { current: data.head, selector: selector };
    }
    function iteratorNext(data) {
        // Navigate to the next entry.
        data.current = getNext(data.current);
        if (data.current) {
            return { value: data.selector(data.current.key, data.current.value), done: false };
        }
        else {
            return { value: undefined, done: true };
        }
    }
    /* @internal */
    var ShimCollections;
    (function (ShimCollections) {
        function createMapShim(getIterator) {
            var MapIterator = /** @class */ (function () {
                function MapIterator(data, selector) {
                    this._data = createIteratorData(data, selector);
                }
                MapIterator.prototype.next = function () { return iteratorNext(this._data); };
                return MapIterator;
            }());
            return /** @class */ (function () {
                function Map(iterable) {
                    var _this = this;
                    this._mapData = createMapData();
                    forEachIteration(getIterator(iterable), function (_a) {
                        var key = _a[0], value = _a[1];
                        return _this.set(key, value);
                    });
                }
                Object.defineProperty(Map.prototype, "size", {
                    get: function () { return this._mapData.size; },
                    enumerable: false,
                    configurable: true
                });
                Map.prototype.get = function (key) { var _a; return (_a = getEntry(this._mapData, key)) === null || _a === void 0 ? void 0 : _a.value; };
                Map.prototype.set = function (key, value) { return addOrUpdateEntry(this._mapData, key, value), this; };
                Map.prototype.has = function (key) { return !!getEntry(this._mapData, key); };
                Map.prototype.delete = function (key) { return !!deleteEntry(this._mapData, key); };
                Map.prototype.clear = function () { clearEntries(this._mapData); };
                Map.prototype.keys = function () { return new MapIterator(this._mapData, function (key, _value) { return key; }); };
                Map.prototype.values = function () { return new MapIterator(this._mapData, function (_key, value) { return value; }); };
                Map.prototype.entries = function () { return new MapIterator(this._mapData, function (key, value) { return [key, value]; }); };
                Map.prototype.forEach = function (action) { forEachEntry(this._mapData, action); };
                return Map;
            }());
        }
        ShimCollections.createMapShim = createMapShim;
        function createSetShim(getIterator) {
            var SetIterator = /** @class */ (function () {
                function SetIterator(data, selector) {
                    this._data = createIteratorData(data, selector);
                }
                SetIterator.prototype.next = function () { return iteratorNext(this._data); };
                return SetIterator;
            }());
            return /** @class */ (function () {
                function Set(iterable) {
                    var _this = this;
                    this._mapData = createMapData();
                    forEachIteration(getIterator(iterable), function (value) { return _this.add(value); });
                }
                Object.defineProperty(Set.prototype, "size", {
                    get: function () { return this._mapData.size; },
                    enumerable: false,
                    configurable: true
                });
                Set.prototype.add = function (value) { return addOrUpdateEntry(this._mapData, value, value), this; };
                Set.prototype.has = function (value) { return !!getEntry(this._mapData, value); };
                Set.prototype.delete = function (value) { return !!deleteEntry(this._mapData, value); };
                Set.prototype.clear = function () { clearEntries(this._mapData); };
                Set.prototype.keys = function () { return new SetIterator(this._mapData, function (key, _value) { return key; }); };
                Set.prototype.values = function () { return new SetIterator(this._mapData, function (_key, value) { return value; }); };
                Set.prototype.entries = function () { return new SetIterator(this._mapData, function (key, value) { return [key, value]; }); };
                Set.prototype.forEach = function (action) { forEachEntry(this._mapData, action); };
                return Set;
            }());
        }
        ShimCollections.createSetShim = createSetShim;
    })(ShimCollections = ts.ShimCollections || (ts.ShimCollections = {}));
})(ts || (ts = {}));
//# sourceMappingURL=shims.js.map