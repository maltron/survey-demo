# create database survey character set utf8 collate utf8_general_ci;
create table if not exists survey_user(ID int not null auto_increment, firstName varchar(50) not null, lastName varchar(50) not null, unique(firstName, lastName), primary key(ID));
