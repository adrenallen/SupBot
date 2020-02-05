const storage = require('node-persist');
module.exports = class QuestionQueueService {
    constructor(client){
        this.storage = storage.create({dir:'.supdata/.questions'});
        this.initStorage();
        this.client = client;
    }

    async initStorage() {
        await this.storage.init();
        await this.refreshQuestions();
    }

    getQuestions(){
        return this.standups;
    }

    findDueStandups(){
        return this.standups.filter(s => moment(s.next) < moment() && !s.initialized);
    }

    async refreshQuestions(){
        this.standups = (await this.storage.getItem('questions')) || [];
    }

    async saveNewStandup(standup){
        this.refreshStandups();
        this.standups.push(standup);
        await this.storage.setItem('standups', this.standups);
    }
};