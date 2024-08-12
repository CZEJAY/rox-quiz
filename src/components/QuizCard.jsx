import React from 'react'

const QuizCard = ({item, index, answers, handleAnswerSelect = ({id, option}) => {}}) => {
    // console.log({item})
    return (
        <div
            className="m-3 py-3 px-4 shadow-sm border border-gray-200 rounded "
        >
            <div className="flex items-center rounded text-xs p-2 cursor-pointer">
                <span className="h-8 w-8 bg-[#FCC822] rounded-full flex justify-center items-center text-green-800 mr-3">
                    {index + 1}
                </span>
                <p className="">{item.question || ""}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-5">
                {item.options.map((option, index) => (
                    <div
                        className={`border border-gray-200 rounded text-xs p-2 cursor-pointer ${answers[item.id] === option ? "bg-gray-300" : ""
                            }`}
                        key={option}
                        onClick={() => handleAnswerSelect({id: item.id, option})}
                    >
                        <p className="text-[10px] mb-1">Option {index + 1}</p>
                        <p>{option || ""}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default QuizCard