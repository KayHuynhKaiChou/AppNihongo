
import listHiragana from './hiragana.js'
import listKanji from './kanji.js'
import toeic from './toeic.js';

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