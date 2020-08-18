# create database survey character set utf8 collate utf8_general_ci;
alter database survey character set utf8mb4 collate utf8mb4_unicode_ci;

# Survey Speaker
create table if not exists survey_speaker(ID int not null auto_increment, username varchar(150) not null, email varchar(150) not null, password varchar(10) not null, unique(username), unique(email), primary key(ID));
delete from survey_speaker; 

# Survey
create table if not exists survey(ID int not null auto_increment, name varchar(150) not null, primary key(ID));
delete from survey; 

# Speaker has Surveys
create table if not exists survey_speaker_has_surveys(speakerID int not null, surveyID int not null, foreign key(speakerID) references survey(ID), foreign key(surveyID) references survey(ID), unique(speakerID, surveyID));
delete from survey_speaker_has_surveys;

# Questions and Answers
create table if not exists survey_question(ID int not null auto_increment, question varchar(255) not null, timer int not null, points int not null, primary key(ID));
delete from survey_question; 

create table if not exists survey_answer(ID int not null auto_increment, answer varchar(255) not null, is_correct bool not null default false, primary key(ID));
delete from survey_answer; 

create table if not exists survey_question_has_answers(questionID int not null, answerID int not null, foreign key(questionID) references survey_question(ID), foreign key(answerID) references survey_answer(ID), unique(questionID, answerID));
delete from survey_question_has_answers; 

create table if not exists survey_has_questions(surveyID int not null, questionID int not null, foreign key(surveyID) references survey(ID), foreign key(questionID) references survey_question(ID), unique(surveyID, questionID));
delete from survey_has_questions; 

# Sample Data
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
insert into survey_answer(ID, answer) values(7, 'Assición');
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

# Query: Questions for a Specific Survey
select * from survey_question question join survey_has_questions sq on question.ID = sq.questionID where sq.surveyID = 1;

# Query: Select Answers for a given Question within a Survey
select * from survey_answer answer join survey_question_has_answers qa on answer.ID = qa.answerID join survey_has_questions sq on sq.questionID = qa.questionID where sq.surveyID = 1 and sq.questionID = 1;

# Survey Attendees
create table if not exists survey_attendee(ID int not null auto_increment, firstName varchar(50) not null, lastName varchar(50) not null, email varchar(150) not null, unique(firstName, lastName), unique(email), primary key(ID)) default charset utf8mb4 collate utf8mb4_unicode_ci;
delete from survey_attendee;
# Adding some users for testing
insert into survey_attendee(firstName, lastName, email) values('Anão', 'Caçamba', 'anao@cacamba.com');
insert into survey_attendee(firstName, lastName, email) values('你好', '世界', 'hello@world.com');
insert into survey_attendee(firstName, lastName, email) values('John','Smith', 'john@smith.com');
insert into survey_attendee(firstName, lastName, email) values('Ada','Lovelace', 'ada@lovelace.com');
insert into survey_attendee(firstName, lastName, email) values('Steve','Jobs', 'steve@jobs.com');
insert into survey_attendee(firstName, lastName, email) values('Mark','Hamill', 'mark@hamill.com');
insert into survey_attendee(firstName, lastName, email) values('Zod','Destroyer', 'zod@destroyer.com');
insert into survey_attendee(firstName, lastName, email) values('Sandra','Bullock', 'sandra@bullock.com');
insert into survey_attendee(firstName, lastName, email) values('William','Smith', 'william@smith.com');
insert into survey_attendee(firstName, lastName, email) values('Keanu','Reeves', 'keanu@reeves.com');
insert into survey_attendee(firstName, lastName, email) values('Han','Solo', 'han@solo.com');
insert into survey_attendee(firstName, lastName, email) values('Harry','Porter', 'harry@porter.com');
insert into survey_attendee(firstName, lastName, email) values('Donald','Trump', 'donald@trump.com');
insert into survey_attendee(firstName, lastName, email) values('Serena','Williams', 'serena@williams.com');
insert into survey_attendee(firstName, lastName, email) values('Cassandra','Clark', 'cassandra@clark.com');

# Survey Attendees Answers
create table survey_attendee_answers(ID int not null auto_increment, attendeeID int not null, points int not null, foreign key(attendeeID) references survey_attendee(ID), primary key(ID));
