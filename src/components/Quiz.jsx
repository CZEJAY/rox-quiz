import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizHeader from "./QuizHeader";
import QuizCard from "./QuizCard";

const Loading = () => (
  <div className="h-[220px] w-[220px] mx-auto mt-8 flex flex-col justify-center items-center border-2 rounded-tr-[50%] rounded-bl-[50%]">
    <p className="text-xl text-gray-500">Loading...</p>
  </div>
);

// Utility function to format time
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const Quiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [timerIntervalId, setTimerIntervalId] = useState(null);
  const [status, setStatus] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("/quiz.json")
      .then((response) => response.json())
      .then((data) => {
        const shuffledQuestions = shuffleArray(data)
        setQuestions(shuffledQuestions)
      })
      .catch((error) => console.error("Error fetching quiz data:", error));

    // Set up the timer interval
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(intervalId);
          setShowResult(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    setTimerIntervalId(intervalId);

    return () => clearInterval(intervalId);
  }, []);

  const handleAnswerSelect = (questionId, selectedOption) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: selectedOption }));
  };

  const handleSubmit = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(true);

    clearInterval(timerIntervalId);

    // Calculate score and show result
    setTimeout(() => {
      const quizScore = calculateScore(answers);
      setScore(quizScore);
      const percentage = (quizScore / questions.length) * 100;
      setStatus(percentage >= 50 ? "Passed" : "Failed");
      setShowResult(true);
      setLoading(false);
    }, 500);
  };

  const calculateScore = (userAnswers) => {
    return questions.reduce((score, question, index) => 
      userAnswers[question.id] === question.answer ? score + 1 : score, 0);
  };

  const restartQuiz = () => {
    setAnswers({});
    setScore(0);
    setCurrentIndex(0);
    setShowResult(false);
    setLoading(false);
    setTimer(60);
    navigate("/quiz");
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section>
      <QuizHeader timer={timer} />
      <div className="md:w-9/12 w-[90%] flex md:flex-row flex-col mx-auto">
        {/* Question section */}
        <div className="md:w-[70%] w-full">
          <div>
            {questions.length > 0 && 
              <QuizCard 
                item={questions[currentIndex]} 
                index={currentIndex} 
                answers={answers} 
                handleAnswerSelect={({ id, option }) => handleAnswerSelect(id, option)} 
              />
            }
            <div className="flex w-full items-center justify-between">
              {currentIndex > 0 && 
                <button onClick={handlePrev} className="text-yellow-300 px-2 py-2 border rounded">Previous</button>
              }
              <button onClick={currentIndex >= questions.length - 1 ? handleSubmit : handleNext} className="bg-[#FCC822] ml-auto px-4 py-2 text-white rounded">
                {currentIndex === questions.length - 1 ? "Submit" : "Next"}
              </button>
            </div>
          </div>
        </div>

        {/* Result section */}
        <div className="md:w-[30%] w-full p-4">
          {showResult && (
            <div>
              <h3 className="text-2xl font-medium">Your Score: </h3>
              <div className="h-[220px] w-[220px] mx-auto mt-8 flex flex-col justify-center items-center border-2 rounded-tr-[50%] rounded-bl-[50%]">
                <h3 className={`text-xl ${status === "Passed" ? "text-green-800" : "text-red-500"}`}>
                  {status}
                </h3>
                <h1 className="text-3xl font-bold my-2">
                  {score * 10}
                  <span className="text-slate-800">/60</span>
                </h1>
                <p className="text-sm flex justify-center items-center gap-2">
                  Total Time:{" "}
                  <span className="text-xl text-orange-500">
                    {formatTime(60 - timer)}
                    <span className="text-xs">sec</span>
                  </span>
                </p>
              </div>
              <button
                onClick={restartQuiz}
                className="bg-[#FCC822] text-white w-full py-2 rounded mt-16"
              >
                Restart
              </button>
            </div>
          )}

          {loading && <Loading />}
        </div>
      </div>
    </section>
  );
};

export default Quiz;
