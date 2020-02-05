module.exports = class QuestionQueue {
    constructor(memberID, guildID, questions = []){
        this.memberID = memberID;
        this.guildID = guildID;
        this.questions = questions;
    }

    //Can be one question or array of many questions
    addQuestionsToQueue(questions){
        this.questions.push(questions);
    }

    //Remove current question and get the next question
    getNextQuestion(){
        this.questions.shift();
        return this.questions[0];
    }

    //Is there a question after the current one?
    hasNextQuestion(){
        return this.questions.length > 1;
    }

    markCurrentQuestionAsked(){
        this.questions[0].asked = true;
    }
};