function flipCard(card) {
    var front = card.querySelector('.front');
    var back = card.querySelector('.back');

    if (front.style.display === 'none') {
        front.style.display = 'block';
        back.style.display = 'none';
    } else {
        front.style.display = 'none';
        back.style.display = 'block';
    }
}