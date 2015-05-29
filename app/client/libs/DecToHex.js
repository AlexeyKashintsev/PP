function getHexColor(aDecColor) {
    var res = ((16777216 + aDecColor)).toString(16);
    var zero = '';
    for (var j = 0; j < 6 - res.length; j++)
        zero += '0';
    return "#" + zero + res;
}