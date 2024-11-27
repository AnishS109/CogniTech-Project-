


import React, { useState, useEffect, useRef } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Typography, Box, Grid, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import StudentLayout from '../LAYOUT/StudentLayout';
import { useLocation } from 'react-router-dom';

function ViewCourse() {
  const [courseData, setCourseData] = useState(null); // To store course data fetched from API
  const [selectedLecture, setSelectedLecture] = useState(null); // Currently selected lecture
  const [questions, setQuestions] = useState([]); // To store the questions for the selected lecture
  const [isPaused, setIsPaused] = useState(false);
  const [videoTime, setVideoTime] = useState(0);
  const [message, setMessage] = useState("");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const videoRef = useRef(null);

  const location = useLocation();
  const course_id = location.state?.course_id;

  // Fetch the course data based on course_id from the URL state
  useEffect(() => {
    if (course_id) {
      const fetchCourseData = async () => {
        try {
          const response = await fetch(`http://localhost:5001/api/router/course/${course_id}`);
          const data = await response.json();
          setCourseData(data);
        } catch (error) {
          console.error('Error fetching course data:', error);
        }
      };

      fetchCourseData();
    }
  }, [course_id]);

  // Fetch questions for the selected lecture
  useEffect(() => {
    if (selectedLecture) {
      const fetchQuestions = async () => {
        try {
          const response = await fetch(`http://localhost:5001/api/router/lecture/${selectedLecture}/questions`);
          const data = await response.json();
          setQuestions(data);
        } catch (error) {
          console.error('Error fetching questions:', error);
        }
      };

      fetchQuestions();
    }
  }, [selectedLecture]);

  // Handle lecture change and reset all state values
  const handleLectureChange = (event) => {
    setSelectedLecture(event.target.value); // Update selected lecture
    setVideoTime(0); // Reset video time
    setIsPaused(false); // Allow video to play
    setOpenDialog(false); // Close any open dialogs
    setMessage(""); // Reset message
    setCurrentQuestionIndex(0); // Reset question index
  };

  // Handle the video time update and check for questions to display
  const handleVideoTimeUpdate = () => {
    const currentTime = videoRef.current.currentTime;
    setVideoTime(currentTime);

    console.log('Current Time:', currentTime);

    // Check for the question that matches the current time
    const nextQuestion = questions.find((q) => {
      const questionTime = q.time;
      return currentTime >= questionTime && currentTime < questionTime + 1 && q.id === currentQuestionIndex + 1;
    });

    // If a question is found and it hasn't been displayed yet, show the question in a dialog
    if (nextQuestion && !isPaused) {
      setOpenDialog(true);
      videoRef.current.pause(); // Pause the video when the question appears
      setIsPaused(true); // Set paused state to true to avoid repeating the same question
    }
  };

  // Handle answer selection for questions
  const handleAnswer = (answer) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    setMessage(isCorrect ? "Correct!" : "Incorrect!");
    setOpenDialog(false); // Close the dialog after answering

    if (isCorrect && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1); // Move to next question
      setIsPaused(false); // Resume video play
      videoRef.current.play();
    } else {
      videoRef.current.currentTime = 0; // Reset video time if all questions are answered
      videoRef.current.play(); // Play the video again
    }
  };

  const selectedLectureData = courseData?.lectures?.find(lecture => lecture._id === selectedLecture);

  return (
    <StudentLayout>
      <div style={{ margin: 20 }}>
        {courseData ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Typography variant='h3'>{courseData.course_name}</Typography>
              <Typography variant="h5" gutterBottom>{courseData.description}</Typography>

              <br />
              <Typography variant="h5" gutterBottom>Select Lecture</Typography>
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
                  {courseData.lectures.map((lecture) => (
                    <MenuItem key={lecture._id} value={lecture._id}>
                      {lecture.lectureName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedLectureData && (
                <Box mt={3}>
                  <Typography variant="h6">Now Playing: {selectedLectureData.lectureName}</Typography>
                  <video
                    ref={videoRef}
                    width="100%"
                    height="400vh"
                    controls
                    autoPlay
                    onTimeUpdate={handleVideoTimeUpdate}
                    onPlay={() => setIsVideoPlaying(true)}
                    onCanPlay={() => {
                      if (!isVideoPlaying && selectedLectureData) {
                        videoRef.current.play();
                        setIsVideoPlaying(true);
                      }
                    }}
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
        ) : (
          <Typography variant="body1">Loading course data...</Typography>
        )}

        {/* Dialog for question pop-up */}
        {selectedLecture && openDialog && (
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} aria-labelledby="question-dialog-title">
            <DialogTitle id="question-dialog-title">{questions[currentQuestionIndex]?.question}</DialogTitle>
            <DialogContent>
              <Box textAlign="center">
                {questions[currentQuestionIndex]?.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(option.charAt(0))}
                    variant="contained"
                    color="primary"
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
            <Typography variant="body1" color={message === "Correct!" ? "green" : "red"}>
              {message}
            </Typography>
          </Box>
        )}
      </div>
    </StudentLayout>
  );
}

export default ViewCourse;
