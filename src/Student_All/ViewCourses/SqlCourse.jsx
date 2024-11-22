import React, { useState, useRef } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Typography, Box, Grid, Button, Dialog, DialogActions, DialogContent, DialogTitle , Checkbox ,FormControlLabel } from '@mui/material';
import ReactLecture1 from "../Lectures/React-L-1.mp4";
import ReactLecture2 from "../Lectures/React-L-2.mp4";
import StudentLayout from '../LAYOUT/StudentLayout';

function SqlCourse() {
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [videoTime, setVideoTime] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const videoRef = useRef(null);

  // const Quizzzz = [
  //   {
  //     question: "1",
  //     questionTitle: "What is question 1 ?",
  //     option1: "A",
  //     option2: "B",
  //     option3: "C",
  //     option4: "D",
  //     answer: "A"
  //   },
  //   {
  //     question: "2",
  //     questionTitle: "What is question 2 ?",
  //     option1: "A",
  //     option2: "B",
  //     option3: "C",
  //     option4: "D",
  //     answer: "B"
  //   }
  // ];

  const [answers, setAnswers] = useState({
    question1: null,
    question2: null,
    question3: null,
  });
  
  const [resultMessage, setResultMessage] = useState('');
  const [openQuiz,setOpenQuiz] = useState(false)

  // Define questions and options
  const questions = [
    {
      id: 1,
      question: 'What is the capital of France?',
      options: ['Paris', 'London', 'Rome', 'Berlin'],
      correctAnswer: 'Paris',
    },
    {
      id: 2,
      question: 'Which is the largest planet in our solar system?',
      options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 'Jupiter',
    },
    {
      id: 3,
      question: 'What is the square root of 16?',
      options: ['2', '3', '4', '5'],
      correctAnswer: '4',
    },
  ];

  // Handle checkbox selection
  const handleCheckboxChange = (event, questionId) => {
    setAnswers({
      ...answers,
      [questionId]: event.target.checked ? event.target.value : null,
    });
  };

  // Submit the quiz
  const handleSubmit = () => {
    let correctCount = 0;

    questions.forEach((question) => {
      if (answers[`question${question.id}`] === question.correctAnswer) {
        correctCount++;
      }
    });

    setResultMessage(`${correctCount}`);
    setTimeout(() => (
      setOpenQuiz(false)
    ),2000)
  };

  const questionsLecture1 = [
    { id: 1, time: 25, question: "What is 2 + 2?", correctAnswer: 'A', options: ['A. 4', 'B. 5', 'C. 3', 'D. 6'] },
    { id: 2, time: 45, question: "What is 3 + 5?", correctAnswer: 'B', options: ['A. 9', 'B. 8', 'C. 7', 'D. 6'] },
    { id: 3, time: 80, question: "What is 7 + 3?", correctAnswer: 'C', options: ['A. 10', 'B. 12', 'C. 10', 'D. 9'] },
    { id: 4, time: 125, question: "What is 5 + 5?", correctAnswer: 'A', options: ['A. 10', 'B. 11', 'C. 12', 'D. 13'] }
  ];

  const questionsLecture2 = [
    { id: 1, time: 25, question: "What is 5 + 43?", correctAnswer: 'A', options: ['A. 48', 'B. 50', 'C. 49', 'D. 52'] },
    { id: 2, time: 45, question: "What is 23 + 77?", correctAnswer: 'B', options: ['A. 100', 'B. 100', 'C. 110', 'D. 120'] },
    { id: 3, time: 80, question: "What is 10 + 10?", correctAnswer: 'C', options: ['A. 5', 'B. 12', 'C. 20', 'D. 25'] },
    { id: 4, time: 125, question: "What is 10 + 5?", correctAnswer: 'A', options: ['A. 15', 'B. 10', 'C. 20', 'D. 17'] }
  ];

  const handleLectureChange = (event) => {
    setSelectedLecture(Number(event.target.value));
    setUserAnswer(null);
    setIsCorrectAnswer(null);
    setVideoTime(0);
    setOpenDialog(false);
    setCurrentQuestionIndex(0);
    setMessage("");
  };

  const getQuestions = () => {
    if (selectedLecture === 1) {
      return questionsLecture1;
    } else if (selectedLecture === 2) {
      return questionsLecture2;
    }
    return [];
  };

  const handleVideoTimeUpdate = () => {
    const currentTime = videoRef.current.currentTime;
    setVideoTime(currentTime);

    const questions = getQuestions();
    const nextQuestion = questions.find(q => q.time <= currentTime && q.time > videoTime && q.id === currentQuestionIndex + 1);

    if (nextQuestion && !isPaused) {
      setOpenDialog(true);
      videoRef.current.pause();
      setIsPaused(true);
    }
  };

  const handleAnswer = (answer) => {
    const questions = getQuestions();
    const currentQuestion = questions[currentQuestionIndex];
    setUserAnswer(answer);

    if (answer === currentQuestion.correctAnswer) {
      setIsCorrectAnswer(true);
      setMessage("Correct! The video will continue.");
      setOpenDialog(false);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsPaused(false);
        videoRef.current.play();
      }
    } else {
      setIsCorrectAnswer(false);
      setMessage("Incorrect! The video will restart.");
      setOpenDialog(false);
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const lectures = [
    { id: 1, title: 'Lecture 1', videoUrl: ReactLecture1 },
    { id: 2, title: 'Lecture 2', videoUrl: ReactLecture2 },
    { id: 3, title: 'Lecture 3', videoUrl: ReactLecture2 },
    { id: 4, title: 'Lecture 4', videoUrl: ReactLecture2 },
  ];

  const selectedLectureData = lectures.find(lecture => lecture.id === selectedLecture);

  return (
    <StudentLayout>
      <div style={{ margin: 20 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Typography variant='h3'>
              SQL Course
            </Typography>
            <br />
            <Typography variant="h6" gutterBottom>Select Lecture</Typography>
            <FormControl fullWidth>
              <InputLabel id="lecture-select-label">Select Lecture</InputLabel>
              <Select
                labelId="lecture-select-label"
                id="lecture-select"
                value={selectedLecture || ''}
                onChange={handleLectureChange}
                label="Select Lecture"
                fullWidth
              >
                {lectures.map(lecture => (
                  <MenuItem key={lecture.id} value={lecture.id}>
                    {lecture.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedLectureData && (
              <Box mt={3}>
                <Typography variant="h6">Now Playing: {selectedLectureData.title}</Typography>
                <video
                  ref={videoRef}
                  width="100%"
                  height="400px"
                  controls
                  autoPlay
                  onTimeUpdate={handleVideoTimeUpdate}
                >
                  <source src={selectedLectureData.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Box>
            )}

            {!selectedLecture && (
              <Typography variant="body1" mt={2}>
                Please select a lecture to view content.
              </Typography>
            )}
          </Grid>
        </Grid>

        {/* Dialog for questions */}
        {selectedLecture && openDialog && (
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} aria-labelledby="question-dialog-title">
            <DialogTitle id="question-dialog-title">{getQuestions()[currentQuestionIndex]?.question}</DialogTitle>
            <DialogContent>
              <Box textAlign="center">
                {getQuestions()[currentQuestionIndex]?.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(option.charAt(0))}
                    variant="contained"
                    color={index === 0 ? "primary" : index === 1 ? "secondary" : index === 2 ? "default" : "error"}
                    style={{ margin: 5 }}
                  >
                    {option}
                  </Button>
                ))}
              </Box>
            </DialogContent>
          </Dialog>
        )}

        {message && (
          <Box mt={3} textAlign="center">
            <Typography variant="body1" color={isCorrectAnswer ? "green" : "red"}>
              {message}
            </Typography>
          </Box>
        )}

        {/* Quiz Section */}
        <Box p={4}>
          <Button
            size="large"
            variant="contained"
            sx={{ mb: "15px" }}
            onClick={() => setOpenQuiz(true)} // Corrected event handler
          >
            Start Quiz
          </Button>

          {openQuiz && (
            <div>
              {questions.map((question) => (
                <Box key={question.id} mb={3} sx={{ border: "1px solid black" }}>
                  <Box m={3}>
                    <Typography variant="h6">{`${question.id}. `} {question.question}</Typography>
                    <Grid container direction="column" spacing={1}>
                      {question.options.map((option, index) => (
                        <Grid item key={index}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={answers[`question${question.id}`] === option}
                                onChange={(e) => handleCheckboxChange(e, `question${question.id}`)}
                                value={option}
                              />
                            }
                            label={option}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
              ))}
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
              {resultMessage && (
                <Box mt={3}>
                  <Typography variant="h6">Your Response has been submitted</Typography>
                </Box>
              )}
            </div>
          )}
        </Box>
      </div>
    </StudentLayout>
  );
}

export default SqlCourse;
