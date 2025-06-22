import React, { useState, useRef, useEffect } from "react";
import { LuChevronDown, LuPin, LuPinOff, LuSparkles } from "react-icons/lu";
import AIResponsePreview from './AIResponsePreview';

const QuestionCard = ({
  question,
  answer,
  onLearnMore,
  isPinned,
  onTogglePin,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isExpanded) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(contentHeight + 10); // extra padding
    } else {
      setHeight(0);
    }
  }, [isExpanded]);

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 mb-4 transition-all border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-start">
        <h3 className="text-base font-semibold text-gray-900">{question}</h3>
        <div className="flex gap-2">
          <button
            onClick={onTogglePin}
            className="text-gray-400 hover:text-yellow-500"
            title={isPinned ? "Unpin" : "Pin"}
          >
            {isPinned ? <LuPin /> : <LuPinOff />}
          </button>
          <button
            onClick={toggleExpand}
            className={`transition-transform ${
              isExpanded ? "rotate-180" : ""
            } text-gray-400 hover:text-black`}
            title="Toggle Answer"
          >
            <LuChevronDown />
          </button>
        </div>
      </div>

      {/* Expandable content */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ height }}
      >
        <div ref={contentRef} className="pt-3 text-sm text-gray-700">
  <AIResponsePreview content={answer} />
          <div className="mt-4 flex justify-end">
            <button
              onClick={onLearnMore}
              className="inline-flex items-center gap-2 text-sm text-gray-800 hover:text-white hover:bg-black px-4 py-2 rounded-full transition"
            >
              <LuSparkles className="w-4 h-4" />
              Learn Concept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
