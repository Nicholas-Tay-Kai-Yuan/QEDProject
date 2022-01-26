import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import { State } from "react-native-gesture-handler";
import { useLocation, useSearchParams, useNavigate } from "react-router-native";
import fraction from "../topics/fractions";
import integers from "../topics/integers";
import ordering from "../topics/ordering";
import rationalNumbers from "../topics/rational";
import roundingOff from "../topics/rounding";

export default QuizQuestion = ({
  index,
  quizData,
  questionNo,
  operator,
  setAnswers,
  answers,
}) => {
  const { state } = useLocation();
  const [ans, setAns] = useState("");
  const [ansA, setAnsA] = useState("");
  const [ansB, setAnsB] = useState("");

  return (
    <View style={styles.container}>
      {quizData ? (
        <View style={styles.question}>
          <Text style={styles.questionNo}>Q{questionNo}</Text>
        </View>
      ) : (
        <View></View>
      )}
      <View style={styles.fraction}>
        {quizData.a ? (
          <View>
            <Text style={styles.numerator}>{quizData.a}</Text>
          </View>
        ) : (
          <View></View>
        )}
        {quizData.b ? (
          <View>
            <Text style={styles.denominator}>{quizData.b}</Text>
          </View>
        ) : (
          <View></View>
        )}
      </View>

      <View style={{ alignSelf: "center" }}>
        <Text style={styles.operator}>{operator}</Text>
      </View>

      {quizData.c != undefined && quizData.d != undefined ? (
        <View style={styles.fraction}>
          {quizData.c ? (
            <View>
              <Text style={styles.numerator}>{quizData.c}</Text>
            </View>
          ) : (
            <View></View>
          )}
          {quizData.d ? (
            <View>
              <Text style={styles.denominator}>{quizData.d}</Text>
            </View>
          ) : (
            <View></View>
          )}
        </View>
      ) : (
        <View></View>
      )}

      <View style={styles.equal}>
        <Text style={styles.equalText}>=</Text>
      </View>

      <View style={styles.answers}>
        {quizData.ans ? (
          <View style={styles.ansView}>
            <TextInput
              style={styles.ans}
              onChangeText={
                (e) => {
                  setAnswers ?
                  setAnswers((prev) => {
                    let prevState = prev[index];
                    prevState = prevState
                      ? { ...prevState, ans: e }
                      : { ans: e };
                    let prevArray = prev;
                    prevArray[index] = prevState;
                    return [...prevArray];
                  })
                  : console.log();
                }}
                value={
                  answers ?
                    answers[index]
                      ? answers[index].ans
                        ? answers[index].ans
                        : ""
                      : ""
                  : ""
                }
            ></TextInput>
          </View>
        ) : (
          <View></View>
        )}
        <View style={styles.ansAB}>
          {quizData.ansA ? (
            <View style={styles.ansView}>
              <TextInput
                style={styles.ans}
                onChangeText={
                  (e) => {
                  setAnswers ?
                  setAnswers((prev) => {
                    let prevState = prev[index];
                    prevState = prevState
                      ? { ...prevState, ansA: e }
                      : { ansA: e };
                    let prevArray = prev;
                    prevArray[index] = prevState;
                    return [...prevArray];
                  })
                  : console.log();
                }}
                value={
                  answers ?
                    answers[index]
                      ? answers[index].ansA
                        ? answers[index].ansA
                        : ""
                      : ""
                  : ""
                }
              ></TextInput>
            </View>
          ) : (
            <View></View>
          )}
          {quizData.ansB ? (
            <View style={styles.ansView}>
              <TextInput
                style={styles.ans}
                onChangeText={
                  (e) => {
                    setAnswers ?
                    setAnswers((prev) => {
                        let prevState = prev[index];
                        prevState = prevState
                          ? { ...prevState, ansB: e }
                          : { ansB: e };
                        let prevArray = prev;
                        prevArray[index] = prevState;
                        return [...prevArray];
                      })
                    : console.log();
                    }}
                    value={
                      answers ?
                        answers[index]
                          ? answers[index].ansB
                            ? answers[index].ansB
                            : ""
                          : ""
                      : ""
                    }
              ></TextInput>
            </View>
          ) : (
            <View></View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: 'center',
    paddingVertical: 30,
  },
  question: {
    alignSelf: "center",
    paddingHorizontal: 50,
  },
  questionNo: {
    fontSize: 30,
  },
  numerator: {
    fontSize: 30,
    textAlign: "center",
    borderBottomColor: "#000000",
    borderBottomWidth: 2,
  },
  denominator: {
    fontSize: 30,
    textAlign: "center",
  },
  fraction: {
    flexDirection: "column",
    alignSelf: "center",
    paddingHorizontal: 50,
  },
  operator: {
    fontSize: 30,
    paddingHorizontal: 20,
  },
  equal: {
    alignSelf: "center",
    paddingHorizontal: 20,
  },
  equalText: {
    fontSize: 30,
  },
  answers: {
    flexDirection: "row",
  },
  ans: {
    width: 65,
    height: 50,
    backgroundColor: "#FFFFFF",
    fontSize: 30,
    textAlign: "center",
  },
  ansAB: {
    flexDirection: "column",
  },
  ansView: {
    paddingVertical: 10,
    padding: 10,
    alignSelf: "center",
  },
});
