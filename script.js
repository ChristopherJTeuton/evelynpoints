document.addEventListener('DOMContentLoaded', () => {
    const totalPointsElement = document.getElementById('totalPoints');
    const todaysPointsElement = document.getElementById('todaysPoints');
    const weeklyPointsElement = document.getElementById('weeklyPoints');
    const pointHistoryButton = document.getElementById('pointHistoryButton');
    const modal = document.getElementById('pointHistoryModal');
    const closeButton = document.getElementsByClassName('close-button')[0];
    const todaysHistoryElement = document.getElementById('todaysHistory');
    const weeklyHistoryElement = document.getElementById('weeklyHistory');
    const totalHistoryElement = document.getElementById('totalHistory');
    const fireworksContainer = document.getElementById('fireworksContainer');
    const currentDateElement = document.getElementById('currentDate');
    const currentTimeElement = document.getElementById('currentTime');

    const COOKIE_NAMES = {
        TOTAL_POINTS: 'totalPoints',
        TODAYS_POINTS: 'todaysPoints',
        WEEKLY_POINTS: 'weeklyPoints',
        LAST_RESET_DAY: 'lastResetDay',
        TODAYS_HISTORY: 'todaysHistory',
        WEEKLY_HISTORY: 'weeklyHistory',
        TOTAL_HISTORY: 'totalHistory'
    };

    let totalPoints = parseInt(getCookie(COOKIE_NAMES.TOTAL_POINTS)) || 0;
    let todaysPoints = parseInt(getCookie(COOKIE_NAMES.TODAYS_POINTS)) || 0;
    let weeklyPoints = parseInt(getCookie(COOKIE_NAMES.WEEKLY_POINTS)) || 0;
    let lastResetDay = parseInt(getCookie(COOKIE_NAMES.LAST_RESET_DAY)) || new Date().getDay();
    let todaysHistory = getCookie(COOKIE_NAMES.TODAYS_HISTORY) ? getCookie(COOKIE_NAMES.TODAYS_HISTORY).split('|') : [];
    let weeklyHistory = getCookie(COOKIE_NAMES.WEEKLY_HISTORY) ? getCookie(COOKIE_NAMES.WEEKLY_HISTORY).split('|') : [];
    let totalHistory = getCookie(COOKIE_NAMES.TOTAL_HISTORY) ? getCookie(COOKIE_NAMES.TOTAL_HISTORY).split('|') : [];

    function updatePoints() {
        totalPointsElement.textContent = totalPoints;
        todaysPointsElement.textContent = todaysPoints;
        weeklyPointsElement.textContent = weeklyPoints;
    }

    function addPoint(title, emoji) {
        totalPoints++;
        todaysPoints++;
        weeklyPoints++;

        todaysHistory.unshift(`+1 ${title} ${emoji}`);
        weeklyHistory.unshift(`+1 ${title} ${emoji}`);
        totalHistory.unshift(`+1 ${title} ${emoji}`);

        setCookie(COOKIE_NAMES.TOTAL_POINTS, totalPoints, 365);
        setCookie(COOKIE_NAMES.TODAYS_POINTS, todaysPoints, 1);
        setCookie(COOKIE_NAMES.WEEKLY_POINTS, weeklyPoints, 7);
        setCookie(COOKIE_NAMES.TODAYS_HISTORY, todaysHistory.join('|'), 1);
        setCookie(COOKIE_NAMES.WEEKLY_HISTORY, weeklyHistory.join('|'), 7);
        setCookie(COOKIE_NAMES.TOTAL_HISTORY, totalHistory.join('|'), 365);

        updatePoints();
        updateHistory();
    }

    function resetPoints() {
        const currentDay = new Date().getDay();
        if (currentDay !== lastResetDay) {
            todaysPoints = 0;
            todaysHistory = [];
            setCookie(COOKIE_NAMES.TODAYS_POINTS, todaysPoints, 1);
            setCookie(COOKIE_NAMES.TODAYS_HISTORY, '', 1);

            if (currentDay === 0) { // Reset weekly points on Sunday
                weeklyPoints = 0;
                weeklyHistory = [];
                setCookie(COOKIE_NAMES.WEEKLY_POINTS, weeklyPoints, 7);
                setCookie(COOKIE_NAMES.WEEKLY_HISTORY, '', 7);
            }

            setCookie(COOKIE_NAMES.LAST_RESET_DAY, currentDay, 7);
        }

        updatePoints();
        updateHistory();
    }

    function updateHistory() {
        todaysHistoryElement.innerHTML = '';
        weeklyHistoryElement.innerHTML = '';
        totalHistoryElement.innerHTML = '';

        todaysHistory.forEach(item => {
            const div = document.createElement('div');
            div.textContent = item;
            todaysHistoryElement.appendChild(div);
        });

        weeklyHistory.forEach(item => {
            const div = document.createElement('div');
            div.textContent = item;
            weeklyHistoryElement.appendChild(div);
        });

        totalHistory.forEach(item => {
            const div = document.createElement('div');
            div.textContent = item;
            totalHistoryElement.appendChild(div);
        });
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    function showFireworks(event) {
        const fireworksImg = document.createElement('img');
        fireworksImg.src = 'fireworks.gif';
        fireworksImg.style.top = `${event.clientY}px`;
        fireworksImg.style.left = `${event.clientX}px`;
        fireworksContainer.appendChild(fireworksImg);
        fireworksContainer.style.display = 'block';

        setTimeout(() => {
            fireworksContainer.removeChild(fireworksImg);
            if (fireworksContainer.childElementCount === 0) {
                fireworksContainer.style.display = 'none';
            }
        }, 5000); // Duration of the fireworks animation
    }

    function handleButtonClick(event, title, emoji) {
        const button = event.target;
        button.classList.add('neon');
        button.style.backgroundColor = '#ffd700';

        setTimeout(() => {
            button.classList.remove('neon');
            button.style.backgroundColor = '';
        }, 1000);

        addPoint(title, emoji);
        showFireworks(event);
    }

    function updateDateTime() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDateElement.textContent = now.toLocaleDateString(undefined, options);
        currentTimeElement.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    }

    updatePoints();
    resetPoints();
    updateHistory();
    updateDateTime();
    setInterval(updateDateTime, 1000); // Update the time every second

    window.handleButtonClick = handleButtonClick;

    pointHistoryButton.onclick = function() {
        modal.style.display = "block";
    }

    closeButton.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Morphing Text Effect
    const elts = {
        text1: document.getElementById("text1"),
        text2: document.getElementById("text2")
    };

    const texts = [
        "Evelyn\'s",
        "Home",
        "Points"
    ];

    const morphTime = 1;
    const cooldownTime = 0.25;

    let textIndex = texts.length - 1;
    let time = new Date();
    let morph = 0;
    let cooldown = cooldownTime;

    elts.text1.textContent = texts[textIndex % texts.length];
    elts.text2.textContent = texts[(textIndex + 1) % texts.length];

    function doMorph() {
        morph -= cooldown;
        cooldown = 0;

        let fraction = morph / morphTime;

        if (fraction > 1) {
            cooldown = cooldownTime;
            fraction = 1;
        }

        setMorph(fraction);
    }

    function setMorph(fraction) {
        elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

        fraction = 1 - fraction;
        elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

        elts.text1.textContent = texts[textIndex % texts.length];
        elts.text2.textContent = texts[(textIndex + 1) % texts.length];
    }

    function doCooldown() {
        morph = 0;

        elts.text2.style.filter = "";
        elts.text2.style.opacity = "100%";

        elts.text1.style.filter = "";
        elts.text1.style.opacity = "0%";
    }

    function animate() {
        requestAnimationFrame(animate);

        let newTime = new Date();
        let shouldIncrementIndex = cooldown > 0;
        let dt = (newTime - time) / 1000;
        time = newTime;

        cooldown -= dt;

        if (cooldown <= 0) {
            if (shouldIncrementIndex) {
                textIndex++;
            }

            doMorph();
        } else {
            doCooldown();
        }
    }

    animate();
});