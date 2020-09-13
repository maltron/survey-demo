# Sample Data (kind = 0, During)
insert into survey(ID, name) values(2, 'Perguntas sobre Natesta');

insert into survey_question(ID, question, timer, points) values(11, 'Encher o saco significa:', 12, 5);
insert into survey_has_questions(surveyID, questionID) values(2, 11); 
insert into survey_answer(ID, answer) values(36, 'Estou cansada');
insert into survey_answer(ID, answer, is_correct) values(37, 'Você não faz o que eu quero, quando eu quero e como eu quero', true);
insert into survey_answer(ID, answer) values(38, 'Levar o lixo para fora');
insert into survey_answer(ID, answer) values(39, 'Beber Agua pelegrine');
insert into survey_question_has_answers(questionID, answerID) values(11,36);
insert into survey_question_has_answers(questionID, answerID) values(11,37);
insert into survey_question_has_answers(questionID, answerID) values(11,38);
insert into survey_question_has_answers(questionID, answerID) values(11,39);

insert into survey_question(ID, question, timer, points) values(12, 'A casa somente esta limpa quando', 12, 8);
insert into survey_has_questions(surveyID, questionID) values(2, 12);
insert into survey_answer(ID, answer) values(40, 'Quando a Natesta limpar', true);
insert into survey_answer(ID, answer, is_correct) values(41, 'Quanto a Nina limpar');
insert into survey_answer(ID, answer) values(42, 'Quando o Papai limpar');
insert into survey_answer(ID, answer) values(43, 'Quando alguém de fora limpar');
insert into survey_question_has_answers(questionID, answerID) values(12, 40);
insert into survey_question_has_answers(questionID, answerID) values(12, 41);
insert into survey_question_has_answers(questionID, answerID) values(12, 42);
insert into survey_question_has_answers(questionID, answerID) values(12, 43);

insert into survey_question(ID, question, timer, points) values(13, 'A temperatura esta normal, significa', 11, 10);
insert into survey_has_questions(surveyID, questionID) values(2, 13);
insert into survey_answer(ID, answer) values(44, 'A mesma temperatura do Sol');
insert into survey_answer(ID, answer) values(45, 'Esta muito calor lá fora e vamos manter as janelas fechadas');
insert into survey_answer(ID, answer, is_correct) values(46, 'Vamos usar cobertor durante o Verão', true);
insert into survey_answer(ID, answer) values(47, 'Vamos beber chá quente para nos refrescar');
insert into survey_question_has_answers(questionID, answerID) values(13, 44);
insert into survey_question_has_answers(questionID, answerID) values(13, 45);
insert into survey_question_has_answers(questionID, answerID) values(13, 46);
insert into survey_question_has_answers(questionID, answerID) values(13, 47);

insert into survey_question(ID, question, timer, points) values(14, 'Eu quero saber a sua opinião, significa', 10, 12);
insert into survey_has_questions(surveyID, questionID) values(2, 14);
insert into survey_answer(ID, answer) values(48, 'Eu NÃO quero saber da sua opinião', true);
insert into survey_answer(ID, answer) values(49, 'Eu estou cansada e vou dormir');
insert into survey_answer(ID, answer, is_correct) values(50, 'Deixa eu ver um programa russo');
insert into survey_question_has_answers(questionID, answerID) values(14, 48);
insert into survey_question_has_answers(questionID, answerID) values(14, 49);
insert into survey_question_has_answers(questionID, answerID) values(14, 50);

insert into survey_question(ID, question, timer, points) values(15, 'A janela esta fechada ?', 9, 15);
insert into survey_has_questions(surveyID, questionID) values(2, 15);
insert into survey_answer(ID, answer) values(51, 'Como assim janela aberta ?');
insert into survey_answer(ID, answer) values(52, 'Janela fechada é uma recomendação do Ministério da Saude da Russia');
insert into survey_answer(ID, answer) values(53, 'Vamos soldar a janela para nunca mais abrir');
insert into survey_answer(ID, answer, is_correct) values(54, 'Sim e vai permanecer fechada', true);
insert into survey_question_has_answers(questionID, answerID) values(15, 51);
insert into survey_question_has_answers(questionID, answerID) values(15, 52);
insert into survey_question_has_answers(questionID, answerID) values(15, 53);
insert into survey_question_has_answers(questionID, answerID) values(15, 54);

insert into survey_question(ID, question, timer, points) values(16, 'A coisa mais importante do mundo ?', 8, 18);
insert into survey_has_questions(surveyID, questionID) values(2, 16);
insert into survey_answer(ID, answer) values(55, 'Agua Pelegrine');
insert into survey_answer(ID, answer) values(56, 'Trabalho');
insert into survey_answer(ID, answer) values(57, 'Selfie, Maquiagem e Compras online na Zara', true);
insert into survey_answer(ID, answer, is_correct) values(58, 'Aparência e a Nacionalidade dos atores no filme Mulan');
insert into survey_question_has_answers(questionID, answerID) values(16, 55);
insert into survey_question_has_answers(questionID, answerID) values(16, 56);
insert into survey_question_has_answers(questionID, answerID) values(16, 57);
insert into survey_question_has_answers(questionID, answerID) values(16, 58);

insert into survey_question(ID, question, timer, points) values(17, 'O melhor lugar para viajar é', 7, 20);
insert into survey_has_questions(surveyID, questionID) values(2, 17);
insert into survey_answer(ID, answer) values(59, 'Moscou, Rússia');
insert into survey_answer(ID, answer, is_correct) values(60, 'SEMPRE o lugar que EU escolho', true);
insert into survey_answer(ID, answer) values(61, 'Guaruja, São Paulo');
insert into survey_answer(ID, answer) values(62, 'O lugar que o Papai e a Nichole querem');
insert into survey_question_has_answers(questionID, answerID) values(17, 59);
insert into survey_question_has_answers(questionID, answerID) values(17, 60);
insert into survey_question_has_answers(questionID, answerID) values(17, 61);
insert into survey_question_has_answers(questionID, answerID) values(17, 62);

insert into survey_question(ID, question, timer, points) values(21, 'Porcaria é', 7, 20);
insert into survey_has_questions(surveyID, questionID) values(2, 21);
insert into survey_answer(ID, answer) values(69, 'Qualquer coisa que não esta em Russo');
insert into survey_answer(ID, answer) values(70, 'Tudo que não é da Rússia');
insert into survey_answer(ID, answer, is_correct) values(71, 'As coisas que o Papai assiste', true);
insert into survey_answer(ID, answer) values(72, 'Comida Chinesa');
insert into survey_question_has_answers(questionID, answerID) values(21, 69);
insert into survey_question_has_answers(questionID, answerID) values(21, 70);
insert into survey_question_has_answers(questionID, answerID) values(21, 71);
insert into survey_question_has_answers(questionID, answerID) values(21, 72);

# Sample Data (kind = -1, Before)
insert into survey_question(ID, question) values(18, 'Você conhece a Natesta ?');
insert into survey_has_questions(surveyID, questionID) values(2, 18);
insert into survey_answer(ID, answer) values(63, 'Sim');
insert into survey_answer(ID, answer) values(64, 'Não');
insert into survey_question_has_answers(questionID, answerID, kind) values(18, 63, -1);
insert into survey_question_has_answers(questionID, answerID, kind) values(18, 64, -1);

insert into survey_question(ID, question) values(19, 'O seu sono é importante ?');
insert into survey_has_questions(surveyID, questionID) values(2, 19);
insert into survey_answer(ID, answer) values(65, 'Sim');
insert into survey_answer(ID, answer) values(66, 'Não');
insert into survey_question_has_answers(questionID, answerID, kind) values(19, 65, -1);
insert into survey_question_has_answers(questionID, answerID, kind) values(19, 66, -1);

# Sample Data (kind = 1, After )
insert into survey_question(ID, question) values(20, 'Você já prometeu algo ?');
insert into survey_has_questions(surveyID, questionID) values(2, 20);
insert into survey_answer(ID, answer) values(67, 'Sim, mas eu nunca levo a sério');
insert into survey_answer(ID, answer) values(68, 'Não, a minha consciência esta tranquila');
insert into survey_question_has_answers(questionID, answerID, kind) values(20, 67, 1);
insert into survey_question_has_answers(questionID, answerID, kind) values(20, 68, 1); 
