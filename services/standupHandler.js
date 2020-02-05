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
        await this.storage.setItem('standups', this.standups);
    }
};