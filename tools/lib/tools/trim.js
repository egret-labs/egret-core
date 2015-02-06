/**
 * Created by huanghaiying on 15/2/6.
 */

function trimLeft(str) {
    return str.replace(/^(\s)*/, "");
}

function trimRight(str) {
    return str.replace(/(\s)*$/, "");
}

function trimAll(str) {
    return trimRight(trimLeft(str));
}


exports.trimLeft = trimLeft;

exports.trimRight = trimRight;

exports.trimAll = trimAll;
