# create database survey character set utf8 collate utf8_general_ci;
drop table if exists survey_demo cascade;
create table if not exists survey_user(ID int not null auto_increment, firstName varchar(50) not null, lastName varchar(50) not null, unique(firstName, lastName), primary key(ID));
# Adding some users for testing
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
