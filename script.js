"use strict"

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
       if (this[i] === obj) {
           return true;
       }
    }
    return false;
};
Array.prototype.first = function(){
    return this[0]
};
Array.prototype.last = function(){
    return this[this.length-1]
};
function randomLetters(){
    for(var i = 0; i < 16; i++)
    {
        var letters = "AAAAAAAABBBBCCCCCDDEEEEEEEEFFFGGHIIIIIIJKLLMNNOOOOOOPQRSSTTUUUUUVWXYZ"
        var theLetter = letters[Math.round(Math.random() * letters.length - 1)]
        var $elem = $(`#b${i} .dinput`).val(theLetter)
    }
}

function go(){
    console.log("started")

    var minLength = $('#minimum').val();
    var maxLength = $('#maximum').val();


    var positions = [[],[],[],[]];
    var words = [];
    for(var i = 0; i < 16; i++)
    {
        var $elem = $(`#b${i} .dinput`)
        positions[i%4][parseInt(i/4)] = {val: $elem.val().toLowerCase(), elem: $elem.get(0), pos: { x:i%4, y:parseInt(i/4) }}
    }
    var _x;
    var _y;
    function getPos(x, y){
        return (positions[x]||[])[y]
    }
    function getNeighbours(neighbour){
        _x = neighbour.pos.x;
        _y = neighbour.pos.y
        return [
            getPos(_x,_y - 1),getPos(_x + 1,_y - 1),getPos(_x + 1,_y),getPos(_x + 1,_y + 1),
            getPos(_x,_y + 1),getPos(_x - 1,_y + 1),getPos(_x - 1,_y),getPos(_x - 1,_y + 1)
        ].filter(x => x !== undefined)
    }
    //Tweak optimization. dont worry
    minLength--;;
    maxLength++;
    function recurse(path){
        // setTimeout(function() {
        //     // Color Debug
        //     positions.forEach(x => x.filter(x => !path.contains(x)).forEach(x => {
        //         x.elem.setAttribute('style', 'background-color: #FFF;')
        //     }))
        //     path.forEach(x => {
        //         x.elem.setAttribute('style', 'background-color: #00F;')
        //     })
        //     path.first().elem.setAttribute('style', 'background-color: #0F0;')
        //     path.last().elem.setAttribute('style', 'background-color: #F00;')
        if (path.length > minLength && path.length < maxLength)
        {
            if (data[path.map(x => x.val).join('')] !== undefined)
            {
                if (false === words.contains(path.map(x => x.val).join('')))
                {
                    words.push(path.map(x => x.val).join(''))
                    $('#results').append(path.map(x => x.val).join('') + ',<br />');
                }   
            }
        }
        // }, 0);
        
        getNeighbours(path.last())
            .filter(x => !path.contains(x))
            .forEach(x => { 
                recurse(path.concat(x))
            })
        
    }
    var counter = 0;
    var $progressBar = $('#progress');
    var tasks = [];
    positions.forEach(x => x.forEach(x => tasks.push(x)));
    tasks = tasks.reverse();
    doTask();
    function doTask(){
        setTimeout(() => {
            recurse([tasks.pop()])
            console.log("Done with segment!  ", ++counter)
            $progressBar.css('width', `${(counter / 16) * 100}%`);
            $progressBar.text(`${(counter / 16) * 100}% Complete`);
            if (tasks.length <= 0)
                finish()
            else {
                doTask();
            }
        }, 0)
    }
    function finish(){
        console.log("finished!!");
        console.dir(words);
        //$('#results').html(words.map(x => x.val).join(',<br />'));
    }
}