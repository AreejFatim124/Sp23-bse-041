const profilePicture = document.querySelector('#profile-pic');
const introduction = document.querySelector('.introduction');

profilePicture.addEventListener('mouseenter', function() {
    introduction.classList.add('fixed');
});

profilePicture.addEventListener('mouseleave', function() {
    introduction.classList.remove('fixed');
});
