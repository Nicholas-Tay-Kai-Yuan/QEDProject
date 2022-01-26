import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, Image } from "react-native";
import { State } from "react-native-gesture-handler";
import { LinearGradient } from 'expo-linear-gradient';
import { useLocation, useSearchParams, useNavigate } from "react-router-native";
import { AntDesign, Entypo } from '@expo/vector-icons';
import detailedBenchmark from "../../../axios/quiz-api/detailedBenchmark";
import QuizStat from "../components/QuizStat";
import QuizQuestion from "../components/QuizQuestion";
import { FontAwesome } from "@expo/vector-icons";

export default Result = () => {
    const {state} = useLocation();
    const [chartData, setChartData] = useState([]);
    const [isChartReady, setIsChartReady] = useState(false);
    let navigate = useNavigate();

    useEffect(() => {
        console.log(state.quizResult)
        setChartData([]);
        detailedBenchmark("")
        .then((data) => {
            extractDetailedData(data);
        })
        .finally(() => {
            setIsChartReady(true);
        })
    }, [])

    function extractDetailedData(datasets) {
        let keyArray = ['total_average_score', 'average_time_taken', 'easy_average_score', 'medium_average_score', 'difficult_average_score'];
    
        for (let i = 0; i < 5; i++) {
            let data = [];
            let key = keyArray[i];
    
            ('current' in datasets) ? data.push(datasets.current[key]) : data.push(0);
            ('global' in datasets) ? data.push(datasets.global[key]) : data.push(0);
            ('recent' in datasets) ? data.push(datasets.recent[key]) : data.push(0);

            let chartArray = chartData;

            const chartConfiguration = {
                labels: ['Last Quiz', 'Global Avg', 'Recent 10 Avg'],
                datasets: [
                    {
                        data: data,
                        colors: [
                            (opacity = 1) => `#EF798A`,
                            (opacity = 1) => `#98C5FF`,
                            (opacity = 1) => `#FFCB45`,
                        ]
                    }
                ]
            }

            chartArray.push(chartConfiguration)
            setChartData(chartArray)
        }
    }

    function formatFraction(text) {
        let data = [];

        if (text.includes("/")) {
            let wholeNumber = "";
            let fraction = "";
            let d = "";
            let n = "";

            //Mixed fraction
            if (text.includes(" ")) {
                for (let i = 0; i < text.indexOf(" "); i++) {
                    wholeNumber += text[i];
                }
                for (let i = text.indexOf(" ") + 1; i < text.length; i++) {
                    fraction += text[i];
                }
                console.log("mixed fraction")
                console.log(wholeNumber + ' ' + fraction);
            }

            //proper fraction
            else {
                fraction = text;
                console.log("proper fraction")
                console.log(fraction)
            }

            for (let i = 0; i < fraction.indexOf("/"); i++) {
                n += fraction[i];
            }

            for (let i = fraction.indexOf("/") + 1; i < fraction.length; i++) {
                d += fraction[i];
            }
            
            data.push(
                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>
                    <Text style={{fontSize: 25}}>Ans: {wholeNumber != "" ? wholeNumber : ""}</Text>
                    <View style={{alignItems: 'center', marginLeft: 5}}>
                        <Text style={{fontSize: 25}}>{n}</Text>
                        <View style={{borderTopWidth: 1, borderTopColor: 'black'}}>
                            <Text style={{fontSize: 25}}>{d}</Text>
                        </View>
                    </View>
                </View>
            )    

        }

        // whole number
        else {
            data.push(<Text style={{fontSize: 25, marginLeft: 10}}>Ans: {text}</Text>)
            console.log("whole number")
            console.log(text);
        }

        return data;
    }

    return (
        <View>
            <ScrollView>
                <Image style={styles.image} source={require("../../../assets/Psleonline_logo_transparent.png")} ></Image>
                <Text style={styles.quizMessage}>{Math.round(state.quizResult[1].total) >= 90 ? "Congratulations!" : Math.round(state.quizResult[1].total) >= 60 ? "Good Work!" : "You can do better!"}</Text>
                <Text style={styles.score}>Your score is {Math.round(state.quizResult[1].total)}!</Text>
                <Text style={styles.status}>{Math.round(state.quizResult[1].total) >= 90 ? "Now try more quizzes to boost your ranking on the leaderboard!" : Math.round(state.quizResult[1].total) >= 60 ? "Review your mistakes below and try again! Aim for perfection." : "Review your mistakes below and try again."}</Text>
                <View style={styles.buttons}>
                    <TouchableOpacity style={styles.returnButton} onPress={() => navigate("/overview")}>
                        <Text style={styles.buttonText}>Return</Text>
                    </TouchableOpacity>
                    <LinearGradient
                            // start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                            colors={['#CA1D7E', '#E35157', '#F2703F']}
                            start={{x: 0, y: 1}} end={{x: 1, y: 1}}
                            style={styles.instagramButton}>
                    <TouchableOpacity>
                        <Text style={styles.buttonText}><AntDesign name="instagram" size={24} color="white" /> Share Instagram</Text>
                    </TouchableOpacity>
                    </LinearGradient>
                    <TouchableOpacity style={styles.facebookButton}>
                        <Text style={styles.buttonText}><Entypo name="facebook-with-circle" size={24} color="white" /> Share Facebook</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.progressText}>Take a look at your progress:</Text>
                <View style={styles.chartContainer}>
                    {isChartReady ? chartData.map((chartConfiguration, index) => {
                        
                        let heading = "The Percentage Scores";
                        let chartName;
                        let chartWidth = 320;
                        let element = [];

                        switch (index) {
                            case 0:
                                chartName = "Score";
                                chartWidth = 450;
                                break;
                            case 1:
                                chartName = "Time Taken";
                                chartWidth = 450;
                                break;
                            case 2:
                                chartName = "Easy Score";
                                break;
                            case 3:
                                chartName = "Medium Score";
                                break;
                            case 4:
                                chartName = "Hard Score";
                                break;
                        }

                        if (index == 2) {
                            element.push(<View style={styles.chartHeadingContainer}><Text style={styles.chartHeading}>{heading}</Text></View>)
                        }

                        element.push(<View><Text style={{ textAlign: 'center' }}>{chartName}</Text><QuizStat key={index} chartConfiguration={chartConfiguration} chartWidth={chartWidth}></QuizStat></View>)
                        
                        return element;

                    }) : <View></View>}
                </View>
                <Text style={styles.reviewText}>Review Quiz</Text>
                <View style={styles.solutionContainer}>
                    <ScrollView nestedScrollEnabled = {true}>
                        {state.questions != undefined ? state.questions.map((question, index) => (
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <QuizQuestion key={index} index={index} quizData={question} questionNo={index+1} operator={state.operator} answers={state.answers}></QuizQuestion>
                                <View style={{marginLeft: 25, flexDirection: 'row', alignItems: 'center'}}>
                                    <FontAwesome name={state.quizResult[0][index].isCorrect ? "check" : "times"} size={30} color={state.quizResult[0][index].isCorrect ? "#42FE00" : "#FF0505"} />
                                    {state.quizResult[0][index].isCorrect ? <View></View> : state.skillCode == "FRAC_SIMPLIFY" || state.skillCode == "FRAC_ADD" || state.skillCode == "FRAC_MULTIPLY" || state.skillCode == "FRAC_ADD_SUB" ? formatFraction(state.quizResult[0][index].correct_answer) : <Text style={{fontSize: 25, marginLeft: 10}}>Ans: {state.quizResult[0][index].correct_answer}</Text>}
                                </View>
                            </View>
                        )): <View></View>}
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        alignSelf: 'center',
        width: Dimensions.get('window').width * 0.45,
        resizeMode: 'contain',
        height: Dimensions.get('window').width * 0.2
    },
    quizMessage: {
        alignSelf: 'center',
        fontSize: 40,
        marginHorizontal: 30,
        fontWeight: 'bold'
    },
    score: {
        alignSelf: 'center',
        fontSize: 25,
        paddingBottom: 20,
    },
    status: {
        alignSelf: 'center',
        fontSize: 25,
        marginVertical: 15
    },
    buttons: {
        flexDirection: 'row',
        alignSelf: 'center',
    },
    returnButton: {
        backgroundColor: '#3DB3FF',
        width: Dimensions.get('window').width * 0.1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 7,
        marginHorizontal: 10
    },
    instagramButton: {
        width: Dimensions.get('window').width * 0.25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 7,
        marginHorizontal: 10
    },
    facebookButton: {
        backgroundColor: '#4267B2',
        width: Dimensions.get('window').width * 0.25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 7,
        marginHorizontal: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 20
    },
    progressText: {
        alignSelf: 'center',
        fontSize: 25,
        marginVertical: 15
    },
    chartContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingVertical: 20
    },
    chartHeadingContainer: {
        width: '100%',
        marginVertical: 50
    },
    chartHeading: {
        textAlign: 'center',
        fontSize: 25,
        fontWeight: '500'
    },
    reviewText: {
        fontSize: 25,
        marginVertical: 30,
        textAlign: 'center'
    },
    solutionContainer: {
        backgroundColor: '#F0F0F0',
        padding: 20,
        marginHorizontal: 50,
        marginBottom: 50,
        height: 400
    }
})