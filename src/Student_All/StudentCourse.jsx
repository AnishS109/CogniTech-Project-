import React, { useEffect, useState } from 'react';
import StudentLayout from './LAYOUT/StudentLayout';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const StudentEnrolledCourse = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const studentIdFromLocation = location.state?.student_id;
  const studentId = studentIdFromLocation || localStorage.getItem('student_id');

  const apiKey = 'http://localhost:5000/api/student-enrolled/student-course';  

  useEffect(() => {
    if (!studentId) {
      setError("Student ID is missing.");
      setLoading(false);
      return;
    }

    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/student-enrolled/student-course`, {
          params: {
            student_id: studentId
          },
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        });

        if (response.data.enrolled_courses) {
          setEnrolledCourses(response.data.enrolled_courses);
        } else {
          setError("No courses found for this student.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch enrolled courses", err);
        setError("Failed to fetch enrolled courses.");
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [studentId]);

  return (
    <StudentLayout>
      <h1>Student Enrolled Courses</h1>

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && enrolledCourses.length > 0 && (
        <div>
          {enrolledCourses.map((course) => (
            <div key={course.course_id} className="course-item">
              <h3>{course.name}</h3>
              <p><strong>Description:</strong> {course.description}</p>
              <p><strong>Lecture Count:</strong> {course.lecture}</p>
              <p><strong>Quiz Count:</strong> {course.quiz}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && enrolledCourses.length === 0 && (
        <p>No courses found for this student.</p>
      )}
    </StudentLayout>
  );
};

export default StudentEnrolledCourse;
