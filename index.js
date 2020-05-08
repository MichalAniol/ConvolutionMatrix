const place_for_tab = document.getElementById('place_for_tab');
const resultElem = document.getElementById('result');
var tabele;

const xInp = document.getElementById('width');
const yInp = document.getElementById('height');

const cxInp = document.getElementById('cx');
const cyInp = document.getElementById('cy');
var c = {
    x: Number(cxInp.value) - 1,
    y: Number(cyInp.value) - 1,
    ax: Number(xInp.value),
    ay: Number(yInp.value)
};


const maxNumX = 40;
const maxNumY = 60;

var mode = 2;
const butMode = (but, num) => {
    let modes = but.parentElement;
    for (let b of modes.childNodes) {
        b.className = ''
    }
    but.className = 'active';
    mode = num;
}

let but = document.querySelectorAll('.modes button');
for (let i = 0; i < but.length; i++) {
    but[i].setAttribute('onclick', 'butMode(this, ' + i + ')');
}
but[2].className = 'active';

var osY;

let justStarted = true;
var memo = [];
const memorise = () => {
    if (justStarted) { return; }

    let tr = document.querySelectorAll('tr');
    let numtr = tr.length - 1;
    let numtd = tr[1].querySelectorAll('td').length - 1;

    for (let y = 1; y < numtr + 1; y++) {
        let tdInLine = tr[y].querySelectorAll('td');
        for (let x = 1; x < numtd + 1; x++) {
            if (typeof memo[y - 1] != 'undefined') {
                memo[y - 1][x - 1] = tdInLine[x].getAttribute('data-f');
            } else {
                memo[y - 1] = [];
                memo[y - 1][x - 1] = tdInLine[x].getAttribute('data-f');
            }
        }
    }

}

const remember = () => {
    let tr = document.querySelectorAll('tr');
    let numtr = tr.length - 1;
    let numtd = tr[1].querySelectorAll('td').length - 1;

    for (let y = 1; y < numtr + 1; y++) {
        let tdInLine = tr[y].querySelectorAll('td');
        for (let x = 1; x < numtd + 1; x++) {
            if (typeof memo[y - 1] != 'undefined') {
                tdInLine[x].setAttribute('data-f', memo[y - 1][x - 1]);

                if (memo[y - 1][x - 1] == '1') {
                    tdInLine[x].style.setProperty('background-color', 'var(--color_2)');
                    tdInLine[x].style.color = 'var(--color_back)';
                }
            }
        }
    }
    //console.table(memo);
}

const reset = () => {
    memo = [];
    starter(false);
}

const moveLeft = () => {
    memorise();

    for (let i = 0; i < memo.length - 1; i++) {
        for (let j = 0; j < memo[i].length - 1; j++) {

            memo[i][j] = memo[i][j + 1];
        }
        memo[i][memo[i].length - 1] = '0';
    }

    starter(false);
}

const moveUp = () => {
    memorise();

    for (let i = 0; i < memo.length - 1; i++) {
        memo[i] = memo[i + 1];
    }

    memo[memo.length - 1] = [];
    for (let i = 0; i < memo[0].length; i++) {
        memo[memo.length - 1][i] = '0';
    }

    starter(false);
}

const moveDown = () => {
    memorise();

    for (let i = memo.length; i > 0; i--) {
        if (typeof memo[i] == 'undefined') {
            memo[i] = [];
        }

        memo[i] = memo[i - 1];
    }

    memo[0] = [];
    if (typeof memo[1] != 'undefined') {
        for (let i = 0; i < memo[1].length; i++) {
            memo[0][i] = '0';
        }
    }

    starter(false);
}

const moveRight = () => {
    memorise();

    for (let i = 0; i < memo.length - 1; i++) {
        for (let j = memo[i].length - 1; j > 0 - 1; j--) {

            memo[i][j + 1] = memo[i][j];
        }
        memo[i][0] = '0';
    }

    starter(false);
}

const starter = (memoTable = true) => {
    if (memoTable) { memorise(); }
    if (justStarted) {
        document.getElementById('starter').innerHTML = 'resize table';
        document.getElementById('reset').style.display = 'initial';
        document.querySelector('.moves').style.display = 'flex';
        document.querySelector('.modes').style.display = 'flex';
        document.querySelector('.save_section').style.display = 'flex';
        document.querySelector('.wrapper').style.display = 'flex';
        place_for_tab.style.display = 'inline';
        resultElem.style.display = 'inherit';
        document.getElementById('result_c').checked = true;
        document.getElementById('result_a').checked = false;
    }
    justStarted = false;

    c.x = Number(cxInp.value) - 1;
    c.y = Number(cyInp.value) - 1;
    c.ax = Number(xInp.value);
    c.ay = Number(yInp.value);

    let clearElem = place_for_tab.childNodes;
    for (let c of clearElem) {
        c.remove();
    }
    tabele = document.createElement('table');
    tabele.className = 'table';
    place_for_tab.append(tabele)

    let h = document.getElementById('height').value;
    let w = document.getElementById('width').value;

    let nagowek = document.createElement('tr');
    tabele.append(nagowek);

    let thElem = document.createElement('th');
    nagowek.append(thElem);

    for (let i = 0; i < w; i++) {
        let thElem = document.createElement('th');
        thElem.innerHTML = '<b>' + (i - c.x) + '</b>'
        nagowek.append(thElem);
    }

    for (let y = 0; y < h; y++) {
        let trElem = document.createElement('tr');
        tabele.append(trElem);

        let tdElem = document.createElement('td');
        let posy = y - c.y;
        tdElem.innerHTML = posy;
        trElem.append(tdElem);

        for (let x = 0; x < w; x++) {
            tdElem = document.createElement('td');
            let posx = x - c.x;

            if (posx == 0 && posy == 0) {
                tdElem.innerHTML = '<div><div><b>' + posx + "." + posy + '</b></div></div>';
            } else {
                tdElem.innerHTML = '<div><div>' + posx + "." + posy + '</div></div>';
            }
            tdElem.id = 'cell_' + y + '_' + (x + 1);
            tdElem.setAttribute('data-f', '0');
            trElem.append(tdElem);
        }
    }

    remember();

    osY = tabele.childNodes;

    const mouseover = e => {
        let id = e.target.closest('td').id;
        if (id != '') {
            let pos = id.split('_');

            let cords = [
                [area.start[1], Number(pos[2])],
                [area.start[0] + 1, Number(pos[1]) + 1],
            ]

            mark(cords);
        }
    }

    var mouseIsOn = false;
    const mousedown = e => {
        let id = e.target.closest('td').id;
        if (id != '') {
            let pos = id.split('_');
            area.start = [Number(pos[1]), Number(pos[2])];
            area.reset();

            tabele.addEventListener('mouseover', mouseover);
            mouseover(e);
        }
        mouseIsOn = true;
    }

    tabele.addEventListener('mousedown', mousedown)

    document.addEventListener('mouseup', (e) => {
        if (mouseIsOn) {
            tabele.removeEventListener('mouseover', mouseover);
            dataArea();
            showResult();
            mouseIsOn = false;
        }
    })
}

const area = {
    new: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    old: {
        left: null,
        right: null,
        top: null,
        bottom: null
    },
    big: {
        left: null,
        right: null,
        top: null,
        bottom: null
    },
    start: null,
    reset: () => {

        for (let key of Object.keys(area.old)) {
            area.old[key] = null;
        }
        for (let key of Object.keys(area.big)) {
            area.big[key] = null;
        }
    },
    memo: () => {
        area.old.left = area.big.left;
        area.old.right = area.big.right;
        area.old.top = area.big.top;
        area.old.bottom = area.big.bottom;
    }

}

const fillArea = () => {
    let { left, right, top, bottom } = area.big;

    let func;
    switch (mode) {
        case 0: func = (e) => {
            e.style.setProperty('background-color', 'var(--color_2)');
            e.style.color = 'var(--color_back)';
        }; break;
        case 1: func = (e) => {
            e.style.setProperty('background-color', 'var(--color_back)');
            e.style.color = 'var(--color_1)';
        }; break;
        case 2: func = (e) => {
            let type = e.getAttribute('data-f') == 0;
            let param1 = type ? 'var(--color_2)' : 'var(--color_back)';
            let param2 = type ? 'var(--color_back)' : 'var(--color_1)';
            e.style.setProperty('background-color', param1);
            e.style.color = param2;
        }; break;
    }

    for (let y = top; y < bottom + 1; y++) {

        let osX = osY[y].childNodes;

        for (let x = left; x < right + 1; x++) {
            let elem = osX[x];

            if (x >= area.new.left && x <= area.new.right
                && y >= area.new.top && y <= area.new.bottom) {

                func(elem);
            } else {
                let orygin = elem.getAttribute('data-f');
                if (orygin == '0') {
                    elem.style.setProperty('background-color', 'var(--color_back)');
                    elem.style.color = 'var(--color_1)';
                } else {
                    elem.style.setProperty('background-color', 'var(--color_2)');
                    elem.style.color = 'var(--color_back)';
                }
            }
        }
    }
}

const dataArea = () => {
    let { left, right, top, bottom } = area.new;
    let func;
    switch (mode) {
        case 0: func = (e) => e.setAttribute('data-f', '1'); break;
        case 1: func = (e) => e.setAttribute('data-f', '0'); break;
        case 2: func = (e) => {
            let param = e.getAttribute('data-f') == 0 ? '1' : '0';
            e.setAttribute('data-f', param);
        }; break;
    }

    for (let y = top; y < bottom + 1; y++) {

        let osX = osY[y].childNodes;

        for (let x = left; x < right + 1; x++) {
            let elem = osX[x];

            func(elem);
        }
    }
}

const makeArea = cords => {
    area.new.left = Math.min(...cords[0]);
    area.new.right = Math.max(...cords[0]);
    area.new.top = Math.min(...cords[1]);
    area.new.bottom = Math.max(...cords[1]);

    if (area.old.top != null) {
        area.big.left = Math.min(area.new.left, area.old.left);
        area.big.right = Math.max(area.new.right, area.old.right);
        area.big.top = Math.min(area.new.top, area.old.top);
        area.big.bottom = Math.max(area.new.bottom, area.old.bottom);
    } else {
        let { left, right, top, bottom } = area.new;
        area.big.left = left;
        area.big.right = right;
        area.big.top = top;
        area.big.bottom = bottom;
    }
}

const mark = (cords) => {
    makeArea(cords);

    fillArea();

    area.memo();
}

var result_kind = 1;
const resultConvolution = () => {
    document.getElementById('result_a').checked = false;
    document.getElementById('result_c').checked = true;
    document.getElementById('discription').innerHTML = 'body &nbsp; = &nbsp; ( [ height, width ], &nbsp; [ [ top, bottom ], [ left, right ] ], &nbsp; items, &nbsp; [ [ y1, x1 ], [ y2, x2 ], ... ] )';
    result_kind = 1;
    showResult();
}
const resultJustArray = () => {
    document.getElementById('result_a').checked = true;
    document.getElementById('result_c').checked = false;
    document.getElementById('discription').innerHTML = 'body &nbsp; = &nbsp; ( [ y1, x1 ], [ y2, x2 ], [ y3, x3 ] ... )';
    result_kind = 2;
    showResult();
}

const showResult = () => {
    let tdElems = tabele.querySelectorAll('td');
    let first = true;
    let index = 0;
    let elems = '<b>new int[,]</b> { ';
    let v = {
        x: Number(document.getElementById('vx').value),
        y: Number(document.getElementById('vy').value)
    }

    for (let tdElem of tdElems) {
        let attr = tdElem.getAttribute('data-f');
        let pos = tdElem.id.split('_');

        let txt = '{ ' + (Number(pos[1]) - c.y + v.y) + ', ' + (Number(pos[2]) - c.x - 1 + v.x) + ' }';

        if (attr == '1') {
            if (first == true) {
                elems += txt;
            } else {
                elems += ', ' + txt;
            }
            first = false;
            index++;
        }
    }
    elems += ' }';

    let size = '<b>new int[]</b> { ' + c.ay + ', ' + c.ax + ' }, ';
    let margin = '<b>new int[,]</b> { { ' + (c.y) + ', ' + (-(c.ay - c.y - 1)) + ' }, { ' + (c.x) + ', ' + (-(c.ax - c.x - 1)) + ' } }, '
    let items = index + ', ';

    let result;

    switch (result_kind) {
        case 1: {
            result = '<b>ConvolutionTable name</b> = new ConvolutionTable(' + size + margin + items + elems + ');';
        }; break;
        case 2: {
            result = '<b>int[,] name</b> = ' + elems + ';';
        }; break;
    }

    resultElem.innerHTML = result;
}

const isNumber = e => {
    let key = (e.which) ? e.which : e.keyCode

    if ((key > 47 && key < 58) || key == 46) {
        return true;
    }
    return false;
}

const fixNumber = (item, fix = 0, min = 1, max = 30) => {
    let val = item.value.replace('.', '#').split('.');
    let newVal = Number(val[0].replace('#', '.')).toFixed(fix);

    if (newVal < min) { newVal = min }
    if (newVal > max) { newVal = max }

    item.value = newVal;
}

const xMaxCallback = () => {
    let val = Number(xInp.value);
    let newVal = Number(cxInp.value)

    if (newVal > val) {
        cxInp.value = val;
    }
}

const yMaxCallback = () => {
    let val = Number(yInp.value);
    let newVal = Number(cyInp.value)

    if (newVal > val) {
        cyInp.value = val;
    }
}

const add = (item, val = .1, fix = 0, max = 30, callback = () => { }) => {
    let elem = item.parentElement.querySelector('input'),
        elVal = Number(elem.value);

    if (elVal.toString() == 'NaN') { elVal = 1 }
    let newVal = elVal + val;

    if (newVal > max) { newVal = max }
    elem.value = (newVal).toFixed(fix);

    callback();
}

const xMinCallback = () => {
    let val = Number(cxInp.value);
    let newVal = Number(xInp.value) - 1;

    if (val > newVal) {
        cxInp.value = newVal;
    }
}

const yMinCallback = () => {
    let val = Number(cyInp.value);
    let newVal = Number(yInp.value) - 1;

    if (val > newVal) {
        cyInp.value = newVal;
    }
}

const subtract = (item, val = .1, fix = 0, min = 1, callback = () => { }) => {
    let elem = item.parentElement.querySelector('input'),
        elVal = Number(elem.value);

    if (elVal.toString() == 'NaN') { elVal = 0 }

    let newVal = elVal - val;
    if (newVal < min) { newVal = min }

    elem.value = (newVal).toFixed(fix);

    callback();
}

const CopyToClipboard = containerid => {
    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select().createTextRange();
        document.execCommand("copy");
        range.moveToElementText(document.getElementById('end_copy'));
        range.select().createTextRange();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById(containerid));
        window.getSelection().addRange(range);
        document.execCommand("copy");
        range.selectNode(document.getElementById('end_copy'));
        window.getSelection().addRange(range);
    }
    let but = document.getElementById('copy_but');
    but.innerHTML = "c o p i e d &nbsp; ! ! !";
    setTimeout(() => {
        but.innerHTML = "Copy element";
    }, 500);
}


//----------------------

function saveTextAsFile() {
    memorise();
    let myObject = {
        memo: memo,
        x: document.getElementById('width').value,
        y: document.getElementById('height').value,
        cx: document.getElementById('cx').value,
        cy: document.getElementById('cy').value,
        vy: document.getElementById('vy').value,
        vx: document.getElementById('vx').value
    };

    let textToSaveAsBlob = new Blob([JSON.stringify(myObject, null, 2)], { type: "text/plain" });
    let textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    let fileNameToSaveAs = document.querySelector('.files input').value + '.json';

    let downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    downloadLink.click();
}

function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}

// Button callback
async function loadFileAsText() {
    files = await selectFile("text/*", true);
    let fileToLoad = files[0];

    let fileReader = new FileReader();
    fileReader.onload = function (fileLoadedEvent) {
        let myObject = JSON.parse(fileLoadedEvent.target.result);

        memo = myObject.memo;
        document.getElementById('width').value = myObject.x;
        document.getElementById('height').value = myObject.y;
        document.getElementById('cx').value = myObject.cx;
        document.getElementById('cy').value = myObject.cy;

        document.getElementById('vy').value = (typeof myObject.vy != 'undefined') ? myObject.vy : '0';
        document.getElementById('vx').value = (typeof myObject.vx != 'undefined') ? myObject.vx : '0';

        document.querySelector('.files input').value = fileToLoad.name.replace('.json', '');

        starter(false);
        showResult();
    };

    fileReader.readAsText(fileToLoad);
}

// ---- function definition ----
function selectFile(contentType, multiple) {
    return new Promise(resolve => {
        input = document.createElement('input');
        input.type = 'file';
        input.multiple = multiple;
        input.accept = contentType;

        input.onchange = _ => {
            files = Array.from(input.files);
            if (multiple)
                resolve(files);
            else
                resolve(files.first);
        };

        input.click();
    });
}
