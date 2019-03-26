main();

// Function to represent entry point
function main() {
    init();
    
    clearBuffer();

    drawRect();
    drawRect(50, 50, 100, 100, [1.0, 1.0, 0.0, 1.0]);
}