

try {


    var p = new Promise(function (r, rr) {
        console.log("F");
        r(3);
    });


    console.log(p);

} catch (e) {
    console.log(e);
}