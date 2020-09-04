# create database survey character set utf8 collate utf8_general_ci;
alter database survey character set utf8mb4 collate utf8mb4_unicode_ci;

# Survey Speaker
create table if not exists survey_speaker(ID int not null auto_increment, username varchar(150) not null, email varchar(150) not null, password varchar(10) not null, unique(username), unique(email), primary key(ID));
delete from survey_speaker; 

insert into survey_speaker(username, password, email) values('maltron', 'secret123', 'maltron@gmail.com');
insert into survey_speaker(username, password, email) values('mama', 'secret123', 'mama@gmail.com');
insert into survey_speaker(username, password, email) values('papa', 'secret123', 'papa@gmail.com');

# Survey
create table if not exists survey(ID int not null auto_increment, name varchar(150) not null, primary key(ID));
delete from survey; 

# Speaker has Surveys
create table if not exists survey_speaker_has_surveys(speakerID int not null, surveyID int not null, foreign key(speakerID) references survey(ID), foreign key(surveyID) references survey(ID), unique(speakerID, surveyID));
delete from survey_speaker_has_surveys;

# Questions and Answers
create table if not exists survey_question(ID int not null auto_increment, question varchar(255) not null, timer int not null default 0, points int not null default 0, primary key(ID));
delete from survey_question; 

create table if not exists survey_answer(ID int not null auto_increment, answer varchar(255) not null, is_correct bool not null default false, primary key(ID));
delete from survey_answer; 

# Question has Answers: 3 kinds of questions: Before: -1, During: 0, After: 1 
create table if not exists survey_question_has_answers(questionID int not null, answerID int not null, kind int not null default 0, foreign key(questionID) references survey_question(ID), foreign key(answerID) references survey_answer(ID), unique(questionID, answerID));
delete from survey_question_has_answers; 

create table if not exists survey_has_questions(surveyID int not null, questionID int not null, foreign key(surveyID) references survey(ID), foreign key(questionID) references survey_question(ID), unique(surveyID, questionID));
delete from survey_has_questions; 

# Sample Data (kind = 0, During)
insert into survey(ID, name) values(1, 'Capitals of the World');

insert into survey_question(ID, question, timer, points) values(1, 'What is the capital of China ?', 25, 50);
insert into survey_has_questions(surveyID, questionID) values(1, 1); 
insert into survey_answer(ID, answer) values(1, 'San Diego');
insert into survey_answer(ID, answer, is_correct) values(2, 'Beijing', true);
insert into survey_answer(ID, answer) values(3, 'Shanghai');
insert into survey_answer(ID, answer) values(4, 'Berlin');
insert into survey_question_has_answers(questionID, answerID) values(1,1);
insert into survey_question_has_answers(questionID, answerID) values(1,2);
insert into survey_question_has_answers(questionID, answerID) values(1,3);
insert into survey_question_has_answers(questionID, answerID) values(1,4);

insert into survey_question(ID, question, timer, points) values(2, 'What is the Capital of Bolivia ?', 25, 60);
insert into survey_has_questions(surveyID, questionID) values(1, 2);
insert into survey_answer(ID, answer) values(5, 'Lima');
insert into survey_answer(ID, answer, is_correct) values(6, 'La Paz', true);
insert into survey_answer(ID, answer) values(7, 'Asunción');
insert into survey_answer(ID, answer) values(8, 'Guatemala');
insert into survey_question_has_answers(questionID, answerID) values(2, 5);
insert into survey_question_has_answers(questionID, answerID) values(2, 6);
insert into survey_question_has_answers(questionID, answerID) values(2, 7);
insert into survey_question_has_answers(questionID, answerID) values(2, 8);

insert into survey_question(ID, question, timer, points) values(3, 'What is the Capital of Ghana ?', 25, 50);
insert into survey_has_questions(surveyID, questionID) values(1, 3);
insert into survey_answer(ID, answer) values(9, 'Lisbon');
insert into survey_answer(ID, answer) values(10, 'Seville');
insert into survey_answer(ID, answer, is_correct) values(11, 'Accra', true);
insert into survey_answer(ID, answer) values(12, 'Cape Town');
insert into survey_question_has_answers(questionID, answerID) values(3, 9);
insert into survey_question_has_answers(questionID, answerID) values(3, 10);
insert into survey_question_has_answers(questionID, answerID) values(3, 11);
insert into survey_question_has_answers(questionID, answerID) values(3, 12);

insert into survey_question(ID, question, timer, points) values(4, 'What is the Capital of South Africa ?', 25, 50);
insert into survey_has_questions(surveyID, questionID) values(1, 4);
insert into survey_answer(ID, answer) values(13, 'Tokyo');
insert into survey_answer(ID, answer) values(14, 'Marquiville');
insert into survey_answer(ID, answer, is_correct) values(15, 'Cape Town', true);
insert into survey_answer(ID, answer) values(16, 'New York');
insert into survey_question_has_answers(questionID, answerID) values(4, 13);
insert into survey_question_has_answers(questionID, answerID) values(4, 14);
insert into survey_question_has_answers(questionID, answerID) values(4, 15);
insert into survey_question_has_answers(questionID, answerID) values(4, 16);

insert into survey_question(ID, question, timer, points) values(5, 'What is the Capital of Thailand ?', 25, 50);
insert into survey_has_questions(surveyID, questionID) values(1, 5);
insert into survey_answer(ID, answer, is_correct) values(17, 'Bangkok', true);
insert into survey_answer(ID, answer) values(18, 'Manila');
insert into survey_answer(ID, answer) values(19, 'Jakarta');
insert into survey_answer(ID, answer) values(20, 'Java');
insert into survey_question_has_answers(questionID, answerID) values(5, 17);
insert into survey_question_has_answers(questionID, answerID) values(5, 18);
insert into survey_question_has_answers(questionID, answerID) values(5, 19);
insert into survey_question_has_answers(questionID, answerID) values(5, 20);

insert into survey_question(ID, question, timer, points) values(6, 'What is the Capital of Iceland ?', 25, 50);
insert into survey_has_questions(surveyID, questionID) values(1, 6);
insert into survey_answer(ID, answer) values(21, 'Copehangen');
insert into survey_answer(ID, answer) values(22, 'Berlin');
insert into survey_answer(ID, answer) values(23, 'Jakarta');
insert into survey_answer(ID, answer, is_correct) values(24, 'Reykjavik', true);
insert into survey_question_has_answers(questionID, answerID) values(6, 21);
insert into survey_question_has_answers(questionID, answerID) values(6, 22);
insert into survey_question_has_answers(questionID, answerID) values(6, 23);
insert into survey_question_has_answers(questionID, answerID) values(6, 24);

insert into survey_question(ID, question, timer, points) values(7, 'What is the Capital of Nicaragua ?', 25, 50);
insert into survey_has_questions(surveyID, questionID) values(1, 7);
insert into survey_answer(ID, answer) values(25, 'Buenos Aires');
insert into survey_answer(ID, answer) values(26, 'Miami');
insert into survey_answer(ID, answer, is_correct) values(27, 'Managua', true);
insert into survey_answer(ID, answer) values(28, 'Caracas');
insert into survey_question_has_answers(questionID, answerID) values(7, 25);
insert into survey_question_has_answers(questionID, answerID) values(7, 26);
insert into survey_question_has_answers(questionID, answerID) values(7, 27);
insert into survey_question_has_answers(questionID, answerID) values(7, 28);

# Sample Data (kind = -1, Before)
insert into survey_question(ID, question) values(8, 'What is your nationality ?');
insert into survey_has_questions(surveyID, questionID) values(1, 8);
insert into survey_answer(ID, answer) values(29, 'Brazilian');
insert into survey_answer(ID, answer) values(30, 'Russian');
insert into survey_answer(ID, answer) values(31, 'Chinese');
insert into survey_question_has_answers(questionID, answerID, kind) values(8, 29, -1);
insert into survey_question_has_answers(questionID, answerID, kind) values(8, 30, -1);
insert into survey_question_has_answers(questionID, answerID, kind) values(8, 31, -1);

insert into survey_question(ID, question) values(9, 'Are you familiar with Computers ?');
insert into survey_has_questions(surveyID, questionID) values(1, 9);
insert into survey_answer(ID, answer) values(32, 'Yes');
insert into survey_answer(ID, answer) values(33, 'No');
insert into survey_question_has_answers(questionID, answerID, kind) values(9, 32, -1);
insert into survey_question_has_answers(questionID, answerID, kind) values(9, 33, -1);

# Sample Data (kind = 1, After )
insert into survey_question(ID, question) values(10, 'Did you like it ?');
insert into survey_has_questions(surveyID, questionID) values(1, 10);
insert into survey_answer(ID, answer) values(34, 'Yes');
insert into survey_answer(ID, answer) values(35, 'No');
insert into survey_question_has_answers(questionID, answerID, kind) values(10, 34, 1);
insert into survey_question_has_answers(questionID, answerID, kind) values(10, 35, 1); 

# Query: Questions for a Specific Survey
select * from survey_question question join survey_has_questions sq on question.ID = sq.questionID where sq.surveyID = 1;

# Query: Select Answers for a given Question within a Survey
select * from survey_answer answer join survey_question_has_answers qa on answer.ID = qa.answerID join survey_has_questions sq on sq.questionID = qa.questionID where sq.surveyID = 1 and sq.questionID = 1;

# Query: Select Answers for a given Question within a Survey 
select question.ID as questionID, question.question, question.timer, question.points, answer.ID as answerID, answer.answer, answer.is_correct from survey survey join survey_has_questions sq on survey.ID = sq.surveyID join survey_question question on question.ID = sq.questionID join survey_question_has_answers qa on qa.questionID = question.ID join survey_answer answer on qa.answerID = answer.ID where survey.ID = 1 and question.ID = 1;

# Query: Select all the questions with answers for a specific Survey
select question.ID as questionID, question.question, question.timer, question.points, answer.ID as answerID, answer.answer, answer.is_correct, qa.kind from survey survey join survey_has_questions sq on survey.ID = sq.surveyID join survey_question question on question.ID = sq.questionID join survey_question_has_answers qa on qa.questionID = question.ID join survey_answer answer on qa.answerID = answer.ID where survey.ID = 1 order by qa.kind, question.ID;

# Query: Number of Questions of a given Survey
select count(question.question) as number_of_questions from survey survey join survey_has_questions sq on sq.surveyID = survey.ID join survey_question question on sq.questionID = question.ID where survey.ID = 1;

# Survey Attendees
create table if not exists survey_attendee(ID int not null auto_increment, firstName varchar(50) not null, lastName varchar(50) not null, email varchar(150) not null, points int not null default 0, surveyID int not null, unique(firstName, lastName, email, surveyID), foreign key(surveyID) references survey(ID), primary key(ID)) default charset utf8mb4 collate utf8mb4_unicode_ci;
delete from survey_attendee;

# Adding some users for testing
insert into survey_attendee(ID, firstName, lastName, email, surveyID) values(1, 'Anão', 'Caçamba', 'anao@cacamba.com', 1);
insert into survey_attendee(ID, firstName, lastName, email, surveyID) values(2, '你好', '世界', 'hello@world.com', 1);
insert into survey_attendee(ID, firstName, lastName, email, surveyID) values(3, 'John','Smith', 'john@smith.com', 1);
insert into survey_attendee(ID, firstName, lastName, email, surveyID) values(4, 'Ada','Lovelace', 'ada@lovelace.com', 1);
insert into survey_attendee(ID, firstName, lastName, email, surveyID) values(5, 'Steve','Jobs', 'steve@jobs.com', 1);
insert into survey_attendee(ID, firstName, lastName, email, surveyID) values(6, 'Mark','Hamill', 'mark@hamill.com', 1);
insert into survey_attendee(ID, firstName, lastName, email, surveyID) values(7, 'Zod','Destroyer', 'zod@destroyer.com', 1);
insert into survey_attendee(ID, firstName, lastName, email, surveyID) values(8, 'Sandra','Bullock', 'sandra@bullock.com', 1);
insert into survey_attendee(ID, firstName, lastName, email, surveyID) values(9, 'William','Smith', 'william@smith.com', 1);
insert into survey_attendee(ID, firstName, lastName, email, surveyID) values(10, 'Keanu','Reeves', 'keanu@reeves.com', 1);
insert into survey_attendee(ID, firstName, lastName, email, surveyID) values(11, 'Han','Solo', 'han@solo.com', 1);
insert into survey_attendee(ID, firstName, lastName, email, surveyID) values(12, 'Harry','Porter', 'harry@porter.com', 1);
insert into survey_attendee(ID, firstName, lastName, email, surveyID) values(13, 'Donald','Trump', 'donald@trump.com', 1);
insert into survey_attendee(ID, firstName, lastName, email, surveyID) values(14, 'Serena','Williams', 'serena@williams.com', 1);
insert into survey_attendee(ID, firstName, lastName, email, surveyID) values(15, 'Cassandra','Clark', 'cassandra@clark.com', 1);

# Survey Attendees Answers
create table if not exists survey_attendee_answers(ID int not null auto_increment, surveyID int not null, attendeeID int not null, questionID int not null, answerID int not null, foreign key(surveyID) references survey(ID), foreign key(questionID) references survey_question(ID), foreign key(attendeeID) references survey_attendee(ID), foreign key(answerID) references survey_answer(ID), unique(surveyID, attendeeID, questionID), primary key(ID));


