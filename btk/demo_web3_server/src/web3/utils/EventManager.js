var EventManager = function() {
    this.blockNum = 0;
}

EventManager.prototype.addEvent = function(event) {
    let blockNum = event.blockNumber;
    let hash = event.transactionHash;

    if (blockNum > this.blockNum) {
        this.blockNum = blockNum;
        this.events = {}
        this.events[hash] = true;
        return true;
    } else if(blockNum == this.blockNum) {
        if (this.events[hash]) {
            return false;
        } else {
            this.events[hash] = true;
            return true;
        }
    } else {
        return false
    }
}

module.exports = EventManager;