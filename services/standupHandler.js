const storage = require('node-persist');
const moment = require ('moment');
module.exports = class StandupHandler {
    constructor(){
        this.storage = storage.create({dir: '.supdata/.standups'});
        this.initStorage();
    }

    async initStorage() {
        await this.storage.init();
        await this.refreshStandups();
    }

    getStandups(){
        return this.standups;
    }

    findDueStandups(){
        return this.standups.filter(s => moment(s.next) < moment() && !s.initialized);
    }

    async refreshStandups(){
        this.standups = (await this.storage.getItem('standups')) || [];
    }

    async saveNewStandup(standup){
        this.refreshStandups();
        this.standups.push(standup);
        this.saveCurrentStandups();
    }

    async updateStandupByID(standup){
        var idx = this.standups.findIndex(s => s.id == standup.id);
        this.standups[idx] = standup;
        this.saveCurrentStandups();
    }

    async saveCurrentStandups(){
        await this.storage.setItem('standups', this.standups);
    }
};