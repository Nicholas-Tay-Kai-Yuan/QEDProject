import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, Image } from "react-native";
import { useLocation, useSearchParams, useNavigate } from "react-router-native";
import { AntDesign } from '@expo/vector-icons';
import QuizQuestion from "../components/QuizQuestion";
import QuizButton from "../components/QuizButton";
import fraction from "../topics/fractions";
import integers from "../topics/integers";
import ordering from "../topics/ordering";
import rationalNumbers from "../topics/rational";
import roundingOff from "../topics/rounding";
import Modal from "react-native-modal";
import { FontAwesome } from '@expo/vector-icons'

export default DoQuiz= () => {
    const navigate = useNavigate();
    const {state} = useLocation();
    const [questionsData, setQuestionsData] = useState();
    const [answers, setAnswers] = useState(new Array(state.quizData.num_of_qn));
    const [operator, setOperator] = useState(" ");
    const defaultTime = {
        minutes: state.duration,
        seconds: '00'
    }
    const [remainingTime, setRemainingTime] = useState(defaultTime);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const funcs = {
        'Fractions': fraction,
        'Rounding Off': roundingOff,
        'Integers': integers,
        // 'Algebra': algebra,
        'Ordering Numbers': ordering,
        'Rational Numbers': rationalNumbers
    };

    useEffect(() => {   
        // console.log(state.quizData)
        // const funcs = {
        //     'Fractions': fraction,
        //     'Rounding Off': roundingOff,
        //     'Integers': integers,
        //     // 'Algebra': algebra,
        //     'Ordering Numbers': ordering,
        //     'Rational Numbers': rationalNumbers
        // };
    
        if (state.quizData.skill_code != 'FRAC_SIMPLIFY') {
            setOperator((state.quizData.skill_code == 'FRAC_ADD') ? " + " : " x ");
            console.log("operator: " + operator)
        }
        
        let dataArray = funcs[state.quizData.topic_name].generateQuestion(state.quizData);
        setQuestionsData(dataArray);
    }, [state.quizData]);

    function calculateScore() {
        let result = funcs[state.quizData.topic_name].markQuiz(state.quizData, questionsData, answers);
        // let result = funcs[state.quizData.topic_name].markQuiz(state.quizData, questionsData, questionsData);
        navigate("/Result", {state: {quizResult: result, questions: questionsData, operator: operator, answers: answers, skillCode: state.quizData.skill_code}});
        // navigate("/Result", {state: {quizResult: result, questions: questionsData, operator: operator, answers: questionsData, skillCode: state.quizData.skill_code}});
    }

    function validateFields() {
        console.log(answers)

        let validateSuccess = true;

        for (let i = 0; i < answers.length; i++) {
            if (answers[i] == undefined) {
                validateSuccess = false;
                break;
            }
            else if (answers[i].ans == "" || answers[i].ansA == "" || answers[i].ansB == "") {
                validateSuccess = false;
                break;
            }
        }


        if (validateSuccess) {
            calculateScore();
        }
        else {
            setIsModalVisible(true);
        }
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.container}>
                    <Image style={styles.image} source={require("../../../assets/Psleonline_logo_transparent.png")} ></Image>
                    <Text style={styles.levelText}>{state.display}</Text>
                    <Text style={styles.skillName}>{state.skillName}</Text>
                    <View style={styles.progressBar}>
                        <Text><AntDesign name="clockcircle" size={24} color="black" /> Progress Bar</Text> 
                    </View>
                    <Text style={styles.duration}>Remaining Time: {state.duration}:00</Text>
                    <View style={styles.questions}>
                        <ScrollView nestedScrollEnabled = {true}>
                            {questionsData != undefined ? questionsData.map((question, index) => (
                                <QuizQuestion key={index} index={index} quizData={question} questionNo={index+1} operator={operator} answers={answers} setAnswers={setAnswers}></QuizQuestion>
                            )): <View></View>}
                        </ScrollView>
                    </View>
                    <View style={styles.buttons}>
                        <View style={styles.quizButton}><QuizButton color="#AAAAAA" onClick={()=>{
                            navigate("/Overview");
                        }}>Cancel</QuizButton></View>     
                        <View style={styles.quizButton}><QuizButton answer={answers} color="#F7C102" onClick={() =>{
                            validateFields();
                            // calculateScore();
                        }} >Submit</QuizButton></View>
                    </View>                       
                </View>
            </ScrollView>
            <Modal isVisible={isModalVisible}>
                <View style={styles.modalContainer}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <FontAwesome name="exclamation-triangle" size={25} color="red" />
                        <Text style={{fontSize: 25, marginLeft: 10}}>Alert!</Text>
                    </View>
                    <Text style={{fontSize: 20, marginVertical: 10}}>Complete the quiz!</Text>
                    <TouchableOpacity style={styles.modalBtn} onPress={() => setIsModalVisible(false)}>
                        <Text style={{fontWeight: 'bold', fontSize: 20}}>OK</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        height: 950
    },  
    image: {
        alignSelf: 'center',
        width: Dimensions.get('window').width * 0.45,
        resizeMode: 'contain',
        height: Dimensions.get('window').width * 0.2
    },
    levelText: {
        fontSize: 30,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    skillName: {
        fontSize: 40,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    progressBar: {
        flexDirection: 'row',
        alignSelf: 'center'
    },
    duration: {
        fontSize: 20,
        alignSelf: 'center'
    },
    questions: {
        backgroundColor: '#F0F0F0',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 10
        },
        elevation: 10,
        shadowRadius: 100,
        shadowOpacity: 1,
        marginHorizontal: 75,
        marginVertical: 30,
        height: 400,
        justifyContent: 'space-between',
        flexDirection: 'column'
    },
    buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center'
    },
    quizButton: {
        paddingHorizontal: 10
    },
    modalContainer: {
        display: 'flex',
        backgroundColor: "white",
        width: '50%',
        alignSelf: 'center',
        borderRadius: 5,
        padding: 30,
    },
    modalBtn: {
        alignSelf: 'flex-end',
        backgroundColor: '#f1f4f4',
        paddingVertical: 10,
        paddingHorizontal: 15
    }
});