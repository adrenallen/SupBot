module.exports = class Question {
    constructor(standupID, guildID, question, asked){
        this.standupID = standupID;
        this.guildID = guildID;
        this.question = question;
        this.asked = asked; //has this question been asked yet to the user?
    }
};