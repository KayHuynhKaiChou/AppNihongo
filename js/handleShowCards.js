
import listHiragana from './hiragana.js'
import listKanji from './kanji.js'
import toeic from './toeic.js';
import toeicv1 from './toeicv1.js';
import toeicv2 from './toeicv2.js';
import toeicv3 from './toeicv3.js';
import toeicv4 from './toeicv4.js';
import toeicIIG from './toeicIIG.js';

let listTuVung = []
let typeVolcabulary = [...location.href.split('/')].pop();

switch (typeVolcabulary) {
    case 'hiragana.html':
        listTuVung = listHiragana;
        break;
    case 'kanji.html':
        listTuVung = listKanji;
        break;
    case 'toeic.html':
        listTuVung = toeic;
        break;
    case 'toeicv1.html':
        listTuVung = toeicv1;
        break;
    case 'toeicv2.html':
        listTuVung = toeicv2;
        break;
    case 'toeicv3.html':
        listTuVung = toeicv3;
        break;
    case 'toeicv4.html':
        listTuVung = toeicv4;
        break;
    case 'toeicIIG.html':
        listTuVung = toeicIIG;
        break;
    default:
        break;
}

var flashContai = document.getElementById('flashcards-container');

var listPreviousIndex = [];

var prevCardSelect = null;

flashContai.innerHTML = listTuVung.map((index) => {
    var validIndex = conductRandom();
    return `
        <div class="col-md-3 flashcard">
            <div class="front">${listTuVung[validIndex].tv}</div>
            <div class="back">${listTuVung[validIndex].mean}</div>
        </div>
    `
}).join('');

// Gán sự kiện
document.querySelectorAll('.flashcard').forEach(card => {
    card.addEventListener('click', function () {
        flipCard(card, prevCardSelect);
        prevCardSelect = card; // cập nhật sau khi lật
    });
});

function conductRandom(){
    do {
        var randomIndex = Math.floor(Math.random() * listTuVung.length);
    } while (checkRandomIndex(randomIndex));
    listPreviousIndex.push(randomIndex);
    // console.log(randomIndex)
    return randomIndex; 
}

function checkRandomIndex(randomIndex){
    if(listPreviousIndex.length==0) return false;
    return listPreviousIndex.some(pre => pre === randomIndex);
}