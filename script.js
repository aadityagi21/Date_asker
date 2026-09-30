// --- SCREEN TRANSITION LOGIC ---
// A helper function to hide one screen and show another
function switchScreen(currentScreenId, nextScreenId) {
    document.getElementById(currentScreenId).classList.remove('active-screen');
    document.getElementById(nextScreenId).classList.add('active-screen');
}

// Button clicks to move forward
document.getElementById('yesBtn').addEventListener('click', function() {
    switchScreen('screen1', 'screen2');
});

document.getElementById('nextBtn').addEventListener('click', function() {
    switchScreen('screen2', 'screen3');
});

// --- THE RUNAWAY 'NO' BUTTON ---
const noBtn = document.getElementById('noBtn');

// This function calculates random X and Y coordinates within the window
function dodgeMouse() {
    // Get the window boundaries
    const maxWidth = window.innerWidth - noBtn.offsetWidth;
    const maxHeight = window.innerHeight - noBtn.offsetHeight;

    // Generate random positions (keeping it slightly away from edges)
    const randomX = Math.floor(Math.random() * maxWidth);
    const randomY = Math.floor(Math.random() * maxHeight);

    // Make the button absolute so it can float anywhere
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
}

// Trigger the dodge when the mouse hovers over it (for laptops)
noBtn.addEventListener('mouseover', dodgeMouse);
// Trigger the dodge when she tries to tap it (for phones)
noBtn.addEventListener('touchstart', function(e) {
    e.preventDefault(); // Prevents actual click on mobile before moving
    dodgeMouse();
});

// --- FORMSPREE BACKGROUND SUBMISSION ---
const form = document.getElementById('dateForm');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener("submit", async function(event) {
    event.preventDefault(); // Stops the page reload

    // Check if she picked a date and time
    if (!document.getElementById('selectedDate').value || !document.getElementById('selectedTime').value) {
        alert("Please pick a date and time first! 🥺");
        return; // Stops the form from sending
    }
    
    // Change button text so she knows it's working
    submitBtn.innerText = "Sending... ✨";
    
    const data = new FormData(event.target);
    
    try {
        const response = await fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Success! Move to the final cute screen
            switchScreen('screen3', 'screen4');
        } else {
            alert("Oops! Something went wrong. Try again.");
            submitBtn.innerText = "Accept Date! ✨";
        }
    } catch (error) {
        alert("Network error. Please check your internet.");
        submitBtn.innerText = "Accept Date! ✨";
    }
});

// --- CHIP SELECTION LOGIC ---
function setupChips(chipClass, hiddenInputId) {
    const chips = document.querySelectorAll(chipClass);
    const hiddenInput = document.getElementById(hiddenInputId);

    chips.forEach(chip => {
        chip.addEventListener('click', function() {
            // Remove the 'active' glow from all other chips in this group
            chips.forEach(c => c.classList.remove('active'));
            
            // Add the 'active' glow to the clicked chip
            this.classList.add('active');
            
            // Save the value into the hidden input so Formspree can send it
            hiddenInput.value = this.getAttribute('data-value');
        });
    });
}

// Activate the logic for both date and time chips
setupChips('.date-chip', 'selectedDate');
setupChips('.time-chip', 'selectedTime');

// Button clicks to move forward
document.getElementById('yesBtn').addEventListener('click', function() {
    switchScreen('screen1', 'screen2');
    
    // Play the background music the moment she says yes!
    const music = document.getElementById('bgMusic');
    music.play().catch(error => console.log("Browser blocked audio, but the site still works!", error));

    triggerHeartExplosion();

    startTypewriter(customMessage, typeContainer, function() {
        // This inside code only runs AFTER the typing is 100% finished
        nextButton.style.display = 'block';
    });
});


// --- FALLING HEARTS LOGIC ---
function createHeart() {
    const heartContainer = document.getElementById('heartContainer');
    const heart = document.createElement('div');
    heart.classList.add('falling-heart');

    // Randomize the emoji
    const emojis = ['❤️', '💖', '💘', '✨'];
    heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];

    // Randomize starting position (left to right) and falling speed
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 2 + 2 + 's'; // Falls randomly between 2 and 4 seconds

    heartContainer.appendChild(heart);

    // Delete the heart from the code after it falls so the site doesn't lag
    setTimeout(() => {
        heart.remove();
    }, 4000);
}

function triggerHeartExplosion() {
    // Generates 40 hearts instantly with a slight random delay for a realistic burst
    for (let i = 0; i < 40; i++) {
        setTimeout(createHeart, Math.random() * 500); 
    }
}

// --- TYPEWRITER EFFECT LOGIC ---
const typeContainer = document.getElementById('typewriterText');
const nextButton = document.getElementById('nextBtn');

// Write your custom message here! Use \n if you want to drop to a new line.
const customMessage = "YAYYY! \nI knew you'd say yes...\nand Ye sachme kaffi achhi btt hai ❤️";

function startTypewriter(text, element, callback) {
    element.innerHTML = ''; // Clear out any old text
    element.classList.add('typing-cursor'); // Show the blinking cursor
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            // Handle line breaks (\n)
            if (text.charAt(i) === '\n') {
                element.innerHTML += '<br>';
            } else {
                element.innerHTML += text.charAt(i);
            }
            i++;

            // Human typing speed: Randomize between 50ms and 150ms per letter
            let typingSpeed = Math.floor(Math.random() * 100) + 50;

            // The "Thinking" Pause: If the character is a period, comma, or exclamation, pause longer!
            const lastChar = text.charAt(i - 1);
            if (['.', ',', '!', '?'].includes(lastChar)) {
                typingSpeed += 800; // Adds almost a 1-second pause
            }

            setTimeout(typeWriter, typingSpeed);
        } else {
            // Typing is finished!
            element.classList.remove('typing-cursor'); // Remove the blinking cursor
            if (callback) callback(); // Run the callback (which shows the button)
        }
    }

    // Start typing
    setTimeout(typeWriter, 500); // Wait half a second before starting so it feels natural
}