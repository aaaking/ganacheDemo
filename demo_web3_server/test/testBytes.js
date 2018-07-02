var data = [97, 100, 56, 57, 101, 98, 99, 53, 97, 99, 54, 50, 48, 48, 48, 48, 48]

let t = 0;
var d;
for(var i = 0; i< data.length; i++) {
    d = data[i];
    if((d >= 48) && (d < 58)) {
        t = (t << 4) + d - 48;
    } else if((d >=97) && (d < 103)) {
        t = (t << 4) +  d - 97 + 10;
    } else {
    }
console.log(t);
}

console.log(t);
