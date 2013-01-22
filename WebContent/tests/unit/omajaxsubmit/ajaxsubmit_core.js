function arrayCount(arr, key) {
    var count=0;
    for (var i=0; i < arr.length; i++) {
        if (arr[i].name == key)
            count++;
    }
    return count;
}

function arrayValue(arr, key) {
    for (var i=0; i < arr.length; i++) {
        if (arr[i].name == key)
            return arr[i].value;
    }
}