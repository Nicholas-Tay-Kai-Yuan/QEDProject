let questionArray = [];
function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generated decimal between min, max and precision (both included)
function generateRandomDecimal(min, max, precision) {
    var value = Math.random() * (max - min + 1) + min;

    return value.toFixed(precision);
}

function generateRandomString(array) {
    var value = array[generateRandomNumber(0, array.length - 1)];

    return value;
}

export default rationalNumbers = {

    generateQuestion: (quizData) => {
        const numOfQ = quizData.num_of_qn;
        const percentDifficulty = quizData.percent_difficulty.split("-");
        const numOfEasy = numOfQ * (percentDifficulty[0] / 100);
        const numOfMedium = numOfQ * (percentDifficulty[1] / 100);        

        //For now, medium and difficult is both counted as medium
        for (let i = 0; i < numOfQ; i++) {

            let key = "medium_values";
            let question = "";
            let array = [];
            let wholeNumber;
            let squareroot;
            let cuberoot;
            let numerator;
            let denominator;
            let questionDisplayArray = [];
            let questionValueArray = []
            let answerDisplayArray = [];
            let answerValueArray = [];
            let finalQuestionArray = [];
            let finalAnswerArray = [];
            let fullQuestionArray = [];

            if (i <  numOfEasy) {
                key = "easy_values";
            }
            
            if (key == "easy_values") {
                wholeNumber = generateRandomNumber(-9, 9);
                squareroot = generateRandomNumber(1, 9);
                cuberoot = generateRandomNumber(1, 30);
                numerator = generateRandomNumber(1, 9);
                denominator = generateRandomNumber(2, 9);
            }
            else {
                wholeNumber = generateRandomNumber(-9, 9);
                squareroot = generateRandomNumber(1, 20);
                cuberoot = generateRandomNumber(1, 30);

                do {
                    numerator = generateRandomNumber(-9, 9);
                } while (numerator == 0)

                denominator = generateRandomNumber(2, 9);
            }

            questionDisplayArray = ["??", wholeNumber, `&radic;<span style="text-decoration: overline">${squareroot}</span>`, `&#8731;<span style="text-decoration: overline">${cuberoot}</span>`, `<sup>${numerator}</sup>&frasl;<sub>${denominator}</sub>` ]
            
            questionValueArray = [Math.PI, wholeNumber, Math.sqrt(squareroot), Math.cbrt(cuberoot), numerator/denominator];

            var removedOption = generateRandomNumber(0, questionDisplayArray.length - 1);

            questionDisplayArray.splice(removedOption, 1);

            questionValueArray.splice(removedOption, 1);
            for (var l = 0; l < questionDisplayArray.length; l++) {
                if (key == "easy_values") {
                    question = "Which of the following are integers?<br/>{" + questionDisplayArray + "}";
                }
                else {
                    question = "Which of the following are rational numbers?<br/>{" + questionDisplayArray + "}";
                }
                fullQuestionArray.push(question);
            }


            // Generate answers
            for (var x = 0; x < questionValueArray.length; x++) {
                if (key == "easy_values") {
                    if (questionValueArray[x] % 1 == 0) {
                        answerValueArray.push(questionValueArray[x]);
                        answerDisplayArray.push(questionDisplayArray[x]);
                    }
                }
                else {
                    var optionAsStr = questionValueArray[x].toString();
                    if (optionAsStr.includes(".")) {
                        if (optionAsStr.split(".")[1].length >= 10) {

                        }
                        else {
                            answerValueArray.push(questionValueArray[x]);
                            answerDisplayArray.push(questionDisplayArray[x]);                        
                        }
                    }
                    else {
                        answerValueArray.push(questionValueArray[x]);
                        answerDisplayArray.push(questionDisplayArray[x]);
                    }
                }
            }

            finalQuestionArray.push(question);
            finalQuestionArray.push(questionDisplayArray);
            finalQuestionArray.push(questionValueArray);
            finalAnswerArray.push(answerDisplayArray);
            finalAnswerArray.push(answerValueArray);

            array.push(finalQuestionArray);
            array.push(finalAnswerArray);

            questionArray.push(array);

        }
    },

    arrangeQuestion: () => {
        let content = `<div class="col-12 scrollbar border rounded" id="scrollQuestions" style="border-radius: 7px;">`;
        let form = ``
        for (let i = 0; i < questionArray.length; i++) {
    
            form = `<div class="form-check-inline">
                        <input class="form-check-input" type="checkbox" id="0">
                        <label class="form-check-label" for="option1">
                            ${questionArray[i][0][1][0]}
                        </label>
                    </div>
                    <div class="form-check-inline">
                        <input class="form-check-input" type="checkbox" id="1">
                        <label class="form-check-label" for="option2">
                            ${questionArray[i][0][1][1]}
                        </label>
                    </div>
                    <div class="form-check-inline">
                        <input class="form-check-input" type="checkbox" id="2">
                        <label class="form-check-label" for="option3">
                            ${questionArray[i][0][1][2]}
                        </label>
                    </div>
                    <div class="form-check-inline">
                        <input class="form-check-input" type="checkbox" id="3">
                        <label class="form-check-label" for="option4">
                            ${questionArray[i][0][1][3]}
                        </label>
                    </div>
                    <div class="form-check-inline">
                        <input class="form-check-input" type="checkbox" id="4">
                        <label class="form-check-label" for="option5">
                            None
                        </label>
                    </div>`;
            
            content += `<div class="row col-9 justify-content-center align-items-center text-center m-auto mb-5 question">
                            <div class="col rationalQ${i + 1}">
                                <div class="row justify-content-center align-items-center">
                                    <div class="small col-md-8 mt-3">
                                        Q${i + 1}. ${questionArray[i][0][0]}
                                    </div>
                                </div>
                                <div class="row justify-content-center align-items-center">
                                    <div class="small col-md-8 mt-3">
                                        ${form}
                                    </div>
                                </div>
                            </div>
                            <div class='col-md-2 reviewClass'><span id='review${i}'></span></div>
                        </div>`;

        }

        content += `</div>`;
        return content;
    },

    markQuiz: () => {
        let score
        let easy = 0;
        let medium = 0;
        let difficult = 0;
        let questions = [];

        const numOfQ = quizData.num_of_qn, 
        percentDifficulty = quizData.percent_difficulty.split("-");
        const numOfEasy = numOfQ * (percentDifficulty[0] / 100);
        const numOfMedium = numOfQ * (percentDifficulty[1] / 100);
        const numOfDifficult = numOfQ * (percentDifficulty[2] / 100);

        for (let i = 0; i < numOfQ; i++) {
            let review = '<i class="fas fa-check" style="color: #42FE00"></i>';
            let difficulty = 'medium';
            let isCorrect = false;
            let inputArray = [];
            
            for (var x = 0; x < 4; x++) {
                input = $(`.rationalQ${i+1}`).children().eq(1)[0].children[0].children[x].children[0].checked;
                if (input == true) {
                    var input = $(`.rationalQ${i+1}`).children().eq(1)[0].children[0].children[x].children[1].innerHTML;
                    input = (input.replaceAll("\n", "")).trim();

                    //squareroot
                    if (input[0] == "???") {
                        input = input.replaceAll("???", "&radic;")
                    }
                    //cuberoot
                    else if (input[0] == "???") {
                        input = input.replaceAll("???", "&#8731;")
                    }
                    //fraction
                    else if (input[0] == "<") {
                        input = input.replaceAll(">???<", ">&frasl;<")
                    }
                    // //whole number
                    // else if (input.length == 1 || input.length == 2) {
                    //     input = w
                    // }
                    inputArray.push(input);
                }
            }
                        
            $(".reviewClass").css("display", "block");

            if (questionArray[i][1][0].length == inputArray.length) {
                for (var l = 0; l < questionArray[i][1][0].length; l++) {
                    if (questionArray[i][1][0][l] == inputArray[l]) {
                        //Mark as correct when all checkboxes are correct
                        if (l+1 == questionArray[i][1][0].length) {
                            if (i < numOfEasy) {
                                difficulty = 'easy';
                                easy++;
                            }
                            else {
                                medium++;
                            }
                            isCorrect = true;
                        }
                        
                    }
                    else {
                        isCorrect = false;
                        break;
                    }
                }
            }
            else {

            }

            var correctAnswer;
            
            if (questionArray[i][1][0].length == 0) {
                correctAnswer = "None";
            }
            else {
                correctAnswer = questionArray[i][1][0];
            }

            if (!isCorrect) {
                review = '<i class="fas fa-times" style="color: #FF0505"></i>  Ans: ';
                review += correctAnswer;
            }
          
            document.getElementById(`review${i}`).innerHTML = review;        

            questions.push({
                "skill_id": quizData.skillId,
                "question_number": i + 1,
                "question": questionArray[i][0][0].toString(),
                "answer": inputArray.toString(),
                "correct_answer": correctAnswer.toString(),
                "isCorrect": isCorrect,
                "difficulty": difficulty
            });
        }

        score = {
            "easy": (easy / numOfEasy) * 100,
            "medium": (medium / numOfMedium) * 100,
            "difficult": (difficult / numOfDifficult) * 100,
        }

        score["total"] = ((score.easy / 100) * numOfEasy + (score.medium / 100) * numOfMedium + (score.difficult / 100) * numOfDifficult) / numOfQ * 100;

        let points = easy * 5 + medium * 10 + difficult * 15;

        return [questions, score, points];
    }
}