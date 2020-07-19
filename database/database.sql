# create database survey character set utf8 collate utf8_general_ci;
alter database survey character set utf8mb4 collate utf8mb4_unicode_ci;
drop table if exists survey_demo cascade;
create table if not exists survey_user(ID int not null auto_increment, firstName varchar(50) not null, lastName varchar(50) not null, unique(firstName, lastName), primary key(ID)) default charset utf8mb4 collate utf8mb4_unicode_ci;
delete from survey_user;
# Adding some users for testing
insert into survey_user(firstName, lastName) values('Anão', 'Caçamba');
insert into survey_user(firstName, lastName) values('你好', '世界');
insert into survey_user(firstName, lastName) values('John','Smith');
insert into survey_user(firstName, lastName) values('Ada','Lovelace');
insert into survey_user(firstName, lastName) values('Steve','Jobs');
insert into survey_user(firstName, lastName) values('Mark','Hamill');
insert into survey_user(firstName, lastName) values('Zod','Destroyer');
insert into survey_user(firstName, lastName) values('Sandra','Bullock');
insert into survey_user(firstName, lastName) values('William','Smith');
insert into survey_user(firstName, lastName) values('Keanu','Reeves');
insert into survey_user(firstName, lastName) values('Han','Solo');
insert into survey_user(firstName, lastName) values('Harry','Porter');
insert into survey_user(firstName, lastName) values('Donald','Trump');
insert into survey_user(firstName, lastName) values('Serena','Williams');
insert into survey_user(firstName, lastName) values('Cassandra','Clark');
# Survey
create table if not exists survey(ID int not null auto_increment, name varchar(150) not null, primary key(ID));
# Questions and Answers
create table if not exists survey_question(ID int not null auto_increment, question varchar(255) not null, primary key(ID));
create table if not exists survey_answer(ID int not null auto_increment, answer varchar(255) not null, is_correct bool not null default false, primary key(ID));
create table if not exists survey_question_has_answers(questionID int not null, answerID int not null, foreign key(questionID) references survey_question(ID), foreign key(answerID) references survey_answer(ID), unique(questionID, answerID));
create table if not exists survey_has_questions(surveyID int not null, questionID int not null, foreign key(surveyID) references survey(ID), foreign key(questionID) references survey_question(ID), unique(surveyID, questionID));
delete from survey_question_has_answers; 
delete from survey_has_questions;
delete from survey;
delete from survey_answer; 
delete from survey_question;
# Sample Data
insert into survey(ID, name) values(1, 'Capitals of the World');

insert into survey_question(ID, question) values(1, 'What is the capital of China ?');
insert into survey_has_questions(surveyID, questionID) values(1, 1); 
insert into survey_answer(ID, answer) values(1, 'San Diego');
insert into survey_answer(ID, answer, is_correct) values(2, 'Beijing', true);
insert into survey_answer(ID, answer) values(3, 'Shanghai');
insert into survey_answer(ID, answer) values(4, 'Berlin');
insert into survey_question_has_answers(questionID, answerID) values(1,1);
insert into survey_question_has_answers(questionID, answerID) values(1,2);
insert into survey_question_has_answers(questionID, answerID) values(1,3);
insert into survey_question_has_answers(questionID, answerID) values(1,4);

insert into survey_question(ID, question) values(2, 'What is the Capital of Bolivia ?');
insert into survey_has_questions(surveyID, questionID) values(1, 2);
insert into survey_answer(ID, answer) values(5, 'Lima');
insert into survey_answer(ID, answer, is_correct) values(6, 'La Paz', true);
insert into survey_answer(ID, answer) values(7, 'Assición');
insert into survey_answer(ID, answer) values(8, 'Guatemala');
insert into survey_question_has_answers(questionID, answerID) values(2, 5);
insert into survey_question_has_answers(questionID, answerID) values(2, 6);
insert into survey_question_has_answers(questionID, answerID) values(2, 7);
insert into survey_question_has_answers(questionID, answerID) values(2, 8);

insert into survey_question(ID, question) values(3, 'What is the Capital of Ghana ?');
insert into survey_has_questions(surveyID, questionID) values(1, 3);
insert into survey_answer(ID, answer) values(9, 'Lisbon');
insert into survey_answer(ID, answer) values(10, 'Seville');
insert into survey_answer(ID, answer, is_correct) values(11, 'Accra', true);
insert into survey_answer(ID, answer) values(12, 'Cape Town');
insert into survey_question_has_answers(questionID, answerID) values(3, 9);
insert into survey_question_has_answers(questionID, answerID) values(3, 10);
insert into survey_question_has_answers(questionID, answerID) values(3, 11);
insert into survey_question_has_answers(questionID, answerID) values(3, 12);

# Query: Questions for a Specific Survey
select * from survey_question question join survey_has_questions sq on question.ID = sq.questionID where sq.surveyID = 1;

# Query: Select Answers for a given Question within a Survey
select * from survey_answer answer join survey_question_has_answers qa on answer.ID = qa.answerID join survey_has_questions sq on sq.questionID = qa.questionID where sq.surveyID = 1 and sq.questionID = 1;
