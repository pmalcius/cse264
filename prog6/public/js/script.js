document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('wordCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    let rectangles = []; // Stores the rectangles and their properties

    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', setCanvasSize);

    // uses route made in app.js to get random word from words.txt
    async function getRandomWord() {
        const response = await fetch('/random-word');
        const data = await response.json();
        return data.word;
    }

    // Got from gpt since i couldnt find the thing teach found about this stuff.
    function getTextColorForBackground(hexColor) {
        if (hexColor.indexOf('#') === 0) {
            hexColor = hexColor.slice(1);
        }
        const r = parseInt(hexColor.substr(0, 2), 16);
        const g = parseInt(hexColor.substr(2, 2), 16);
        const b = parseInt(hexColor.substr(4, 2), 16);
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        return luminance > 128 ? 'black' : 'white'; // this is to make the text color black for lighter rect and visa versa
    }

    // draws the lauch buttonn top left
    function drawLaunchButton() {
        ctx.fillStyle = 'Blue';
        ctx.fillRect(10, 10, 100, 50);
        ctx.fillStyle = 'White';
        ctx.font = '20px Arial';
        const text = 'Launch';
        const textWidth = ctx.measureText(text).width;
        const textX = 10 + (100 - textWidth) / 2;
        const textY = 10 + (50 / 2) + 7;
        ctx.fillText(text, textX, textY);
    }

    // when this is called it adds the rectangle and uses the random word. This makes the color randomly select
    // using  Math.random and then we will call for it to get the correct color for the text in another function
    async function addRectangle() {
        const word = await getRandomWord();
        ctx.font = '20px Arial';
        const metrics = ctx.measureText(word);
        const textWidth = metrics.width;
        const padding = 20;
        const bgColor = '#' + (Math.random()*0xFFFFFF<<0).toString(16);
        const textColor = getTextColorForBackground(bgColor);

        rectangles.push({
            word,
            color: bgColor,
            textColor: textColor,
            x: Math.random() * (canvas.width - textWidth - padding),
            y: Math.random() * (canvas.height - 50),
            dx: (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random() * 3),
            dy: (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random() * 3),
            width: textWidth + padding,
            height: 50
        });
    }

    // click event listener for when clicking launch
    canvas.addEventListener('click', (event) => {
        if (event.clientX < 110 && event.clientY < 60) {
            addRectangle();
        }
    });

    // Draws the rectangle
    function drawRectangles() {
        rectangles.forEach(rect => {
            ctx.fillStyle = rect.color;
            ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
            ctx.fillStyle = rect.textColor;
            ctx.font = '20px Arial';
            const textX = rect.x + (rect.width - ctx.measureText(rect.word).width) / 2;
            const textY = rect.y + (rect.height + 14) / 2;
            ctx.fillText(rect.word, textX, textY);
        });
    }


    function updateRectangles() {
        rectangles.forEach(rect => {
            rect.x += rect.dx;
            rect.y += rect.dy;

            if (rect.x <= 0 || rect.x + rect.width >= canvas.width) {
                rect.dx *= -1;
                rect.x = Math.max(0, Math.min(canvas.width - rect.width, rect.x));
            }
            if (rect.y <= 0 || rect.y + rect.height >= canvas.height) {
                rect.dy *= -1;
                rect.y = Math.max(0, Math.min(canvas.height - rect.height, rect.y));
            }
        });
    }

    // Initiation function
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawRectangles();
        updateRectangles();
        drawLaunchButton();
        requestAnimationFrame(animate);
    }
    
    // Initiation of prog.
    animate();
});
