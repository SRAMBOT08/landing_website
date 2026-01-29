// Program unlock logic: Only unlock next program after previous is completed
// This is a simple demo. Replace the completion logic with your real logic as needed.

document.addEventListener('DOMContentLoaded', function() {
    // Simulate completion state (replace with real logic, e.g., from backend or localStorage)
    let agenticComplete = false;
    let genaiComplete = false;

    // Unlock buttons (for demo)
    const unlockAgenticBtn = document.createElement('button');
    unlockAgenticBtn.textContent = 'Mark Agentic AI Pioneer Complete';
    unlockAgenticBtn.style = 'margin: 10px; padding: 8px 16px; background: #ffcc00; border: none; border-radius: 8px; font-weight: 700;';
    document.querySelector('#program-agentic .service-text').appendChild(unlockAgenticBtn);

    const unlockGenaiBtn = document.createElement('button');
    unlockGenaiBtn.textContent = 'Mark GenAI Pinnacle Plus Complete';
    unlockGenaiBtn.style = 'margin: 10px; padding: 8px 16px; background: #ffcc00; border: none; border-radius: 8px; font-weight: 700;';
    document.querySelector('#program-genai .service-text').appendChild(unlockGenaiBtn);
    unlockGenaiBtn.disabled = true;

    // Unlock GenAI when Agentic is complete
    unlockAgenticBtn.addEventListener('click', function() {
        agenticComplete = true;
        document.getElementById('program-genai').classList.remove('program-locked');
        document.getElementById('program-genai').classList.add('program-unlocked');
        unlockAgenticBtn.disabled = true;
        unlockGenaiBtn.disabled = false;
    });

    // Unlock Blackbelt when GenAI is complete
    unlockGenaiBtn.addEventListener('click', function() {
        genaiComplete = true;
        document.getElementById('program-blackbelt').classList.remove('program-locked');
        document.getElementById('program-blackbelt').classList.add('program-unlocked');
        unlockGenaiBtn.disabled = true;
    });

    // By default, only Agentic is unlocked
    document.getElementById('program-agentic').classList.add('program-unlocked');
    document.getElementById('program-genai').classList.remove('program-unlocked');
    document.getElementById('program-blackbelt').classList.remove('program-unlocked');
});
