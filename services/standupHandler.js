const storage = require('node-persist');
module.exports = class StandupHandler {
    constructor(){
        this.initStorage();
    }

    async initStorage() {
        await storage.init();
        await this.refreshStandups();
    }

    getStandups(){
        return this.standups;
    }

    async refreshStandups(){
        this.standups = (await storage.getItem('standups')) || [];
    }

    async saveNewStandup(standup){
        this.refreshStandups();
        this.standups.push(standup);
        await storage.setItem('standups', this.standups);
    }
};