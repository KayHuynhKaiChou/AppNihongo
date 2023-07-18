
import listHiragana from './hiragana.js'
import listKanji from './kanji.js'

var listTuVung = (location.href+'').includes('hiragana.html') ? listHiragana : listKanji

var flashContai = document.getElementById('flashcards-container');

var listPreviousIndex = [];

flashContai.innerHTML = listTuVung.map((index) => {
    var validIndex = conductRandom();
    return `
    <div class="col-md-3 flashcard" onclick="flipCard(this)">
        <div class="front">${listTuVung[validIndex].tv}</div>
        <div class="back">${listTuVung[validIndex].mean}</div>
    </div>
    `
}).join('');

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