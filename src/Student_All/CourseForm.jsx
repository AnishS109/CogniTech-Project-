import React, { useState } from 'react';
import { TextField, Button, Box, Grid, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Typography } from '@mui/material';

// Component to handle the form input
function CourseForm() {
  const [courseData, setCourseData] = useState({
    course_name: '',
    description: '',
    lectures: [
      {
        lectureName: '',
        videoUrl: '',
        questions: [
          {
            question: '',
            options: ['', '', '', ''],
            correctAnswer: '',
            time: ''
          }
        ],
        popMessage: '',
        messageTime: ''
      }
    ]
  });

  // Handle changes in the course details
  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  // Handle changes in lecture details
  const handleLectureChange = (index, e) => {
    const { name, value } = e.target;
    const updatedLectures = [...courseData.lectures];
    updatedLectures[index][name] = value;
    setCourseData(prev => ({ ...prev, lectures: updatedLectures }));
  };

  // Handle changes in questions for each lecture
  const handleQuestionChange = (lectureIndex, questionIndex, e) => {
    const { name, value } = e.target;
    const updatedLectures = [...courseData.lectures];
    updatedLectures[lectureIndex].questions[questionIndex][name] = value;
    setCourseData(prev => ({ ...prev, lectures: updatedLectures }));
  };

  // Add a new lecture
  const addLecture = () => {
    const newLecture = {
      lectureName: '',
      videoUrl: '',
      questions: [
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          time: ''
        }
      ],
      popMessage: '',
      messageTime: ''
    };
    setCourseData(prev => ({ ...prev, lectures: [...prev.lectures, newLecture] }));
  };

  // Add a new question to a lecture
  const addQuestion = (lectureIndex) => {
    const newQuestion = {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      time: ''
    };
    const updatedLectures = [...courseData.lectures];
    updatedLectures[lectureIndex].questions.push(newQuestion);
    setCourseData(prev => ({ ...prev, lectures: updatedLectures }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(courseData);
    
    try {
      const response = await fetch("http://localhost:5001/api/add-course/courses-add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Fixed this header
        },
        body: JSON.stringify(courseData), // Correctly stringifying the body
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Course created successfully:", result);
        // Optionally, reset the form or show a success message
      } else {
        const error = await response.json();
        console.error("Error creating course:", error.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create Course
      </Typography>

      {/* Course Information */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Course Name"
            variant="outlined"
            fullWidth
            value={courseData.course_name}
            name="course_name"
            onChange={handleCourseChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Course Description"
            variant="outlined"
            fullWidth
            value={courseData.description}
            name="description"
            onChange={handleCourseChange}
            multiline
            rows={4}
          />
        </Grid>
      </Grid>

      {/* Lectures Section */}
      <Typography variant="h6" sx={{ marginTop: 4 }}>
        Lectures
      </Typography>
      {courseData.lectures.map((lecture, lectureIndex) => (
        <Box key={lectureIndex} sx={{ marginBottom: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Lecture Name"
                variant="outlined"
                fullWidth
                value={lecture.lectureName}
                name="lectureName"
                onChange={(e) => handleLectureChange(lectureIndex, e)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Video URL"
                variant="outlined"
                fullWidth
                value={lecture.videoUrl}
                name="videoUrl"
                onChange={(e) => handleLectureChange(lectureIndex, e)}
              />
            </Grid>
          </Grid>

          {/* Questions Section */}
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            Questions for this Lecture:
          </Typography>
          {lecture.questions.map((question, questionIndex) => (
            <Box key={questionIndex} sx={{ marginTop: 2, border: '1px solid #ccc', padding: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Question"
                    variant="outlined"
                    fullWidth
                    value={question.question}
                    name="question"
                    onChange={(e) => handleQuestionChange(lectureIndex, questionIndex, e)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Options (comma-separated)"
                    variant="outlined"
                    fullWidth
                    value={question.options.join(', ')}
                    name="options"
                    onChange={(e) => {
                      const options = e.target.value.split(',').map(opt => opt.trim());
                      const updatedLectures = [...courseData.lectures];
                      updatedLectures[lectureIndex].questions[questionIndex].options = options;
                      setCourseData(prev => ({ ...prev, lectures: updatedLectures }));
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Correct Answer"
                    variant="outlined"
                    fullWidth
                    value={question.correctAnswer}
                    name="correctAnswer"
                    onChange={(e) => handleQuestionChange(lectureIndex, questionIndex, e)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Time (in seconds)"
                    variant="outlined"
                    fullWidth
                    value={question.time}
                    name="time"
                    onChange={(e) => handleQuestionChange(lectureIndex, questionIndex, e)}
                    type="number"
                  />
                </Grid>
              </Grid>
            </Box>
          ))}

          {/* Add Question Button */}
          <Button variant="outlined" onClick={() => addQuestion(lectureIndex)} sx={{ mt: 2 }}>
            Add Question
          </Button>

          {/* Pop-up Message for Lecture */}
          <TextField
            label="Pop-up Message"
            variant="outlined"
            fullWidth
            value={lecture.popMessage}
            name="popMessage"
            onChange={(e) => handleLectureChange(lectureIndex, e)}
            sx={{ marginTop: 2 }}
          />
          <TextField
            label="Pop-up Message Time (seconds)"
            variant="outlined"
            fullWidth
            value={lecture.messageTime}
            name="messageTime"
            onChange={(e) => handleLectureChange(lectureIndex, e)}
            type="number"
            sx={{ marginTop: 2 }}
          />
        </Box>
      ))}

      {/* Add Lecture Button */}
      <Button variant="outlined" onClick={addLecture} sx={{ mt: 3 }}>
        Add Lecture
      </Button>

      {/* Submit Button */}
      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 3 }}>
        Submit Course
      </Button>
    </Box>
  );
}

export default CourseForm;
