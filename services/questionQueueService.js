const storage = require('node-persist');
const QuestionQueue = require('../objects/questionQueue');
module.exports = class QuestionQueueService {
    constructor(client){
        this.storage = storage.create({dir:'.supdata/.questions'});
        this.initStorage();
        this.client = client;
    }

    async initStorage() {
        await this.storage.init();
        await this.refreshQuestionQueues();
    }

    askPendingQuestions(){
        if (this.questionQueues.length < 1) return;

        this.questionQueues.forEach((questionQueue, memberID) => {
            var question = questionQueue.getPendingQuestion();
            if(question != null){
                this.client
                    .guilds.get(question.guildID)
                    .members.get(questionQueue.memberID)
                    .createDM().then((dm) => {
                        dm.send(question.question);
                        questionQueue.markCurrentQuestionAsked();
                    });
            }
        });
        this.saveCurrentQuestionQueues();
    }

    getQuestionQueues(){
        return this.questionQueues;
    }

    getQueueIndexForMember(memberID) {
        return this.questionQueues.findIndex(q => q.memberID == memberID);
    }

    async refreshQuestionQueues(){
        this.questionQueues = (await this.storage.getItem('questionQueues')) || [];
        
        //We save the data as an object, need to actually make it the queue class again
        if(this.questionQueues.length > 0){
            this.questionQueues = this.questionQueues.map((qData) => new QuestionQueue(qData.memberID, qData.questions));
        }
    }

    async addNewQuestionToQueue(memberID, guildID, question){
        var qIdx = this.getQueueIndexForMember(memberID);
        if(qIdx < 0){
            qIdx = this.questionQueues.push(new QuestionQueue(memberID)) - 1;
        }
        this.questionQueues[qIdx].addQuestionsToQueue(question);
        this.saveCurrentQuestionQueues();
    }

    async saveCurrentQuestionQueues(){
        await this.storage.setItem('questionQueues', this.questionQueues);
    }
};