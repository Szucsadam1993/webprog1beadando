self.onmessage = function(e) {
    console.log('Worker received message:', e.data);
    const limit = e.data;
    let sum = 0;
    
    for (let i = 1; i <= limit; i++) {
        sum += i;
    }
    
    console.log('Worker sending result:', sum);
    self.postMessage(sum);
};