window.onload = () => {
    const burgers = document.querySelectorAll('.navbar-burger');
    console.log(burgers)
    burgers.forEach(burger => {
        burger.addEventListener('click', () => {
            const targetId = burger.dataset.target;
            const target = document.getElementById(targetId);
            burger.classList.toggle('is-active');
            target.classList.toggle('is-active');
        });
    });
};